/**
 * Web Application Firewall (WAF) & Client-Side Security Guard
 * 
 * Provides defense-in-depth protection against:
 * 1. SQL Injection (SQLi) attacks & payload tampering
 * 2. Cross-Site Scripting (XSS) & HTML injection
 * 3. Link Tampering & Malicious Open Redirects (javascript:, data:, vbscript:)
 * 4. URL Parameter manipulation & Path Traversal
 * 5. Automated Form Spam & Brute-force Flooding
 */

// Common SQL Injection Signatures
const SQLI_PATTERNS: RegExp[] = [
  /\bunion\s+(all\s+)?select\b/i,
  /\b(or|and)\s+[\d'"]+\s*=\s*[\d'"]+/i,
  /(--|\/\*|\*\/)/,
  /;\s*(drop|alter|truncate|delete|insert|update|create)\b/i,
  /\b(sleep|benchmark|waitfor\s+delay|xp_cmdshell|load_file|into\s+outfile)\b/i,
  /\binformation_schema\b/i,
  /\b(0x[0-9a-f]{2,})\b/i,
  /\bexec(\s*|\+)+(sp_|xp_)/i,
];

// Common Cross-Site Scripting (XSS) & Execution Signatures
const XSS_PATTERNS: RegExp[] = [
  /<\s*script\b[^>]*>/i,
  /<\/\s*script\s*>/i,
  /\bon[a-z]{3,15}\s*=/i, // e.g. onerror=, onload=, onclick=
  /(javascript|vbscript|data):/i,
  /\b(eval|alert|prompt|confirm)\s*\(/i,
  /\bdocument\.(cookie|location|write)\b/i,
  /\bwindow\.(location|open)\b/i,
  /<\s*iframe\b[^>]*>/i,
];

export interface WafInspectionResult {
  isSafe: boolean;
  reason?: string;
  sanitized: string;
}

/**
 * Inspects any text payload for SQL Injection or XSS threats.
 */
export function inspectPayload(input: string, fieldName = 'Input'): WafInspectionResult {
  if (!input || typeof input !== 'string') {
    return { isSafe: true, sanitized: '' };
  }

  // 1. Check for SQL Injection patterns
  for (const pattern of SQLI_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isSafe: false,
        reason: `${fieldName} terdeteksi mengandung pola berbahaya (SQL Injection / Query manipulation).`,
        sanitized: sanitizeText(input),
      };
    }
  }

  // 2. Check for XSS and malicious scripts
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isSafe: false,
        reason: `${fieldName} terdeteksi mengandung script atau markup yang tidak diizinkan (XSS Protection).`,
        sanitized: sanitizeText(input),
      };
    }
  }

  return {
    isSafe: true,
    sanitized: sanitizeText(input),
  };
}

// ASCII control characters regex
// oxlint-disable-next-line eslint/no-control-regex
const CONTROL_CHARS_REGEX = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]', 'g');

/**
 * Sanitizes text by stripping HTML tags and control characters.
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(CONTROL_CHARS_REGEX, '') // Remove ASCII control characters
    .trim();
}

/**
 * Validates and sanitizes URLs to prevent Link Tampering, Phishing,
 * and JavaScript pseudoprotocol execution (`javascript:`, `data:`).
 * Only http, https, mailto, tel, and safe anchors (#) are allowed.
 */
export function sanitizeUrl(url?: string | null, fallback = '#'): string {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Allow internal safe hash anchors and relative root paths
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) {
    // Prevent path traversal like /../../
    if (trimmed.includes('..')) return fallback;
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();

    // Whitelist allowed protocols
    if (protocol === 'https:' || protocol === 'http:' || protocol === 'mailto:' || protocol === 'tel:') {
      return parsed.href;
    }

    // Dangerous protocols like javascript:, data:, vbscript:, file: will be rejected
    console.warn(`[WAF Alert] Blocked suspicious URL protocol: ${parsed.protocol}`);
    return fallback;
  } catch {
    // If not a valid absolute URL and not starting with / or #, reject it
    return fallback;
  }
}

/**
 * Validates whether a URL is completely safe to be stored in the database.
 */
export function isValidSafeUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * URL Parameter & Path Tampering Guard
 * Inspects query string and hash on page load to neutralize tampering attempts.
 */
export function initUrlTamperingGuard(): void {
  if (typeof window === 'undefined') return;

  try {
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;
    let hasViolation = false;

    // Check query params for SQLi, XSS, or path traversal
    if (currentSearch) {
      const decodedSearch = decodeURIComponent(currentSearch);
      for (const pattern of [...SQLI_PATTERNS, ...XSS_PATTERNS]) {
        if (pattern.test(decodedSearch) || decodedSearch.includes('..')) {
          hasViolation = true;
          break;
        }
      }
    }

    // Check hash
    if (!hasViolation && currentHash) {
      const decodedHash = decodeURIComponent(currentHash);
      for (const pattern of [...SQLI_PATTERNS, ...XSS_PATTERNS]) {
        if (pattern.test(decodedHash) || decodedHash.includes('..')) {
          hasViolation = true;
          break;
        }
      }
    }

    if (hasViolation) {
      console.warn('[WAF Alert] Suspicious URL parameters detected. Sanitizing history state.');
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (err) {
    console.error('[WAF] Error while running URL tampering check:', err);
  }
}

/**
 * Rate Limiter to stop automated bots from flooding forms or brute-forcing login.
 */
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): { allowed: boolean; remainingSecs?: number } {
  if (typeof window === 'undefined') return { allowed: true };

  const storageKey = `waf_ratelimit_${key}`;
  const now = Date.now();
  
  try {
    const raw = localStorage.getItem(storageKey);
    const data: { count: number; resetAt: number } = raw ? JSON.parse(raw) : { count: 0, resetAt: now + windowMs };

    if (now > data.resetAt) {
      // Window expired, reset
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, resetAt: now + windowMs }));
      return { allowed: true };
    }

    if (data.count >= maxAttempts) {
      const remainingSecs = Math.ceil((data.resetAt - now) / 1000);
      return { allowed: false, remainingSecs };
    }

    data.count += 1;
    localStorage.setItem(storageKey, JSON.stringify(data));
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}
