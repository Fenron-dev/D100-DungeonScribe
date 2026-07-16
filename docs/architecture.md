# Architektur

## Zielbild

D100 DungeonScribe ist eine modulare Einzelbenutzer-Webanwendung. Sie läuft später lokal oder selbst gehostet und benötigt externe Dienste nur für optionale KI-Funktionen.

Die zentrale Architekturentscheidung lautet:

```text
Kampagne
├── Regelsystem
├── Charaktere
├── Weltobjekte und Beziehungen
├── Wissen und Geheimnisse
├── Handlungsstränge
├── Szenen
│   ├── Nachrichten
│   ├── Würfe
│   └── Ereignisse
└── Chronik
```

Der Chat ist eine Ein- und Ausgabeform innerhalb einer Szene. Er ist weder primärer Datenspeicher noch vollständiger KI-Kontext.

## Systemkontext

```text
Browser
  -> Next.js-Anwendung
     -> Anwendungsservices
        -> Domain, Regeln und Orakel
        -> Repository-Ports -> Prisma -> SQLite
        -> KI-Port -> OpenAI-Adapter
```

Alle Pfeile zeigen in Richtung einer expliziten Schnittstelle. Domain, Regel-Engine und Orakel besitzen keine Abhängigkeit zu Framework, Datenbank oder KI-Anbieter.

## Schichten und Verantwortlichkeiten

### `src/domain`

Reine Geschäftsmodelle, Wertobjekte, Ereignisse und Invarianten. Diese Schicht kennt keine Infrastruktur.

### `src/rules`

Deterministische Auswertung von Proben, Konsequenzen und Herausforderungen. Zufall wird injiziert.

### `src/oracle`

Ja-Nein-Orakel, Inspirationstabellen, Spannung und Zufallsereignisse. Auch diese Logik verwendet eine injizierte Zufallsquelle.

### `src/services`

Orchestriert Anwendungsfälle wie Kampagne erstellen, Szene beenden oder einen bestätigten Änderungsvorschlag übernehmen. Services arbeiten gegen Ports.

### `src/repositories`

Definiert Datenzugriffsports und enthält später deren Prisma-Adapter. Prisma-Typen verlassen die Adaptergrenze nicht.

### `src/ai`

Enthält anbieterneutrale Verträge, Kontextaufbereitung, Prompts, Ausgabe-Schemas und Provideradapter. Der erste Adapter nutzt OpenAI, ein Mockadapter ermöglicht Tests ohne Netzwerk.

### `src/features`, `src/components` und `src/app`

Enthalten UI-nahe Logik, wiederverwendbare Komponenten und Next.js-Routen. UI löst Anwendungsfälle über Services oder serverseitige Endpunkte aus und implementiert keine Domainregeln.

## Abhängigkeitsregel

```text
UI/Infrastruktur -> Services -> Domain
                          -> Rules
                          -> Oracle
```

Innere Schichten importieren niemals äußere Schichten. Gemeinsame Verträge werden an der inneren Grenze definiert, die sie benötigt.

## Persistenz

SQLite ist die kanonische persistente Ablage. Prisma kapselt Schema und Migrationen.

- häufig gefilterte und verknüpfte Kerneigenschaften erhalten echte Spalten
- variable kampagnenspezifische Zusatzfelder dürfen validiertes JSON verwenden
- jede flexible JSON-Struktur besitzt ein Zod-Schema
- verbindliche Änderungen erzeugen ein `CampaignEvent`
- Ereignisse unterstützen Nachvollziehbarkeit und später Undo, ersetzen im MVP aber nicht zwingend alle aktuellen Zustandsprojektionen

Das System verwendet damit ein Ereignisprotokoll plus aktuelle Zustände, kein vollständiges Event Sourcing. Änderungen an Zustand und Ereignis müssen atomar gespeichert werden.

## KI-Architektur

Der interne Port ist auf fachliche Fähigkeiten ausgerichtet:

