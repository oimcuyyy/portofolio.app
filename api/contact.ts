import type { IncomingMessage, ServerResponse } from 'node:http';
import crypto from 'node:crypto';
import {
  sendJson,
  extractClientIp,
  checkMemoryRateLimit,
  readJsonBody,
  insertSupabaseServiceRow,
  type RateLimitEntry,
} from './_lib/httpSecurity.ts';
import { verifyEmailOnServer } from './_lib/emailVerification.ts';
import { inspectServerPayload } from './_lib/wafServer.ts';

const contactIpRateMap = new Map<string, RateLimitEntry>();

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED', message: 'Method tidak diizinkan.' });
    return;
  }

  const clientIp = extractClientIp(req);
  const rate = checkMemoryRateLimit(contactIpRateMap, clientIp, 3, 5 * 60_000);
  if (!rate.allowed) {
    sendJson(res, 429, {
      ok: false,
      code: 'RATE_LIMITED',
      message: `Terlalu banyak percobaan pengiriman pesan dari jaringan Anda. Coba lagi dalam ${rate.remainingSecs} detik.`,
    });
    return;
  }

  let body: Record<string, unknown> | null;
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

  // Server-side WAF inspection (prevents cURL / REST API bypass of client checks)
  const checks = [
    { label: 'Nama Pengirim', raw: rawName, check: inspectServerPayload(rawName, 'Nama') },
    { label: 'Alamat Email', raw: rawEmail, check: inspectServerPayload(rawEmail, 'Email') },
    { label: 'Isi Pesan', raw: rawMessage, check: inspectServerPayload(rawMessage, 'Pesan') },
  ];

  for (const item of checks) {
    if (!item.check.isSafe) {
      const incidentId = `SEC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto
        .randomBytes(3)
        .toString('hex')
        .toUpperCase()}`;
      const ua = typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'].slice(0, 500) : 'Unknown';

      await insertSupabaseServiceRow('security_logs', {
        incident_id: incidentId,
        threat_type: (item.check.threatType || 'XSS Injection').slice(0, 50),
        field_name: item.label.slice(0, 60),
        client_ip: clientIp,
        user_agent: ua,
        payload_preview: item.raw.slice(0, 500),
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
