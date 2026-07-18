# Sicherheit und Datenschutz

D100 DungeonScribe verarbeitet potenziell private Kampagneninhalte. Das Repository darf niemals echte Kampagnenexporte, Datenbankdateien, Zugangsdaten, API-Schlüssel, Passwörter oder private Schlüssel enthalten.

## Lokale KI-Profile

KI-Profile werden mit einem vom Nutzer gewählten App-Kennwort verschlüsselt.
Gespeichert werden nur Salt, Initialisierungsvektor, Authentifizierungstag und
Ciphertext. Das Kennwort sowie der abgeleitete Schlüssel werden nicht
persistiert. Ein Entsperrschlüssel bleibt nur für die laufende lokale
App-Sitzung im Arbeitsspeicher.

Die App akzeptiert unverschlüsseltes HTTP für Ollama und LM Studio nur auf
Loopback-Adressen. Entfernte Anbieterprofile benötigen HTTPS. Schlüssel werden
weder protokolliert noch in Kampagnen, Exporte oder GitHub-Workflows übernommen.

## Sicherheitsproblem melden

Solange kein eigener sicherer Meldekanal festgelegt ist, veröffentliche sensible Details bitte nicht in einem öffentlichen Issue. Verwende stattdessen die private Sicherheitsmeldung des GitHub-Repositorys, sobald diese verfügbar ist.

Entferne vor jeder Meldung:

- echte API-Schlüssel und Tokens
- Passwörter und private Schlüssel
- persönliche Namen, E-Mail-Adressen und lokale Benutzerpfade
- private Kampagnentexte und Exporte
- vollständige KI-Prompts mit Kampagnenkontext

## Schutzmaßnahmen im Repository

- Das öffentliche Repository enthält ausschließlich Programmcode, Tests und Dokumentation.
- Umgebungsdateien, Datenbanken, Exporte und Schlüsseldateien werden ignoriert.
- CI erhält nur Leserechte auf Repository-Inhalte.
- CI verwendet ausschließlich eine temporäre SQLite-Testdatenbank.
- Ein lokaler, abhängigkeitfreier Scan prüft versionierte Textdateien auf typische Geheimnisse und persönliche Benutzerpfade.
- KI-Schlüssel werden ausschließlich im lokalen, kennwortverschlüsselten Profilfach gespeichert und niemals in GitHub-Workflows oder Quelldateien geschrieben.
