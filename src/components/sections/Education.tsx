"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Calendar, Star } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { staggerItem } from "@/lib/motion";
import { educationData } from "@/data";

export function Education() {
  return (
    <SectionWrapper id="education" className="bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow="Education"
          title="Academic foundation"
          description="A rigorous computer science curriculum paired with real-world leadership and competitive programming experience."
        />

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-accent/40 via-border to-transparent"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {educationData.map((edu, index) => (
              <motion.article
                key={edu.id}
                variants={staggerItem}
                className="relative flex gap-8 pl-16"
              >
                {/* Timeline dot */}
                <div
                  className="timeline-dot absolute left-4 top-6 w-3.5 h-3.5 rounded-full bg-accent border-2 border-bg-secondary -translate-x-1/2 shadow-[0_0_12px_rgba(123,110,246,0.5)]"
                  aria-hidden="true"
                />

                <div className="card-elevated flex-1 p-6">
                  {/* Institution header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <GraduationCap size={15} className="text-accent" />
                        </span>
                        <h3
                          className="font-bold text-text-primary text-lg"
                          style={{ fontFamily: "var(--font-syne, sans-serif)" }}
                        >
                          {edu.institution}
                        </h3>
                      </div>
                      <p className="text-accent-light font-semibold text-sm">
                        {edu.degree} in {edu.field}
                      </p>
                    </div>

                    {edu.gpa && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20">
                        <Star size={12} className="text-gold" />
                        <span className="text-gold text-xs font-bold">GPA {edu.gpa}</span>
                      </div>
                    )}
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-4 mb-4 text-text-muted text-xs">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {edu.startDate} — {edu.endDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {edu.location}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary text-sm leading-relaxed mb-5">
                    {edu.description}
                  </p>

                  {/* Highlights */}
                  <div>
                    <h4 className="text-text-muted text-xs font-semibold tracking-widest uppercase mb-3">
                      Highlights
                    </h4>
                    <ul className="space-y-2">
                      {edu.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-sm text-text-secondary"
                        >
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Status badge */}
                  {edu.endDate === "Present" && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Badge variant="accent">Currently Enrolled</Badge>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
