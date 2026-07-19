# Produktvision: Spielen statt verwalten

## Leitgedanke

D100 DungeonScribe ist eine private Solo-Rollenspielplattform. Der Spielchat ist
der Mittelpunkt. Eine Idee oder ein einziger Satz muss genügen, um ein neues
Abenteuer zu beginnen oder eine bestehende Kampagne weiterzuführen. Formulare
bleiben als freiwillige Detailansicht erhalten, dürfen den Spielfluss aber nicht
voraussetzen.

Es wird nur festgelegt, was für die nächste Spielsituation benötigt wird. Welt,
Charaktere, Regeln und Handlungsstränge dürfen während des Spiels gemeinsam mit
der KI entdeckt und entwickelt werden.

## Zielablauf

1. Auf der Startseite stehen **Spiel fortsetzen**, **Neues Abenteuer** und
   **Überrasch mich** im Vordergrund.
2. Für ein neues Abenteuer genügt eine Prämisse. Alternativ erzeugt die KI einen
   vollständigen Vorschlag.
3. Vor dem Speichern zeigt die App eine bearbeitbare Vorschau mit
   **Übernehmen**, **Anpassen** und **Neu erzeugen**.
4. Danach beginnt unmittelbar die erste Szene im Spielchat.
5. Erzählung, freie Spielereingaben, optionale Handlungsvorschläge, Würfe und
   Orakel bleiben auf derselben Spieloberfläche.
6. Die KI erkennt mögliche neue Personen, Orte, Gegenstände, Regeln,
   Erkenntnisse und Handlungsstränge. Sie legt sie nicht verbindlich an, sondern
   zeigt zunächst kleine Vorschlagskarten im Spiel.
7. Harmlose Vorschlagsarten können später auf Wunsch automatisch übernommen
   werden. Wichtige mechanische Änderungen bleiben bestätigungspflichtig.

## Kampagnenstart

Der schnelle Einstieg bietet drei Wege:

- **Überrasch mich:** Die KI schlägt alles Nötige vor.
- **Aus meiner Idee:** Ein Satz wird zu Kampagnenentwurf und Startszene.
- **Detailliert erstellen:** Alle Angaben können bewusst selbst gesetzt werden.

Über eine Vorlage oder einen KI-Vorschlag werden zentrale Spielparameter
vorbelegt. Eigene Vorlagen können später gespeichert werden. Die wichtigsten
Einstellungen sind direkt sichtbar, weitere Details bleiben aufklappbar.

Vorgesehene unabhängige Achsen sind unter anderem:

- hoffnungsvoll bis trostlos
- ernst bis humorvoll
- bodenständig bis überdreht
- persönlich bis episch
- entspannt bis actionreich
- friedlich bis kampfbetont
- Slice of Life bis großes Abenteuer
- geringe bis hohe Gegnerdichte
- erzählerisch bis taktisch
- wenig bis viel Farming und Crafting
- seltene Beute bis Beuteüberfluss
- gewöhnliche bis besonders bedeutsame Funde
- geringe bis hohe Gefahr

Grün-Gelb-Rot wird nur dort eingesetzt, wo die Farbe eine verständliche
Intensität oder Gefahr ausdrückt. Jeder Regler besitzt zusätzlich benannte
Endpunkte und einen lesbaren Wert; Bedeutung wird nie allein durch Farbe
vermittelt.

Kampagneneinstellungen bleiben während des Spiels anpassbar. Änderungen wirken
auf kommende Szenen und schreiben vergangene Ereignisse nicht rückwirkend um.

## Zukunftsideen

Eine Kampagne kann unverbindliche Wünsche für ihren späteren Verlauf speichern,
zum Beispiel einen besonderen Fund, eine erlernbare Fähigkeit oder eine spätere
Entwicklung. Solche Einträge sind Möglichkeiten, keine bereits wahren Fakten.

Später sollen sie optional Angaben zu Zeitpunkt, Genauigkeit und Überraschung
erhalten. Die KI darf sie vorbereiten und passend einbauen, aber nicht erzwingen.

## Vorlagen, Favoriten und persönliche Bibliothek

Kampagneneinstellungen, Regeln, Gegenstände, Personen- und Kreaturentypen,
Orte, Fraktionen sowie Orakeltabellen können als Favoriten markiert und in
anderen Kampagnen wiederverwendet werden. Die KI darf passende Favoriten
vorschlagen, übernimmt sie aber nicht ungefragt.

## Abenteuermodule

Ein späterer Import liest ein vom Nutzer selbst ausgewähltes PDF, Dokument oder
Textmodul ein. Die KI extrahiert Orte, Personen, Begegnungen, Gerüchte, Tabellen,
Regeln und Handlungsabschnitte in eine prüfbare Vorschau. Unklare oder
widersprüchliche Angaben werden markiert. Erst eine Bestätigung macht daraus
Kampagnenzustand.

