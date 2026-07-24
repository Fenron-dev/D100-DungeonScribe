# Weltobjekte

## Umfang der Phase-5-Bausteine

Das Weltregister verwaltet zunächst vier sprachneutral gespeicherte Objekttypen:

- `npc` – Person
- `location` – Ort
- `faction` – Fraktion
- `item` – Gegenstand

Jedes Objekt besitzt eine gemeinsame, strukturierte Basis aus Name, Kurzfassung, optionaler Beschreibung, Tags und Status. Diese Basis folgt dem Zielmodell und verhindert, dass zentrale Felder frühzeitig in unstrukturiertem JSON verschwinden.

## Typspezifische Details

Der zweite Baustein ergänzt pro Typ zwei optionale, validierte Angaben:

- Person: Rolle und Motivation
- Ort: Region und Atmosphäre
- Fraktion: Ziel und Einfluss
- Gegenstand: Zweck und Seltenheit

Die Angaben werden als diskriminierte, typgebundene Struktur gespeichert. Wechselt der Typ, können keine Details des vorherigen Typs unbemerkt übernommen werden. Jede Angabe ist auf 200 Zeichen begrenzt.

## Beziehungen

Beziehungen sind eigene gerichtete Datensätze innerhalb derselben Kampagne. Unterstützte Typen sind `located_at`, `member_of`, `owns`, `allied_with`, `hostile_to` und `connected_to`. Eine Beziehung besitzt Quelle, Ziel, optional eine Beschreibung bis 500 Zeichen sowie den Status `active` oder `inactive`.

Selbstbeziehungen, kampagnenfremde Ziele und doppelte Kombinationen aus Quelle, Ziel und Typ werden abgewiesen. Eingehende und ausgehende Beziehungen werden am Weltobjekt getrennt gekennzeichnet.

## Status

Unterstützte Statuswerte sind:

- `active`
- `inactive`
- `destroyed`
- `unknown`

Die deutsch- und englischsprachige Oberfläche übersetzt nur die stabilen Schlüssel. Eingegebene Kampagneninhalte werden nicht automatisch übersetzt.

## Suche und Filter

Das kampagnengebundene Weltregister durchsucht Namen, Kurzfassungen und Tags ohne Beachtung der Großschreibung. Zusätzlich kann nach einem der vier Typen gefiltert werden. Die Filterung verändert keine Daten und benötigt keinen externen Dienst.

## Persönliche Bibliothek

Jedes Weltobjekt kann direkt im Weltregister als Favorit gespeichert und dort
auch wieder entfernt werden. Der Favorit ist eine eigenständige Momentaufnahme
ohne Kampagnenbeziehungen. In der Bibliothek kann der Nutzer ihn bewusst als
neues Weltobjekt in eine aktive Kampagne kopieren. Einzelheiten und
Abgrenzungen stehen in [Persönliche Bibliothek](library.md).

## Persistenz und Ereignisse

Weltobjekte können nur innerhalb ihrer Kampagne geladen und verändert werden. Folgende Zustandsänderungen werden zusammen mit dem aktuellen Zustand in einer Datenbanktransaktion gespeichert:

- `ENTITY_CREATED`
- `ENTITY_UPDATED`
- `ENTITY_RELATION_CREATED`
- `ENTITY_RELATION_REMOVED`

Die Ereignisse enthalten technische Identität und Typ des Objekts. Sie bilden die Grundlage für spätere Chronik, Änderungsvorschläge und Konfliktprüfung.

## Validierung

- Name: 1 bis 120 Zeichen
- Kurzfassung: 1 bis 300 Zeichen
- Beschreibung: optional, höchstens 4.000 Zeichen
- Tags: höchstens acht eindeutige Einträge mit jeweils höchstens 40 Zeichen
- Typ und Status: ausschließlich bekannte Schlüssel

## Nächster Ausbau

Regionen, Quests, Handlungsstränge und Wissenseinträge bleiben eigene spätere Aggregate. Als nächster Weltbaustein folgt die Trennung von objektiver Weltwahrheit, Gerüchten, Geheimnissen und Charakterwissen, damit unbekannte Informationen nicht versehentlich in sichtbare Beschreibungen oder spätere Erzählkontexte gelangen.
