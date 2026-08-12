import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { supabase } from './lib/supabase';
import type { Project, Skill } from './types';
import { 
  Code2, ExternalLink, Mail, Send, Code, Layers, 
  GraduationCap, Download, PlusCircle, X, Sparkles, Menu, Info, CheckCircle2
} from 'lucide-react';

interface SkillWithDesc extends Skill {
  description?: string;
}

// Komponen Kecil untuk Efek Animasi Ketik (Typewriter)
function TypewriterSubtext() {
  const roles = [
    "Junior Software Engineer yang berfokus pada pengembangan aplikasi web modern.",
    "Siswa Rekayasa Perangkat Lunak (RPL) SMKN 20 Jakarta.",
    "Terbiasa membangun antarmuka web yang rapi, responsif, dan interaktif."
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const fullText = roles[currentRoleIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
          setTypingSpeed(50);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(100);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, typingSpeed]);

  return (
    <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mb-10 leading-relaxed font-normal min-h-[3.5rem] flex items-center justify-center px-4">
      <span>{currentText}</span>
      <span className="inline-block w-0.5 h-5 ml-1 bg-indigo-400 animate-pulse" />
    </p>
  );
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillWithDesc[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image_url: '',
    tech_stack: '',
    github_url: '',
    demo_url: ''
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-back',
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (projectsData) setProjects(projectsData);

    setSkills([]); 
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('messages').insert([formData]);

    if (!error) {
      setSentSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSentSuccess(false), 5000);
    } else {
      alert('Pesan gagal dikirim. Pastikan Supabase sudah terhubung!');
    }
    setLoading(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);

    const formattedData = {
      ...newProject,
      tech_stack: newProject.tech_stack.split(',').map(item => item.trim())
    };

    const { error } = await supabase.from('projects').insert([formattedData]);

    if (!error) {
      setIsModalOpen(false);
      setNewProject({ title: '', description: '', image_url: '', tech_stack: '', github_url: '', demo_url: '' });
      fetchData();
    } else {
      alert('Gagal menambahkan project. Cek koneksi Supabase!');
    }
    setAddLoading(false);
  };

  const navLinks = [
    { name: 'Tentang', href: '#about' },
    { name: 'Keahlian', href: '#skills' },
    { name: 'Proyek', href: '#projects' },
    { name: 'Kontak', href: '#contact' },
  ];

  const displaySkills: SkillWithDesc[] = skills.length > 0 ? skills.map(s => ({
    ...s,
    description: s.description || 'Keahlian profesional dalam membangun dan mengoptimalkan sistem aplikasi web.'
  })) : [
    { 
      id: '1', 
      name: 'React.js', 
      category: 'Frontend',
      description: 'Library JavaScript populer dari Meta untuk membangun antarmuka pengguna (UI) interaktif, cepat, dan berbasis komponen modular.' 
    },
    { 
      id: '2', 
      name: 'TypeScript', 
      category: 'Language',
      description: 'Bahasa pemrograman berbasis JavaScript dengan fitur Strongly Typed untuk meminimalisir bug dan mempermudah maintenance kode.' 
    },
    { 
      id: '3', 
      name: 'Tailwind CSS', 
      category: 'Styling',
      description: 'Framework CSS Utility-First untuk membuat tampilan aplikasi web yang sangat responsif, modern, dan elegan dengan cepat.' 
    },
    { 
      id: '4', 
      name: 'Laravel', 
      category: 'Backend',
      description: 'Framework PHP populer dengan arsitektur MVC yang elegan dan robust untuk membangun aplikasi web berskala besar.' 
    },
    { 
      id: '5', 
      name: 'PHP', 
      category: 'Language',
      description: 'Bahasa pemrograman server-side yang menjadi fondasi utama dalam pengembangan backend dan sistem manajemen database.' 
    },
    { 
      id: '6', 
      name: 'Supabase', 
      category: 'Backend/DB',
      description: 'Alternatif open-source dari Firebase yang menyediakan Database PostgreSQL, Autentikasi Pengguna, dan Storage Instan.' 
    },
    { 
      id: '7', 
      name: 'Next.js', 
      category: 'Frontend',
      description: 'Framework React tingkat lanjut dengan fitur Server-Side Rendering (SSR) dan Static Site Generation (SSG) untuk SEO optimal.' 
    },
    { 
      id: '8', 
      name: 'PostgreSQL', 
      category: 'Database',
      description: 'Sistem manajemen database relasional (RDBMS) tingkat enterprise yang sangat andal, aman, dan mendukung struktur data kompleks.' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* GLOW BACKGROUND EFFECT */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-indigo-600/30 via-sky-500/20 to-purple-600/20 blur-[130px] pointer-events-none rounded-full animate-pulse" />
      <div className="absolute top-[40%] -right-[100px] w-[500px] h-[500px] bg-indigo-600/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-[75%] -left-[100px] w-[500px] h-[500px] bg-sky-600/15 blur-[160px] pointer-events-none rounded-full" />

      {/* FLOATING NAVBAR */}
      <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4">
        <header className="w-full max-w-4xl backdrop-blur-xl bg-[#0b0f19]/80 border border-slate-800/80 rounded-full px-6 py-3.5 flex justify-between items-center shadow-2xl shadow-indigo-950/40">
          <a href="#about" className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 transition duration-300">
              <Code2 className="text-indigo-400" size={18} />
            </div>
            <span>rochim.dev</span>
          </a>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/60">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-indigo-600/20 hover:border hover:border-indigo-500/30 transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* MOBILE MENU TOGGLE */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-slate-300 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-40 md:hidden bg-[#0c101d]/95 backdrop-blur-2xl border border-slate-800 rounded-2xl p-4 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-indigo-600/20 hover:text-white transition"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* HERO SECTION */}
      <section id="about" className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-28 pb-16 relative">
        <div data-aos="zoom-in" data-aos-delay="100" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 mb-8 backdrop-blur-md shadow-lg shadow-indigo-500/10">
          <GraduationCap size={16} className="text-indigo-400" />
          <span>Siswa RPL • SMKN 20 Jakarta</span>
        </div>

        <h1 data-aos="fade-up" data-aos-delay="200" className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-slate-100 leading-tight">
          Halo, Saya <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">Muhammad Rochimuloh</span>
        </h1>

        <div data-aos="fade-up" data-aos-delay="300">
          <TypewriterSubtext />
        </div>

        <div data-aos="fade-up" data-aos-delay="400" className="flex flex-wrap justify-center gap-4">
          <a 
            href="#projects" 
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Layers size={18} /> Lihat Karya Saya
          </a>
          <a 
            href="/cv-muhammadrochimuloh.pdf" 
            download="CV_Muhammad_Rochimuloh.pdf"
            className="px-6 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 text-slate-200 font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 backdrop-blur-md"
          >
            <Download size={18} className="text-indigo-400" /> Download CV
          </a>
          <a 
            href="#contact" 
            className="px-6 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 text-slate-200 font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 backdrop-blur-md"
          >
            <Mail size={18} /> Hubungi Saya
          </a>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="py-24 px-6 max-w-4xl mx-auto relative">
        <div className="text-center mb-14 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 flex justify-center items-center gap-3 mb-3">
            <Code className="text-indigo-400" /> Tech Stack & Skill
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Klik lingkaran skill untuk menghentikan putaran dan melihat penjelasan lengkapnya
          </p>
        </div>

        <div className="relative flex items-center justify-center min-h-[500px]">
          {/* Ikon Tengah */}
          <div className="absolute z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-indigo-600/20 border-2 border-indigo-500/50 backdrop-blur-xl flex flex-col items-center justify-center text-center p-2 shadow-2xl shadow-indigo-500/30 animate-pulse pointer-events-none">
            <Code2 className="text-indigo-400 mb-1" size={24} />
            <span className="text-[10px] font-bold text-indigo-200 tracking-wider uppercase">Skills</span>
          </div>

          <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-indigo-500/25 pointer-events-none" />
          
          {/* Lingkaran Skill yang akan menjadi blur jika ada skill yang dipilih */}
          <div 
            className={`absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] animate-spin-slow transition-all duration-500 ${
              activeSkillId ? 'blur-sm scale-95 opacity-40 pointer-events-none' : 'blur-0 opacity-100'
            }`}
            style={{ animationPlayState: activeSkillId ? 'paused' : 'running' }}
          >
            {displaySkills.map((skill, index, array) => {
              const angle = (index / array.length) * 2 * Math.PI;
              const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 160 : 210;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isSelected = activeSkillId === skill.id;

              return (
                <div
                  key={skill.id || index}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                  }}
                >
                  <div className="animate-counter-spin relative" style={{ animationPlayState: activeSkillId ? 'paused' : 'running' }}>
                    <button
                      onClick={() => setActiveSkillId(isSelected ? null : (skill.id ?? null))}
                      type="button"
                      className={`w-24 h-18 sm:w-28 sm:h-20 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center text-center p-2 transition-all duration-300 shadow-xl cursor-pointer group ${
                        isSelected 
                          ? 'bg-indigo-600 border-2 border-white scale-110 shadow-indigo-500/50 z-30' 
                          : 'bg-slate-900/90 border border-slate-800 hover:border-indigo-400 hover:bg-slate-800 hover:scale-105 z-20'
                      }`}
                    >
                      <p className={`font-bold text-xs sm:text-sm transition ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-indigo-400'}`}>
                        {skill.name}
                      </p>
                      <span className={`text-[10px] mt-0.5 font-mono ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {skill.category}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kotak Popup Penjelasan di Tengah */}
          {activeSkillId && (() => {
            const skill = displaySkills.find(s => s.id === activeSkillId);
            if (!skill) return null;
            return (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border-2 border-indigo-500/60 rounded-3xl p-6 shadow-[0_0_80px_rgba(79,70,229,0.5)] text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                      {skill.category}
                    </span>
                    <button 
                      onClick={() => setActiveSkillId(null)}
                      className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <h4 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                    <Info size={18} className="text-indigo-400" /> {skill.name}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-24 px-6 max-w-6xl mx-auto relative" data-aos="fade-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 flex items-center gap-3">
              <Sparkles className="text-indigo-400" /> Projects Portfolio
            </h2>
            <p className="text-slate-400 text-sm mt-1">Daftar aplikasi dan karya web yang telah saya kembangkan</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-indigo-600/10"
          >
            <PlusCircle size={18} /> Tambah Project Baru
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md overflow-hidden hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col group shadow-xl"
            >
              <div className="overflow-hidden h-56 relative">
                <img 
                  src={project.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60'} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-transparent to-transparent opacity-80" />
              </div>
              
              <div className="p-7 flex flex-col flex-1 relative -mt-6">
                <h3 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-indigo-400 transition">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-1">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech_stack?.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  {project.github_url ? (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition">
                      <Code2 size={16} /> Repository Kode
                    </a>
                  ) : <span />}
                  {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-6 max-w-xl mx-auto relative" data-aos="fade-up">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 flex justify-center items-center gap-3 mb-2">
            <Mail className="text-indigo-400" /> Hubungi Oimmm
          </h2>
          <p className="text-slate-400 text-sm">Tertarik bekerjasama atau punya pertanyaan? Kirim pesan langsung di bawah ini!</p>
        </div>
        
        <form onSubmit={handleSubmitMessage} className="space-y-5 bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Nama Lengkap</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="Masukkan nama kamu"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Alamat Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="email@contoh.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Pesan</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition"
              placeholder="Tuliskan pesanmu..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : <><Send size={16} /> Kirim Pesan</>}
          </button>
          {sentSuccess && (
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 mt-3 font-semibold text-xs">
              <CheckCircle2 size={16} /> Pesan kamu berhasil dikirim langsung ke database!
            </div>
          )}
        </form>
      </section>

      {/* MODAL INPUT PROJECT BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold mb-4 text-slate-100 flex items-center gap-2">
              <PlusCircle className="text-indigo-400" size={20} /> Tambah Project Baru
            </h3>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Judul Project</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="Contoh: Aplikasi Kasir SMKN 20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Deskripsi</label>
                <textarea
                  required
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="Jelaskan singkat tentang project ini..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">URL Gambar Preview</label>
                <input
                  type="url"
                  value={newProject.image_url}
                  onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tech Stack (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  required
                  value={newProject.tech_stack}
                  onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="React, Tailwind, Node.js"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">URL Repository (GitHub)</label>
                  <input
                    type="url"
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">URL Demo (Live Web)</label>
                  <input
                    type="url"
                    value={newProject.demo_url}
                    onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition text-sm mt-2 shadow-lg shadow-indigo-600/30"
              >
                {addLoading ? 'Menyimpan...' : 'Simpan & Tampilkan Project'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 py-10 px-6 text-center">
        <div className="flex justify-center gap-6 mb-6">
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=gegerochim567@gmail.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-slate-400 hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2"
          >
            <Mail size={20} />
            <span className="text-sm font-medium">Email</span>
          </a>
          <a 
            href="https://github.com/oimcuyyy" 
            target="_blank" 
            rel="noreferrer"
            className="text-slate-400 hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2"
          >
            <Code size={20} />
            <span className="text-sm font-medium">GitHub</span>
          </a>
        </div>
        <p className="text-xs text-slate-500 font-mono">
          © {new Date().getFullYear()} Muhammad Rochimuloh. SMKN 20 Jakarta - Rekayasa Perangkat Lunak.
        </p>
      </footer>
    </div>
  );
}

export default App;