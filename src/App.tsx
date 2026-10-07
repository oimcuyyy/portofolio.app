import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { supabase } from './lib/supabase';
import type { Project, Skill } from './types';
import { X, Lock, Info, ExternalLink, Code2 } from 'lucide-react';
import { CustomCursor } from './components/Interactive';
import { ParticleNetwork } from './components/ParticleNetwork';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Services from './components/Services';
import Contact from './components/Contact';
import AdminInbox from './components/AdminInbox';
import Footer from './components/Footer';

interface SkillWithDesc extends Skill {
  description?: string;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillWithDesc[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // STATE MODAL DETAIL PROYEK
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // STATE ADMIN & SECRET SHORTCUT
  const [session, setSession] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // STATE PESAN MASUK ADMIN
  const [messages, setMessages] = useState<any[]>([]);

  // Add Project Modal
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchMessages();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchMessages();
      } else {
        setMessages([]);
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchData = async () => {
    const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (projectsData) setProjects(projectsData);
    setSkills([]); 
  };

  const fetchMessages = async () => {
    const { data: messagesData } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (messagesData) setMessages(messagesData);
  };

  const sanitizeInput = (str: string) => {
    return str.replace(/<[^>]*>?/gm, '').trim();
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanName = sanitizeInput(formData.name).slice(0, 100);
    const cleanEmail = sanitizeInput(formData.email).slice(0, 120);
    const cleanMessage = sanitizeInput(formData.message).slice(0, 2000);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanName || !cleanEmail || !cleanMessage) {
      alert('Mohon isi semua bidang formulir dengan benar.');
      setLoading(false);
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      alert('Format email tidak valid.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('messages').insert([{
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    }]);

    if (!error) {
      setSentSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSentSuccess(false), 5000);
      if (session) fetchMessages(); 
    } else {
      alert('Pesan gagal dikirim. Silakan hubungi langsung via email.');
    }
    setLoading(false);
  };

  const handleLoginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      setAdminPassword('');
      alert('Login Gagal: Kredensial tidak valid.');
    } else {
      setIsLoginModalOpen(false);
      setAdminEmail('');
      setAdminPassword('');
    }
    setLoginLoading(false);
  };

  const handleLogoutAdmin = async () => {
    await supabase.auth.signOut();
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('Anda harus login sebagai admin!');
      return;
    }
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
      alert('Gagal menambahkan project.');
    }
    setAddLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#05070d] text-slate-800 dark:text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden transition-colors duration-300">
      
      <CustomCursor />
      <ParticleNetwork />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.25) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-transparent to-slate-100/80 dark:to-black/40"></div>

      {/* GLOW BACKGROUND EFFECT */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-cyan-500/10 dark:from-emerald-500/20 dark:via-teal-500/15 dark:to-cyan-500/15 blur-[140px] pointer-events-none rounded-full" />
      
      {/* SECTIONS OVERLAY Z-INDEX */}
      <div className="relative z-10 flex flex-col gap-14 sm:gap-20">
        
        {/* NAVBAR */}
        <Navbar />

        {/* HERO SECTION */}
        <div id="about">
          <Hero />
        </div>

        {/* SKILLS SECTION */}
        <TechStack skills={skills} />

        {/* EXPERIENCE SECTION */}
        <Experience />

        {/* SERVICES SECTION */}
        <Services />

        {/* PROJECTS SECTION */}
        <Projects 
          projects={projects}
          session={session}
          setIsModalOpen={setIsModalOpen}
          handleLogoutAdmin={handleLogoutAdmin}
          setSelectedProject={setSelectedProject}
        />

        {/* ADMIN INBOX SECTION */}
        <AdminInbox 
          session={session} 
          messages={messages} 
          fetchMessages={fetchMessages} 
        />

        {/* CONTACT SECTION */}
        <Contact 
          formData={formData}
          setFormData={setFormData}
          handleSubmitMessage={handleSubmitMessage}
          loading={loading}
          sentSuccess={sentSuccess}
        />

      </div>

      {/* FOOTER */}
      <Footer />

      {/* MODAL TAMBAH PROYEK (ADMIN) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-[2.25rem] shadow-2xl p-7 sm:p-8 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"><X size={18} /></button>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
              <Lock size={18} className="text-emerald-500" /> Tambah Proyek Baru (Admin)
            </h3>
            
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">Judul Project</label>
                <input required type="text" className="w-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">Deskripsi</label>
                <textarea required rows={3} className="w-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 resize-none" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">URL Gambar Mockup</label>
                <input type="url" className="w-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={newProject.image_url} onChange={e => setNewProject({...newProject, image_url: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">Tech Stack (Pisahkan dengan koma)</label>
                <input required type="text" placeholder="React, Next.js, Tailwind, Supabase" className="w-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={newProject.tech_stack} onChange={e => setNewProject({...newProject, tech_stack: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">URL Repo GitHub</label>
                  <input type="url" className="w-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={newProject.github_url} onChange={e => setNewProject({...newProject, github_url: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">URL Live Demo</label>
                  <input type="url" className="w-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={newProject.demo_url} onChange={e => setNewProject({...newProject, demo_url: e.target.value})} />
                </div>
              </div>
              
              <button disabled={addLoading} type="submit" className="w-full mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold py-3.5 rounded-xl hover:bg-emerald-600 dark:hover:bg-slate-200 transition text-sm cursor-pointer shadow-lg">
                {addLoading ? 'Menyimpan...' : 'Simpan Proyek'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PROYEK */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setSelectedProject(null)}>
          <div className="bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 w-full max-w-2xl rounded-[2.25rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-10 text-white bg-black/60 p-2 rounded-full hover:bg-emerald-600 transition cursor-pointer"><X size={18} /></button>
            
            <div className="h-64 sm:h-72 w-full relative">
              <img src={selectedProject.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'} alt={selectedProject.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-[#070b14] via-slate-900/40 to-transparent"></div>
              <h2 className="absolute bottom-6 left-6 right-6 text-2xl sm:text-3xl font-extrabold text-white">{selectedProject.title}</h2>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedProject.tech_stack?.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-emerald-400 border border-slate-200 dark:border-white/10">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="mb-8">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Info size={14} className="text-emerald-500" /> Ringkasan Proyek</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{selectedProject.description}</p>
              </div>
              
              <div className="flex items-center gap-3 border-t border-slate-200 dark:border-white/[0.08] pt-6 mt-auto">
                {selectedProject.github_url && (
                  <a href={selectedProject.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-semibold text-xs uppercase tracking-wider transition">
                    <Code2 size={16} /> Source Code
                  </a>
                )}
                {selectedProject.demo_url && (
                  <a href={selectedProject.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-slate-200 font-bold text-xs uppercase tracking-wider shadow-lg transition">
                    <ExternalLink size={15} /> Buka Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOGIN ADMIN */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 w-full max-w-sm rounded-[2rem] shadow-2xl p-7 relative">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"><X size={18} /></button>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Lock size={17} className="text-emerald-500" /> Admin Authentication
            </h3>
            
            <form onSubmit={handleLoginAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">Email</label>
                <input required type="email" className="w-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">Password</label>
                <input required type="password" className="w-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
              </div>
              <button disabled={loginLoading} type="submit" className="w-full mt-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold py-3 rounded-xl hover:bg-emerald-600 dark:hover:bg-slate-200 transition text-sm cursor-pointer shadow-lg">
                {loginLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;