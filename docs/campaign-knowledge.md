# Kampagnenwissen

Der Wissensbereich trennt Informationen nach ihrer fachlichen Bedeutung. Diese Trennung ist eine Sicherheitsgrenze für spätere Erzähl- und KI-Funktionen: Ein objektiv wahres Geheimnis ist nicht automatisch Wissen der Spielfigur.

## Wissensarten

- `fact`: objektiv feststehender Weltzustand
- `character_knowledge`: Wissen oder Überzeugung eines Charakters
- `rumor`: Information mit ungeklärter Zuverlässigkeit
- `secret`: objektive Information, die verborgen bleiben kann
- `assumption`: Schlussfolgerung des Spielers oder eines Charakters
- `memory`: persönliche Erfahrung und ihre Bedeutung

Jeder Eintrag besitzt zusätzlich den Wahrheitsstatus `true`, `false`, `partially_true` oder `unknown`. Wissensart und Wahrheitsstatus sind bewusst unabhängig: Ein Gerücht kann beispielsweise wahr sein, ohne dass die Figur seine Zuverlässigkeit kennt.

## Sichtbarkeit und Bezüge

`knownByCharacterIds` enthält ausschließlich Charaktere, denen die Information bekannt ist. Eine leere Liste bedeutet „keinem Charakter bekannt“ und eignet sich insbesondere für unentdeckte Geheimnisse. `relatedEntityIds` verknüpft den Eintrag optional mit Weltobjekten derselben Kampagne.

Die Anwendung zeigt dem lokalen Einzelbenutzer alle Einträge zur Verwaltung. Spätere Spieler- und KI-Kontexte dürfen dagegen nur Einträge erhalten, deren Wissensart und Wissendenliste für den jeweiligen Zweck freigegeben sind.

## Fixierte Einträge

Ein fixierter Eintrag erhält höchste fachliche Priorität. Manuelle Bearbeitung durch den Benutzer bleibt möglich; automatische Vorschläge dürfen ihn weder überschreiben noch löschen. Jede Erstellung und manuelle Bearbeitung wird gemeinsam mit einem unveränderlichen Kampagnenereignis gespeichert.