```ts
interface AiProvider {
  generateNarration(request: NarrationRequest): Promise<NarrationResult>;
  summarizeScene(request: SceneSummaryRequest): Promise<SceneSummary>;
  extractChanges(request: ChangeExtractionRequest): Promise<WorldChangeProposal>;
}
```

OpenAI wird als erster Adapter umgesetzt. Vorgesehen ist die serverseitige Responses API. Strukturierte Ergebnisse werden gegen explizite Schemas erzeugt und anschließend erneut lokal mit Zod validiert. Die Domain kennt weder SDK-Typen noch Modellbezeichnungen. Modell und Anbieter werden über validierte Konfiguration gewählt.

Die aktuelle OpenAI-Dokumentation führt aktuelle Modelle über die Responses API und weist strukturierte Ausgaben als unterstützte Funktion aus. Diese externe Fähigkeit wird dennoch nur im Adapter verwendet: [OpenAI API Models](https://developers.openai.com/api/docs/models).

API-Schlüssel werden ausschließlich serverseitig aus Umgebungsvariablen oder einer späteren verschlüsselten lokalen Konfiguration gelesen. Kampagnendaten werden nach dem Prinzip der minimal notwendigen Kontextmenge übermittelt.

## Internationalisierung

Deutsch ist die Standard-Locale. Die UI wird von Beginn an so strukturiert, dass weitere Locales ergänzt werden können:

- stabile, fachlich benannte Übersetzungsschlüssel
- Locale-Dateien außerhalb der Komponenten
- Formatierung von Datum, Uhrzeit und Zahlen über die aktive Locale
- keine Übersetzung von frei eingegebenen Kampagneninhalten
- fachliche Schlüssel und Ereignistypen bleiben sprachneutral

Phase 1 verwendet zunächst einen kleinen, typsicheren internen Nachrichtenkatalog ohne zusätzliche Laufzeitabhängigkeit. Locale-Routing und eine spezialisierte i18n-Bibliothek werden erst ergänzt, wenn die Anwendung tatsächlich eine umschaltbare zweite Sprache benötigt. Die Domain hängt nicht vom Nachrichtenkatalog ab.

## Gestaltung

Die Oberfläche verwendet eine dunkle, atmosphärische Grundgestaltung mit hoher Lesbarkeit. Design-Tokens als CSS-Variablen definieren Farben, Abstände, Typografie, Radien und Zustände. Dekoration bleibt zurückhaltend; lange Erzähltexte, Formulare und Fokuszustände haben Vorrang.

## Sicherheit und Datenschutz

- keine Benutzerkonten im MVP
- keine Telemetrie oder Analyseanbieter
- keine automatischen externen Datenübertragungen außer bewusst ausgelösten KI-Anfragen
- serverseitige Geheimnisse
- validierte Ein- und Ausgaben an jeder Systemgrenze
- sanitisiertes Markdown statt ungeprüftem HTML
- Kennzeichnung sensibler Exportdateien

Soll die Anwendung später außerhalb eines vertrauenswürdigen lokalen Netzes erreichbar sein, muss Authentifizierung als eigenes Architekturpaket ergänzt werden. Der Verzicht auf Benutzerkonten ist keine Freigabe für einen öffentlich erreichbaren Server.

## Geplante Ordnerstruktur

```text
src/
├── app/
├── components/
├── features/
├── domain/
├── services/
├── repositories/
├── ai/
├── rules/
├── oracle/
├── db/
├── i18n/
├── schemas/
└── tests/
```

## Bewusst vertagte Entscheidungen

- konkrete Paketversionen bis Phase 1
- spezialisierte i18n-Bibliothek bis zu einer tatsächlich umschaltbaren zweiten Sprache
- konkretes OpenAI-Modell bis Phase 8
- Docker-Betrieb bis nach einem funktionierenden lokalen MVP
- Authentifizierung bis zu einer tatsächlichen externen Bereitstellung
- vollständiges Event Sourcing ist nicht vorgesehen
