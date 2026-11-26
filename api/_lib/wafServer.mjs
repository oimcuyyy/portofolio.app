// @ts-check
import crypto from 'node:crypto';
import { insertSupabaseServiceRow } from './httpSecurity.mjs';

const SQLI_PATTERNS = [
  /\bunion\s+(all\s+)?select\b/i,
  /\b(or|and)\s+[\d'"]+\s*=\s*[\d'"]+/i,
  /;\s*(--|\/\*)/,
  /;\s*(drop|alter|truncate|delete|insert|update|create)\b/i,
  /\b(sleep|benchmark|waitfor\s+delay|xp_cmdshell|load_file|into\s+outfile)\b/i,
  /\binformation_schema\b/i,
  /\bexec(\s*|\+)+(sp_|xp_)/i,
];

const XSS_PATTERNS = [
  /<\s*script\b[^>]*>/i,
  /<\/\s*script\s*>/i,
  /\bon[a-z]{3,15}\s*=/i,
  /<\s*iframe\b[^>]*>/i,
  /\bdocument\.(cookie|location|write)\b/i,
  /\bwindow\.(location|open)\b/i,
];

/**
 * Strips ASCII control characters cleanly without regex control-char warnings.
 * @param {string} input
 * @returns {string}
 */
function stripControlChars(input) {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code >= 32 || code === 9 || code === 10 || code === 13) {
      out += input[i];
    }
  }
  return out;
}

/**
 * Escapes HTML special characters for safe interpolation inside transactional emails.
 * @param {string} input
 * @returns {string}
 */
export function escapeHtml(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * @param {string} text
 * @returns {string}
 */
export function sanitizeServerText(text) {
  if (!text || typeof text !== 'string') return '';
  return stripControlChars(text.replace(/<[a-zA-Z/][^>]*>/g, '')).trim();
}

/**
 * @param {string} input
 * @param {string} fieldName
 * @returns {{ isSafe: boolean; threatType?: string; reason?: string; sanitized: string }}
 */
export function inspectServerPayload(input, fieldName) {
  if (!input || typeof input !== 'string') {
    return { isSafe: true, sanitized: '' };
  }

  for (const pattern of SQLI_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isSafe: false,
        threatType: 'SQL Injection',
        reason: `${fieldName} terdeteksi mengandung pola berbahaya (SQL Injection / Query manipulation).`,
        sanitized: sanitizeServerText(input),
      };
    }
  }

  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isSafe: false,
        threatType: 'XSS Injection',
        reason: `${fieldName} terdeteksi mengandung script atau markup yang tidak diizinkan (XSS Protection).`,
        sanitized: sanitizeServerText(input),
      };
    }
  }

  return { isSafe: true, sanitized: sanitizeServerText(input) };
}

/**
 * Persists a server-detected intrusion attempt to security_logs with authoritative edge IP.
 * @param {{ req: import('node:http').IncomingMessage; clientIp: string; threatType: string; fieldName: string; rawPayload: string }} params
 */
export async function logServerSecurityIncident({ req, clientIp, threatType, fieldName, rawPayload }) {
  const incidentId = `SEC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()}`;
  const ua = typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'].slice(0, 500) : 'Unknown';

  await insertSupabaseServiceRow('security_logs', {
    incident_id: incidentId,
    threat_type: threatType.slice(0, 50),
    field_name: fieldName.slice(0, 60),
    client_ip: clientIp,
    user_agent: ua,
    payload_preview: rawPayload.slice(0, 500),
  });
}
