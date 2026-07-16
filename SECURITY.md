# Sicherheit und Datenschutz

D100 DungeonScribe verarbeitet potenziell private Kampagneninhalte. Das Repository darf niemals echte Kampagnenexporte, Datenbankdateien, Zugangsdaten, API-Schlüssel, Passwörter oder private Schlüssel enthalten.

## Sicherheitsproblem melden

Solange kein eigener sicherer Meldekanal festgelegt ist, veröffentliche sensible Details bitte nicht in einem öffentlichen Issue. Verwende stattdessen die private Sicherheitsmeldung des GitHub-Repositorys, sobald diese verfügbar ist.

Entferne vor jeder Meldung:

- echte API-Schlüssel und Tokens
- Passwörter und private Schlüssel
- persönliche Namen, E-Mail-Adressen und lokale Benutzerpfade
- private Kampagnentexte und Exporte
- vollständige KI-Prompts mit Kampagnenkontext

## Schutzmaßnahmen im Repository

- Das Repository wird standardmäßig privat angelegt.
- Umgebungsdateien, Datenbanken, Exporte und Schlüsseldateien werden ignoriert.
- CI erhält nur Leserechte auf Repository-Inhalte.
- CI verwendet ausschließlich eine temporäre SQLite-Testdatenbank.
- Ein lokaler, abhängigkeitfreier Scan prüft versionierte Textdateien auf typische Geheimnisse und persönliche Benutzerpfade.
- OpenAI-Schlüssel werden erst in der KI-Phase als GitHub Secret beziehungsweise serverseitige Laufzeitvariable konfiguriert und niemals in Dateien geschrieben.
