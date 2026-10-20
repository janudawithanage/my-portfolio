import { test } from "node:test";
import http from "node:http";
import assert from "node:assert/strict";
import { mkdtemp, cp, readFile, readdir, writeFile, rename, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "@playwright/test";
import { createProjectEditor } from "./server.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
function repo(index, owner = "janudawithanage") {
  return { id: index, name: `project-${index}`, full_name: `${owner}/project-${index}`, html_url: `https://github.com/${owner}/project-${index}`, description: `Project ${index} description`, homepage: "https://example.com", language: "TypeScript", topics: ["react"], created_at: "2026-01-01T00:00:00Z", private: false, fork: index === 1 };
}

async function fixture(t) {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "portfolio-editor-test-"));
  await cp(path.join(root, "src/data"), path.join(tempRoot, "src/data"), { recursive: true });
  await writeFile(path.join(tempRoot, "src/data/experiments.json"), JSON.stringify({ mode: "automatic", projects: [] }));
  await cp(path.join(root, "public/images"), path.join(tempRoot, "public/images"), { recursive: true });
  const calls = [];
  let githubAvailable = true;
  const server = createProjectEditor({
    root: tempRoot, githubToken: "test-secret-do-not-expose",
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      if (!githubAvailable) return Response.json({}, { status: 403 });
      const parsed = new URL(url);
      if (parsed.pathname.startsWith("/users/")) {
        const page = Number(parsed.searchParams.get("page"));
        return Response.json(page === 1 ? Array.from({ length: 100 }, (_, i) => repo(i + 1)) : [repo(101), repo(102)]);
      }
      if (parsed.pathname === "/repos/team/project-500") return Response.json(repo(500, "team"));
      if (parsed.pathname === "/repos/team/private") return Response.json({ ...repo(501, "team"), private: true });
      return Response.json({}, { status: 404 });
    },
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await rm(tempRoot, { recursive: true, force: true });
  });
  const html = await (await fetch(origin)).text();
  const token = html.match(/name="editor-token" content="([a-f0-9]+)"/)[1];
  async function request(url, { method = "GET", body, headers = {}, raw = false } = {}) {
    return fetch(origin + url, { method, headers: { "X-Editor-Token": token, ...(body && !raw ? { "Content-Type": "application/json" } : {}), ...headers }, body: body ? (raw ? body : JSON.stringify(body)) : undefined });
  }
  return { root: tempRoot, origin, token, html, server, request, calls, unavailable: () => { githubAvailable = false; } };
}

test("local server rejects foreign hosts, origins, missing tokens, unsafe paths and non-editor routes", async t => {
  const f = await fixture(t);
  assert.equal(f.server.address().address, "127.0.0.1");
  assert.ok(!f.html.includes("test-secret-do-not-expose"));
  assert.equal((await fetch(f.origin + "/api/projects")).status, 403);
  for (const headers of [{ Host: "evil.example" }, { Origin: "https://evil.example" }, { "Sec-Fetch-Site": "cross-site" }, { "X-Editor-Token": "wrong" }]) {
    // Node fetch normalizes Host; use a raw HTTP request to verify the actual header.
    const status = await new Promise((resolve, reject) => {
      const request = http.get(f.origin + "/api/projects", { headers: { "X-Editor-Token": f.token, ...headers } }, response => { response.resume(); resolve(response.statusCode); });
      request.on("error", reject);
    });
    assert.equal(status, 403, JSON.stringify(headers));
  }
  assert.equal((await f.request("/api/unknown")).status, 404);
  assert.equal((await fetch(f.origin + "/src/data/projects.json")).status, 404);
  assert.equal((await fetch(f.origin + "/images/projects/%2e%2e%2fphoto1.png")).status, 404);
  await symlink(path.join(f.root, "src/data/projects.json"), path.join(f.root, "public/images/projects/secret.png"));
  assert.equal((await fetch(f.origin + "/images/projects/secret.png")).status, 404);
});

