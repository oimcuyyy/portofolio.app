import React from 'react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { Mail, ArrowUp, Code2 } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50 dark:bg-[#04060c] text-slate-600 dark:text-slate-400 py-16 px-6 overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/5 blur-[90px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10 flex flex-col gap-10">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-slate-200/60 dark:border-white/[0.06]">
          
          {/* BRAND & SHORT BIO */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <a href="#about" className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Code2 size={13} />
              </div>
              <span className="font-mono">rochim<span className="text-emerald-500">.dev</span></span>
            </a>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Rekayasa Perangkat Lunak &bull; SMKN 20 Jakarta. Mengembangkan produk digital yang bersih, performan, dan bermakna.
            </p>
          </div>

          {/* SOCIAL LINKS */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/oimcuyyy"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              aria-label="GitHub Profile"
            >
              <FaGithub size={16} />
            </a>
            <a
              href="https://www.instagram.com/lunarxoim/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              aria-label="Instagram Profile"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="#contact"
              className="p-3 rounded-full bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              aria-label="Contact Section"
            >
              <Mail size={16} />
            </a>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-slate-200 transition-colors ml-2 cursor-pointer shadow-sm"
              aria-label="Kembali ke atas"
              title="Kembali ke atas"
            >
              <ArrowUp size={15} />
            </button>
          </div>

        </div>

        {/* BOTTOM ROW: COPYRIGHT & METRICS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 dark:text-slate-500 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} Muhammad Rochimuloh. Hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Jakarta, ID &bull; WIB (UTC+7)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
