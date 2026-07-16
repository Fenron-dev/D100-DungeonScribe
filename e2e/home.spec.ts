import { expect, test } from "@playwright/test";

test("shows the German start page and primary navigation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Willkommen bei D100 DungeonScribe",
    }),
  ).toBeVisible();
  await expect(page.getByRole("navigation")).toContainText("Kampagnen");
  await expect(page.getByRole("link", { name: "Neue Kampagne" })).toBeVisible();
});
