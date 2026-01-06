import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Github, ExternalLink, Lock, Terminal, Loader2, Linkedin, Mail, ArrowRight } from 'lucide-react'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setProjects(data)
    setLoading(false)
  }

  const profilePhotoUrl = "/Foto-saya.jpeg"

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-zinc-950">
      <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">

      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <Terminal className="text-blue-500" size={24} strokeWidth={2.5} />
            <span>Portofolio<span className="text-blue-500">.</span></span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-24">

        <section className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-20 mb-32">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-6 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Informatics Engineering Student
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Membangun solusi <br className="hidden md:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                digital yang berdampak.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-8 mx-auto md:mx-0">
              Halo! Saya seorang <b>Fullstack Developer</b> (React & Laravel). Saya mengubah ide kompleks menjadi aplikasi web yang cepat, elegan, dan fungsional.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
               <a href="#projects" className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition group">
                 Lihat Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </a>
               <div className="flex gap-3">
                  <a 
                    href="https://github.com/SxCentauri" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition text-zinc-400 inline-flex items-center justify-center"
                    >
                    <Github size={20} />
                    </a>
                    <a 
                    href="mailto:ahmad61539@gmail.com"
                    className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition text-zinc-400 inline-flex items-center justify-center"
                    >
                    <Mail size={20} />
                    </a>
               </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center md:justify-end relative w-full max-w-xs md:max-w-md">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/30 blur-[100px] rounded-full -z-10 opaciy-50 md:opacity-100"></div>
            <div className="relative rounded-3xl border-2 border-zinc-800/80 p-2 bg-zinc-950/50 backdrop-blur-sm rotate-3 hover:rotate-0 transition-all duration-500 ease-out hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
              <img 
                src={profilePhotoUrl} 
                alt="Profile" 
                className="rounded-2xl w-full h-auto object-cover aspect-square grayscale hover:grayscale-0 transition-all duration-500" 
              />
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Featured Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="group relative bg-zinc-900/40 border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col"
              >
                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  
                  <div className="flex flex-col gap-3 mb-4">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-blue-400 bg-blue-950/50 px-3 py-1 rounded-full border border-blue-800/50 w-fit">
                      {project.tech_stack || 'Tech'}
                    </span>
                    <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-blue-400 transition leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="text-zinc-400 leading-relaxed mb-6 line-clamp-3 flex-1">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-zinc-800/50 mt-auto">
                    {project.repo_url && (
                      <a href={project.repo_url} target="_blank" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition bg-zinc-950/50 px-4 py-2 rounded-full border border-zinc-800 hover:border-zinc-600">
                        <Github size={18} /> Code
                      </a>
                    )}

                    {project.demo_url ? (
                      <a href={project.demo_url} target="_blank" className="flex items-center gap-2 text-sm font-bold text-emerald-50 bg-emerald-600/20 px-4 py-2 rounded-full border border-emerald-500/30 hover:bg-emerald-600/30 transition ml-auto">
                        <ExternalLink size={18} /> Live Demo
                      </a>
                    ) : (
                      <span className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-950 px-4 py-2 rounded-full border border-zinc-900 cursor-not-allowed ml-auto font-medium">
                        <Lock size={18} /> Offline Project
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/50 py-10 text-center">
        <div className="text-zinc-500 text-sm flex flex-col items-center gap-2">
          <Terminal size={20} className="text-zinc-700 mb-2" />
          <p>&copy; {new Date().getFullYear()} Portofolio Saya.</p>
          <p>Dibuat dengan React, Tailwind, dan Supabase.</p>
        </div>
      </footer>
    </div>
  )
}