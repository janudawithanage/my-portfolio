/* The editor is served only by the standalone loopback server. */
import { contentFields } from "./content-fields.js";
import { renderContent } from "./content-editor.js";
const $ = selector => document.querySelector(selector);
const token = $('meta[name="editor-token"]').content;
let projects = [];
let revision = "";
let saved = "";
let section = "selected-work";
let mode = "manual";
let content = null;
let ready = false;
let busy = false;
let repos = [];
let nextPage = 1;
let hasMore = true;
let loadingRepos = false;
let opened = new Set();
const drafts = new Map();
const sectionNames = { "selected-work": "Selected Work", experiments: "Open source & experiments", ...Object.fromEntries(Object.entries(contentFields).map(([key, value]) => [key, value.label])) };
const isContent = (target = section) => Object.hasOwn(contentFields, target);
const dataEndpoint = (target = section) => isContent(target) ? "/api/content" : "/api/projects";
const sectionUrl = (url, target = section) => `${url}?section=${encodeURIComponent(target)}`;
const snapshot = () => JSON.stringify({ projects, mode, content });

function rememberDraft() {
  if (ready) drafts.set(section, { projects, revision, saved, mode, opened, content });
}

function hasUnsavedDrafts() {
  return [...drafts.values()].some(draft => JSON.stringify({ projects: draft.projects, mode: draft.mode, content: draft.content }) !== draft.saved);
}

