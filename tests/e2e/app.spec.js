import { expect, test } from "@playwright/test";

test("home page renders key marketing copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Build interview confidence with a sharper, more usable practice loop.")).toBeVisible();
});

test("upgrade page renders and can start checkout with mocked response", async ({ page }) => {
  await page.route("**/api/billing/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        plan: "free",
        quotaLimit: 2,
        usedInterviews: 1,
        remainingInterviews: 1,
        canManageBilling: false,
      }),
    });
  });

  await page.route("**/api/billing/checkout", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: "https://stripe.test/checkout",
      }),
    });
  });

  await page.goto("/upgrade");
  await expect(page.getByText("Keep practicing after the free sessions run out.")).toBeVisible();
  await expect(page.getByText("1/2 sessions remaining")).toBeVisible();
});

test("dashboard loads under e2e auth bypass", async ({ page }) => {
  await page.route("**/api/billing/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        plan: "free",
        quotaLimit: 2,
        usedInterviews: 0,
        remainingInterviews: 2,
        canCreate: true,
        canManageBilling: false,
      }),
    });
  });

  await page.goto("/dashboard");
  await expect(page.getByText("Build your next practice session without digging through clutter.")).toBeVisible();
});
