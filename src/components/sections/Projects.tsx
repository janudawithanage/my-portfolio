"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight, Globe } from "lucide-react";
import Link from "next/link";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/icons";
import { staggerItem } from "@/lib/motion";
import { featuredProjects } from "@/data";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<Project["status"], string> = {
  completed:    "bg-success/15 border-success/30 text-success",
  "in-progress": "bg-gold/15 border-gold/30 text-gold",
  planned:      "bg-text-muted/10 border-text-muted/20 text-text-muted",
};

const statusLabels: Record<Project["status"], string> = {
  completed:    "Completed",
  "in-progress": "In Progress",
  planned:      "Planned",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={staggerItem}
      className="card-premium group relative flex flex-col p-6 transition-all duration-500 h-full"
    >
      {/* Year chip */}
      <span className="absolute top-5 right-5 z-10 text-xs text-text-muted font-mono">
        {project.year}
      </span>

      <div className="flex flex-col gap-5 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h3
                className="font-semibold text-text-primary text-lg group-hover:text-accent-light transition-colors"
                style={{ fontFamily: "var(--font-syne, sans-serif)" }}
              >
                {project.title}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                  statusStyles[project.status]
                )}
              >
                {statusLabels[project.status]}
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Badge key={t} variant="default">
              {t}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 mt-auto pt-3 border-t border-border">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-secondary text-sm hover:text-accent transition-colors"
              aria-label={`GitHub repository for ${project.title}`}
            >
              <GithubIcon size={14} />
              Source Code
            </Link>
          )}
          {project.liveUrl && project.liveUrl.startsWith("http") && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-secondary text-sm hover:text-accent transition-colors"
              aria-label={`Live demo for ${project.title}`}
            >
              <Globe size={14} />
              Live Demo
              <ExternalLink size={12} />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  return (
    <SectionWrapper id="projects" className="bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Featured Projects"
          title="Things I&apos;ve built"
          description="A curated selection of projects — from distributed systems and IoT to full-stack web apps. Each one represents a real technical challenge I took on and shipped."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <motion.div variants={staggerItem} className="flex justify-center">
          <Button
            variant="secondary"
            size="lg"
            asChild
          >
            <Link
              href="#github"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#github")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View All on GitHub
              <ArrowUpRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
