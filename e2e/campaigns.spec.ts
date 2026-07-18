import { expect, test } from "@playwright/test";

test("creates, edits, and archives a campaign", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/campaigns");
  await page.getByRole("link", { name: "Neue Kampagne" }).first().click();

  await page.getByRole("button", { name: "Entwurf erzeugen" }).click();
  await expect(
    page.getByText("Der Entwurf steht jetzt in den Formularfeldern.", { exact: false }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByLabel("Name")).not.toHaveValue("");

  await page.getByLabel("Name").fill("Die Straßen im Nebel");
  await page
    .getByLabel("Kampagnenidee")
    .fill("Eine Kartografin sucht nach Straßen, die nachts ihren Verlauf ändern.");
  await page.getByRole("button", { name: "Kampagne erstellen" }).click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Eine Szene beginnen" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Entwurf erzeugen" })).toBeVisible();
  await page.getByRole("link", { name: "Zu den Szenen" }).click();
  await page.getByRole("link", { name: "Zur Kampagne" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Die Straßen im Nebel" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Spielen" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Was möchtest du spielen?" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Erste Szene beginnen" })).toBeVisible();
  await page.getByRole("link", { name: "Kampagne öffnen" }).click();

  await page.getByRole("link", { name: "Charakter erstellen" }).click();
  await page.getByRole("button", { name: "Entwurf erzeugen" }).click();
  await expect(page.getByLabel("Konzept")).not.toHaveValue("", { timeout: 15_000 });
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
  await page.getByRole("button", { name: "Entwurf erzeugen" }).click();
  await expect(page.getByLabel("Kurzfassung")).not.toHaveValue("", { timeout: 15_000 });
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

  await page.getByRole("link", { name: "Wissen öffnen" }).click();
  await page.getByRole("link", { name: "Wissenseintrag erstellen" }).click();
  await page.getByLabel("Wissensart").selectOption("secret");
  await page.getByLabel("Wahrheitsstatus").selectOption("true");
  await page.getByLabel("Titel").fill("Das Licht der Nebelwacht");
  await page
    .getByLabel("Inhalt")
    .fill("Das Leuchtfeuer zieht die Kreaturen aus dem Nebel an.");
  await page.getByLabel("Elara aus dem Nebel").check();
  await page.getByLabel("Die Nebelwacht · Ort").check();
  await page.getByLabel("Eintrag fixieren").check();
  await page.getByRole("button", { name: "Wissenseintrag speichern" }).click();
  await expect(page.getByRole("heading", { name: "Das Licht der Nebelwacht" })).toBeVisible();
  await expect(page.getByText("Fixiert", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Bearbeiten", exact: true }).click();
  await page.getByLabel("Titel").fill("Die Wahrheit der Nebelwacht");
  await page.getByRole("button", { name: "Änderungen speichern" }).click();
  await expect(page.getByRole("heading", { name: "Die Wahrheit der Nebelwacht" })).toBeVisible();
  await page.getByRole("link", { name: "Zur Kampagne" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Die Straßen im Nebel" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Handlungsstränge öffnen" }).click();
  await page.getByRole("link", { name: "Handlungsstrang erstellen" }).click();
  await page.getByLabel("Titel").fill("Die wiedergekehrte Straße");
  await page
    .getByLabel("Ausgangslage")
    .fill("Eine verschwundene Straße ist nach zwanzig Jahren wieder aufgetaucht.");
  await page.getByLabel("Dringlichkeit").selectOption("4");
  await page.getByLabel("Aktueller Fortschritt").fill("1");
  await page.getByLabel("Fortschrittsziel").fill("4");
  await page.getByLabel("Die Nebelwacht · Ort").check();
  await page.getByLabel("Entwicklung 1").fill("Der Nebel gibt einen weiteren Weg frei.");
  await page.getByRole("button", { name: "Handlungsstrang speichern" }).click();
  await expect(page.getByRole("heading", { name: "Die wiedergekehrte Straße" })).toBeVisible();
  await expect(page.locator(".thread-progress strong")).toHaveText("1 / 4");
  await page.getByRole("link", { name: "Bearbeiten", exact: true }).click();
  await page.getByLabel("Status").selectOption("dormant");
  await page.getByLabel("Aktueller Fortschritt").fill("2");
  await page.getByRole("button", { name: "Änderungen speichern" }).click();
  await expect(page.getByText("Ruhend", { exact: true })).toBeVisible();
  await expect(page.locator(".thread-progress strong")).toHaveText("2 / 4");
  await page.getByRole("link", { name: "Zur Kampagne" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Die Straßen im Nebel" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Szenen öffnen" }).click();
  await page.getByRole("link", { name: "Neue Szene beginnen" }).click();
  await page.getByLabel("Szenentitel").fill("Die Straße im Nebel");
  await page
    .getByLabel("Ort", { exact: true })
    .selectOption({ label: "Die Nebelwacht" });
  await page
    .getByLabel("Erwartete Ausgangssituation")
    .fill("Elara erreicht die Nebelwacht und sucht nach dem verborgenen Weg.");
  await page
    .getByLabel("Tatsächlicher Szenenbeginn")
    .fill("Im leeren Turm sind frische Schritte zu hören.");
  await page.getByLabel("Szenenziel").fill("Den Ursprung der Schritte finden");
  await page.getByLabel("Elara aus dem Nebel").check();
  await page.getByLabel("Bund der Lotsen · Fraktion").check();
  await page.getByLabel("Die wiedergekehrte Straße").check();
  await page.getByRole("button", { name: "Szene beginnen" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Die Straße im Nebel" })).toBeVisible();
  await expect(page.getByText("Aktiv", { exact: true })).toBeVisible();
  await page.getByLabel("Nachricht").fill("Ich untersuche die Spuren am Kartenarchiv.");
  await page.getByRole("button", { name: "Nachricht speichern" }).click();
  await expect(page.getByText("Ich untersuche die Spuren am Kartenarchiv.")).toBeVisible();
  await page.getByLabel("Beitrag von").selectOption("narrator");
  await page
    .getByLabel("Nachricht")
    .fill("Hinter der Tür raschelt Pergament, obwohl kein Wind weht.");
  await page.getByRole("button", { name: "Nachricht speichern" }).click();
  await expect(
    page.getByText("Hinter der Tür raschelt Pergament, obwohl kein Wind weht."),
  ).toBeVisible();
  await expect(page.getByText("Demo-Modus", { exact: true })).toBeVisible();
  await page
    .getByLabel("Was soll als Nächstes erzählt werden?")
    .fill("Lass ein leises Klopfen hinter dem Kartenregal hörbar werden.");
  await page.getByRole("button", { name: "Erzählung erzeugen" }).click();
  const aiMessage = page.locator(".scene-message-entry.source-ai").filter({
    hasText: "Die Szene nimmt die Richtung",
  });
  await expect(aiMessage).toBeVisible();
  await expect(aiMessage.getByText("KI-erzeugt", { exact: true })).toBeVisible();
  await page
    .getByLabel("Eintrag", { exact: true })
    .fill("Elara folgt den frischen Spuren in das Kartenarchiv.");
  await page.getByRole("button", { name: "Eintrag speichern" }).click();
  await expect(page.getByText("Elara folgt den frischen Spuren in das Kartenarchiv.")).toBeVisible();
  await page.getByLabel("Handelnder Charakter").selectOption({ label: "Elara aus dem Nebel" });
  await page.getByLabel("Beabsichtigte Handlung").fill("Die verborgenen Runen der Karte lesen");
  await page.getByLabel("Passende Eigenschaft (optional)").fill("Arkane Wahrnehmung");
  await page.getByLabel("Archetyp passt zur Handlung").check();
  await page.getByRole("button", { name: "Würfeln" }).click();
  await expect(page.getByText("Die verborgenen Runen der Karte lesen")).toBeVisible();
  await expect(page.getByText("core-adventure v1")).toBeVisible();
  await page.getByLabel("Orakelfrage").fill("Ist die verborgene Karte noch vollständig?");
  await page.getByLabel("Wahrscheinlichkeit für Ja").selectOption("likely");
  await page.getByRole("button", { name: "Orakel befragen" }).click();
  await expect(page.getByText("Ist die verborgene Karte noch vollständig?")).toBeVisible();
  await expect(page.locator(".oracle-answer")).toHaveText(
    /^(Nein|Nein, aber …|Nein, und zusätzlich …|Ungewiss oder situationsabhängig|Ja|Ja, aber …|Ja, und zusätzlich …)$/,
  );
  await page
    .getByLabel("Detailfrage (optional)")
    .fill("Was macht das Kartenarchiv gefährlich?");
  await page.getByLabel("Erster Begriff").selectOption("discovery");
  await page.getByLabel("Zweiter Begriff").selectOption("danger");
  await page.getByRole("button", { name: "Inspiration ziehen" }).click();
  const inspiration = page.locator(".inspiration-entry");
  await expect(inspiration.getByText("Was macht das Kartenarchiv gefährlich?")).toBeVisible();
  await expect(inspiration.locator(".inspiration-terms strong")).toHaveCount(2);
  await expect(inspiration.getByText("Entdeckung", { exact: true })).toBeVisible();
  await expect(inspiration.getByText("Gefahr", { exact: true })).toBeVisible();
  await page
    .getByLabel("Ereigniskontext (optional)")
    .fill("Was unterbricht Elaras Suche im Kartenarchiv?");
  await page.getByRole("button", { name: "Ereignis erzeugen" }).click();
  const randomEvent = page.locator(".random-event-entry").filter({
    hasText: "Was unterbricht Elaras Suche im Kartenarchiv?",
  });
  await expect(
    randomEvent.getByText("Was unterbricht Elaras Suche im Kartenarchiv?"),
  ).toBeVisible();
  await expect(randomEvent.locator(".random-event-focus")).not.toBeEmpty();
  await expect(randomEvent.locator(".random-event-prompt span")).toHaveCount(2);
  await page
    .getByLabel("Szenenzusammenfassung")
    .fill("Elara findet eine verborgene Karte, die einen Weg durch den Nebel zeigt.");
  await page.getByLabel("Spannung nach der Szene").selectOption("increase");
  await page.getByRole("button", { name: "Szene abschließen" }).click();
  await expect(page.getByText("Abgeschlossen", { exact: true })).toBeVisible();
  await expect(page.getByText("Elara findet eine verborgene Karte, die einen Weg durch den Nebel zeigt.")).toBeVisible();
  await page.getByRole("link", { name: "Zu den Szenen" }).click();
  await page.getByRole("link", { name: "Zur Kampagne" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Die Straßen im Nebel" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Chronik öffnen" }).click();
  await expect(page.getByText(/2[23] Ereignisse/)).toBeVisible();
  await page.getByLabel("Chronik filtern").selectOption("scenes");
  await page.getByRole("button", { name: "Filtern" }).click();
  await expect(page.getByText(/1[12] Ereignisse/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Szene begonnen" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Szene abgeschlossen" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Szeneneintrag festgehalten" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Szenennachricht festgehalten" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "KI-Erzählung erzeugt" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Probe ausgewertet" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Orakelfrage beantwortet" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Orakelinspiration gezogen" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Zufallsereignis erzeugt" }).first(),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Spannung angepasst" })).toBeVisible();
  await page.getByRole("link", { name: "Zur Kampagne" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Die Straßen im Nebel" }),
  ).toBeVisible();
  await expect(page.getByText("4 / 6", { exact: true })).toBeVisible();

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
  await expect(
    page.getByRole("heading", { level: 3, name: "Die wiedergekehrte Straße" }).first(),
  ).toBeVisible();
});
