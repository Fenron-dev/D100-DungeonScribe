# Weltobjekte

## Umfang des ersten Phase-5-Bausteins

Das Weltregister verwaltet zunächst vier sprachneutral gespeicherte Objekttypen:

- `npc` – Person
- `location` – Ort
- `faction` – Fraktion
- `item` – Gegenstand

Jedes Objekt besitzt eine gemeinsame, strukturierte Basis aus Name, Kurzfassung, optionaler Beschreibung, Tags und Status. Diese Basis folgt dem Zielmodell und verhindert, dass zentrale Felder frühzeitig in unstrukturiertem JSON verschwinden.

## Status

Unterstützte Statuswerte sind:

- `active`
- `inactive`
- `destroyed`
- `unknown`

Die deutsch- und englischsprachige Oberfläche übersetzt nur die stabilen Schlüssel. Eingegebene Kampagneninhalte werden nicht automatisch übersetzt.

## Suche und Filter

Das kampagnengebundene Weltregister durchsucht Namen, Kurzfassungen und Tags ohne Beachtung der Großschreibung. Zusätzlich kann nach einem der vier Typen gefiltert werden. Die Filterung verändert keine Daten und benötigt keinen externen Dienst.

## Persistenz und Ereignisse

Weltobjekte können nur innerhalb ihrer Kampagne geladen und verändert werden. Folgende Zustandsänderungen werden zusammen mit dem aktuellen Zustand in einer Datenbanktransaktion gespeichert:

- `ENTITY_CREATED`
- `ENTITY_UPDATED`

Die Ereignisse enthalten technische Identität und Typ des Objekts. Sie bilden die Grundlage für spätere Chronik, Änderungsvorschläge und Konfliktprüfung.

## Validierung

- Name: 1 bis 120 Zeichen
- Kurzfassung: 1 bis 300 Zeichen
- Beschreibung: optional, höchstens 4.000 Zeichen
- Tags: höchstens acht eindeutige Einträge mit jeweils höchstens 40 Zeichen
- Typ und Status: ausschließlich bekannte Schlüssel

## Nächster Ausbau

Das unmittelbar folgende Teilpaket ergänzt typspezifische Felder und explizite Verknüpfungen zwischen Weltobjekten. Regionen, Quests, Handlungsstränge und Wissenseinträge bleiben eigene spätere Aggregate, damit Geheimnisse und Charakterwissen nicht versehentlich mit allgemein sichtbaren Weltbeschreibungen vermischt werden.