async function api(url, { method = "GET", body, raw = false } = {}) {
  const response = await fetch(url, {
    method, headers: { "X-Editor-Token": token, ...(body && !raw ? { "Content-Type": "application/json" } : {}) },
    body: body ? (raw ? body : JSON.stringify(body)) : undefined,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "The request failed. Please try again.");
  return result;
}

function notice(message = "", success = false) {
  $("#notice").textContent = message;
  $("#notice").hidden = !message;
  $("#notice").classList.toggle("success", success);
}

function dirty() { return ready && snapshot() !== saved; }

function updateToolbar(message) {
  rememberDraft();
  $("#selection-count").textContent = isContent() ? sectionNames[section] : `${projects.length} selected ${projects.length === 1 ? "project" : "projects"}`;
  $("#save-state").textContent = message ?? (dirty() ? "Unsaved changes" : "All changes saved locally");
  $("#save").disabled = !ready || busy || !dirty();
  $("#discard").disabled = !ready || busy || !dirty();
  $("#editor-fields").disabled = !ready || busy;
  $("#section-picker").disabled = !ready || busy;
  $("#section-picker").value = section;
  $("h1").textContent = isContent() ? `${sectionNames[section]}.` : "Your selected work.";
  $(".intro").textContent = isContent() ? "Your portfolio, in your own words. Update your details and save when you’re ready." : "Choose the projects you want people to see. Give each one its best first impression.";
  $(".workspace").hidden = isContent();
  $("#content-fields").hidden = !isContent();
  $("#content-help").hidden = !isContent();
  $("#content-help").textContent = section === "recognition" ? "Add your own awards, certifications, and volunteering below. Empty categories stay hidden on your portfolio until you save their first entry." : "Edit this section below. Save changes applies only to this section. Refresh your running portfolio to preview saved changes.";
  $("#selection-title").textContent = sectionNames[section];
  $("#feed-settings").hidden = section !== "experiments";
  $("#feed-mode").value = mode;
  $("#feed-help").textContent = mode === "automatic" ? "The automatic GitHub feed is active. Add a repository below to start your own selection, or switch to My selected repositories." : "This section uses text-only cards. Your selected repositories, details, and display order will appear after saving and deploying.";
  const otherDrafts = [...drafts.entries()].filter(([key, draft]) => key !== section && JSON.stringify({ projects: draft.projects, mode: draft.mode, content: draft.content }) !== draft.saved);
  $("#draft-status").textContent = otherDrafts.length ? `Unsaved changes in ${otherDrafts.map(([key]) => sectionNames[key]).join(", ")}. Switch back to save them.` : "Each section has its own selection. Save changes applies to the section shown below.";
}

function applyState(state) {
  projects = state.projects ?? [];
  content = state.content ?? null;
  revision = state.revision;
  mode = state.mode ?? "manual";
  saved = snapshot();
  ready = true;
  renderProjects();
  renderRepos();
  updateToolbar();
}

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function button(label, onClick, className = "") {
  const node = element("button", className, label);
  node.type = "button";
  node.addEventListener("click", onClick);
  return node;
}

function repoKey(value = "") { return value.toLowerCase().replace(/\/$/, "").replace(/\.git$/, ""); }
function isSelected(repo) { return projects.some(project => repoKey(project.githubUrl) === repoKey(repo.url)); }

function addRepo(repo) {
  if (isSelected(repo)) { notice("That repository is already selected."); return; }
  const baseId = repo.fullName.toLowerCase().replaceAll("/", "--").slice(0, 145);
  let id = baseId;
  let suffix = 2;
  while (projects.some(project => project.id === id)) id = `${baseId}-${suffix++}`;
  let liveUrl;
  try {
    const url = new URL(repo.homepage);
    if (["http:", "https:"].includes(url.protocol)) liveUrl = url.href;
  } catch { /* A missing/non-URL homepage is simply left blank. */ }
  projects.push({
    id, title: repo.name.replaceAll("-", " "), description: repo.description,
    tech: [...new Set([repo.language, ...repo.topics].filter(Boolean))].slice(0, 40),
    githubUrl: repo.url, ...(liveUrl ? { liveUrl } : {}), featured: true,
    status: "completed", year: repo.year,
  });
  mode = "manual";
  opened.add(id);
  notice(); renderProjects(); renderRepos(); updateToolbar();
  const card = document.getElementById(`project-${id}`);
  card.scrollIntoView({ behavior: "smooth", block: "start" });
  card.querySelector('input[data-field="title"]').focus({ preventScroll: true });
}

function renderRepos() {
  const list = $("#repo-list");
  list.replaceChildren();
  const query = $("#repo-search").value.trim().toLowerCase();
  const visible = repos.filter(repo => `${repo.fullName} ${repo.description}`.toLowerCase().includes(query));
  $("#repo-count").textContent = `${repos.length} ${hasMore ? "loaded" : "repositories"}`;
  for (const repo of visible) {
    const row = element("div", "repo-row");
    const info = element("div", "repo-info");
    info.append(element("strong", "", repo.fullName), element("p", "", repo.description || repo.language || "Public repository"));
    const selected = isSelected(repo);
    const add = button(selected ? "Added" : "Add", () => addRepo(repo));
    add.disabled = selected;
    add.setAttribute("aria-label", `${selected ? "Already selected" : "Add"} ${repo.fullName}`);
    row.append(info, add); list.append(row);
  }
  if (!visible.length && !loadingRepos) list.append(element("p", "muted", query ? "No matches in loaded repositories. Load more or add a repository by URL." : "No repositories loaded. Try Refresh or add one by URL."));
  $("#load-more").hidden = !hasMore;
  $("#load-more").disabled = loadingRepos;
  $("#refresh-repos").disabled = loadingRepos;
}

async function loadRepos(reset = false) {
  if (loadingRepos) return;
  loadingRepos = true;
  $("#repo-status").textContent = "Loading public repositories…";
  renderRepos();
  try {
    const page = reset ? 1 : nextPage;
    const result = await api(`/api/repos?page=${page}`);
    const combined = reset ? result.repos : [...repos, ...result.repos];
    repos = [...new Map(combined.map(repo => [repo.id, repo])).values()];
    hasMore = result.hasMore;
    nextPage = page + 1;
    $("#repo-status").textContent = hasMore ? "More repositories available. Load more to search them too." : `Public repositories from ${result.username}.`;
  } catch (error) { $("#repo-status").textContent = error.message; }
  finally { loadingRepos = false; renderRepos(); }
}

function field(labelText, project, name, options = {}) {
  const label = element("label", "", labelText);
  const input = document.createElement(options.multiline ? "textarea" : "input");
  input.dataset.field = name;
  input.value = name === "tech" ? project.tech.join(", ") : (project[name] ?? "");
  if (options.multiline) input.rows = 4;
  else input.type = options.type ?? "text";
  if (options.required) input.required = true;
  if (options.max) input.maxLength = options.max;
  if (options.pattern) input.pattern = options.pattern;
  input.addEventListener("input", () => {
    if (name === "tech") project.tech = input.value.split(",").map(value => value.trim()).filter(Boolean);
    else if (input.value || options.required) project[name] = input.value;
    else delete project[name];
    if (name === "title") document.getElementById(`project-${project.id}`).querySelector(".project-title").textContent = input.value || "Untitled project";
    if (name === "year") document.getElementById(`project-${project.id}`).querySelector(".project-year").textContent = input.value;
    notice(); updateToolbar();
  });
  label.append(input);
  return label;
}

function renderProjects() {
  const contentContainer = $("#content-fields");
  contentContainer.replaceChildren();
  if (isContent()) {
    $("#projects").replaceChildren();
    renderContent(contentContainer, contentFields[section].fields, content, {
      element, button, opened,
      changed: () => { notice(); updateToolbar(); },
      upload: async (file, apply) => {
        if (file.size > 10 * 1024 * 1024) { notice("Choose an image smaller than 10 MB."); return; }
        busy = true; updateToolbar("Checking and staging image…"); notice();
        try { apply(await api(sectionUrl("/api/uploads"), { method: "POST", body: file, raw: true })); }
        catch (error) { notice(error.message); }
        finally { busy = false; updateToolbar(); }
      },
    });
    return;
  }
  const sectionOpened = opened;
  const list = $("#projects");
  list.replaceChildren();
  if (!projects.length) list.append(element("p", "empty", "Your next great project belongs here. Add a GitHub repository to start your selection."));
  projects.forEach((project, index) => {
    const card = element("details", "project");
    card.id = `project-${project.id}`;
    card.open = opened.has(project.id);
    card.addEventListener("toggle", () => { if (card.open) sectionOpened.add(project.id); else sectionOpened.delete(project.id); });
    const summary = element("summary");
    const title = element("span", "summary-text");
    title.append(element("strong", "project-title", project.title), element("span", "project-year", project.year));
    summary.append(element("span", "project-number", String(index + 1).padStart(2, "0")), title);
    const body = element("div", "project-body");
    const tools = element("div", "project-actions");
    const moves = element("div", "actions");
    [-1, 1].forEach(direction => {
      const move = button(direction < 0 ? "↑ Move up" : "↓ Move down", () => {
        [projects[index], projects[index + direction]] = [projects[index + direction], projects[index]];
        renderProjects(); updateToolbar();
        document.getElementById(card.id).querySelector("summary").focus();
      });
      move.disabled = index + direction < 0 || index + direction >= projects.length;
      moves.append(move);
    });
    tools.append(moves, button("Remove selection", () => {
      if (!window.confirm(`Remove ${project.title} from ${sectionNames[section]}? This does not delete the GitHub repository${section === "selected-work" ? " or its images" : ""}.`)) return;
      projects.splice(index, 1); opened.delete(project.id);
      notice(); renderProjects(); renderRepos(); updateToolbar();
      $("#selection-title").tabIndex = -1; $("#selection-title").focus();
    }, "danger"));
    const fields = element("div", "project-fields");
    if (section === "selected-work") {
      const imageSection = element("div");
      const preview = element("div", "preview");
      if (project.image) {
        const img = element("img");
        img.src = project.image;
        img.alt = `${project.title} application preview`;
        img.addEventListener("error", () => { preview.replaceChildren(element("p", "preview-placeholder", "Image unavailable. Upload a replacement or remove this image.")); });
        preview.append(img);
      } else preview.append(element("p", "preview-placeholder", "No screenshot yet. Your portfolio will use the existing project artwork."));
      const imageTools = element("div", "image-tools");
      const uploadLabel = element("label", "", "Project image");
      const upload = element("input");
      upload.type = "file"; upload.accept = "image/png,image/jpeg,image/webp";
      upload.addEventListener("change", async () => {
        const file = upload.files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) { notice("Choose an image smaller than 10 MB."); upload.value = ""; return; }
        busy = true; updateToolbar("Checking and staging image…"); notice();
        try {
          const result = await api(sectionUrl("/api/uploads"), { method: "POST", body: file, raw: true });
          project.image = result.image;
          renderProjects();
        } catch (error) { notice(error.message); upload.value = ""; }
        finally { busy = false; updateToolbar(); }
      });
      uploadLabel.append(upload); imageTools.append(uploadLabel);
      if (project.image) imageTools.append(button("Remove image", () => { delete project.image; notice(); renderProjects(); updateToolbar(); }));
      imageSection.append(preview, imageTools, element("p", "muted image-note", "PNG, JPEG or WebP · Up to 10 MB / 40 megapixels · Saved when you choose Save changes"));
      fields.append(imageSection);
    }
    const statusYear = element("div", "field-row");
    const statusLabel = element("label", "", "Status");
    const status = element("select");
    status.setAttribute("aria-label", "Status");
    [["completed", "Completed"], ["in-progress", "In progress"], ["planned", "Planned"]].forEach(([value, label]) => {
      const option = element("option", "", label); option.value = value; status.append(option);
    });
    status.value = project.status;
    status.addEventListener("change", () => { project.status = status.value; notice(); updateToolbar(); });
    statusLabel.append(status);
    statusYear.append(statusLabel, field("Year", project, "year", { required: true, pattern: "[0-9]{4}", max: 4 }));
    fields.append(field("Project title", project, "title", { required: true, max: 160 }), field("Description", project, "description", { required: true, multiline: true, max: 5000 }), field("Technologies (separate with commas)", project, "tech"), statusYear, field("Source code URL", project, "githubUrl", { type: "url", max: 2048 }), field("Live demo URL (optional)", project, "liveUrl", { type: "url", max: 2048 }));
    body.append(tools, fields); card.append(summary, body); list.append(card);
  });
}

