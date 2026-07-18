# Entwicklungsprozess

## Grundsatz

Das Projekt wird in kleinen, vertikalen Arbeitspaketen umgesetzt. Jedes Paket liefert einen nachvollziehbaren fachlichen Nutzen, aktualisierte Dokumentation und angemessene Tests.

Ein Arbeitspaket beginnt nicht mit der Aufforderung, die gesamte Plattform zu bauen. Es benennt Aufgabe, Umfang, Ausschlüsse, Regeln, technische Anforderungen, Akzeptanzkriterien und Tests.

## Ablauf eines Arbeitspakets

1. vorhandene Struktur, `AGENTS.md` und relevante Dokumente lesen
2. Ziel, Nicht-Ziele und Akzeptanzkriterien bestätigen
3. betroffene Dateien und Architekturgrenzen bestimmen
4. kleinsten vollständigen vertikalen Schnitt implementieren
5. Unit-, Integrations- oder UI-Tests passend zum Risiko ergänzen
6. Dokumentation bei neuen Entscheidungen aktualisieren
7. verfügbare Prüfungen ausführen
8. Änderungen, Prüfergebnisse und offene Risiken berichten

## Remote-Verifikation

Auf dem lokalen Rechner werden keine Node-Pakete installiert und keine Builds erzeugt. Der vollständige Qualitätsnachweis erfolgt deshalb nach Einrichtung des Repositorys in GitHub Actions.

Die CI soll mindestens folgende getrennt erkennbare Schritte enthalten:

```text
Abhängigkeiten reproduzierbar installieren
-> Schema und generierten Datenzugriff prüfen
-> Unit- und Komponententests
-> Typecheck
-> Lint
-> Produktions-Build
```

End-to-End-Tests werden ergänzt, sobald ein zusammenhängender Benutzerablauf existiert. Fehlerartefakte wie Playwright-Screenshots werden nur bei Fehlschlägen mit begrenzter Aufbewahrung hochgeladen.

Bis GitHub Actions verfügbar ist:

- nur statische und dateibasierte Prüfungen ausführen
- keine erfolgreichen Laufzeittests behaupten
- fehlende Verifikation als offenes Risiko dokumentieren
- besonders kleine Änderungen bevorzugen, damit spätere CI-Fehler leicht zuzuordnen sind

Nach Einrichtung des Repositorys sollte CI nach jedem abgeschlossenen Arbeitspaket beziehungsweise Push laufen, nicht erst am Ende des MVP. Dadurch bleibt der lokale Rechner frei von Build-Daten, während Fehler zeitnah sichtbar werden.

Der getrennte Workflow `macOS Test Build` erzeugt bei manueller Anforderung ein selbststartendes Testpaket für Apple Silicon. Ein Intel-Paket wird nicht gebaut, da das vorgesehene Testgerät ein Apple-Silicon-Mac ist. macOS-Runner werden wegen ihrer höheren Kosten nicht bei jedem Push ausgeführt. Diese Pakete sind Entwicklungsbuilds, keine signierten oder notarisierten Veröffentlichungen.

## Git- und Repository-Strategie

Das GitHub-Repository existiert noch nicht. Seine Erstellung ist ein eigenes, ausdrücklich bestätigtes Arbeitspaket.

Vorgesehen:

- `main` bleibt in einem geprüften Zustand
- kurze Feature-Branches oder klar begrenzte direkte Arbeitspakete
- verständliche, fachlich fokussierte Commits
- Pull Requests für größere oder riskante Pakete
- Schutzregeln erst einrichten, wenn CI zuverlässig läuft
- keine Secrets, Datenbanken, Exporte oder Build-Artefakte versionieren

## Definition of Done

Ein Arbeitspaket ist abgeschlossen, wenn:

- der vereinbarte Umfang umgesetzt ist
- Akzeptanzkriterien nachweisbar erfüllt sind
- notwendige Tests vorhanden sind
- Dokumentation und Code übereinstimmen
- keine bekannten Architekturgrenzen verletzt werden
- verfügbare Prüfungen erfolgreich sind
- nicht ausführbare Prüfungen und verbleibende Risiken offen benannt sind

Ein grüner Build allein ersetzt keine fachliche Abnahme.

## Architekturentscheidungen

Kleine Klarstellungen werden direkt im passenden Dokument festgehalten. Entscheidungen mit langfristigen Alternativen oder Migrationskosten erhalten später einen Architecture Decision Record unter `docs/decisions/`.

Ein ADR enthält:

- Kontext und Problem
- Entscheidung
- erwogene Alternativen
- Folgen und Risiken
- Datum und Status

## Datenbankänderungen

- Jede Schemaänderung erhält eine Migration.
- Migrationen werden nicht nachträglich umgeschrieben, sobald sie geteilt oder angewandt wurden.
- Schemaänderung, Repository-Anpassung und Tests gehören in dasselbe Paket.
- Test- und Seed-Daten verwenden keine privaten Kampagnenexporte.
- „Die Straßen im Nebel“ dient als synthetische Referenzkampagne.

## Abhängigkeiten

Neue Abhängigkeiten werden nur aufgenommen, wenn:

- sie einen klaren Bedarf erfüllen
- eine kleine Eigenimplementierung nicht sicherer oder einfacher wäre
- Wartungszustand und Lizenz geeignet sind
- Server- und Browsergrenzen berücksichtigt sind
- ihre Einführung im Arbeitspaket genannt wird

Die Versionsauswahl wird in Phase 1 anhand aktueller offizieller Dokumentation getroffen. Danach sorgt die Lockdatei für reproduzierbare CI-Installationen.

## Fehlerbehandlung und Protokollierung

- erwartbare Fehler werden als typisierte fachliche Ergebnisse behandelt
- technische Fehler verlieren keine ursprüngliche Ursache
- Benutzer erhalten verständliche Meldungen ohne Geheimnisse oder interne Details
- Logs enthalten keine API-Schlüssel, vollständigen Prompts oder unnötigen Kampagneninhalte
- KI- und Netzwerkfehler dürfen mechanisch gültige Kampagnendaten nicht beschädigen

## Phasenfolge

Die vereinbarte Reihenfolge bleibt grundsätzlich bestehen:

1. Projektregeln und Architektur
2. technisches Grundgerüst
3. Kampagnenverwaltung
4. Regel-Engine
5. Charakterverwaltung
6. Weltobjekte
7. Szenen ohne KI
8. Orakel
9. KI-Anbindung
10. KI-Änderungsvorschläge
11. Chronik und Wissen
12. Bibliothek
13. Stabilisierung

Abweichungen sind möglich, müssen aber einen konkreten vertikalen Nutzen haben und dokumentiert werden.
