import { expect, test } from "@playwright/test";

test("home navigation and chat conversation persist", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Ge kunderna svar direkt." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Boka möte" }).nth(1)).toHaveAttribute("href", "/boka");
  await page.getByRole("button", { name: "Testa chattbotten" }).click();
  const input = page.getByLabel("Skriv din fråga");
  await expect(input).toBeFocused();
  await input.fill("Vad kostar en körlektion?");
  await page.getByRole("button", { name: "Skicka fråga" }).click();
  await expect(page.getByText(/720 kr/).last()).toBeVisible();
  await page.getByRole("button", { name: "Stäng chatten" }).click();
  await expect(page.getByTestId("chat-trigger")).toBeFocused();
  await page.getByRole("link", { name: "Om oss" }).first().click();
  await page.getByTestId("chat-trigger").click();
  await expect(page.getByText(/720 kr/).last()).toBeVisible();
  await page.getByRole("button", { name: "Stäng chatten" }).click();
  await expect(page.getByTestId("chat-trigger")).toBeFocused();
});

test("home intro runs once per visit", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  const intro = page.locator(".home-intro");
  await expect(intro).toBeVisible();
  await expect(intro).toContainText("Sandside");
  await expect(intro).toBeHidden({ timeout: 1600 });
  await page.reload();
  await expect(intro).toBeHidden();
});

test("about and booking pages are usable", async ({ page }) => {
  await page.goto("/om-oss");
  await expect(page.getByRole("heading", { name: "Oscar Westdahl" })).toBeVisible();
  await page.goto("/boka");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Berätta");
  await expect(page.getByTestId("chat-trigger")).toBeVisible();
  await expect(page.getByText("Bokningen är inte tillgänglig")).toBeVisible();
});

test("no horizontal overflow", async ({ page }) => {
  for (const path of ["/", "/om-oss", "/boka"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} has horizontal overflow`).toBeLessThanOrEqual(1);
  }
});

test("capture pages for visual review", async ({ page }, testInfo) => {
  for (const [name, path] of [["home", "/"], ["about", "/om-oss"], ["booking", "/boka"]] as const) {
    await page.goto(path);
    if (path === "/") await page.waitForTimeout(2600);
    if (path === "/boka") await expect(page.getByText("Bokningen är inte tillgänglig")).toBeVisible();
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.75) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(650);
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true });

    if (path === "/") {
      await page.locator(".questions-showcase").scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({ path: testInfo.outputPath("home-questions.png") });
      await page.locator(".story-step").nth(1).scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({ path: testInfo.outputPath("home-story.png") });
      await page.getByTestId("chat-trigger").click();
      await page.screenshot({ path: testInfo.outputPath("home-chat.png") });
    }
  }
});

test("reduced motion preserves the complete product story", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".home-intro")).toBeHidden();
  await expect(page.locator(".hero-product-shell").getByText(/En körlektion på 50 minuter kostar/)).toBeVisible();
  await page.evaluate(() => document.querySelector(".story-step:last-child")?.scrollIntoView());
  await expect(page.getByText("När svaret saknas tar en människa över.")).toBeVisible();
});
