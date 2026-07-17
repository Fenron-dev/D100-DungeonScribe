# Handlungsstränge

Handlungsstränge halten offene Fragen, Bedrohungen und Entwicklungen einer Kampagne strukturiert fest. Sie sind keine bereits eingetretenen Fakten: insbesondere die möglichen nächsten Entwicklungen bleiben ausdrücklich Optionen.

## Struktur

Ein Handlungsstrang besitzt:

- Titel, Ausgangslage und optionale Beschreibung
- Status `open`, `dormant`, `resolved` oder `failed`
- Dringlichkeit von 1 bis 5
- aktuellen Fortschritt und Zielwert von höchstens 12
- optionale Verknüpfungen zu Weltobjekten derselben Kampagne
- bis zu fünf mögliche nächste Entwicklungen

Der aktuelle Fortschritt darf das Ziel nicht überschreiten. Verknüpfte Weltobjekte werden vor dem Speichern auf Kampagnenzugehörigkeit geprüft.

## Ereignisse

Erstellen und Bearbeiten erfolgen gemeinsam mit `THREAD_CREATED` beziehungsweise `THREAD_UPDATED` in einer Datenbanktransaktion. Die Chronik ordnet beide Ereignisse der eigenen Kategorie „Handlungsstränge“ zu. Automatische oder KI-generierte Entwicklungen verändern einen Handlungsstrang später nicht direkt, sondern müssen zuerst als Vorschlag bestätigt werden.
