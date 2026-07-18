import { expect, test } from "@playwright/test";

test("shows the German start page and primary navigation", async ({ page }) => {
  await page.goto("/");
  if (await page.getByRole("button", { name: "Kennwort speichern" }).isVisible()) {
    await page.getByLabel("Kennwort", { exact: true }).fill("test-password-123");
    await page.getByLabel("Kennwort wiederholen").fill("test-password-123");
    await page.getByRole("button", { name: "Kennwort speichern" }).click();
  } else {
    await page.getByLabel("Kennwort", { exact: true }).fill("test-password-123");
    await page.getByRole("button", { name: "Entsperren" }).click();
  }

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Willkommen bei D100 DungeonScribe",
    }),
  ).toBeVisible();
  await expect(page.getByRole("navigation")).toContainText("Kampagnen");
  await expect(page.getByRole("link", { name: "Neue Kampagne" })).toBeVisible();
});
