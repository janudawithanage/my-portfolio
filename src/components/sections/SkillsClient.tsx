"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Monitor, Server, Cloud, Shield, GitBranch } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { SkillCategory } from "@/types";
import dynamic from "next/dynamic";

const SkillGlobe3D = dynamic(
  () => import("@/components/3d/SkillGlobe3D").then((m) => ({ default: m.SkillGlobe3D })),
  { ssr: false }
);

// ─── Icon map ──────────────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

const categoryIcons: Record<string, IconComponent> = {
  monitor: Monitor as IconComponent,
  server:  Server  as IconComponent,
  cloud:   Cloud   as IconComponent,
  shield:  Shield  as IconComponent,
};

// ─── Skill bar ─────────────────────────────────────────────────────────────────

function SkillBar({
  name,
  level = 75,
  delay = 0,
  boosted = false,
}: {
  name: string;
  level?: number;
  delay?: number;
  boosted?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="flex items-center gap-1.5 text-text-secondary font-medium">
          {name}
          {boosted && (
            <span
              title="Level calibrated from your GitHub repository activity"
              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-accent/60 select-none"
            >
              <GitBranch size={9} aria-hidden />
            </span>
          )}
        </span>
      </div>
      <div className="skill-track">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
          className="skill-fill"
        />
      </div>
    </div>
  );
}

// ─── 3D tilt category card ─────────────────────────────────────────────────────

function CategoryCard({
  category,
  isActive,
  onClick,
}: {
  category: SkillCategory;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = categoryIcons[category.icon] ?? Monitor;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 25 });

  function onMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.button
      variants={staggerItem}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn(
        "w-full text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer",
        isActive
          ? "bg-surface-raised border-accent/40 shadow-[0_0_25px_rgba(123,110,246,0.18)]"
          : "bg-surface border-border hover:border-accent/30 hover:bg-surface-raised"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
            isActive ? "bg-accent text-white" : "bg-accent/10 text-accent"
          )}
          style={{ transform: "translateZ(6px)" }}
        >
          <Icon size={17} />
        </span>
        <span
          className={cn(
            "font-semibold text-sm transition-colors",
            isActive ? "text-text-primary" : "text-text-secondary"
          )}
          style={{ fontFamily: "var(--font-syne, sans-serif)", transform: "translateZ(4px)" }}
        >
          {category.title}
        </span>
      </div>
      <p className="text-text-muted text-xs leading-relaxed">{category.description}</p>
    </motion.button>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface SkillsClientProps {
  skillCategories: SkillCategory[];
  baseLevels: Record<string, number>;
  repoCount: number;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function SkillsClient({ skillCategories, baseLevels, repoCount }: SkillsClientProps) {
  const [activeId, setActiveId] = useState(skillCategories[0].id);
  const activeCategory = skillCategories.find((c) => c.id === activeId)!;

  return (
    <SectionWrapper id="skills">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-10 flex-wrap">
          <SectionHeader
            eyebrow="Skills"
            title="My technical toolkit"
            description="From frontend development to cloud deployments on Azure — here are the technologies I use day-to-day and the areas I'm actively growing in."
          />
          {/* 3D globe beside header */}
          <SkillGlobe3D className="w-44 h-44 shrink-0 hidden lg:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Category selector ── */}
          <div className="lg:col-span-2 flex flex-col gap-3" style={{ perspective: "600px" }}>
            {skillCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isActive={activeId === category.id}
                onClick={() => setActiveId(category.id)}
              />
            ))}
          </div>

          {/* ── Skill bars panel ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-3 card-elevated p-6 space-y-5"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = categoryIcons[activeCategory.icon] ?? Monitor;
                    return (
                      <span className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Icon size={18} className="text-accent" />
                      </span>
                    );
                  })()}
                  <div>
                    <h3
                      className="font-semibold text-text-primary"
                      style={{ fontFamily: "var(--font-syne, sans-serif)" }}
                    >
                      {activeCategory.title}
                    </h3>
                    <p className="text-text-muted text-xs">{activeCategory.description}</p>
                  </div>
                </div>

                {repoCount > 0 && (
                  <span
                    className="shrink-0 flex items-center gap-1.5 text-[11px] text-text-muted/60 border border-border rounded-full px-2.5 py-1 select-none"
                    title={`Levels calibrated from ${repoCount} public GitHub ${repoCount === 1 ? "repo" : "repos"}`}
                  >
                    <GitBranch size={10} aria-hidden />
                    {repoCount} repos
                  </span>
                )}
              </div>

              {/* Skill bars */}
              <div className="space-y-4">
                {activeCategory.skills.map((skill, i) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={i * 0.08}
                    boosted={
                      repoCount > 0 &&
                      (skill.level ?? 75) > (baseLevels[skill.name] ?? skill.level ?? 75)
                    }
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
}