// Closed details must open before browser validation can focus an invalid input.
$("#projects-form").addEventListener("invalid", event => {
  const card = event.target.closest("details");
  if (card) { card.open = true; opened.add(card.id.slice("project-".length)); }
}, true);

$("#projects-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (busy || !ready || !dirty()) return;
  busy = true; updateToolbar("Saving section and images…"); notice();
  try {
    const state = await api(sectionUrl(dataEndpoint()), { method: "PUT", body: isContent() ? { content, revision } : { projects, revision, ...(section === "experiments" ? { mode } : {}) } });
    applyState(state);
    notice("Saved locally. Preview your portfolio, then commit and push the updated JSON and any new images to publish.", true);
  } catch (error) { notice(error.message); }
  finally { busy = false; updateToolbar(); }
});

$("#discard").addEventListener("click", async () => {
  if (!window.confirm(`Discard unsaved edits and staged images for ${sectionNames[section]}, and reload its saved selection?`)) return;
  busy = true; updateToolbar("Reloading saved selection…");
  try { applyState(await api(sectionUrl("/api/discard"), { method: "POST" })); notice(); }
  catch (error) { notice(error.message); }
  finally { busy = false; updateToolbar(); }
});

$("#add-url").addEventListener("click", async () => {
  const input = $("#repo-url");
  if (!input.value || !input.reportValidity()) { notice("Enter a public GitHub repository URL."); input.focus(); return; }
  busy = true; updateToolbar("Looking up repository…"); notice();
  try {
    const repo = await api("/api/repo", { method: "POST", body: { url: input.value } });
    addRepo(repo); input.value = "";
  } catch (error) { notice(error.message); }
  finally { busy = false; updateToolbar(); }
});

