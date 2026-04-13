"use client";

import { useState, useEffect } from "react";

// ─── Formatting ───────────────────────────────────────────────────────────────

/**
 * Convert an ISO timestamp to a compact human-readable relative string.
 *
 * Designed for the "Last synced" indicator — values stay short:
 *   "just now" | "3m ago" | "1h ago" | "2d ago"
 *
 * Intentionally more compact than `formatRelativeDate` (which is optimised
 * for repo `updated_at` dates that can be years old).
 */
function toRelative(iso: string): string {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);

  if (diffSec < 10)  return "just now";
  if (diffSec < 60)  return `${diffSec}s ago`;

  const mins = Math.floor(diffSec / 60);
  if (mins < 60)     return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24)      return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns a live-updating relative time string for the given ISO timestamp.
 *
 * The value re-computes on mount (to flush the SSR → client hydration diff)
 * and then on every `intervalMs` tick while the component is mounted.
 *
 * @param iso       - ISO 8601 date string (e.g. `new Date().toISOString()`)
 * @param intervalMs - How often to re-compute. Default: 60 000 (1 minute).
 *                    Use a shorter value (e.g. 10 000) if you need second-level
 *                    accuracy — this is intentionally kept at 1 min to avoid
 *                    any unnecessary re-renders on the portfolio page.
 */
export function useRelativeTime(
  iso: string,
  intervalMs: number = 60_000
): string {
  // Empty string on first render keeps SSR and client HTML identical,
  // preventing React hydration warnings. The value is filled client-side
  // immediately after mount via the 0 ms timeout below.
  const [relative, setRelative] = useState<string>("");

  useEffect(() => {
    // A 0 ms timeout fires after the current render commit, so `setRelative`
    // is invoked inside a callback — not synchronously in the effect body.
    // This keeps the linter happy while still updating on the very first frame.
    const immediate = setTimeout(() => setRelative(toRelative(iso)), 0);
    const interval  = setInterval(() => setRelative(toRelative(iso)), intervalMs);

    return () => {
      clearTimeout(immediate);
      clearInterval(interval);
    };
  }, [iso, intervalMs]);

  return relative;
}
