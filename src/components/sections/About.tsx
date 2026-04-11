"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Zap } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { staggerItem } from "@/lib/motion";

const interests = [
  "Full-Stack Development",
  "Cloud Engineering",
  "Cybersecurity",
  "System Design",
  "Open Source",
  "Algorithms",
];

const quickFacts = [
  { icon: GraduationCap, label: "UCSC, B.S. Computer Science" },
  { icon: MapPin,        label: "Santa Cruz, CA" },
  { icon: Zap,           label: "Open to internships & co-ops" },
];

export function About() {
  return (
    <SectionWrapper id="about" className="bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="About Me"
          title="Building at the intersection of code, cloud & security"
          description="I'm Januda — a passionate Computer Science student who loves building things that matter. My curiosity spans the full spectrum of software: elegant UIs, resilient APIs, scalable cloud systems, and hardened security postures."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — Avatar & quick facts */}
          <motion.div variants={staggerItem} className="space-y-6">
            {/* Avatar placeholder */}
            <div className="relative w-64 h-64 mx-auto lg:mx-0">
              <div className="w-full h-full rounded-2xl bg-surface border border-border overflow-hidden flex items-center justify-center">
                {/* Replace with <Image> when you have a real photo */}
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/30 flex items-center justify-center">
                    <span
                      className="text-3xl font-extrabold gradient-text"
                      style={{ fontFamily: "var(--font-syne, sans-serif)" }}
                    >
                      JW
                    </span>
                  </div>
                  <span className="text-xs tracking-widest uppercase">
                    Profile Photo
                  </span>
                </div>
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-1 rounded-2xl border border-accent/20 pointer-events-none" />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 glass px-3 py-2 rounded-xl border border-border shadow-lg">
                <span className="text-xs font-semibold text-text-secondary">
                  🎓 Class of &apos;26
                </span>
              </div>
            </div>

            {/* Quick facts */}
            <ul className="space-y-3 pt-6">
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

          {/* Right — Bio & interests */}
          <motion.div variants={staggerItem} className="space-y-6">
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                I started programming at 15, fascinated by how a few lines of code could
                automate the world around me. Since then, that curiosity has evolved into
                a deep passion for building software that is not just functional, but
                <span className="text-text-primary font-medium"> resilient, elegant, and secure</span>.
              </p>
              <p>
                At UCSC, I&apos;ve been fortunate to study under world-class faculty while
                taking on real-world challenges through hackathons, personal projects, and
                campus leadership. I&apos;m particularly drawn to the intersection of
                distributed systems and security — understanding not just how to build
                systems, but{" "}
                <span className="text-text-primary font-medium">how they break</span>.
              </p>
              <p>
                Outside of code, you&apos;ll find me exploring hiking trails around Santa Cruz,
                tinkering with CTF challenges, or reading about systems architecture over
                a good cup of coffee.
              </p>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-text-muted text-xs font-semibold tracking-widest uppercase mb-3">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge key={interest} variant="accent">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { title: "Clean Code",      desc: "Readable, maintainable, testable" },
                { title: "Security First",  desc: "Built-in, not bolted-on" },
                { title: "Ship Iteratively", desc: "Deliver value continuously" },
                { title: "Learn Deeply",   desc: "First principles over shortcuts" },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="p-4 rounded-xl bg-surface border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="text-sm font-semibold text-text-primary mb-0.5">{title}</div>
                  <div className="text-xs text-text-muted">{desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
