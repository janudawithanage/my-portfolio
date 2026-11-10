import { Cloud, Monitor, Server, Shield } from "lucide-react";
import { content, skillCategories } from "@/data";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";

const icons = { monitor: Monitor, server: Server, cloud: Cloud, shield: Shield };

export function Skills() {
  const categories = skillCategories.filter(category => hasContent(category.skills));
  if (!categories.length) return null;
  return (
    <SectionWrapper id="skills" className="section-border" labelledBy="skills-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("skills")} title={content.skills.title} titleId="skills-title" description={content.skills.description} />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5" data-stagger="">
          {categories.map((category, index) => {
            const Icon = icons[category.icon as keyof typeof icons] ?? Monitor;
            return (
              <li key={category.id}>
                <article className="glass skill-card h-full" data-tilt="">
                  <div className="flex items-start justify-between gap-4">
                    <span className="glass-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.6} /></span>
                    <span className="card-index" aria-hidden="true">/{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-subheadline mt-6">{category.title}</h3>
                  {hasContent(category.description) && <p className="text-sm text-text-secondary mt-2.5 leading-relaxed">{category.description}</p>}
                  <ul className="skill-list" aria-label={category.title + " tools"}>{category.skills.map(skill => <li key={skill.name}><span className="chip">{skill.name}</span></li>)}</ul>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionWrapper>
  );
}
