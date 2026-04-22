import React from "react";
import { profile } from "../data/mock";
import { Github, Linkedin, Twitter, Terminal, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#05070E] py-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="font-mono text-sm text-white">
              farley<span className="text-cyan-400">.dev</span>
            </div>
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} {profile.name}. Todos los derechos reservados.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Built with</span>
          <Heart className="w-3 h-3 text-cyan-400 fill-cyan-400" />
          <span>React, Three.js & Tailwind</span>
        </div>

        <div className="flex items-center gap-2">
          {[
            { icon: Github, href: profile.social.github },
            { icon: Linkedin, href: profile.social.linkedin },
            { icon: Twitter, href: profile.social.twitter }
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 hover:text-cyan-300 text-slate-300 flex items-center justify-center transition-colors"
            >
              <s.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
