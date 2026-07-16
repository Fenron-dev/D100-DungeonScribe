# Regel-Engine

## Zweck und Grenzen

Die Regel-Engine entscheidet verbindlich über mechanische Ergebnisse. Sie ist deterministisch testbar, kennt weder Datenbank noch UI und funktioniert ohne KI.

Sie übernimmt:

- W6-Pool-Proben
- Schwierigkeits- und Modifikatorauswertung
- Erfolgsgrade
- Konsequenzen
- einfache Herausforderungen
- Validierung effektiver Rulesets

Nicht zu ihren Aufgaben gehören Szenenerzählung, Persistenz, Intent-Erkennung und Auswahl relevanter Kampagnendaten.

## Zufallsquelle

Jeder Zufall wird injiziert:

```ts
interface RandomSource {
  nextInt(min: number, max: number): number;
}
```

Die Produktionsimplementierung verwendet eine kryptografisch sichere Quelle. Tests verwenden eine feste Sequenz und müssen auch ungültige oder erschöpfte Testsequenzen verständlich melden.

## Standardprobe

Der Standardwürfelpool beginnt bei einem W6:

- `+1`, wenn der Archetyp passt
- `+1`, wenn mindestens eine Eigenschaft passt
- `+1` je wirksamem Vorteil im MVP
- `-1` je wirksamem Nachteil im MVP
- Begrenzung auf den im Ruleset definierten Minimal- und Maximalwert, standardmäßig 1 bis 3

Mehrere passende Eigenschaften erhöhen den Pool standardmäßig nur einmal. Sie werden trotzdem für Erklärung und spätere Wirkung dokumentiert.

Schwellenwerte:

- leicht: 4 bis 6
- normal: 5 bis 6
- schwer: nur 6

Das Ruleset definiert die tatsächlichen Schwellen. Die Engine darf diese Werte nicht aus sprachlichen Bezeichnungen erraten.

## Erfolgsgrade

Für den MVP gilt die folgende eindeutige Reihenfolge:

- kein Erfolg und mindestens eine gewürfelte 1: `critical_failure`
- kein Erfolg: `failure`
- ein Erfolg: `success`
- zwei Erfolge: `strong_success`
- drei oder mehr Erfolge: `strong_success` mit zusätzlicher Wirkungsstufe

Das bestehende Konzept nennt für drei Erfolge einen „außergewöhnlichen Erfolg“, während der vorgeschlagene Typ nur `strong_success` enthält. Der MVP führt deshalb zusätzlich ein numerisches Feld wie `effectLevel` beziehungsweise `margin` im Ergebnis, statt vorzeitig einen sechsten inkompatiblen Erfolgsgrad einzuführen.

`success_with_cost` entsteht nicht automatisch durch einen Würfelwert. Er ist eine nachgelagerte mechanische Wahl: Nach einem Fehlschlag kann ein entsprechend konfiguriertes Ruleset Erfolg gegen eine konkret angebotene Konsequenz erlauben.

## Ergebnisvertrag

Ein Prüfergebnis enthält mindestens:

```ts
interface CheckResult {
  dice: number[];
  diceCount: number;
  threshold: number;
  successes: number;
  degree: OutcomeDegree;
  effectLevel: number;
  appliedModifiers: Modifier[];
  availableChoices: MechanicalChoice[];
  explanation: string;
}
```

Die Erklärung wird aus strukturierten, lokalisierten Bausteinen erzeugt. Fachliche Ergebnisse bleiben sprachneutral; die Domain speichert keine UI-Sätze als Entscheidungsgrundlage.

## Modifikatoren

Modifikatoren besitzen stabile IDs, Quelle, Art und mechanische Wirkung. Die Engine wendet nur im Ruleset bekannte Modifikatortypen an. Reihenfolge:

1. Basispool bestimmen
2. passende Archetypen- und Eigenschaftsboni bestimmen
3. Vor- und Nachteile anwenden
4. Pool begrenzen
5. Schwelle bestimmen
6. würfeln
7. Erfolge und Grad auswerten
8. mechanische Wahlmöglichkeiten ableiten

Jeder angewandte und jeder wegen einer Begrenzung wirkungslos gebliebene Modifikator muss nachvollziehbar sein.

## Herausforderungen

Erweiterte Herausforderungen besitzen Fortschritt, Zielwert, Gefahr und Gefahrenlimit. Ein Auswertungsschritt darf Fortschritt und Gefahr nicht direkt persistieren; er liefert eine vorgeschlagene Zustandsänderung. Der Anwendungsservice prüft und speichert sie zusammen mit einem Ereignis.

Grundregeln:

- Erfolge erhöhen Fortschritt gemäß Effektstufe.
- Fehlschläge erhöhen Gefahr oder erzeugen eine konfigurierte unmittelbare Konsequenz.
- Werte werden nicht still über ihre Grenzen hinaus erhöht.
- Erreichen des Fortschrittsziels und Erreichen des Gefahrenlimits sind explizite Ergebniszustände.

## Konsequenzen, Ressourcen und Zustände

Konsequenzen sind strukturierte Daten, beispielsweise:

- Ressource verändern
- Zustand hinzufügen oder verschärfen
- Fortschritt oder Gefahr verändern
- Gegenstand verlieren oder beschädigen
- Zeit voranschreiten lassen

Die Engine validiert mechanische Zulässigkeit. Ein Service löst Entitätsreferenzen auf und erzeugt Ereignisse. Erzählerische Konsequenzvorschläge der KI werden niemals direkt als mechanisch gültig angenommen.

## Ruleset-Validierung

Mindestens folgende Fehler werden erkannt:

- ungültige Würfel- oder Poolgrenzen
- Schwellen außerhalb des Würfelbereichs
- doppelte Schlüssel
- Standardwerte außerhalb von Ressourcenbereichen
- unbekannte Modifikator- oder Konsequenztypen
- widersprüchliche Herausforderungslimits
- ungültige Überschreibungen eines Basissystems

Validierung liefert alle sinnvoll unabhängig erkennbaren Fehler mit Pfad und verständlichem Fehlercode, nicht nur den ersten Fehler.

## Testmatrix

Unit-Tests decken mindestens ab:

- Minimal- und Maximalpool
- Archetypbonus und Eigenschaftsbonus
- mehrere Eigenschaften ohne mehrfachen Standardbonus
- Vor- und Nachteile sowie gegenseitige Aufhebung
- jede Schwierigkeit
- kritischen Fehlschlag, Fehlschlag, Erfolg und starken Erfolg
- außergewöhnliche Wirkung bei drei Erfolgen
- freiwilligen Erfolg mit Kosten
- Grenzen von Ressourcen, Fortschritt und Gefahr
- reproduzierbare Würfelsequenzen
- ungültige Rulesets

Property-basierte Tests sind später sinnvoll, aber keine Voraussetzung für den ersten vertikalen Regel-Engine-Baustein.
