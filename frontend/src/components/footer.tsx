import { Heart } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons"
import { profile } from "@/data"

const sections = [
  {
    title: "Navegación",
    links: [
      { href: "#about", label: "Sobre mí" },
      { href: "#skills", label: "Skills" },
      { href: "#projects", label: "Proyectos" },
      { href: "#contact", label: "Contacto" },
    ],
  },
  {
    title: "Proyectos",
    links: [
      { href: "https://farchodev-academy.vercel.app", label: "Farchódev Academy" },
      { href: "https://farchodev-blog.vercel.app", label: "Farchódev Blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Privacidad" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span className="text-cyan-300">farcho</span><span className="text-muted-foreground">.dev</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              QA Automation & Cybersecurity — construyendo software más seguro.
            </p>
            <div className="flex items-center gap-2">
              <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 hover:text-cyan-300 text-muted-foreground flex items-center justify-center transition-colors" aria-label="GitHub">
                <GitHubIcon className="w-3.5 h-3.5" />
              </a>
              <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 hover:text-cyan-300 text-muted-foreground flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-sm font-medium text-foreground mb-4">{s.title}</h4>
              <ul className="space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-sm text-muted-foreground hover:text-cyan-300 transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {profile.name}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-red-400" /> por Farley Piedrahita
          </p>
        </div>
      </div>
    </footer>
  )
}
