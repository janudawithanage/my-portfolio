import projectsData from "./projects.json";
import contentData from "./content.json";
import type { NavItem, Project, SkillCategory, Education, SocialLink, Experience } from "@/types";

export const content = contentData;
export const fullName = content.hero.firstName + " " + content.hero.lastName;
export const hasRecognition = [content.recognition.awards, content.recognition.certifications, content.recognition.volunteering].some(entries => entries.length > 0);
export const navItems: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  ...(hasRecognition ? [{ label: "Recognition", href: "#recognition" }] : []),
  { label: "Contact", href: "#contact" },
];
export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: content.hero.githubUrl, icon: "github" },
  { label: "LinkedIn", href: content.hero.linkedinUrl, icon: "linkedin" },
  { label: "Email", href: "mailto:" + content.contact.email, icon: "mail" },
];
export const featuredProjects = projectsData as Project[];
export const skillCategories = content.skills.entries as SkillCategory[];
export const educationData = content.education.entries as Education[];
export const experienceData = content.experience.entries as Experience[];
