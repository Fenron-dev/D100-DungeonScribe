# Kampagnenchronik

Die Chronik ist eine lesbare Ansicht des unveränderlichen `CampaignEvent`-Protokolls. Sie erzeugt keinen zweiten Kampagnenzustand und verändert keine Ereignisse. Der gespeicherte Kampagnenzustand bleibt die Quelle der Wahrheit.

## Sichtbare Informationen

Jeder Chronikeintrag zeigt:

- den fachlichen Bereich
- einen übersetzten Ereignistitel
- die bereits beim Ereignis gespeicherte Zusammenfassung
- realen Zeitpunkt und Quelle
- einen Hinweis, ob die zugrunde liegende Änderung grundsätzlich durch eine neue Änderung korrigierbar ist

Technische Nutzdaten, interne IDs und JSON-Payloads werden nicht in der Oberfläche ausgegeben. Dadurch bleibt die Chronik verständlich und offenbart keine Implementierungsdetails.

## Kategorien

Die Filterung verwendet stabile Ereignispräfixe:

- `CAMPAIGN_*`: Kampagne
- `CHARACTER_*`: Charaktere
- `ENTITY_*`: Weltregister
- `KNOWLEDGE_*`: Wissen

Die ungefilterte Ansicht ist absteigend nach realem Ereigniszeitpunkt sortiert. Filter verändern ausschließlich die Ansicht, niemals das gespeicherte Ereignisprotokoll.
