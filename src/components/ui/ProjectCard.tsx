import Image from "next/image";
import { Activity, ArrowRight, ArrowUpRight, Braces, Building2, Clapperboard, Cpu, Database, Dices, FileCheck2, Film, Flag, Gavel, Globe, Heart, House, KeyRound, Map, Network, Package, Route, Scale, ShoppingBag, ShoppingCart, Smartphone, Sticker, Terminal, Thermometer, Truck, Users, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GithubIcon } from "@/components/ui/icons";
import { hasContent } from "@/lib/has-content";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const visuals = {
  "distributed-joke-system": { label: "Distributed systems", icons: [Globe, Network, Database], caption: "Node.js / RabbitMQ / MySQL" },
  "smart-home-monitoring-control": { label: "Connected living", icons: [Smartphone, House, Wifi], caption: "React Native / Supabase / IoT" },
  "janudawithanage--smart-home-monitoring-control": { label: "Connected living", icons: [Smartphone, House, Wifi], caption: "React Native / Supabase / IoT" },
  rentigo: { label: "Property management", icons: [KeyRound, Building2, FileCheck2], caption: "PHP / MySQL / MVC" },
  "becute-dreams-luxe": { label: "Full-stack commerce", icons: [Sticker, ShoppingBag, ShoppingCart], caption: "React / Supabase / PostgreSQL" },
  "janudawithanage--maze-to-savor-game-c": { label: "Game simulation", icons: [Dices, Map, Flag], caption: "C / Turn-based 3D maze" },
  "janudawithanage--esp32-sensovault": { label: "IoT telemetry", icons: [Thermometer, Cpu, Activity], caption: "ESP32 / MQTT / Live dashboard" },
  "janudawithanage--lawyers-management-system": { label: "Legal practice platform", icons: [Scale, Gavel, Users], caption: "React 19 / Vite / Tailwind CSS" },
  "janudawithanage--compiler-construction": { label: "Language tooling", icons: [Braces, Terminal, Database], caption: "C / Parser / Interpreter" },
  "janudawithanage--git-happens-frontend": { label: "Delivery operations", icons: [Package, Truck, Route], caption: "Next.js / TypeScript / Tailwind CSS" },
  "janudawithanage--movie-app": { label: "Media browser", icons: [Film, Clapperboard, Heart], caption: "React / Vite / TMDB API" },
};

const statuses: Record<Project["status"], { label: string; variant: "success" | "accent" | "default" | "gold" }> = {
  completed: { label: "Completed", variant: "success" },
  "in-progress": { label: "In progress", variant: "accent" },
  planned: { label: "Planned", variant: "default" },
  "design-only": { label: "Design only", variant: "gold" },
};

export function ProjectCard({ project, index, showVisual = true, className }: { project: Project; index: number; showVisual?: boolean; className?: string }) {
  const visual = visuals[project.id as keyof typeof visuals] ?? {
    label: "Software project", icons: [Globe, Network, Database],
    caption: project.tech.slice(0, 3).join(" / ") || "Built to explore",
  };
  const status = statuses[project.status] ?? statuses.completed;
  const number = String(index + 1).padStart(2, "0");
  const live = project.liveUrl?.startsWith("http") ? project.liveUrl : undefined;
  return (
    <article className={cn("card project-card h-full", className)} data-tilt="">
      {showVisual && (project.image ? (
        <div className="project-media">
          <Image src={project.image} alt={`${project.title} application preview`} fill sizes="(min-width: 1280px) 390px, (min-width: 1024px) calc((100vw - 7rem) / 3), (min-width: 768px) calc((100vw - 5rem) / 2), calc(100vw - 3rem)" className="object-contain" />
        </div>
      ) : (
        <div className="project-art" aria-hidden="true">
          <div className="project-art-meta"><span>{visual.label}</span><span>{project.year}</span></div>
          <div className="project-art-nodes">
            {visual.icons.map((Icon, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {i > 0 && <ArrowRight size={12} className="text-text-muted" />}
                <span className={i === 1 ? "project-art-node project-art-node-main" : "project-art-node"}><Icon size={i === 1 ? 24 : 18} strokeWidth={1.4} /></span>
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
          <ul className="flex flex-wrap gap-1.5 pb-1" aria-label={project.title + " technologies"}>
            {project.tech.map(t => <li key={t}><span className="chip chip-plain">{t}</span></li>)}
          </ul>
        )}
        {(project.githubUrl || live) && (
          <div className="project-links">
            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-link"><GithubIcon size={15} />Source code<span className="sr-only"> for {project.title}</span><ArrowUpRight size={14} aria-hidden="true" /></a>}
            {live && <a href={live} target="_blank" rel="noopener noreferrer" className="text-link !text-accent">Go live<span className="sr-only"> — {project.title}</span><ArrowUpRight size={15} aria-hidden="true" /></a>}
          </div>
        )}
      </div>
    </article>
  );
}
