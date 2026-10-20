import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { GithubProjectsGrid } from "./GithubProjectsGrid";
import { CuratedGithubProjects } from "./CuratedGithubProjects";
import { fetchGitHubRepos } from "@/lib/github";
import experimentsData from "@/data/experiments.json";
import type { Project } from "@/types";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "janudawithanage";

export async function GithubProjects() {
  const manual = experimentsData.mode === "manual";
  const result = manual ? null : await fetchGitHubRepos();
  const profileUrl = "https://github.com/" + GITHUB_USERNAME;
  return (
    <SectionWrapper id="github" className="section-border bg-bg-secondary">
      <div className="container-section">
        <SectionHeader eyebrow="06 / Open source & experiments" title="There’s more in the repositories." description="Coursework, side projects, and experiments. A look at what I’m exploring and building beyond the selected work." />
        {result ? <GithubProjectsGrid result={result} profileUrl={profileUrl} renderedAt={new Date().toISOString()} /> : <CuratedGithubProjects projects={experimentsData.projects as Project[]} profileUrl={profileUrl} />}
      </div>
    </SectionWrapper>
  );
}
