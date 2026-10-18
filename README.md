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

Open http://localhost:3000. Portfolio facts and project links live in
`src/data/index.ts`; shared visual tokens live in `src/app/globals.css`.

Development output lives in `.next-dev/`; production output lives in `.next/`.
This keeps a running local preview independent of production builds.

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
npm run build
npx playwright install webkit
npm run test:ui
```

Browser regressions use installed Google Chrome and Playwright WebKit.
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
