# D100 DungeonScribe

D100 DungeonScribe ist eine private, lokal oder selbst gehostet betriebene Webanwendung für Solo-Rollenspiele. Sie verbindet Kampagnenzustand, Szenen, eine deterministische Regel-Engine, ein Solo-Orakel und später einen austauschbaren KI-Spielleiter.

Die Kampagne ist der zentrale Zustand. Ein Chat ist nur eine Ansicht innerhalb einer Szene und niemals die alleinige Quelle der Wahrheit.

## Projektstatus

Phase 0 bis Phase 5 sind abgeschlossen. Das Projekt befindet sich in **Phase 10 – Chronik und Wissen** und wird ausschließlich über GitHub Actions gebaut und geprüft.

Der aktuelle vertikale Funktionsumfang umfasst Kampagnen erstellen, auflisten, öffnen, bearbeiten und archivieren, deren Charaktere verwalten sowie ein durchsuchbares Weltregister für Personen, Orte, Fraktionen und Gegenstände. Weltobjekte besitzen typspezifische Details und können über gerichtete, typisierte Beziehungen verknüpft werden. Kampagnenwissen trennt Fakten, Charakterwissen, Gerüchte, Geheimnisse, Vermutungen und Erinnerungen samt Wahrheitsstatus, bekannten Charakteren, Weltbezügen und Fixierung. Handlungsstränge erfassen offene Entwicklungen mit Status, Dringlichkeit, Fortschritt, Weltbezügen und möglichen nächsten Wendungen. Eine filterbare Chronik macht alle verbindlichen Änderungen verständlich sichtbar, ohne technische Ereignisdaten offenzulegen. Jede Änderung wird atomar mit einem Kampagnenereignis gespeichert.

Die reine Regel-Engine wertet konfigurierbare W6-Pool-Proben mit Archetyp, Eigenschaften, Vor- und Nachteilen, Schwierigkeiten, Erfolgsgraden und der freiwilligen Wahl „Erfolg mit Kosten“ aus. Feste Zufallssequenzen machen jede Regelentscheidung reproduzierbar testbar.

## Festgelegte Leitlinien

- Einzelbenutzer-Anwendung ohne Konten oder Cloudzwang
- Deutsch als Standardsprache; weitere Sprachen sind technisch vorbereitet
- dunkle, atmosphärische und gut lesbare Oberfläche
- Regeln, Würfel und Orakel funktionieren vollständig ohne KI
- OpenAI ist der erste KI-Anbieter hinter einer anbieterneutralen Schnittstelle
- KI-Ausgaben verändern keine Kampagnendaten direkt
- vollständiger Export der Benutzerdaten bleibt ein Kernziel
- keine Telemetrie und keine externen Analysewerkzeuge

## Geplanter Stack

- Next.js und React
- TypeScript im Strict Mode
- SQLite und Prisma
- Zod
- Vitest und React Testing Library
- Playwright für zentrale Abläufe
- CSS-Variablen und eine kleine, zugängliche Komponentenbasis

Versionen werden beim technischen Grundgerüst festgelegt und in einer Lockdatei fixiert.

## Entwicklung ohne lokale Build-Abhängigkeiten

Auf dem lokalen Rechner werden aus Platzgründen keine Pakete installiert und keine Builds erzeugt. Insbesondere bleiben `node_modules`, Build-Ausgaben und lokale Datenbankdateien unversioniert. Installation, Tests, Typecheck, Lint, Prisma-Prüfungen und Builds werden später durch GitHub Actions ausgeführt.

Bis ein GitHub-Repository eingerichtet ist, können Änderungen deshalb nur statisch geprüft werden. Dieser eingeschränkte Verifikationsstand muss bei jedem Arbeitspaket ausdrücklich genannt werden.

Vor jedem Upload prüft `npm run security:scan` die versionierten Textdateien auf typische Zugangsdaten und persönliche Benutzerpfade. Echte `.env`-Dateien, Datenbanken, Exporte und Schlüsseldateien sind ausgeschlossen. Weitere Hinweise stehen in [SECURITY.md](SECURITY.md).

## Dokumentation

- [Architektur](docs/architecture.md)
- [Domainmodell](docs/domain-model.md)
- [Regel-Engine](docs/rules-engine.md)
- [Charakterverwaltung](docs/character-management.md)
- [Weltobjekte](docs/world-entities.md)
- [Kampagnenwissen](docs/campaign-knowledge.md)
- [Kampagnenchronik](docs/chronicle.md)
- [Handlungsstränge](docs/story-threads.md)
- [Entwicklungsprozess](docs/development-process.md)
- [macOS-Testbuild](docs/macos-test-build.md)
- [Verbindliche Regeln für Codex](AGENTS.md)

## Geplante Befehle

Diese Befehle werden mit dem Grundgerüst in Phase 1 eingerichtet und in GitHub Actions ausgeführt:

```bash
npm ci
npm run test
npm run typecheck
npm run lint
npm run build
```

Für eine spätere lokale oder selbst gehostete Laufzeit wird die Anwendung voraussichtlich mit `npm run dev` beziehungsweise `npm run start` gestartet. Eine lokale Entwicklungsinstallation ist aktuell ausdrücklich nicht Teil des Arbeitsablaufs.