$("#repo-search").addEventListener("input", renderRepos);
$(".picker").addEventListener("keydown", event => {
  if (event.key !== "Enter" || event.target.tagName !== "INPUT") return;
  event.preventDefault();
  if (event.target.id === "repo-url") $("#add-url").click();
});
$("#refresh-repos").addEventListener("click", () => loadRepos(true));
$("#load-more").addEventListener("click", () => loadRepos());
$("#feed-mode").addEventListener("change", () => { mode = $("#feed-mode").value; notice(); updateToolbar(); });
$("#section-picker").addEventListener("change", async event => {
  const nextSection = event.target.value;
  if (nextSection === section || busy) return;
  rememberDraft();
  busy = true; updateToolbar("Loading section…"); notice();
  try {
    const cached = drafts.get(nextSection);
    const state = cached ? null : await api(sectionUrl(dataEndpoint(nextSection), nextSection));
    section = nextSection;
    if (cached) {
      ({ projects, revision, saved, mode, opened, content } = cached);
      renderProjects(); renderRepos();
    } else {
      opened = new Set();
      applyState(state);
    }
  } catch (error) { notice(error.message); }
  finally { busy = false; updateToolbar(); }
});
window.addEventListener("beforeunload", event => { if (hasUnsavedDrafts() || busy) { event.preventDefault(); event.returnValue = ""; } });

try {
  applyState(await api(sectionUrl("/api/projects")));
  loadRepos();
} catch (error) { notice(`${error.message} Reload this page to try again.`); }
