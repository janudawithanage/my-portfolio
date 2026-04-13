import type {
  NavItem,
  Project,
  SkillCategory,
  Education,
  SocialLink,
  GitHubRepo,
  Experience,
  Service,
} from "@/types";

// ─── Navigation ───────────────────────────────────────────────────────────────
export const navItems: NavItem[] = [
  { label: "About",      href: "#about" },
  { label: "Skills",     href: "#skills" },
  { label: "Experience",  href: "#experience" },
  { label: "Projects",   href: "#projects" },
  { label: "Education",  href: "#education" },
  { label: "Contact",    href: "#contact" },
];

// ─── Social Links ─────────────────────────────────────────────────────────────
export const socialLinks: SocialLink[] = [
  { label: "GitHub",   href: "https://github.com/janudawithanage",       icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/janudawithanage",  icon: "linkedin" },
  { label: "Email",    href: "mailto:janudawithanage@gmail.com",         icon: "mail" },
];

// ─── Featured Projects ────────────────────────────────────────────────────────
export const featuredProjects: Project[] = [
  {
    id: "distributed-joke-system",
    title: "Distributed Joke System",
    description:
      "A fully distributed microservices system with Node.js, RabbitMQ, MySQL, Kong API Gateway, Docker, and Azure-ready deployment workflows.",
    longDescription:
      "A production-style distributed system built entirely as a personal project. Features multi-service architecture, message queuing with RabbitMQ, Kong API Gateway for routing and rate limiting, Docker containerisation, and a moderation pipeline with MySQL persistence.",
    tech: ["Node.js", "RabbitMQ", "MySQL", "Kong", "Docker", "Azure", "JavaScript"],
    githubUrl: "https://github.com/janudawithanage/distributed-joke-system",
    featured: true,
    status: "completed",
    year: "2026",
  },
  {
    id: "betting-system",
    title: "Betting System",
    description:
      "A premium sportsbook platform built end-to-end in TypeScript, with complex domain logic for odds, markets, and bet management.",
    longDescription:
      "A full-stack betting/sportsbook platform built from scratch in TypeScript. Covers complex domain modelling for events, markets, odds, and user accounts — a challenging project for practising advanced TypeScript patterns and full-stack architecture.",
    tech: ["TypeScript", "Node.js", "React"],
    githubUrl: "https://github.com/janudawithanage/betting-system",
    featured: true,
    status: "completed",
    year: "2026",
  },
  {
    id: "esp32-sensovault",
    title: "ESP32 SensoVault",
    description:
      "Real-time IoT monitoring system — an ESP32 reads temperature, humidity, and light sensors and streams data via MQTT to a live web dashboard.",
    longDescription:
      "A hardware + software project built to explore IoT. An ESP32 microcontroller reads sensor data and publishes it over MQTT. A web dashboard visualises the live readings with real-time charts and threshold alerts.",
    tech: ["ESP32", "MQTT", "C++", "HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/janudawithanage/esp32-sensovault",
    featured: true,
    status: "completed",
    year: "2026",
  },
  {
    id: "portfolio-site",
    title: "Personal Portfolio Website",
    description:
      "This portfolio — built with Next.js 15, TypeScript, Tailwind CSS v4, and Framer Motion, with a live GitHub API integration.",
    longDescription:
      "A premium dark-luxury portfolio built from scratch with Next.js 15 App Router, TypeScript, Tailwind CSS v4, and Framer Motion animations. Features a GitHub API integration that auto-updates the projects section and dynamically adjusts skill percentages from real repo usage.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Vercel"],
    githubUrl: "https://github.com/janudawithanage/my-portfolio",
    liveUrl: "#",
    featured: true,
    status: "in-progress",
    year: "2026",
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────
export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    icon: "monitor",
    description: "Building responsive, accessible, and visually polished UIs",
    skills: [
      { name: "React / Next.js",  level: 85 },
      { name: "TypeScript",       level: 80 },
      { name: "Tailwind CSS",     level: 88 },
      { name: "HTML & CSS",       level: 92 },
      { name: "Framer Motion",    level: 72 },
      { name: "Figma / UI Design",level: 65 },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    icon: "server",
    description: "Designing and building robust APIs and server-side systems",
    skills: [
      { name: "Node.js / Express", level: 82 },
      { name: "Python",            level: 80 },
      { name: "Java",              level: 75 },
      { name: "REST APIs",         level: 85 },
      { name: "PostgreSQL / MySQL",level: 78 },
      { name: "MongoDB",           level: 72 },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    icon: "cloud",
    description: "Deploying and operating systems on Azure and Docker",
    skills: [
      { name: "Microsoft Azure",       level: 75 },
      { name: "Docker & Containers",   level: 80 },
      { name: "GitHub Actions CI/CD",  level: 78 },
      { name: "Kong API Gateway",      level: 70 },
      { name: "Linux / Bash",          level: 78 },
      { name: "Networking Fundamentals",level: 72 },
    ],
  },
  {
    id: "security",
    title: "Cybersecurity",
    icon: "shield",
    description: "Learning offensive & defensive security — actively studying",
    skills: [
      { name: "Network Security",   level: 65 },
      { name: "OWASP Top 10",       level: 68 },
      { name: "Web App Security",   level: 62 },
      { name: "Cryptography Basics",level: 60 },
      { name: "Wireshark",          level: 58 },
      { name: "CTF Challenges",     level: 55 },
    ],
  },
];

// ─── Education ────────────────────────────────────────────────────────────────
export const educationData: Education[] = [
  {
    id: "ucsc",
    institution: "University of Colombo School of Computing (UCSC)",
    degree: "Bachelor of Science",
    field: "Computer Science",
    startDate: "September 2022",
    endDate: "Present",
    location: "Colombo, Sri Lanka",
    description:
      "Pursuing a rigorous BSc in Computer Science at UCSC — one of Sri Lanka's premier computing faculties. Currently a 3rd year undergraduate (21st Batch) with a strong focus on software engineering, distributed systems, and cybersecurity fundamentals.",
    highlights: [
      "21st Batch — Currently in 3rd Year",
      "Core modules: Data Structures & Algorithms, Computer Networks, Operating Systems, Distributed Systems, Software Engineering, Database Systems",
      "Active participant in university coding competitions and tech community events",
      "Specialisation interests: Full-Stack Development, Cloud Computing (Azure) & Cybersecurity",
      "Expected graduation: 2026",
    ],
  },
];

// ─── GitHub Repos (placeholder — replace with live API data) ──────────────────
export const placeholderRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "distributed-joke-system",
    description: "Microservices system on Azure with Kong gateway, ETL pipeline, and monitoring.",
    html_url: "https://github.com/janudawithanage",
    homepage: null,
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["azure", "docker", "microservices", "kong"],
    updated_at: "2025-03-15T00:00:00Z",
    fork: false,
  },
  {
    id: 2,
    name: "doctor-booking-system",
    description: "Full-stack doctor appointment booking app with patient and admin portals.",
    html_url: "https://github.com/janudawithanage",
    homepage: null,
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["react", "nodejs", "mongodb", "fullstack"],
    updated_at: "2025-02-20T00:00:00Z",
    fork: false,
  },
  {
    id: 3,
    name: "my-portfolio",
    description: "Personal portfolio — Next.js 15, TypeScript, Tailwind v4, Framer Motion.",
    html_url: "https://github.com/janudawithanage",
    homepage: "#",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["nextjs", "portfolio", "tailwindcss", "typescript"],
    updated_at: "2025-04-10T00:00:00Z",
    fork: false,
  },
  {
    id: 4,
    name: "ucsc-coursework",
    description: "Collection of UCSC CS coursework — algorithms, OS, networks, SE projects.",
    html_url: "https://github.com/janudawithanage",
    homepage: null,
    language: "Java",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["ucsc", "algorithms", "java", "coursework"],
    updated_at: "2025-01-10T00:00:00Z",
    fork: false,
  },
  {
    id: 5,
    name: "azure-cloud-projects",
    description: "Azure cloud project experiments — containers, networking, CI/CD pipelines.",
    html_url: "https://github.com/janudawithanage",
    homepage: null,
    language: "Shell",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["azure", "cloud", "devops", "docker"],
    updated_at: "2025-03-05T00:00:00Z",
    fork: false,
  },
  {
    id: 6,
    name: "security-learning",
    description: "CTF writeups, OWASP notes, and web security experiments as I learn cybersecurity.",
    html_url: "https://github.com/janudawithanage",
    homepage: null,
    language: "Python",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["security", "ctf", "owasp", "learning"],
    updated_at: "2025-02-28T00:00:00Z",
    fork: false,
  },
];

// ─── Experience ───────────────────────────────────────────────────────────────
export const experienceData: Experience[] = [
  {
    id: "distributed-joke-system",
    company: "Personal Project",
    role: "Cloud & Backend Developer",
    startDate: "Mar 2026",
    endDate: "Apr 2026",
    location: "Colombo, Sri Lanka",
    type: "personal",
    description:
      "My most complex personal project — a fully distributed joke submission and moderation system with microservices architecture, message queuing, and API gateway. Built to learn real-world cloud and distributed systems patterns.",
    highlights: [
      "Designed multi-service architecture with Node.js microservices and RabbitMQ message queuing",
      "Configured Kong API Gateway for routing, rate limiting, and authentication",
      "Containerised all services with Docker; Azure-ready deployment workflows",
      "Built a moderation pipeline and MySQL persistence layer",
    ],
    tech: ["Node.js", "RabbitMQ", "MySQL", "Kong", "Docker", "Azure", "JavaScript"],
  },
  {
    id: "betting-system",
    company: "Personal Project",
    role: "Full-Stack Developer",
    startDate: "Mar 2026",
    endDate: "Apr 2026",
    location: "Colombo, Sri Lanka",
    type: "personal",
    description:
      "A premium sportsbook / betting platform built with TypeScript — a challenging domain for practising complex state management, real-time data, and clean full-stack architecture.",
    highlights: [
      "Built end-to-end in TypeScript with a focus on type safety and clean architecture",
      "Implemented complex domain logic for odds calculation and bet management",
      "Designed a scalable data model for events, markets, and user accounts",
    ],
    tech: ["TypeScript", "Node.js", "React"],
  },
  {
    id: "esp32-sensovault",
    company: "Personal Project",
    role: "IoT & Web Developer",
    startDate: "Mar 2026",
    endDate: "Mar 2026",
    location: "Colombo, Sri Lanka",
    type: "personal",
    description:
      "A real-time IoT monitoring system using an ESP32 microcontroller, MQTT protocol, and a live web dashboard — built to explore the intersection of hardware and software.",
    highlights: [
      "Programmed ESP32 to read temperature, humidity, and light sensors",
      "Streamed sensor data in real-time over MQTT to a web dashboard",
      "Built a live dashboard displaying real-time charts and alerts",
    ],
    tech: ["ESP32", "MQTT", "HTML", "CSS", "JavaScript", "C++"],
  },
  {
    id: "movie-app",
    company: "Personal Project",
    role: "Frontend Developer",
    startDate: "Feb 2026",
    endDate: "Mar 2026",
    location: "Colombo, Sri Lanka",
    type: "personal",
    description:
      "A movie browsing app built with JavaScript to practise working with third-party REST APIs, async data fetching, and dynamic UI rendering.",
    highlights: [
      "Integrated with a public movie API for live search and browsing",
      "Built a responsive UI with dynamic rendering and filtering",
    ],
    tech: ["JavaScript", "HTML", "CSS", "REST API"],
  },
  {
    id: "ucsc-degree",
    company: "University of Colombo School of Computing",
    role: "BSc Computer Science — Undergraduate",
    startDate: "Sep 2022",
    endDate: "Present",
    location: "Colombo, Sri Lanka",
    type: "university",
    description:
      "Currently studying for a BSc in Computer Science at UCSC. University-assigned projects include a compiler in C, a maze game simulation, a Ludo game, and SonarQube-based code quality analysis.",
    highlights: [
      "Built a compiler as part of the Compiler Construction module (C)",
      "Implemented a Maze Runner game and a Ludo game simulation in C",
      "Completed modules in OS, Networks, Distributed Systems, SE, and Algorithms",
      "Collaborated on group projects using Agile and Git branching workflows",
    ],
    tech: ["C", "Java", "Python", "SQL", "Git", "Linux", "Agile"],
  },
];

// ─── Services / What I Build ──────────────────────────────────────────────────
export const servicesData: Service[] = [
  {
    id: "fullstack",
    title: "Full-Stack Web Development",
    description:
      "End-to-end web applications — from pixel-perfect React/Next.js frontends to robust Node.js or Python backends with PostgreSQL or MongoDB. I build things that are fast, accessible, and maintainable.",
    tags: ["Next.js", "React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB"],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps (Azure)",
    description:
      "Deploying and operating scalable services on Microsoft Azure. I containerise apps with Docker, wire up CI/CD pipelines with GitHub Actions, and work with cloud networking and API gateways.",
    tags: ["Azure", "Docker", "GitHub Actions", "Kong Gateway", "Linux"],
  },
  {
    id: "security",
    title: "Cybersecurity — Actively Learning",
    description:
      "I'm actively studying cybersecurity: web application security, OWASP Top 10, network security fundamentals, and CTF challenges. Security-first thinking is baked into everything I build.",
    tags: ["OWASP Top 10", "Web Security", "Network Security", "CTF", "Cryptography"],
  },
  {
    id: "api",
    title: "API Design & Backend Systems",
    description:
      "Designing RESTful APIs with clean architecture, proper authentication (JWT), and solid documentation. I've built and integrated APIs across multiple academic and personal projects.",
    tags: ["REST APIs", "JWT Auth", "Express", "FastAPI", "Swagger / OpenAPI"],
  },
];
