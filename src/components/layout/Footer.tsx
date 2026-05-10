"use client";

import Link from "next/link";
import { Mail, Code2, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { socialLinks } from "@/data";

// Map icon keys to components — only keys that appear in socialLinks data
type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

const iconMap: Record<string, IconComponent> = {
  github:   GithubIcon as IconComponent,
  linkedin: LinkedinIcon as IconComponent,
  mail:     Mail as IconComponent,
};

const footerLinks = [
  { label: "About",      href: "#about" },
  { label: "Skills",     href: "#skills" },
  { label: "Projects",   href: "#projects" },
  { label: "Education",  href: "#education" },
  { label: "Contact",    href: "#contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
                <Code2 size={16} className="text-accent" />
              </span>
              <span
                className="font-bold text-lg text-text-primary"
                style={{ fontFamily: "var(--font-syne, sans-serif)" }}
              >
                Januda Withanage
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              CS Student at UCSC · Building scalable, secure, and elegant software.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h3 className="text-text-muted text-xs font-semibold tracking-widest uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-text-secondary text-sm hover:text-accent transition-colors hover-underline cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="text-text-muted text-xs font-semibold tracking-widest uppercase mb-4">
              Connect
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon] ?? ArrowUpRight;
                const isMail = link.href.startsWith("mailto:");
                return (
                  <li key={link.label}>
                    {isMail ? (
                      // mailto links must not use target="_blank" — open the mail client directly
                      <a
                        href={link.href}
                        className="inline-flex items-center gap-2 text-text-secondary text-sm hover:text-accent transition-colors group"
                      >
                        <Icon size={14} />
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-text-secondary text-sm hover:text-accent transition-colors group"
                      >
                        <Icon size={14} />
                        {link.label}
                        <ArrowUpRight
                          size={11}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-text-muted text-xs">
          <p>
            &copy; {year} Januda Withanage. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with{" "}
            <span className="text-accent font-medium">Next.js</span>
            {" · "}
            <span className="text-accent font-medium">TypeScript</span>
            {" · "}
            <span className="text-accent font-medium">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
