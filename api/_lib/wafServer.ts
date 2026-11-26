const SQLI_PATTERNS: RegExp[] = [
  /\bunion\s+(all\s+)?select\b/i,
  /\b(or|and)\s+[\d'"]+\s*=\s*[\d'"]+/i,
  /;\s*(--|\/\*)/,
  /;\s*(drop|alter|truncate|delete|insert|update|create)\b/i,
  /\b(sleep|benchmark|waitfor\s+delay|xp_cmdshell|load_file|into\s+outfile)\b/i,
  /\binformation_schema\b/i,
  /\bexec(\s*|\+)+(sp_|xp_)/i,
];

const XSS_PATTERNS: RegExp[] = [
  /<\s*script\b[^>]*>/i,
  /<\/\s*script\s*>/i,
  /\bon[a-z]{3,15}\s*=/i,
  /<\s*iframe\b[^>]*>/i,
  /\bdocument\.(cookie|location|write)\b/i,
  /\bwindow\.(location|open)\b/i,
];

function stripControlChars(input: string): string {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code >= 32 || code === 9 || code === 10 || code === 13) {
      out += input[i];
    }
  }
  return out;
}

export function sanitizeServerText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return stripControlChars(text.replace(/<[a-zA-Z/][^>]*>/g, '')).trim();
}

export function inspectServerPayload(
  input: string,
  fieldName: string
): { isSafe: boolean; threatType?: string; reason?: string; sanitized: string } {
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
