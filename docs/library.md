# Persönliche Bibliothek

## Ziel

Die Bibliothek bewahrt wiederverwendbare Bausteine unabhängig von einer
einzelnen Kampagne auf. Der erste vertikale Baustein unterstützt Personen, Orte,
Fraktionen und Gegenstände aus dem Weltregister. Regeln, Kampagnenvorlagen und
Orakeltabellen können später demselben Muster folgen.

## Schnappschüsse statt Verknüpfungen

Ein Favorit ist eine vollständige, validierte Momentaufnahme des Weltobjekts zum
Zeitpunkt des Speicherns. Er enthält weder die Kampagnen-ID noch Beziehungen,
Inventarzuordnungen oder technisches Ereignisprotokoll.

Die Momentaufnahme bleibt bestehen, wenn:

- das ursprüngliche Weltobjekt später bearbeitet wird,
- die Ursprungskampagne archiviert wird oder
- die Ursprungsdaten künftig gelöscht werden.

Das bewahrt einen bewusst ausgewählten Baustein vor unbeabsichtigten
Änderungen. Erneutes Merken desselben Ursprungsobjekts aktualisiert dessen
vorhandenen Favoriten, statt einen doppelten Eintrag anzulegen.

## Übernahme in eine Kampagne

Ein Favorit wird nie automatisch Kampagnenzustand. Der Nutzer wählt in der
Bibliothek ausdrücklich eine aktive Zielkampagne aus und legt dort eine Kopie
an. Diese Kopie erhält eine neue Identität und wird wie jedes manuell erstellte
Weltobjekt zusammen mit einem `ENTITY_CREATED`-Ereignis gespeichert.

Die Kopie besitzt keine dauerhafte Synchronisation mit dem Favoriten. Spätere
Änderungen auf beiden Seiten bleiben voneinander unabhängig. Beziehungen und
Inventarzuordnungen müssen in der Zielkampagne bewusst neu hergestellt werden,
weil ihre Referenzen kampagnengebunden sind.

## Datenschutz

Die Bibliothek liegt ausschließlich in derselben lokalen Datenbank wie die
übrigen Anwendungsdaten. Es gibt keine Telemetrie, automatische
Cloud-Synchronisierung oder Übertragung an einen KI-Anbieter. API-Schlüssel,
Profilgeheimnisse und unverbundene Kampagneninhalte sind kein Bestandteil eines
Favoriten.

## Verifikation

Unit- und Repository-Tests sichern Snapshotbildung, Auflösung der gespeicherten
Ursprungs-IDs, Entfernen sowie das Kopieren in aktive Kampagnen ab. Der
End-to-End-Test merkt einen Gegenstand im Weltregister, übernimmt ihn über die
Bibliothek und prüft die neu angelegte Kampagnenkopie samt Persistenz im
macOS-Testpaket.
