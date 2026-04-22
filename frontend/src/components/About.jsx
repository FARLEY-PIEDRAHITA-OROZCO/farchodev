import React from "react";
import { profile } from "../data/mock";
import { MapPin, Mail, Github, Linkedin, Shield, Bug, Code2 } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest">
              <span className="w-8 h-px bg-cyan-400" />
              01 — Sobre mí
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Ingeniero curioso. <br />
              <span className="text-slate-400">Mentalidad de atacante.</span>
            </h2>

            {/* Avatar block */}
            <div className="relative mt-8 p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-cyan-400/40 flex items-center justify-center">
                    <span className="text-2xl font-mono font-semibold text-white">
                      FP
                    </span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#05070E]" />
                </div>
                <div>
                  <div className="text-white font-medium">{profile.name}</div>
                  <div className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.location}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
                <a
                  href={profile.social.github}
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
                <a
                  href={profile.social.linkedin}
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">
              {profile.bio}
            </p>
            <p className="text-slate-400 leading-relaxed">
              Mi enfoque está en crear pipelines de calidad robustos y,
              paralelamente, formarme en pentesting y análisis de vulnerabilidades.
              Creo firmemente que <span className="text-cyan-300">un buen QA piensa como un atacante</span>,
              y un buen hacker ético nunca deja de probar.
            </p>

            <div className="grid md:grid-cols-3 gap-4 pt-4">
              {[
                {
                  icon: Bug,
                  title: "QA Mindset",
                  desc: "Diseño de casos, automatización y gates de calidad."
                },
                {
                  icon: Shield,
                  title: "Security Focus",
                  desc: "OWASP, pentesting básico y análisis de riesgos."
                },
                {
                  icon: Code2,
                  title: "Dev Friendly",
                  desc: "Colaboro en el código, no solo lo pruebo."
                }
              ].map((c) => (
                <div
                  key={c.title}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mb-3 group-hover:bg-cyan-400/20 transition-colors">
                    <c.icon className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div className="text-white font-medium">{c.title}</div>
                  <div className="text-sm text-slate-400 mt-1">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
