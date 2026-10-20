import { ArrowUp, ArrowUpRight } from "lucide-react";
import { content, fullName, navItems, socialLinks } from "@/data";

export function Footer() {
  return (
    <footer className="section-border bg-bg-secondary">
      <div className="container-section py-10 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8">
          <div><p className="font-display text-xl font-semibold">{fullName}<span className="text-accent">.</span></p><p className="text-sm text-text-secondary mt-2 max-w-sm whitespace-pre-line">{content.contact.footerText}</p></div>
          <nav aria-label="Footer navigation"><ul className="flex flex-wrap max-w-sm gap-x-5 gap-y-1">{navItems.map(item => <li key={item.href}><a href={item.href} className="text-link text-text-secondary">{item.label}</a></li>)}</ul></nav>
          <a href="#hero" className="icon-link" aria-label="Back to top"><ArrowUp size={19} aria-hidden="true" /></a>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-t border-border pt-6 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} {fullName}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">{socialLinks.map(social => <li key={social.label}><a href={social.href} target={social.icon === "mail" ? undefined : "_blank"} rel={social.icon === "mail" ? undefined : "noopener noreferrer"} className="inline-flex min-h-11 items-center gap-1.5 hover:text-accent">{social.label}<ArrowUpRight size={13} aria-hidden="true" /></a></li>)}</ul>
        </div>
      </div>
    </footer>
  );
}
