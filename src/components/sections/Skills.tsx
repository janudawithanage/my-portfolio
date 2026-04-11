"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Server, Cloud, Shield } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { skillCategories } from "@/data";
import type { SkillCategory } from "@/types";

const categoryIcons: Record<string, React.ElementType> = {
  monitor: Monitor,
  server:  Server,
  cloud:   Cloud,
  shield:  Shield,
};

function SkillBar({ name, level = 75, delay = 0 }: { name: string; level?: number; delay?: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary font-medium">{name}</span>
        <span className="text-text-muted text-xs">{level}%</span>
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

  return (
    <motion.button
      variants={staggerItem}
      onClick={onClick}
      className={cn(
        "w-full text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer",
        isActive
          ? "bg-surface-raised border-accent/40 shadow-[0_0_25px_rgba(123,110,246,0.12)]"
          : "bg-surface border-border hover:border-accent/30 hover:bg-surface-raised"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
            isActive ? "bg-accent text-white" : "bg-accent/10 text-accent"
          )}
        >
          <Icon size={17} />
        </span>
        <span
          className={cn(
            "font-semibold text-sm transition-colors",
            isActive ? "text-text-primary" : "text-text-secondary"
          )}
          style={{ fontFamily: "var(--font-syne, sans-serif)" }}
        >
          {category.title}
        </span>
      </div>
      <p className="text-text-muted text-xs leading-relaxed">{category.description}</p>
    </motion.button>
  );
}

export function Skills() {
  const [activeId, setActiveId] = useState(skillCategories[0].id);
  const activeCategory = skillCategories.find((c) => c.id === activeId)!;

  return (
    <SectionWrapper id="skills">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Skills"
          title="My technical toolkit"
          description="From frontend development to cloud deployments on Azure — here are the technologies I use day-to-day and the areas I'm actively growing in."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Category selector */}
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-3">
            {skillCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isActive={activeId === category.id}
                onClick={() => setActiveId(category.id)}
              />
            ))}
          </div>

          {/* Skill bars */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-3 card-elevated p-6 space-y-5"
            >
              <div className="flex items-center gap-3 mb-6">
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

              <div className="space-y-4">
                {activeCategory.skills.map((skill, i) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={i * 0.08}
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
