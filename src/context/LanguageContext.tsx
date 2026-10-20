import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

export interface Translations {
  nav: {
    about: string;
    capabilities: string;
    experience: string;
    projects: string;
    contact: string;
    openNav: string;
    closeNav: string;
    lightMode: string;
    darkMode: string;
    switchLang: string;
    availableBadge: string;
    statusRole: string;
    locationText: string;
    backToPortfolio: string;
  };
  hero: {
    availability: string;
    title1: string;
    titleHighlight: string;
    title2: string;
    bio: string;
    ctaProjects: string;
    ctaCv: string;
    ctaContact: string;
    coreStack: string;
    badgeRole: string;
    badgeFocus: string;
    location: string;
  };
  skills: {
    badge: string;
    title: string;
    desc: string;
    filterAll: string;
    proficiency: string;
    items: Record<string, string>;
  };
  experience: {
    badge: string;
    title: string;
    desc: string;
    period: string;
    status: string;
    role: string;
    institution: string;
    location: string;
    type: string;
    description: string;
    highlights: string[];
  };
  services: {
    badge: string;
    title: string;
    desc: string;
    items: {
      number: string;
      title: string;
      subtitle: string;
      description: string;
      tags: string[];
    }[];
  };
  projects: {
    badge: string;
    title: string;
    desc: string;
    viewDemo: string;
    viewCode: string;
    details: string;
    addProject: string;
    logoutAdmin: string;
    noProjects: string;
    projectOverview: string;
    technologies: string;
    links: string;
    close: string;
  };
  contact: {
    badge: string;
    title: string;
    desc: string;
    directEmail: string;
    directEmailDesc: string;
    copyEmail: string;
    copied: string;
    fastResponse: string;
    fastResponseDesc: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendBtn: string;
    sendingBtn: string;
    successMsg: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    timezone: string;
    backToTop: string;
  };
}

