"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { content, fullName } from "@/data";
import { navItems } from "@/lib/sections";
import { Button } from "@/components/ui/Button";

const desktopLinks = navItems.filter(item => item.href !== "#contact");

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navigationTargetRef = useRef<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!dialog || !mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      const destination = navigationTargetRef.current;
      navigationTargetRef.current = null;
      if (destination) document.querySelector<HTMLElement>(destination)?.focus({ preventScroll: true });
      else if (window.innerWidth < 1024) trigger?.focus({ preventScroll: true });
      else document.querySelector<HTMLElement>("header nav a")?.focus({ preventScroll: true });
    };
  }, [mobileOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (media.matches) setMobileOpen(false);
    };
    media.addEventListener("change", onResize);
    return () => media.removeEventListener("change", onResize);
  }, []);

  // The pill becomes more opaque and slightly smaller once the page scrolls.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      headerRef.current?.toggleAttribute("data-scrolled", window.scrollY > 24);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(entry.target.id === "hero" ? "" : entry.target.id);
      }
    }, { rootMargin: "-80px 0px -55% 0px", threshold: 0 });
    ["hero", ...navItems.map(item => item.href.slice(1))].forEach(id => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  // The active-section pill slides between links by animating its clip-path.
  useEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const measure = () => {
      const link = activeSection ? list.querySelector<HTMLElement>(`a[href="#${activeSection}"]`) : null;
      if (!link) { indicator.style.opacity = "0"; return; }
      const right = list.clientWidth - link.offsetLeft - link.offsetWidth;
      indicator.style.clipPath = `inset(0 ${right}px 0 ${link.offsetLeft}px round 999px)`;
      indicator.style.opacity = "1";
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeSection]);

  const navigate = (href: string) => {
    navigationTargetRef.current = href;
    dialogRef.current?.close();
    setMobileOpen(false);
  };

  return (
    <>
      <header ref={headerRef} className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3 rounded-full pr-2" aria-label={fullName + " — home"}>
            <span className="brand-mark" aria-hidden="true">{content.hero.firstName[0]}{content.hero.lastName[0]}<span>.</span></span>
            <span className="text-sm font-semibold text-ink hidden sm:inline lg:hidden xl:inline">{fullName}</span>
          </Link>
          <div ref={listRef} className="nav-links hidden lg:flex">
            <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" style={{ opacity: 0, clipPath: "inset(0 50% 0 50% round 999px)" }} />
            <ul className="flex items-center">
              {desktopLinks.map(item => (
                <li key={item.href}><a href={item.href} className="nav-link" aria-current={activeSection === item.href.slice(1) ? "location" : undefined}>{item.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" magnetic className="hidden lg:inline-flex min-h-11"><a href="#contact">{content.hero.secondaryLabel}<ArrowUpRight size={15} aria-hidden="true" /></a></Button>
            <div className="lg:hidden"><button ref={triggerRef} type="button" className="icon-link" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={mobileOpen} aria-controls="mobile-navigation"><Menu size={20} aria-hidden="true" /></button></div>
          </div>
        </nav>
      </header>
      <dialog
        id="mobile-navigation"
        ref={dialogRef}
        className="mobile-menu"
        aria-labelledby="mobile-menu-title"
        onCancel={event => { event.preventDefault(); setMobileOpen(false); }}
        onClose={() => setMobileOpen(false)}
        onKeyDown={event => {
          if (event.key !== "Tab" || event.ctrlKey || event.metaKey || event.altKey) return;
          const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)")).filter(node => node.getClientRects().length > 0);
          if (!controls.length) return;
          event.preventDefault();
          const current = controls.indexOf(document.activeElement as HTMLElement);
          const next = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
          controls[next].focus();
        }}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setMobileOpen(false);
        }}
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="brand-mark" aria-hidden="true">{content.hero.firstName[0]}{content.hero.lastName[0]}<span>.</span></span>
          <h2 id="mobile-menu-title" className="text-meta mr-auto">Explore the portfolio</h2>
          <button type="button" className="icon-link" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu" autoFocus><X size={20} aria-hidden="true" /></button>
        </div>
        <nav aria-label="Mobile navigation">
          <ul>{navItems.map((item, index) => (
            <li key={item.href} style={{ "--i": index } as React.CSSProperties}>
              <a href={item.href} className="mobile-nav-link" aria-current={activeSection === item.href.slice(1) ? "location" : undefined} onClick={() => navigate(item.href)}>
                {item.label}<span className="text-meta" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </a>
            </li>
          ))}</ul>
        </nav>
        <p className="mt-auto pt-8 text-sm text-text-muted">{content.hero.location}. {content.hero.availability}.</p>
      </dialog>
    </>
  );
}
