# Domainmodell

## Aggregatgrenzen

Die Kampagne ist der fachliche Hauptkontext, aber nicht ein einzelnes, vollständig in den Speicher geladenes Objekt. Persistenz und Services behandeln Teilaggregate mit klaren Invarianten.

### Campaign

Besitzt Identität, Metadaten, Status, Prämisse, aktive Regeln, Spielzeit und Spannung. Eine Kampagne referenziert ihre Charaktere, Szenen, Entitäten, Wissenseinträge und Ereignisse.

### Ruleset

Eine versionierte, validierte Konfiguration bekannter Regelbausteine. Eine laufende Kampagne erhält eine stabile Momentaufnahme beziehungsweise eine eindeutig versionierte Referenz, damit spätere Bibliotheksänderungen laufende Spielstände nicht unbemerkt verändern.

### Character

Enthält Konzept, Archetyp, Eigenschaften, optionale Schwäche, Ressourcen, Zustände, Inventar und Notizen. Ressourcenwerte müssen innerhalb ihrer Definition liegen.

Der erste vertikale Charakterbaustein speichert Name, Konzept, einen der stabilen Archetypschlüssel `powerful`, `agile` oder `insightful`, eine bis drei eindeutige Eigenschaften, eine optionale Schwäche und Notizen. Ressourcen, Zustände und Inventar werden in nachfolgenden Arbeitspaketen ergänzt. Erstellen und Bearbeiten erzeugen jeweils atomar ein `CampaignEvent`.

### Scene

Ist die zentrale Spieleinheit. Sie besitzt Status, Ausgangslage, Ort, Beteiligte, relevante Handlungsstränge, Nachrichten, Würfe, Ereignisse und eine optionale Zusammenfassung. Pro Kampagne darf im MVP höchstens eine Szene aktiv sein.

Der Szenenbaustein unterstützt aktive und abgeschlossene Szenen. Er speichert erwartete und tatsächliche Ausgangslage getrennt, ein optionales Ziel, Ort, Charaktere, Weltobjekte und relevante Handlungsstränge sowie die bearbeitbare Abschlusszusammenfassung. Alle Referenzen müssen zur selben Kampagne gehören; der Ort muss ein Weltobjekt des Typs `location` sein. Ein partieller eindeutiger Datenbankindex erzwingt höchstens eine aktive Szene. `SceneMessage` speichert den fortlaufenden Dialog mit fachlicher Rolle und Quelle, Handlungen und Beobachtungen werden ergänzend als `SceneNote` gespeichert. `DiceRoll` hält vollständige Regel-Eingabe und -Ausgabe sowie ID und Version des Regelwerks fest. Jede dieser Zustandsänderungen erzeugt atomar ein eigenes Kampagnenereignis.

`OracleRecord` speichert eine Ja-Nein-Frage mit Wahrscheinlichkeit, beiden Rohwürfeln, Rohsumme, Modifikator, begrenztem Endwert, Antwort und Pasch-Markierung. Damit bleibt das Ergebnis erklärbar und kann später als geprüfter Auslöser für Zufallsereignisse dienen.

`OracleInspiration` speichert eine optionale Detailfrage sowie zwei Kategorien und stabile Begriffsschlüssel. `OracleRandomEvent` hält einen optionalen Kontext, den manuellen Auslöser, einen Ereignisschwerpunkt sowie stabile Handlungs- und Gegenstandsschlüssel fest. Beide Modelle speichern Orakeldeutungen, aber keine automatisch übernommenen Weltänderungen.

`OracleInspiration` speichert eine optionale Detailfrage, zwei Inspirationskategorien und zwei stabile Begriffsschlüssel. Die Begriffe werden nicht als übersetzter Text persistiert; damit bleibt die Ziehung sprachunabhängig. Kategorien und Schlüssel werden beim Lesen validiert.

### World Entity

Gemeinsame Basis für NPC, Ort, Region, Fraktion, Gegenstand, Quest und weitere definierte Typen. Kernfelder bleiben strukturiert; typspezifische Zusatzdaten werden separat validiert.

Die vertikalen Weltobjektbausteine unterstützen die Typen `npc`, `location`, `faction` und `item`. Gemeinsame strukturierte Felder sind Name, Kurzfassung, optionale Beschreibung, bis zu acht Tags und der Status `active`, `inactive`, `destroyed` oder `unknown`. Typspezifisch werden Rolle und Motivation, Region und Atmosphäre, Ziel und Einfluss beziehungsweise Zweck und Seltenheit validiert gespeichert. Das Weltregister kann nach Name, Kurzfassung und Tags durchsucht sowie nach Typ gefiltert werden. Erstellen und Bearbeiten erzeugen atomar ein Kampagnenereignis.

Weltobjektbeziehungen sind gerichtete Datensätze mit Quelle, Ziel, stabilem Typ, optionaler Beschreibung und Status. Beide Enden müssen zur gleichen Kampagne gehören; Selbstbeziehungen und doppelte Kombinationen aus Quelle, Ziel und Typ sind unzulässig. Erstellen und Entfernen werden atomar als eigene Kampagnenereignisse protokolliert.

### KnowledgeEntry

Trennt Weltwahrheit von bekanntem oder vermutetem Wissen. Ein Eintrag besitzt Typ, Wahrheitsstatus, Wissende, Beziehungen, Quelle und Sperrstatus.

Der erste vertikale Wissensbaustein speichert alle sechs Wissensarten, einen der vier Wahrheitswerte, eine explizite Liste wissender Charaktere, Verknüpfungen zu Weltobjekten und den Fixierungsstatus. Leere Wissendenlisten bedeuten ausdrücklich, dass kein Charakter den Eintrag kennt. Referenzierte Charaktere und Weltobjekte müssen zur gleichen Kampagne gehören. Erstellen und manuelles Bearbeiten erzeugen atomar `KNOWLEDGE_DISCOVERED` beziehungsweise `KNOWLEDGE_UPDATED`; der Erstellungsdatensatz verweist auf sein Quellereignis.

