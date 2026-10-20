import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import {
  TbBrandReact,
  TbBrandNextjs,
  TbBrandTypescript,
  TbBrandTailwind,
  TbBrandLaravel,
  TbBrandPhp,
  TbBrandSupabase,
  TbBrandMysql,
  TbBrandGit,
  TbBrandGithub,
  TbBrandVite,
  TbBrandJavascript,
  TbBrandPython,
  TbBrandVue,
  TbBrandNodejs,
  TbBrandDocker,
  TbBrandFigma,
  TbBrandHtml5,
  TbBrandCss3,
  TbBrandMongodb,
  TbCode,
  TbLayersIntersect,
  TbCpu,
  TbDatabase,
  TbTool
} from 'react-icons/tb';
import { SiPostgresql } from 'react-icons/si';
import type { Skill } from '../types';
import { SpotlightCard } from './Interactive';
import { useLanguage } from '../context/LanguageContext';

interface SkillWithDesc extends Skill {
  description?: string;
  level?: string;
}

interface TechStackProps {
  skills: SkillWithDesc[];
}

interface TechBrand {
  primaryIcon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  bgClass: string;
  borderClass: string;
  secondaryBgClass?: string;
  secondaryBorderClass?: string;
}

const getTechBrand = (name: string, category: string): TechBrand => {
  const n = name.toLowerCase();

  if (n.includes('react') || n.includes('next')) {
    return {
      primaryIcon: <TbBrandReact size={22} className="text-[#61DAFB]" />,
      secondaryIcon: n.includes('next') ? <TbBrandNextjs size={20} className="text-slate-800 dark:text-white" /> : undefined,
      bgClass: 'bg-cyan-500/10',
      borderClass: 'border-cyan-500/25',
      secondaryBgClass: 'bg-slate-500/10',
      secondaryBorderClass: 'border-slate-500/25',
    };
  }

  if (n.includes('typescript') || n.includes('ts')) {
    return {
      primaryIcon: <TbBrandTypescript size={22} className="text-[#3178C6]" />,
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/25',
    };
  }

  if (n.includes('tailwind')) {
    return {
      primaryIcon: <TbBrandTailwind size={22} className="text-[#38BDF8]" />,
      bgClass: 'bg-sky-500/10',
      borderClass: 'border-sky-500/25',
    };
  }

  if (n.includes('laravel') || n.includes('php')) {
    return {
      primaryIcon: <TbBrandLaravel size={22} className="text-[#FF2D20]" />,
      secondaryIcon: n.includes('php') ? <TbBrandPhp size={22} className="text-[#777BB4]" /> : undefined,
      bgClass: 'bg-red-500/10',
      borderClass: 'border-red-500/25',
      secondaryBgClass: 'bg-indigo-500/10',
      secondaryBorderClass: 'border-indigo-500/25',
    };
  }

  if (n.includes('supabase')) {
    return {
      primaryIcon: <TbBrandSupabase size={22} className="text-[#3ECF8E]" />,
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/25',
    };
  }

  if (n.includes('postgre') || n.includes('mysql') || n.includes('sql')) {
    return {
      primaryIcon: <SiPostgresql size={20} className="text-[#4169E1]" />,
      secondaryIcon: n.includes('mysql') ? <TbBrandMysql size={22} className="text-[#00758F]" /> : undefined,
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/25',
      secondaryBgClass: 'bg-cyan-500/10',
      secondaryBorderClass: 'border-cyan-500/25',
    };
  }

  if (n.includes('git') || n.includes('github')) {
    return {
      primaryIcon: <TbBrandGit size={22} className="text-[#F05032]" />,
      secondaryIcon: <TbBrandGithub size={20} className="text-slate-800 dark:text-slate-200" />,
      bgClass: 'bg-orange-500/10',
      borderClass: 'border-orange-500/25',
      secondaryBgClass: 'bg-slate-500/10',
      secondaryBorderClass: 'border-slate-500/25',
    };
  }

  if (n.includes('vite')) {
    return {
      primaryIcon: <TbBrandVite size={22} className="text-[#646CFF]" />,
      bgClass: 'bg-purple-500/10',
      borderClass: 'border-purple-500/25',
    };
  }

  if (n.includes('javascript') || n.includes('js')) {
    return {
      primaryIcon: <TbBrandJavascript size={22} className="text-[#F7DF1E]" />,
      bgClass: 'bg-yellow-500/10',
      borderClass: 'border-yellow-500/25',
    };
  }

  if (n.includes('python')) {
    return {
      primaryIcon: <TbBrandPython size={22} className="text-[#3776AB]" />,
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/25',
    };
  }

  if (n.includes('vue')) {
    return {
      primaryIcon: <TbBrandVue size={22} className="text-[#4FC08D]" />,
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/25',
    };
  }

  if (n.includes('node')) {
    return {
      primaryIcon: <TbBrandNodejs size={22} className="text-[#5FA04E]" />,
      bgClass: 'bg-green-500/10',
      borderClass: 'border-green-500/25',
    };
  }

  if (n.includes('docker')) {
    return {
      primaryIcon: <TbBrandDocker size={22} className="text-[#2496ED]" />,
      bgClass: 'bg-sky-500/10',
      borderClass: 'border-sky-500/25',
    };
  }

  if (n.includes('figma')) {
    return {
      primaryIcon: <TbBrandFigma size={22} className="text-[#F24E1E]" />,
      bgClass: 'bg-pink-500/10',
      borderClass: 'border-pink-500/25',
    };
  }

  if (n.includes('html')) {
    return {
      primaryIcon: <TbBrandHtml5 size={22} className="text-[#E34F26]" />,
      bgClass: 'bg-orange-500/10',
      borderClass: 'border-orange-500/25',
    };
  }

  if (n.includes('css')) {
    return {
      primaryIcon: <TbBrandCss3 size={22} className="text-[#1572B6]" />,
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/25',
    };
  }

  if (n.includes('mongo')) {
    return {
      primaryIcon: <TbBrandMongodb size={22} className="text-[#47A248]" />,
      bgClass: 'bg-green-500/10',
      borderClass: 'border-green-500/25',
    };
  }

  switch (category.toLowerCase()) {
    case 'frontend':
    case 'styling':
      return {
        primaryIcon: <TbLayersIntersect size={20} className="text-emerald-400" />,
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/20',
      };
    case 'backend':
    case 'language':
      return {
        primaryIcon: <TbCpu size={20} className="text-teal-400" />,
        bgClass: 'bg-teal-500/10',
        borderClass: 'border-teal-500/20',
      };
    case 'database':
      return {
        primaryIcon: <TbDatabase size={20} className="text-cyan-400" />,
        bgClass: 'bg-cyan-500/10',
        borderClass: 'border-cyan-500/20',
      };
    case 'tools':
      return {
        primaryIcon: <TbTool size={20} className="text-emerald-400" />,
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/20',
      };
    default:
      return {
        primaryIcon: <TbCode size={20} className="text-emerald-400" />,
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/20',
      };
  }
};

