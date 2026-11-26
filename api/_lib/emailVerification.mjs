// @ts-check
import { resolveMx } from 'node:dns/promises';

/** @typedef {{ valid: boolean; mxVerified?: boolean; reason?: string; suggestion?: string; warning?: string }} ServerEmailVerifyResult */

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

/** @type {Record<string, string>} */
const DOMAIN_TYPO_SUGGESTIONS = {
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

const DNS_HOSTNAME_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

/**
 * Full server-side verification: syntax, provider rules, dummy local parts,
 * disposable blocklist, typo suggestions, and live DNS MX check (<= 3.5s total worst case).
 * @param {string} rawEmail
 * @returns {Promise<ServerEmailVerifyResult>}
 */
export async function verifyEmailOnServer(rawEmail) {
  const email = rawEmail.trim().toLowerCase();

  if (!email || email.length > 120 || /\s/.test(email)) {
    return { valid: false, reason: 'Format alamat email tidak valid.' };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Format alamat email tidak valid.' };
  }

  const [localPart, domain] = parts;

  if (!localPart || localPart.length > 64 || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return { valid: false, reason: 'Bagian nama email sebelum @ tidak valid.' };
  }

  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
    return { valid: false, reason: 'Nama email mengandung karakter yang tidak diizinkan.' };
  }

  if (domain.length < 4 || domain.length > 253 || !DNS_HOSTNAME_REGEX.test(domain)) {
    return {
      valid: false,
      reason: `Domain email "${domain}" tidak memiliki format hostname yang valid.`,
    };
  }

  const tld = domain.split('.').pop() || '';
  if (RESERVED_TLDS.has(tld) || tld.length < 2 || /^\d+$/.test(tld)) {
    return {
      valid: false,
      reason: `Akhiran domain ".${tld}" tidak dapat digunakan untuk pengiriman email nyata.`,
    };
  }

  const suggestedDomain = DOMAIN_TYPO_SUGGESTIONS[domain];
  if (suggestedDomain) {
    return {
      valid: false,
      reason: `Domain "@${domain}" terlihat salah ketik. Gunakan email yang benar dan terdaftar.`,
      suggestion: `${localPart}@${suggestedDomain}`,
    };
  }

  if (DISPOSABLE_OR_FAKE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: `Domain "${domain}" terdeteksi sebagai email sementara/fiktif. Gunakan email pribadi atau kantor yang aktif.`,
    };
  }

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

  const normalizedBase = baseLocal.replace(/[._-]/g, '');
  if (DUMMY_LOCAL_PARTS.has(baseLocal) || DUMMY_LOCAL_PARTS.has(normalizedBase)) {
    return {
      valid: false,
      reason: `Alamat email "${email}" terdeteksi sebagai email contoh/uji coba. Gunakan email asli Anda.`,
    };
  }

  if (normalizedBase.length >= 3 && /^(.)\1+$/.test(normalizedBase)) {
    return {
      valid: false,
      reason: 'Alamat email terdeteksi tidak valid (karakter berulang). Gunakan email asli yang terdaftar.',
    };
  }

  // Bounded DNS MX verification: 1.5s UDP/TCP DNS + 2.0s Google DoH backup
  try {
    const mxRecords = /** @type {import('node:dns').MxRecord[]} */ (
      await Promise.race([
        resolveMx(domain),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DNS_TIMEOUT')), 1500)),
      ])
    );

    const activeMx = mxRecords.filter(
      (rec) => rec.exchange && rec.exchange.trim() !== '' && rec.exchange.trim() !== '.'
    );

    if (activeMx.length === 0) {
      return {
        valid: false,
        mxVerified: false,
        reason: `Domain "${domain}" tidak memiliki server email aktif (MX record kosong). Pastikan alamat email benar dan sudah dibuat.`,
      };
    }

    return { valid: true, mxVerified: true };
  } catch (err) {
    const code = /** @type {{ code?: string }} */ (err)?.code;
    const message = err instanceof Error ? err.message : '';

    if (code === 'ENOTFOUND' || code === 'ENODATA' || code === 'NODATA' || code === 'NXDOMAIN') {
      return {
        valid: false,
        mxVerified: false,
        reason: `Domain "${domain}" tidak terdaftar atau tidak dapat menerima email. Periksa kembali ejaan email Anda.`,
      };
    }

    if (message === 'DNS_TIMEOUT' || code === 'ETIMEOUT' || code === 'ECONNREFUSED' || code === 'ESERVFAIL') {
      try {
        const controller = new AbortController();
        const dohTimer = setTimeout(() => controller.abort(), 2000);
        const dohRes = await fetch(
          `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`,
          { signal: controller.signal }
        );
        clearTimeout(dohTimer);

        if (dohRes.ok) {
          const doh = /** @type {{ Status?: number; Answer?: Array<{ data?: string }> }} */ (await dohRes.json());
          const hasValidMx = Array.isArray(doh.Answer) && doh.Answer.some((a) => a.data && !a.data.endsWith(' .'));
          if (doh.Status === 3 || !hasValidMx) {
            return {
              valid: false,
              mxVerified: false,
              reason: `Domain "${domain}" tidak terdaftar atau tidak memiliki server email aktif (MX record kosong).`,
            };
          }
          return { valid: true, mxVerified: true };
        }
      } catch {
        // Fall through on network outage
      }
    }

    return { valid: true, mxVerified: false, warning: 'dns_unavailable' };
  }
}
