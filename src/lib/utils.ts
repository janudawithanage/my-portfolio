import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes without conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a GitHub date string to a human-readable relative time.
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Map a programming language name to a Tailwind text colour class.
 */
export function getLangColor(lang: string | null): string {
  const map: Record<string, string> = {
    TypeScript:  "text-blue-400",
    JavaScript:  "text-yellow-400",
    Python:      "text-green-400",
    Java:        "text-orange-400",
    Shell:       "text-gray-400",
    Go:          "text-cyan-400",
    Rust:        "text-red-400",
    CSS:         "text-purple-400",
    HTML:        "text-orange-500",
  };
  return lang ? (map[lang] ?? "text-slate-400") : "text-slate-500";
}