### StoryThread

Beschreibt einen offenen, ruhenden, gelösten oder gescheiterten Handlungsstrang mit Dringlichkeit, Fortschritt und möglichen Entwicklungen.

Der erste vertikale Baustein begrenzt Dringlichkeit auf 1 bis 5 und Fortschrittsuhren auf maximal 12 Schritte. Der aktuelle Wert darf das Ziel nicht überschreiten. Bis zu fünf mögliche Entwicklungen bleiben ausdrücklich Optionen und werden nicht als Fakten behandelt. Referenzierte Weltobjekte müssen zur selben Kampagne gehören. Erstellen und Bearbeiten erzeugen atomar `THREAD_CREATED` beziehungsweise `THREAD_UPDATED`.

### CampaignEvent

Unveränderlicher Nachweis einer verbindlichen Änderung. Korrekturen erzeugen neue Ereignisse, statt historische Ereignisse still zu überschreiben.

Die Chronik liest Ereignisse ausschließlich und ordnet bekannte Ereignistypen stabil den Bereichen Kampagne, Charaktere, Weltregister und Wissen zu. Die Benutzeroberfläche zeigt keine Payloads oder internen Identitäten. Ein als reversibel markiertes Ereignis wird nicht verändert oder gelöscht; eine spätere Korrektur muss als neues Ereignis erfolgen.

## Identitäten und Zeit

- IDs sind undurchsichtige Strings und tragen keine Fachlogik.
- Persistierte Zeitpunkte verwenden ISO-8601 in UTC.
- Spielzeit ist eine separate fachliche Angabe und darf nicht mit realer Zeit vermischt werden.
- Erstell- und Änderungszeitpunkte sind Infrastrukturmetadaten.

## Wissen und Sichtbarkeit

Unterstützte Wissensarten:

```ts
type KnowledgeType =
  | "fact"
  | "character_knowledge"
  | "rumor"
  | "secret"
  | "assumption"
  | "memory";
```

Unterstützte Wahrheitswerte:

```ts
type TruthStatus = "true" | "false" | "partially_true" | "unknown";
```

Invarianten:

- Geheimnisse gelangen nicht in den Spielerwissenskontext, solange der Charakter sie nicht entdeckt hat.
- Ein fixierter Eintrag darf nicht automatisch geändert oder gelöscht werden.
- Eine Entdeckung erzeugt ein Ereignis und aktualisiert explizit die Sichtbarkeit.
- Spieler- oder Charaktervermutungen werden nicht allein durch Wiederholung zu Fakten.

## Ereignisse und Zustandsänderungen

Jede verbindliche Änderung wird durch einen Anwendungsservice ausgeführt und als Ereignis protokolliert. Typischer Ablauf:

```text
Befehl
-> Eingabe validieren
-> aktuellen Zustand laden
-> Invarianten prüfen
-> neuen Zustand und Ereignis bestimmen
-> beides atomar speichern
```

Ereignisquellen sind `player`, `rule_engine`, `oracle`, `ai` und `manual`. `ai` bezeichnet nur einen vom Benutzer oder einer expliziten Regel übernommenen KI-Vorschlag, niemals eine ungeprüfte Modellantwort.

## KI-Änderungsvorschläge

Ein `WorldChangeProposal` ist kein Kampagnenereignis und verändert keinen Zustand. Jeder Vorschlag enthält mindestens:

- Operation
- Zielobjekt und Feld
- erwarteten bisherigen Wert
- vorgeschlagenen neuen Wert
- Begründung
- Quelle

Vor Übernahme wird geprüft:

- existiert das Zielobjekt noch?
- entspricht der aktuelle dem erwarteten Wert?
- verletzt die Änderung eine Invariante oder einen fixierten Fakt?
- ist für diese Änderung eine Bestätigung erforderlich?

Erst die erfolgreiche Übernahme erzeugt ein Ereignis.

## Beziehungen

Beziehungen sind explizite Datensätze statt frei interpretierter ID-Listen, sobald sie eigene Bedeutung oder Metadaten besitzen. Sie können Richtung, Typ, Beschreibung und Status tragen. Denormalisierte ID-Listen sind nur zulässig, wenn sie als abgeleitete Daten behandelt werden.

## Regeln als Daten

Rulesets enthalten ausschließlich bekannte, schema-validierte Bausteine. Sie dürfen keine JavaScript-Fragmente, Templates mit Codeausführung oder freie Skripte enthalten. Kampagnenüberschreibungen werden vor Aktivierung zu einer vollständigen effektiven Konfiguration aufgelöst und validiert.

## Export und Import

Ein vollständiger Kampagnenexport umfasst mindestens:

- Format- und Schemaversion
- Kampagne und effektives Ruleset
- Charaktere und Weltobjekte
- Beziehungen und Wissen
- Szenen, Nachrichten und Würfe
- Ereignisprotokoll
- Tabellen und kampagnengebundene Vorlagen

Importe erhalten neue interne IDs, wenn sie mit vorhandenen Daten kollidieren. Referenzen werden konsistent umgeschrieben. Unbekannte Schemaversionen werden nicht stillschweigend importiert.

## Referenzkampagne

„Die Straßen im Nebel“ ist die gemeinsame fachliche Testkampagne. Ihre Namen und Ausgangsdaten dürfen in Beispielen, Fixtures, Seeds und UI-Tests verwendet werden, ohne als fest verdrahtete Produktdaten in der Domain zu landen.
