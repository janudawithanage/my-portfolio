import { ArrowRight } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { content, featuredProjects } from "@/data";

export function Projects() {
  return (
    <SectionWrapper id="projects" className="section-border bg-bg-secondary">
      <div className="container-section">
        <SectionHeader eyebrow="04 / Selected work" title={content.projects.title} description={content.projects.description} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">{featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
        <a href={content.hero.githubUrl} target="_blank" rel="noopener noreferrer" className="text-link mt-6">{content.projects.linkLabel}<ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </SectionWrapper>
  );
}
