"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { fadeUp, fadeIn } from "@/lib/motion";

const ROLES = [
  "Full-Stack Engineer",
  "Cloud Architect",
  "Security Researcher",
  "Software Engineer",
];

function TypewriterRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 65);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, 35);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, roleIndex]);

  return (
    <span className="gradient-text">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block ml-0.5 text-accent"
      >
        |
      </motion.span>
    </span>
  );
}

export function Hero() {
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Primary radial */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-150 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]" />
        {/* Secondary accent bottom */}
        <div className="absolute bottom-0 right-0 w-125 h-100 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(245,158,11,0.08),transparent)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow badge */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-accent/10 text-accent border border-accent/20 mb-8"
        >
          <Sparkles size={12} />
          Available for opportunities · UCSC &apos;26
        </motion.div>

        {/* Name */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight mb-4">
          <AnimatedText
            text="Januda"
            className="text-text-primary"
            byWord
            delay={0.2}
          />
          {" "}
          <AnimatedText
            text="Withanage"
            className="text-text-primary"
            byWord
            delay={0.36}
          />
        </h1>

        {/* Dynamic role */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-6 h-12 flex items-center justify-center"
          style={{ fontFamily: "var(--font-syne, sans-serif)" }}
        >
          <TypewriterRole />
        </motion.div>

        {/* Bio */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.65 }}
          className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
        >
          CS student at{" "}
          <span className="text-text-primary font-medium">UC Santa Cruz</span>{" "}
          crafting reliable, scalable, and secure software. I bridge the gap between
          elegant frontends and hardened cloud infrastructure.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleScroll("#projects")}
            className="group"
          >
            View My Work
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleScroll("#contact")}
          >
            Get in Touch
          </Button>
          <Link
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary text-sm underline-offset-4 hover:underline hover:text-text-primary transition-colors"
          >
            Download Résumé ↗
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.95 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {[
            { value: "3+", label: "Years Coding" },
            { value: "10+", label: "Projects Built" },
            { value: "4", label: "Core Domains" },
            { value: "3.7", label: "GPA" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-3xl sm:text-4xl font-extrabold gradient-text-gold"
                style={{ fontFamily: "var(--font-syne, sans-serif)" }}
              >
                {value}
              </div>
              <div className="text-text-muted text-xs tracking-widest uppercase mt-1">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        onClick={() => handleScroll("#about")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted hover:text-accent transition-colors group cursor-pointer"
        aria-label="Scroll to About section"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
