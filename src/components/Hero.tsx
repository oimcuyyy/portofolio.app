import React from 'react';
import { ArrowUpRight, Download, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// =========================================================================
// 📸 GANTI FOTO ANDA DI SINI:
// File default ada di: src/assets/profile.jpg
// Anda cukup mengganti file profile.jpg di folder src/assets/
// atau ubah import / URL di bawah ini ke file foto Anda sendiri.
// =========================================================================
import profilePhoto from '../assets/profile.jpg';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90dvh] flex items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-60 sm:w-80 h-60 sm:h-80 bg-cyan-500/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-5 sm:px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Editorial Typography & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left" data-aos="fade-up" data-aos-duration="800">
            
            {/* Live Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] dark:bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-md mb-5 sm:mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 font-mono">
                Available for Projects &amp; Collaboration
              </span>
            </div>

            {/* Main Title - Confident & Human */}
            <h1 className="text-3xl sm:text-5xl lg:text-[4.25rem] font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.12] sm:leading-[1.08] mb-5 sm:mb-6">
              Designing &amp; building{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400">
                high-caliber
              </span>{' '}
              digital products.
            </h1>

            {/* Bio Narrative */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300/80 mb-8 max-w-xl leading-relaxed">
              Halo, saya <span className="text-slate-900 dark:text-white font-semibold">Muhammad Rochimuloh</span> — Software Engineering student di SMKN 20 Jakarta. Menggabungkan arsitektur frontend modern, performa backend tangguh, dan haptic user experience.
            </p>

            {/* CTA Button Group with Nested Button-in-Button */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              
              {/* Primary Action */}
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-sm font-semibold hover:bg-emerald-600 dark:hover:bg-white active:scale-[0.98] transition-all duration-300 shadow-xl shadow-slate-900/10 dark:shadow-[0_0_35px_rgba(16,185,129,0.18)]"
              >
                <span>Lihat Karya Saya</span>
                <span className="w-8 h-8 rounded-full bg-white/15 dark:bg-black/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </span>
              </a>

              {/* Secondary Action: Download CV */}
              <a
                href="/cv-muhammadrochimuloh.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/60 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 active:scale-[0.98] backdrop-blur-md"
              >
                <Download size={15} className="text-emerald-500" />
                <span>Download CV</span>
              </a>

              {/* Tertiary Contact Link */}
              <a
                href="#contact"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
              >
                Hubungi Saya →
              </a>
            </div>

            {/* Tech Badges Minimal Row */}
            <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-white/[0.07] w-full flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[11px]">Core Stack</span>
              <span className="hover:text-emerald-400 transition-colors">React 19</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="hover:text-emerald-400 transition-colors">TypeScript</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="hover:text-emerald-400 transition-colors">Tailwind CSS</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="hover:text-emerald-400 transition-colors">Laravel &amp; Supabase</span>
            </div>

          </div>

          {/* RIGHT COLUMN: DOUBLE-BEZEL HARDWARE PROFILE PHOTO CARD */}
          <div className="lg:col-span-5 flex justify-center" data-aos="fade-left" data-aos-duration="1000">
            <div className="relative group w-full max-w-sm sm:max-w-md">
              
              {/* Outer Shell (Double-Bezel Hardware Enclosure) */}
              <div className="relative p-2.5 sm:p-3 rounded-[2.5rem] bg-gradient-to-b from-white/15 to-white/5 dark:from-white/10 dark:to-transparent border border-white/20 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                
                {/* Inner Core */}
                <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  
                  {/* The User Photo */}
                  <div className="aspect-[3/4] sm:aspect-[4/5] relative overflow-hidden bg-slate-950">
                    <img
                      src={profilePhoto}
                      alt="Muhammad Rochimuloh"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle Lighting Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60" />

                    {/* Hardware Info Overlays */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
                      <div className="px-3 py-1.5 rounded-full bg-slate-950/70 border border-white/15 backdrop-blur-md text-white font-mono flex items-center gap-1.5 shadow-lg">
                        <MapPin size={12} className="text-emerald-400" />
                        <span>Jakarta, ID</span>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    </div>

                    {/* Bottom Caption Card inside photo */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/80 border border-white/15 backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white tracking-tight">
                          Muhammad Rochimuloh
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Dev
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-normal">
                        SMKN 20 Jakarta &bull; Software Engineering
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* Floating Decorative Chip */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-3 left-2 sm:-left-6 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/15 shadow-xl backdrop-blur-xl flex items-center gap-2.5 sm:gap-3 text-xs"
              >
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs">Clean Code &amp; UI</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 font-mono">Modern Architecture</div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