const translations: Record<Language, Translations> = {
  id: {
    nav: {
      about: 'Tentang',
      capabilities: 'Keahlian',
      experience: 'Pengalaman',
      projects: 'Proyek',
      contact: 'Kontak',
      openNav: 'Buka Navigasi',
      closeNav: 'Tutup navigasi',
      lightMode: 'Beralih ke mode terang',
      darkMode: 'Beralih ke mode gelap',
      switchLang: 'Ganti ke Bahasa Inggris',
      availableBadge: 'Tersedia untuk Magang & Proyek',
      statusRole: 'Siswa Rekayasa Perangkat Lunak',
      locationText: 'Jakarta Selatan, Indonesia',
      backToPortfolio: 'Kembali ke Portofolio',
    },
    hero: {
      availability: 'Tersedia untuk Proyek & Kolaborasi',
      title1: 'Designing & building',
      titleHighlight: 'high-caliber',
      title2: 'digital products.',
      bio: 'Halo, saya Muhammad Rochimuloh — Software Engineering student di SMKN 20 Jakarta. Menggabungkan arsitektur frontend modern, performa backend tangguh, dan haptic user experience.',
      ctaProjects: 'Lihat Karya Saya',
      ctaCv: 'Download CV',
      ctaContact: 'Hubungi Saya →',
      coreStack: 'Core Stack',
      badgeRole: 'Siswa RPL • SMKN 20 Jakarta',
      badgeFocus: 'Fokus Web Modern & Performa',
      location: 'Jakarta, ID',
    },
    skills: {
      badge: 'Technical Capabilities',
      title: 'Tools, stack & engineering foundation.',
      desc: 'Teknologi yang saya gunakan untuk mentransformasikan gagasan menjadi perangkat lunak siap pakai dengan arsitektur bersih.',
      filterAll: 'Semua',
      proficiency: 'Profisiensi',
      items: {
        'React 19 & Next.js': 'Arsitektur komponen modern, Server Components, State Management terstruktur, dan SSR/SSG untuk performa web maksimal.',
        'TypeScript': 'Sistem type-safety ketat untuk membangun kode yang scalable, mudah di-refactor, dan minim bug saat runtime.',
        'Tailwind CSS & Styling': 'Utility-first styling, desain responsif fluid, token design system konsisten, dan micro-animations berbasis Framer Motion.',
        'Laravel & PHP': 'Pembuatan RESTful APIs, autentikasi aman, validasi request, arsitektur MVC bersih, dan Eloquent ORM.',
        'Supabase & BaaS': 'Database PostgreSQL cloud, Row-Level Security (RLS), OAuth/email authentication, dan real-time subscriptions.',
        'PostgreSQL & MySQL': 'Relational schema modeling, normalisasi tabel, indexing efisien, query optimization, dan relasi multi-table.',
        'Git & Version Control': 'Git workflow terstruktur, branch management, code review, dan kolaborasi tim development berbasis GitHub.',
        'Vite & Tooling': 'Build tooling ultra cepat, modul bundling modern, integrasi TypeScript, dan optimasi aset produksi.',
      },
    },
    experience: {
      badge: 'Academic & Growth Path',
      title: 'Pendidikan & perjalanan keahlian.',
      desc: 'Dedikasi pembelajaran konsisten di bidang software engineering dan eksplorasi teknologi web modern.',
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
    services: {
      badge: 'Core Disciplines',
      title: 'Prinsip & pendekatan rekayasa digital.',
      desc: 'Mengedepankan craftsmanship kode yang teruji, kecepatan eksekusi, dan pengalaman visual yang elegan.',
      items: [
        {
          number: '01',
          title: 'Arsitektur Frontend Modern',
          subtitle: 'Antarmuka responsif, fluid & aksesibel',
          description:
            'Membangun antarmuka web interaktif berbasis React 19 dan Next.js dengan optimasi Core Web Vitals, tipografi proporsional, serta animasi mikroskopik yang responsif terhadap setiap aksi pengguna.',
          tags: ['React 19', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
        },
        {
          number: '02',
          title: 'Integrasi Backend & API Tangguh',
          subtitle: 'Struktur data scalable & layanan aman',
          description:
            'Merancang REST API terstruktur dan manajemen database relasional (PostgreSQL, MySQL, Supabase, Laravel) dengan validasi ketat, autentikasi aman, dan performa query yang cepat.',
          tags: ['Laravel', 'PHP', 'Supabase', 'PostgreSQL REST'],
        },
        {
          number: '03',
          title: 'Desain Interaksi & UI/UX Taktil',
          subtitle: 'Detail terkurasi tanpa visual artifisial',
          description:
            'Mengutamakan estetika visual yang tidak monoton — palet warna terkalibrasi, kontras WCAG yang nyaman di mata, hierarki layout asimetris, dan kenyamanan navigasi di semua ukuran layar.',
          tags: ['Design Systems', 'Haptic Micro-interactions', 'Dark Mode'],
        },
      ],
    },
    projects: {
      badge: 'Curated Works',
      title: 'Karya terpilih & produk digital.',
      desc: 'Aplikasi web nyata dan eksperimen rekayasa software dengan fokus performa, kegunaan, dan estetika.',
      viewDemo: 'Live Demo',
      viewCode: 'Source Code',
      details: 'Detail Proyek',
      addProject: 'Tambah Proyek',
      logoutAdmin: 'Logout Admin',
      noProjects: 'Belum ada proyek yang ditampilkan.',
      projectOverview: 'Ikhtisar Proyek',
      technologies: 'Teknologi yang Digunakan',
      links: 'Tautan Proyek',
      close: 'Tutup',
    },
    contact: {
      badge: 'Get In Touch',
      title: 'Mari berdiskusi & bangun sesuatu.',
      desc: 'Punya tawaran proyek, peluang magang, atau sekadar ingin berdiskusi mengenai teknologi? Pintu komunikasi selalu terbuka.',
      directEmail: 'Email Langsung',
      directEmailDesc: 'Kirim email langsung untuk pertanyaan kerja sama atau rekrutmen.',
      copyEmail: 'Salin Alamat Email',
      copied: 'Tersalin ke Clipboard!',
      fastResponse: 'Respon Cepat',
      fastResponseDesc: 'Biasanya merespon dalam 1×24 jam pada hari kerja.',
      formTitle: 'Kirim Pesan Langsung',
      nameLabel: 'Nama Lengkap',
      namePlaceholder: 'Nama Anda',
      emailLabel: 'Alamat Email',
      emailPlaceholder: 'nama@domain.com',
      messageLabel: 'Pesan Anda',
      messagePlaceholder: 'Ceritakan tentang kebutuhan proyek atau peluang kerja sama Anda...',
      sendBtn: 'Kirim Pesan',
      sendingBtn: 'Mengirim Pesan...',
      successMsg: 'Pesan Anda berhasil terkirim! Terima kasih telah menghubungi saya.',
    },
    footer: {
      tagline: 'Rekayasa Perangkat Lunak • SMKN 20 Jakarta. Mengembangkan produk digital yang bersih, performan, dan bermakna.',
      copyright: 'Hak cipta dilindungi.',
      timezone: 'Jakarta, ID • WIB (UTC+7)',
      backToTop: 'Kembali ke atas',
    },
  },
  en: {
    nav: {
      about: 'About',
      capabilities: 'Capabilities',
      experience: 'Experience',
      projects: 'Projects',
      contact: 'Contact',
      openNav: 'Open Navigation',
      closeNav: 'Close Navigation',
      lightMode: 'Switch to Light Mode',
      darkMode: 'Switch to Dark Mode',
      switchLang: 'Ganti ke Bahasa Indonesia',
      availableBadge: 'Available for Internships & Projects',
      statusRole: 'Software Engineering Student',
      locationText: 'South Jakarta, Indonesia',
      backToPortfolio: 'Back to Portfolio',
    },
    hero: {
      availability: 'Available for Projects & Collaboration',
      title1: 'Designing & building',
      titleHighlight: 'high-caliber',
      title2: 'digital products.',
      bio: 'Hello, I am Muhammad Rochimuloh — Software Engineering student at SMKN 20 Jakarta. Combining modern frontend architecture, robust backend performance, and tactile user experience.',
      ctaProjects: 'View My Work',
      ctaCv: 'Download CV',
      ctaContact: 'Contact Me →',
      coreStack: 'Core Stack',
      badgeRole: 'SE Student • SMKN 20 Jakarta',
      badgeFocus: 'Modern Web & High Performance',
      location: 'Jakarta, ID',
    },
    skills: {
      badge: 'Technical Capabilities',
      title: 'Tools, stack & engineering foundation.',
      desc: 'Technologies I leverage to transform concepts into production-ready software with clean architecture.',
      filterAll: 'All',
      proficiency: 'Proficiency',
      items: {
        'React 19 & Next.js': 'Modern component architecture, Server Components, structured state management, and SSR/SSG for peak web performance.',
        'TypeScript': 'Strict type-safety system to build scalable code, effortless refactoring, and minimal runtime bugs.',
        'Tailwind CSS & Styling': 'Utility-first styling, fluid responsive layouts, consistent design tokens, and Framer Motion micro-animations.',
        'Laravel & PHP': 'RESTful APIs creation, secure authentication, request validation, clean MVC architecture, and Eloquent ORM.',
        'Supabase & BaaS': 'Cloud PostgreSQL database, Row-Level Security (RLS), OAuth/email authentication, and real-time subscriptions.',
        'PostgreSQL & MySQL': 'Relational schema modeling, table normalization, efficient indexing, query optimization, and multi-table relations.',
        'Git & Version Control': 'Structured Git workflow, branch management, code review, and GitHub team development collaboration.',
        'Vite & Tooling': 'Ultra-fast build tooling, modern module bundling, TypeScript integration, and production asset optimization.',
      },
    },
    experience: {
      badge: 'Academic & Growth Path',
      title: 'Education & skill journey.',
      desc: 'Consistent learning dedication in software engineering and modern web technologies exploration.',
      period: '2025 — Present',
      status: 'In Progress',
      role: 'Software Engineering Student (RPL)',
      institution: 'SMKN 20 Jakarta',
      location: 'South Jakarta, Indonesia',
      type: 'Vocational Education',
      description:
        'Deepening an applied software engineering curriculum covering SDLC, algorithmic logic, relational database design, and modern frontend & backend web applications.',
      highlights: [
        'Web Development from Fundamentals to Advanced (HTML, CSS, JS/TS, React)',
        'Relational Database Management (MySQL, PostgreSQL, Supabase)',
        'Backend Programming with PHP & Laravel Framework',
        'Structured team collaboration and version control via GitHub',
      ],
    },
    services: {
      badge: 'Core Disciplines',
      title: 'Principles & digital engineering approach.',
      desc: 'Prioritizing tested code craftsmanship, execution velocity, and an elegant visual experience.',
      items: [
        {
          number: '01',
          title: 'Modern Frontend Architecture',
          subtitle: 'Responsive, fluid & accessible interfaces',
          description:
            'Crafting interactive web interfaces based on React 19 and Next.js with Core Web Vitals optimization, proportional typography, and micro-animations responsive to every user action.',
          tags: ['React 19', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
        },
        {
          number: '02',
          title: 'Robust Backend & API Integration',
          subtitle: 'Scalable data structures & secure services',
          description:
            'Architecting structured REST APIs and relational database management (PostgreSQL, MySQL, Supabase, Laravel) with strict validation, secure authentication, and snappy query performance.',
          tags: ['Laravel', 'PHP', 'Supabase', 'PostgreSQL REST'],
        },
        {
          number: '03',
          title: 'Tactile UI/UX & Interaction Design',
          subtitle: 'Crafted details without digital slop',
          description:
            'Emphasizing curated visual aesthetics — calibrated color palette, comfortable WCAG contrast, asymmetrical layout hierarchy, and seamless navigation across all viewports.',
          tags: ['Design Systems', 'Haptic Micro-interactions', 'Dark Mode'],
        },
      ],
    },
    projects: {
      badge: 'Curated Works',
      title: 'Selected works & digital products.',
      desc: 'Real-world web apps and software engineering experiments focused on performance, usability, and aesthetics.',
      viewDemo: 'Live Demo',
      viewCode: 'Source Code',
      details: 'Project Details',
      addProject: 'Add Project',
      logoutAdmin: 'Logout Admin',
      noProjects: 'No projects showcased yet.',
      projectOverview: 'Project Overview',
      technologies: 'Technologies Used',
      links: 'Project Links',
      close: 'Close',
    },
    contact: {
      badge: 'Get In Touch',
      title: "Let's connect & build something.",
      desc: 'Have a project offer, internship opportunity, or just want to chat about tech? My inbox is always open.',
      directEmail: 'Direct Email',
      directEmailDesc: 'Send an email directly for collaboration or recruitment inquiries.',
      copyEmail: 'Copy Email Address',
      copied: 'Copied to Clipboard!',
      fastResponse: 'Fast Response',
      fastResponseDesc: 'Typically replies within 24 hours on business days.',
      formTitle: 'Send a Direct Message',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your Name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'name@domain.com',
      messageLabel: 'Your Message',
      messagePlaceholder: 'Tell me about your project needs or collaboration opportunities...',
      sendBtn: 'Send Message',
      sendingBtn: 'Sending Message...',
      successMsg: 'Your message has been sent successfully! Thank you for reaching out.',
    },
    footer: {
      tagline: 'Software Engineering • SMKN 20 Jakarta. Developing clean, performant, and purposeful digital products.',
      copyright: 'All rights reserved.',
      timezone: 'Jakarta, ID • WIB (UTC+7)',
      backToTop: 'Back to top',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio_language');
    if (saved === 'en' || saved === 'id') return saved;
    return 'id'; // default Indonesian
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('portfolio_language', lang);
    document.documentElement.setAttribute('lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
