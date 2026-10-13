import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:3032", reducedMotion: "reduce", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "chromium", use: { browserName: "chromium", channel: "chrome", viewport: { width: 1440, height: 1000 } } },
    { name: "webkit-mobile", use: { browserName: "webkit", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: { command: "node scripts/start-ui-test-server.mjs", url: "http://127.0.0.1:3032", reuseExistingServer: false, timeout: 120_000 },
});
