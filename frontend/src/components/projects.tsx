"use client"

import { useState, useRef, useCallback } from "react"
import { Reveal } from "@/components/reveal"
import { projects } from "@/data"
import { ExternalLink, Filter } from "lucide-react"
import { GitHubIcon } from "@/components/brand-icons"

function TiltCard({ project }: { project: (typeof projects)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(null)

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 12}deg) rotateY(${(x - 0.5) * 12}deg) translateZ(0)`
      el.style.transition = "transform 0.05s linear"
    })
  }, [])

  const reset = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    const el = ref.current
    if (!el) return
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)"
    el.style.transition = "transform 0.4s ease"
  }

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={reset} className="group relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-cyan-400/40 transition-colors">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-cyan-300">{project.category}</div>
      </div>
      <div className="relative p-6 space-y-4">
        <h3 className="text-xl font-semibold text-foreground group-hover:text-cyan-300 transition-colors">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => <span key={t} className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-white/5 border border-white/10 text-muted-foreground">{t}</span>)}
        </div>
        <div className="flex items-center gap-3 pt-2">
                          <a href={project.github} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-300 transition-colors"><GitHubIcon className="w-3.5 h-3.5" /> Código</a>
          <a href={project.demo} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-300 transition-colors"><ExternalLink className="w-3.5 h-3.5" /> Demo</a>
        </div>
      </div>
    </div>
  )
}

export function Projects() {
  const [filter, setFilter] = useState("All")
  const categories = ["All", ...new Set(projects.map((p) => p.category))]
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3"><span className="w-8 h-px bg-cyan-400" />03 — Proyectos</div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-foreground leading-tight">Laboratorio <br /><span className="text-muted-foreground">de código y seguridad</span></h2>
            </div>
          </Reveal>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {categories.map((c) => <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filter === c ? "bg-cyan-400 text-slate-950 border-cyan-400" : "bg-white/[0.03] text-muted-foreground border-white/10 hover:border-cyan-400/40"}`}>{c}</button>)}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => <Reveal key={p.id} delay={i * 80}><TiltCard project={p} /></Reveal>)}
        </div>
      </div>
    </section>
  )
}
