import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Copy,
  Check,
  MessageSquare,
  Clock,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { EmailValidationState } from '../App';

interface ContactProps {
  formData: { name: string; email: string; message: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  handleSubmitMessage: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  sentSuccess: boolean;
  formError: string | null;
  setFormError: React.Dispatch<React.SetStateAction<string | null>>;
  emailValidation: EmailValidationState;
  setEmailValidation: React.Dispatch<React.SetStateAction<EmailValidationState>>;
  onVerifyEmail: (email: string) => Promise<boolean>;
}

const Contact: React.FC<ContactProps> = ({
  formData,
  setFormData,
  handleSubmitMessage,
  loading,
  sentSuccess,
  formError,
  setFormError,
  emailValidation,
  setEmailValidation,
  onVerifyEmail,
}) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const emailAddress = 'belajarmandiri03034@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="w-full min-w-0 py-16 sm:py-24 px-5 sm:px-6 max-w-5xl mx-auto relative z-10">
      
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
          <MessageSquare size={13} />
          <span>{t.contact.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.contact.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
          {t.contact.desc}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: DIRECT CONTACT DETAILS */}
        <div className="lg:col-span-5 space-y-6 min-w-0" data-aos="fade-right">
          
          {/* Quick Copy Email Card */}
          <div className="p-5 sm:p-7 rounded-[1.75rem] sm:rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#070b14]/75 shadow-lg backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Mail size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {t.contact.directEmail}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {t.contact.directEmailDesc}
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
                    <span>{t.contact.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>{t.contact.copyEmail}</span>
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
                  {t.contact.fastResponse}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t.contact.fastResponseDesc}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-white/[0.06] text-xs text-slate-500 dark:text-slate-400 font-mono">
              {language === 'id' ? 'Lokasi:' : 'Location:'} <span className="text-slate-800 dark:text-white font-semibold">Jakarta, Indonesia (WIB / GMT+7)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <div className="lg:col-span-7 min-w-0" data-aos="fade-left">
          <div className="p-6 sm:p-10 rounded-[1.75rem] sm:rounded-[2.25rem] border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#070b14]/85 shadow-2xl backdrop-blur-2xl">
            
            {sentSuccess && (
              <div
                role="status"
                className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 animate-in fade-in"
              >
                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                <p className="text-xs sm:text-sm font-medium">
                  {t.contact.successMsg}
                </p>
              </div>
            )}

            {formError && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-700 dark:text-rose-300 animate-in fade-in"
              >
                <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {formError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitMessage} className="space-y-5" noValidate>
              
              {/* Nama Lengkap */}
              <div>
                <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t.contact.nameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder={t.contact.namePlaceholder}
                  className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-base sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {t.contact.emailLabel}
                  </label>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {language === 'id' ? 'Wajib email aktif & terdaftar' : 'Active registered email required'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    required
                    aria-invalid={emailValidation.status === 'invalid'}
                    aria-describedby="email-validation-feedback"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (emailValidation.status !== 'idle') {
                        setEmailValidation({ status: 'idle' });
                      }
                      if (formError) setFormError(null);
                    }}
                    onBlur={() => {
                      if (formData.email.trim()) {
                        void onVerifyEmail(formData.email);
                      }
                    }}
                    placeholder={t.contact.emailPlaceholder}
                    className={`w-full min-h-[44px] px-4 pr-10 py-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-base sm:text-sm focus:outline-none focus:ring-1 transition-all ${
                      emailValidation.status === 'invalid'
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/40'
                        : emailValidation.status === 'valid'
                        ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-emerald-500/40'
                        : 'border-slate-200 dark:border-white/10 focus:border-emerald-500 focus:ring-emerald-500/50'
                    }`}
                  />
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                    {emailValidation.status === 'checking' && (
                      <Loader2 size={16} className="text-slate-400 animate-spin" />
                    )}
                    {emailValidation.status === 'valid' && (
                      <ShieldCheck size={16} className="text-emerald-500" />
                    )}
                    {emailValidation.status === 'invalid' && (
                      <AlertCircle size={16} className="text-rose-500" />
                    )}
                  </div>
                </div>

                {/* Inline Feedback Below Input (never on mount) */}
                {emailValidation.status !== 'idle' && (
                  <div id="email-validation-feedback" className="mt-2 space-y-1.5">
                    {emailValidation.status === 'checking' && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Loader2 size={12} className="animate-spin shrink-0" />
                        <span>{emailValidation.message}</span>
                      </p>
                    )}

                    {emailValidation.status === 'valid' && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                        <ShieldCheck size={13} className="shrink-0" />
                        <span>{emailValidation.message}</span>
                      </p>
                    )}

                    {emailValidation.status === 'invalid' && (
                      <div className="text-xs text-rose-600 dark:text-rose-400 space-y-1.5">
                        <p className="flex items-start gap-1.5 font-medium leading-relaxed">
                          <AlertCircle size={13} className="shrink-0 mt-0.5" />
                          <span>{emailValidation.message}</span>
                        </p>
                        {emailValidation.suggestion && (
                          <button
                            type="button"
                            onClick={() => {
                              const suggested = emailValidation.suggestion!;
                              setFormData({ ...formData, email: suggested });
                              setFormError(null);
                              void onVerifyEmail(suggested);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-mono text-[11px] font-semibold transition-colors cursor-pointer touch-manipulation"
                          >
                            <span>Gunakan saran: {emailValidation.suggestion}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pesan */}
              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (formError) setFormError(null);
                  }}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-base sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                />
              </div>

              {/* Submit Button with haptic state */}
              <button
                type="submit"
                disabled={loading || emailValidation.status === 'checking'}
                className="w-full min-h-[48px] py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm tracking-wide hover:bg-emerald-600 dark:hover:bg-slate-200 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl cursor-pointer touch-manipulation"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin" />
                    {t.contact.sendingBtn}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>{t.contact.sendBtn}</span>
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

export default React.memo(Contact);
