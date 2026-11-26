/**
 * Email Authenticity, Provider Policy & DNS MX Verification Utilities
 *
 * Defense layers against fake, disposable, mistyped, or nonexistent email addresses:
 * 1. Strict RFC syntax & TLD validation
 * 2. Common provider account policy enforcement (Gmail, Yahoo, Outlook)
 * 3. Keyboard-mash / dummy / placeholder local-part blocking
 * 4. 60+ Disposable / Temporary domain blocklist + typo suggestion
 * 5. Live server-side DNS MX record verification (/api/verify-email)
 */

export interface EmailRuleCheckResult {
  valid: boolean;
  reason?: string;
  suggestion?: string;
}

export interface EmailAvailabilityResult extends EmailRuleCheckResult {
  mxVerified?: boolean;
}

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

const DOMAIN_TYPO_SUGGESTIONS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.id': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'hotmal.com': 'hotmail.com',
  'hotnail.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'iclod.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'icloud.con': 'icloud.com',
};

const DUMMY_LOCAL_PARTS = new Set([
  'test',
  'testing',
  'test123',
  'tester',
  'fake',
  'fakemail',
  'palsu',
  'emailpalsu',
  'asdf',
  'asdfg',
  'asdfgh',
  'qwerty',
  'qwertyuiop',
  'zxcvbn',
  'abcdef',
  '123456',
  '1234567',
  '12345678',
  '123456789',
  'admin',
  'administrator',
  'root',
  'null',
  'none',
  'anonymous',
  'anonim',
  'noemail',
  'noreply',
  'spam',
  'bot',
  'example',
  'sample',
  'user',
  'username',
  'dummy',
  'nama',
  'email',
  'asal',
  'ngasal',
  'coba',
  'nyoba',
  'ujicoba',
  'hehehe',
  'hahaha',
  'wkwkwk',
]);

// Cache domain MX results during browser session to prevent repeated queries
const domainMxCache = new Map<string, { valid: boolean; mxVerified?: boolean; reason?: string }>();

/**
 * Synchronous structural, provider-policy, typo, and disposable check.
 */
export function validateEmailRules(rawEmail: string): EmailRuleCheckResult {
  const email = rawEmail.trim().toLowerCase();

  if (!email) {
    return { valid: false, reason: 'Alamat email wajib diisi.' };
  }

  if (email.length > 120 || /\s/.test(email)) {
    return { valid: false, reason: 'Format alamat email tidak valid atau mengandung spasi.' };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Alamat email harus memiliki tepat satu tanda @.' };
  }

  const [localPart, domain] = parts;

  if (!localPart || localPart.length > 64 || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return { valid: false, reason: 'Bagian nama email sebelum @ tidak valid.' };
  }

  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
    return { valid: false, reason: 'Nama email mengandung karakter yang tidak diizinkan.' };
  }

  if (
    !domain ||
    domain.length < 4 ||
    domain.length > 253 ||
    domain.startsWith('.') ||
    domain.endsWith('.') ||
    domain.includes('..') ||
    !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(domain)
  ) {
    return { valid: false, reason: 'Format domain email tidak valid (contoh yang benar: nama@gmail.com).' };
  }

  const tld = domain.split('.').pop() || '';
  if (tld.length < 2 || /^\d+$/.test(tld) || RESERVED_TLDS.has(tld)) {
    return { valid: false, reason: `Akhiran domain ".${tld}" bukan domain email publik yang valid.` };
  }

  // Suggest correction for common domain typos (e.g. gmial.com -> gmail.com)
  const suggestedDomain = DOMAIN_TYPO_SUGGESTIONS[domain];
  if (suggestedDomain) {
    return {
      valid: false,
      reason: `Domain "@${domain}" terlihat salah ketik. Gunakan email yang benar dan terdaftar.`,
      suggestion: `${localPart}@${suggestedDomain}`,
    };
  }

  // Block disposable / fake domains
  if (DISPOSABLE_OR_FAKE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: `Domain "@${domain}" terdeteksi sebagai email sementara/palsu. Gunakan email pribadi atau kantor yang aktif.`,
    };
  }

  // Enforce major email provider username policies to catch fake addresses
  const baseLocal = localPart.split('+')[0];
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    if (baseLocal.length < 6 || baseLocal.length > 30) {
      return {
        valid: false,
        reason: 'Alamat Gmail asli harus memiliki minimal 6 karakter sebelum @gmail.com.',
      };
    }
    if (!/^[a-z0-9.]+$/.test(baseLocal)) {
      return {
        valid: false,
        reason: 'Akun Gmail hanya mengizinkan huruf, angka, dan titik (tidak bisa memakai _ atau -).',
      };
    }
  } else if (domain === 'yahoo.com' || domain === 'yahoo.co.id' || domain === 'ymail.com') {
    if (baseLocal.length < 4 || baseLocal.length > 32 || !/^[a-z][a-z0-9._]*$/.test(baseLocal)) {
      return {
        valid: false,
        reason: 'Format username Yahoo tidak sesuai aturan akun Yahoo resmi (min 4 karakter, diawali huruf).',
      };
    }
  }

  // Block obvious dummy / keyboard-mash / placeholder local parts
  const normalizedBase = baseLocal.replace(/[._-]/g, '');
  if (DUMMY_LOCAL_PARTS.has(baseLocal) || DUMMY_LOCAL_PARTS.has(normalizedBase)) {
    return {
      valid: false,
      reason: `Alamat "${rawEmail.trim()}" terdeteksi sebagai email contoh/uji coba. Gunakan email asli Anda.`,
    };
  }

  // Block single repeated character usernames (e.g. aaaaaa@gmail.com)
  if (normalizedBase.length >= 3 && /^(.)\1+$/.test(normalizedBase)) {
    return {
      valid: false,
      reason: 'Alamat email terdeteksi tidak valid (karakter berulang). Gunakan email asli yang terdaftar.',
    };
  }

  return { valid: true };
}

