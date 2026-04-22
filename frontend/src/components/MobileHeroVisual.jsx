import React, { useEffect, useState } from "react";
import { Lightbulb, Bug, Shield, Terminal } from "lucide-react";

/**
 * Cyber-themed 2D visual shown on small screens in place of the 3D scene.
 * A stylized terminal with typing animation + floating particles + glow.
 */
export default function MobileHeroVisual() {
  const lines = [
    { prompt: "$", text: "whoami", color: "text-cyan-300" },
    { prompt: ">", text: "farley.piedrahita", color: "text-slate-300" },
    { prompt: "$", text: "cat skills.txt", color: "text-cyan-300" },
    { prompt: ">", text: "qa · automation · security", color: "text-slate-300" },
    { prompt: "$", text: "nmap -sV target.dev", color: "text-cyan-300" },
    { prompt: ">", text: "scan complete · 3 ports open", color: "text-amber-300" },
    { prompt: "$", text: "_", color: "text-cyan-300" },
  ];

  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setShown((n) => (n < lines.length ? n + 1 : n));
    }, 650);
    return () => clearInterval(id);
  }, [lines.length]);

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-[#05070E]/80 backdrop-blur-md overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        <span className="ml-2 text-[10px] font-mono text-slate-400">
          ~/portfolio — zsh
        </span>
      </div>
      {/* Body */}
      <div className="relative p-4 h-[260px] overflow-hidden">
        <div className="space-y-1.5">
          {lines.slice(0, shown).map((ln, i) => (
            <div key={i} className="flex items-start gap-2 font-mono text-[12px]">
              <span className="text-cyan-400">{ln.prompt}</span>
              <span className={ln.color}>
                {ln.text}
                {i === shown - 1 && (
                  <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 align-middle animate-pulse" />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Floating accents */}
        <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -top-10 left-10 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Corner icons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-cyan-300/70">
          <Bug className="w-3.5 h-3.5" />
          <Shield className="w-3.5 h-3.5" />
          <Terminal className="w-3.5 h-3.5" />
        </div>
      </div>
      {/* Footer hint */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10 text-[10px] font-mono text-cyan-300/80">
        <Lightbulb className="w-3 h-3" />
        <span>tip: usa el botón sol/luna para cambiar tema</span>
      </div>
    </div>
  );
}
