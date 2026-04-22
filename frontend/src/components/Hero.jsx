import React from "react";
import Scene3D from "./Scene3D";
import { Button } from "./ui/button";
import { ArrowDown, Download, Shield, Bug } from "lucide-react";
import { profile } from "../data/mock";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden pt-24 pb-16"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(96,165,250,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)"
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-6rem)]">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Disponible para nuevos retos
          </div>

          <div className="space-y-4">
            <p className="font-mono text-sm text-cyan-400/80">
              &gt; whoami
            </p>
            <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]">
              {profile.name.split(" ")[0]}{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {profile.name.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <h2 className="text-xl lg:text-2xl text-slate-300 font-light">
              {profile.role}
            </h2>
          </div>

          <p className="text-slate-400 text-base lg:text-lg max-w-xl leading-relaxed">
            {profile.tagline}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-medium"
            >
              <a href="#projects">
                Ver proyectos
                <ArrowDown className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <a href="#contact">
                <Download className="mr-2 w-4 h-4" />
                Descargar CV
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-cyan-400" />
              <span>QA Automation</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Cybersecurity Jr.</span>
            </div>
          </div>
        </div>

        {/* 3D Scene */}
        <div className="relative h-[420px] lg:h-[560px] w-full">
          <div className="absolute inset-0 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden">
            <Scene3D />
          </div>
          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-cyan-400/60" />
          <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-cyan-400/60" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-cyan-400/60" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-cyan-400/60" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-cyan-300/70 uppercase">
            [ system online ]
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {profile.stats.map((s) => (
            <div
              key={s.label}
              className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:border-cyan-400/40 transition-colors group"
            >
              <div className="text-3xl font-semibold text-white">
                {s.value}
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                {s.label}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 to-blue-500/0 group-hover:from-cyan-400/5 group-hover:to-blue-500/5 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
