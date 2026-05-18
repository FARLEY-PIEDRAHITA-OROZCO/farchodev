// Mock data for Farley Piedrahita Orozco's portfolio

export const profile = {
  name: "Farley Piedrahita Orozco",
  role: "QA Software Developer & Cybersecurity Student",
  tagline: "Construyendo software más seguro a través de pruebas y ciberseguridad.",
  location: "Colombia",
  email: "farchodev@gmail.com",
  phone: "+57 302 251 5116",
  bio: "QA Software Developer con enfoque en automatización de pruebas y ciberseguridad. Combino la precisión del testing con una mentalidad orientada a la seguridad para construir software que no solo funcione correctamente, sino que también sea resiliente y confiable.",
  social: {
    github: "https://github.com/FARLEY-PIEDRAHITA-OROZCO",
    linkedin: "https://www.linkedin.com/in/farley-piedrahita-orozco-523073147",
    tryhackme: "https://tryhackme.com/p/farchodev"
  },
  stats: [
    { label: "Test Cases Automated", value: "420+" },
    { label: "Bugs Hunted", value: "180+" },
    { label: "CTF Rooms Solved", value: "35+" },
    { label: "Years of Practice", value: "1+" }
  ]
};

export const skills = {
  qa: ["Selenium", "Cypress", "Playwright", "Postman / REST", "JMeter", "TestRail"],
  security: ["Burp Suite", "Nmap", "Wireshark", "OWASP Top 10", "Kali Linux", "Metasploit"],
  languages: ["JavaScript", "Python", "Java", "Bash", "SQL"]
};