test("GitHub picker loads beyond 100 including forks, supports collaborations, and keeps secrets server-side", async t => {
  const f = await fixture(t);
  const first = await (await f.request("/api/repos?page=1")).json();
  assert.equal(first.repos.length, 100);
  assert.equal(first.repos[0].name, "project-1");
  assert.equal(first.hasMore, true);
  const next = await (await f.request("/api/repos?page=2")).json();
  assert.equal(next.repos[0].name, "project-101");
  assert.equal(next.hasMore, false);
  assert.ok(f.calls[0].options.headers.Authorization.endsWith("test-secret-do-not-expose"));
  assert.ok(!JSON.stringify(first).includes("test-secret-do-not-expose"));
  const collaboration = await f.request("/api/repo", { method: "POST", body: { url: "https://github.com/team/project-500" } });
  assert.equal((await collaboration.json()).fullName, "team/project-500");
  assert.equal((await f.request("/api/repo", { method: "POST", body: { url: "https://github.com/team/private" } })).status, 400);
  for (const url of ["https://evil.example/team/project", "http://github.com/team/project", "https://github.com/team/project?token=x", "https://github.com/team/project/issues"]) {
    assert.equal((await f.request("/api/repo", { method: "POST", body: { url } })).status, 400);
  }
  assert.equal((await f.request("/api/repos?page=-1")).status, 400);
  f.unavailable();
  const failure = await f.request("/api/repos");
  assert.equal(failure.status, 502);
  assert.match((await failure.json()).error, /rate limit/);
  assert.equal((await f.request("/api/projects")).status, 200);
});

test("save persists curated values and order, validates input and detects disk changes", async t => {
  const f = await fixture(t);
  const initial = await (await f.request("/api/projects")).json();
  assert.equal(initial.projects.length, 4);
  const projects = [...initial.projects].reverse();
  projects[0] = { ...projects[0], title: "My curated title", tech: ["Custom technology"] };
  const result = await f.request("/api/projects", { method: "PUT", body: { ...initial, projects } });
  assert.equal(result.status, 200);
  assert.deepEqual(JSON.parse(await readFile(path.join(f.root, "src/data/projects.json"), "utf8")), projects);
  const state = await result.json();
  assert.equal((await f.request("/api/projects", { method: "PUT", body: initial })).status, 409);
  for (const invalid of [
    [...projects, projects[0]],
    [{ ...projects[0], id: "../../escape" }],
    [{ ...projects[0], title: " " }],
    [{ ...projects[0], liveUrl: "javascript:alert(1)" }],
    [{ ...projects[0], year: "abc" }],
    [{ ...projects[0], image: "/images/projects/../secret.png" }],
    [{ ...projects[0], image: "/images/projects/missing.png" }],
    [{ ...projects[0], image: "/staged/missing" }],
    [{ ...projects[0], id: "first" }, { ...projects[0], id: "second", githubUrl: projects[0].githubUrl.toUpperCase() + "/" }],
  ]) {
    assert.equal((await f.request("/api/projects", { method: "PUT", body: { revision: state.revision, projects: invalid } })).status, 400);
  }
  assert.deepEqual((await (await f.request("/api/projects")).json()).projects, projects);
  // Curated values are untouched by refreshing repository metadata.
  await f.request("/api/repos");
  assert.deepEqual((await (await f.request("/api/projects")).json()).projects, projects);
  const restarted = createProjectEditor({ root: f.root });
  await new Promise(resolve => restarted.listen(0, "127.0.0.1", resolve));
  const response = await fetch(`http://127.0.0.1:${restarted.address().port}/`);
  assert.equal(response.status, 200);
  const restartToken = (await response.text()).match(/name="editor-token" content="([a-f0-9]+)"/)[1];
  const restored = await fetch(`http://127.0.0.1:${restarted.address().port}/api/projects`, { headers: { "X-Editor-Token": restartToken } });
  assert.deepEqual((await restored.json()).projects, projects);
  restarted.closeAllConnections();
  await new Promise(resolve => restarted.close(resolve));
  const empty = await f.request("/api/projects", { method: "PUT", body: { projects: [], revision: state.revision } });
  assert.equal(empty.status, 200);
  assert.deepEqual((await empty.json()).projects, []);
});

