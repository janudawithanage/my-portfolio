import { Cloud, Monitor, Server, Shield } from "lucide-react";
import { skillCategories } from "@/data";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";

const icons = { monitor: Monitor, server: Server, cloud: Cloud, shield: Shield };

export function Skills() {
  return (
    <SectionWrapper id="skills" className="section-border">
      <div className="container-section">
        <SectionHeader eyebrow="03 / The toolkit" title="The tools behind the work." description="Technologies I use and study across the stack. Always adding to the toolkit, always learning by building." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCategories.map(category => {
            const Icon = icons[category.icon as keyof typeof icons] ?? Monitor;
            return (
              <article className="card skill-card" key={category.id}>
                <Icon size={24} strokeWidth={1.5} className="text-accent mb-5" aria-hidden="true" />
                <h3 className="text-subheadline">{category.title}</h3>
                <p className="text-sm text-text-secondary mt-3 leading-relaxed">{category.description}</p>
                <ul className="skill-list" aria-label={category.title + " tools"}>{category.skills.map(skill => <li key={skill.name}><Badge>{skill.name}</Badge></li>)}</ul>
              </article>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
