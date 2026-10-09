import React, { useState, useEffect } from 'react';
import {
  Code2,
  X,
  Sun,
  Moon,
  User,
  Layers,
  GraduationCap,
  FolderGit2,
  Mail,
  ArrowRight,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import profilePhoto from '../assets/profile.jpg';

const navLinks = [
  { name: 'About', href: '#about', icon: User, number: '01' },
  { name: 'Capabilities', href: '#skills', icon: Layers, number: '02' },
  { name: 'Experience', href: '#experience', icon: GraduationCap, number: '03' },
  { name: 'Projects', href: '#projects', icon: FolderGit2, number: '04' },
  { name: 'Contact', href: '#contact', icon: Mail, number: '05' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check initial theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Scroll listener for sticky indicator and active section
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* FLOATING LEFT LAUNCHER DOCK */}
      <div className="fixed left-4 sm:left-6 top-6 sm:top-8 z-50 flex items-center gap-2.5">
        
        {/* Main Left Menu Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border transition-all duration-300 shadow-xl cursor-pointer ${
            isOpen
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent scale-95'
              : scrolled
              ? 'bg-white/80 dark:bg-[#070b14]/85 backdrop-blur-xl border-slate-200/80 dark:border-white/15 text-slate-800 dark:text-slate-100 hover:border-emerald-500/40 hover:shadow-emerald-500/10'
              : 'bg-white/60 dark:bg-[#070b14]/60 backdrop-blur-md border-slate-200/60 dark:border-white/10 text-slate-800 dark:text-slate-100 hover:bg-white/90 dark:hover:bg-[#070b14]/90'
          }`}
          aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          title="Buka Navigasi"
        >
          {/* Animated Hamburger / Close Icon */}
          <div className="w-5 h-5 flex items-center justify-center relative">
            {isOpen ? (
              <X size={18} className="animate-in spin-in-90 duration-200" />
            ) : (
              <div className="flex flex-col gap-1 items-start group-hover:gap-1.5 transition-all">
                <span className="w-4 h-0.5 rounded-full bg-emerald-500 transition-all group-hover:w-5" />
                <span className="w-3 h-0.5 rounded-full bg-slate-700 dark:bg-slate-300 transition-all group-hover:w-4" />
                <span className="w-4 h-0.5 rounded-full bg-emerald-500 transition-all group-hover:w-5" />
              </div>
            )}
          </div>

          {/* Logo & Section Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-tight">
            <span>rochim<span className="text-emerald-500">.dev</span></span>
            <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">/</span>
            <span className="hidden sm:inline-block text-[11px] font-normal text-emerald-600 dark:text-emerald-400 capitalize">
              {activeSection}
            </span>
          </div>

          {/* Pulsing beacon */}
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </button>

        {/* Quick Theme Toggle Pill */}
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-full bg-white/70 dark:bg-[#070b14]/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-all shadow-lg cursor-pointer"
          aria-label="Toggle Theme"
          title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
        >
          {isDarkMode ? (
            <Sun size={15} className="text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon size={15} className="text-emerald-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

      </div>

      {/* BACKDROP OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-300"
        />
      )}

      {/* LEFT EXPANDED GLASS DRAWER DOCK */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-full max-w-sm sm:max-w-md bg-white/95 dark:bg-[#060913]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/10 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* DRAWER TOP: PROFILE INFO & CLOSE */}
        <div className="p-6 sm:p-8 pb-4">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Code2 size={15} />
              </div>
              <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                rochim<span className="text-emerald-500">.dev</span>
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              aria-label="Tutup navigasi"
            >
              <X size={18} />
            </button>
          </div>

          {/* User Mini Profile Header */}
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
              <img
                src={profilePhoto}
                alt="Muhammad Rochimuloh"
                className="w-full h-full object-cover object-center"
              />
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                Muhammad Rochimuloh
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                SMKN 20 Jakarta &bull; RPL
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <MapPin size={11} />
                <span>Jakarta, ID</span>
              </div>
            </div>
          </div>

        </div>

        {/* DRAWER MIDDLE: NAVIGATION LINKS */}
        <div className="px-6 sm:px-8 py-2 overflow-y-auto flex-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-3">
            Menu Navigasi
          </div>
          
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md shadow-slate-900/10'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`p-2 rounded-xl text-xs transition-colors ${
                        isActive
                          ? 'bg-white/15 dark:bg-black/10 text-white dark:text-slate-950'
                          : 'bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400 group-hover:text-emerald-500'
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="tracking-tight text-sm font-medium">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono ${
                        isActive
                          ? 'text-white/60 dark:text-slate-950/60'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {item.number}
                    </span>
                    <ArrowRight
                      size={14}
                      className={`transition-transform duration-300 ${
                        isActive
                          ? 'translate-x-0 opacity-100'
                          : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                    />
                  </div>
                </a>
              );
            })}
          </nav>
        </div>

        {/* DRAWER BOTTOM: SOCIAL & QUICK CONTACT */}
        <div className="p-6 sm:p-8 pt-4 border-t border-slate-200/80 dark:border-white/[0.08] space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Direct Inquiries</span>
            <a
              href="mailto:belajarmandiri03034@gmail.com"
              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>belajarmandiri03034@gmail.com</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* Social icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/oimcuyyy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={15} />
              </a>
              <a
                href="https://www.instagram.com/lunarxoim/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={15} />
              </a>
              <a
                href="#contact"
                onClick={handleLinkClick}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>

            {/* Availability Pill */}
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
              Open to Work
            </span>
          </div>

        </div>

      </aside>
    </>
  );
};

export default Navbar;
