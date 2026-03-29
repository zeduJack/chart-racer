# ChartRacer — Projekt-Regeln

## Arbeitsverzeichnis
- Arbeite AUSSCHLIESSLICH innerhalb dieses Projektverzeichnisses
- Lese, schreibe, erstelle und lösche KEINE Dateien ausserhalb dieses Verzeichnisses
- Nutze keine absoluten Pfade die aus dem Projekt herausführen

## Fortschritt
- Bei SESSION-START: Lies PROGRESS.md und mach bei der aktuellen Story weiter
- Bei STORY-ABSCHLUSS: Aktualisiere PROGRESS.md (Checkbox, Status, nächste Story)
- Bei PROBLEMEN oder ENTSCHEIDUNGEN: Dokumentiere unter "Notizen" in PROGRESS.md
- Committe PROGRESS.md zusammen mit dem Story-Commit

## Git
- Nach jeder abgeschlossenen Story: `git add . && git commit -m "..." && git push` mit aussagekräftiger Commit-Message
- Commit-Format: `feat(scope): beschreibung` / `fix(scope): beschreibung` / `chore(scope): beschreibung`
- Nach jedem Commit direkt pushen: `git push`
- Bei grösseren Stories sind Zwischen-Commits (mit Push) erwünscht

## Tech-Stack
- Next.js 16 (App Router, Turbopack, proxy.ts statt middleware.ts)
- Remotion für Video-Animation und -Rendering
- D3.js innerhalb von Remotion-Komponenten
- Tailwind CSS für UI-Styling
- SQLite via Drizzle ORM
- TypeScript durchgehend

## Remotion-Regeln
- Alle Animationen über `useCurrentFrame()`, `interpolate()`, `spring()`
- KEINE CSS-Transitions, KEINE `requestAnimationFrame`, KEINE `setTimeout`-basierte Animationen
- KEIN `Math.random()`, KEIN `Date.now()` — alles frame-basiert
- `<Img>` statt `<img>`, `<Audio>` statt `<audio>`
- Agent Skills beachten (falls installiert)

## Qualitätssicherung
- Nach signifikanten visuellen Änderungen: Remotion Stills rendern und Screenshots analysieren
- Playwright-Tests für UI-Seiten
- Iterativ verbessern bis das Resultat professionell aussieht

## Code-Stil
- TypeScript strict mode
- Funktionale Komponenten mit Hooks
- Keine `any` Types — korrekte Typisierung
- Deutsche Kommentare sind OK, Code und Variable-Names auf Englisch
