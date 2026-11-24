import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  ExternalLink,
  X,
  Play,
  BookOpen,
  Code2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
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
import { useLanguage } from '../context/LanguageContext';

export interface YouTubeResource {
  title: string;
  channel: string;
  url: string;
  note: string;
}

export interface SkillWithDesc extends Skill {
  description?: string;
  level?: string;
  tags?: string[];
  experience?: string;
  proficiencyScore?: number;
  youtube?: YouTubeResource;
  learnings?: string[];
  portfolioImplementation?: string;
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
  spotlightColor: string;
  accentColor: string;
  pillColor: string;
}

const getTechBrand = (name: string, category: string): TechBrand => {
  const n = name.toLowerCase();

  if (n.includes('react') || n.includes('next')) {
    return {
      primaryIcon: <TbBrandReact size={24} className="text-[#61DAFB]" />,
      secondaryIcon: n.includes('next') ? <TbBrandNextjs size={22} className="text-slate-800 dark:text-white" /> : undefined,
      bgClass: 'bg-cyan-500/10',
      borderClass: 'border-cyan-500/25',
      secondaryBgClass: 'bg-slate-500/10',
      secondaryBorderClass: 'border-slate-500/25',
      spotlightColor: 'rgba(97, 218, 251, 0.20)',
      accentColor: '#61DAFB',
      pillColor: 'text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
    };
  }

  if (n.includes('typescript') || n.includes('ts')) {
    return {
      primaryIcon: <TbBrandTypescript size={24} className="text-[#3178C6]" />,
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/25',
      spotlightColor: 'rgba(49, 120, 198, 0.22)',
      accentColor: '#3178C6',
      pillColor: 'text-blue-600 dark:text-blue-300 bg-blue-500/10 border-blue-500/20',
    };
  }

  if (n.includes('tailwind')) {
    return {
      primaryIcon: <TbBrandTailwind size={24} className="text-[#38BDF8]" />,
      bgClass: 'bg-sky-500/10',
      borderClass: 'border-sky-500/25',
      spotlightColor: 'rgba(56, 189, 248, 0.20)',
      accentColor: '#38BDF8',
      pillColor: 'text-sky-600 dark:text-sky-300 bg-sky-500/10 border-sky-500/20',
    };
  }

  if (n.includes('laravel') || n.includes('php')) {
    return {
      primaryIcon: <TbBrandLaravel size={24} className="text-[#FF2D20]" />,
      secondaryIcon: n.includes('php') ? <TbBrandPhp size={24} className="text-[#777BB4]" /> : undefined,
      bgClass: 'bg-red-500/10',
      borderClass: 'border-red-500/25',
      secondaryBgClass: 'bg-indigo-500/10',
      secondaryBorderClass: 'border-indigo-500/25',
      spotlightColor: 'rgba(255, 45, 32, 0.20)',
      accentColor: '#FF2D20',
      pillColor: 'text-red-600 dark:text-red-300 bg-red-500/10 border-red-500/20',
    };
  }

  if (n.includes('supabase')) {
    return {
      primaryIcon: <TbBrandSupabase size={24} className="text-[#3ECF8E]" />,
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/25',
      spotlightColor: 'rgba(62, 207, 142, 0.22)',
      accentColor: '#3ECF8E',
      pillColor: 'text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    };
  }

  if (n.includes('postgre') || n.includes('mysql') || n.includes('sql')) {
    return {
      primaryIcon: <SiPostgresql size={22} className="text-[#4169E1]" />,
      secondaryIcon: n.includes('mysql') ? <TbBrandMysql size={24} className="text-[#00758F]" /> : undefined,
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/25',
      secondaryBgClass: 'bg-cyan-500/10',
      secondaryBorderClass: 'border-cyan-500/25',
      spotlightColor: 'rgba(65, 105, 225, 0.22)',
      accentColor: '#4169E1',
      pillColor: 'text-blue-600 dark:text-blue-300 bg-blue-500/10 border-blue-500/20',
    };
  }

  if (n.includes('git') || n.includes('github')) {
    return {
      primaryIcon: <TbBrandGit size={24} className="text-[#F05032]" />,
      secondaryIcon: <TbBrandGithub size={22} className="text-slate-800 dark:text-slate-200" />,
      bgClass: 'bg-orange-500/10',
      borderClass: 'border-orange-500/25',
      secondaryBgClass: 'bg-slate-500/10',
      secondaryBorderClass: 'border-slate-500/25',
      spotlightColor: 'rgba(240, 80, 50, 0.20)',
      accentColor: '#F05032',
      pillColor: 'text-orange-600 dark:text-orange-300 bg-orange-500/10 border-orange-500/20',
    };
  }

  if (n.includes('vite')) {
    return {
      primaryIcon: <TbBrandVite size={24} className="text-[#646CFF]" />,
      bgClass: 'bg-purple-500/10',
      borderClass: 'border-purple-500/25',
      spotlightColor: 'rgba(100, 108, 255, 0.24)',
      accentColor: '#646CFF',
      pillColor: 'text-purple-600 dark:text-purple-300 bg-purple-500/10 border-purple-500/20',
    };
  }

  if (n.includes('javascript') || n.includes('js')) {
    return {
      primaryIcon: <TbBrandJavascript size={24} className="text-[#F7DF1E]" />,
      bgClass: 'bg-yellow-500/10',
      borderClass: 'border-yellow-500/25',
      spotlightColor: 'rgba(247, 223, 30, 0.20)',
      accentColor: '#F7DF1E',
      pillColor: 'text-yellow-600 dark:text-yellow-300 bg-yellow-500/10 border-yellow-500/20',
    };
  }

  if (n.includes('python')) {
    return {
      primaryIcon: <TbBrandPython size={24} className="text-[#3776AB]" />,
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/25',
      spotlightColor: 'rgba(55, 118, 171, 0.20)',
      accentColor: '#3776AB',
      pillColor: 'text-blue-600 dark:text-blue-300 bg-blue-500/10 border-blue-500/20',
    };
  }

  if (n.includes('vue')) {
    return {
      primaryIcon: <TbBrandVue size={24} className="text-[#4FC08D]" />,
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/25',
      spotlightColor: 'rgba(79, 192, 141, 0.20)',
      accentColor: '#4FC08D',
      pillColor: 'text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    };
  }

  if (n.includes('node')) {
    return {
      primaryIcon: <TbBrandNodejs size={24} className="text-[#5FA04E]" />,
      bgClass: 'bg-green-500/10',
      borderClass: 'border-green-500/25',
      spotlightColor: 'rgba(95, 160, 78, 0.20)',
      accentColor: '#5FA04E',
      pillColor: 'text-green-600 dark:text-green-300 bg-green-500/10 border-green-500/20',
    };
  }

  if (n.includes('docker')) {
    return {
      primaryIcon: <TbBrandDocker size={24} className="text-[#2496ED]" />,
      bgClass: 'bg-sky-500/10',
      borderClass: 'border-sky-500/25',
      spotlightColor: 'rgba(36, 150, 237, 0.20)',
      accentColor: '#2496ED',
      pillColor: 'text-sky-600 dark:text-sky-300 bg-sky-500/10 border-sky-500/20',
    };
  }

  if (n.includes('figma')) {
    return {
      primaryIcon: <TbBrandFigma size={24} className="text-[#F24E1E]" />,
      bgClass: 'bg-pink-500/10',
      borderClass: 'border-pink-500/25',
      spotlightColor: 'rgba(242, 78, 30, 0.20)',
      accentColor: '#F24E1E',
      pillColor: 'text-pink-600 dark:text-pink-300 bg-pink-500/10 border-pink-500/20',
    };
  }

  if (n.includes('html')) {
    return {
      primaryIcon: <TbBrandHtml5 size={24} className="text-[#E34F26]" />,
      bgClass: 'bg-orange-500/10',
      borderClass: 'border-orange-500/25',
      spotlightColor: 'rgba(227, 79, 38, 0.20)',
      accentColor: '#E34F26',
      pillColor: 'text-orange-600 dark:text-orange-300 bg-orange-500/10 border-orange-500/20',
    };
  }

  if (n.includes('css')) {
    return {
      primaryIcon: <TbBrandCss3 size={24} className="text-[#1572B6]" />,
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/25',
      spotlightColor: 'rgba(21, 114, 182, 0.20)',
      accentColor: '#1572B6',
      pillColor: 'text-blue-600 dark:text-blue-300 bg-blue-500/10 border-blue-500/20',
    };
  }

  if (n.includes('mongo')) {
    return {
      primaryIcon: <TbBrandMongodb size={24} className="text-[#47A248]" />,
      bgClass: 'bg-green-500/10',
      borderClass: 'border-green-500/25',
      spotlightColor: 'rgba(71, 162, 72, 0.20)',
      accentColor: '#47A248',
      pillColor: 'text-green-600 dark:text-green-300 bg-green-500/10 border-green-500/20',
    };
  }

  switch (category.toLowerCase()) {
    case 'frontend':
    case 'styling':
      return {
        primaryIcon: <TbLayersIntersect size={22} className="text-emerald-400" />,
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/20',
        spotlightColor: 'rgba(16, 185, 129, 0.18)',
        accentColor: '#10B981',
        pillColor: 'text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
      };
    case 'backend':
    case 'language':
      return {
        primaryIcon: <TbCpu size={22} className="text-teal-400" />,
        bgClass: 'bg-teal-500/10',
        borderClass: 'border-teal-500/20',
        spotlightColor: 'rgba(20, 184, 166, 0.18)',
        accentColor: '#14B8A6',
        pillColor: 'text-teal-600 dark:text-teal-300 bg-teal-500/10 border-teal-500/20',
      };
    case 'database':
      return {
        primaryIcon: <TbDatabase size={22} className="text-cyan-400" />,
        bgClass: 'bg-cyan-500/10',
        borderClass: 'border-cyan-500/20',
        spotlightColor: 'rgba(6, 182, 212, 0.18)',
        accentColor: '#06B6D4',
        pillColor: 'text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
      };
    case 'tools':
      return {
        primaryIcon: <TbTool size={22} className="text-emerald-400" />,
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/20',
        spotlightColor: 'rgba(16, 185, 129, 0.18)',
        accentColor: '#10B981',
        pillColor: 'text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
      };
    default:
      return {
        primaryIcon: <TbCode size={22} className="text-emerald-400" />,
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/20',
        spotlightColor: 'rgba(16, 185, 129, 0.18)',
        accentColor: '#10B981',
        pillColor: 'text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
      };
  }
};

const defaultTechList: (SkillWithDesc & {
  level: string;
  tags: string[];
  experience: string;
  proficiencyScore: number;
  youtube: YouTubeResource;
  learnings: string[];
  portfolioImplementation: string;
})[] = [
  {
    id: '1',
    name: 'React 19 & Next.js',
    category: 'Frontend',
    level: 'Advanced',
    description: 'Arsitektur komponen modern, Server Components, State Management terstruktur, dan SSR/SSG untuk performa web maksimal.',
    tags: ['Server Components', 'App Router', 'Custom Hooks', 'Suspense', 'SSR / SSG'],
    experience: 'Core Frontend',
    proficiencyScore: 92,
    youtube: {
      title: 'React JS Tutorial untuk Pemula',
      channel: 'Web Programming UNPAS (Sandhika Galih)',
      url: 'https://www.youtube.com/watch?v=5kHyviqjhCk',
      note: 'Membahas konsep dasar komponen, JSX, reactive state, custom hooks, hingga arsitektur modern Next.js App Router.',
    },
    learnings: [
      'Pemisahan komponen client vs server components untuk kecepatan rendering maksimal',
      'Manajemen state global reaktif tanpa props drilling menggunakan Context API',
      'Optimasi Core Web Vitals (LCP & INP) dengan lazy loading dan dynamic code splitting',
      'Pemanfaatan React 19 Hooks & Compiler untuk minim re-render yang tidak perlu',
    ],
    portfolioImplementation: 'Diimplementasikan langsung pada seluruh antarmuka portofolio ini, Senja Music Player, serta sistem multi-language context switcher.',
  },
  {
    id: '2',
    name: 'TypeScript',
    category: 'Language',
    level: 'Advanced',
    description: 'Sistem type-safety ketat untuk membangun kode yang scalable, mudah di-refactor, dan minim bug saat runtime.',
    tags: ['Generics', 'Strict Type Checking', 'Utility Types', 'Zod Schema'],
    experience: 'Type-Safe Architecture',
    proficiencyScore: 88,
    youtube: {
      title: 'Tutorial TypeScript Dasar untuk Pemula',
      channel: 'Programmer Zaman Now (Eko Kurniawan Khannedy)',
      url: 'https://www.youtube.com/watch?v=0wQv7n32z_0',
      note: 'Mempelajari cara kerja compiler TypeScript, static typing, interfaces, generics, dan integrasi dengan project modern.',
    },
    learnings: [
      'Pencegahan runtime type mismatch dengan compile-time static type checking',
      'Penggunaan Generics dan Type Inference untuk reusable data structures',
      'Validasi runtime data payload menggunakan TypeScript contracts & Zod',
      'Pembuatan declaration types (.d.ts) terstruktur untuk multi-module projects',
    ],
    portfolioImplementation: 'Semua komponen, state audio Senja, API responses, dan data lyrics di portofolio ini dibangun dengan tipe ketat (strict mode 100%).',
  },
  {
    id: '3',
    name: 'Tailwind CSS & Styling',
    category: 'Styling',
    level: 'Expert',
    description: 'Utility-first styling, desain responsif fluid, token design system konsisten, dan micro-animations berbasis Framer Motion.',
    tags: ['Fluid Responsive', 'Framer Motion', 'Design Tokens', 'Glassmorphism'],
    experience: 'Tactile Polish',
    proficiencyScore: 95,
    youtube: {
      title: 'Tailwind CSS Full Course untuk Pemula',
      channel: 'Web Programming UNPAS (Sandhika Galih)',
      url: 'https://www.youtube.com/watch?v=z3slaXqmkT0',
      note: 'Panduan lengkap utility-first CSS, custom config tema, arbitrary values, dan pembuatan layout responsif mobile-first.',
    },
    learnings: [
      'Penyusunan fluid layout responsive (mobile, tablet, desktop) tanpa CSS eksternal berantakan',
      'Integrasi token warna CSS variables untuk seamless Dark / Light Mode transition',
      'Penerapan haptic physics & spring curves melalui Framer Motion animations',
      'Eksplorasi estetika modern (double-bezel hardware styling, subtle mesh, frosted glassmorphism)',
    ],
    portfolioImplementation: 'Seluruh sistem styling, animasi perpindahan tema musik, kartu spotlight, dan modal lirik interaktif portofolio ini.',
  },
  {
    id: '4',
    name: 'Laravel & PHP',
    category: 'Backend',
    level: 'Intermediate',
    description: 'Pembuatan RESTful APIs, autentikasi aman, validasi request, arsitektur MVC bersih, dan Eloquent ORM.',
    tags: ['RESTful API', 'Eloquent ORM', 'Sanctum Auth', 'MVC Architecture'],
    experience: 'Backend Services',
    proficiencyScore: 80,
    youtube: {
      title: 'Tutorial Laravel 11 untuk Pemula',
      channel: 'Web Programming UNPAS (Sandhika Galih)',
      url: 'https://www.youtube.com/watch?v=HqAMb6k6C04',
      note: 'Eksplorasi arsitektur Model-View-Controller (MVC), migrasi database, Eloquent relationship, dan backend RESTful API.',
    },
    learnings: [
      'Perancangan endpoint REST API terstandarisasi dengan HTTP status codes yang tepat',
      'Manajemen relasi database multi-tabel via Eloquent ORM (One-to-Many, Many-to-Many)',
      'Pengamanan endpoint dengan token-based authentication (Laravel Sanctum)',
      'Validasi request ketat dan sanitasi input untuk mencegah celah keamanan (SQLi / XSS)',
    ],
    portfolioImplementation: 'Digunakan sebagai pondasi backend sistem manajemen data siswa dan tugas aplikasi berbasis web di lingkungan akademik SMK.',
  },
  {
    id: '5',
    name: 'Supabase & BaaS',
    category: 'Backend',
    level: 'Advanced',
    description: 'Database PostgreSQL cloud, Row-Level Security (RLS), OAuth/email authentication, dan real-time subscriptions.',
    tags: ['Row-Level Security', 'Realtime Channels', 'Postgres Functions', 'OAuth'],
    experience: 'Cloud & BaaS',
    proficiencyScore: 86,
    youtube: {
      title: 'Bikin Backend & Database Instan dengan Supabase',
      channel: 'Dea Afrizal',
      url: 'https://www.youtube.com/watch?v=zBZgdTb-dns',
      note: 'Memahami konsep Backend-as-a-Service (BaaS), koneksi PostgreSQL cloud, otentikasi aman, dan table policy security.',
    },
    learnings: [
      'Penerapan Row-Level Security (RLS) policies untuk hak akses data per-user yang aman',
      'Sinkronisasi data real-time menggunakan WebSockets channels (Realtime Listeners)',
      'Integrasi autentikasi email & OAuth pihak ketiga secara seamless',
      'Pengelolaan Cloud Storage untuk asset uploads dan media streaming',
    ],
    portfolioImplementation: 'Menyimpan pesan form inbox kontak admin secara live dan data project dinamis dengan proteksi RLS.',
  },
  {
    id: '6',
    name: 'PostgreSQL & MySQL',
    category: 'Database',
    level: 'Intermediate',
    description: 'Relational schema modeling, normalisasi tabel, indexing efisien, query optimization, dan relasi multi-table.',
    tags: ['Schema Design', 'Table Normalization', 'Query Tuning', 'Relational DB'],
    experience: 'Data Integrity',
    proficiencyScore: 82,
    youtube: {
      title: 'Tutorial MySQL Database Lengkap dari Dasar',
      channel: 'Programmer Zaman Now (Eko Kurniawan Khannedy)',
      url: 'https://www.youtube.com/watch?v=xYBclb-NeMA',
      note: 'Dasar query relational database (DDL, DML), normalisasi tabel, primary key, foreign key, dan JOIN optimization.',
    },
    learnings: [
      'Perancangan Entity Relationship Diagram (ERD) dan normalisasi database (1NF - 3NF)',
      'Optimasi performa query dengan Indexing terukur pada kolom yang sering dicari',
      'Penggunaan SQL Joins (INNER, LEFT, RIGHT) dan transactional integrity (ACID)',
      'Pencegahan anomali data melalui foreign key constraints & cascading rules',
    ],
    portfolioImplementation: 'Digunakan pada seluruh skema penyimpanan data relasional aplikasi web lokal dan integrasi cloud SQL.',
  },
  {
    id: '7',
    name: 'Git & Version Control',
    category: 'Tools',
    level: 'Advanced',
    description: 'Git workflow terstruktur, branch management, code review, dan kolaborasi tim development berbasis GitHub.',
    tags: ['Branch Strategy', 'Conventional Commits', 'Pull Requests', 'GitHub Actions'],
    experience: 'Team Workflow',
    proficiencyScore: 90,
    youtube: {
      title: 'Tutorial Git & GitHub Lengkap untuk Pemula',
      channel: 'Web Programming UNPAS (Sandhika Galih)',
      url: 'https://www.youtube.com/watch?v=l-F9VnJbUHQ',
      note: 'Membahas command dasar git (commit, push, pull, branch), resolusi merge conflict, hingga alur pull request di GitHub.',
    },
    learnings: [
      'Workflow branching terorganisir (main, feature branches, fix branches)',
      'Penerapan Conventional Commits (feat, fix, refactor, chore) untuk riwayat bersih',
      'Resolusi konflik merge dengan teliti tanpa merusak codebase rekan tim',
      'Automasi CI/CD deployment via GitHub Actions terhubung ke Vercel',
    ],
    portfolioImplementation: 'Seluruh riwayat pengembangan portofolio ini dikelola teratur di repository GitHub publik dengan automated deployment ke Vercel.',
  },
  {
    id: '8',
    name: 'Vite & Tooling',
    category: 'Tools',
    level: 'Advanced',
    description: 'Build tooling ultra cepat, modul bundling modern, integrasi TypeScript, dan optimasi aset produksi.',
    tags: ['Lightning HMR', 'Rollup / ESBuild', 'Bundle Optimization', 'Code Splitting'],
    experience: 'DX & Build Engine',
    proficiencyScore: 89,
    youtube: {
      title: 'Vite in 100 Seconds & Modern Build Tooling',
      channel: 'Fireship',
      url: 'https://www.youtube.com/watch?v=KCrXgy8qtjM',
      note: 'Penjelasan mengapa Vite menggantikan Webpack dengan kecepatan Cold Start instan dan Hot Module Replacement (HMR) berbasis ESBuild.',
    },
    learnings: [
      'Konfigurasi Vite build pipeline dengan plugin ekosistem modern',
      'Optimasi bundle chunking dan code splitting untuk download size di bawah 200kB',
      'Penataan static assets caching, compression (gzip), dan responsive image pipeline',
      'Pengaturan alias path (@/components) dan TypeScript loader terintegrasi',
    ],
    portfolioImplementation: 'Menjadi bundler utama portofolio ini yang memungkinkan kompilasi produksi super cepat (~2 detik) dan HMR instan.',
  },
];

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools'];

// Category icon helper for tactile navigation
const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'All':
      return <Sparkles size={13} className="shrink-0 text-emerald-500" />;
    case 'Frontend':
      return <TbLayersIntersect size={14} className="shrink-0 text-cyan-400" />;
    case 'Backend':
      return <TbCpu size={14} className="shrink-0 text-red-400" />;
    case 'Database':
      return <TbDatabase size={14} className="shrink-0 text-blue-400" />;
    case 'Tools':
      return <TbTool size={14} className="shrink-0 text-purple-400" />;
    default:
      return <Sparkles size={13} className="shrink-0" />;
  }
};

