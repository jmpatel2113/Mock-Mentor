import { expect, test } from "@playwright/test";

test("home page smoke test", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toBeVisible();
});
