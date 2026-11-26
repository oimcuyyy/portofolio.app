// @ts-check
import {
  sendJson,
  extractClientIp,
  checkMemoryRateLimit,
  readJsonBody,
  insertSupabaseServiceRow,
} from './_lib/httpSecurity.mjs';
import { verifyEmailOnServer } from './_lib/emailVerification.mjs';
import { inspectServerPayload, logServerSecurityIncident } from './_lib/wafServer.mjs';
import { verifyOtpChallenge } from './_lib/otpSecurity.mjs';

/** @type {Map<string, import('./_lib/httpSecurity.mjs').RateLimitEntry>} */
const contactIpRateMap = new Map();

/**
 * @param {import('node:http').IncomingMessage & { body?: unknown }} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED', message: 'Method tidak diizinkan.' });
    return;
  }

  const clientIp = extractClientIp(req);
  const rate = checkMemoryRateLimit(contactIpRateMap, clientIp, 5, 5 * 60_000);
  if (!rate.allowed) {
    sendJson(res, 429, {
      ok: false,
      code: 'RATE_LIMITED',
      message: `Terlalu banyak percobaan pengiriman pesan dari jaringan Anda. Coba lagi dalam ${rate.remainingSecs} detik.`,
    });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req, 16384);
  } catch (err) {
    if (err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE') {
      sendJson(res, 413, { ok: false, code: 'PAYLOAD_TOO_LARGE', message: 'Ukuran pesan melebihi batas.' });
      return;
    }
    sendJson(res, 400, { ok: false, code: 'INVALID_BODY', message: 'Format permintaan tidak valid.' });
    return;
  }

  if (!body) {
    sendJson(res, 400, { ok: false, code: 'INVALID_JSON', message: 'Data formulir tidak valid.' });
    return;
  }

  const rawName = typeof body.name === 'string' ? body.name : '';
  const rawEmail = typeof body.email === 'string' ? body.email : '';
  const rawMessage = typeof body.message === 'string' ? body.message : '';
  const rawOtpCode = typeof body.otpCode === 'string' ? body.otpCode : '';
  const rawOtpToken = typeof body.otpToken === 'string' ? body.otpToken : '';

  // Server-side WAF inspection (prevents cURL / REST API bypass of client checks)
  const checks = [
    { label: 'Nama Pengirim', raw: rawName, check: inspectServerPayload(rawName, 'Nama') },
    { label: 'Alamat Email', raw: rawEmail, check: inspectServerPayload(rawEmail, 'Email') },
    { label: 'Isi Pesan', raw: rawMessage, check: inspectServerPayload(rawMessage, 'Pesan') },
  ];

  for (const item of checks) {
    if (!item.check.isSafe) {
      await logServerSecurityIncident({
        req,
        clientIp,
        threatType: item.check.threatType || 'XSS Injection',
        fieldName: item.label,
        rawPayload: item.raw,
      });

      sendJson(res, 422, {
        ok: false,
        code: 'WAF_BLOCKED',
        threatType: item.check.threatType || 'XSS Injection',
        fieldName: item.label,
        message: item.check.reason || 'Input terdeteksi mengandung skrip berbahaya.',
      });
      return;
    }
  }

  const cleanName = checks[0].check.sanitized.slice(0, 100);
  const cleanEmail = checks[1].check.sanitized.slice(0, 120).toLowerCase();
  const cleanMessage = checks[2].check.sanitized.slice(0, 2000);

  if (cleanName.length < 2) {
    sendJson(res, 422, {
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Mohon masukkan nama lengkap Anda (minimal 2 karakter).',
    });
    return;
  }

  if (cleanMessage.length < 3) {
    sendJson(res, 422, {
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Mohon tulis isi pesan kolaborasi dengan jelas.',
    });
    return;
  }

  // Server-side Email Authenticity + Provider Rules + Disposable Domain + DNS MX Check
  const emailVerify = await verifyEmailOnServer(cleanEmail);
  if (!emailVerify.valid) {
    sendJson(res, 422, {
      ok: false,
      code: 'EMAIL_INVALID',
      message: emailVerify.reason || 'Alamat email tidak valid atau belum terdaftar.',
      suggestion: emailVerify.suggestion,
    });
    return;
  }

  // Mandatory 6-Digit Email OTP Challenge Verification (blocks nonexistent fake Gmail/Yahoo addresses)
  const otpCheck = verifyOtpChallenge({
    email: cleanEmail,
    otpCode: rawOtpCode,
    otpToken: rawOtpToken,
  });

  if (!otpCheck.valid) {
    sendJson(res, 422, {
      ok: false,
      code: otpCheck.code || 'OTP_INVALID',
      message: otpCheck.message || 'Kode verifikasi email tidak valid.',
    });
    return;
  }

  const dbResult = await insertSupabaseServiceRow('messages', {
    name: cleanName,
    email: cleanEmail,
    message: cleanMessage,
  });

  if (!dbResult.ok) {
    if (dbResult.errorMessage === 'SERVICE_NOT_CONFIGURED') {
      sendJson(res, 503, {
        ok: false,
        code: 'SERVER_UNAVAILABLE',
        message: 'Layanan penerima pesan server belum aktif sepenuhnya. Silakan hubungi via Email Langsung.',
      });
      return;
    }
    if (dbResult.errorMessage && dbResult.errorMessage.includes('Rate limit exceeded')) {
      sendJson(res, 429, {
        ok: false,
        code: 'RATE_LIMITED',
        message: 'Terlalu banyak pesan dari alamat email ini dalam waktu singkat. Coba lagi dalam 5 menit.',
      });
      return;
    }
    sendJson(res, 500, {
      ok: false,
      code: 'DB_ERROR',
      message: 'Pesan gagal disimpan ke server. Silakan hubungi via Email Langsung.',
    });
    return;
  }

  sendJson(res, 201, { ok: true });
}
