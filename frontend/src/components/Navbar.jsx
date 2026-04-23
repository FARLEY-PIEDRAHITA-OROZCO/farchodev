import React, { useEffect, useState, useMemo } from "react";
import { Menu, X, Terminal, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../context/ThemeContext";
import useActiveSection from "../hooks/useActiveSection";

const links = [
  { label: "Inicio", href: "#home", id: "home" },
  { label: "Sobre mí", href: "#about", id: "about" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Proyectos", href: "#projects", id: "projects" },
  { label: "Experiencia", href: "#experience", id: "experience" },
  { label: "Certificaciones", href: "#certs", id: "certs" },
  { label: "Contacto", href: "#contact", id: "contact" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const sectionIds = useMemo(() => links.map((l) => l.id), []);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[#05070E]/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:border-cyan-400/70 transition-colors">
            <Terminal className="w-4 h-4 text-cyan-300" />
          </div>
          <span className="font-mono text-sm tracking-wider text-white">
            farcho<span className="text-cyan-400">.dev</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-2 text-sm transition-colors relative group ${
                  isActive
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {l.label}
                <span
                  className={`absolute bottom-1 left-3 right-3 h-px origin-left transition-transform duration-300 ${
                    isActive
                      ? "bg-cyan-400 scale-x-100"
                      : "bg-cyan-400 scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={theme === "night" ? "Cambiar a modo día" : "Cambiar a modo noche"}
            title={theme === "night" ? "Modo día" : "Modo noche"}
            className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-colors"
          >
            {theme === "night" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
          <Button
            asChild
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-medium"
          >
            <a href="#contact">Hablemos</a>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-[#05070E]/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-4 flex flex-col gap-1">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`py-2.5 px-3 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-cyan-400/10 text-white border border-cyan-400/30"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                  <span>{l.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
