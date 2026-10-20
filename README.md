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

Open http://localhost:3000. Editable section content lives in `src/data/content.json`, selected
projects in `src/data/projects.json`, and shared visual tokens in `src/app/globals.css`.

Development output lives in `.next-dev/`; production output lives in `.next/`.
This keeps a running local preview independent of production builds.

## Edit every portfolio section

Run the private editor on your computer:

```sh
npm run edit:projects
```

Open **http://127.0.0.1:3033** (use this exact address). The editor is a separate
loopback-only server; its pages and editing APIs are not part of the deployed app.
No login or database is required. Stop it with Ctrl+C. If the port is busy, use
`PROJECT_EDITOR_PORT=3034 npm run edit:projects`. Use Node.js 20.9 or later.

The public page follows this order: **Hero → A little about me → Education →
The toolkit → Selected Work → Experience → Recognition → Get in touch**.
The hero photo keeps its square frame. Open source & experiments is no longer
displayed; its existing data remains on disk.

Choose a section from **Portfolio section**:

- **Hero:** edit your name, role, introduction, availability, location, photo and
  alt text, button labels, CV PDF path/URL, GitHub/LinkedIn URLs, facts, and focus areas.
- **A little about me:** edit the heading, introduction, paragraphs, photo and
  alt text, study/location labels, and contact link label.
- **Education:** edit the heading and add, edit, reorder, or remove qualifications,
  institution logos, dates, results, GPA, descriptions, and highlights.
- **The toolkit:** edit the heading and skill categories, icons, descriptions,
  and skills. Enter one skill per line; proficiency meters are not displayed.
- **Selected Work / Projects & images:** search your public GitHub repositories,
  load more results, or add a public team repository by URL. Edit titles,
  descriptions, technologies, status, year, source/demo links, screenshots, and
  order. **Selected Work / Section heading** edits its title, introduction, and
  GitHub link label. Repository refresh never overwrites your curated text.
- **Experience:** edit the heading and add, edit, reorder, or remove roles with
  organisations, dates, locations, type, descriptions, highlights, and technologies.
- **Recognition:** edit its heading and manage **Awards & Achievements**,
  **Certifications**, and **Volunteering & Leadership**. Entries support a title
  or role, organisation/issuer, date range, optional description, credential or
  supporting link, and optional image. No recognition claims are prefilled.
- **Get in touch:** edit the heading, introduction, availability, email, location,
  form heading, and footer text. Email and social links are shared with the footer;
  the name and profile links are shared with the header. Formspree configuration
  remains in the environment; the email field controls direct email/draft links.

Each section retains its own unsaved draft when switching sections. Choose
**Save changes** for the current section, or **Discard changes** to reload its
saved values and clear its staged uploads. Unsaved drafts/uploads are lost when
the editor restarts. Keep one editor tab open while working. Save reports a
conflict when that section changed on disk; copy edits you need, then Discard.

Images must be still PNG, JPEG, or WebP, up to 10 MB and 40 megapixels. Uploads are
validated and staged in memory until Save. Project images go in
`public/images/projects/`; other section images go in `public/images/content/`.
Existing photos remain unchanged until you explicitly upload a replacement.
Removing an entry or image never deletes its repository or existing image files.

Empty Recognition categories stay hidden. Saving the first entry reveals its
category automatically; if all categories are empty, Recognition and its
navigation link are omitted. Each category previews six entries with accessible
Show all / Show fewer controls. Contact numbering adjusts to visible sections.

Saved section details go in `src/data/content.json`; selected projects remain in
`src/data/projects.json`. Keep `npm run dev` running and refresh the portfolio to
preview saved changes. Commit and push those JSON files and new images to publish
through your normal Vercel workflow. The editor does not commit, push, or deploy.

The GitHub picker reads `GITHUB_USERNAME` and optional server-only `GITHUB_TOKEN`
from the usual environment files. Public repositories only are supported. You
can edit and save every existing section while GitHub is unavailable.

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
