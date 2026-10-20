"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { content, fullName, navItems } from "@/data";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
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

  const navigate = (href: string) => {
    navigationTargetRef.current = href;
    dialogRef.current?.close();
    setMobileOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <nav className="container-section site-nav" aria-label="Main navigation">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3" aria-label={fullName + " — home"}>
            <span className="brand-mark" aria-hidden="true">{content.hero.firstName[0]}{content.hero.lastName[0]}<span className="text-text-muted">.</span></span>
            <span className="text-sm font-medium hidden sm:inline">{fullName}</span>
          </Link>
          <ul className="hidden lg:flex items-center">
            {navItems.filter(item => item.href !== "#contact").map(item => (
              <li key={item.href}><a href={item.href} className="nav-link" aria-current={activeSection === item.href.slice(1) ? "location" : undefined}>{item.label}</a></li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden lg:inline-flex"><a href="#contact">{content.hero.secondaryLabel}<ArrowUpRight size={15} aria-hidden="true" /></a></Button>
            <div className="lg:hidden"><button ref={triggerRef} type="button" className="icon-link" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={mobileOpen} aria-controls="mobile-navigation"><Menu size={21} aria-hidden="true" /></button></div>
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
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 id="mobile-menu-title" className="text-subheadline">Explore the portfolio</h2>
          <button type="button" className="icon-link" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu" autoFocus><X size={20} aria-hidden="true" /></button>
        </div>
        <nav aria-label="Mobile navigation">
          <ul>{navItems.map(item => <li key={item.href}><a href={item.href} className="mobile-nav-link" aria-current={activeSection === item.href.slice(1) ? "location" : undefined} onClick={() => navigate(item.href)}>{item.label}<ArrowUpRight size={16} aria-hidden="true" /></a></li>)}</ul>
        </nav>
        <p className="mt-6 text-sm text-text-muted">{content.hero.location}. {content.hero.availability}.</p>
      </dialog>
    </>
  );
}
