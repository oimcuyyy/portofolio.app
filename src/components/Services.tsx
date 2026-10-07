import React from 'react';
import { Layout, Server, Sparkles, Compass, Zap } from 'lucide-react';
import { SpotlightCard } from './Interactive';

const disciplines = [
  {
    number: '01',
    title: 'Modern Frontend Architecture',
    subtitle: 'Responsive, fluid & accessible interfaces',
    description:
      'Membangun antarmuka web interaktif berbasis React 19 dan Next.js dengan optimasi Core Web Vitals, tipografi proporsional, serta animasi mikroskopik yang responsif terhadap setiap aksi pengguna.',
    icon: <Layout className="text-emerald-400" size={24} />,
    tags: ['React 19', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    number: '02',
    title: 'Robust Backend & API Integration',
    subtitle: 'Scalable data structures & secure services',
    description:
      'Merancang REST API terstruktur dan manajemen database relasional (PostgreSQL, MySQL, Supabase, Laravel) dengan validasi ketat, autentikasi aman, dan performa query yang cepat.',
    icon: <Server className="text-teal-400" size={24} />,
    tags: ['Laravel', 'PHP', 'Supabase', 'PostgreSQL REST'],
  },
  {
    number: '03',
    title: 'Tactile UI/UX & Interaction Design',
    subtitle: 'Crafted details without digital slop',
    description:
      'Mengutamakan estetika visual yang tidak monoton — palet warna terkalibrasi, kontras WCAG yang nyaman di mata, hierarki layout asimetris, dan kenyamanan navigasi di semua ukuran layar.',
    icon: <Sparkles className="text-cyan-400" size={24} />,
    tags: ['Design Systems', 'Haptic Micro-interactions', 'Dark Mode'],
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      
      {/* SECTION HEADER */}
      <div className="max-w-2xl mb-16" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Compass size={14} />
          <span>Core Disciplines</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Prinsip &amp; pendekatan rekayasa digital.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
          Mengedepankan craftsmanship kode yang teruji, kecepatan eksekusi, dan pengalaman visual yang elegan.
        </p>
      </div>

      {/* STAGGERED VALUE CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        {disciplines.map((item, index) => (
          <SpotlightCard
            key={item.number}
            className="flex flex-col justify-between p-8 sm:p-9 bg-white/70 dark:bg-[#070b14]/70 border border-slate-200/80 dark:border-white/10 group hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            <div data-aos="fade-up" data-aos-delay={index * 100}>
              
              {/* Header: Number & Icon */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-2xl font-extrabold text-emerald-500/50 dark:text-emerald-400/40 group-hover:text-emerald-500 transition-colors">
                  {item.number}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400/80 mb-4">
                {item.subtitle}
              </p>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                {item.description}
              </p>

            </div>

            {/* Tags footer */}
            <div className="pt-5 border-t border-slate-200/60 dark:border-white/[0.06] flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06]"
                >
                  {tag}
                </span>
              ))}
            </div>

          </SpotlightCard>
        ))}
      </div>

      {/* QUICK VALUE BANNER */}
      <div
        className="mt-12 p-6 sm:p-8 rounded-[2rem] border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-6"
        data-aos="fade-up"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Zap size={22} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Performansi &amp; Desain Tanpa Kompromi
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Setiap baris kode dioptimasi untuk kecepatan render, aksesibilitas keyboard, dan user experience maksimal.
            </p>
          </div>
        </div>
        <a
          href="#contact"
          className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold tracking-wide uppercase hover:bg-emerald-600 dark:hover:bg-slate-200 transition-colors shrink-0"
        >
          Mulai Diskusi
        </a>
      </div>

    </section>
  );
};

export default Services;
