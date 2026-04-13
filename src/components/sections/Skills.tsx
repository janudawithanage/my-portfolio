/**
 * Skills — async React Server Component.
 *
 * Fetches GitHub repos server-side, computes a skill-bonus map from the real
 * language + topic distribution, merges it into the base levels defined in
 * data/index.ts, and passes the result down to SkillsClient (the interactive
 * client component that owns tab selection and animations).
 *
 * The GitHub fetch is automatically deduplicated by Next.js — if GithubProjects
 * also calls fetchGitHubRepos() in the same render pass, only ONE network
 * request is made. Both components share the same cached promise.
 */
import { skillCategories } from "@/data";
import { fetchGitHubRepos, computeGitHubSkillBonus } from "@/lib/github";
import { SkillsClient } from "./SkillsClient";
import type { SkillCategory } from "@/types";

/** Clamp a number to [min, max] inclusive. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export async function Skills() {
  // Fetch repos — this call is deduplicated with GithubProjects' call when
  // both render in the same request. Revalidates every hour via ISR.
  const result = await fetchGitHubRepos();

  // Build bonus map from real data; empty object = safe fallback (no change)
  const bonus = result.status === "success"
    ? computeGitHubSkillBonus(result.repos)
    : {};

  const repoCount = result.status === "success" ? result.repos.length : 0;

  // Snapshot base levels before merging so the client can detect boosted bars
  const baseLevels: Record<string, number> = {};
  for (const cat of skillCategories) {
    for (const skill of cat.skills) {
      baseLevels[skill.name] = skill.level ?? 75;
    }
  }

  // Merge: apply bonus on top of each skill's hardcoded base level
  const enrichedCategories: SkillCategory[] = skillCategories.map((cat) => ({
    ...cat,
    skills: cat.skills.map((skill) => ({
      ...skill,
      level: clamp(
        (skill.level ?? 75) + (bonus[skill.name] ?? 0),
        40,   // floor — never show < 40% even for rarely-used skills
        97    // ceiling — reserve 97–100 to avoid implying "perfect mastery"
      ),
    })),
  }));

  return (
    <SkillsClient
      skillCategories={enrichedCategories}
      baseLevels={baseLevels}
      repoCount={repoCount}
    />
  );
}

