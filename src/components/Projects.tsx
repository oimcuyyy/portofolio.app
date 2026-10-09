import React from 'react';
import { PlusCircle, LogOut, Code2, ExternalLink, ArrowUpRight, FolderGit2 } from 'lucide-react';
import type { Project } from '../types';
import { SpotlightCard } from './Interactive';

interface ProjectsProps {
  projects: Project[];
  session: any;
  setIsModalOpen: (open: boolean) => void;
  handleLogoutAdmin: () => void;
  setSelectedProject: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({
  projects,
  session,
  setIsModalOpen,
  handleLogoutAdmin,
  setSelectedProject,
}) => {
  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6" data-aos="fade-up">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
            <FolderGit2 size={13} />
            <span>Curated Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Karya terpilih &amp; produk digital.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Aplikasi web nyata dan eksperimen rekayasa software dengan fokus performa, kegunaan, dan estetika.
          </p>
        </div>

        {/* ADMIN ACTIONS */}
        <div className="flex items-center gap-3">
          {session && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <PlusCircle size={15} /> Tambah Proyek
              </button>
              <button
                onClick={handleLogoutAdmin}
                title="Logout Admin"
                className="p-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PROJECTS GRID / BENTO */}
      {projects.length === 0 ? (
        <div className="p-12 text-center rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
          <FolderGit2 size={36} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Belum ada proyek yang dimuat</h3>
          <p className="text-xs text-slate-500 mt-1">Pastikan database Supabase terhubung atau login admin untuk menambah proyek.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <SpotlightCard
              key={project.id}
              className="group cursor-pointer rounded-[2.25rem] border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#070b14]/75 shadow-xl hover:border-emerald-500/40 transition-all duration-500 flex flex-col"
            >
              <div
                data-aos="fade-up"
                data-aos-delay={index * 80}
                onClick={() => setSelectedProject(project)}
                className="flex flex-col h-full"
              >
                {/* BROWSER WINDOW TOP BAR & MOCKUP */}
                <div className="p-4 pb-0">
                  <div className="rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-inner">
                    
                    {/* Simulated browser topbar */}
                    <div className="px-4 py-2.5 bg-slate-950/80 border-b border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400/80 tracking-wider truncate max-w-[200px]">
                        {project.title.toLowerCase().replace(/\s+/g, '-')}.app
                      </span>
                      <div className="w-4" />
                    </div>

                    {/* Project Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                      <img
                        src={
                          project.image_url ||
                          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
                        }
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </div>

                  </div>
                </div>

                {/* PROJECT DETAILS */}
                <div className="p-7 sm:p-8 flex flex-col flex-1">
                  
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors shrink-0">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed line-clamp-3 flex-1">
                    {project.description}
                  </p>

                  {/* TECH STACK TAGS */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tech_stack?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* ACTIONS FOOTER */}
                  <div
                    className="flex items-center justify-between pt-5 border-t border-slate-200/80 dark:border-white/[0.08]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.github_url ? (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      >
                        <Code2 size={14} />
                        <span>Source Code</span>
                      </a>
                    ) : (
                      <span />
                    )}

                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                      >
                        <span>Live Preview</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                </div>

              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

    </section>
  );
};

export default Projects;
