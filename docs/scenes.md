# Szenen ohne KI

Eine Szene ist die zentrale konkrete Spieleinheit. Der erste vertikale Szenenbaustein beginnt und beendet Szenen vollständig ohne KI, Orakel oder Chat. Die Kampagne und ihr Ereignisprotokoll bleiben die Quelle der Wahrheit.

## Szene beginnen

Beim Start werden Titel, erwartete Ausgangssituation, tatsächlicher Beginn und ein optionales Ziel gespeichert. Zusätzlich können ein Ort, beteiligte Charaktere und Weltobjekte sowie relevante Handlungsstränge derselben Kampagne ausgewählt werden.

Pro Kampagne darf höchstens eine Szene aktiv sein. Diese Invariante wird sowohl im Service als auch durch einen partiellen eindeutigen SQLite-Index geschützt. Ein gleichzeitiger zweiter Start kann dadurch keinen ungültigen Zustand erzeugen.

## Szene abschließen

Eine aktive Szene wird mit einer vom Benutzer bearbeiteten Zusammenfassung abgeschlossen. Abschlussstatus, Zusammenfassung und reale Endzeit werden atomar gespeichert. Einzelne Veränderungen an Weltobjekten, Wissen oder Handlungssträngen bleiben eigenständige Aktionen und werden nicht aus freiem Zusammenfassungstext abgeleitet.

## Spielprotokoll und Proben

Aktive Szenen besitzen ein zeitlich geordnetes Spielprotokoll. `SceneMessage` bildet den fortlaufenden Szenendialog ab und unterscheidet manuelle Spieler- und Erzählerbeiträge. Diese Trennung ist unabhängig von späteren Anbieterrollen; die Quelle wird separat gespeichert, sodass zukünftig manuelle und KI-erzeugte Erzählbeiträge erkennbar bleiben. Freie Einträge unterscheiden ergänzend dauerhafte Handlungen und Beobachtungen.

Proben werden ausschließlich von der W6-Pool-Regel-Engine ausgewertet: Charakter, Handlung, Schwierigkeit, passender Archetyp, passende Eigenschaft sowie je ein optionaler Vor- und Nachteil bilden die Eingabe. Gespeichert werden die vollständige Eingabe, Würfel, Schwelle, Erfolge, Erfolgsgrad, Modifikatoren, Erklärung sowie ID und Version des verwendeten Regelwerks. Eine passende Eigenschaft muss tatsächlich zum handelnden, an der Szene beteiligten Charakter gehören.

Start, Nachricht, Protokolleintrag, Probe und Abschluss erzeugen `SCENE_STARTED`, `SCENE_MESSAGE_ADDED`, `SCENE_NOTE_ADDED`, `DICE_ROLLED` und `SCENE_COMPLETED`. Die Chronik zeigt sie in der Kategorie „Szenen“. Orakel, Spielzeit und KI-erzeugte Erzählantworten folgen in späteren Arbeitspaketen.
