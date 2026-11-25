import React, { useState, useEffect } from 'react';
import { Mail, ShieldAlert, Globe, Clock, Copy, Check, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { StoredSecurityLog } from './SecurityAlertModal';

interface AdminInboxProps {
  session: any;
  messages: any[];
  fetchMessages: () => Promise<void>;
}

const AdminInbox: React.FC<AdminInboxProps> = ({ session, messages, fetchMessages }) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'security'>('messages');
  const [securityLogs, setSecurityLogs] = useState<StoredSecurityLog[]>([]);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSecurityLogs = async () => {
    setIsRefreshing(true);
    let logs: StoredSecurityLog[] = [];

    // 1. Try to fetch from Supabase table 'security_logs'
    try {
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        logs = data;
      }
    } catch {
      // Supabase query error fallback
    }

    // 2. Merge with locally cached logs
    try {
      const localLogsRaw = localStorage.getItem('portfolio_security_logs');
      if (localLogsRaw) {
        const localLogs: StoredSecurityLog[] = JSON.parse(localLogsRaw);
        // Deduplicate by incident_id
        const existingIds = new Set(logs.map(l => l.incident_id));
        for (const log of localLogs) {
          if (!existingIds.has(log.incident_id)) {
            logs.push(log);
            existingIds.add(log.incident_id);
          }
        }
      }
    } catch {
      // Localstorage error fallback
    }

    // Sort descending by date
    logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setSecurityLogs(logs);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (session) {
      fetchSecurityLogs();
    }
  }, [session]);

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Yakin ingin membersihkan seluruh riwayat log serangan?')) return;
    try {
      localStorage.removeItem('portfolio_security_logs');
      await supabase.from('security_logs').delete().neq('incident_id', 'none');
      setSecurityLogs([]);
    } catch {
      setSecurityLogs([]);
    }
  };

  if (!session) return null;

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto relative z-10">
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-emerald-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl">
        
        {/* Header & Action Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 pb-6 border-b border-slate-200/60 dark:border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-emerald-300 flex items-center gap-2 mb-1">
              {activeTab === 'messages' ? (
                <>
                  <Mail className="text-emerald-600 dark:text-emerald-400" />
                  <span>Inbox Pesan Masuk ({messages.length})</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="text-red-500 animate-pulse" />
                  <span>Audit Log Serangan IDS ({securityLogs.length})</span>
                </>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeTab === 'messages'
                ? 'Daftar pesan pengunjung resmi lewat formulir kontak portofolio'
                : 'Catatan insiden percobaan injeksi XSS/SQLi dan alamat IP pelaku'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab === 'messages') fetchMessages();
                else fetchSecurityLogs();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold uppercase tracking-wider transition border border-slate-200 dark:border-white/10 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Muat Ulang</span>
            </button>

            {activeTab === 'security' && securityLogs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-mono font-bold uppercase tracking-wider transition border border-red-500/20 flex items-center gap-1.5 cursor-pointer"
                title="Bersihkan Semua Log Serangan"
              >
                <Trash2 size={13} />
                <span>Hapus</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail size={14} />
            <span>Pesan Masuk ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert size={14} className={securityLogs.length > 0 ? 'text-red-400' : ''} />
            <span>Log Serangan ({securityLogs.length})</span>
            {securityLogs.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            )}
          </button>
        </div>

        {/* Content Section: Messages List */}
        {activeTab === 'messages' && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada pesan masuk.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0b101e] border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-emerald-300 text-lg mb-0.5">
                        {msg.name}
                      </h4>
                      <span className="text-xs text-emerald-600 dark:text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {msg.email}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider font-bold">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/30 rounded-full" />
                    <p className="text-sm text-slate-700 dark:text-slate-300 pl-4 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Content Section: Security Logs List */}
        {activeTab === 'security' && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {securityLogs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <ShieldAlert size={36} className="mx-auto text-emerald-500/50 mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">
                  Sistem Aman — Belum Ada Serangan
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                  Seluruh percobaan injeksi XSS, SQLi, dan spam flooding akan langsung tercatat di panel ini beserta alamat IP pelakunya.
                </p>
              </div>
            ) : (
              securityLogs.map((log) => (
                <div
                  key={log.incident_id}
                  className="p-5 rounded-2xl bg-red-950/20 border border-red-500/25 hover:border-red-500/40 transition-colors font-mono text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-red-500/15">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 font-bold text-[10px] uppercase">
                        {log.threat_type}
                      </span>
                      <span className="text-slate-400 font-bold text-[11px]">{log.incident_id}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 text-[10.5px]">
                      <Clock size={11} />
                      <span>
                        {new Date(log.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* IP & Target Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-red-500/15">
                      <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                        <Globe size={13} className="text-red-400" />
                        <span>IP Pelaku:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-red-300 text-[11.5px]">{log.client_ip}</span>
                        <button
                          onClick={() => handleCopyIp(log.client_ip)}
                          title="Salin Alamat IP"
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/25 text-red-300 transition cursor-pointer"
                        >
                          {copiedIp === log.client_ip ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                        {log.client_ip && !log.client_ip.includes('Recorded') && !log.client_ip.includes('Detecting') && (
                          <a
                            href={`https://ipinfo.io/${encodeURIComponent(log.client_ip)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Lacak Informasi IP di ipinfo.io"
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500/25 text-red-300 hover:text-white transition inline-flex items-center gap-1 text-[10px] px-1.5 cursor-pointer"
                          >
                            <ExternalLink size={11} />
                            <span>Lacak</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-red-500/15 text-[11px]">
                      <span className="text-slate-400">Target Field:</span>
                      <span className="text-white font-bold">{log.field_name}</span>
                    </div>
                  </div>

                  {/* Blocked Payload Snippet */}
                  {log.payload_preview && (
                    <div className="p-2.5 rounded-xl bg-black/60 border border-red-500/20 text-red-200 text-[11px] select-all break-all">
                      <span className="text-slate-500 text-[10px] uppercase block mb-0.5">
                        Cuplikan Payload Dicegat:
                      </span>
                      <code>{log.payload_preview}</code>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </section>
  );
};

export default AdminInbox;
