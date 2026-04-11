import type {
  NavItem,
  Project,
  SkillCategory,
  Education,
  SocialLink,
  GitHubRepo,
} from "@/types";

// ─── Navigation ───────────────────────────────────────────────────────────────
export const navItems: NavItem[] = [
  { label: "About",     href: "#about" },
  { label: "Skills",    href: "#skills" },
  { label: "Projects",  href: "#projects" },
  { label: "GitHub",    href: "#github" },
  { label: "Education", href: "#education" },
  { label: "Contact",   href: "#contact" },
];

// ─── Social Links ─────────────────────────────────────────────────────────────
export const socialLinks: SocialLink[] = [
  { label: "GitHub",   href: "https://github.com/janudaw",            icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/janudaw",       icon: "linkedin" },
  { label: "Email",    href: "mailto:januda@example.com",             icon: "mail" },
  { label: "Twitter",  href: "https://twitter.com/janudaw",           icon: "twitter" },
];

// ─── Featured Projects ────────────────────────────────────────────────────────
export const featuredProjects: Project[] = [
  {
    id: "cloud-monitor",
    title: "CloudWatch Dashboard",
    description:
      "Real-time cloud infrastructure monitoring platform with alerting, cost analytics, and multi-cloud support.",
    longDescription:
      "A full-stack observability platform built for DevOps teams. Aggregates metrics from AWS, GCP, and Azure into a unified dashboard with intelligent alerting, cost forecasting, and automated incident response.",
    tech: ["Next.js", "TypeScript", "AWS", "Terraform", "PostgreSQL", "Redis", "Docker"],
    githubUrl: "https://github.com/janudaw/cloud-monitor",
    liveUrl: "#",
    featured: true,
    status: "completed",
    year: "2024",
  },
  {
    id: "sec-scanner",
    title: "VulnScan CLI",
    description:
      "Automated vulnerability scanner for web applications with OWASP Top 10 coverage and PDF reporting.",
    longDescription:
      "A Python-based security scanner that checks web apps for common vulnerabilities including XSS, SQL injection, CSRF, and misconfigured headers. Outputs structured JSON and styled PDF reports.",
    tech: ["Python", "FastAPI", "Playwright", "SQLite", "Docker", "Click"],
    githubUrl: "https://github.com/janudaw/vulnscan",
    featured: true,
    status: "completed",
    year: "2024",
  },
  {
    id: "devflow",
    title: "DevFlow API",
    description:
      "Scalable REST + GraphQL API gateway with JWT auth, rate limiting, and comprehensive API docs.",
    longDescription:
      "Production-ready API gateway built with Node.js and Fastify. Features role-based access control, API key management, request logging, and auto-generated Swagger/GraphQL Playground docs.",
    tech: ["Node.js", "Fastify", "GraphQL", "PostgreSQL", "Redis", "JWT", "Swagger"],
    githubUrl: "https://github.com/janudaw/devflow-api",
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
    description: "Crafting pixel-perfect, performant interfaces",
    skills: [
      { name: "React / Next.js",  level: 88 },
      { name: "TypeScript",       level: 85 },
      { name: "Tailwind CSS",     level: 90 },
      { name: "Framer Motion",    level: 78 },
      { name: "HTML & CSS",       level: 95 },
      { name: "Figma",            level: 70 },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    icon: "server",
    description: "Building robust APIs and distributed systems",
    skills: [
      { name: "Node.js",     level: 85 },
      { name: "Python",      level: 88 },
      { name: "Java",        level: 75 },
      { name: "PostgreSQL",  level: 80 },
      { name: "REST / GraphQL", level: 82 },
      { name: "Redis",       level: 72 },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    icon: "cloud",
    description: "Deploying and scaling in the cloud",
    skills: [
      { name: "AWS (EC2, S3, Lambda)", level: 78 },
      { name: "Docker",                level: 85 },
      { name: "Terraform",             level: 68 },
      { name: "CI/CD (GitHub Actions)",level: 80 },
      { name: "Linux / Bash",          level: 82 },
      { name: "Kubernetes",            level: 60 },
    ],
  },
  {
    id: "security",
    title: "Cybersecurity",
    icon: "shield",
    description: "Securing systems from first principles",
    skills: [
      { name: "Pen Testing",      level: 72 },
      { name: "Network Security", level: 75 },
      { name: "OWASP / CVEs",    level: 70 },
      { name: "Burp Suite",       level: 68 },
      { name: "Wireshark",        level: 72 },
      { name: "Cryptography",     level: 65 },
    ],
  },
];

// ─── Education ────────────────────────────────────────────────────────────────
export const educationData: Education[] = [
  {
    id: "ucsc",
    institution: "University of California, Santa Cruz",
    degree: "Bachelor of Science",
    field: "Computer Science",
    startDate: "September 2022",
    endDate: "Present",
    gpa: "3.7 / 4.0",
    location: "Santa Cruz, CA",
    description:
      "Pursuing a rigorous CS curriculum with focus on systems, algorithms, and software engineering. Active in the Cybersecurity Club and Hack@UCSC.",
    highlights: [
      "Dean's List — Fall 2022, Winter 2023, Fall 2023",
      "Vice President, Cybersecurity Club",
      "Hack@UCSC Hackathon — 2nd Place (2023)",
      "Relevant: OS, Algorithms, Networks, Compilers, ML, Distributed Systems",
    ],
  },
];

// ─── GitHub Repos (placeholder — replace with live API data) ──────────────────
export const placeholderRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "cloud-monitor",
    description: "Real-time multi-cloud infrastructure monitoring and alerting platform.",
    html_url: "https://github.com/janudaw/cloud-monitor",
    homepage: null,
    language: "TypeScript",
    stargazers_count: 42,
    forks_count: 7,
    topics: ["nextjs", "aws", "terraform", "monitoring"],
    updated_at: "2024-11-15T00:00:00Z",
    fork: false,
  },
  {
    id: 2,
    name: "vulnscan",
    description: "Automated OWASP Top-10 vulnerability scanner for web apps with PDF reporting.",
    html_url: "https://github.com/janudaw/vulnscan",
    homepage: null,
    language: "Python",
    stargazers_count: 28,
    forks_count: 4,
    topics: ["security", "python", "owasp", "cli"],
    updated_at: "2024-10-20T00:00:00Z",
    fork: false,
  },
  {
    id: 3,
    name: "devflow-api",
    description: "Scalable REST + GraphQL API gateway with auth, rate limiting, and auto-docs.",
    html_url: "https://github.com/janudaw/devflow-api",
    homepage: null,
    language: "JavaScript",
    stargazers_count: 19,
    forks_count: 2,
    topics: ["nodejs", "graphql", "api", "fastify"],
    updated_at: "2025-01-08T00:00:00Z",
    fork: false,
  },
  {
    id: 4,
    name: "bash-toolkit",
    description: "Collection of productivity scripts for macOS and Linux system automation.",
    html_url: "https://github.com/janudaw/bash-toolkit",
    homepage: null,
    language: "Shell",
    stargazers_count: 14,
    forks_count: 3,
    topics: ["bash", "automation", "linux", "macos"],
    updated_at: "2024-09-05T00:00:00Z",
    fork: false,
  },
  {
    id: 5,
    name: "portfolio",
    description: "My personal portfolio — built with Next.js 15, TypeScript, and Tailwind CSS.",
    html_url: "https://github.com/janudaw/portfolio",
    homepage: "https://janudaw.dev",
    language: "TypeScript",
    stargazers_count: 11,
    forks_count: 5,
    topics: ["portfolio", "nextjs", "tailwindcss"],
    updated_at: "2025-03-01T00:00:00Z",
    fork: false,
  },
  {
    id: 6,
    name: "algo-notes",
    description: "Curated solutions and explanations for 150+ LeetCode problems in Python and Java.",
    html_url: "https://github.com/janudaw/algo-notes",
    homepage: null,
    language: "Python",
    stargazers_count: 35,
    forks_count: 12,
    topics: ["leetcode", "algorithms", "python", "java"],
    updated_at: "2025-02-14T00:00:00Z",
    fork: false,
  },
];
