import React from 'react';
import { Mail } from 'lucide-react';

interface AdminInboxProps {
  session: any;
  messages: any[];
  fetchMessages: () => Promise<void>;
}

const AdminInbox: React.FC<AdminInboxProps> = ({ session, messages, fetchMessages }) => {
  if (!session) return null;

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto relative z-10">
      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-emerald-500/30 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-emerald-300 flex items-center gap-2 mb-1">
              <Mail className="text-emerald-600 dark:text-emerald-400" /> Inbox Pesan Masuk ({messages.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Daftar pesan dari pengunjung yang dikirim lewat form kontak</p>
          </div>
          <button 
            onClick={fetchMessages} 
            className="px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider transition-all duration-300 border border-emerald-500/20"
          >
            Muat Ulang
          </button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada pesan masuk.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0b101e] border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-emerald-300 text-lg mb-0.5">{msg.name}</h4>
                    <span className="text-xs text-emerald-600 dark:text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md">{msg.email}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider font-bold">
                    {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
      </div>
    </section>
  );
};

export default AdminInbox;
