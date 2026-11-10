import { ArrowRight } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Expandable } from "@/components/ui/Expandable";
import { content, featuredProjects } from "@/data";
import { hasContent } from "@/lib/has-content";
import { sectionEyebrow } from "@/lib/sections";

export function Projects() {
  if (!featuredProjects.length) return null;
  return (
    <SectionWrapper id="projects" className="section-border" labelledBy="projects-title">
      <div className="container-section">
        <SectionHeader eyebrow={sectionEyebrow("projects")} title={content.projects.title} titleId="projects-title" description={content.projects.description} />
        <Expandable id="projects-list" noun="projects" className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7" items={featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)} />
        {hasContent(content.projects.linkLabel) && <a href={content.hero.githubUrl} target="_blank" rel="noopener noreferrer" className="text-link mt-8 ml-1">{content.projects.linkLabel}<ArrowRight size={16} aria-hidden="true" /></a>}
      </div>
    </SectionWrapper>
  );
}
