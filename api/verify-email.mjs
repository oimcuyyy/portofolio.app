// @ts-check
import {
  sendJson,
  extractClientIp,
  checkMemoryRateLimit,
  readJsonBody,
} from './_lib/httpSecurity.mjs';
import { verifyEmailOnServer } from './_lib/emailVerification.mjs';

/** @type {Map<string, import('./_lib/httpSecurity.mjs').RateLimitEntry>} */
const ipRateMap = new Map();

/**
 * @param {import('node:http').IncomingMessage & { body?: unknown }} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
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

  let body;
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
