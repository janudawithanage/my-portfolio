"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  GitFork,
  ExternalLink,
  AlertCircle,
  FolderGit2,
  RefreshCw,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/icons";
import { getLangColor, formatRelativeDate } from "@/lib/utils";
import { FEATURED_TOPICS } from "@/lib/github";
import { useRelativeTime } from "@/hooks/useRelativeTime";
import type { GitHubRepo, GitHubFetchResult } from "@/types";

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const ctaVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────

/** Repos pushed within this many days get a "Recently updated" indicator. */
const RECENT_DAYS = 14;

function isRecentlyUpdated(updatedAt: string): boolean {
  const diff = Date.now() - new Date(updatedAt).getTime();
  return diff < RECENT_DAYS * 24 * 60 * 60 * 1000;
}

// ─── Sync indicator ────────────────────────────────────────────────────────────

interface SyncIndicatorProps {
  syncedAt: string;
  repoCount: number;
}

function SyncIndicator({ syncedAt, repoCount }: SyncIndicatorProps) {
  const relative = useRelativeTime(syncedAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex items-center justify-between flex-wrap gap-3 mb-8 px-1"
    >
      {/* Left: repo count */}
      <p className="text-xs text-text-muted">
        Showing{" "}
        <span className="text-text-secondary font-medium">{repoCount}</span>{" "}
        public {repoCount === 1 ? "repository" : "repositories"}
      </p>

      {/* Right: live sync indicator */}
      <div className="flex items-center gap-2 text-xs text-text-muted select-none">
        {/* Pulsing live dot */}
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent/70" />
        </span>

        <Clock size={11} aria-hidden />

        {relative ? (
          <AnimatePresence mode="wait">
            <motion.span
              key={relative}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              Last synced {relative}
            </motion.span>
          </AnimatePresence>
        ) : (
          /* Placeholder while hydration settles — matches text width */
          <span className="inline-block w-24 h-3 rounded skeleton" aria-hidden />
        )}

        <span className="text-text-muted/40 hidden sm:inline">
          · auto-refreshes hourly
        </span>
      </div>
    </motion.div>
  );
}

// ─── RepoCard ─────────────────────────────────────────────────────────────────

interface RepoCardProps {
  repo: GitHubRepo;
  isFeatured: boolean;
}

function RepoCard({ repo, isFeatured }: RepoCardProps) {
  const recent = isRecentlyUpdated(repo.updated_at);

  const visibleTopics = repo.topics
    .filter((t) => !(FEATURED_TOPICS as readonly string[]).includes(t))
    .slice(0, 3);

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.22, ease: "easeOut" } }}
      className="card group relative flex flex-col p-6 cursor-default"
    >
      {/* ── Top-right badge ── */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {recent && !isFeatured && (
          <span
            className="flex items-center gap-1 text-[10px] font-medium text-success/80 select-none"
            title="Pushed within the last 14 days"
          >
            <Zap size={9} aria-hidden className="fill-success/60" />
            Recent
          </span>
        )}
        {isFeatured && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-accent border border-accent/30 rounded-full px-2 py-0.5 select-none bg-accent/5">
            Featured
          </span>
        )}
      </div>

      {/* ── Repo name ── */}
      <div className={`flex items-start gap-2 mb-2 ${isFeatured || recent ? "pr-20" : "pr-2"}`}>
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sm text-text-primary hover:text-accent transition-colors duration-200 line-clamp-1"
          aria-label={`Open ${repo.name} on GitHub`}
        >
          {repo.name}
        </Link>
      </div>

      {/* ── Description ── */}
      <p className="text-text-muted text-xs leading-relaxed mb-4 flex-1 line-clamp-2 min-h-10">
        {repo.description ?? "No description provided."}
      </p>

      {/* ── Topic chips ── */}
      {visibleTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {visibleTopics.map((t) => (
            <Badge key={t} variant="outline" size="sm">
              {t}
            </Badge>
          ))}
        </div>
      )}

      {/* ── Footer meta ── */}
      <div className="flex items-center gap-3 text-xs text-text-muted mt-auto pt-3 border-t border-border">
        {repo.language && (
          <span
            className={`flex items-center gap-1.5 font-medium ${getLangColor(repo.language)}`}
            title={`Primary language: ${repo.language}`}
          >
            <span className="w-2 h-2 rounded-full bg-current shrink-0" aria-hidden />
            {repo.language}
          </span>
        )}

        <span className="flex items-center gap-1" title={`${repo.stargazers_count} stars`}>
          <Star size={11} aria-hidden />
          {repo.stargazers_count}
        </span>

        <span className="flex items-center gap-1" title={`${repo.forks_count} forks`}>
          <GitFork size={11} aria-hidden />
          {repo.forks_count}
        </span>

        <span
          className="ml-auto text-[11px] shrink-0"
          title={`Last pushed: ${new Date(repo.updated_at).toLocaleDateString()}`}
        >
          {formatRelativeDate(repo.updated_at)}
        </span>

        {/* External link — only visible on card hover */}
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-accent transition-colors duration-200 opacity-0 group-hover:opacity-100"
          aria-label={`Open ${repo.name} on GitHub`}
        >
          <ExternalLink size={12} aria-hidden />
        </Link>
      </div>
    </motion.article>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center gap-4"
    >
      <div className="rounded-full border border-red-500/20 bg-red-500/5 p-4">
        <AlertCircle className="text-red-400" size={28} aria-hidden />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <p className="text-sm font-medium text-text-primary">
          Could not load GitHub repositories
        </p>
        <p className="text-xs text-text-muted leading-relaxed">{message}</p>
      </div>
      <p className="text-xs text-text-muted/40 flex items-center gap-1.5">
        <RefreshCw size={11} aria-hidden />
        Retries automatically on the next revalidation cycle
      </p>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center gap-4"
    >
      <div className="rounded-full border border-border bg-surface/50 p-4">
        <FolderGit2 className="text-text-muted" size={28} aria-hidden />
      </div>
      <p className="text-sm text-text-muted">No public repositories found.</p>
    </motion.div>
  );
}

// ─── Grid (public export) ─────────────────────────────────────────────────────

interface GithubProjectsGridProps {
  result: GitHubFetchResult;
  profileUrl: string;
}

export function GithubProjectsGrid({
  result,
  profileUrl,
}: GithubProjectsGridProps) {
  if (result.status === "error") return <ErrorState message={result.message} />;
  if (result.status === "empty") return <EmptyState />;

  const { repos, syncedAt } = result;

  return (
    <>
      <SyncIndicator syncedAt={syncedAt} repoCount={repos.length} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
      >
        {repos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            isFeatured={repo.topics.some((t) =>
              (FEATURED_TOPICS as readonly string[]).includes(t)
            )}
          />
        ))}
      </motion.div>

      <motion.div
        variants={ctaVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <Button variant="outline" size="lg" asChild>
          <Link
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <GithubIcon size={16} />
            View All on GitHub
            <ExternalLink size={14} aria-hidden />
          </Link>
        </Button>
      </motion.div>
    </>
  );
}
