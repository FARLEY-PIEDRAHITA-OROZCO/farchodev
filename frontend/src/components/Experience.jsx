import React from "react";
import { experience } from "../data/mock";
import { Briefcase, MapPin, CheckCircle2 } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 px-6 lg:px-10 bg-[#070A14]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
            <span className="w-8 h-px bg-cyan-400" />
            04 — Experiencia
          </div>
          <h2 className="text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Trayectoria <br />
            <span className="text-slate-400">profesional</span>
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />

          <div className="space-y-12">
            {experience.map((e, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={e.id}
                  className={`relative grid lg:grid-cols-2 gap-6 lg:gap-12 items-start`}
                >
                  {/* Node */}
                  <div className="absolute left-4 lg:left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20 z-10" />

                  <div
                    className={`pl-12 lg:pl-0 ${
                      isLeft ? "lg:pr-12 lg:text-right" : "lg:col-start-2 lg:pl-12"
                    }`}
                  >
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-colors">
                      <div
                        className={`flex items-center gap-3 mb-3 ${
                          isLeft ? "lg:justify-end" : ""
                        }`}
                      >
                        <span className="font-mono text-xs text-cyan-300 px-2 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/20">
                          {e.period}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {e.role}
                      </h3>
                      <div
                        className={`flex items-center gap-3 text-sm text-slate-400 mt-1 ${
                          isLeft ? "lg:justify-end" : ""
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          {e.company}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {e.location}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                        {e.description}
                      </p>
                      <ul
                        className={`mt-4 space-y-2 ${
                          isLeft ? "lg:text-right" : ""
                        }`}
                      >
                        {e.achievements.map((a) => (
                          <li
                            key={a}
                            className={`text-sm text-slate-300 flex items-start gap-2 ${
                              isLeft ? "lg:flex-row-reverse" : ""
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