const defaultTechList: (SkillWithDesc & { level: string })[] = [
  {
    id: '1',
    name: 'React 19 & Next.js',
    category: 'Frontend',
    level: 'Advanced',
    description: 'Arsitektur komponen modern, Server Components, State Management terstruktur, dan SSR/SSG untuk performa web maksimal.',
  },
  {
    id: '2',
    name: 'TypeScript',
    category: 'Language',
    level: 'Advanced',
    description: 'Sistem type-safety ketat untuk membangun kode yang scalable, mudah di-refactor, dan minim bug saat runtime.',
  },
  {
    id: '3',
    name: 'Tailwind CSS & Styling',
    category: 'Styling',
    level: 'Expert',
    description: 'Utility-first styling, desain responsif fluid, token design system konsisten, dan micro-animations berbasis Framer Motion.',
  },
  {
    id: '4',
    name: 'Laravel & PHP',
    category: 'Backend',
    level: 'Intermediate',
    description: 'Pembuatan RESTful APIs, autentikasi aman, validasi request, arsitektur MVC bersih, dan Eloquent ORM.',
  },
  {
    id: '5',
    name: 'Supabase & BaaS',
    category: 'Backend',
    level: 'Advanced',
    description: 'Database PostgreSQL cloud, Row-Level Security (RLS), OAuth/email authentication, dan real-time subscriptions.',
  },
  {
    id: '6',
    name: 'PostgreSQL & MySQL',
    category: 'Database',
    level: 'Intermediate',
    description: 'Relational schema modeling, normalisasi tabel, indexing efisien, query optimization, dan relasi multi-table.',
  },
  {
    id: '7',
    name: 'Git & Version Control',
    category: 'Tools',
    level: 'Advanced',
    description: 'Git workflow terstruktur, branch management, code review, dan kolaborasi tim development berbasis GitHub.',
  },
  {
    id: '8',
    name: 'Vite & Tooling',
    category: 'Tools',
    level: 'Advanced',
    description: 'Build tooling ultra cepat, modul bundling modern, integrasi TypeScript, dan optimasi aset produksi.',
  },
];

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools'];

