import Image from "next/image";
import { ArrowRight, ArrowUpRight, Building2, Database, FileCheck2, Globe, House, KeyRound, Network, ShoppingBag, ShoppingCart, Smartphone, Sticker, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GithubIcon } from "@/components/ui/icons";
import type { Project } from "@/types";

const visuals = {
  "distributed-joke-system": { label: "Distributed systems", icons: [Globe, Network, Database], caption: "Node.js / RabbitMQ / MySQL" },
  "smart-home-monitoring-control": { label: "Connected living", icons: [Smartphone, House, Wifi], caption: "React Native / Supabase / IoT" },
  rentigo: { label: "Property management", icons: [KeyRound, Building2, FileCheck2], caption: "PHP / MySQL / MVC" },
  "becute-dreams-luxe": { label: "E-commerce experience", icons: [Sticker, ShoppingBag, ShoppingCart], caption: "React / TypeScript / Zustand" },
};

export function ProjectCard({ project, index, showVisual = true }: { project: Project; index: number; showVisual?: boolean }) {
  const visual = visuals[project.id as keyof typeof visuals] ?? {
    label: "Software project", icons: [Globe, Network, Database],
    caption: project.tech.slice(0, 3).join(" / ") || "Built to explore",
  };
  return (
    <article className="card project-card">
      {showVisual && (project.image ? (
        <div className="relative overflow-hidden border-b border-border bg-bg-secondary" style={{ aspectRatio: "16 / 10" }}>
          <Image src={project.image} alt={`${project.title} application preview`} fill sizes="(min-width: 1280px) 588px, (min-width: 768px) calc((100vw - 4rem) / 2), calc(100vw - 2rem)" className="object-contain" />
        </div>
      ) : (
        <div className="project-art" aria-hidden="true">
          <div className="project-art-meta"><span>{String(index + 1).padStart(2, "0")} / {visual.label}</span><span>{project.year}</span></div>
          <div className="project-art-nodes">
            {visual.icons.map((Icon, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {i > 0 && <ArrowRight size={14} className="text-text-muted" />}
                <span className={i === 1 ? "project-art-node project-art-node-main" : "project-art-node"}><Icon size={i === 1 ? 32 : 24} strokeWidth={1.4} /></span>
              </div>
            ))}
          </div>
          <p className="project-art-label">{visual.caption}</p>
        </div>
      ))}
      <div className="project-content">
        <div><Badge variant={project.status === "completed" ? "success" : "accent"}>{project.status === "completed" ? "Completed" : project.status === "in-progress" ? "In progress" : "Planned"}</Badge></div>
        <h3 className="project-title">{project.title}</h3>
        <p className="text-text-secondary leading-relaxed">{project.description}</p>
        <ul className="flex flex-wrap gap-2 pb-2" aria-label={project.title + " technologies"}>
          {project.tech.map(t => <li key={t}><Badge>{t}</Badge></li>)}
        </ul>
        <div className="project-links">
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-link" aria-label={"Source code for " + project.title}><GithubIcon size={16} />Source code<ArrowUpRight size={15} aria-hidden="true" /></a>}
          {project.liveUrl?.startsWith("http") && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link" aria-label={"Live demo for " + project.title}>Live demo<ArrowUpRight size={15} aria-hidden="true" /></a>}
        </div>
      </div>
    </article>
  );
}

