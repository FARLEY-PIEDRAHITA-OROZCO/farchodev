// Mock data for Farley Piedrahita Orozco's portfolio

export const profile = {
  name: "Farley Piedrahita Orozco",
  role: "QA Software Developer & Cybersecurity Student",
  tagline: "Breaking software to make it stronger. Studying the art of digital defense.",
  location: "Colombia",
  email: "frlpiedrahita@gmail.com",
  phone: "+57 302 251 5116",
  bio: "Desarrollador QA con enfoque en automatización de pruebas y estudiante junior de ciberseguridad. Combino la precisión del testing con la mentalidad ofensiva de un aprendiz de seguridad. Mi objetivo: construir software que no solo funcione, sino que resista.",
  social: {
    github: "https://github.com/FARLEY-PIEDRAHITA-OROZCO",
    linkedin: "https://linkedin.com/in/farleyp",
    twitter: "https://twitter.com/farleyp",
    tryhackme: "https://tryhackme.com/p/farleyp"
  },
  stats: [
    { label: "Test Cases Automated", value: "420+" },
    { label: "Bugs Hunted", value: "180+" },
    { label: "CTF Rooms Solved", value: "35+" },
    { label: "Years of Practice", value: "3+" }
  ]
};

export const skills = {
  qa: [
    { name: "Selenium", level: 90 },
    { name: "Cypress", level: 85 },
    { name: "Playwright", level: 80 },
    { name: "Postman / REST", level: 92 },
    { name: "JMeter", level: 70 },
    { name: "TestRail", level: 78 }
  ],
  security: [
    { name: "Burp Suite", level: 75 },
    { name: "Nmap", level: 80 },
    { name: "Wireshark", level: 70 },
    { name: "OWASP Top 10", level: 82 },
    { name: "Kali Linux", level: 78 },
    { name: "Metasploit", level: 65 }
  ],
  languages: [
    { name: "JavaScript", level: 88 },
    { name: "Python", level: 85 },
    { name: "Java", level: 75 },
    { name: "Bash", level: 80 },
    { name: "SQL", level: 82 }
  ]
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
    description: "Herramienta CLI en Python que automatiza el escaneo OWASP Top 10 básico sobre aplicaciones web locales. Ideal para labs y aprendizaje.",
    tags: ["Python", "OWASP", "CLI", "Security"],
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
    github: "#",
    demo: "#"
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
  }
];

export const experience = [
  {
    id: 1,
    company: "TechCore Solutions",
    role: "QA Automation Engineer",
    period: "2023 — Present",
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
    company: "Innovatech Labs",
    role: "Junior QA Analyst",
    period: "2022 — 2023",
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
    name: "ISTQB Certified Tester Foundation Level",
    issuer: "ISTQB",
    year: "2023",
    credentialId: "CTFL-2023-XXXXX",
    icon: "ShieldCheck"
  },
  {
    id: 2,
    name: "Certified Ethical Hacker (In Progress)",
    issuer: "EC-Council",
    year: "2025",
    credentialId: "In Progress",
    icon: "Shield"
  },
  {
    id: 3,
    name: "TryHackMe Pre-Security Path",
    issuer: "TryHackMe",
    year: "2024",
    credentialId: "THM-PRESEC-2024",
    icon: "Terminal"
  },
  {
    id: 4,
    name: "Google Cybersecurity Professional",
    issuer: "Coursera / Google",
    year: "2024",
    credentialId: "GOOG-CYB-2024",
    icon: "Award"
  },
  {
    id: 5,
    name: "Playwright Automation Specialist",
    issuer: "Test Automation University",
    year: "2023",
    credentialId: "TAU-PW-2023",
    icon: "Bot"
  },
  {
    id: 6,
    name: "CompTIA Security+ (Studying)",
    issuer: "CompTIA",
    year: "2025",
    credentialId: "In Progress",
    icon: "Lock"
  }
];
