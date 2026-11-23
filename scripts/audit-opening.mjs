import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("tmp/opening-audit", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });

for (const profile of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812, isMobile: true },
]) {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    isMobile: profile.isMobile ?? false,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

  for (const [name, wait] of [["first-frame", 40], ["fade", 480], ["reveal", 360], ["settled", 1500]]) {
    await page.waitForTimeout(wait);
    await page.screenshot({ path: `tmp/opening-audit/${profile.name}-${name}.png` });
  }

  await context.close();
}

await browser.close();
