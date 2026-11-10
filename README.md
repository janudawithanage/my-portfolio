# Januda Withanage — Portfolio

A project-first software engineering portfolio built with Next.js 16, React 19,
TypeScript, and Tailwind CSS 4. Motion is CSS plus one small client component; there is no
animation library, and reduced-motion settings are respected.

The UI is a light "liquid glass" design: a warm ivory page with slowly drifting colour
fields, frosted glass cards, sapphire and champagne accents, Inter and Syne typography,
scroll reveals, pointer tilt, and an accessible floating navigation pill.
Design guidance, tokens, and motion rules are documented in [the design system](design-system/januda-portfolio/MASTER.md).

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

Hero always comes first and **Get in touch** always comes last. In between, the default
order is **A little about me → Stats band → Now → Education → The toolkit → Selected
Work → Experience → Security & CTF → Recognition → Writing → Talks & publications →
Testimonials**. Change it under **Section order & visibility**. The hero photo keeps its
square frame. Open source & experiments is no longer displayed; its data remains on disk.

**Empty sections never appear.** A section renders only when it has at least one real
entry, and an optional field renders only when it has a value: no placeholders, no
"coming soon". The navigation, footer links, and section numbers ("01 — About") are
built from the sections that are actually shown, so hidden sections do not use up a
number. New lists start empty; add your own details when you are ready.

Choose a section from **Portfolio section**:

- **Section order & visibility:** move sections up or down and switch any of them off.
  Sections without content stay hidden even when switched on.
- **Hero:** edit your name, role, introduction, availability, location, photo and
  alt text, button labels, CV PDF path/URL, GitHub/LinkedIn URLs, facts, focus areas,
  and the moving skills strip.
- **A little about me:** edit the heading, introduction, paragraphs, photo and
  alt text, study/location labels, and contact link label.
- **Stats band:** headline numbers with labels (for example "15+ projects shipped").
  Numbers count up when they scroll into view.
- **Now:** what you are building, learning, reading, or exploring, with an optional
  emoji (replaces the icon), optional link, and an optional "last updated" note.
- **Education:** edit the heading and add, edit, reorder, or remove qualifications,
  institution logos, dates, results, GPA, descriptions, and highlights.
- **The toolkit:** edit the heading and skill categories, icons, descriptions,
  and skills. Enter one skill per line; proficiency meters are not displayed.
- **Selected Work / Projects & images:** search your public GitHub repositories,
  load more results, or add a public team repository by URL. Edit titles,
  descriptions, technologies, status (including **Design only**), year, an optional
  card date such as "Aug–Oct 2025", source/live links (a live URL shows **Go live**),
  screenshots, and order. Cards are numbered by their order; the first six show,
  then **View N more**. **Selected Work / Section heading** edits its title,
  introduction, and GitHub link label. Repository refresh never overwrites your
  curated text.
- **Experience:** edit the heading and add, edit, reorder, or remove roles with
  organisations, dates, locations, type, descriptions, highlights, and technologies.
- **Security & CTF:** events and platforms with an optional rank or result, date,
  description, write-up link, and tags.
- **Recognition:** edit its heading and manage **Awards & Achievements**,
  **Certifications**, and **Volunteering & Leadership**. Entries support a title
  or role, organisation/issuer, date range, optional description, credential or
  supporting link, optional organisation logo, and optional image. No recognition
  claims are prefilled.
- **Writing:** articles with a title, optional platform, date, optional excerpt,
  link, and optional cover image.
- **Talks & publications:** talks, papers, posters, and workshops with venue, date,
  optional description, and optional link.
- **Testimonials:** quotes with a name and optional role, company, photo, and link.
  Add only words people have agreed to share. More than one quote becomes a carousel
  that can be paused and moved with the arrow keys.
- **Get in touch:** edit the heading, introduction, availability, email, optional
  phone, location, form heading, footer text, and **More profiles** (X, Medium,
  Dev.to, YouTube, Instagram, Facebook, Dribbble, or any website), which appear with
  GitHub and LinkedIn in Contact and the footer. Formspree configuration remains in
  the environment; the email field controls direct email/draft links.

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
navigation link are omitted. Long lists (projects, recognition categories, security
events, articles, talks) preview six entries with an accessible **View N more** /
**Show fewer** control.

If the editor was already running before you pulled these changes, restart
`npm run edit:projects`: it loads its validation rules when it starts.

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
  A hidden honeypot field stops naive bots only; also enable spam filtering and
  restrict submissions to your domain in the Formspree dashboard.
- `NEXT_PUBLIC_SITE_URL`: the deployed origin, for example `https://example.com`.
  It enables the canonical URL, the social preview image (`public/images/og.jpg`,
  1200×630) and the `sitemap.xml` / `robots.txt` entries. Vercel's production
  domain is detected automatically; without either, these are omitted.

Copy `.env.example` to an untracked `.env.local` and keep real values there.

## Assets and security

- **CV:** the Download CV button appears only when the file at the Hero's CV path
  exists, or when that path is an external URL. Put your PDF at
  `public/Januda-Withanage-CV.pdf` (or change the path in the editor) and rebuild.
- **Images:** the editor accepts up to 10 MB, but that is a ceiling. Resize photos to
  about 1600px wide and use WebP or JPEG before uploading; large originals slow
  the first image request and bloat the repository permanently.
- **Headers:** `next.config.ts` sends a Content-Security-Policy and other security
  headers in production. The policy allows only this origin plus Formspree, so adding
  analytics, embeds or other third-party scripts means extending it there.

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
reduced motion, zoom reflow, and enlarged text. The disposable copy fills Stats,
Security and Writing with test data, switches Now off, and leaves Talks and
Testimonials empty, so the suite proves that empty or switched-off sections never
render, never reach navigation, and never use up a section number. A test-only
`/ui-fixtures/showcase` route renders Now, Talks and the testimonial carousel.
Further tests cover "View N more" expansion, the carousel's keyboard and pause
controls, scroll reveals, count-up values, and that all content is visible without
JavaScript.

If a production build or the Turbopack dev server keeps serving old styles after
an edit to `src/app/globals.css`, stop it, delete its Turbopack cache
(`.next/cache/turbopack` for builds, `.next-dev/dev/cache/turbopack` for the dev server),
and rebuild or restart. Both folders are disposable.

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
