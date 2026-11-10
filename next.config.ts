import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Next's static pages embed inline bootstrap scripts and React sets inline styles, so
// 'unsafe-inline' is required for both. Everything else is locked to this origin, plus
// Formspree for the contact form. 'unsafe-eval' is deliberately absent.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://formspree.io",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig = (phase: string): NextConfig => {
  const development = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    // Keep a running preview independent of production rebuilds.
    distDir: development ? ".next-dev" : ".next",
    poweredByHeader: false,
    // AVIF first (the hero portrait drops from 41KB to 25KB), WebP for browsers without AVIF.
    images: { formats: ["image/avif", "image/webp"] },
    async headers() {
      return [{
        source: "/:path*",
        // The dev server needs eval and websockets for hot reloading, so the CSP is production-only.
        headers: development ? securityHeaders : [...securityHeaders, { key: "Content-Security-Policy", value: contentSecurityPolicy }],
      }];
    },
  };
};

export default nextConfig;
