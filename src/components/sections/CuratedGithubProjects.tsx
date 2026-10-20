"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/icons";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project } from "@/types";

export function CuratedGithubProjects({ projects, profileUrl }: { projects: Project[]; profileUrl: string }) {
  const [expanded, setExpanded] = useState(false);
  const visible = projects.slice(0, expanded ? undefined : 6);
  return (
    <>
      <p className="text-xs text-text-muted mb-5" aria-live="polite" aria-atomic="true">Showing {visible.length} of {projects.length} selected {projects.length === 1 ? "repository" : "repositories"}</p>
      <div id="github-repositories" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((project, index) => <ProjectCard key={project.id} project={project} index={index} showVisual={false} />)}
      </div>
      {projects.length === 0 && <div className="card py-12 px-6 text-center flex flex-col items-center gap-4" role="status"><FolderGit2 size={28} className="text-accent" aria-hidden="true" /><h3 className="text-subheadline">No experiments selected yet.</h3><p className="text-text-secondary">Explore my latest projects on GitHub.</p></div>}
      <div className="flex flex-wrap gap-3 mt-6">
        {projects.length > 6 && <Button type="button" variant="secondary" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls="github-repositories">{expanded ? "Show fewer" : "Show all " + projects.length + " repositories"}<ChevronDown size={16} className={expanded ? "rotate-180" : ""} aria-hidden="true" /></Button>}
        <Button asChild variant="outline"><a href={profileUrl} target="_blank" rel="noopener noreferrer"><GithubIcon size={16} />View GitHub profile<ArrowUpRight size={15} aria-hidden="true" /></a></Button>
      </div>
    </>
  );
}
