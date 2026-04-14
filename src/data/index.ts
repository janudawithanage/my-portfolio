import type {
  NavItem,
  Project,
  SkillCategory,
  Education,
  SocialLink,
  Experience,
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
      "A production-style distributed system: Node.js microservices, RabbitMQ message queuing, Kong API Gateway, Docker containers, MySQL persistence, and an Azure-ready deployment workflow.",
    tech: ["Node.js", "RabbitMQ", "MySQL", "Kong", "Docker", "Azure", "JavaScript"],
    githubUrl: "https://github.com/janudawithanage/distributed-joke-system",
    featured: true,
    status: "completed",
    year: "2026",
  },
  {
    id: "betting-system",
    title: "Sports Betting Platform",
    description:
      "A full-stack sportsbook built end-to-end in TypeScript. Complex domain logic covers odds calculation, markets, bet placement, and user account management.",
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
      "Real-time IoT monitoring system. An ESP32 reads temperature, humidity, and light sensors and streams live data via MQTT to a web dashboard with threshold alerts.",
    tech: ["ESP32", "MQTT", "C++", "HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/janudawithanage/esp32-sensovault",
    featured: true,
    status: "completed",
    year: "2026",
  },
  {
    id: "portfolio-site",
    title: "This Portfolio",
    description:
      "Built with Next.js 15, TypeScript, Tailwind CSS v4, and Framer Motion. Features a live GitHub API integration with ISR caching and a GitHub-driven skills section.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Vercel"],
    githubUrl: "https://github.com/janudawithanage/my-portfolio",
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


