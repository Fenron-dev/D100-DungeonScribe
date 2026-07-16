import { expect, test } from "@playwright/test";

test("creates, edits, and archives a campaign", async ({ page }) => {
  await page.goto("/campaigns");
  await page.getByRole("link", { name: "Neue Kampagne" }).first().click();

  await page.getByLabel("Name").fill("Die Straßen im Nebel");
  await page
    .getByLabel("Kampagnenidee")
    .fill("Eine Kartografin sucht nach Straßen, die nachts ihren Verlauf ändern.");
  await page.getByLabel(/Genre/).fill("Fantasy");
  await page.getByLabel(/Stimmung/).fill("Geheimnisvoll");
  await page.getByRole("button", { name: "Kampagne erstellen" }).click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Die Straßen im Nebel" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Bearbeiten" }).click();
  await page.getByLabel("Name").fill("Die wiedergekehrte Straße");
  await page.getByRole("button", { name: "Änderungen speichern" }).click();

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Die wiedergekehrte Straße",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Kampagne archivieren" }).click();
  await expect(page.getByText("Archiviert", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Zur Kampagnenliste" }).click();
  await expect(
    page.getByRole("heading", { name: "Archivierte Kampagnen" }),
  ).toBeVisible();
  await expect(page.getByText("Die wiedergekehrte Straße")).toBeVisible();
});
