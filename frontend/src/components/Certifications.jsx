import React from "react";
import { certifications } from "../data/mock";
import { ShieldCheck, Shield, Terminal, Award, Bot, Lock } from "lucide-react";

const iconMap = { ShieldCheck, Shield, Terminal, Award, Bot, Lock };

export default function Certifications() {
  return (
    <section id="certs" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
            <span className="w-8 h-px bg-cyan-400" />
            05 — Certificaciones
          </div>
          <h2 className="text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Aprendizaje <br />
            <span className="text-slate-400">continuo & credenciales</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((c) => {
            const Icon = iconMap[c.icon] || Award;
            return (
              <div
                key={c.id}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-cyan-400/40 transition-colors overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-cyan-400/5 blur-3xl group-hover:bg-cyan-400/10 transition-colors" />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      {c.year}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium leading-snug">
                      {c.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{c.issuer}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      ID: {c.credentialId}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                        c.credentialId === "In Progress"
                          ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                          : "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                      }`}
                    >
                      {c.credentialId === "In Progress" ? "In Progress" : "Verified"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
