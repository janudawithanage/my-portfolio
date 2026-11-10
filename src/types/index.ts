// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
}

export interface RecognitionEntry {
  id: string;
  title: string;
  organisation: string;
  date: string;
  description?: string;
  url?: string;
  image?: string;
  logo?: string;
}

export interface RecognitionContent {
  title: string;
  description: string;
  awards: RecognitionEntry[];
  certifications: RecognitionEntry[];
  volunteering: RecognitionEntry[];
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
  status: "completed" | "in-progress" | "planned" | "design-only";
  year: string;
  /** Optional free-text date shown on the card, e.g. "Aug–Oct 2025". Falls back to `year`. */
  date?: string;
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
  result?: string;
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
  icon: SocialIcon;
}


// ─── Page structure ───────────────────────────────────────────────────────────
/** Sections that can be reordered or hidden. Hero is always first and Contact always last. */
export type SectionId =
  | "about" | "stats" | "now" | "education" | "skills" | "projects"
  | "experience" | "security" | "recognition" | "writing" | "talks" | "testimonials";

export interface SectionOrderEntry {
  id: SectionId;
  visible: boolean;
}

export interface LayoutContent {
  sectionOrder: SectionOrderEntry[];
}

interface SectionIntro {
  title: string;
  description: string;
}

// ─── Optional sections (each renders only when it has entries) ────────────────
export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface StatsContent {
  title: string;
  items: StatItem[];
}

export type NowKind = "building" | "learning" | "reading" | "exploring";

export interface NowItem {
  id: string;
  kind: NowKind;
  text: string;
  emoji?: string;
  url?: string;
}

export interface NowContent extends SectionIntro {
  updated?: string;
  items: NowItem[];
}

export interface SecurityEntry {
  id: string;
  title: string;
  result?: string;
  date: string;
  description?: string;
  url?: string;
  tags: string[];
}

export interface SecurityContent extends SectionIntro {
  entries: SecurityEntry[];
}

export interface WritingPost {
  id: string;
  title: string;
  platform?: string;
  date: string;
  excerpt?: string;
  url: string;
  cover?: string;
}

export interface WritingContent extends SectionIntro {
  posts: WritingPost[];
}

export type TalkType = "talk" | "paper" | "poster" | "workshop";

export interface TalkEntry {
  id: string;
  title: string;
  type: TalkType;
  venue: string;
  date: string;
  description?: string;
  url?: string;
}

export interface TalksContent extends SectionIntro {
  entries: TalkEntry[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  url?: string;
}

export interface TestimonialsContent extends SectionIntro {
  items: Testimonial[];
}

export type SocialIcon = "github" | "linkedin" | "x" | "medium" | "devto" | "youtube" | "instagram" | "facebook" | "dribbble" | "website" | "mail";

export interface SocialProfile {
  id: string;
  label: string;
  url: string;
  icon: Exclude<SocialIcon, "mail">;
}
