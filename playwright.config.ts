import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://localhost:3000", trace: "retain-on-failure" },
  webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 }, channel: "msedge" } },
    { name: "mobile", use: { viewport: { width: 375, height: 812 }, channel: "msedge", isMobile: true } },
  ],
});
