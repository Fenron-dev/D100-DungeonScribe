import { expect, test } from "@playwright/test";

test("creates, edits, and archives a campaign", async ({ page }) => {
  await page.goto("/campaigns");
  await page.getByRole("link", { name: "Neue Kampagne" }).first().click();

  await page.getByLabel("Name").fill("Die Straßen im Nebel");
  await page
    .getByLabel("Kampagnenidee")
    .fill("Eine Kartografin sucht nach Straßen, die nachts ihren Verlauf ändern.");
  await page.getByRole("button", { name: "Kampagne erstellen" }).click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Die Straßen im Nebel" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Charakter erstellen" }).click();
  await page.getByLabel("Name").fill("Elara Venn");
  await page
    .getByLabel("Konzept")
    .fill("Ehemalige Hofmagierin auf der Suche nach ihrem Bruder");
  await page.getByLabel("Archetyp").selectOption("insightful");
  await page.getByLabel("Eigenschaft 1").fill("Gebildet");
  await page.getByLabel("Eigenschaft 2").fill("Arkane Wahrnehmung");
  await page.getByRole("button", { name: "Charakter speichern" }).click();

  await expect(page.getByRole("heading", { name: "Elara Venn" })).toBeVisible();
  await page.getByRole("link", { name: "Charakter bearbeiten" }).click();
  await page.getByLabel("Name").fill("Elara aus dem Nebel");
  await page.getByRole("button", { name: "Änderungen speichern" }).click();
  await expect(
    page.getByRole("heading", { name: "Elara aus dem Nebel" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Weltregister öffnen" }).click();
  await page.getByRole("link", { name: "Weltobjekt erstellen" }).click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1_000);
  await page.getByLabel("Typ").selectOption("location");
  await page.getByLabel("Name").fill("Leuchtturm der Nebelwacht");
  await page.getByLabel("Region").fill("Nordküste");
  await page.getByLabel("Atmosphäre").fill("Neblig und windgepeitscht");
  await page
    .getByLabel("Kurzfassung")
    .fill("Der letzte sichere Ort an der Nordküste.");
  await page.getByLabel("Tags").fill("Küste, Zuflucht");
  await page.getByRole("button", { name: "Weltobjekt speichern" }).click();

  await expect(
    page.getByRole("heading", { name: "Leuchtturm der Nebelwacht" }),
  ).toBeVisible();
  await page.getByLabel("Weltregister durchsuchen").fill("Küste");
  await page.getByRole("button", { name: "Filtern" }).click();
  await expect(page.getByText("Der letzte sichere Ort an der Nordküste.")).toBeVisible();
  await page.getByRole("link", { name: "Bearbeiten" }).click();
  await page.getByLabel("Name").fill("Die Nebelwacht");
  await page.getByRole("button", { name: "Änderungen speichern" }).click();
  await expect(page.getByRole("heading", { name: "Die Nebelwacht" })).toBeVisible();

  await page.getByRole("link", { name: "Weltobjekt erstellen" }).click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1_000);
  await page.getByLabel("Typ").selectOption("faction");
  await page.getByLabel("Name").fill("Bund der Lotsen");
  await page.getByLabel("Ziel").fill("Die sicheren Seewege bewahren");
  await page.getByLabel("Einfluss").fill("Nordküste");
  await page.getByLabel("Kurzfassung").fill("Ein alter Bund aus Küstenlotsen.");
  await page.getByRole("button", { name: "Weltobjekt speichern" }).click();
  await expect(page.getByRole("heading", { name: "Bund der Lotsen" })).toBeVisible();

  const factionCard = page.getByRole("article").filter({ hasText: "Bund der Lotsen" });
  await factionCard.getByRole("link", { name: "Bearbeiten" }).click();
  await page.getByLabel("Zielobjekt").selectOption({ label: "Die Nebelwacht (Ort)" });
  await page.getByLabel("Beziehungstyp").selectOption("located_at");
  await page.getByLabel("Beziehungsnotiz").fill("Hauptquartier des Bundes");
  await page.getByRole("button", { name: "Beziehung anlegen" }).click();
  await expect(page.getByText("Bund der Lotsen befindet sich bei Die Nebelwacht")).toBeVisible();
  await page.getByRole("link", { name: "Zum Weltregister" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Die Welt dieser Kampagne" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Zur Kampagne" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Die Straßen im Nebel" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Bearbeiten", exact: true }).click();
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
