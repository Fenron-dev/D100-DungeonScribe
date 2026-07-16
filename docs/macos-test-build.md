# macOS-Testbuild

Der Workflow **macOS Test Build** erzeugt eigenständig startbare Testpakete für beide unterstützten Mac-Architekturen:

- Apple Silicon (`macos-15`, arm64)
- Intel (`macos-15-intel`, x64)

Die Runnerbezeichnungen entsprechen der [offiziellen GitHub-Runnerreferenz](https://docs.github.com/en/actions/reference/runners/github-hosted-runners).

## Workflow starten

1. Im GitHub-Repository **Actions** öffnen.
2. **macOS Test Build** auswählen.
3. **Run workflow** für `main` starten.
4. Nach erfolgreichem Abschluss das passende Artefakt herunterladen.

Der Workflow läuft außerdem für Tags mit dem Präfix `test-build-`.

## Passendes Paket wählen

- Macs mit M1, M2, M3, M4 oder neuer verwenden **Apple Silicon**.
- Ältere Macs mit Intel-Prozessor verwenden **Intel**.

Die Architektur steht unter **Apple-Menü → Über diesen Mac**.

## Anwendung starten

1. Das von GitHub heruntergeladene ZIP entpacken.
2. Das darin enthaltene `.tar.gz` vollständig entpacken.
3. `Start.command` öffnen.
4. Beim ersten Start gegebenenfalls per Rechtsklick **Öffnen** wählen und bestätigen.
5. Der Browser öffnet `http://127.0.0.1:3210` automatisch.
6. Zum Beenden im Terminalfenster `Ctrl+C` drücken.

Der Build ist nicht mit einem Apple-Entwicklerzertifikat signiert oder notarisiert. Er ist ausschließlich als privater Entwicklungs- und Testweg gedacht.

## Lokale Daten

Die Anwendung legt die Datenbank außerhalb des Programmpakets ab:

```text
~/Library/Application Support/D100 DungeonScribe/dungeonscribe.db
```

Das Paket enthält keine API-Schlüssel, Passwörter oder Kampagnendaten. Datenbankmigrationen werden beim Start aus den mitgelieferten, versionierten SQL-Migrationen angewandt. Der Server bindet ausschließlich an `127.0.0.1`.

## Inhalt und Verifikation

Jedes Artefakt enthält:

- Next.js-Standalone-Server
- die zur Architektur passende Node-Laufzeit
- native SQLite-Abhängigkeiten
- Prisma-Migrationen
- Startskript und Nutzungshinweise
- Node.js-Lizenz

Vor dem Upload führt der Workflow den Secret-Scan, den Produktions-Build, alle Datenbankmigrationen und einen Start-/HTTP-Smoke-Test des fertig zusammengestellten Pakets aus. Neben dem Archiv wird eine SHA-256-Prüfsumme erzeugt.
