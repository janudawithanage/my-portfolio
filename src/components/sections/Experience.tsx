"use client";

import { motion } from "framer-motion";
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
};

export function Experience() {
  return (
    <SectionWrapper id="experience" className="bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="Experience"
          title="What I've worked on"
          description="Hands-on project experience from university coursework, cloud deployments, and full-stack development — all while studying at UCSC Sri Lanka."
        />

        <div className="relative">
          {/* Timeline spine */}
          <div
            className="absolute left-5.5 top-2 bottom-2 w-px bg-linear-to-b from-accent/50 via-border to-transparent"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {experienceData.map((exp, index) => (
              <motion.article
                key={exp.id}
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

                <div className="card-elevated flex-1 p-6">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3
                        className="text-subheadline text-text-primary"
                        style={{ fontFamily: "var(--font-syne, sans-serif)" }}
                      >
                        {exp.role}
                      </h3>
                      <p className="text-accent-light font-semibold text-sm mt-0.5">
                        {exp.company}
                      </p>
                    </div>
                    <Badge
                      variant={exp.endDate === "Present" ? "gold" : "default"}
                      size="sm"
                    >
                      {exp.endDate === "Present" ? "Current" : typeLabels[exp.type]}
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
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>

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
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
