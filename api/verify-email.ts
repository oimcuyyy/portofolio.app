import type { IncomingMessage, ServerResponse } from 'node:http';
import { resolveMx } from 'node:dns/promises';

const DISPOSABLE_OR_FAKE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  'guerrillamail.com',
  'guerrillamail.org',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.de',
  'sharklasers.com',
  'grr.la',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  '10minutemail.com',
  '10minutemail.net',
  '10minmail.com',
  'trashmail.com',
  'trashmail.net',
  'throwawaymail.com',
  'getnada.com',
  'nada.email',
  'maildrop.cc',
  'dispostable.com',
  'mohmal.com',
  'emailondeck.com',
  'burnermail.io',
  'fakemailgenerator.com',
  'fakeinbox.com',
  'mailnesia.com',
  'mintemail.com',
  'mytemp.email',
  'tempinbox.com',
  'harakirimail.com',
  'discard.email',
  'spamgourmet.com',
  'mailcatch.com',
  'inboxbear.com',
  'dropmail.me',
  'moakt.com',
  'crazymailing.com',
  'mailsac.com',
  'tempr.email',
  'mailtemp.net',
  'wegwerfmail.de',
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'test.org',
  'test.net',
  'fake.com',
  'palsu.com',
  'domain.com',
  'email.com',
  'invalid.com',
  'localhost',
  'asd.com',
  'abc.com',
  'xyz.xyz',
]);

const RESERVED_TLDS = new Set(['local', 'localhost', 'test', 'invalid', 'example', 'internal', 'arpa', 'onion']);
const DNS_HOSTNAME_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

// Lightweight per-container sliding window throttle
const ipWindowMap = new Map<string, { count: number; resetAt: number }>();

function sendJson(res: ServerResponse, statusCode: number, payload: Record<string, unknown>) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown> | null> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    let size = 0;

    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > 1024) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      raw += chunk.toString('utf8');
    });

    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw) as Record<string, unknown>);
      } catch {
        resolve(null);
      }
    });

    req.on('error', () => reject(new Error('READ_ERROR')));
  });
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipWindowMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipWindowMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 25) {
    return true;
  }
  entry.count += 1;
  return false;
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { valid: false, reason: 'Method tidak diizinkan.' });
    return;
  }

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket?.remoteAddress || 'unknown';

  if (isRateLimited(clientIp)) {
    sendJson(res, 429, {
      valid: false,
      reason: 'Terlalu banyak permintaan pengecekan email. Coba beberapa saat lagi.',
    });
    return;
  }

  let body: Record<string, unknown> | null;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    if (err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE') {
      sendJson(res, 413, { valid: false, reason: 'Ukuran payload melebihi batas.' });
      return;
    }
    sendJson(res, 400, { valid: false, reason: 'Permintaan tidak valid.' });
    return;
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || email.length > 120 || !email.includes('@')) {
    sendJson(res, 400, { valid: false, reason: 'Format alamat email tidak valid.' });
    return;
  }

  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    sendJson(res, 400, { valid: false, reason: 'Format alamat email tidak valid.' });
    return;
  }

  const domain = parts[1];
  if (domain.length > 253 || !DNS_HOSTNAME_REGEX.test(domain)) {
    sendJson(res, 400, {
      valid: false,
      reason: `Domain email "${domain}" tidak memiliki format hostname yang valid.`,
    });
    return;
  }

  const tld = domain.split('.').pop() || '';
  if (RESERVED_TLDS.has(tld) || tld.length < 2) {
    sendJson(res, 400, {
      valid: false,
      reason: `Domain email ".${tld}" tidak dapat digunakan untuk pengiriman email nyata.`,
    });
    return;
  }

  if (DISPOSABLE_OR_FAKE_DOMAINS.has(domain)) {
    sendJson(res, 400, {
      valid: false,
      reason: `Domain "${domain}" terdeteksi sebagai email sementara/fiktif. Gunakan email pribadi atau kantor yang aktif.`,
    });
    return;
  }

  // Verify active MX records via public DNS with DoH backup
  try {
    const mxRecords = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('DNS_TIMEOUT')), 2500)
      ),
    ]);

    // Check RFC 7505 Null MX ("." or empty exchange)
    const activeMx = mxRecords.filter(
      (rec) => rec.exchange && rec.exchange.trim() !== '' && rec.exchange.trim() !== '.'
    );

    if (activeMx.length === 0) {
      sendJson(res, 200, {
        valid: false,
        mxVerified: false,
        reason: `Domain "${domain}" tidak memiliki server email aktif (MX record kosong). Pastikan alamat email benar dan sudah dibuat.`,
      });
      return;
    }

    sendJson(res, 200, {
      valid: true,
      mxVerified: true,
      domain,
    });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    const message = err instanceof Error ? err.message : '';

    // Definitive non-existent domain or missing MX record
    if (code === 'ENOTFOUND' || code === 'ENODATA' || code === 'NODATA' || code === 'NXDOMAIN') {
      sendJson(res, 200, {
        valid: false,
        mxVerified: false,
        reason: `Domain "${domain}" tidak terdaftar atau tidak dapat menerima email. Periksa kembali ejaan email Anda.`,
      });
      return;
    }

    // Fallback to Google DNS-over-HTTPS if local UDP/TCP DNS timed out or was refused
    if (message === 'DNS_TIMEOUT' || code === 'ETIMEOUT' || code === 'ECONNREFUSED' || code === 'ESERVFAIL') {
      try {
        const controller = new AbortController();
        const dohTimer = setTimeout(() => controller.abort(), 2500);
        const dohRes = await fetch(
          `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`,
          { signal: controller.signal }
        );
        clearTimeout(dohTimer);

        if (dohRes.ok) {
          const doh = (await dohRes.json()) as { Status?: number; Answer?: Array<{ data?: string }> };
          const hasValidMx = Array.isArray(doh.Answer) && doh.Answer.some((a) => a.data && !a.data.endsWith(' .'));
          if (doh.Status === 3 || !hasValidMx) {
            sendJson(res, 200, {
              valid: false,
              mxVerified: false,
              reason: `Domain "${domain}" tidak terdaftar atau tidak memiliki server email aktif (MX record kosong).`,
            });
            return;
          }
          sendJson(res, 200, { valid: true, mxVerified: true, domain });
          return;
        }
      } catch {
        // Fall through to fail-open on total network isolation
      }
    }

    // Total DNS unavailability (network offline/isolated): fail-open gracefully after syntax & blocklist passed
    sendJson(res, 200, {
      valid: true,
      mxVerified: false,
      warning: 'dns_unavailable',
    });
  }
}
