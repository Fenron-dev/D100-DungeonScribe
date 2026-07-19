# Vollständig lokaler Mobile-Client

## Ziel

Die Mobile-App muss Kampagnen, Journal, Regeln, Würfel, Orakel, verschlüsselte
KI-Profile und SQLite-Datenbank selbst enthalten. Sie darf keinen laufenden
DungeonScribe-Server auf einem anderen Gerät voraussetzen. Cloud-KI-Anbieter
benötigen weiterhin Internetzugang; alle deterministischen Spielfunktionen und
lokalen Daten bleiben auch ohne Netz verfügbar.

## Architekturentscheidung

Bevorzugt wird **Tauri 2 für iOS und Android** mit der bestehenden responsiven
React-Oberfläche. Tauri unterstützt beide Mobilplattformen und bietet offizielle
Plugins für SQLite, Dateisystem, HTTP und einen verschlüsselten Stronghold.
Damit kann derselbe Spielbildschirm auf Desktop und Mobile verwendet werden.

Flutter bleibt möglich, ist derzeit aber nicht die erste Wahl: Es würde eine
zweite Oberfläche und eine zweite Implementierung vieler TypeScript-Domänentypen
erfordern. Ein Wechsel ist erst gerechtfertigt, wenn native Bedienkonzepte oder
On-Device-ML die WebView-Lösung nachweislich begrenzen.

## Erforderliche Entkopplung

Die aktuelle Next.js-Anwendung verwendet Server Actions, Prisma und einen
lokalen Node-Prozess. Diese Teile laufen nicht unverändert in einer mobilen
WebView. Vor dem ersten Mobile-Build werden deshalb interne Ports eingeführt:

1. UI-Anwendungsfälle rufen keine Server Actions direkt auf, sondern einen
   `ApplicationClient`.
2. Desktop/Web verwendet zunächst einen Next-Adapter für diesen Client.
3. Mobile verwendet Tauri-Kommandos und das SQL-Plugin mit einer lokalen
   SQLite-Datenbank im App-Verzeichnis.
4. Zufall, Regeln und Zod-validierte Domänenlogik bleiben gemeinsam nutzbar.
5. KI-Anfragen laufen über einen nativen HTTP-Adapter. Schlüssel bleiben im
   verschlüsselten Gerätespeicher und gelangen nicht in WebView-Protokolle.

## Build und Datenschutz

- Android- und iOS-Builds entstehen ausschließlich in GitHub Actions.
- Signaturzertifikate, Provisioning-Profile und Store-Zugangsdaten liegen nur
  in verschlüsselten GitHub-Secrets, niemals im Repository oder Build-Artefakt.
- Nicht signierte Testpakete dürfen keine persönlichen Kampagnen oder Schlüssel
  enthalten.
- Für iOS werden später ein Apple-Developer-Zugang und die Entscheidung zwischen
  TestFlight und privater Installation benötigt.

## Umsetzungsschritte

1. Spieloberfläche mobil stabilisieren und mit Viewport-Tests absichern.
2. `ApplicationClient` und portable DTOs einführen.
3. SQLite- und Secret-Ports von Prisma/Node entkoppeln.
4. Tauri-2-Grundgerüst mit Android-Testbuild in GitHub Actions ergänzen.
5. Datenmigration und verschlüsselten Export/Import testen.
6. iOS-Build und Signierung ergänzen.
