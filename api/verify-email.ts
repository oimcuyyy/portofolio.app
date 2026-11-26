import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  sendJson,
  extractClientIp,
  checkMemoryRateLimit,
  readJsonBody,
  type RateLimitEntry,
} from './_lib/httpSecurity.ts';
import { verifyEmailOnServer } from './_lib/emailVerification.ts';

const ipRateMap = new Map<string, RateLimitEntry>();

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { valid: false, reason: 'Method tidak diizinkan.' });
    return;
  }

  const clientIp = extractClientIp(req);
  const rate = checkMemoryRateLimit(ipRateMap, clientIp, 25, 60_000);
  if (!rate.allowed) {
    sendJson(res, 429, {
      valid: false,
      reason: 'Terlalu banyak permintaan pengecekan email. Coba beberapa saat lagi.',
    });
    return;
  }

  let body: Record<string, unknown> | null;
  try {
    body = await readJsonBody(req, 1024);
  } catch (err) {
    if (err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE') {
      sendJson(res, 413, { valid: false, reason: 'Ukuran payload melebihi batas.' });
      return;
    }
    sendJson(res, 400, { valid: false, reason: 'Permintaan tidak valid.' });
    return;
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const result = await verifyEmailOnServer(email);

  if (!result.valid) {
    sendJson(res, 200, {
      valid: false,
      mxVerified: false,
      reason: result.reason,
      suggestion: result.suggestion,
    });
    return;
  }

  sendJson(res, 200, {
    valid: true,
    mxVerified: Boolean(result.mxVerified),
    warning: result.warning,
  });
}
