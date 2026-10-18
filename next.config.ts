import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  // Keep a running preview independent of production rebuilds.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
});

export default nextConfig;