test("images are decoded and staged until Save; discard and replacement preserve original assets", async t => {
  const f = await fixture(t);
  const initial = await (await f.request("/api/projects")).json();
  const originalNames = await readdir(path.join(f.root, "public/images/projects"));
  for (const format of ["png", "jpeg", "webp"]) {
    const bytes = await sharp({ create: { width: 12, height: 8, channels: 3, background: "#123456" } }).toFormat(format).toBuffer();
    const upload = await f.request("/api/uploads", { method: "POST", body: bytes, raw: true });
    assert.equal(upload.status, 201);
    const { image } = await upload.json();
    assert.deepEqual(await readdir(path.join(f.root, "public/images/projects")), originalNames);
    assert.equal((await fetch(f.origin + image)).status, 200);
  }
  const staged = await (await f.request("/api/uploads", { method: "POST", body: await sharp({ create: { width: 2, height: 2, channels: 3, background: "white" } }).png().toBuffer(), raw: true })).json();
  const projects = structuredClone(initial.projects);
  projects[0].image = staged.image;
  const saved = await f.request("/api/projects", { method: "PUT", body: { projects, revision: initial.revision } });
  assert.equal(saved.status, 200);
  const savedState = await saved.json();
  assert.match(savedState.projects[0].image, /^\/images\/projects\/project-.*\.png$/);
  assert.equal((await fetch(f.origin + savedState.projects[0].image)).status, 200);
  assert.equal((await fetch(f.origin + staged.image)).status, 404);
  assert.equal((await readdir(path.join(f.root, "public/images/projects"))).length, originalNames.length + 1);
  const discardUpload = await (await f.request("/api/uploads", { method: "POST", body: await sharp({ create: { width: 2, height: 2, channels: 3, background: "black" } }).webp().toBuffer(), raw: true })).json();
  const discarded = await f.request("/api/discard", { method: "POST" });
  assert.deepEqual((await discarded.json()).projects, savedState.projects);
  assert.equal((await fetch(f.origin + discardUpload.image)).status, 404);
  delete savedState.projects[0].image;
  assert.equal((await f.request("/api/projects", { method: "PUT", body: savedState })).status, 200);
  assert.equal((await readdir(path.join(f.root, "public/images/projects"))).length, originalNames.length + 1);
  for (const bytes of [Buffer.from("not an image"), Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')]) {
    assert.equal((await f.request("/api/uploads", { method: "POST", body: bytes, raw: true })).status, 400);
  }
  assert.equal((await f.request("/api/uploads", { method: "POST", body: Buffer.alloc(10 * 1024 * 1024 + 1), raw: true })).status, 413);
});

test("filesystem failures leave the previous project selection intact", async t => {
  const f = await fixture(t);
  const initial = await (await f.request("/api/projects")).json();
  await rename(path.join(f.root, "public/images/projects"), path.join(f.root, "public/images/saved-images"));
  await writeFile(path.join(f.root, "public/images/projects"), "block image directory creation");
  const project = { ...initial.projects[0], title: "Cannot save" };
  delete project.image;
  const response = await f.request("/api/projects", { method: "PUT", body: { revision: initial.revision, projects: [project] } });
  assert.equal(response.status, 500);
  assert.deepEqual((await (await f.request("/api/projects")).json()).projects, initial.projects);
});

test("text-only experiments reject images and preserve Selected Work uploads and selections", async t => {
  const f = await fixture(t);
  const selected = await (await f.request("/api/projects")).json();
  const experiments = await (await f.request("/api/projects?section=experiments")).json();
  assert.equal(experiments.mode, "automatic");
  assert.deepEqual(experiments.projects, []);
  for (const section of ["../projects", "toString", "__proto__"]) assert.equal((await f.request(`/api/projects?section=${section}`)).status, 400);
  const bytes = await sharp({ create: { width: 3, height: 2, channels: 3, background: "blue" } }).png().toBuffer();
  assert.equal((await f.request("/api/uploads?section=experiments", { method: "POST", body: bytes, raw: true })).status, 400);
  const otherUpload = await (await f.request("/api/uploads", { method: "POST", body: bytes, raw: true })).json();
  const experiment = { ...selected.projects[0], title: "An experiment" };
  delete experiment.image;
  const invalid = await f.request("/api/projects?section=experiments", { method: "PUT", body: { ...experiments, mode: "manual", projects: [{ ...experiment, image: otherUpload.image }] } });
  assert.equal(invalid.status, 400, "Experiment saves cannot include images");
  const saved = await f.request("/api/projects?section=experiments", { method: "PUT", body: { ...experiments, mode: "manual", projects: [experiment] } });
  assert.equal(saved.status, 200);
  const current = await saved.json();
  assert.equal(current.mode, "manual");
  assert.equal(Object.hasOwn(current.projects[0], "image"), false);
  assert.equal((await fetch(f.origin + otherUpload.image)).status, 200, "Saving experiments preserves Selected Work uploads");
  assert.deepEqual(JSON.parse(await readFile(path.join(f.root, "src/data/experiments.json"), "utf8")), { mode: "manual", projects: current.projects });
  assert.equal((await f.request("/api/projects?section=experiments", { method: "PUT", body: { ...experiments, mode: "manual", projects: [] } })).status, 409);
  assert.equal((await f.request("/api/projects?section=experiments", { method: "PUT", body: { ...current, mode: "invalid" } })).status, 400);
  const afterWork = await (await f.request("/api/projects")).json();
  assert.deepEqual(afterWork.projects, selected.projects);
  await f.request("/api/discard?section=experiments", { method: "POST" });
  assert.equal((await fetch(f.origin + otherUpload.image)).status, 200, "Discarding experiments preserves Selected Work uploads");
  const workSave = await f.request("/api/projects", { method: "PUT", body: { ...selected, projects: [...selected.projects].reverse().map((project, index) => index ? project : { ...project, image: otherUpload.image }) } });
  assert.equal(workSave.status, 200, "Experiment saves do not create Selected Work conflicts");
  const automatic = await f.request("/api/projects?section=experiments", { method: "PUT", body: { ...current, mode: "automatic" } });
  assert.equal((await automatic.json()).projects[0].title, "An experiment", "Automatic mode retains the curated selection for later");
  f.unavailable();
  const empty = await f.request("/api/projects?section=experiments", { method: "PUT", body: { ...(await (await f.request("/api/projects?section=experiments")).json()), mode: "manual", projects: [] } });
  assert.equal(empty.status, 200, "Manual selections can be empty and saved offline");
});

test("browser editor imports, edits, uploads, reorders, saves, discards and survives GitHub failures", { timeout: 60000 }, async t => {
  const f = await fixture(t);
  const browser = await chromium.launch({ channel: "chrome" });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(f.origin);
  await page.getByText("4 selected projects", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Load more repositories" }).click();
  await page.getByLabel("Search repositories").fill("project-101");
  await page.getByRole("button", { name: "Add janudawithanage/project-101", exact: true }).click();
  const imported = page.locator("#project-janudawithanage--project-101");
  await imported.getByLabel("Project title").fill("My selected app");
  await imported.getByLabel("Description", { exact: true }).fill("A curated description, independent of GitHub.");
  await imported.getByLabel("Technologies (separate with commas)").fill("Node.js, TypeScript");
  await imported.getByLabel("Status", { exact: true }).selectOption("in-progress");
  await imported.getByLabel("Year", { exact: true }).fill("2025");
  const bytes = await sharp({ create: { width: 16, height: 10, channels: 3, background: "#334455" } }).png().toBuffer();
  await imported.getByLabel("Project image", { exact: true }).setInputFiles({ name: "screenshot.png", mimeType: "image/png", buffer: bytes });
  await page.getByRole("button", { name: "Save changes", exact: true }).waitFor({ state: "visible" });
  await page.waitForFunction(() => !document.querySelector("#save").disabled);
  const edited = page.locator("details").filter({ has: page.locator(".project-title", { hasText: "My selected app" }) });
  await edited.getByRole("button", { name: "Move up" }).click();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.getByText("All changes saved locally", { exact: true }).waitFor();
  const stored = JSON.parse(await readFile(path.join(f.root, "src/data/projects.json"), "utf8"));
  assert.equal(stored[3].title, "My selected app");
  assert.equal(stored[3].description, "A curated description, independent of GitHub.");
  assert.deepEqual(stored[3].tech, ["Node.js", "TypeScript"]);
  assert.equal(stored[3].status, "in-progress");
  assert.equal(stored[3].year, "2025");
  assert.match(stored[3].image, /^\/images\/projects\/project-/);
  await page.reload();
  await page.getByText("5 selected projects", { exact: true }).waitFor();
  await page.getByLabel("Repository URL", { exact: true }).fill("https://github.com/team/project-500");
  await page.getByLabel("Repository URL", { exact: true }).press("Enter");
  await page.getByText("6 selected projects", { exact: true }).waitFor();
  await page.getByLabel("Repository URL", { exact: true }).fill("https://github.com/team/project-500");
  await page.getByRole("button", { name: "Add repository by URL" }).click();
  await page.getByText("That repository is already selected.", { exact: true }).waitFor();
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Discard changes" }).click();
  await page.getByText("5 selected projects", { exact: true }).waitFor();
  const persisted = page.locator("details").filter({ has: page.locator(".project-title", { hasText: "My selected app" }) });
  await persisted.locator("summary").click();
  await persisted.getByRole("button", { name: "Remove image", exact: true }).click();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.getByText("All changes saved locally", { exact: true }).waitFor();
  f.unavailable();
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await page.locator("#repo-status").filter({ hasText: "rate limit" }).waitFor();
  const existing = page.locator("details").first();
  await existing.locator("summary").click();
  await existing.getByLabel("Project title").fill("Edited while GitHub unavailable");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.getByText("All changes saved locally", { exact: true }).waitFor();
  page.once("dialog", dialog => dialog.accept());
  await existing.getByRole("button", { name: "Remove selection", exact: true }).click();
  await page.getByText("4 selected projects", { exact: true }).waitFor();
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Discard changes" }).click();
  await page.getByText("5 selected projects", { exact: true }).waitFor();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}px`);
  }
  assert.deepEqual(errors, []);
});


test("all content sections save independently, preserve existing data, and reject stale or invalid edits", async t => {
  const f = await fixture(t);
  const state = section => f.request(`/api/content?section=${section}`).then(response => response.json());
  const save = (section, body) => f.request(`/api/content?section=${section}`, { method: "PUT", body });
  const original = JSON.parse(await readFile(path.join(f.root, "src/data/content.json"), "utf8"));
  const hero = await state("hero");
  const about = await state("about");
  assert.equal(hero.content.image, "/images/photo1.png");
  assert.equal(about.content.image, "/images/photo2.png");
  for (const section of ["hero", "about", "education", "skills", "projects", "experience", "recognition", "contact"]) {
    const current = await state(section);
    const content = structuredClone(current.content);
    if (section === "hero") content.role = "Edited role";
    else content.title = `Edited ${section}`;
    if (section === "education" || section === "experience" || section === "skills") content.entries.reverse();
    if (section === "recognition") content.awards.push({ id: "award-1", title: "Test award", organisation: "Test society", date: "2026" });
    const response = await save(section, { ...current, content });
    assert.equal(response.status, 200, await response.text());
    assert.deepEqual((await state(section)).content, content);
    if (section !== "recognition") assert.equal((await save(section, { ...current, content: current.content })).status, 409, section + " rejects stale saves");
  }
  const disk = JSON.parse(await readFile(path.join(f.root, "src/data/content.json"), "utf8"));
  assert.equal(disk.hero.image, original.hero.image);
  assert.equal(disk.about.image, original.about.image);
  assert.equal(disk.recognition.awards.length, 1);
  const latestHero = await state("hero");
  const latestContact = await state("contact");
  for (const patch of [{ githubUrl: "javascript:alert(1)" }, { image: "/images/../../secret.png" }, { cvUrl: "javascript:alert(1)" }, { firstName: "" }, { unknown: true }]) {
    assert.equal((await save("hero", { ...latestHero, content: { ...latestHero.content, ...patch } })).status, 400);
  }
  assert.equal((await save("contact", { ...latestContact, content: { ...latestContact.content, email: "invalid" } })).status, 400);
  const certificates = await state("recognition");
  const entry = { id: "duplicate", title: "Test", organisation: "Issuer", date: "2026" };
  assert.equal((await save("recognition", { ...certificates, content: { ...certificates.content, certifications: [entry, entry] } })).status, 400);
  assert.equal((await fetch(f.origin + "/api/content?section=hero")).status, 403);
  assert.equal((await f.request("/api/content?section=unknown")).status, 400);
  assert.equal((await f.request("/api/projects?section=hero")).status, 400);
  const changedDisk = JSON.parse(await readFile(path.join(f.root, "src/data/content.json"), "utf8"));
  changedDisk.hero.role = "External change";
  await writeFile(path.join(f.root, "src/data/content.json"), JSON.stringify(changedDisk));
  assert.equal((await save("hero", latestHero)).status, 409);
  const refreshed = await (await f.request("/api/discard?section=hero", { method: "POST" })).json();
  assert.equal(refreshed.content.role, "External change");
});

test("content images are staged per section, validated, saved and discarded without deleting originals", async t => {
  const f = await fixture(t);
  const bytes = await sharp({ create: { width: 16, height: 10, channels: 3, background: "#334455" } }).png().toBuffer();
  const upload = async section => (await f.request(`/api/uploads?section=${section}`, { method: "POST", body: bytes, raw: true })).json();
  const hero = await (await f.request("/api/content?section=hero")).json();
  const recognition = await (await f.request("/api/content?section=recognition")).json();
  const stagedHero = await upload("hero");
  const stagedRecognition = await upload("recognition");
  assert.equal((await f.request("/api/content?section=hero", { method: "PUT", body: { ...hero, content: { ...hero.content, image: stagedRecognition.image } } })).status, 400);
  const saved = await f.request("/api/content?section=hero", { method: "PUT", body: { ...hero, content: { ...hero.content, image: stagedHero.image } } });
  assert.equal(saved.status, 200);
  const content = (await saved.json()).content;
  assert.match(content.image, /^\/images\/content\/content-.*\.png$/);
  assert.equal((await fetch(f.origin + content.image)).status, 200);
  assert.equal((await fetch(f.origin + stagedHero.image)).status, 404);
  assert.equal((await fetch(f.origin + stagedRecognition.image)).status, 200);
  assert.equal((await fetch(f.origin + "/images/photo1.png")).status, 200);
  await f.request("/api/discard?section=recognition", { method: "POST" });
  assert.equal((await fetch(f.origin + stagedRecognition.image)).status, 404);
  assert.deepEqual((await (await f.request("/api/content?section=recognition")).json()).content, recognition.content);
  await symlink(path.join(f.root, "src/data"), path.join(f.root, "public/images/escape"));
  const latest = await (await f.request("/api/content?section=hero")).json();
  assert.equal((await f.request("/api/content?section=hero", { method: "PUT", body: { ...latest, content: { ...latest.content, image: "/images/escape/fake.png" } } })).status, 400);
});

test("browser edits every section, preserves drafts and photos, and manages Recognition without GitHub", { timeout: 90000 }, async t => {
  const f = await fixture(t);
  f.unavailable();
  const browser = await chromium.launch({ channel: "chrome" });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(f.origin);
  const select = page.getByLabel("Portfolio section", { exact: true });
  const save = async () => { await page.getByRole("button", { name: "Save changes", exact: true }).click(); await page.getByText("All changes saved locally", { exact: true }).waitFor(); };
  const choose = async section => { await select.selectOption(section); await page.waitForFunction(value => document.querySelector("#section-picker").value === value && !document.querySelector("#section-picker").disabled, section); };
  await choose("hero");
  await page.getByLabel("Role / tagline", { exact: true }).fill("Unsaved hero role");
  await choose("about");
  await page.getByLabel("Lead paragraph", { exact: true }).fill("My edited biography.");
  await save();
  await choose("hero");
  assert.equal(await page.getByLabel("Role / tagline", { exact: true }).inputValue(), "Unsaved hero role");
  const pixels = await sharp({ create: { width: 16, height: 10, channels: 3, background: "#456789" } }).webp().toBuffer();
  await page.getByLabel("Hero photo", { exact: true }).setInputFiles({ name: "hero.webp", mimeType: "image/webp", buffer: pixels });
  await page.waitForFunction(() => !document.querySelector("#section-picker").disabled);
  await choose("recognition");
  await page.getByRole("button", { name: "Add award", exact: true }).click();
  let card = page.locator('[data-collection="awards"] details').last();
  await card.getByLabel("Title / role", { exact: true }).fill("First award");
  await card.getByLabel("Organisation / issuer", { exact: true }).fill("Test society");
  await card.getByLabel("Date / date range", { exact: true }).fill("2026");
  await card.getByLabel("Supporting image (optional)", { exact: true }).setInputFiles({ name: "award.webp", mimeType: "image/webp", buffer: pixels });
  await page.waitForFunction(() => !document.querySelector("#section-picker").disabled);
  await page.getByRole("button", { name: "Add award", exact: true }).click();
  card = page.locator('[data-collection="awards"] details').last();
  await card.getByLabel("Title / role", { exact: true }).fill("Second award");
  await card.getByLabel("Organisation / issuer", { exact: true }).fill("Another society");
  await card.getByLabel("Date / date range", { exact: true }).fill("2025");
  await card.getByRole("button", { name: "Move up" }).click();
  for (const [collection, buttonName] of [["certifications", "Add certification"], ["volunteering", "Add volunteering role"]]) {
    await page.getByRole("button", { name: buttonName, exact: true }).click();
    const entry = page.locator(`[data-collection="${collection}"] details`).last();
    await entry.getByLabel("Title / role", { exact: true }).fill("Test " + collection);
    await entry.getByLabel("Organisation / issuer", { exact: true }).fill("Test organisation");
    await entry.getByLabel("Date / date range", { exact: true }).fill("2025 — Present");
    await entry.getByLabel("Credential / supporting URL (optional)", { exact: true }).fill("https://example.com/details");
  }
  await save();
  const read = async () => JSON.parse(await readFile(path.join(f.root, "src/data/content.json"), "utf8"));
  let disk = await read();
  assert.deepEqual(disk.recognition.awards.map(entry => entry.title), ["Second award", "First award"]);
  assert.match(disk.recognition.awards[1].image, /^\/images\/content\//);
  assert.equal(disk.recognition.certifications.length, 1);
  assert.equal(disk.recognition.volunteering.length, 1);
  await choose("hero");
  assert.equal(await page.getByLabel("Role / tagline", { exact: true }).inputValue(), "Unsaved hero role");
  await save();
  await choose("education");
  await page.getByRole("button", { name: "Add education entry", exact: true }).click();
  card = page.locator('[data-collection="entries"] details').last();
  for (const [label, value] of [["Institution", "Test university"], ["Degree / qualification", "BSc"], ["Field of study", "Computing"], ["Start date", "2026"], ["Location", "Colombo"]]) await card.getByLabel(label, { exact: true }).fill(value);
  await save();
  await choose("skills");
  await page.getByRole("button", { name: "Add skill category", exact: true }).click();
  card = page.locator('[data-collection="entries"] details').last();
  await card.getByLabel("Category title", { exact: true }).fill("New category");
  await card.getByLabel("Skills (one per line)", { exact: true }).fill("React\nNode.js");
  await save();
  await choose("experience");
  await page.getByRole("button", { name: "Add experience entry", exact: true }).click();
  card = page.locator('[data-collection="entries"] details').last();
  for (const [label, value] of [["Company / organisation", "Test team"], ["Role", "Developer"], ["Start date", "2026"], ["Location", "Colombo"]]) await card.getByLabel(label, { exact: true }).fill(value);
  await save();
  await choose("projects");
  await page.getByLabel("Section title", { exact: true }).fill("My selected work");
  await save();
  await choose("contact");
  await page.getByLabel("Contact email", { exact: true }).fill("new@example.com");
  await save();
  await choose("selected-work");
  assert.equal(await page.locator("details").count(), 4);
  await choose("recognition");
  const firstAward = page.locator('[data-collection="awards"] details').first();
  if (!await firstAward.evaluate(node => node.open)) await firstAward.locator("summary").click();
  page.once("dialog", dialog => dialog.accept());
  await page.locator('[data-collection="awards"] details').first().getByRole("button", { name: "Remove award", exact: true }).click();
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Discard changes", exact: true }).click();
  await page.getByText("All changes saved locally", { exact: true }).waitFor();
  assert.equal(await page.locator('[data-collection="awards"] details').count(), 2);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Content editor fits ${width}px`);
  }
  await page.reload();
  await choose("contact");
  assert.equal(await page.getByLabel("Contact email", { exact: true }).inputValue(), "new@example.com");
  disk = await read();
  assert.equal(disk.about.image, "/images/photo2.png");
  assert.match(disk.hero.image, /^\/images\/content\//);
  assert.equal(disk.education.entries.at(-1).institution, "Test university");
  assert.equal(disk.skills.entries.at(-1).skills.length, 2);
  assert.equal(disk.experience.entries.at(-1).role, "Developer");
  assert.deepEqual(errors, []);
});
