import Image from "next/image";
import { ArrowRight, ArrowUpRight, Building2, Database, FileCheck2, Globe, House, KeyRound, Network, ShoppingBag, ShoppingCart, Smartphone, Sticker, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GithubIcon } from "@/components/ui/icons";
import { hasContent } from "@/lib/has-content";
import type { Project } from "@/types";

const visuals = {
  "distributed-joke-system": { label: "Distributed systems", icons: [Globe, Network, Database], caption: "Node.js / RabbitMQ / MySQL" },
  "smart-home-monitoring-control": { label: "Connected living", icons: [Smartphone, House, Wifi], caption: "React Native / Supabase / IoT" },
  "janudawithanage--smart-home-monitoring-control": { label: "Connected living", icons: [Smartphone, House, Wifi], caption: "React Native / Supabase / IoT" },
  rentigo: { label: "Property management", icons: [KeyRound, Building2, FileCheck2], caption: "PHP / MySQL / MVC" },
  "becute-dreams-luxe": { label: "E-commerce experience", icons: [Sticker, ShoppingBag, ShoppingCart], caption: "React / TypeScript / Zustand" },
};

const statuses: Record<Project["status"], { label: string; variant: "success" | "accent" | "default" | "gold" }> = {
  completed: { label: "Completed", variant: "success" },
  "in-progress": { label: "In progress", variant: "accent" },
  planned: { label: "Planned", variant: "default" },
  "design-only": { label: "Design only", variant: "gold" },
};

export function ProjectCard({ project, index, showVisual = true }: { project: Project; index: number; showVisual?: boolean }) {
  const visual = visuals[project.id as keyof typeof visuals] ?? {
    label: "Software project", icons: [Globe, Network, Database],
    caption: project.tech.slice(0, 3).join(" / ") || "Built to explore",
  };
  const status = statuses[project.status] ?? statuses.completed;
  const number = String(index + 1).padStart(2, "0");
  const live = project.liveUrl?.startsWith("http") ? project.liveUrl : undefined;
  return (
    <article className="card project-card h-full" data-tilt="">
      {showVisual && (project.image ? (
        <div className="project-media">
          <Image src={project.image} alt={`${project.title} application preview`} fill sizes="(min-width: 1280px) 580px, (min-width: 768px) calc((100vw - 5rem) / 2), calc(100vw - 3rem)" className="object-contain" />
        </div>
      ) : (
        <div className="project-art" aria-hidden="true">
          <div className="project-art-meta"><span>{visual.label}</span><span>{project.year}</span></div>
          <div className="project-art-nodes">
            {visual.icons.map((Icon, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {i > 0 && <ArrowRight size={14} className="text-text-muted" />}
                <span className={i === 1 ? "project-art-node project-art-node-main" : "project-art-node"}><Icon size={i === 1 ? 30 : 22} strokeWidth={1.4} /></span>
              </div>
            ))}
          </div>
          <p className="project-art-label">{visual.caption}</p>
        </div>
      ))}
      <div className="project-content">
        <div className="project-meta">
          <span className="card-index" aria-hidden="true">{number}</span>
          <span className="text-meta">{hasContent(project.date) ? project.date : project.year}</span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="text-text-secondary leading-relaxed">{project.description}</p>
        {hasContent(project.tech) && (
          <ul className="flex flex-wrap gap-2 pb-2" aria-label={project.title + " technologies"}>
            {project.tech.map(t => <li key={t}><span className="chip chip-plain">{t}</span></li>)}
          </ul>
        )}
        {(project.githubUrl || live) && (
          <div className="project-links">
            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-link"><GithubIcon size={16} />Source code<span className="sr-only"> for {project.title}</span><ArrowUpRight size={15} aria-hidden="true" /></a>}
            {live && <a href={live} target="_blank" rel="noopener noreferrer" className="text-link !text-accent">Go live<span className="sr-only">: {project.title}</span><ArrowUpRight size={15} aria-hidden="true" /></a>}
          </div>
        )}
      </div>
    </article>
  );
}
