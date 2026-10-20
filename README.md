# Januda Withanage — Portfolio

A project-first software engineering portfolio built with Next.js 16, React 19,
TypeScript, Tailwind CSS 4, and Framer Motion.

The redesigned UI uses matte navy surfaces, cyan accents, Inter and Syne typography,
responsive project cards, grouped skills, and accessible mobile navigation.
Design guidance and tokens are documented in [the design system](design-system/januda-portfolio/MASTER.md).

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000. Portfolio facts live in `src/data/index.ts`, selected
projects in `src/data/projects.json`, and shared visual tokens in `src/app/globals.css`.

Development output lives in `.next-dev/`; production output lives in `.next/`.
This keeps a running local preview independent of production builds.

## Edit project sections

Run the private editor on your computer:

```sh
npm run edit:projects
```

Open **http://127.0.0.1:3033** (use this exact address). The editor is a separate
loopback-only server; its pages and editing APIs are not part of the Vercel app.
No login or database is required. Stop it with Ctrl+C. If the port is busy, run
`PROJECT_EDITOR_PORT=3034 npm run edit:projects` and use the address printed in
the terminal. Use Node.js 20.9 or later, as required by Next.js.

- Choose **01 / Selected Work** or **06 / Open source & experiments** from
  **Portfolio section**. Each section has its own projects and order.
  Switching sections keeps unsaved drafts and staged images; save each section
  separately. The editor shows a reminder if the other section has unsaved edits.
- Open source & experiments uses the existing **Automatic GitHub feed** until
  you add a repository or choose **My selected repositories**. Your own selection
  displays editable text-only project cards, works without GitHub requests,
  and supports Show all / Show fewer. You can switch back to the automatic feed
  without deleting your saved selection.
- Search your public GitHub repositories and choose **Add**. Use **Load more
  repositories** to reach projects beyond the first 100, or paste a public
  repository URL to add a team project from another account.
- Expand a selected project to edit its title, description, technologies,
  status, year, source code URL, and optional live demo URL. GitHub metadata
  prefills new projects; refreshing repositories never overwrites curated text.
- In **Selected Work**, upload a still PNG, JPEG, or WebP screenshot (up to 10 MB and 40 megapixels).
  Images are validated and staged in memory until you save. Removing an image
  restores the portfolio's default artwork. Move cards up/down to set their order.
  **Open source & experiments** has no images, artwork, or image upload controls.
- Choose **Save changes** to update the current section's data:
  `src/data/projects.json` for Selected Work or `src/data/experiments.json` for
  Open source & experiments. New images go in `public/images/projects/`.
  **Discard changes** reloads only the current section and clears its staged
  uploads. Unsaved changes/uploads are lost on editor restart.
- Run `npm run dev` in another terminal to preview your saved changes. Commit and
  push the project JSON and any new images; your normal Vercel deployment then
  publishes them. The editor never commits, pushes, or deploys for you.

Existing projects and images are preserved. Removing a selection does not delete
its repository or image files. If files changed on disk since you loaded them,
Save reports a conflict: copy any edits you need, then Discard to reload.
Keep one editor tab open while working; saving or discarding clears the current
section's staged uploads on that editor server.

The editor reads `GITHUB_USERNAME` and optional server-only `GITHUB_TOKEN` from
the normal local environment files. A read-only token improves GitHub rate limits;
it is never sent to the browser. Public repositories only are supported. If GitHub
is unavailable, you can still edit and save your existing selection.

## Integrations

- `GITHUB_USERNAME`: GitHub account; defaults to `janudawithanage`.
- `GITHUB_TOKEN`: optional server-side token for public repository reads.
- `NEXT_PUBLIC_FORMSPREE_ID`: optional contact form ID. When absent, the form opens
  an email draft and accurately tells the visitor to send it in their mail app.
- `NEXT_PUBLIC_SITE_URL`: optional canonical deployment origin for metadata.

Keep environment values in an untracked `.env.local`.

## Verification

```sh
npm run lint
npx tsc --noEmit
npm run test:editor
npm run build
npx playwright install webkit
npm run test:ui
```

Browser regressions use installed Google Chrome and Playwright WebKit.
Editor tests also use installed Google Chrome, mock GitHub requests, and exercise
the real loopback server against temporary copies of the project data and images.
They never save edits to the working portfolio.
The runner creates a disposable copy on port 3032 with mock GitHub data, test-only
state previews, and a dummy contact form ID. All submissions are intercepted.
It does not read the working app's environment files or add fixture routes to the
production app. Reports are written to the ignored `playwright-report/` directory.

Coverage includes 320–1920px layouts, phone/tablet landscape, navigation breakpoint
boundaries, mobile dialog keyboard focus and dismissal, project highlights,
repository expansion, contact validation/loading/error/success, GitHub states,
reduced motion, zoom reflow, and enlarged text.

## Visual review through Playwright MCP

With a local dev or production server running:

```sh
npm run review:ui -- chrome review http://localhost:3000
node node_modules/@playwright/mcp/cli.js install-browser webkit
npm run review:ui -- webkit review http://localhost:3000
```

The review client launches Microsoft's Playwright MCP over stdio with an isolated,
headless browser. It captures desktop/mobile section screenshots and checks layout,
navigation, focus, expansion, and reduced motion. Screenshots and metrics are stored
in the ignored `artifacts/ui-review/` directory.
