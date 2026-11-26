import type { IncomingMessage, ServerResponse } from 'node:http';

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const MAX_MAP_SIZE = 2000;

/**
 * Sends a structured JSON response with strict security headers.
 */
export function sendJson(
  res: ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>
): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
}

/**
 * Safely extracts the authoritative client IP from Vercel / reverse-proxy headers.
 * Prioritizes Vercel-controlled edge headers before x-forwarded-for.
 */
export function extractClientIp(req: IncomingMessage): string {
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
 * Bounded per-IP sliding window rate limiter with automatic expired-entry pruning.
 */
export function checkMemoryRateLimit(
  store: Map<string, RateLimitEntry>,
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; remainingSecs?: number } {
  const now = Date.now();

  // Prune expired entries when store grows to prevent unbounded memory growth
  if (store.size >= MAX_MAP_SIZE) {
    for (const [k, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(k);
      }
    }
    // If still above threshold, drop oldest entries (FIFO Map insertion order)
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
 */
export async function readJsonBody(
  req: IncomingMessage & { body?: unknown },
  maxBytes = 8192
): Promise<Record<string, unknown> | null> {
  if (req.body !== undefined) {
    if (typeof req.body === 'object' && req.body !== null && !Buffer.isBuffer(req.body)) {
      return req.body as Record<string, unknown>;
    }
    if (typeof req.body === 'string') {
      if (Buffer.byteLength(req.body, 'utf8') > maxBytes) {
        throw new Error('PAYLOAD_TOO_LARGE');
      }
      if (!req.body.trim()) return {};
      try {
        const parsed = JSON.parse(req.body);
        return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null;
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
        return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null;
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

    req.on('data', (chunk: Buffer) => {
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
        resolve(typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null);
      } catch {
        resolve(null);
      }
    });

    req.on('error', () => reject(new Error('READ_ERROR')));
  });
}

/**
 * Inserts a row into Supabase PostgREST using the server-side service_role key.
 */
export async function insertSupabaseServiceRow(
  table: 'messages' | 'security_logs',
  row: Record<string, unknown>
): Promise<{ ok: boolean; status: number; errorMessage?: string }> {
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
