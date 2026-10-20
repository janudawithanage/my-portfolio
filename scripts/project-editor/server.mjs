import http from "node:http";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { readFile, writeFile, rename, mkdir, lstat, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { z } from "zod";

const directory = path.dirname(fileURLToPath(import.meta.url));
const imagePrefix = "/images/projects/";
const stagedPrefix = "/staged/";
const maxImageBytes = 10 * 1024 * 1024;
const imageName = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(png|jpe?g|webp)$/i;
const revision = bytes => createHash("sha256").update(bytes).digest("hex");
const text = max => z.string().trim().min(1).max(max);
const httpUrl = z.string().max(2048).refine(value => {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password;
  } catch { return false; }
}, "Enter a complete http:// or https:// URL.");
const projectSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9._-]{0,159}$/),
  title: text(160), description: text(5000),
  tech: z.array(text(80)).max(40),
  githubUrl: httpUrl.optional(), liveUrl: httpUrl.optional(),
  image: z.string().max(240).optional(), featured: z.literal(true),
  status: z.enum(["completed", "in-progress", "planned"]),
  year: z.string().regex(/^\d{4}$/, "Enter a four-digit year."),
}).strict();

class EditorError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function readBody(req, limit) {
  if (Number(req.headers["content-length"]) > limit) {
    req.resume();
    throw new EditorError(413, `File or request is too large (limit ${Math.round(limit / 1024 / 1024)} MB).`);
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size <= limit) chunks.push(chunk);
  }
  if (size > limit) throw new EditorError(413, `File or request is too large (limit ${Math.round(limit / 1024 / 1024)} MB).`);
  return Buffer.concat(chunks);
}

async function readJson(req) {
  if (req.headers["content-type"]?.split(";")[0] !== "application/json") throw new EditorError(415, "Expected JSON.");
  try { return JSON.parse((await readBody(req, 1024 * 1024)).toString()); }
  catch (error) {
    if (error instanceof EditorError) throw error;
    throw new EditorError(400, "Invalid JSON.");
  }
}

function repoCoordinates(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port || url.search || url.hash) throw new Error();
    const match = url.pathname.match(/^\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9._-]+)\/?$/);
    if (!match || [".", ".."].includes(match[2])) throw new Error();
    return [match[1], match[2].replace(/\.git$/, "")];
  } catch { throw new EditorError(400, "Enter a public repository URL such as https://github.com/owner/project."); }
}

function publicRepo(repo) {
  return {
    id: repo.id, name: repo.name, fullName: repo.full_name,
    url: repo.html_url, description: repo.description ?? "",
    homepage: repo.homepage ?? "", language: repo.language ?? "",
    topics: repo.topics ?? [], year: (repo.created_at ?? new Date().toISOString()).slice(0, 4),
  };
}

