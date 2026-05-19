"use client"

import { useState, useCallback } from "react"
import { Reveal } from "@/components/reveal"
import { profile } from "@/data"
import { Button } from "@/components/button"
import { Mail, Phone, MapPin, Send, Terminal } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons"

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)

  const handle = useCallback((k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [k]: e.target.value }))
  }, [])

  return (
    <section id="contact" className="relative py-28 px-6 lg:px-10 bg-muted/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest"><span className="w-8 h-px bg-cyan-400" />06 — Contacto</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-4xl lg:text-5xl font-semibold text-foreground leading-tight">Hablemos de <br /><span className="text-muted-foreground">tu próximo proyecto</span></h2>
            </Reveal>
            <p className="text-muted-foreground leading-relaxed">¿Tienes un proyecto de testing, automatización o quieres colaborar en investigación de seguridad? Estoy abierto a conversaciones.</p>

            <div className="space-y-3 pt-2">
              {[
                { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
                { icon: Phone, label: "Teléfono", value: profile.phone, href: `tel:${profile.phone}` },
                { icon: MapPin, label: "Ubicación", value: profile.location },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</div>
                    <div className={`text-sm ${item.href ? "text-foreground group-hover:text-cyan-300 transition-colors" : "text-foreground"}`}>
                      {item.href ? <a href={item.href}>{item.value}</a> : item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4">
              {[
                { icon: GitHubIcon, href: profile.social.github },
                { icon: LinkedInIcon, href: profile.social.linkedin },
                { icon: Terminal, href: profile.social.tryhackme },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 hover:text-cyan-300 text-muted-foreground flex items-center justify-center transition-colors">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-3 p-8 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 space-y-5">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
              <Terminal className="w-3.5 h-3.5" /><span>~/contact $ compose_message.sh</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Nombre</label>
                <input value={form.name} onChange={handle("name")} placeholder="Tu nombre" className="flex h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-foreground placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Email</label>
                <input type="email" value={form.email} onChange={handle("email")} placeholder="you@example.com" className="flex h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-foreground placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Asunto</label>
              <input value={form.subject} onChange={handle("subject")} placeholder="¿De qué hablamos?" className="flex h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-foreground placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Mensaje</label>
              <textarea rows={6} value={form.message} onChange={handle("message")} placeholder="Cuéntame sobre tu proyecto..." className="flex w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40 resize-none" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-medium">
              {loading ? "Enviando..." : <><Send className="w-4 h-4 mr-2" />Enviar mensaje</>}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
