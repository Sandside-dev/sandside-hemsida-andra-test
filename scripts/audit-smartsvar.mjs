import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("tmp/reference/smartsvar", { recursive: true });
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
  await page.goto("https://www.smartsvar.se/", { waitUntil: "networkidle", timeout: 90_000 });
  await page.screenshot({ path: `tmp/reference/smartsvar/${profile.name}-hero-start.png` });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `tmp/reference/smartsvar/${profile.name}-hero-settled.png` });

  const motion = await page.evaluate(() => {
    const running = document.getAnimations().map((animation) => {
      const effect = animation.effect;
      const target = effect instanceof KeyframeEffect ? effect.target : null;
      return {
        tag: target instanceof Element ? target.tagName : null,
        className: target instanceof Element ? target.className : null,
        duration: effect?.getTiming().duration,
        delay: effect?.getTiming().delay,
        iterations: effect?.getTiming().iterations,
      };
    });
    return { count: running.length, sample: running.slice(0, 30) };
  });
  console.log(JSON.stringify({ profile: profile.name, motion }, null, 2));

  for (const [index, y] of [700, 1450, 2300, 3300].entries()) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "smooth" }), y);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `tmp/reference/smartsvar/${profile.name}-scroll-${index + 1}.png` });
  }
  await context.close();
}

await browser.close();
