# Abhängigkeitssicherheit

## Fixierte Patchstände vom 24. Juli 2026

Die Produktionsprüfung meldete neue hohe Sicherheitswarnungen für die zuvor
fixierten Versionen Next.js 16.2.10 und Prisma 7.8.0. Deshalb wurden die
zusammengehörigen Pakete gezielt auf Next.js 16.2.11 beziehungsweise Prisma
7.9.0 aktualisiert.

Die aktuellen Upstream-Pakete referenzieren weiterhin drei inzwischen als
verwundbar markierte Unterabhängigkeiten. Bis deren Hersteller neue
Patchreleases veröffentlichen, erzwingt die Lockdatei folgende bereits
behobene Versionen:

- `find-my-way` 9.7.0 gegen HTTP/2-DDoS
- `postcss` 8.5.22 gegen XSS und unberechtigten Dateizugriff
- `sharp` 0.35.3 gegen die gemeldeten libvips-Schwachstellen

Diese Overrides werden nicht als Ersatz für Tests betrachtet. GitHub Actions
führt danach Audit, Unit- und Integrationstests, Typecheck, Lint,
Produktions-Build und den Browser-Smoke-Test aus. Der macOS-Testbuild wiederholt
den realen Browserablauf im gepackten Apple-Silicon-Artefakt.

Sobald Next.js beziehungsweise Prisma die korrigierten Unterabhängigkeiten
selbst referenzieren, sollen die Overrides in einem eigenen, durch dieselben
Prüfungen abgesicherten Arbeitspaket entfernt werden.
