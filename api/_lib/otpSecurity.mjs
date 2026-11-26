// @ts-check
import crypto from 'node:crypto';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;
const MAX_TRACKED_TOKENS = 2000;

/** @type {Map<string, number>} */
const otpAttemptMap = new Map();
/** @type {Map<string, number>} */
const consumedTokenMap = new Map();

/**
 * Derives the server-only HMAC signing key for stateless OTP tokens.
 * Fails closed (returns null) if no server secret is configured.
 * @returns {Buffer | null}
 */
export function getOtpSigningSecret() {
  const explicitSecret = process.env.OTP_SECRET?.trim();
  if (explicitSecret && explicitSecret.length >= 16) {
    return crypto.createHash('sha256').update(explicitSecret).digest();
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceRoleKey) {
    return crypto.createHmac('sha256', serviceRoleKey).update('portfolio-otp-v1').digest();
  }

  return null;
}

/**
 * Masks an email address for UI hints (e.g., budi.santoso@gmail.com -> bu***@gmail.com).
 * @param {string} email
 * @returns {string}
 */
export function maskEmailAddress(email) {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***';
  const visible = local.length <= 2 ? local[0] : local.slice(0, 2);
  return `${visible}***@${domain}`;
}

/**
 * Generates a cryptographically secure 6-digit OTP bound to normalized email & expiry.
 * @param {string} email
 * @returns {{ code: string; otpToken: string; expiresAt: number } | null}
 */
export function createOtpChallenge(email) {
  const secret = getOtpSigningSecret();
  if (!secret) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const code = crypto.randomInt(100000, 1000000).toString();
  const salt = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + OTP_TTL_MS;

  const otpHash = crypto
    .createHmac('sha256', secret)
    .update(`${normalizedEmail}:${expiresAt}:${salt}:${code}`)
    .digest('hex');

  const payload = `${normalizedEmail}|${expiresAt}|${salt}|${otpHash}`;
  const encodedPayload = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');

  return {
    code,
    otpToken: `${encodedPayload}.${signature}`,
    expiresAt,
  };
}

/**
 * Keeps bounded Map memory under MAX_TRACKED_TOKENS.
 * @param {Map<string, number>} map
 */
function pruneTokenMap(map) {
  if (map.size < MAX_TRACKED_TOKENS) return;
  const now = Date.now();
  for (const [k, v] of map.entries()) {
    if (v > 10_000 && now > v) {
      map.delete(k);
    }
  }
  if (map.size >= MAX_TRACKED_TOKENS) {
    const oldest = map.keys().next().value;
    if (oldest !== undefined) map.delete(oldest);
  }
}

/**
 * Verifies the submitted 6-digit OTP against the signed challenge token in constant time.
 * Enforces exact email binding, expiry, max 5 attempts per token, and replay prevention.
 * @param {{ email: string; otpCode: string; otpToken: string }} params
 * @returns {{ valid: boolean; code?: string; message?: string }}
 */
export function verifyOtpChallenge({ email, otpCode, otpToken }) {
  const secret = getOtpSigningSecret();
  if (!secret) {
    return {
      valid: false,
      code: 'SERVER_UNAVAILABLE',
      message: 'Konfigurasi verifikasi server belum lengkap.',
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cleanCode = otpCode.trim();

  if (!/^\d{6}$/.test(cleanCode)) {
    return {
      valid: false,
      code: 'OTP_INVALID',
      message: 'Masukkan 6 digit angka kode verifikasi yang dikirim ke email Anda.',
    };
  }

  if (!otpToken || typeof otpToken !== 'string' || !otpToken.includes('.')) {
    return {
      valid: false,
      code: 'OTP_INVALID',
      message: 'Token verifikasi tidak ditemukan. Silakan kirim ulang kode verifikasi ke email Anda.',
    };
  }

  const parts = otpToken.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return {
      valid: false,
      code: 'OTP_INVALID',
      message: 'Token verifikasi tidak valid. Silakan minta kode baru.',
    };
  }

  const [encodedPayload, providedSig] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');

  const sigBufA = Buffer.from(providedSig, 'utf8');
  const sigBufB = Buffer.from(expectedSig, 'utf8');
  if (sigBufA.length !== sigBufB.length || !crypto.timingSafeEqual(sigBufA, sigBufB)) {
    return {
      valid: false,
      code: 'OTP_INVALID',
      message: 'Token verifikasi tidak sah atau telah dimodifikasi. Silakan kirim kode baru.',
    };
  }

  const consumedExpiry = consumedTokenMap.get(providedSig);
  if (consumedExpiry && Date.now() <= consumedExpiry) {
    return {
      valid: false,
      code: 'OTP_REUSED',
      message: 'Kode verifikasi ini sudah pernah dipakai. Kirim ulang kode baru jika ingin mengirim pesan lain.',
    };
  }

  let decodedPayload;
  try {
    decodedPayload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return { valid: false, code: 'OTP_INVALID', message: 'Token verifikasi rusak.' };
  }

  const payloadParts = decodedPayload.split('|');
  if (payloadParts.length !== 4) {
    return { valid: false, code: 'OTP_INVALID', message: 'Token verifikasi tidak valid.' };
  }

  const [tokenEmail, expiresAtStr, salt, expectedOtpHash] = payloadParts;
  const expiresAt = Number(expiresAtStr);

  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return {
      valid: false,
      code: 'OTP_EXPIRED',
      message: 'Kode verifikasi sudah kedaluwarsa (melebihi 10 menit). Klik "Kirim Ulang Kode" untuk kode baru.',
    };
  }

  if (tokenEmail !== normalizedEmail) {
    return {
      valid: false,
      code: 'OTP_EMAIL_MISMATCH',
      message: 'Alamat email berubah setelah meminta kode. Kirim ulang kode verifikasi ke email baru ini.',
    };
  }

  const attempts = otpAttemptMap.get(providedSig) || 0;
  if (attempts >= MAX_OTP_ATTEMPTS) {
    return {
      valid: false,
      code: 'OTP_LOCKED',
      message: 'Terlalu banyak percobaan kode OTP salah. Silakan kirim ulang kode verifikasi baru.',
    };
  }

  const computedOtpHash = crypto
    .createHmac('sha256', secret)
    .update(`${normalizedEmail}:${expiresAt}:${salt}:${cleanCode}`)
    .digest('hex');

  const hashBufA = Buffer.from(computedOtpHash, 'utf8');
  const hashBufB = Buffer.from(expectedOtpHash, 'utf8');

  if (hashBufA.length !== hashBufB.length || !crypto.timingSafeEqual(hashBufA, hashBufB)) {
    pruneTokenMap(otpAttemptMap);
    const nextAttempts = attempts + 1;
    otpAttemptMap.set(providedSig, nextAttempts);
    const remaining = MAX_OTP_ATTEMPTS - nextAttempts;
    return {
      valid: false,
      code: remaining <= 0 ? 'OTP_LOCKED' : 'OTP_INVALID',
      message:
        remaining <= 0
          ? 'Batas 5 kali salah kode tercapai. Silakan kirim ulang kode verifikasi baru.'
          : `Kode verifikasi salah. Sisa percobaan: ${remaining} kali.`,
    };
  }

  // Mark OTP token consumed so it cannot be replayed
  pruneTokenMap(consumedTokenMap);
  consumedTokenMap.set(providedSig, expiresAt);
  otpAttemptMap.delete(providedSig);

  return { valid: true };
}
