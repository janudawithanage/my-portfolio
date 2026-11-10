import projectsData from "./projects.json";
import contentData from "./content.json";
import type {
  Education, Experience, LayoutContent, NowContent, Project, RecognitionContent, SecurityContent,
  SkillCategory, SocialLink, SocialProfile, StatsContent, TalksContent, TestimonialsContent, WritingContent,
} from "@/types";

type Raw = typeof contentData;

/** content.json, typed. Optional fields may be absent and new lists start empty. */
export interface PortfolioContent {
  layout: LayoutContent;
  hero: Raw["hero"];
  about: Raw["about"];
  stats: StatsContent;
  now: NowContent;
  education: { title: string; description: string; entries: Education[] };
  skills: { title: string; description: string; entries: SkillCategory[] };
  projects: Raw["projects"];
  experience: { title: string; description: string; entries: Experience[] };
  security: SecurityContent;
  recognition: RecognitionContent;
  writing: WritingContent;
  talks: TalksContent;
  testimonials: TestimonialsContent;
  contact: Omit<Raw["contact"], "socials"> & { phone?: string; socials: SocialProfile[] };
}

export const content = contentData as unknown as PortfolioContent;
export const fullName = content.hero.firstName + " " + content.hero.lastName;

const normalise = (href: string) => href.trim().toLowerCase().replace(/\/+$/, "");
const profiles: SocialLink[] = [
  { label: "GitHub", href: content.hero.githubUrl, icon: "github" },
  { label: "LinkedIn", href: content.hero.linkedinUrl, icon: "linkedin" },
  ...content.contact.socials.map(profile => ({ label: profile.label, href: profile.url, icon: profile.icon })),
];
/** Profile links (deduplicated by URL), followed by email. Shared by the hero, contact section and footer. */
export const socialLinks: SocialLink[] = [
  ...profiles.filter((link, index) => profiles.findIndex(other => normalise(other.href) === normalise(link.href)) === index),
  { label: "Email", href: "mailto:" + content.contact.email, icon: "mail" },
];
export const featuredProjects = projectsData as Project[];
export const skillCategories = content.skills.entries;
export const educationData = content.education.entries;
export const experienceData = content.experience.entries;
