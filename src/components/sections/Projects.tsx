"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight, Globe, Monitor } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { staggerItem } from "@/lib/motion";
import { featuredProjects } from "@/data";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

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

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <motion.article
      variants={staggerItem}
      className={cn(
        "card-premium group relative flex flex-col p-6 transition-all duration-500",
        featured && "lg:flex-row lg:gap-8"
      )}
    >
      {/* Year chip */}
      <span className="absolute top-5 right-5 z-10 text-xs text-text-muted font-mono">
        {project.year}
      </span>

      <div className={cn("flex flex-col gap-5 flex-1", featured && "lg:max-w-none")}>
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
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
        <div className="flex items-center gap-3 mt-auto pt-2">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-secondary text-sm hover:text-accent transition-colors"
              aria-label={`GitHub repository for ${project.title}`}
            >
              <GithubIcon size={14} />
              Code
            </Link>
          )}
          {project.liveUrl && project.liveUrl !== "#" && (
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
          title="Things I've built"
          description="A curated selection of projects spanning full-stack development, cloud infrastructure, and security engineering."
        />

        {/* ── Website Design Showcase ─────────────────────────────── */}
        <motion.div
          variants={staggerItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="card-premium mb-10 overflow-hidden group"
        >
          <div className="flex flex-col lg:flex-row gap-0">
            {/* Browser mockup */}
            <div className="relative lg:w-3/5 h-72 sm:h-80 lg:h-auto overflow-hidden bg-base shrink-0">
              {/* Browser chrome */}
              <div className="absolute top-0 left-0 right-0 z-10 h-9 bg-surface border-b border-border-subtle flex items-center px-4 gap-2 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-gold/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
                <div className="ml-3 flex-1 max-w-48 h-5 rounded-md bg-surface-raised border border-border-subtle flex items-center px-2">
                  <Monitor size={10} className="text-text-muted mr-1.5" />
                  <span className="text-[10px] text-text-muted truncate">janudaw.dev</span>
                </div>
              </div>
              {/* Scrolling screenshot */}
              <div className="absolute inset-0 top-9 overflow-hidden">
                <motion.div
                  animate={{ y: ["0%", "-60%"] }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                  className="relative w-full"
                >
                  <Image
                    src="/images/website-preview.webp"
                    alt="Website design preview"
                    width={1404}
                    height={10708}
                    className="w-full h-auto"
                    priority={false}
                  />
                </motion.div>
              </div>
              {/* Overlay shimmer on hover */}
              <div className="absolute inset-0 top-9 bg-linear-to-t from-base/20 to-transparent pointer-events-none" />
            </div>

            {/* Info panel */}
            <div className="flex flex-col justify-between p-7 lg:p-8 flex-1">
              <div>
                <span className="text-eyebrow block mb-3">Latest Design Work</span>
                <h3
                  className="text-headline text-text-primary mb-3 leading-snug"
                  style={{ fontFamily: "var(--font-syne, sans-serif)" }}
                >
                  Full-Page Web Design
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">
                  A complete, responsive website design — from landing page hero to footer.
                  Built with modern UI principles: clear hierarchy, smooth interactions, and
                  pixel-perfect details across all breakpoints.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"].map((t) => (
                    <Badge key={t} variant="default">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="gold" size="sm" asChild>
                  <a href="https://github.com/janudaw" target="_blank" rel="noopener noreferrer">
                    View Project
                    <ArrowUpRight size={14} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
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
              View All Repositories
              <ArrowUpRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
