"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fadeUp, fadeIn } from "@/lib/motion";

const ROLES = [
  "Full-Stack Engineer",
  "Software Engineer",
  "Cloud Developer",
  "Cybersecurity Learner",
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
      timeout = setTimeout(() => {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % ROLES.length);
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, roleIndex]);

  return (
    <span>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block ml-0.5 text-gold"
      >
        |
      </motion.span>
    </span>
  );
}

// ─── Magnetic tilt card ────────────────────────────────────────────────────────

function TiltAvatarCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness: 220, damping: 22 });
  const glareX  = useTransform(rawX, [-0.5, 0.5], ["-30%", "130%"]);
  const glareY  = useTransform(rawY, [-0.5, 0.5], ["-30%", "130%"]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current!.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative cursor-pointer"
    >
      {/* 3D depth layers pushed back with translateZ */}
      {/* Back layer: accent card */}
      <motion.div
        style={{ transform: "translateZ(-18px)", transformStyle: "preserve-3d" }}
        className="absolute inset-0 rounded-4xl bg-linear-to-br from-accent/25 to-gold/15 border border-accent/20"
        aria-hidden="true"
      />
      {/* Mid layer */}
      <motion.div
        style={{ transform: "translateZ(-8px)", transformStyle: "preserve-3d" }}
        className="absolute inset-0 rounded-4xl bg-surface border border-border"
        aria-hidden="true"
      />

      {/* Front card */}
      <div
        className="hero-portrait relative w-72 h-80 sm:w-80 sm:h-96 rounded-4xl bg-surface border border-border-subtle overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Photo */}
        <Image
          src="/images/photo2.png"
          alt="Januda Withanage"
          fill
          sizes="(max-width: 640px) 288px, 320px"
          className="object-cover object-top"
          priority
        />
        {/* Glare highlight */}
        <motion.div
          style={{ left: glareX, top: glareY }}
          className="absolute w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl pointer-events-none"
          aria-hidden="true"
        />
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-base/95 via-base/60 to-transparent">
          <p
            className="font-bold text-text-primary text-sm"
            style={{ fontFamily: "var(--font-syne, sans-serif)" }}
          >
            Januda Withanage
          </p>
          <p className="text-text-muted text-xs">CS Undergraduate &middot; UCSC Sri Lanka &apos;26</p>
        </div>
      </div>

      {/* Floating badge — bottom-right, raised forward */}
      <motion.div
        style={{ transform: "translateZ(20px)" }}
        className="absolute -bottom-4 -right-4 glass px-3 py-2 rounded-xl border border-accent/30 z-10"
      >
        <span className="text-xs font-semibold text-accent">UCSC &apos;26 · CS</span>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

export function Hero() {
  const handleScroll = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="hero-section relative min-h-screen flex flex-col overflow-hidden bg-bg"
      aria-label="Hero section"
    >
      {/* ── Main grid ── */}
      <div className="hero-layout relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-32 pb-16 gap-10 lg:gap-16">

        {/* ── Left column ──────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-7">

          {/* Availability pill */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
            className="hero-availability inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full border border-success/25 text-success text-xs font-semibold tracking-wider"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            Open to Opportunities &middot; UCSC &apos;26
          </motion.div>

          {/* Display name */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-extrabold text-text-primary leading-[0.9] tracking-[-0.04em] uppercase">
              <span className="block">Januda</span>
              <span className="block gradient-text">Withanage</span>
            </h1>
          </motion.div>

          {/* Typewriter role */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.38 }}
            className="hero-role text-xl sm:text-2xl text-gold font-semibold h-8"
            style={{ fontFamily: "var(--font-syne, sans-serif)" }}
          >
            <TypewriterRole />
          </motion.p>

          {/* Bio */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.46 }}
            className="text-text-secondary sm:text-lg leading-relaxed max-w-lg"
          >
            I&apos;m a 3rd-year Computer Science student at{" "}
            <span className="text-text-primary font-medium">UCSC, Sri Lanka</span>,
            building full-stack web applications and cloud systems on Azure.
            My next goal is cybersecurity — I&apos;m actively working toward it
            through coursework, CTFs, and personal projects.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.55 }}
            className="hero-actions flex flex-wrap gap-3"
          >
            <Button
              variant="gold"
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
            <Button variant="secondary" size="lg" onClick={() => handleScroll("#contact")}>
              Let&apos;s Connect
              <ArrowUpRight size={16} />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.65 }}
            className="hero-stats flex flex-wrap gap-8 pt-4 border-t border-border"
          >
            {[
              { value: "3+",  label: "Years Coding" },
              { value: "10+", label: "Projects Shipped" },
              { value: "4",   label: "Focus Areas" },
              { value: "2026", label: "Expected Grad." },
            ].map(({ value, label }) => (
              <div key={label} className="hero-stat">
                <div
                  className="text-2xl font-extrabold gradient-text-gold"
                  style={{ fontFamily: "var(--font-syne, sans-serif)" }}
                >
                  {value}
                </div>
                <div className="text-text-muted text-xs tracking-widest uppercase mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right column — 3D tilt avatar ─────────── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35 }}
          className="hero-stage relative shrink-0"
          style={{ perspective: 900 }}
        >
          <TiltAvatarCard />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={() => handleScroll("#about")}
        className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-1.5 text-text-muted hover:text-accent transition-colors cursor-pointer"
        aria-label="Scroll to About section"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  );
}
