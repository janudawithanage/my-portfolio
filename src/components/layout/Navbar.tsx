"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navItems } from "@/data";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const scrollProgress = useScrollProgress();

  // Detect scroll to add glass background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-linear-to-r from-accent to-accent-light z-60 transition-all"
        style={{ width: `${scrollProgress * 100}%` }}
        aria-hidden="true"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "glass py-3 shadow-lg" : "py-5 bg-transparent"
        )}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Januda Withanage — Home"
          >
            <span className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <Code2 size={16} className="text-accent" />
            </span>
            <span
              className="font-bold text-lg text-text-primary"
              style={{ fontFamily: "var(--font-syne, sans-serif)" }}
            >
              JW
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-underline cursor-pointer",
                      isActive
                        ? "text-accent-light"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNavClick("#contact")}
            >
              Contact Me
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-text-secondary hover:text-text-primary p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 glass flex flex-col p-6 pt-20 md:hidden"
            >
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.replace("#", "");
                  return (
                    <li key={item.href}>
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                          isActive
                            ? "bg-accent/15 text-accent-light border-l-2 border-accent"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface"
                        )}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto pt-6 border-t border-border">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => handleNavClick("#contact")}
                >
                  Hire Me
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
