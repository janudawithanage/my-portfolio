import { ArrowRight } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { featuredProjects } from "@/data";

export function Projects() {
  return (
    <SectionWrapper id="projects" className="section-border bg-bg-secondary">
      <div className="container-section">
        <SectionHeader eyebrow="01 / Selected work" title="Ideas, turned into software." description="A selection of things I’ve built — from distributed services to connected homes and everyday web experiences." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">{featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
        <a href="#github" className="text-link mt-6">More experiments on GitHub<ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </SectionWrapper>
  );
}
