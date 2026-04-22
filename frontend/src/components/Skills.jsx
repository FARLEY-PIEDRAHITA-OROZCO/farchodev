import React, { useState } from "react";
import { skills } from "../data/mock";
import { Bug, Shield, Code2 } from "lucide-react";

const tabs = [
  { id: "qa", label: "QA Automation", icon: Bug, color: "cyan" },
  { id: "security", label: "Cybersecurity", icon: Shield, color: "blue" },
  { id: "languages", label: "Lenguajes", icon: Code2, color: "sky" }
];

export default function Skills() {
  const [active, setActive] = useState("qa");
  const list = skills[active];

  return (
    <section id="skills" className="relative py-28 px-6 lg:px-10 bg-[#070A14]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
              <span className="w-8 h-px bg-cyan-400" />
              02 — Habilidades
            </div>
            <h2 className="text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Stack técnico <br />
              <span className="text-slate-400">& herramientas</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all ${
                    isActive
                      ? "bg-cyan-400 text-slate-950 border-cyan-400"
                      : "bg-white/[0.03] text-slate-300 border-white/10 hover:border-cyan-400/40"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {list.map((s, idx) => (
            <div
              key={s.name}
              className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-colors overflow-hidden"
              style={{ transitionDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan-400/60">
                    0{idx + 1}
                  </span>
                  <span className="text-white font-medium">{s.name}</span>
                </div>
                <span className="font-mono text-sm text-cyan-300">
                  {s.level}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-1000"
                  style={{ width: `${s.level}%` }}
                />
              </div>
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-cyan-400/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
