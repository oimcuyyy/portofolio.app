// @ts-check
import crypto from 'node:crypto';
import {
  sendJson,
  extractClientIp,
  extractClientGeo,
  checkMemoryRateLimit,
  readJsonBody,
  insertSupabaseServiceRow,
} from './_lib/httpSecurity.mjs';
import { sanitizeServerText } from './_lib/wafServer.mjs';

const ALLOWED_THREAT_TYPES = new Set([
  'XSS Injection',
  'SQL Injection',
  'Rate Limit Violation',
  'Payload Violation',
  'Malicious URL',
]);

/** @type {Map<string, import('./_lib/httpSecurity.mjs').RateLimitEntry>} */
const secLogIpRateMap = new Map();

/**
 * @param {import('node:http').IncomingMessage & { body?: unknown }} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { recorded: false, message: 'Method tidak diizinkan.' });
    return;
  }

  const clientIp = extractClientIp(req);
  const clientGeo = extractClientGeo(req);
  const rate = checkMemoryRateLimit(secLogIpRateMap, clientIp, 10, 60_000);

  const serverIncidentId = `SEC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()}`;

  if (!rate.allowed) {
    sendJson(res, 429, {
      recorded: false,
      clientIp,
      clientGeo,
      incidentId: serverIncidentId,
      message: 'Rate limit exceeded.',
    });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req, 8192);
  } catch {
    sendJson(res, 400, { recorded: false, clientIp, clientGeo, incidentId: serverIncidentId });
    return;
  }

  const rawThreatType = typeof body?.threatType === 'string' ? body.threatType.trim() : '';
  const threatType = ALLOWED_THREAT_TYPES.has(rawThreatType) ? rawThreatType : 'Payload Violation';

  const rawField = typeof body?.fieldName === 'string' ? body.fieldName : 'Input';
  const fieldName = sanitizeServerText(rawField).slice(0, 60) || 'Input';

  const rawPayload = typeof body?.payloadSnippet === 'string' ? body.payloadSnippet : '';
  const payloadPreview = rawPayload.slice(0, 500);

  const ua = typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'].slice(0, 500) : 'Unknown';

  const dbRes = await insertSupabaseServiceRow('security_logs', {
    incident_id: serverIncidentId,
    threat_type: threatType,
    field_name: fieldName,
    client_ip: clientIp,
    user_agent: clientGeo ? `[ISP Geo: ${clientGeo}] ${ua}`.slice(0, 500) : ua,
    payload_preview: payloadPreview,
  });

  sendJson(res, dbRes.ok ? 201 : 200, {
    recorded: dbRes.ok,
    clientIp,
    clientGeo,
    incidentId: serverIncidentId,
  });
}
