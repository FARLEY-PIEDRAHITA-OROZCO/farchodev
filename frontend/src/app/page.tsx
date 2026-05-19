"use client"

import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Experience } from "@/components/experience"
import { Certifications } from "@/components/certifications"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

const Hero = dynamic(() => import("@/components/hero").then((m) => ({ default: m.Hero })), {
  ssr: false,
})

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Certifications />
      <Contact />
      <Footer />
    </>
  )
}
