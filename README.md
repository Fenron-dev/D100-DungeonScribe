# D100 DungeonScribe

D100 DungeonScribe ist eine private, lokal oder selbst gehostet betriebene Webanwendung für Solo-Rollenspiele. Sie verbindet Kampagnenzustand, Szenen, eine deterministische Regel-Engine, ein Solo-Orakel und später einen austauschbaren KI-Spielleiter.

Die Kampagne ist der zentrale Zustand. Ein Chat ist nur eine Ansicht innerhalb einer Szene und niemals die alleinige Quelle der Wahrheit.

## Projektstatus

Phase 0 bis Phase 7 sind abgeschlossen. Das Projekt befindet sich in **Phase 8 – KI-Anbindung**; der anbieterneutrale Erzählport, OpenAI-Adapter, lokale Demo-Provider, minimaler Szenenkontext und eine validierte Erzählantwort sind umgesetzt. Gebaut und geprüft wird ausschließlich über GitHub Actions.

Der aktuelle vertikale Funktionsumfang umfasst Kampagnen erstellen, auflisten, öffnen, bearbeiten und archivieren, deren Charaktere verwalten sowie ein durchsuchbares Weltregister für Personen, Orte, Fraktionen und Gegenstände. Neue Geschichten, Charaktere und einzelne Weltobjekte können optional als KI-Entwurf vorausgefüllt, vollständig bearbeitet, neu erzeugt und erst danach bewusst gespeichert werden. Weltobjekte besitzen typspezifische Details und können über gerichtete, typisierte Beziehungen verknüpft werden. Kampagnenwissen trennt Fakten, Charakterwissen, Gerüchte, Geheimnisse, Vermutungen und Erinnerungen samt Wahrheitsstatus, bekannten Charakteren, Weltbezügen und Fixierung. Handlungsstränge erfassen offene Entwicklungen mit Status, Dringlichkeit, Fortschritt, Weltbezügen und möglichen nächsten Wendungen. Szenen verbinden Ort, Beteiligte und Handlungsstränge zu einer konkreten Spielsituation, führen Spieler- und Erzählernachrichten, KI-Erzählungen, Handlungen, Beobachtungen, nachvollziehbar ausgewertete Würfelproben, Ja-Nein-Orakelfragen, offene Inspirationen sowie manuell oder durch Spannung und Pasch ausgelöste Zufallsereignisse in einem dauerhaften Spielprotokoll und werden mit Zusammenfassung und Spannungsanpassung abgeschlossen. KI-Erzählungen können neue Personen, Orte, Fraktionen und Gegenstände sowie Erkenntnisse und Handlungsfäden als unverbindliche Vorschlagskarten vorbereiten; erst eine geprüfte Bestätigung übernimmt sie. Wissensart und Wahrheitsstatus legt dabei immer der Spieler fest. Eine filterbare Chronik macht alle verbindlichen Änderungen verständlich sichtbar, ohne technische Ereignisdaten offenzulegen. Jede verbindliche Änderung wird atomar mit einem Kampagnenereignis gespeichert.

## Optionale KI-Erzählung

Ohne Konfiguration arbeitet die KI-Erzählfunktion im lokalen Demo-Modus und überträgt keine Daten. Für OpenAI wird der Schlüssel ausschließlich serverseitig als `OPENAI_API_KEY` gesetzt; `OPENAI_MODEL` kann optional angepasst werden. Reale Schlüssel gehören weder in `.env.example` noch in Git, Screenshots oder GitHub-Buildvariablen. Die Build- und Testabläufe benötigen keinen API-Schlüssel und rufen keine externe KI auf.

Bei einer bewusst ausgelösten Erzählanfrage werden nur Kampagnenrahmen, aktuelle Szene, Namen der Beteiligten, Titel aktiver Handlungsstränge und höchstens die jüngsten 24.000 Zeichen des Szenendialogs übertragen. Wissenseinträge, Geheimnisse, Charakternotizen und das vollständige Protokoll werden nicht geladen. Die strukturierte Antwort wird lokal validiert, als reiner Text gerendert und verändert keine Weltfakten oder Regeln.

Die Entwurfsgeneratoren arbeiten nach demselben Sicherheitsprinzip. Ein Story-Entwurf benötigt keinen bestehenden Kampagneninhalt. Charakter- und Weltentwürfe erhalten ausschließlich Name, Idee, Genre und Stimmung der aktuellen Kampagne. Entwürfe sind flüchtig und erzeugen weder Datenbankeinträge noch Chronikereignisse, bis der Benutzer das reguläre Formular absendet.

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
- [Szenen ohne KI](docs/scenes.md)
- [Solo-Orakel](docs/oracle.md)
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
