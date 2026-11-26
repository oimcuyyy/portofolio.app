// @ts-check

/** @typedef {{ count: number; resetAt: number }} RateLimitEntry */

const MAX_MAP_SIZE = 2000;

/**
 * Sends a structured JSON response with strict security headers.
 * @param {import('node:http').ServerResponse} res
 * @param {number} statusCode
 * @param {Record<string, unknown>} payload
 */
export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
}

/**
 * Safely extracts the authoritative client IP from Vercel / reverse-proxy headers.
 * @param {import('node:http').IncomingMessage} req
 * @returns {string}
 */
export function extractClientIp(req) {
  const vercelIp = req.headers['x-vercel-forwarded-for'];
  if (typeof vercelIp === 'string' && vercelIp.trim()) {
    return vercelIp.split(',')[0].trim().slice(0, 64);
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.split(',')[0].trim().slice(0, 64);
  }

  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim().slice(0, 64);
  }

  return (req.socket?.remoteAddress || 'unknown').slice(0, 64);
}

/**
 * Bounded per-key sliding window rate limiter with automatic expired-entry pruning.
 * @param {Map<string, RateLimitEntry>} store
 * @param {string} key
 * @param {number} maxAttempts
 * @param {number} windowMs
 * @returns {{ allowed: boolean; remainingSecs?: number }}
 */
export function checkMemoryRateLimit(store, key, maxAttempts, windowMs) {
  const now = Date.now();

  if (store.size >= MAX_MAP_SIZE) {
    for (const [k, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(k);
      }
    }
    if (store.size >= MAX_MAP_SIZE) {
      const oldestKey = store.keys().next().value;
      if (oldestKey !== undefined) {
        store.delete(oldestKey);
      }
    }
  }

  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    const remainingSecs = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: false, remainingSecs };
  }

  entry.count += 1;
  return { allowed: true };
}

/**
 * Parses JSON request body safely without hanging on pre-parsed text/plain strings or ended streams.
 * @param {import('node:http').IncomingMessage & { body?: unknown }} req
 * @param {number} [maxBytes]
 * @returns {Promise<Record<string, unknown> | null>}
 */
export async function readJsonBody(req, maxBytes = 8192) {
  if (req.body !== undefined) {
    if (typeof req.body === 'object' && req.body !== null && !Buffer.isBuffer(req.body)) {
      return /** @type {Record<string, unknown>} */ (req.body);
    }
    if (typeof req.body === 'string') {
      if (Buffer.byteLength(req.body, 'utf8') > maxBytes) {
        throw new Error('PAYLOAD_TOO_LARGE');
      }
      if (!req.body.trim()) return {};
      try {
        const parsed = JSON.parse(req.body);
        return typeof parsed === 'object' && parsed !== null
          ? /** @type {Record<string, unknown>} */ (parsed)
          : null;
      } catch {
        return null;
      }
    }
    if (Buffer.isBuffer(req.body)) {
      if (req.body.length > maxBytes) {
        throw new Error('PAYLOAD_TOO_LARGE');
      }
      try {
        const parsed = JSON.parse(req.body.toString('utf8'));
        return typeof parsed === 'object' && parsed !== null
          ? /** @type {Record<string, unknown>} */ (parsed)
          : null;
      } catch {
        return null;
      }
    }
  }

  if (req.readableEnded) {
    return {};
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    let size = 0;

    req.on('data', (/** @type {Buffer} */ chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      raw += chunk.toString('utf8');
    });

    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        resolve(
          typeof parsed === 'object' && parsed !== null
            ? /** @type {Record<string, unknown>} */ (parsed)
            : null
        );
      } catch {
        resolve(null);
      }
    });

    req.on('error', () => reject(new Error('READ_ERROR')));
  });
}

/**
 * Inserts a row into Supabase PostgREST using the server-side service_role key.
 * @param {'messages' | 'security_logs'} table
 * @param {Record<string, unknown>} row
 * @returns {Promise<{ ok: boolean; status: number; errorMessage?: string }>}
 */
export async function insertSupabaseServiceRow(table, row) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceKey) {
    return {
      ok: false,
      status: 503,
      errorMessage: 'SERVICE_NOT_CONFIGURED',
    };
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/${table}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      let errText = '';
      try {
        errText = await response.text();
      } catch {
        errText = '';
      }
      return {
        ok: false,
        status: response.status,
        errorMessage: errText,
      };
    }

    return { ok: true, status: response.status };
  } catch {
    clearTimeout(timer);
    return { ok: false, status: 502, errorMessage: 'UPSTREAM_ERROR' };
  }
}