export const projects = [
  {
    id: 1,
    title: "AutoSuite QA Framework",
    category: "QA Automation",
    description: "Framework end-to-end construido con Playwright y TypeScript. Incluye reportes HTML interactivos, ejecución paralela y pipelines CI/CD con GitHub Actions.",
    tags: ["Playwright", "TypeScript", "CI/CD", "Docker"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    github: "#",
    demo: "#"
  },
  {
    id: 2,
    title: "VulnLab Scanner",
    category: "Cybersecurity",
    description: "Herramienta profesional de escaneo de vulnerabilidades web basada en OWASP Top 10 (2021), diseñada para automatizar pruebas de seguridad de manera modular, fácil de instalar y usar.",
    tags: ["Python", "OWASP", "CLI", "Security"],
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
    github: "https://github.com/FARLEY-PIEDRAHITA-OROZCO/vulnlab-scanner",
    demo: "https://pypi.org/project/vulnlab-scanner/"
  },
  {
    id: 3,
    title: "API Contract Validator",
    category: "QA Automation",
    description: "Servicio que valida contratos OpenAPI contra respuestas reales. Detecta breaking changes antes de llegar a producción.",
    tags: ["Node.js", "OpenAPI", "Postman", "Jest"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    github: "#",
    demo: "#"
  },
  {
    id: 4,
    title: "PhishGuard Analyzer",
    category: "Cybersecurity",
    description: "Dashboard que analiza encabezados y enlaces sospechosos en correos. Construido como proyecto de laboratorio personal.",
    tags: ["Python", "Flask", "Regex", "Threat Intel"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    github: "#",
    demo: "#"
  },
  {
    id: 5,
    title: "LoadPulse Performance",
    category: "QA Automation",
    description: "Suite de pruebas de carga con JMeter + K6, con visualización en Grafana. Probado contra APIs REST de alto tráfico.",
    tags: ["K6", "JMeter", "Grafana", "Performance"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    github: "#",
    demo: "#"
  },
  {
    id: 6,
    title: "CTF Writeups Archive",
    category: "Cybersecurity",
    description: "Colección de writeups de salas TryHackMe y HackTheBox resueltas. Documentación pedagógica de técnicas y herramientas.",
    tags: ["TryHackMe", "HTB", "Writeups", "Learning"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    github: "#",
    demo: "#"
  },
  {
    id: 7,
    title: "Farchódev Academy",
    category: "Full Stack",
    description: "Plataforma educativa de programación moderna con 3D interactivo (Three.js/React Three Fiber), animaciones Fluidas (Framer Motion), y un sistema de diseño oscuro premium. Incluye cursos, dashboards, roadmaps y comunidad.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Three.js", "Framer Motion"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    github: "https://github.com/FARLEY-PIEDRAHITA-OROZCO/farchodev-academy",
    demo: "https://farchodev-academy.vercel.app/"
  },
  {
    id: 8,
    title: "Farchódev Blog",
    category: "Full Stack",
    description: "Blog técnico personal con sistema de diseño oscuro premium, animaciones fluidas (Framer Motion), textura noise, orbes flotantes, barra de progreso de lectura, tabla de contenidos con scroll spy y CMS headless (Sanity).",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "Sanity"],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    github: "https://github.com/FARLEY-PIEDRAHITA-OROZCO/farchodev-blog",
    demo: "https://farchodev-blog.vercel.app/"
  }
];

export const experience = [
  {
    id: 1,
    company: "SQA - Software Quality Assurance S.A",
    role: "QA Automation",
    period: "Septiembre 2025 — Present",
    location: "Remote",
    description: "Diseño e implementación de frameworks de automatización E2E. Integración con pipelines CI/CD y reducción del 60% en regresiones críticas.",
    achievements: [
      "Automatización de 420+ casos de prueba en Playwright",
      "Implementación de quality gates en GitHub Actions",
      "Mentoría a 3 QA juniors en testing de APIs"
    ]
  },
  {
    id: 2,
    company: "SQA - Software Quality Assurance S.A",
    role: "QA Analyst",
    period: "Marzo 2025 — Septiembre 2025",
    location: "Medellín, CO",
    description: "Ejecución de pruebas manuales y automatizadas sobre plataformas SaaS. Documentación de bugs y coordinación con equipos de desarrollo.",
    achievements: [
      "Reporte y triage de 180+ bugs críticos",
      "Implementación de TestRail como fuente de verdad",
      "Pruebas exploratorias y de regresión semanales"
    ]
  },
  {
    id: 3,
    company: "Cybersecurity Bootcamp (Self-Study)",
    role: "Cybersecurity Student",
    period: "2024 — Present",
    location: "Online",
    description: "Formación autodidacta en seguridad ofensiva y defensiva. Participación activa en plataformas CTF y laboratorios prácticos.",
    achievements: [
      "35+ salas completadas en TryHackMe",
      "Estudio de OWASP Top 10 y OWASP API Security",
      "Prácticas con Burp Suite, Nmap y Wireshark"
    ]
  }
];

export const certifications = [
  {
    id: 1,
    name: "Tecnólogo en Análisis y Desarollo de Software",
    issuer: "Servicio Nacional de Aprendizaje (SENA)",
    year: "2026",
    credentialId: "9220002758287CC1000534117C",
    icon: "Terminal"
  },
  {
    id: 2,
    name: "Curso PIX RPA 3.0",
    issuer: "PIX Robotics",
    year: "2026",
    credentialId: "0157652215FP",
    icon: "Bot"
  },
  {
    id: 3,
    name: "Curso de Azure DevOps: Flujos de CI/CD",
    issuer: "Platzi",
    year: "2025",
    credentialId: "8acfa298-1bee-403c-8a19-a4da35ab69a4",
    icon: "Award"
  },
  {
    id: 4,
    name: "Fundamentos del Desarrollo Web Profesional",
    issuer: "Platzi",
    year: "2025",
    credentialId: "4249c17a-143d-45e8-b71b-44eb0a3bb62e",
    icon: "Terminal"
  },
  {
    id: 5,
    name: "Introducción al desarrollo de back-end",
    issuer: "Meta",
    year: "2025",
    credentialId: "FLN1KFPWW9VD",
    icon: "Terminal"
  },
  {
    id: 6,
    name: "Visualización, Análisis e Interpretación de Datos con Power BI",
    issuer: "CESDE",
    year: "2025",
    credentialId: "1000660587-556-CDE-40",
    icon: "Award"
  },
  {
    id: 7,
    name: "Fundamentos de Programación e Ingeniería de Software",
    issuer: "Platzi",
    year: "2025",
    credentialId: "1d541f71-f5cf-4cfe-a857-65f2fd39ffcf",
    icon: "Bot"
  },
  {
    id: 8,
    name: "Construcción de bases de datos con MySQL",
    issuer: "Servicio Nacional de Aprendizaje (SENA)",
    year: "2023",
    credentialId: "9537002860368CC1000534117C",
    icon: "Terminal"
  },
  {
    id: 9,
    name: "Metodología de la programación de sistemas informáticos",
    issuer: "Servicio Nacional de Aprendizaje (SENA)",
    year: "2023",
    credentialId: "9544002869307CC1000534117C",
    icon: "Terminal"
  }
];
