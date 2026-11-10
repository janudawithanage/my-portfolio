import { content, featuredProjects, skillCategories } from "@/data";
import { hasContent } from "@/lib/has-content";
import type { NavItem, SectionId } from "@/types";

interface SectionMeta {
  /** Eyebrow label, shown after the section number. */
  label: string;
  /** Navigation label. Sections without one are reachable by scrolling only. */
  nav?: string;
  /** Bands without a heading (the stats band) do not take a section number. */
  numbered: boolean;
}

export const sectionMeta: Record<SectionId, SectionMeta> = {
  about: { label: "A little about me", nav: "About", numbered: true },
  stats: { label: "By the numbers", numbered: false },
  now: { label: "Now", numbered: true },
  education: { label: "Education", nav: "Education", numbered: true },
  skills: { label: "The toolkit", nav: "Skills", numbered: true },
  projects: { label: "Selected work", nav: "Work", numbered: true },
  experience: { label: "Experience", nav: "Experience", numbered: true },
  security: { label: "Security & CTF", nav: "Security", numbered: true },
  recognition: { label: "Recognition", nav: "Recognition", numbered: true },
  writing: { label: "Writing", nav: "Writing", numbered: true },
  talks: { label: "Talks & publications", nav: "Talks", numbered: true },
  testimonials: { label: "Kind words", numbered: true },
};

const sectionContent: Record<SectionId, () => unknown> = {
  about: () => [content.about.lead, content.about.paragraphs],
  stats: () => content.stats.items,
  now: () => content.now.items,
  education: () => content.education.entries,
  skills: () => skillCategories.map(category => category.skills),
  projects: () => featuredProjects,
  experience: () => content.experience.entries,
  security: () => content.security.entries,
  recognition: () => [content.recognition.awards, content.recognition.certifications, content.recognition.volunteering],
  writing: () => content.writing.posts,
  talks: () => content.talks.entries,
  testimonials: () => content.testimonials.items,
};

/** True when a section has at least one real entry to show. */
export function sectionHasContent(id: SectionId): boolean {
  return hasContent(sectionContent[id]());
}

const sectionIds = Object.keys(sectionMeta) as SectionId[];
const configured = content.layout.sectionOrder.filter(entry => sectionIds.includes(entry.id));
// Sections missing from an older content.json still appear, in their default position at the end.
const order = [...configured, ...sectionIds.filter(id => !configured.some(entry => entry.id === id)).map(id => ({ id, visible: true }))];

/** Sections between Hero and Contact, in the editor's order: switched on and with content. */
export const visibleSections: SectionId[] = order.filter(entry => entry.visible && sectionHasContent(entry.id)).map(entry => entry.id);

type NumberedId = SectionId | "contact";
const numbered: NumberedId[] = [...visibleSections.filter(id => sectionMeta[id].numbered), "contact"];

/** "01", "02"… from the order of visible sections. Hidden sections do not use up a number. */
export function sectionNumber(id: NumberedId): string | undefined {
  const index = numbered.indexOf(id);
  return index < 0 ? undefined : String(index + 1).padStart(2, "0");
}

export function sectionEyebrow(id: NumberedId): string {
  const label = id === "contact" ? "Get in touch" : sectionMeta[id].label;
  const number = sectionNumber(id);
  return number ? `${number} — ${label}` : label;
}

/** Navbar and footer links, built only from sections that render. */
export const navItems: NavItem[] = [
  ...visibleSections.flatMap(id => sectionMeta[id].nav ? [{ label: sectionMeta[id].nav, href: "#" + id }] : []),
  { label: "Contact", href: "#contact" },
];
