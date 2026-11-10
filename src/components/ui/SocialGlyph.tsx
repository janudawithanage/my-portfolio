import { Globe, Mail } from "lucide-react";
import { DevtoIcon, DribbbleIcon, FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, MediumIcon, XIcon, YoutubeIcon } from "@/components/ui/icons";
import type { SocialIcon } from "@/types";

const glyphs: Record<Exclude<SocialIcon, "website" | "mail">, (props: { size?: number; className?: string }) => React.ReactNode> = {
  github: GithubIcon, linkedin: LinkedinIcon, x: XIcon, medium: MediumIcon, devto: DevtoIcon,
  youtube: YoutubeIcon, instagram: InstagramIcon, facebook: FacebookIcon, dribbble: DribbbleIcon,
};

/** One icon per profile type; unknown or generic profiles use a globe. */
export function SocialGlyph({ icon, size = 18, className }: { icon: SocialIcon; size?: number; className?: string }) {
  if (icon === "mail") return <Mail size={size} className={className} aria-hidden="true" />;
  const Glyph = icon === "website" ? undefined : glyphs[icon];
  return Glyph ? <Glyph size={size} className={className} /> : <Globe size={size} className={className} aria-hidden="true" />;
}
