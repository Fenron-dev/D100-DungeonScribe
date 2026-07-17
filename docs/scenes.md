# Szenen ohne KI

Eine Szene ist die zentrale konkrete Spieleinheit. Der erste vertikale Szenenbaustein beginnt und beendet Szenen vollständig ohne KI, Orakel oder Chat. Die Kampagne und ihr Ereignisprotokoll bleiben die Quelle der Wahrheit.

## Szene beginnen

Beim Start werden Titel, erwartete Ausgangssituation, tatsächlicher Beginn und ein optionales Ziel gespeichert. Zusätzlich können ein Ort, beteiligte Charaktere und Weltobjekte sowie relevante Handlungsstränge derselben Kampagne ausgewählt werden.

Pro Kampagne darf höchstens eine Szene aktiv sein. Diese Invariante wird sowohl im Service als auch durch einen partiellen eindeutigen SQLite-Index geschützt. Ein gleichzeitiger zweiter Start kann dadurch keinen ungültigen Zustand erzeugen.

## Szene abschließen

Eine aktive Szene wird mit einer vom Benutzer bearbeiteten Zusammenfassung abgeschlossen. Abschlussstatus, Zusammenfassung und reale Endzeit werden atomar gespeichert. Einzelne Veränderungen an Weltobjekten, Wissen oder Handlungssträngen bleiben eigenständige Aktionen und werden nicht aus freiem Zusammenfassungstext abgeleitet.

Start und Abschluss erzeugen `SCENE_STARTED` und `SCENE_COMPLETED`. Die Chronik zeigt beide in der Kategorie „Szenen“. Nachrichten, Würfe, Spielzeit und Szenenprüfung durch das Orakel folgen in späteren Arbeitspaketen.
