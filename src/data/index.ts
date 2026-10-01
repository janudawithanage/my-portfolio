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
      "Node.js microservices route submissions through RabbitMQ to an Auth0-protected moderation UI. Approved jokes are stored in MySQL and served through Kong; the stack runs locally in Docker.",
    tech: ["Node.js", "RabbitMQ", "MySQL", "Kong", "Docker", "Auth0", "Azure"],
    githubUrl: "https://github.com/janudawithanage/distributed-joke-system",
    featured: true,
    status: "completed",
    year: "2026",
  },
  {
    id: "smart-home-monitoring-control",
    title: "Smart Home Monitoring & Control",
    description:
      "An Expo and React Native app for device control, energy tracking, schedules, and security views. Supabase syncs device state with a companion web-based hardware simulator.",
    tech: ["Expo", "React Native", "TypeScript", "Supabase", "Docker"],
    githubUrl: "https://github.com/janudawithanage/smart-home-monitoring-control",
    featured: true,
    status: "completed",
    year: "2026",
  },
  {
    id: "rentigo",
    title: "Rentigo",
    description:
      "A team-built rental property management system using PHP and MySQL. I contributed tenant-facing property search, booking and lease workflows, rent payment tracking, and maintenance issue views.",
    tech: ["PHP", "MySQL", "JavaScript", "HTML", "CSS", "MVC"],
    githubUrl: "https://github.com/Jeyaneedhan21/Rentigo",
    featured: true,
    status: "completed",
    year: "2026",
  },
  {
    id: "becute-dreams-luxe",
    title: "Becute Dreams Luxe",
    description:
      "A frontend storefront demo for a sticker boutique, with product browsing, filters, detail pages, and a cart saved in local storage. Checkout and account pages demonstrate the interface without payment or authentication backends.",
    tech: ["React", "TypeScript", "React Router", "Tailwind CSS", "Zustand", "Framer Motion"],
    githubUrl: "https://github.com/janudawithanage/becute-dreams-luxe",
    liveUrl: "https://becute-dreams-luxe.vercel.app",
    featured: true,
    status: "completed",
    year: "2026",
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────
export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    icon: "monitor",
    description: "Building responsive, accessible web interfaces",
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
    description: "Designing APIs, services, and data models",
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
    description: "Working with Azure, containers, and CI/CD workflows",
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
    description: "Studying web and network security through coursework and practice",
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
      "Computer Science studies at UCSC, covering algorithms, networks, operating systems, distributed systems, software engineering, and databases.",
    highlights: [
      "21st Batch",
      "Built a compiler, Maze Runner, and Ludo simulations in C",
      "Used SonarQube to analyse code quality in coursework",
      "Collaborated on group projects using Git and Agile workflows",
      "Focus areas: full-stack development, cloud computing, and cybersecurity",
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
      "Designed a microservices-based joke submission and moderation system to explore message-driven workflows, API routing, and container deployment.",
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
      "Built a full-stack sportsbook in TypeScript with event, market, odds, bet, and account flows.",
    highlights: [
      "Built end-to-end in TypeScript with a focus on type safety and clean architecture",
      "Implemented complex domain logic for odds calculation and bet management",
      "Designed a data model for events, markets, and user accounts",
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
      "Built an IoT monitoring prototype that sends ESP32 sensor readings over MQTT to a web dashboard.",
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
      "Built a responsive movie browser with a public REST API, asynchronous data fetching, search, and filtering.",
    highlights: [
      "Integrated with a public movie API for live search and browsing",
      "Built a responsive UI with dynamic rendering and filtering",
    ],
    tech: ["JavaScript", "HTML", "CSS", "REST API"],
  },
];
