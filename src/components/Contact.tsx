import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Copy, Check, MessageSquare, Clock } from 'lucide-react';

interface ContactProps {
  formData: { name: string; email: string; message: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  handleSubmitMessage: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  sentSuccess: boolean;
}

const Contact: React.FC<ContactProps> = ({
  formData,
  setFormData,
  handleSubmitMessage,
  loading,
  sentSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'belajarmandiri03034@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-5xl mx-auto relative z-10">
      
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
          <MessageSquare size={13} />
          <span>Get In Touch</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Mari berdiskusi &amp; bangun sesuatu.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
          Punya tawaran proyek, peluang magang, atau sekadar ingin berdiskusi mengenai teknologi? Pintu komunikasi selalu terbuka.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: DIRECT CONTACT DETAILS */}
        <div className="lg:col-span-5 space-y-6" data-aos="fade-right">
          
          {/* Quick Copy Email Card */}
          <div className="p-7 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#070b14]/75 shadow-lg backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Mail size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Email Langsung
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Kirim email langsung untuk pertanyaan kerja sama atau rekrutmen.
            </p>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08]">
              <span className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate">
                {emailAddress}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="ml-2 px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Availability Status Card */}
          <div className="p-7 rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#070b14]/75 shadow-lg backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Waktu Respon
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Biasanya membalas dalam waktu &lt; 24 jam kerja.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-white/[0.06] text-xs text-slate-500 dark:text-slate-400 font-mono">
              Lokasi: <span className="text-slate-800 dark:text-white font-semibold">Jakarta, Indonesia (WIB / GMT+7)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <div className="lg:col-span-7" data-aos="fade-left">
          <div className="p-8 sm:p-10 rounded-[2.25rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#070b14]/85 shadow-2xl backdrop-blur-2xl">
            
            {sentSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                <p className="text-xs sm:text-sm font-medium">
                  Pesan Anda berhasil terkirim. Terima kasih, saya akan segera menghubungi kembali!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitMessage} className="space-y-5">
              
              {/* Nama Lengkap */}
              <div>
                <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Pratama"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Alamat Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@domain.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              {/* Pesan */}
              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Pesan / Keperluan Proyek
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ceritakan gambaran proyek atau pertanyaan yang ingin Anda diskusikan..."
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                />
              </div>

              {/* Submit Button with haptic state */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm tracking-wide hover:bg-emerald-600 dark:hover:bg-slate-200 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin" />
                    Mengirim Pesan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Kirim Pesan Sekarang</span>
                    <Send size={15} />
                  </span>
                )}
              </button>

            </form>

          </div>
        </div>

      </div>

    </section>
  );
};

export default Contact;
