"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { staggerItem } from "@/lib/motion";
import { experienceData } from "@/data";
import { cn } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  "full-time":  "Full-time",
  "part-time":  "Part-time",
  internship:   "Internship",
  contract:     "Contract",
  freelance:    "Freelance",
  university:   "University",
  personal:     "Personal Project",
};

// ─── 3D tilt experience card ───────────────────────────────────────────────────

function ExpCard({ exp, index }: { exp: typeof experienceData[0]; index: number }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), { stiffness: 260, damping: 28 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), { stiffness: 260, damping: 28 });
  const glareX  = useTransform(rawX, [-0.5, 0.5], ["-20%", "120%"]);
  const glareY  = useTransform(rawY, [-0.5, 0.5], ["-20%", "120%"]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.article
      variants={staggerItem}
      className="relative flex gap-8 pl-14"
    >
      {/* Timeline dot */}
      <div
        className={cn(
          "timeline-dot absolute left-3.5 top-5 w-3.5 h-3.5 rounded-full -translate-x-1/2 border-2",
          index === 0
            ? "bg-gold border-gold-light shadow-[0_0_12px_rgba(196,154,60,0.5)]"
            : "bg-accent border-accent-light shadow-[0_0_10px_rgba(123,110,246,0.4)]"
        )}
        aria-hidden="true"
      />

      {/* Tilt card */}
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="card-elevated flex-1 p-6 relative overflow-hidden"
      >
        {/* Glare highlight */}
        <motion.div
          style={{ left: glareX, top: glareY }}
          className="absolute w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3" style={{ transform: "translateZ(4px)" }}>
          <div>
            <h3
              className="text-subheadline text-text-primary"
              style={{ fontFamily: "var(--font-syne, sans-serif)" }}
            >
              {exp.role}
            </h3>
            <p className="text-accent-light font-semibold text-sm mt-0.5">{exp.company}</p>
          </div>
          <Badge variant={exp.endDate === "Present" ? "gold" : "default"} size="sm">
            {exp.endDate === "Present"
              ? typeLabels[exp.type] ?? "Current"
              : typeLabels[exp.type]}
          </Badge>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 mb-3 text-text-muted text-xs">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} />
            {exp.startDate} &mdash; {exp.endDate}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={11} />
            {exp.location}
          </span>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{exp.description}</p>

        {/* Highlights */}
        <ul className="space-y-1.5 mb-4">
          {exp.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {/* Tech */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
          {exp.tech.map((t) => (
            <Badge key={t} variant="default" size="sm">{t}</Badge>
          ))}
        </div>
      </motion.div>
    </motion.article>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export function Experience() {
  return (
    <SectionWrapper id="experience" className="bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="Experience"
          title="Technical journey"
          description="A track record of personal projects, academic work, and continuous learning — each one pushing my skills forward."
        />

        <div className="relative" style={{ perspective: "1200px" }}>
          {/* Timeline spine */}
          <div
            className="absolute left-5.5 top-2 bottom-2 w-px bg-linear-to-b from-accent/50 via-border to-transparent"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {experienceData.map((exp, index) => (
              <ExpCard key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
