D100 DungeonScribe – macOS-Testpaket
====================================

Dieses Paket enthält die benötigte Node-Laufzeit. npm, Node.js oder andere
Build-Werkzeuge müssen auf dem Mac nicht installiert sein.

Start
-----

1. Das passende Paket vollständig entpacken.
2. "Start.command" mit einem Doppelklick öffnen.
3. Falls macOS den ersten Start blockiert: Rechtsklick auf "Start.command",
   dann "Öffnen" wählen und den Start bestätigen.
4. Der Browser öffnet sich automatisch.
5. Zum Beenden im geöffneten Terminalfenster Ctrl+C drücken.

Nach der Bestätigung entfernt das Startskript die Download-Quarantäne nur aus
diesem entpackten Paketordner. Dadurch kann macOS das enthaltene SQLite-Modul
laden. Andere Ordner oder Downloads werden nicht verändert.

Private Daten
-------------

Die Datenbank wird ausschließlich hier gespeichert:

  ~/Library/Application Support/D100 DungeonScribe/dungeonscribe.db

Sie ist nicht Bestandteil des Programmpakets und wird nicht an GitHub oder
andere Dienste übertragen. API-Schlüssel sind in diesem Testpaket nicht
enthalten.

Architektur
-----------

"Apple-Silicon" ist für Macs mit M1, M2, M3, M4 oder neuer.
"Intel" ist für ältere Macs mit Intel-Prozessor.

Hinweis
-------

Dies ist ein nicht signierter Entwicklungsbuild und keine fertige
Produktveröffentlichung.
