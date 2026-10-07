import React from 'react';
import { GraduationCap, BookOpen, Calendar, MapPin, Award, CheckCircle } from 'lucide-react';
import { SpotlightCard } from './Interactive';

const journeyItems = [
  {
    period: '2025 — Sekarang',
    status: 'Sedang Berlangsung',
    role: 'Siswa Rekayasa Perangkat Lunak (RPL)',
    institution: 'SMKN 20 Jakarta',
    location: 'Jakarta Selatan, Indonesia',
    type: 'Pendidikan Vokasi',
    description:
      'Mendalami kurikulum rekayasa perangkat lunak terapan yang mencakup siklus pengembangan perangkat lunak (SDLC), logika algoritma pemrograman, perancangan database relasional, serta pembuatan aplikasi web modern berbasis frontend & backend.',
    highlights: [
      'Pemrograman Web Dasar hingga Mahir (HTML, CSS, JS/TS, React)',
      'Manajemen Database Relasional (MySQL, PostgreSQL, Supabase)',
      'Backend Programming dengan PHP & Laravel Framework',
      'Kolaborasi tim dan version control terstruktur via GitHub',
    ],
  },
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 px-6 max-w-5xl mx-auto relative z-10">
      
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
          <GraduationCap size={14} />
          <span>Academic &amp; Growth Path</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pendidikan &amp; perjalanan keahlian.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
          Dedikasi pembelajaran konsisten di bidang software engineering dan eksplorasi teknologi web modern.
        </p>
      </div>

      {/* TIMELINE CONTAINER */}
      <div className="space-y-8" data-aos="fade-up" data-aos-delay="100">
        {journeyItems.map((item, index) => (
          <SpotlightCard
            key={index}
            className="p-8 sm:p-10 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#070b14]/70 shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    {item.type}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] flex items-center gap-1.5">
                    <Calendar size={12} className="text-emerald-500" />
                    {item.period}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {item.role}
                </h3>
                <h4 className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
                  <span>{item.institution}</span>
                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-normal flex items-center gap-1">
                    <MapPin size={12} />
                    {item.location}
                  </span>
                </h4>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <BookOpen size={22} />
              </div>

            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300/80 leading-relaxed mb-6">
              {item.description}
            </p>

            {/* KEY HIGHLIGHTS / SUBJECTS */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-white/[0.08]">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <Award size={13} className="text-emerald-500" />
                <span>Fokus Pembelajaran &amp; Kompetensi</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {item.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

          </SpotlightCard>
        ))}
      </div>

    </section>
  );
};

export default Experience;
