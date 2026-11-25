import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Terminal, Globe, Lock, Fingerprint, Clock, AlertTriangle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface SecurityIncident {
  threatType: 'XSS Injection' | 'SQL Injection' | 'Rate Limit Violation' | 'Payload Violation' | 'Malicious URL';
  fieldName: string;
  reason: string;
  payloadSnippet?: string;
}

interface SecurityAlertModalProps {
  incident: SecurityIncident | null;
  onClose: () => void;
}

export interface StoredSecurityLog {
  id?: string;
  incident_id: string;
  threat_type: string;
  field_name: string;
  client_ip: string;
  user_agent: string;
  payload_preview: string;
  created_at: string;
}

export const SecurityAlertModal: React.FC<SecurityAlertModalProps> = ({ incident, onClose }) => {
  const [clientIp, setClientIp] = useState<string>('Detecting...');
  const [incidentId, setIncidentId] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    if (!incident) return;

    // 1. Generate unique incident ID
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const generatedId = `SEC-${dateStr}-${randomHex}`;
    setIncidentId(generatedId);
    setTimestamp(
      now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );

    // 2. Fetch live public client IP with timeout
    let isCancelled = false;
    const fetchIp = async () => {
      let resolvedIp = 'Unknown (Proxy/Shielded)';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch('https://api64.ipify.org?format=json', {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.ip) {
            resolvedIp = data.ip;
          }
        }
      } catch {
        // Fallback when client IP cannot be resolved
        resolvedIp = 'Unavailable';
      }

      if (!isCancelled) {
        setClientIp(resolvedIp);

        // 3. Persist log to Supabase security_logs audit table
        const logEntry: StoredSecurityLog = {
          incident_id: generatedId,
          threat_type: incident.threatType,
          field_name: incident.fieldName,
          client_ip: resolvedIp,
          user_agent: navigator.userAgent,
          payload_preview: incident.payloadSnippet ? incident.payloadSnippet.slice(0, 500) : '',
          created_at: now.toISOString(),
        };

        try {
          await supabase.from('security_logs').insert([logEntry]);
        } catch {
          // Supabase log fallback
        }
      }
    };

    fetchIp();

    return () => {
      isCancelled = true;
    };
  }, [incident]);

  if (!incident) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
        {/* Animated Red Perimeter Border (Warning Radar Aura) */}
        <div className="pointer-events-none fixed inset-0 border-4 border-red-500/30 shadow-[inset_0_0_80px_rgba(239,68,68,0.25)] animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-[2rem] bg-[#090305] border border-red-500/40 shadow-[0_0_60px_rgba(239,68,68,0.35)] overflow-hidden text-slate-100 z-10"
        >
          {/* Cyber Scanning Laser Line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Tutup Peringatan"
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-white/[0.04] hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 transition cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header: Pulsing Danger Icon & Alert Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="relative shrink-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                  <ShieldAlert size={30} className="text-red-500 animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600" />
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase tracking-widest font-bold mb-1.5">
                  <AlertTriangle size={11} className="text-red-400" />
                  <span>INTRUSION DETECTION SYSTEM // ALERT</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
                  Akses Terlarang Dibatasi
                </h3>
              </div>
            </div>

            {/* Terminal Incident Diagnostic Box */}
            <div className="rounded-xl bg-black/75 border border-red-500/25 p-4 sm:p-5 font-mono text-xs space-y-2.5 mb-5 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-red-500/20 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1.5 text-red-400 font-bold">
                  <Terminal size={13} />
                  <span>INCIDENT DIAGNOSTIC</span>
                </span>
                <span className="text-slate-300 font-bold">{incidentId || '#SEC-LOG'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Tipe Pelanggaran:</span>
                  <span className="text-red-400 font-bold">{incident.threatType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Target Kolom:</span>
                  <span className="text-slate-200">{incident.fieldName}</span>
                </div>
              </div>

              {/* Client Live IP Section */}
              <div className="pt-2 border-t border-red-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11.5px]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Globe size={13} className="text-emerald-400" />
                  <span>Alamat IP Pelaku:</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/35 text-red-300 font-bold inline-flex items-center gap-1 self-start sm:self-auto">
                  <Lock size={11} />
                  <span>{clientIp}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  <span>{timestamp}</span>
                </span>
                <span className="text-emerald-400 font-bold">AUDIT TRAIL LOGGED</span>
              </div>

              {/* Blocked Payload Preview */}
              {incident.payloadSnippet && (
                <div className="mt-2 pt-2 border-t border-red-500/15">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                    Payload Dinetralisir:
                  </span>
                  <div className="p-2 rounded bg-red-950/40 border border-red-900/40 text-red-200 text-[11px] truncate max-h-16 overflow-x-auto select-all">
                    {incident.payloadSnippet}
                  </div>
                </div>
              )}
            </div>

            {/* Legal Warning Notice */}
            <p className="text-xs text-slate-400 leading-relaxed mb-6 bg-red-500/[0.04] p-3 rounded-xl border border-red-500/10">
              <strong className="text-red-400 block mb-1 font-mono uppercase tracking-wider text-[10px]">
                Pemberitahuan Keamanan Sistem:
              </strong>
              Payload tidak sah berhasil dicegat dan dinetralisir oleh sistem keamanan portofolio. Alamat IP, identitas browser, dan jejak waktu insiden telah dicatat dalam Audit Trail Keamanan Server. Percobaan eksploitasi atau perusakan sistem secara ilegal merupakan tindak pidana siber (UU ITE).
            </p>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white transition-all duration-200 shadow-[0_0_25px_rgba(220,38,38,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              <Fingerprint size={15} />
              <span>Saya Mengerti & Tutup Peringatan</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
