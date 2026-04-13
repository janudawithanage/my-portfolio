// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
  status: "completed" | "in-progress" | "planned";
  year: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  fork: boolean;
}

/**
 * Discriminated union returned by `fetchGitHubRepos()`.
 * Always handle all three status branches in consuming components.
 *
 * `syncedAt` — ISO timestamp captured at fetch time on the server.
 * Pass it down to client components so they can show a live-updating
 * "Last synced X ago" indicator without any client-to-server round-trip.
 */
export type GitHubFetchResult =
  | { status: "success"; repos: GitHubRepo[]; syncedAt: string }
  | { status: "error"; message: string }
  | { status: "empty" };

// ─── Skills ───────────────────────────────────────────────────────────────────
export interface SkillItem {
  name: string;
  level?: number; // 1-100
  icon?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  skills: SkillItem[];
}

// ─── Education ────────────────────────────────────────────────────────────────
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | "Present";
  gpa?: string;
  location: string;
  description: string;
  highlights: string[];
  logo?: string;
}

// ─── Experience ───────────────────────────────────────────────────────────────
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | "Present";
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract" | "freelance" | "university" | "personal";
  description: string;
  highlights: string[];
  tech: string[];
}

// ─── Social ───────────────────────────────────────────────────────────────────
export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

// ─── Testimonial ──────────────────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
