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

## Noch nicht enthalten

- Inspirationsbegriffe und Detailfragen
- Zufallsereignisse
- Spannung oder Chaos
- automatische Änderungen an Welt, Wissen oder Handlungssträngen

Orakelergebnisse liefern eine Entscheidungshilfe. Sie verändern andere Kampagnendaten niemals automatisch.