/** Separate loopback-only tool. No route handlers or editor code enter the Next app. */
export function createProjectEditor({ root, username = "janudawithanage", githubToken, fetchImpl = fetch }) {
  const token = randomBytes(32).toString("hex");
  const sectionPaths = {
    "selected-work": path.join(root, "src/data/projects.json"),
    experiments: path.join(root, "src/data/experiments.json"),
  };
  const imagesPath = path.join(root, "public/images/projects");
  const staged = new Map();
  let saving = false;

  async function state(section) {
    const bytes = await readFile(sectionPaths[section]);
    const data = JSON.parse(bytes);
    if (section === "experiments") data.projects = data.projects.map(project => {
      const result = { ...project };
      delete result.image;
      return result;
    });
    return { ...(section === "experiments" ? data : { projects: data }), revision: revision(bytes) };
  }

  function clearStaged(section) {
    for (const [key, upload] of staged) if (upload.section === section) staged.delete(key);
  }

  async function github(endpoint) {
    let response;
    try {
      response = await fetchImpl(`https://api.github.com${endpoint}`, {
        headers: {
          Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28",
          ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
        }, signal: AbortSignal.timeout(15000),
      });
    } catch { throw new EditorError(502, "Cannot reach GitHub. Try again; your project edits are still available."); }
    if (!response.ok) {
      const messages = {
        401: "GitHub token is invalid. Update GITHUB_TOKEN in .env.local and restart the editor.",
        403: "GitHub denied the request or its rate limit was reached. Try later or configure GITHUB_TOKEN.",
        404: "Public repository or GitHub account not found.",
        429: "GitHub rate limit reached. Try again later.",
      };
      throw new EditorError(502, messages[response.status] ?? "GitHub is unavailable. Try again later.");
    }
    return response.json();
  }

  async function save(body, section) {
    const parsed = z.object({
      projects: z.array(section === "experiments" ? projectSchema.omit({ image: true }) : projectSchema).max(200), revision: z.string(),
      ...(section === "experiments" ? { mode: z.enum(["automatic", "manual"]) } : {}),
    }).strict().safeParse(body);
    if (!parsed.success) throw new EditorError(400, parsed.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("\n"));
    const { projects, revision: expectedRevision, mode } = parsed.data;
    const projectsPath = sectionPaths[section];
    const ids = new Set();
    const urls = new Set();
    for (const project of projects) {
      if (ids.has(project.id)) throw new EditorError(400, "A project is selected more than once.");
      ids.add(project.id);
      if (project.githubUrl) {
        const [owner, name] = repoCoordinates(project.githubUrl);
        const key = `${owner}/${name}`.toLowerCase();
        if (urls.has(key)) throw new EditorError(400, "A GitHub repository is selected more than once.");
        urls.add(key);
      }
      if (!project.image) continue;
      if (project.image.startsWith(stagedPrefix) && staged.get(project.image)?.section === section) continue;
      const name = project.image.slice(imagePrefix.length);
      if (!project.image.startsWith(imagePrefix) || !imageName.test(name)) throw new EditorError(400, "Invalid project image path.");
      const info = await lstat(path.join(imagesPath, name)).catch(() => null);
      if (!info?.isFile() || info.isSymbolicLink()) throw new EditorError(400, `Image is missing for ${project.title}. Upload it again.`);
    }
    if (saving) throw new EditorError(409, "Another save is in progress. Try again.");
    saving = true;
    let temporaryPath;
    try {
      const current = await state(section);
      if (current.revision !== expectedRevision) throw new EditorError(409, "Projects changed on disk. Copy any edits you need, then Discard to reload before saving.");
      await mkdir(imagesPath, { recursive: true });
      const savedImages = new Map();
      for (const project of projects) {
        if (!project.image?.startsWith(stagedPrefix)) continue;
        const original = project.image;
        if (!savedImages.has(original)) {
          const upload = staged.get(original);
          const filename = `project-${randomUUID()}.${upload.extension}`;
          await writeFile(path.join(imagesPath, filename), upload.bytes, { flag: "wx" });
          savedImages.set(original, `${imagePrefix}${filename}`);
        }
        project.image = savedImages.get(original);
      }
      const data = section === "experiments" ? { mode, projects } : projects;
      const bytes = JSON.stringify(data, null, 2) + "\n";
      temporaryPath = `${projectsPath}.${randomUUID()}.tmp`;
      await writeFile(temporaryPath, bytes, { flag: "wx" });
      if ((await state(section)).revision !== expectedRevision) throw new EditorError(409, "Projects changed on disk during save. Copy your edits, then Discard to reload.");
      await rename(temporaryPath, projectsPath);
      temporaryPath = undefined;
      clearStaged(section);
      return { projects, ...(section === "experiments" ? { mode } : {}), revision: revision(bytes) };
    } finally {
      saving = false;
      if (temporaryPath) await rm(temporaryPath, { force: true });
    }
  }

  const server = http.createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    const send = (status, value, type = "application/json; charset=utf-8") => {
      res.writeHead(status, { "Content-Type": type });
      res.end(type.startsWith("application/json") ? JSON.stringify(value) : value);
    };
    try {
      const origin = `http://127.0.0.1:${server.address().port}`;
      if (req.headers.host !== new URL(origin).host || (req.headers.origin && req.headers.origin !== origin) || req.headers["sec-fetch-site"] === "cross-site") {
        throw new EditorError(403, "Only the local editor can access this server.");
      }
      const url = new URL(req.url, origin);
      const method = req.method;
      if (url.pathname.startsWith("/api/")) {
        if (req.headers["x-editor-token"] !== token) throw new EditorError(403, "Editor session is invalid. Reload the editor.");
        const section = url.searchParams.get("section") ?? "selected-work";
        if (!Object.hasOwn(sectionPaths, section)) throw new EditorError(400, "Unknown portfolio section.");
        if (method === "GET" && url.pathname === "/api/projects") return send(200, await state(section));
        if (method === "PUT" && url.pathname === "/api/projects") return send(200, await save(await readJson(req), section));
        if (method === "POST" && url.pathname === "/api/discard") {
          if (saving) throw new EditorError(409, "Please wait for the save to finish.");
          const current = await state(section);
          clearStaged(section);
          return send(200, current);
        }
        if (method === "GET" && url.pathname === "/api/repos") {
          const page = Number(url.searchParams.get("page") ?? 1);
          if (!Number.isInteger(page) || page < 1 || page > 1000) throw new EditorError(400, "Invalid repository page.");
          const repos = await github(`/users/${encodeURIComponent(username)}/repos?type=public&sort=updated&per_page=100&page=${page}`);
          return send(200, { repos: repos.filter(repo => !repo.private).map(publicRepo), hasMore: repos.length === 100, username });
        }
        if (method === "POST" && url.pathname === "/api/repo") {
          const body = await readJson(req);
          const [owner, name] = repoCoordinates(body.url);
          const repo = await github(`/repos/${owner}/${name}`);
          if (repo.private) throw new EditorError(400, "Only public repositories can be selected.");
          return send(200, publicRepo(repo));
        }
        if (method === "POST" && url.pathname === "/api/uploads") {
          if (section === "experiments") {
            req.resume();
            throw new EditorError(400, "Images are only supported in Selected Work.");
          }
          const bytes = await readBody(req, maxImageBytes);
          const total = [...staged.values()].reduce((sum, upload) => sum + upload.bytes.length, 0);
          if (total + bytes.length > 64 * 1024 * 1024) throw new EditorError(413, "Upload staging is full. Save or discard before uploading more images.");
          let metadata;
          try {
            const image = sharp(bytes, { limitInputPixels: 40_000_000, failOn: "warning" });
            metadata = await image.metadata();
            if (!["png", "jpeg", "webp"].includes(metadata.format) || (metadata.pages ?? 1) > 1) throw new Error();
            await image.stats(); // Decode the content as well as checking its header.
          } catch { throw new EditorError(400, "Upload a valid, still PNG, JPEG, or WebP image (maximum 40 megapixels)."); }
          const image = `${stagedPrefix}${randomUUID()}`;
          staged.set(image, { bytes, extension: metadata.format === "jpeg" ? "jpg" : metadata.format, section });
          return send(201, { image });
        }
        throw new EditorError(404, "Editor endpoint not found.");
      }
      if (method !== "GET") throw new EditorError(405, "Method not allowed.");
      if (url.pathname === "/") {
        const html = (await readFile(path.join(directory, "index.html"), "utf8")).replace("__EDITOR_TOKEN__", token);
        return send(200, html, "text/html; charset=utf-8");
      }
      if (["/editor.js", "/editor.css"].includes(url.pathname)) {
        return send(200, await readFile(path.join(directory, url.pathname.slice(1))), url.pathname.endsWith(".js") ? "text/javascript; charset=utf-8" : "text/css; charset=utf-8");
      }
      if (staged.has(url.pathname)) {
        const upload = staged.get(url.pathname);
        return send(200, upload.bytes, `image/${upload.extension === "jpg" ? "jpeg" : upload.extension}`);
      }
      if (url.pathname.startsWith(imagePrefix)) {
        const name = url.pathname.slice(imagePrefix.length);
        if (!imageName.test(name)) throw new EditorError(404, "Image not found.");
        const filename = path.join(imagesPath, name);
        const info = await lstat(filename).catch(() => null);
        if (!info?.isFile() || info.isSymbolicLink()) throw new EditorError(404, "Image not found.");
        return send(200, await readFile(filename), `image/${/\.jpe?g$/i.test(name) ? "jpeg" : name.split(".").pop().toLowerCase()}`);
      }
      throw new EditorError(404, "Not found.");
    } catch (error) {
      if (!(error instanceof EditorError)) console.error("Project editor:", error);
      if (!res.headersSent) send(error.status ?? 500, { error: error instanceof EditorError ? error.message : "Could not complete the request. Your previous project selection is unchanged; check the terminal and try again." });
      else res.end();
    }
  });
  server.requestTimeout = 30_000;
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(directory, "../..");
  // Use Next's env loader so local and deployed portfolio configuration agree.
  const { default: nextEnv } = await import("@next/env");
  nextEnv.loadEnvConfig(root, true);
  const port = Number(process.env.PROJECT_EDITOR_PORT ?? 3033);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PROJECT_EDITOR_PORT.");
  const server = createProjectEditor({ root, username: process.env.GITHUB_USERNAME, githubToken: process.env.GITHUB_TOKEN });
  server.on("error", error => {
    console.error(error.code === "EADDRINUSE" ? `Port ${port} is busy. Set PROJECT_EDITOR_PORT to another port.` : error.message);
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => console.log(`Portfolio project editor: http://127.0.0.1:${port}\nManage Selected Work and Open source & experiments. Save locally, then commit and push to publish. Stop with Ctrl+C.`));
}
