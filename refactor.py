import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('indigo', 'emerald')
content = content.replace('sky', 'cyan')
content = content.replace('purple', 'emerald')
content = content.replace('font-sans', 'font-mono')
content = content.replace('bg-slate-50', 'bg-[#0a0a0a]')
content = content.replace('dark:bg-[#070a13]', 'dark:bg-[#020202]')
content = content.replace('text-slate-800', 'text-emerald-500')
content = content.replace('text-slate-900', 'text-emerald-400')
content = content.replace('dark:text-slate-200', 'dark:text-emerald-400')
content = content.replace('dark:text-slate-100', 'dark:text-emerald-300')
content = content.replace('text-slate-600', 'text-emerald-700')
content = content.replace('dark:text-slate-400', 'dark:text-emerald-600')

# Make borders glow
content = content.replace('border-slate-200', 'border-emerald-500/30')
content = content.replace('dark:border-slate-800', 'dark:border-emerald-500/30')
content = content.replace('dark:border-slate-800/80', 'dark:border-emerald-500/20')

# Change rounded corners to square/sharp
content = content.replace('rounded-full', 'rounded-sm')
content = content.replace('rounded-3xl', 'rounded-sm')
content = content.replace('rounded-2xl', 'rounded-sm')
content = content.replace('rounded-xl', 'rounded-sm')
content = content.replace('rounded-lg', 'rounded-sm')

overlay = """
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-black/40"></div>
"""
content = content.replace('<CustomCursor />', '<CustomCursor />' + overlay)

# Terminal Prefix for headers
content = content.replace('Tech Stack & Skill', '>_ TECH_STACK.exe')
content = content.replace('Projects Portfolio', '>_ PROJECTS.sh')
content = content.replace('Pengalaman & Pendidikan', '>_ EXPERIENCE.log')
content = content.replace('Hubungi Oimmm', '>_ CONTACT.md')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