/**
 * Verifies email format, provider rules, AND live DNS MX records via /api/verify-email.
 */
export async function verifyEmailAvailability(rawEmail: string): Promise<EmailAvailabilityResult> {
  const localCheck = validateEmailRules(rawEmail);
  if (!localCheck.valid) {
    return localCheck;
  }

  const email = rawEmail.trim().toLowerCase();
  const domain = email.split('@')[1];

  const cached = domainMxCache.get(domain);
  if (cached) {
    return cached;
  }

  // 1. Primary check via Vercel Serverless /api/verify-email
  // Client abort is 6500ms > server worst case (1500ms resolveMx + 2000ms DoH = 3500ms)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);
    const res = await fetch('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.status !== 404 && contentType.includes('application/json')) {
      const data = (await res.json()) as {
        valid: boolean;
        mxVerified?: boolean;
        reason?: string;
        suggestion?: string;
        warning?: string;
      };
      const result: EmailAvailabilityResult = {
        valid: Boolean(data.valid),
        mxVerified: data.mxVerified,
        reason: data.reason,
        suggestion: data.suggestion,
      };
      // Only cache conclusive DNS lookups (avoid caching transient fallback warnings)
      if (!data.warning) {
        domainMxCache.set(domain, result);
      }
      return result;
    }
  } catch {
    // Fall through below
  }

  // 2. Local dev fallback (Vite dev server does not run Vercel /api/* functions)
  if (import.meta.env.DEV) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const dohRes = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (dohRes.ok) {
        const doh = (await dohRes.json()) as { Status?: number; Answer?: Array<{ data?: string }> };
        if (doh.Status === 3 || !doh.Answer || doh.Answer.length === 0) {
          const result: EmailAvailabilityResult = {
            valid: false,
            mxVerified: false,
            reason: `Domain "${domain}" tidak terdaftar atau tidak memiliki server email aktif (MX record kosong).`,
          };
          domainMxCache.set(domain, result);
          return result;
        }
        const result: EmailAvailabilityResult = { valid: true, mxVerified: true };
        domainMxCache.set(domain, result);
        return result;
      }
    } catch {
      // Transient dev network error: fail-open
    }
  }

  return { valid: true, mxVerified: false };
}
