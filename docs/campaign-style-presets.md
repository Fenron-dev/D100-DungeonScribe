# Persönliche Spielgefühl-Vorlagen

## Ziel

Persönliche Spielgefühl-Vorlagen speichern eine wiederverwendbare Kombination
der Kampagnenregler. Damit lassen sich Ton, Darstellung, Tempo, Konfliktdichte,
Alltag, Regeldichte, Gefahr sowie Menge und Bedeutung von Loot für neue
Kampagnen schnell vorbelegen.

## Anlegen und Verwenden

Eine Vorlage wird in der persönlichen Bibliothek angelegt. Der Nutzer wählt
zunächst eine der mitgelieferten Vorlagen als Ausgangspunkt, passt die neun
Regler an und vergibt einen eindeutigen Namen. Eine optionale Beschreibung kann
den gewünschten Einsatzzweck festhalten.

Beim Erstellen und Bearbeiten einer Kampagne erscheinen persönliche Vorlagen in
einer eigenen Gruppe unter den mitgelieferten Vorlagen. Die Auswahl übernimmt
eine Kopie der gespeicherten Werte in das Formular. Jeder Regler kann danach
weiter verändert werden.

## Unabhängige Momentaufnahme

Eine Kampagne speichert ihre tatsächlichen Reglerwerte als eigenen Zustand. Sie
referenziert die persönliche Vorlage nicht dauerhaft. Deshalb gilt:

- Änderungen oder Löschen einer Vorlage verändern keine Kampagne.
- Spätere Regleränderungen in einer Kampagne verändern die Vorlage nicht.
- Die mitgelieferte Ausgangsvorlage bleibt als stabiler Schlüssel erhalten,
  während die persönliche Kombination vollständig kopiert wird.

Das Löschen einer Vorlage ist somit sicher für bereits begonnene Kampagnen.

## Datenschutz und Ereignisse

Vorlagen liegen ausschließlich in der lokalen Anwendungsdatenbank und enthalten
keine Kampagneninhalte, API-Schlüssel oder KI-Profile. Das Anlegen und Löschen
ist keine Änderung einer Kampagne und erzeugt daher kein `CampaignEvent`. Erst
das Erstellen oder Bearbeiten einer Kampagne protokolliert deren übernommenen
Reglerzustand nach den bestehenden Kampagnenregeln.

## Verifikation

Schema-, Service- und Repository-Tests sichern Wertebereich, Persistenz und
Löschen ab. Der Browser-Smoke-Test legt eine persönliche Vorlage an, wählt sie
beim Kampagnenstart und prüft den übernommenen Loot-Regler. Der
Apple-Silicon-Testbuild kontrolliert zusätzlich Vorlage und gespeicherten
Kampagnenwert direkt in der gepackten Datenbank.
