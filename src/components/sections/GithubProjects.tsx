import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { GithubProjectsGrid } from "./GithubProjectsGrid";
import { fetchGitHubRepos } from "@/lib/github";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "janudawithanage";

export async function GithubProjects() {
  const result = await fetchGitHubRepos();
  return (
    <SectionWrapper id="github" className="section-border bg-bg-secondary">
      <div className="container-section">
        <SectionHeader eyebrow="06 / Open source & experiments" title="There’s more in the repositories." description="Coursework, side projects, and experiments. A look at what I’m exploring and building beyond the selected work." />
        <GithubProjectsGrid result={result} profileUrl={"https://github.com/" + GITHUB_USERNAME} renderedAt={new Date().toISOString()} />
      </div>
    </SectionWrapper>
  );
}