const TechStack: React.FC<TechStackProps> = ({ skills }) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');

  const allSkills = skills.length > 0 ? skills.map(s => ({
    ...s,
    level: s.level || 'Competent',
    description: t.skills.items[s.name] || s.description || 'Keahlian profesional dalam membangun sistem web berkualitas tinggi.',
  })) : defaultTechList.map(s => ({
    ...s,
    description: t.skills.items[s.name] || s.description,
  }));

  const filteredSkills = activeCategory === 'All'
    ? allSkills
    : allSkills.filter(item => {
        if (activeCategory === 'Frontend') return item.category === 'Frontend' || item.category === 'Styling';
        if (activeCategory === 'Backend') return item.category === 'Backend' || item.category === 'Language';
        if (activeCategory === 'Database') return item.category === 'Database';
        if (activeCategory === 'Tools') return item.category === 'Tools';
        return true;
      });

  return (
    <section id="skills" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6" data-aos="fade-up">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
            <Sparkles size={12} />
            <span>{t.skills.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.skills.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            {t.skills.desc}
          </p>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] self-start md:self-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'All' ? t.skills.filterAll : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ASYMMETRIC BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredSkills.map((skill, index) => {
          const isHighlight = index === 0 || index === 3;
          const brand = getTechBrand(skill.name, skill.category);

          return (
            <SpotlightCard
              key={skill.id || index}
              className={`flex flex-col justify-between transition-all duration-300 ${
                isHighlight ? 'md:col-span-2 bg-gradient-to-br from-white/70 via-white/50 to-emerald-500/[0.03] dark:from-[#0b1020]/80 dark:via-[#070b14]/70 dark:to-emerald-950/20' : ''
              }`}
            >
              <div className="p-6 sm:p-7 flex flex-col h-full" data-aos="fade-up" data-aos-delay={index * 40}>
                
                {/* Card Top: Brand Logo(s) & Category Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-2xl ${brand.bgClass} border ${brand.borderClass} flex items-center justify-center shadow-sm transition-transform duration-300 hover:scale-110`}>
                      {brand.primaryIcon}
                    </div>
                    {brand.secondaryIcon && (
                      <div className={`w-10 h-10 rounded-2xl ${brand.secondaryBgClass || brand.bgClass} border ${brand.secondaryBorderClass || brand.borderClass} flex items-center justify-center shadow-sm transition-transform duration-300 hover:scale-110`}>
                        {brand.secondaryIcon}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.07]">
                    {skill.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span>{skill.name}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Card Bottom: Proficiency Tag */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 dark:text-slate-500">{t.skills.proficiency}</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 size={12} />
                    {skill.level}
                  </span>
                </div>

              </div>
            </SpotlightCard>
          );
        })}
      </div>

    </section>
  );
};

export default TechStack;


