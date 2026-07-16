# Verbindliche Projektregeln

Diese Regeln gelten für das gesamte Repository. Änderungen daran sind Architekturänderungen und müssen im selben Arbeitspaket begründet und dokumentiert werden.

## Arbeitsumfang

- Arbeite in kleinen, abgeschlossenen Arbeitspaketen mit klaren Akzeptanzkriterien.
- Implementiere nur den vereinbarten Umfang; vermeide spekulative Funktionen.
- Analysiere vor Änderungen die vorhandene Struktur und die betroffenen Dokumente.
- Bewahre Änderungen des Benutzers und fasse keine sachfremden Dateien an.
- Halte Dokumentation, Implementierung und Tests im selben Arbeitspaket konsistent.

## TypeScript und Abhängigkeiten

- Verwende TypeScript im Strict Mode.
- Verwende keine expliziten oder impliziten `any`-Typen.
- Bevorzuge präzise Domain-Typen gegenüber Typumgehungen und Type Assertions.
- Führe neue Laufzeitabhängigkeiten nur ein, wenn ihr Nutzen dokumentiert ist.
- Fixiere Abhängigkeiten über die Lockdatei; ändere Versionen nicht beiläufig.
- Installiere lokal keine Pakete und erzeuge lokal keine Build-Artefakte.

## Architekturgrenzen

- Domainlogik darf React, Next.js, Prisma und konkrete KI-SDKs nicht importieren.
- Die Regel-Engine und das Orakel dürfen weder UI noch Datenbank kennen.
- Datenbankzugriff erfolgt ausschließlich über Repository-Schnittstellen.
- Services orchestrieren Anwendungsfälle; sie ersetzen keine Domainlogik.
- UI-Komponenten führen keine verbindlichen Regeln oder Datenbankoperationen aus.
- Externe Anbieter werden ausschließlich über Adapter hinter internen Ports angebunden.
- Ändere keine bestehende Architekturentscheidung ohne Dokumentation.

## Kampagnenzustand und Ereignisse

- Die Kampagne ist die Quelle der Wahrheit, nicht der Chatverlauf.
- Jede verbindliche Zustandsänderung muss als Kampagnenereignis nachvollziehbar sein.
- Fixierte Fakten dürfen nicht automatisch verändert werden.
- Objektive Fakten, Charakterwissen, Gerüchte, Geheimnisse, Vermutungen und Erinnerungen bleiben getrennt.
- Mechanische Änderungen werden durch deterministische Anwendungslogik validiert.

## Zufall und Regeln

- Zufall muss über eine `RandomSource` injiziert werden.
- Tests verwenden reproduzierbare Zufallsquellen.
- Jede neue Domainfunktion und Regel benötigt Unit-Tests.
- Regelsysteme bestehen im MVP aus validierten Daten und bekannten Bausteinen, nicht aus frei ausführbarem Code.
- Ergebnisse müssen neben Rohdaten eine nachvollziehbare Erklärung liefern.

## KI

- Keine KI-Funktion darf direkt Datenbankänderungen ausführen.
- KI-Ausgaben müssen strukturiert und mit Zod validiert werden, bevor sie die Anwendungsgrenze passieren.
- KI-generierte Weltänderungen sind Vorschläge und müssen gemäß Kampagneneinstellung geprüft werden.
- Würfel, verbindliche Regelauswertung und Zufallszahlen stammen niemals aus dem Sprachmodell.
- API-Schlüssel bleiben serverseitig und dürfen weder Browser noch Protokolle erreichen.
- Prompts enthalten nur den für den Anwendungsfall erforderlichen Kampagnenkontext.
- Anbieter- und Modellnamen dürfen nicht in Domainlogik festgeschrieben werden.

## Internationalisierung und Oberfläche

- Deutsch ist die Standardsprache.
- Benutzeroberflächentexte werden nicht direkt in wiederverwendbaren Komponenten verstreut, sondern über stabile Übersetzungsschlüssel bezogen.
- Gespeicherte Benutzerinhalte werden nicht automatisch übersetzt.
- Semantisches HTML, Tastaturbedienung, erkennbare Fokuszustände und ausreichende Kontraste sind verbindlich.
- Die Gestaltung ist dunkel und atmosphärisch, darf Lesbarkeit und Bedienbarkeit aber nie beeinträchtigen.
- KI-generiertes HTML wird nicht gerendert; Markdown muss sanitisiert werden.

## Verifikation

- Führe vor Abschluss eines Arbeitspakets Tests, Typecheck, Lint und den Produktions-Build aus, sobald GitHub Actions verfügbar ist.
- Lokal werden wegen der Speicherbeschränkung keine Abhängigkeiten installiert und keine Builds ausgeführt.
- Solange keine CI verfügbar ist, führe mögliche statische Prüfungen aus und kennzeichne nicht ausführbare Prüfungen ausdrücklich als offen.
- Behaupte keine erfolgreiche Prüfung, die nicht tatsächlich ausgeführt wurde.

## Datenschutz

- Keine Telemetrie, externen Analysen oder automatische Cloud-Synchronisierung.
- Exporte können sensible Kampagnendaten enthalten und müssen entsprechend gekennzeichnet werden.
- Geheimnisse und unbekanntes Weltwissen dürfen nicht versehentlich in Spieler-Kontext oder Erzählantworten gelangen.
