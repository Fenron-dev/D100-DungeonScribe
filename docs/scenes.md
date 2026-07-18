# Szenen ohne KI

Eine Szene ist die zentrale konkrete Spieleinheit. Der erste vertikale Szenenbaustein beginnt und beendet Szenen vollständig ohne KI, Orakel oder Chat. Die Kampagne und ihr Ereignisprotokoll bleiben die Quelle der Wahrheit.

## Szene beginnen

Beim Start werden Titel, erwartete Ausgangssituation, tatsächlicher Beginn und ein optionales Ziel gespeichert. Zusätzlich können ein Ort, beteiligte Charaktere und Weltobjekte sowie relevante Handlungsstränge derselben Kampagne ausgewählt werden.

Pro Kampagne darf höchstens eine Szene aktiv sein. Diese Invariante wird sowohl im Service als auch durch einen partiellen eindeutigen SQLite-Index geschützt. Ein gleichzeitiger zweiter Start kann dadurch keinen ungültigen Zustand erzeugen.

## Szene abschließen

Eine aktive Szene wird mit einer vom Benutzer bearbeiteten Zusammenfassung abgeschlossen. Abschlussstatus, Zusammenfassung und reale Endzeit werden atomar gespeichert. Einzelne Veränderungen an Weltobjekten, Wissen oder Handlungssträngen bleiben eigenständige Aktionen und werden nicht aus freiem Zusammenfassungstext abgeleitet.

Beim Abschluss entscheidet der Spieler außerdem, ob die Kampagnenspannung um eine Stufe sinkt, gleich bleibt oder steigt. Der Wert bleibt zwischen 1 und 6. Eine tatsächliche Änderung wird in derselben Transaktion gespeichert und durch `TENSION_CHANGED` nachvollziehbar; die Zusammenfassung selbst verändert keine weiteren Weltobjekte.

## Spielprotokoll und Proben

Aktive Szenen besitzen ein zeitlich geordnetes Spielprotokoll. `SceneMessage` bildet den fortlaufenden Szenendialog ab und unterscheidet Spieler- und Erzählerbeiträge. Die Quelle bleibt separat gespeichert, sodass manuelle und KI-erzeugte Erzählbeiträge erkennbar sind. Freie Einträge unterscheiden ergänzend dauerhafte Handlungen und Beobachtungen.

Die KI-Erzählung wird nur durch eine bewusste Benutzeraktion ausgelöst. Sie erhält einen minimalen Szenenkontext ohne Wissenseinträge oder Charakternotizen und darf weder Spielerhandlungen bestimmen noch Würfel- oder Regelergebnisse erfinden. Nach strukturierter Validierung wird die Antwort als reiner Erzählertext mit Quelle `ai` gespeichert; daraus folgen keine Weltänderungen.

Proben werden ausschließlich von der W6-Pool-Regel-Engine ausgewertet: Charakter, Handlung, Schwierigkeit, passender Archetyp, passende Eigenschaft sowie je ein optionaler Vor- und Nachteil bilden die Eingabe. Gespeichert werden die vollständige Eingabe, Würfel, Schwelle, Erfolge, Erfolgsgrad, Modifikatoren, Erklärung sowie ID und Version des verwendeten Regelwerks. Eine passende Eigenschaft muss tatsächlich zum handelnden, an der Szene beteiligten Charakter gehören.

Start, manuelle Nachricht, KI-Erzählung, Protokolleintrag, Probe, Orakelfrage, Inspiration, unerwartetes Ereignis, Spannungsänderung und Abschluss erzeugen `SCENE_STARTED`, `SCENE_MESSAGE_ADDED`, `AI_NARRATION_GENERATED`, `SCENE_NOTE_ADDED`, `DICE_ROLLED`, `ORACLE_ANSWERED`, `ORACLE_INSPIRATION_DRAWN`, `ORACLE_RANDOM_EVENT_GENERATED`, `TENSION_CHANGED` und `SCENE_COMPLETED`. Die Chronik zeigt sie in der Kategorie „Szenen“.
