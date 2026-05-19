"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MapPin, Mail, Shield, Bug, Code2, Expand } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons"
import { Reveal } from "@/components/reveal"
import { profile } from "@/data"

export function About() {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <section id="about" className="relative py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest">
                  <span className="w-8 h-px bg-cyan-400" />01 — Sobre mí
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
                  Ingeniero curioso.<br /><span className="text-muted-foreground">Mentalidad de atacante.</span>
                </h2>
              </Reveal>

              <div className="relative mt-8 p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => setLightboxOpen(true)}>
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-cyan-400/40 overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:border-cyan-400/60">
                      <img src="/profile.jpg" alt={profile.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-400 border-2 border-background" />
                    </div>
                  </div>
                  <div>
                    <div className="text-foreground font-medium">{profile.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5" />{profile.location}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap gap-3">
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                  <a href={profile.social.github} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    <GitHubIcon className="w-3.5 h-3.5" /> GitHub
                  </a>
                  <a href={profile.social.linkedin} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    <LinkedInIcon className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">{profile.bio}</p>
              <p className="text-muted-foreground leading-relaxed">
                Mi enfoque está en crear pipelines de calidad robustos y, paralelamente, formarme en pentesting y análisis de vulnerabilidades.
                Creo firmemente que <span className="text-cyan-300">un buen QA piensa como un atacante</span>, y un buen hacker ético nunca deja de probar.
              </p>

              <div className="grid md:grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Bug, title: "QA Mindset", desc: "Diseño de casos, automatización y gates de calidad." },
                  { icon: Shield, title: "Security Focus", desc: "OWASP, pentesting básico y análisis de riesgos." },
                  { icon: Code2, title: "Dev Friendly", desc: "Colaboro en el código, no solo lo pruebo." },
                ].map((c) => (
                  <div key={c.title} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mb-3 group-hover:bg-cyan-400/20 transition-colors">
                      <c.icon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div className="text-foreground font-medium">{c.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative max-w-2xl rounded-2xl border border-cyan-400/30 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setLightboxOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-background/80 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground z-10">
                <Expand className="w-4 h-4 rotate-45" />
              </button>
              <img src="/profile.jpg" alt={profile.name} className="w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
