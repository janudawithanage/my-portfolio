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
  { label: "Experience", href: "#experience" },
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
    id: "azure-distributed",
    title: "Distributed Joke System on Azure",
    description:
      "A fully distributed microservices system deployed on Azure with API Gateway (Kong), containerised services, ETL pipelines, and monitoring dashboards.",
    longDescription:
      "A production-style distributed system built on Azure Cloud with Kong API Gateway, Docker-containerised services, a moderation pipeline, ETL data processing, and a live monitoring dashboard. Demonstrates real-world cloud architecture patterns.",
    tech: ["Azure", "Docker", "Kong", "Node.js", "PostgreSQL", "Python", "CI/CD"],
    githubUrl: "https://github.com/janudawithanage",
    featured: true,
    status: "completed",
    year: "2025",
  },
  {
    id: "doctor-booking",
    title: "Doctor Booking System",
    description:
      "Full-stack web application for doctor appointment scheduling with patient and admin portals, authentication, and real-time availability management.",
    longDescription:
      "End-to-end booking platform built with a React frontend and Node.js/Express backend. Features role-based access (patient vs admin), appointment CRUD, and JWT authentication.",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS"],
    githubUrl: "https://github.com/janudawithanage",
    featured: true,
    status: "completed",
    year: "2025",
  },
  {
    id: "portfolio-site",
    title: "Personal Portfolio Website",
    description:
      "This portfolio — built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion. GitHub API integration ready for auto-updating project data.",
    longDescription:
      "A premium dark-luxury portfolio site built from scratch with Next.js 15 App Router, TypeScript, Tailwind CSS v4, and Framer Motion animations. Designed to showcase full-stack and cloud work, with a GitHub API integration layer ready to plug in.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Vercel"],
    githubUrl: "https://github.com/janudawithanage",
    liveUrl: "#",
    featured: true,
    status: "in-progress",
    year: "2025",
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
    id: "azure-project",
    company: "University Cloud Project (UCSC)",
    role: "Cloud Systems Developer",
    startDate: "Jan 2025",
    endDate: "Present",
    location: "Colombo, Sri Lanka",
    type: "part-time",
    description:
      "Designed and deployed a production-style distributed microservices system on Microsoft Azure as part of a university group project. The system uses Kong API Gateway, Docker containers, ETL pipelines, and a moderation workflow.",
    highlights: [
      "Deployed containerised services on Azure with Docker and CI/CD pipelines",
      "Configured Kong API Gateway for routing, rate limiting, and authentication",
      "Built an ETL pipeline to process and store joke submissions in PostgreSQL",
      "Set up a moderation workflow and monitoring dashboards for system observability",
    ],
    tech: ["Azure", "Docker", "Kong", "Node.js", "PostgreSQL", "Python", "GitHub Actions"],
  },
  {
    id: "fullstack-projects",
    company: "Personal & Academic Projects",
    role: "Full-Stack Developer",
    startDate: "Sep 2022",
    endDate: "Present",
    location: "Colombo, Sri Lanka",
    type: "freelance",
    description:
      "Building full-stack web applications as personal projects and for academic coursework at UCSC. Projects span booking systems, REST APIs, and UI-heavy single-page applications.",
    highlights: [
      "Built a Doctor Booking System with React, Node.js, and MongoDB",
      "Developed this portfolio with Next.js 15, TypeScript, and Framer Motion",
      "Implemented JWT authentication and role-based access control in multiple projects",
      "Maintained clean, well-documented codebases with Git branching workflows",
    ],
    tech: ["React", "Next.js", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "ucsc-community",
    company: "UCSC Tech Community",
    role: "Student Member & Contributor",
    startDate: "Sep 2022",
    endDate: "Present",
    location: "Colombo, Sri Lanka",
    type: "part-time",
    description:
      "Active participant in UCSC's computing community — contributing to knowledge sharing, participating in coding competitions, and collaborating on group software engineering projects throughout the degree programme.",
    highlights: [
      "Collaborated on group software engineering projects following Agile methodologies",
      "Participated in university-level competitive programming and hackathon events",
      "Currently self-studying for cloud and cybersecurity certifications",
      "Interests: Full-Stack, Azure Cloud, and Cybersecurity (actively learning)",
    ],
    tech: ["Java", "Python", "Git", "Agile", "Linux"],
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