// Helper for 4-pip mastery indicator
const getProficiencyPips = (level: string) => {
  const l = level.toLowerCase();
  if (l.includes('expert') || l.includes('master')) return 4;
  if (l.includes('advanced')) return 3;
  if (l.includes('intermediate') || l.includes('competent')) return 2;
  return 1;
};

const TechStack: React.FC<TechStackProps> = ({ skills }) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState<SkillWithDesc | null>(null);

  // Sync ESC key & body scroll lock when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSkill) {
        setSelectedSkill(null);
      }
    };
    if (selectedSkill) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSkill]);

  const allSkills: SkillWithDesc[] = skills.length > 0 ? skills.map(s => {
    const defaultItem = defaultTechList.find(d => d.name.toLowerCase() === s.name.toLowerCase());
    return {
      ...s,
      level: s.level || defaultItem?.level || 'Competent',
      description: t.skills.items[s.name] || s.description || defaultItem?.description || 'Keahlian profesional dalam membangun sistem web berkualitas tinggi.',
      tags: defaultItem?.tags || ['Production Ready', 'Architecture', 'Clean Code'],
      experience: defaultItem?.experience || s.category,
      proficiencyScore: defaultItem?.proficiencyScore || 85,
      youtube: defaultItem?.youtube || {
        title: `Tutorial ${s.name} untuk Pemula`,
        channel: 'YouTube Developer Community',
        url: `https://www.youtube.com/results?search_query=tutorial+${encodeURIComponent(s.name)}`,
        note: `Mempelajari fundamental dan implementasi nyata ${s.name} untuk kebutuhan software engineering.`,
      },
      learnings: defaultItem?.learnings || [
        `Penguasaan konsep fundamental dan arsitektur ${s.name}`,
        'Praktik clean code dan efisiensi penulisan algoritma',
        'Integrasi dengan komponen sistem web modern',
        'Debugging dan penanganan error secara terstruktur',
      ],
      portfolioImplementation: defaultItem?.portfolioImplementation || `Diterapkan dalam arsitektur portofolio dan proyek perangkat lunak terkini.`,
    };
  }) : defaultTechList.map(s => ({
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

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return allSkills.length;
    return allSkills.filter(item => {
      if (cat === 'Frontend') return item.category === 'Frontend' || item.category === 'Styling';
      if (cat === 'Backend') return item.category === 'Backend' || item.category === 'Language';
      if (cat === 'Database') return item.category === 'Database';
      if (cat === 'Tools') return item.category === 'Tools';
      return false;
    }).length;
  };

  return (
    <section id="skills" className="w-full max-w-full md:max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-20 sm:pb-28 relative z-10 scroll-mt-28 sm:scroll-mt-36 overflow-hidden box-border">
      
      {/* SECTION HEADER */}
      <div className="w-full max-w-full overflow-hidden mb-8 sm:mb-12" data-aos="fade-up">
        <div className="w-full max-w-2xl mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] sm:text-xs uppercase tracking-wider mb-3">
            <Sparkles size={12} className="animate-spin-slow shrink-0" />
            <span className="truncate max-w-[190px] sm:max-w-none">{t.skills.badge}</span>
            <span className="w-1 h-1 rounded-full bg-emerald-500/40 shrink-0" />
            <span className="text-[10px] text-emerald-500/80 font-normal shrink-0">Interactive Stream</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
            {t.skills.title}
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 mt-2.5 sm:mt-3.5 leading-relaxed">
            Klik skill mana saja untuk melihat catatan materi yang saya pelajari dan rekomendasi video YouTube tempat saya belajar.
          </p>
        </div>

        {/* SLEEK SINGLE-LINE CATEGORY NAVBAR (MOBILE SCROLL-FRIENDLY, TIDAK BLOWOUT) */}
        <div className="w-full max-w-full min-w-0 pb-3 border-b border-slate-200/60 dark:border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Scrollable Tabs Wrapper */}
          <div className="w-full max-w-full sm:w-auto min-w-0 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
            <div className="inline-flex items-center gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const count = getCategoryCount(cat);

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-3.5 sm:px-4 py-2 sm:py-2 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-semibold cursor-pointer transition-colors duration-200 select-none whitespace-nowrap flex items-center gap-1.5 sm:gap-2 shrink-0 touch-manipulation ${
                      isActive
                        ? 'text-white dark:text-slate-950 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {/* Smooth spring sliding background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSkillTabIndicator"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="absolute inset-0 rounded-xl bg-slate-900 dark:bg-white shadow-sm z-0"
                      />
                    )}
                    
                    <span className="relative z-10 inline-flex items-center gap-1.5 sm:gap-2">
                      {getCategoryIcon(cat)}
                      <span>{cat === 'All' ? t.skills.filterAll : cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono transition-colors ${
                          isActive
                            ? 'bg-white/20 dark:bg-slate-900/15 text-white dark:text-slate-900 font-bold'
                            : 'bg-slate-200/80 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{filteredSkills.length} dari {allSkills.length} Teknologi Aktif</span>
          </div>
        </div>
      </div>

      {/* SLEEK INTERACTIVE STREAM (RESPONSIF UNTUK SEMUA UKURAN LAYAR HP) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-full overflow-hidden divide-y divide-slate-200/60 dark:divide-white/[0.07] border-y border-slate-200/60 dark:border-white/[0.07]"
        >
          {filteredSkills.map((skill) => {
            const brand = getTechBrand(skill.name, skill.category);
            const pips = getProficiencyPips(skill.level || 'Advanced');

            return (
              <div
                key={skill.id || skill.name}
                onClick={() => setSelectedSkill(skill)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedSkill(skill);
                  }
                }}
                className="group py-4 sm:py-5 px-3 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 cursor-pointer rounded-2xl transition-all duration-200 hover:bg-slate-100/70 dark:hover:bg-white/[0.03] active:scale-[0.99] select-none w-full max-w-full overflow-hidden box-border"
              >
                {/* Left: Brand Icon + Title + Tags */}
                <div className="flex items-start gap-3 sm:gap-4 w-full md:flex-1 min-w-0 max-w-full">
                  {/* Brand Icon Squircle */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${brand.bgClass} border ${brand.borderClass} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105`}
                  >
                    {brand.primaryIcon}
                  </div>

                  {/* Title, Discipline & Capability Tags */}
                  <div className="flex-1 min-w-0 max-w-full">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                        {skill.name}
                      </h3>
                      <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/[0.06] border border-slate-300/40 dark:border-white/[0.08]">
                        {skill.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 line-clamp-2 max-w-2xl mb-2 leading-relaxed">
                      {skill.description}
                    </p>

                    {/* Capability Tags */}
                    {skill.tags && skill.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {skill.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] sm:text-[10.5px] font-mono px-1.5 sm:px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-white/[0.06]"
                          >
                            {tag}
                          </span>
                        ))}
                        {skill.tags.length > 3 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-400 dark:text-slate-500 self-center">
                            +{skill.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right / Bottom on Mobile: Mastery Pips + Clickable Interactive Pill */}
                <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/[0.04]">
                  {/* Mastery Pips */}
                  <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs shrink-0">
                    <div className="flex items-center gap-1" title={`${skill.level} (${pips}/4)`}>
                      {[1, 2, 3, 4].map((pip) => (
                        <span
                          key={pip}
                          className={`w-1.5 h-3 rounded-full transition-colors ${
                            pip <= pips
                              ? 'bg-emerald-500 dark:bg-emerald-400'
                              : 'bg-slate-200 dark:bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                      {skill.level}
                    </span>
                  </div>

                  {/* Tactile Button with YouTube badge & arrow */}
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/[0.08] shadow-sm group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-200 shrink-0">
                    <FaYoutube className="text-red-500 shrink-0" size={13} />
                    <span>Catatan & Video</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* INTERACTIVE SKILL DETAIL & YOUTUBE LEARNING MODAL (PORTAL) */}
      {createPortal(
        <AnimatePresence>
          {selectedSkill && (() => {
            const brand = getTechBrand(selectedSkill.name, selectedSkill.category);
            const pips = getProficiencyPips(selectedSkill.level || 'Advanced');

            return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                {/* Backdrop with Heavy Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedSkill(null)}
                  className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl"
                />

                {/* Modal Container with Double-Bezel Hardware Finish */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="relative w-full max-w-2xl bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-white/[0.1] rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden z-10 my-auto"
                >
                  {/* Subtle Top Reflective Line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

                  {/* MODAL HEADER */}
                  <div className="p-4 sm:p-8 pb-4 sm:pb-5 border-b border-slate-100 dark:border-white/[0.07] flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div
                        className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${brand.bgClass} border ${brand.borderClass} flex items-center justify-center shrink-0 shadow-md`}
                      >
                        {brand.primaryIcon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08]">
                            {selectedSkill.category}
                          </span>
                          <span className="text-[11px] sm:text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 size={12} />
                            {selectedSkill.level} ({pips}/4)
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                          {selectedSkill.name}
                        </h2>
                        {selectedSkill.experience && (
                          <p className="text-[11px] sm:text-xs font-mono text-slate-400 dark:text-slate-500 truncate">
                            {selectedSkill.experience}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Close Button with ESC Keyboard Indicator */}
                    <button
                      onClick={() => setSelectedSkill(null)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                      title="Tutup (ESC)"
                      aria-label="Tutup modal"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* MODAL BODY */}
                  <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 max-h-[75vh] sm:max-h-[70vh] overflow-y-auto">
                    
                    {/* 1. OVERVIEW & DESKRIPSI */}
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 sm:mb-2 flex items-center gap-2">
                        <BookOpen size={13} className="text-emerald-500" />
                        <span>Ringkasan Arsitektur</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedSkill.description}
                      </p>
                    </div>

                    {/* 2. MATERI YANG DIKUASAI */}
                    {selectedSkill.learnings && selectedSkill.learnings.length > 0 && (
                      <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.06]">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold mb-2.5 sm:mb-3 flex items-center gap-2">
                          <Code2 size={14} className="text-emerald-500" />
                          <span>Materi & Konsep yang Saya Pelajari</span>
                        </h4>
                        <ul className="space-y-2">
                          {selectedSkill.learnings.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-normal">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 3. SUMBER BELAJAR DARI YOUTUBE */}
                    {selectedSkill.youtube && (
                      <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-red-500/[0.04] dark:bg-red-500/[0.06] border border-red-500/20">
                        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-sm shrink-0">
                              <FaYoutube size={14} />
                            </div>
                            <span className="text-[11px] sm:text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                              Rekomendasi Video YouTube
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 dark:text-slate-500">
                            Sumber Belajar
                          </span>
                        </div>

                        <div className="mb-2.5 sm:mb-3">
                          <h5 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                            {selectedSkill.youtube.title}
                          </h5>
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Kreator: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedSkill.youtube.channel}</span>
                          </p>
                        </div>

                        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3.5 sm:mb-4 bg-white/60 dark:bg-black/20 p-2.5 sm:p-3 rounded-xl border border-red-500/10">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">Catatan Belajar:</span> {selectedSkill.youtube.note}
                        </p>

                        <a
                          href={selectedSkill.youtube.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 sm:py-3 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 transition-colors shadow-sm cursor-pointer select-none"
                        >
                          <Play size={13} fill="currentColor" />
                          <span>Tonton Video Pembelajaran di YouTube</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    )}

                    {/* 4. IMPLEMENTASI DI PORTOFOLIO INI */}
                    {selectedSkill.portfolioImplementation && (
                      <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] border border-emerald-500/20">
                        <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold mb-1 flex items-center gap-2">
                          <Layers size={13} />
                          <span>Penerapan di Portofolio Ini</span>
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {selectedSkill.portfolioImplementation}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* MODAL FOOTER */}
                  <div className="p-3.5 sm:p-5 px-4 sm:px-8 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[11px]">Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">ESC</kbd> untuk kembali</span>
                    <button
                      onClick={() => setSelectedSkill(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center touch-manipulation"
                    >
                      Tutup
                    </button>
                  </div>

                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
};

export default React.memo(TechStack);
