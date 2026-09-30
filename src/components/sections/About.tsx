"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, GraduationCap, Zap } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { staggerItem } from "@/lib/motion";

const quickFacts = [
  { icon: GraduationCap, label: "UCSC, BSc Computer Science · 21st Batch" },
  { icon: MapPin,        label: "Colombo, Sri Lanka" },
  { icon: Zap,           label: "Open to opportunities & collaborations" },
];

export function About() {
  return (
    <SectionWrapper id="about" className="bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="About Me"
          title="Building at the intersection of code, cloud & security"
          description="I build web applications and distributed systems with attention to usability, reliability, and security."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* Left — Photo & quick facts (2 cols) */}
          <motion.div variants={staggerItem} className="lg:col-span-2 space-y-6">
            {/* ── Photo frame with 3D tilt ──────────────── */}
            <div
              className="about-portrait relative w-64 h-80 sm:w-72 sm:h-96 mx-auto lg:mx-0"
              style={{ perspective: "800px" }}
            >
              {/* Decorative tilted background card */}
              <div
                className="absolute inset-0 rounded-2xl bg-linear-to-br from-accent/30 to-gold/20 border border-accent/20"
                style={{ transform: "rotate(4deg) scale(1.03)" }}
                aria-hidden="true"
              />
              {/* Second decorative layer */}
              <div
                className="absolute inset-0 rounded-2xl bg-surface border border-border"
                style={{ transform: "rotate(-2deg) scale(1.015)" }}
                aria-hidden="true"
              />
              {/* Main photo card */}
              <div className="about-photo relative w-full h-full rounded-2xl overflow-hidden border border-border-subtle shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                <Image
                  src="/images/photo2.png"
                  alt="Januda Withanage"
                  fill
                  sizes="(max-width: 640px) 256px, 288px"
                  className="object-cover object-top"
                  priority
                />
                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-base/90 to-transparent" />
              </div>

              {/* Floating badge — bottom right */}
              <div className="absolute -bottom-4 -right-4 glass px-3 py-2 rounded-xl border border-border shadow-lg z-10">
                <span className="text-xs font-semibold text-text-secondary">
                  UCSC · Computer Science
                </span>
              </div>
            </div>

            {/* Quick facts */}
            <ul className="about-facts space-y-3 pt-6">
              {quickFacts.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-text-secondary text-sm">
                  <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-accent" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — Bio & interests (3 cols) */}
          <motion.div variants={staggerItem} className="lg:col-span-3 space-y-6">
            <div className="about-bio-panel space-y-4 text-text-secondary leading-relaxed">
              <p>
                I&apos;m Januda. My Computer Science studies at the{" "}
                <span className="text-text-primary font-medium">University of Colombo School of Computing (UCSC)</span>
                {" "}inform my work across the frontend, backend, and cloud.
              </p>
              <p>
                Recent projects include a Node.js microservices system using RabbitMQ, Kong,
                Docker, and MySQL; a TypeScript sports betting platform; and an ESP32 monitoring
                dashboard. I also work with <span className="text-text-primary font-medium">Azure</span>
                {" "}and container-based deployment workflows.
              </p>
              <p>
                Alongside development, I study web application security, work through CTF
                challenges, and explore system design and open-source tools.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { title: "Full-Stack",      desc: "Interfaces, APIs, and data" },
                { title: "Azure Cloud",     desc: "Containers and deployment workflows" },
                { title: "Security Minded", desc: "Web security, OWASP, and CTFs" },
                { title: "Always Learning", desc: "System design and new tools" },
              ].map(({ title, desc }) => (
                <motion.div
                  key={title}
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="card p-4 cursor-default"
                >
                  <div className="text-sm font-semibold text-text-primary mb-0.5">{title}</div>
                  <div className="text-xs text-text-muted">{desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
