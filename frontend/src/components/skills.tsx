"use client"

import { useState, useEffect, useRef } from "react"
import { Reveal } from "@/components/reveal"
import { skills } from "@/data"
import { Bug, Shield, Code2 } from "lucide-react"

const tabs = [
  { id: "qa", label: "QA Automation", icon: Bug },
  { id: "security", label: "Cybersecurity", icon: Shield },
  { id: "languages", label: "Lenguajes", icon: Code2 },
]

export function Skills() {
  const [active, setActive] = useState("qa")
  const list = skills[active]
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [status, setStatus] = useState<"idle" | "typing" | "done">("idle")

  useEffect(() => {
    setCurrentLine(0)
    setCurrentChar(0)
    setStatus("idle")
    if (list.length === 0) return

    let timer: ReturnType<typeof setTimeout>
    let line = 0
    let char = 0

    function tick() {
      char++
      setCurrentChar(char)
      if (char >= list[line].length) {
        if (line < list.length - 1) {
          line++
          char = 0
          setCurrentLine(line)
          setCurrentChar(0)
          timer = setTimeout(tick, 250)
        } else {
          setStatus("done")
        }
      } else {
        timer = setTimeout(tick, 30)
      }
    }

    setStatus("typing")
    timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [active, list])

  return (
    <section id="skills" className="relative py-28 px-6 lg:px-10 bg-muted/10">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: ["linear-gradient(rgba(34,211,238,1) 1px, transparent 1px)", "linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)"].join(", "), backgroundSize: "48px 48px" }} />

      <div className="max-w-7xl mx-auto relative">
        <Reveal>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
            <span className="w-8 h-px bg-cyan-400" />02 — Habilidades
          </div>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal delay={80}>
            <h2 className="text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
              Stack técnico <br /><span className="text-muted-foreground">& herramientas</span>
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setActive(t.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all ${active === t.id ? "bg-cyan-400 text-slate-950 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.18)]" : "bg-white/[0.03] text-muted-foreground border-white/10 hover:border-cyan-400/40"}`}>
                  <t.icon className="w-4 h-4" />{t.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div className="relative rounded-2xl border border-cyan-400/20 bg-background overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.06)]">
            <div className="relative z-0 flex items-center gap-2 px-5 py-3 border-b border-cyan-400/10 bg-[#04060c]">
              <span className="w-3 h-3 rounded-full bg-red-500/60" /><span className="w-3 h-3 rounded-full bg-yellow-500/60" /><span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="font-mono text-xs text-slate-600 ml-2">farcho@portfolio:~/skills — bash</span>
              <div className="flex-1 text-right"><span className="font-mono text-[10px] text-slate-700">{list.length} items</span></div>
            </div>
            <div className="relative z-0 p-6 font-mono text-sm min-h-[300px]">
              <div className="text-slate-500 mb-4">
                <span className="text-cyan-400">~</span><span className="text-slate-600">/</span><span className="text-cyan-400">skills</span>
                <span className="text-slate-600">/</span><span className="text-cyan-300">{active}</span>
                <span className="text-slate-600"> $ ls --catalog</span>
              </div>
              <div className="space-y-2.5 ml-1">
                {list.map((s, i) => {
                  if (i < currentLine) return <div key={s} className="flex items-center gap-2.5 text-foreground"><span className="text-cyan-400 shrink-0">▸</span><span>{s}</span></div>
                  if (i === currentLine && status !== "idle") return <div key={s} className="flex items-center gap-2.5 text-foreground"><span className="text-cyan-400 shrink-0">▸</span><span>{s.slice(0, currentChar)}{status === "typing" && <span className="inline-block w-2 h-[1.1em] bg-cyan-400 ml-0.5 animate-pulse align-text-bottom" />}</span></div>
                  return null
                })}
                {status === "done" && <div className="flex items-center gap-2.5 text-slate-500"><span className="text-cyan-400/50 shrink-0">▸</span><span className="inline-block w-2 h-[1.1em] bg-cyan-400/60 animate-pulse align-text-bottom" /></div>}
              </div>
              {status === "done" && <div className="mt-5 pt-3 border-t border-cyan-400/10 text-xs text-slate-600 flex items-center gap-2"><span className="w-4 h-px bg-cyan-400/20" /><span>{list.length} herramienta{list.length !== 1 ? "s" : ""} — stack actualizado 2026</span><span className="flex-1 h-px bg-cyan-400/20" /></div>}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
