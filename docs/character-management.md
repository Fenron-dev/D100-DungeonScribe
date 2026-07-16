# Charakterverwaltung

## Umfang Phase 4

Der erste Charakterbaustein liefert ein vollständiges, aber bewusst kleines Kernprofil innerhalb einer Kampagne:

- Name
- frei formuliertes Charakterkonzept
- einer der drei stabilen Archetypen `powerful`, `agile` oder `insightful`
- eine bis drei frei formulierte, eindeutige Eigenschaften
- optionale Schwäche
- optionale Notizen

Die deutschsprachige Oberfläche zeigt die Archetypen als **Kraftvoll**, **Beweglich** und **Scharfsinnig**. Persistiert werden sprachneutrale Schlüssel, damit weitere Oberflächensprachen und kampagnenspezifische Anzeigenamen später möglich bleiben.

## Benutzerablauf

Auf der Kampagnenseite werden alle zugehörigen Charaktere angezeigt. In aktiven Kampagnen kann ein neues Kernprofil angelegt werden. Bestehende Charaktere können über ihre Karte bearbeitet werden.

Erstellen und Bearbeiten werden serverseitig validiert. Zustandsänderung und Kampagnenereignis werden in derselben Datenbanktransaktion gespeichert:

- `CHARACTER_CREATED`
- `CHARACTER_UPDATED`

Ein Charakter kann nicht über die URL einer anderen Kampagne geladen oder verändert werden.

## Validierung

- Namen: 1 bis 100 Zeichen
- Konzept: 1 bis 500 Zeichen
- Eigenschaften: 1 bis 3 Einträge, jeweils höchstens 60 Zeichen und ohne Duplikate
- Schwäche: optional, höchstens 120 Zeichen
- Notizen: optional, höchstens 4.000 Zeichen

Eingaben werden getrimmt. Leere optionale Felder werden stabil normalisiert, sodass eine erneute Validierung bereits geprüfter Daten dasselbe Ergebnis liefert.

## Bewusst vertagt

Die folgenden Bestandteile des Zielmodells werden in eigenen vertikalen Arbeitspaketen ergänzt:

- konfigurierbare Ressourcen und aktuelle Ressourcenwerte
- Zustände und deren Schwere
- Inventar
- Fortschritt und Entwicklungen
- Verknüpfung des Charakters mit Würfelproben und Szenen
- kampagnenspezifische Anzeigenamen für Archetypen
