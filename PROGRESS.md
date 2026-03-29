# ChartRacer — Fortschritt

## Aktueller Status
- **Phase:** 4 — Polish, Templates & Deployment
- **Aktuelle Story:** 4.1 — Template-System
- **Status:** IN PROGRESS

## Phase 1: Remotion Setup + Core Animation + Erstes Video
- [x] **1.1** Projekt-Setup (Next.js 16 + Remotion + Git + CLAUDE.md)
- [x] **1.2** Bar Chart Race Kern-Animation (Balken, Reordering, Counter)
- [x] **1.3** Bilder/Logos an Balken
- [x] **1.4** Audio + Intro/Outro
- [x] **1.5** Video-Rendering + CLI (erstes fertiges MP4)
- [x] **1.6** Visual Polish der Animation

## Phase 2: AI-Datenrecherche
- [x] **2.1** Claude API Integration mit Web Search Tool
- [x] **2.2** Themen-History und Blickwinkel-Tracking (SQLite)
- [x] **2.3** Daten-Validierung und Fallback-Logik
- [x] **2.4** CLI + API für AI-generierte Videos

## Phase 3: Web Editor UI
- [x] **3.1** Editor-Seite mit AI-Themen-Input
- [x] **3.2** Manueller Daten-Upload (CSV/JSON)
- [x] **3.3** Visuelles Konfigurations-Panel
- [x] **3.4** Remotion Player als Live-Preview
- [x] **3.5** Video-Galerie + Dashboard

## Phase 4: Polish, Templates & Deployment
- [ ] **4.1** Template-System
- [ ] **4.2** Social-Media Metadaten
- [ ] **4.3** Multi-Format Rendering
- [ ] **4.4** Dockerfile + CapRover Deployment
- [ ] **4.5** Finales Visual Polish

## Notizen
- Playwright installiert (`@playwright/test ^1.58.2`), 5 UI-Tests laufen durch (port 3003)
- `@anthropic-ai/sdk ^0.80.0` installiert
- `src/lib/ai-researcher.ts`: Agent-Loop mit Web Search Tool (`web_search_20260209`), liefert strukturiertes JSON
- `tests/e2e/ai-researcher.spec.ts`: 5 Validierungs-Tests grün, echter API-Test skip ohne Key
- `.env.local.example` als Template für ANTHROPIC_API_KEY
- `src/lib/db/schema.ts` + `src/lib/db/index.ts`: Drizzle ORM Schema (topics, angles, generated_videos) mit lazy-init
- `src/lib/topic-manager.ts`: Topic/Angle/Video CRUD mit History-Tracking
- `tests/e2e/topic-manager.spec.ts`: 5 SQLite-Tests alle grün
- `src/app/api/generate/route.ts`: POST /api/generate (AI + Render) + GET
- `src/app/api/videos/route.ts`: GET /api/videos
- `src/app/api/topics/route.ts`: GET + POST /api/topics
- CLI: generate, research, list, topics Befehle
- `tests/e2e/api-trigger.spec.ts`: 7/8 Tests grün (1 skipped ohne API-Key)
- `src/app/editor/page.tsx`: Editor-Seite mit AI-Themen-Input, Format-Auswahl, Dry-Run
- `src/components/editor/GenerateForm.tsx`: Client-Component mit Loading-States und Ergebnis-Anzeige
- `tests/visual/editor-page.spec.ts`: 8/8 HTTP-Tests grün (kein Browser-Binary nötig)
- Playwright Browser-Tests: HTTP-Request-basiert (libnspr4 nicht auf Server installiert)
- `tests/visual/editor-ui.spec.ts` — Dashboard UI: Navigation, Stats, Render-Commands, JS-Fehler, Screenshot
- `tests/visual/animation-frames.spec.ts` — Remotion Stills für 5 Checkpoints (rendert via execSync)
- `src/app/videos/page.tsx`: Server Component, force-dynamic, Stats, VideoCard, TopicCard, EmptyState
- `tests/visual/videos-page.spec.ts`: 8/8 HTTP-Tests grün
