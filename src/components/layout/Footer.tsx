import { ArrowUp, ArrowUpRight } from "lucide-react";
import { content, fullName, socialLinks } from "@/data";
import { navItems } from "@/lib/sections";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-section pt-16 pb-10 sm:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:items-end pb-12">
          <div>
            <p className="footer-name">{fullName}<span className="text-accent">.</span></p>
            <p className="text-text-secondary mt-5 max-w-sm whitespace-pre-line">{content.contact.footerText}</p>
          </div>
          <nav aria-label="Footer navigation"><ul className="flex flex-wrap gap-x-6 gap-y-1 md:justify-end">{navItems.map(item => <li key={item.href}><a href={item.href} className="text-link text-text-secondary font-medium">{item.label}</a></li>)}</ul></nav>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-6 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} {fullName}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">{socialLinks.map(social => <li key={social.href}><a href={social.href} target={social.icon === "mail" ? undefined : "_blank"} rel={social.icon === "mail" ? undefined : "noopener noreferrer"} className="inline-flex min-h-11 items-center gap-1.5 hover:text-accent">{social.label}<ArrowUpRight size={13} aria-hidden="true" /></a></li>)}</ul>
          <a href="#hero" className="icon-link self-start sm:self-auto" aria-label="Back to top"><ArrowUp size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </footer>
  );
}
