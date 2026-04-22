import React, { useState, useRef } from "react";
import Reveal from "./Reveal";
import { projects } from "../data/mock";
import { Github, ExternalLink, Filter } from "lucide-react";

function TiltCard({ project }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rotY = (x - 0.5) * 12;
    const rotX = (0.5 - y) * 12;
    setStyle({
      transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`,
      transition: "transform 0.05s linear"
    });
  };

  const reset = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.4s ease"
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={style}
      className="group relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-cyan-400/40 transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070E] via-[#05070E]/70 to-transparent" />
        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-cyan-300">
          {project.category}
        </div>
      </div>

      <div className="relative p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-white/5 border border-white/10 text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <a
            href={project.github}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <Github className="w-3.5 h-3.5" /> Código
          </a>
          <a
            href={project.demo}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Demo
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
                <span className="w-8 h-px bg-cyan-400" />
                03 — Proyectos
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-white leading-tight">
                Laboratorio <br />
                <span className="text-slate-400">de código y seguridad</span>
              </h2>
            </div>
          </Reveal>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  filter === c
                    ? "bg-cyan-400 text-slate-950 border-cyan-400"
                    : "bg-white/[0.03] text-slate-300 border-white/10 hover:border-cyan-400/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <TiltCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
