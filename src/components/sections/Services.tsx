"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { staggerItem } from "@/lib/motion";
import { servicesData } from "@/data";
import { cn } from "@/lib/utils";

export function Services() {
  const [activeId, setActiveId] = useState<string | null>(servicesData[0].id);

  return (
    <SectionWrapper id="services">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left — header + CTA */}
          <motion.div variants={staggerItem} className="lg:sticky lg:top-28 space-y-6">
            <SectionHeader
              eyebrow="What I Build"
              title="My areas of focus"
              description="From pixel-perfect UIs to cloud-deployed microservices — here's where I spend my time and energy."
              align="left"
              className="mb-0"
            />
            <Button variant="gold" size="lg" asChild>
              <a href="#contact">Start a Project &#8599;</a>
            </Button>

            {/* Decorative number */}
            <div
              className="text-[10rem] font-extrabold leading-none select-none pointer-events-none text-surface-raised opacity-40"
              style={{ fontFamily: "var(--font-syne, sans-serif)" }}
              aria-hidden="true"
            >
              0{servicesData.findIndex((s) => s.id === activeId) + 1}
            </div>
          </motion.div>

          {/* Right — accordion list */}
          <div className="divide-y divide-border">
            {servicesData.map((service, i) => {
              const isOpen = activeId === service.id;
              return (
                <motion.div key={service.id} variants={staggerItem}>
                  <button
                    className={cn(
                      "w-full flex items-center justify-between gap-4 py-6 text-left transition-colors cursor-pointer group",
                      isOpen ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                    )}
                    onClick={() => setActiveId(isOpen ? null : service.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={cn(
                          "text-xs font-mono transition-colors",
                          isOpen ? "text-gold" : "text-text-muted"
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-syne, sans-serif)" }}
                      >
                        {service.title}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border shrink-0 transition-all",
                        isOpen
                          ? "bg-gold border-gold text-base"
                          : "border-border-subtle text-text-muted group-hover:border-accent/40"
                      )}
                    >
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pl-10 space-y-4">
                          <p className="text-text-secondary text-sm leading-relaxed">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {service.tags.map((tag) => (
                              <Badge key={tag} variant="default" size="sm">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
