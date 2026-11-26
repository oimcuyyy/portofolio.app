// @ts-check
import nodemailer from 'nodemailer';
import {
  sendJson,
  extractClientIp,
  checkMemoryRateLimit,
  readJsonBody,
} from './_lib/httpSecurity.mjs';
import { verifyEmailOnServer } from './_lib/emailVerification.mjs';
import { inspectServerPayload, escapeHtml, logServerSecurityIncident } from './_lib/wafServer.mjs';
import { createOtpChallenge, maskEmailAddress } from './_lib/otpSecurity.mjs';

/** @type {Map<string, import('./_lib/httpSecurity.mjs').RateLimitEntry>} */
const otpIpRateMap = new Map();
/** @type {Map<string, import('./_lib/httpSecurity.mjs').RateLimitEntry>} */
const otpEmailRateMap = new Map();

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
  const ipRate = checkMemoryRateLimit(otpIpRateMap, clientIp, 4, 5 * 60_000);
  if (!ipRate.allowed) {
    sendJson(res, 429, {
      ok: false,
      code: 'RATE_LIMITED',
      message: `Terlalu banyak permintaan kode verifikasi dari jaringan Anda. Coba lagi dalam ${ipRate.remainingSecs} detik.`,
    });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req, 4096);
  } catch (err) {
    if (err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE') {
      sendJson(res, 413, { ok: false, code: 'PAYLOAD_TOO_LARGE', message: 'Ukuran permintaan melebihi batas.' });
      return;
    }
    sendJson(res, 400, { ok: false, code: 'INVALID_BODY', message: 'Permintaan tidak valid.' });
    return;
  }

  if (!body) {
    sendJson(res, 400, { ok: false, code: 'INVALID_JSON', message: 'Data formulir tidak valid.' });
    return;
  }

  const rawName = typeof body.name === 'string' ? body.name : '';
  const rawEmail = typeof body.email === 'string' ? body.email : '';

  const nameCheck = inspectServerPayload(rawName, 'Nama');
  const emailCheck = inspectServerPayload(rawEmail, 'Email');

  if (!nameCheck.isSafe) {
    await logServerSecurityIncident({
      req,
      clientIp,
      threatType: nameCheck.threatType || 'XSS Injection',
      fieldName: 'Nama Pengirim (OTP)',
      rawPayload: rawName,
    });
    sendJson(res, 422, {
      ok: false,
      code: 'WAF_BLOCKED',
      threatType: nameCheck.threatType || 'XSS Injection',
      fieldName: 'Nama Pengirim',
      message: nameCheck.reason || 'Input terdeteksi mengandung karakter berbahaya.',
    });
    return;
  }

  if (!emailCheck.isSafe) {
    await logServerSecurityIncident({
      req,
      clientIp,
      threatType: emailCheck.threatType || 'XSS Injection',
      fieldName: 'Alamat Email (OTP)',
      rawPayload: rawEmail,
    });
    sendJson(res, 422, {
      ok: false,
      code: 'WAF_BLOCKED',
      threatType: emailCheck.threatType || 'XSS Injection',
      fieldName: 'Alamat Email',
      message: emailCheck.reason || 'Input email terdeteksi mengandung skrip berbahaya.',
    });
    return;
  }

  const cleanName = nameCheck.sanitized.slice(0, 100);
  const cleanEmail = emailCheck.sanitized.slice(0, 120).toLowerCase();

  if (cleanName.length < 2) {
    sendJson(res, 422, {
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Mohon isi nama lengkap Anda (minimal 2 karakter) sebelum meminta kode verifikasi.',
    });
    return;
  }

  const emailVerify = await verifyEmailOnServer(cleanEmail);
  if (!emailVerify.valid) {
    sendJson(res, 422, {
      ok: false,
      code: 'EMAIL_INVALID',
      message: emailVerify.reason || 'Alamat email tidak valid atau domain belum terdaftar.',
      suggestion: emailVerify.suggestion,
    });
    return;
  }

  const gmailUser = (process.env.GMAIL_USER || process.env.VITE_ADMIN_EMAIL || 'belajarmandiri03034@gmail.com').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

  const challenge = createOtpChallenge(cleanEmail);
  if (!gmailPass || !challenge) {
    sendJson(res, 503, {
      ok: false,
      code: 'SMTP_NOT_CONFIGURED',
      message:
        'Layanan pengiriman kode OTP belum diaktifkan di server. Hubungi pemilik situs langsung melalui alamat email yang tertera.',
    });
    return;
  }

  // Prevent email bombing a victim's inbox across rotating IPs
  const emailRate = checkMemoryRateLimit(otpEmailRateMap, cleanEmail, 2, 5 * 60_000);
  if (!emailRate.allowed) {
    sendJson(res, 429, {
      ok: false,
      code: 'RATE_LIMITED',
      message: `Kode verifikasi ke email ini baru saja dikirim. Periksa Kotak Masuk/Spam atau tunggu ${emailRate.remainingSecs} detik.`,
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      connectionTimeout: 6000,
      greetingTimeout: 6000,
      socketTimeout: 8000,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const safeNameHtml = escapeHtml(cleanName);

    await transporter.sendMail({
      from: `"Muhammad Rochimuloh" <${gmailUser}>`,
      to: cleanEmail,
      subject: `Kode Verifikasi Kolaborasi: ${challenge.code}`,
      text: [
        `Halo ${cleanName},`,
        '',
        `Gunakan kode verifikasi 6 digit di bawah ini untuk mengonfirmasi bahwa alamat email ini aktif dan Anda sendiri yang mengirim pesan kolaborasi di portofolio Muhammad Rochimuloh:`,
        '',
        `KODE VERIFIKASI: ${challenge.code}`,
        '',
        `Kode berlaku selama 10 menit.`,
        `Jika Anda tidak merasa mengisi formulir kontak tersebut, cukup abaikan email ini.`,
      ].join('\n'),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background-color: #070b14; color: #e2e8f0; border-radius: 16px; border: 1px solid #1e293b;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #34d399; margin: 0 0 12px; font-weight: 700;">Verifikasi Email Kolaborasi</p>
          <h2 style="font-size: 18px; color: #ffffff; margin: 0 0 12px;">Halo, ${safeNameHtml}</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 20px;">
            Masukkan kode verifikasi 6 digit berikut pada formulir kontak untuk memastikan alamat email ini benar-benar aktif dan dimiliki oleh Anda:
          </p>
          <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 18px; text-align: center; margin: 0 0 20px;">
            <span style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 30px; font-weight: 800; letter-spacing: 0.3em; color: #ffffff;">${challenge.code}</span>
          </div>
          <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin: 0;">
            Kode ini berlaku selama <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapa pun. Abaikan email ini jika Anda tidak merasa mengirim pesan.
          </p>
        </div>
      `,
    });

    sendJson(res, 200, {
      ok: true,
      otpToken: challenge.otpToken,
      maskedEmail: maskEmailAddress(cleanEmail),
      expiresInSeconds: 600,
    });
  } catch {
    sendJson(res, 502, {
      ok: false,
      code: 'OTP_DELIVERY_FAILED',
      message: 'Gagal mengirim kode verifikasi ke email tersebut. Pastikan alamat email benar dan aktif.',
    });
  }
}
