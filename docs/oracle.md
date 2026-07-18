# Solo-Orakel

Das Solo-Orakel entscheidet offene Ja-Nein-Fragen ohne KI und ohne versteckten Zufall. Es ist reine, mit einer `RandomSource` versorgte Domainlogik und kennt weder Oberfläche noch Datenbank.

## Ja-Nein-Fragen

Der Spieler stellt innerhalb einer aktiven Szene eine eindeutige Frage und wählt die Wahrscheinlichkeit eines Ja:

- nahezu unmöglich: −4
- unwahrscheinlich: −2
- ausgeglichen: ±0
- wahrscheinlich: +2
- nahezu sicher: +4

Die Engine würfelt 2W6, addiert den Modifikator und begrenzt den Endwert auf 2 bis 12. Die Tabelle unterscheidet „Nein, und“, „Nein“, „Nein, aber“, „Ungewiss“, „Ja, aber“, „Ja“ und „Ja, und“.

## Nachvollziehbarkeit und Speicherung

Gespeichert werden Frage, Wahrscheinlichkeit, beide Würfel, Rohsumme, Modifikator, Endwert, Antwort und Pasch-Markierung. Das Ergebnis erscheint chronologisch im Spielprotokoll und erzeugt atomar `ORACLE_ANSWERED` mit der Quelle `oracle`. Ein Pasch löst in diesem Arbeitspaket noch kein Zufallsereignis aus; die Markierung bereitet diesen späteren Baustein lediglich vor.

## Offene Inspiration und Detailfragen

Für eine offene Inspiration wählt der Spieler zwei Kategorien aus: Handlung, Thema, Stimmung, Person, Gegenstand, Ort, Gefahr, Entdeckung oder Komplikation. Eine optionale Detailfrage gibt dem Begriffspaar einen konkreten Bezug. Beide Begriffe werden unabhängig über die injizierte Zufallsquelle aus validierten Tabellen gezogen.

Gespeichert werden die optionale Frage, beide Kategorien und stabile Begriffsschlüssel. Die sichtbare Übersetzung erfolgt erst in der Oberfläche, sodass dieselbe Ziehung auch nach einem Sprachwechsel erhalten bleibt. Das Ereignis `ORACLE_INSPIRATION_DRAWN` wird atomar mit dem Ergebnis gespeichert. Inspirationen sind Deutungshilfen und erzeugen keine Fakten oder Weltänderungen.

## Unerwartete Ereignisse

Ein unerwartetes Ereignis kann in einer aktiven Szene bewusst erzeugt werden. Ein optionaler Kontext rahmt die Deutung ein. Das Orakel zieht unabhängig aus drei stabilen Tabellen:

- einen Schwerpunkt wie entfernte Bedrohung, neue oder bestehende Person, Fraktionshandlung, Entwicklung oder Verschärfung eines Handlungsstrangs, Gelegenheit, Ressourcenverlust oder Entdeckung
- eine Handlung
- einen Gegenstand der Handlung

Gespeichert werden Kontext, Auslöser, Schwerpunkt und beide Begriffsschlüssel. Die Auswertung enthält zusätzlich die gezogenen Tabellenpositionen und Tabellengrößen. Das Ergebnis erscheint als `ORACLE_RANDOM_EVENT_GENERATED` im Szenenjournal und in der Chronik. Es ist eine Deutungshilfe: Selbst ein Schwerpunkt wie „Handlungsstrang verschärft sich“ ändert keinen Handlungsstrang automatisch.

In diesem Arbeitspaket ist die bewusste manuelle Anforderung der einzige aktive Auslöser. Pasch, kritischer Fehlschlag und hohe Spannung sind als spätere Auslöser vorgesehen. Dadurch entsteht kein unerwarteter neuer Kampagnenzustand, bevor der Spieler die Wendung gedeutet und ausdrücklich übernommen hat.

## Noch nicht enthalten

- Spannung oder Chaos
- automatische Auslösung durch Pasch, kritischen Fehlschlag oder Spannung
- automatische Änderungen an Welt, Wissen oder Handlungssträngen

Orakelergebnisse liefern eine Entscheidungshilfe. Sie verändern andere Kampagnendaten niemals automatisch.