Der Import bietet die Modi **originalgetreu spielen** und **als Inspiration
verwenden**. Jeder Nutzer stellt seine Module selbst bereit; sie gehören nicht
zum ausgelieferten Programm.

## Datenschutz und öffentliche Builds

Das öffentliche GitHub-Repository enthält ausschließlich Programmcode,
Dokumentation und Build-Workflows. Persönliche Inhalte gehören in den Vault des
Nutzers und niemals in das Repository.

- Vault, Datenbanken, Speicherstände und importierte Module liegen außerhalb des
  Projektordners.
- Keine Telemetrie und keine automatische Cloud-Synchronisierung.
- GitHub-Zugangsdaten werden niemals gespeichert. KI-Anbieterschlüssel werden
  ausschließlich kennwortverschlüsselt im lokalen Profilfach abgelegt und nie
  protokolliert oder exportiert.
- Eine Übertragung von Modul- oder Kampagneninhalten an einen KI-Anbieter wird
  vorher sichtbar gemacht und benötigt die Zustimmung des Nutzers.
- Private Sicherungen sind optional und vom öffentlichen Quellcode getrennt.
- Eine spätere GitHub-Sicherung verwendet exportierte Kampagnenpakete statt der
  laufenden Datenbank. Geheimnisse werden ausdrücklich ausgeschlossen.

## App-Kennwort und KI-Profile

Beim ersten Start legt der Nutzer ein App-Kennwort fest. Dieses Kennwort wird
nicht gespeichert. Es leitet mit einer speicherharten Ableitung einen Schlüssel
ab, der ausschließlich im Arbeitsspeicher gehalten wird. Anbieterprofile werden
authentifiziert mit AES-256-GCM verschlüsselt in den lokalen Einstellungen
gespeichert.

Nach einem Neustart ist die App gesperrt. Ein Zurücksetzen bei vergessenem
Kennwort löscht ausschließlich die verschlüsselten KI-Profile; Kampagnen bleiben
erhalten. Die erste Ausbaustufe verschlüsselt nicht die Kampagnendatenbank selbst.

Unterstützte Profilarten sind OpenAI, OpenRouter, Groq, Ollama und LM Studio.
Mehrere Profile desselben Anbieters sind erlaubt. Lokale HTTP-Adressen sind nur
für Loopback-Ziele zulässig; entfernte Anbieter benötigen HTTPS. Das aktive
Profil wird für kreative Entwürfe und die KI-Erzählung verwendet.

ChatGPT- und Codex-Abonnements sind keine Zugangsdaten für die separat
abgerechnete OpenAI API und werden nicht über inoffizielle Sitzungstokens
eingebunden. OpenRouter-Profile können ihren validierten Modellkatalog laden.
Die Oberfläche filtert auf Wunsch kostenlose Modelle mit strukturierten
Ausgaben und bietet `openrouter/free` als robusten Test-Router an. Geladene
Modelle werden in einer sichtbaren Auswahl angeboten; ein nicht erreichbarer
Katalog wird ausdrücklich angezeigt.

## Mobile Oberfläche

Die Spieloberfläche wird responsiv und mit berührungsfreundlichen Bedienelementen
entwickelt. Der aktuelle Next.js-Client kann deshalb bereits im mobilen Browser
verwendet werden, sobald der lokale App-Server für das Gerät erreichbar ist.
Für eine installierbare, vollständig lokale Mobile-App müssen die derzeitigen
Server-Annahmen und der lokale Speicher zunächst hinter stabilen Ports gekapselt
werden. Danach kann dieselbe Web-Oberfläche als PWA oder in einer dünnen nativen
Hülle weiterverwendet werden. So bleiben Spielfluss und Übersetzungen gemeinsam.

Ein eigenständiger Flutter-Client bleibt möglich, ist aber erst sinnvoll, wenn
native Funktionen den Aufwand einer zweiten Benutzeroberfläche rechtfertigen.
Er würde dieselben Anwendungsfälle über eine eigene lokale API beziehungsweise
einen stabilen Client-Port verwenden und nicht direkt auf die Datenbank zugreifen.

## Umsetzungsreihenfolge

1. Klarer Spielstart und zentraler Spielbereich
2. Kampagnenvorlagen, zentrale Regler, KI-Vorschläge und Zukunftsideen
3. KI-Entwurf einer prüfbaren Startszene
4. Vorschlagskarten aus Chat, Würfen und Nutzerinterpretationen
5. Favoriten- und Bausteinbibliothek
6. Optionaler, prüfbarer Modulimport
