# Claude Code Plan Mode Prompt: Bar Chart Race Video Generator

## Projektbeschreibung

Entwickle eine **Self-Hosted Web-App** ("ChartRacer") zur automatisierten Erstellung von **Bar Chart Race Videos** — animierte Balkendiagramme, die Veränderungen über Zeit darstellen (z.B. Aktienkurse, Umsätze, Bevölkerungen, Rankings). Die Videos sollen Social-Media-ready sein (YouTube, Instagram Reels, TikTok, Facebook) mit professionellem Sound und polierter Optik.

**Referenz:** Suche auf YouTube nach "bar chart race" oder dem Kanal "Data is Beautiful" — das sind die typischen animierten Balkendiagramm-Rennen, wo Balken über die Zeit wachsen, schrumpfen und ihre Position tauschen.

**Kern-Idee:** Der User gibt nur ein Thema an (z.B. "Aktien", "Tech-Firmen Umsatz", "Bevölkerung Europa") und die App recherchiert selbstständig passende Daten, wählt einen interessanten Blickwinkel, und produziert ein fertiges Video. Bei wiederkehrender Ausführung (Cron/Pipeline) wählt die App jeweils einen **neuen Blickwinkel** zum selben Thema.

---

## Projekt-Setup: Git, CLAUDE.md, Permissions

### Git-Workflow

Das gesamte Projekt wird in Git versioniert. **Nach jeder abgeschlossenen Story wird ein Commit erstellt** mit einer aussagekräftigen Commit-Message:

- Format: `feat(scope): Beschreibung` / `fix(scope): Beschreibung` / `chore(scope): Beschreibung`
- Beispiele:
  - `feat(animation): implement bar chart race core animation with D3 interpolation`
  - `feat(animation): add logo/image support on bar ends`
  - `feat(audio): add intro/outro sequences with fade transitions`
  - `feat(render): integrate Remotion CLI rendering with MP4 output`
  - `feat(ai): implement Claude API web search agent for data research`
  - `feat(editor): add visual configuration panel with live preview`
  - `fix(animation): fix bar overlap during reordering transition`
  - `chore(setup): initialize Next.js 16 + Remotion project structure`
- Bei grösseren Stories dürfen auch Zwischen-Commits gemacht werden
- **Kein `git push`** — das mache ich manuell

### Fortschritts-Tracking (`PROGRESS.md`)

Erstelle im Projekt-Root eine `PROGRESS.md` Datei. Claude Code aktualisiert diese Datei **nach jeder abgeschlossenen Story** und **bei Session-Start liest Claude diese Datei zuerst**, um zu wissen wo weitergemacht werden soll.

Initiale `PROGRESS.md`:

```markdown
# ChartRacer — Fortschritt

## Aktueller Status
- **Phase:** 1 — Remotion Setup + Core Animation + Erstes Video
- **Aktuelle Story:** 1.1 — Projekt-Setup
- **Status:** NOT STARTED

## Phase 1: Remotion Setup + Core Animation + Erstes Video
- [ ] **1.1** Projekt-Setup (Next.js 16 + Remotion + Git + CLAUDE.md)
- [ ] **1.2** Bar Chart Race Kern-Animation (Balken, Reordering, Counter)
- [ ] **1.3** Bilder/Logos an Balken
- [ ] **1.4** Audio + Intro/Outro
- [ ] **1.5** Video-Rendering + CLI (erstes fertiges MP4)
- [ ] **1.6** Visual Polish der Animation

## Phase 2: AI-Datenrecherche
- [ ] **2.1** Claude API Integration mit Web Search Tool
- [ ] **2.2** Themen-History und Blickwinkel-Tracking (SQLite)
- [ ] **2.3** Daten-Validierung und Fallback-Logik
- [ ] **2.4** CLI + API für AI-generierte Videos

## Phase 3: Web Editor UI
- [ ] **3.1** Editor-Seite mit AI-Themen-Input
- [ ] **3.2** Manueller Daten-Upload (CSV/JSON)
- [ ] **3.3** Visuelles Konfigurations-Panel
- [ ] **3.4** Remotion Player als Live-Preview
- [ ] **3.5** Video-Galerie + Dashboard

## Phase 4: Polish, Templates & Deployment
- [ ] **4.1** Template-System
- [ ] **4.2** Social-Media Metadaten
- [ ] **4.3** Multi-Format Rendering
- [ ] **4.4** Dockerfile + CapRover Deployment
- [ ] **4.5** Finales Visual Polish

## Notizen
<!-- Hier Entscheidungen, Probleme, offene Fragen dokumentieren -->
```

**Regeln für PROGRESS.md:**
- Bei Story-Abschluss: Checkbox `[x]` setzen, "Aktuelle Story" und "Status" aktualisieren
- Bei Problemen/Entscheidungen: unter "Notizen" dokumentieren
- Bei Session-Start: `PROGRESS.md` lesen und bei der aktuellen Story weitermachen
- Status-Werte: `NOT STARTED`, `IN PROGRESS`, `DONE`, `BLOCKED`

### CLAUDE.md (Projekt-Regeln für Claude Code)

Erstelle im Projekt-Root eine `CLAUDE.md` Datei mit folgendem Inhalt:

```markdown
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
- Nach jeder abgeschlossenen Story: `git add . && git commit -m "..."` mit aussagekräftiger Commit-Message
- Commit-Format: `feat(scope): beschreibung` / `fix(scope): beschreibung` / `chore(scope): beschreibung`
- KEIN `git push` — das macht der User manuell
- Bei grösseren Stories sind Zwischen-Commits erwünscht

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
```

### Claude Code Permissions (`.claude/settings.json`)

Erstelle `.claude/settings.json` im Projekt-Root:

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Bash(npm *)",
      "Bash(npx *)",
      "Bash(node *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git branch *)",
      "Bash(git checkout *)",
      "Bash(cat *)",
      "Bash(ls *)",
      "Bash(mkdir *)",
      "Bash(cp *)",
      "Bash(mv *)",
      "Bash(find *)",
      "Bash(grep *)",
      "Bash(head *)",
      "Bash(tail *)",
      "Bash(wc *)",
      "Bash(echo *)",
      "Bash(tree *)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(git push *)",
      "Bash(sudo *)"
    ]
  }
}
```

**Was diese Konfiguration bewirkt:**
- `acceptEdits`: Alle File-Edits und File-Writes werden automatisch genehmigt — kein Bestätigen nötig
- `allow`-Liste: Die üblichen Bash-Befehle (npm, npx, git, cat, ls, etc.) laufen ohne Nachfrage
- `deny`-Liste: `git push`, `sudo` und destruktive Befehle sind blockiert
- Die `CLAUDE.md` stellt sicher, dass Claude Code nur im Working Directory arbeitet

---

## Architektur (bewusst einfach)

### Tech-Stack
- **Frontend / Editor UI:** Next.js 16 (App Router, Turbopack) mit Tailwind CSS
- **Video-Engine:** Remotion (React-basiertes, frame-deterministisches Video-Framework)
  - Remotion übernimmt: Animation, Rendering zu MP4, Audio-Mixing, Preview
  - D3.js innerhalb von Remotion-Komponenten für Balken-Berechnung, Interpolation, Sortierung
  - Remotion Player eingebettet in die Next.js App für Live-Preview
  - Remotion Agent Skills installieren (`npx skills add remotion-dev/skills`) für Claude Code Best Practices
- **AI-Datenrecherche:** Anthropic Claude API (mit Web Search Tool) für Themenrecherche und Datenaufbereitung
- **Datenbank:** SQLite (via Drizzle ORM) für Konfigurationen, generierte Videos, bereits behandelte Themen
- **Storage:** Lokales Filesystem für generierte Videos (später optional S3/R2)
- **Audio:** Mitgelieferte lizenzfreie Soundtracks + Upload eigener Audio-Dateien

### Warum Remotion statt Canvas/D3 + Playwright + FFmpeg?
- **Frame-deterministisch by design:** Jede Animation basiert auf `useCurrentFrame()` — kein requestAnimationFrame-Hack, kein manueller Step-Modus nötig
- **Video-Rendering eingebaut:** `npx remotion render` erzeugt MP4/WebM direkt, FFmpeg ist unter der Haube integriert
- **Audio-Mixing nativ:** Soundtrack einfach als `<Audio>` Komponente einbinden
- **Live-Preview:** Remotion Studio und Remotion Player für Echtzeit-Vorschau
- **React-basiert:** Passt perfekt zu Next.js, wiederverwendbare Komponenten
- **Claude Code Integration:** Offizielle Agent Skills für Remotion-konformen Code
- **Lizenz:** Kostenlos für Einzelpersonen und Teams bis 3 Personen (auch kommerziell)

### Scheduling — Bewusst einfach
- **Kein BullMQ, kein Redis**
- Scheduling läuft extern: **Cron-Job** auf dem Server oder **GitHub Actions Pipeline** oder jeder andere externe Trigger
- Die App bietet einen **CLI-Befehl** und einen **API-Endpunkt** zum Auslösen:
  ```bash
  # CLI
  npx chart-racer generate --topic "Aktien" --format "16:9"
  
  # API (für Cron/Pipeline/Webhook)
  curl -X POST https://chartracer.example.com/api/generate \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"topic": "Aktien", "format": "16:9"}'
  ```
- Cron-Beispiel: `0 8 * * 1` → Jeden Montag 08:00 ein neues Video
- GitHub Actions Beispiel: Scheduled Workflow der den API-Endpunkt aufruft

### Deployment
- Docker-Container (einfaches Dockerfile, kein docker-compose nötig)
- CapRover-kompatibel
- Chromium (für Remotion Rendering) im Container vorinstalliert

---

## Kern-Features

### 1. Bar Chart Race Animation (Remotion)

Die Animation ist eine Remotion-Composition mit folgenden Elementen:

**Remotion-Komponenten-Struktur:**
```
<BarChartRace>              # Hauptkomposition
  <Sequence>                # Intro (Titel-Screen, Fade-In)
    <IntroScreen />
  </Sequence>
  <Sequence>                # Hauptanimation
    <RaceAnimation>
      <Background />        # Hintergrund (Farbe/Gradient/Bild)
      <Title />             # Titel + Untertitel
      <TimeDisplay />       # Aktuelle Zeitperiode (z.B. "2021")
      <BarContainer>        # Die animierten Balken
        <Bar />             # Einzelner Balken mit Label, Wert, Logo, Farbe
        <Bar />
        ...
      </BarContainer>
      <ValueAxis />         # X-Achse mit Werten
    </RaceAnimation>
  </Sequence>
  <Sequence>                # Outro (End-Screen, Fade-Out)
    <OutroScreen />
  </Sequence>
  <Audio />                 # Soundtrack
</BarChartRace>
```

**Animations-Logik (mit D3.js):**
- `useCurrentFrame()` + `interpolate()` für zeitbasierte Werte
- D3 `scaleBand` / `scaleLinear` für Balken-Positionierung und -Breite
- Smooth Interpolation zwischen Datenpunkten (Werte UND Positionen)
- `spring()` für natürliches Easing bei Reordering
- Animierte Counter für Werte (z.B. "$1.2B" → "$1.8B")
- FLIP-Technik für Balken-Positions-Wechsel

**Konfigurierbare Input Props (Remotion `inputProps`):**
```typescript
interface ChartRaceProps {
  data: {
    title: string;
    subtitle: string;
    timeLabels: string[];          // ["2020", "2021", "2022", ...]
    participants: {
      name: string;
      color: string;
      imageUrl?: string;           // Logo/Bild
      values: number[];            // Wert pro Zeitpunkt
    }[];
  };
  style: {
    visibleBars: number;           // 5, 10, 15, 20
    palette: string;               // "tech-neon", "pastel", "corporate", ...
    barStyle: "rounded" | "square" | "glow";
    valueFormat: { prefix?: string; suffix?: string; abbreviate: boolean };
    fontFamily: string;
    backgroundColor: string;
    easing: "linear" | "spring" | "easeInOut";
    durationPerStep: number;       // Frames pro Zeitschritt
  };
  output: {
    format: "16:9" | "9:16" | "1:1";
    fps: 30 | 60;
    resolution: "720p" | "1080p" | "4k";
  };
  audio: {
    trackUrl: string;
    volume: number;
    fadeIn: number;
    fadeOut: number;
  };
}
```

### 2. AI-gesteuerte Datenrecherche (das Herzstück)

Die App nutzt die **Claude API mit Web Search Tool**, um selbstständig Daten zu recherchieren und aufzubereiten.

**Workflow bei Themen-Eingabe:**

```
User gibt Thema ein (z.B. "Aktien")
        ↓
AI-Agent (Claude API + Web Search):
  1. Wählt einen konkreten Blickwinkel
     (z.B. "Top 10 Tech-Aktien Performance 2020-2025")
  2. Prüft in DB: Wurde dieser Blickwinkel schon behandelt? → Falls ja, neuen wählen
  3. Recherchiert Daten via Web Search
  4. Strukturiert Daten als Zeitreihe (JSON)
  5. Schlägt Titel, Untertitel, Farbschema vor
  6. Schlägt passenden Soundtrack-Stil vor
        ↓
Remotion Rendering mit generierten Daten als inputProps
        ↓
Fertiges MP4 + Metadaten (Titel, Beschreibung für Social Media)
```

**Beispiel-Szenarien:**

| User-Input | AI wählt beim 1. Mal | AI wählt beim 2. Mal | AI wählt beim 3. Mal |
|---|---|---|---|
| "Aktien" | "Magnificent 7: Aktienkurs 2020-2025" | "Grösste Kursgewinner S&P 500 2025" | "Krypto vs. Tech-Aktien: 5-Jahres-Vergleich" |
| "Sport" | "Champions League: Titel nach Verein" | "NBA: Punkte pro Saison Top Scorer 2024/25" | "Formel 1: WM-Punkte 2025 Saison-Verlauf" |
| "Technologie" | "Smartphone-Marktanteil 2010-2025" | "AI-Startup-Bewertungen 2023-2025" | "Programmiersprachen Popularität (TIOBE)" |

**AI-Agent Prompt-Struktur:**
```
System: Du bist ein Daten-Recherche-Agent für Bar Chart Race Videos.
Dein Job:
1. Erhalte ein Thema und eine Liste bereits behandelter Blickwinkel
2. Wähle einen NEUEN, interessanten Blickwinkel der viral gehen könnte
3. Recherchiere via Web Search konkrete Zahlen/Daten
4. Liefere die Daten als strukturiertes JSON zurück:
   {
     "title": "...",
     "subtitle": "...",
     "time_unit": "year" | "month" | "quarter",
     "time_labels": ["2020", "2021", ...],
     "participants": [
       {
         "name": "Tesla",
         "color": "#e31937",
         "image_url": "https://...",
         "values": [100, 250, 400, ...]
       },
       ...
     ],
     "value_format": { "prefix": "$", "suffix": "", "abbreviate": true },
     "suggested_palette": "tech-neon",
     "social_media": {
       "title": "You won't believe which stock grew 400% 📈",
       "description": "...",
       "hashtags": ["#stocks", "#investing", "#dataisbeautiful"]
     }
   }
```

**Wichtig für die AI-Recherche:**
- Claude API Call mit `tools: [{ type: "web_search_20250305", name: "web_search" }]`
- Mehrere Search-Iterationen erlaubt (Agent-Loop), bis genügend Daten gefunden sind
- Daten-Validierung: Prüfen ob Zeitreihe vollständig ist, keine Lücken
- Fallback: Wenn nicht genügend Daten → User informieren, alternativen Blickwinkel vorschlagen
- **Themen-History in DB speichern** → bei erneutem Aufruf zum selben Thema immer ein neuer Blickwinkel

### 3. Konfigurierbarer Chart-Editor (Web UI)

**Daten-Input:**
- **AI-Modus:** Nur Thema eingeben → AI recherchiert alles
- **Manueller Modus:** CSV/JSON Upload oder Eingabeformular
- Daten-Preview/Tabelle im Editor
- AI-generierte Daten können im Editor nachbearbeitet werden

**Visuelles Konfigurieren:**
- Anzahl sichtbarer Balken (Top 5, 10, 15, 20)
- Farbschema (vordefinierte Paletten + Custom Colors pro Teilnehmer)
- Bilder/Logos pro Teilnehmer (Upload oder URL) — am Balkenende angezeigt
- Schriftart und -grösse (Google Fonts Auswahl)
- Hintergrundfarbe/Gradient oder Hintergrundbild
- Titel, Untertitel, Zeitanzeige-Format
- Balken-Stil: abgerundet, eckig, mit Schatten, mit Glow-Effekt
- Werteformatierung: K, M, B Abkürzungen, Währungssymbole, Prozent
- Animationsgeschwindigkeit (Dauer pro Zeitschritt)
- Übergangs-Easing (linear, easeInOut, spring, etc.)
- Counter/Ticker-Animation für die Werte

**Video-Output-Konfiguration:**
- Format: 16:9 (YouTube), 9:16 (Reels/TikTok/Shorts), 1:1 (Instagram Post)
- Auflösung: 720p, 1080p, 4K
- FPS: 30 oder 60
- Intro/Outro: Optionaler Titel-Screen mit Fade-In/Fade-Out
- Audio-Track: Auswahl aus mitgelieferten Tracks oder eigener Upload

**Live-Preview:**
- Remotion Player eingebettet im Editor
- Play/Pause/Scrub-Timeline
- Nutzt exakt dieselbe Composition wie das Video-Rendering

### 4. API + CLI für externe Trigger

**API-Endpunkte:**
```
POST /api/generate          # Video generieren (AI-Modus oder mit Daten)
GET  /api/generate/:id      # Status eines Jobs abfragen
GET  /api/videos            # Liste aller generierten Videos
GET  /api/videos/:id        # Video herunterladen
GET  /api/topics            # Alle Themen + bereits behandelte Blickwinkel
POST /api/topics            # Neues Thema anlegen
```

**CLI:**
```bash
npx chart-racer generate --topic "Aktien"              # AI recherchiert + rendert
npx chart-racer generate --topic "Aktien" --dry-run    # Nur Daten recherchieren, kein Video
npx chart-racer generate --data ./my-data.json          # Manuell mit eigenen Daten
npx chart-racer list                                    # Alle Videos auflisten
```

### 5. Template-System

- Vordefinierte Templates für gängige Szenarien
- Templates enthalten: Farbschema, Layout, Animationseinstellungen
- Custom Templates speichern und wiederverwenden
- AI kann basierend auf Thema das passende Template vorschlagen

---

## Qualitätssicherung mit Playwright Screenshots

**WICHTIG — Zentraler Bestandteil des Entwicklungs-Workflows:**

Während der Entwicklung soll Claude Code die visuelle Qualität **kontinuierlich mit Playwright verifizieren**:

### Playwright-QA-Workflow:
1. **Nach jedem signifikanten Animations-/UI-Change:**
   - Remotion Preview oder gerenderten Frame als Screenshot machen
   - Screenshots analysieren: Sieht es professionell aus? Farben, Abstände, Fonts korrekt?

2. **Screenshot-Checkpoints für die Animation:**
   - Frame bei t=0 (Startposition)
   - Frame bei t=25% (erstes Reordering)
   - Frame bei t=50% (Mitte)
   - Frame bei t=75% (gegen Ende)
   - Frame bei t=100% (Endposition)
   - Prüfen: Smooth Transitions? Korrekte Sortierung? Labels lesbar? Logos korrekt?
   - Tipp: Remotion kann einzelne Frames direkt rendern (`npx remotion still`)

3. **Screenshot-Checkpoints für das UI:**
   - Editor-Seite vollständig geladen
   - AI-Themen-Input und manueller Upload funktioniert
   - Konfiguration sichtbar
   - Remotion Player Preview funktioniert

4. **Automatische Verbesserungsschleife:**
   - Screenshot/Frame machen → analysieren → Problem identifizieren → Fix implementieren → erneut prüfen → verifizieren
   - Loop wiederholen, bis das Resultat professionell und poliert aussieht
   - Fokus auf: Animationsflüssigkeit, Schriftgrössen, Kontrast, Spacing, Balken-Overlaps

### Test-Struktur:
```
tests/
  visual/
    animation-frames.spec.ts     # Remotion Stills in verschiedenen Stadien rendern + prüfen
    editor-ui.spec.ts            # Playwright Screenshots des Editor UIs
    video-output.spec.ts         # Prüft generiertes Video (Existenz, Grösse, Format)
  e2e/
    full-workflow.spec.ts        # Thema → AI-Recherche → Preview → Render → Download
    api-trigger.spec.ts          # API-Endpunkt triggern und Resultat prüfen
```

---

## Projektstruktur

```
chart-racer/
├── .claude/
│   └── settings.json                # Claude Code Permissions
├── CLAUDE.md                         # Projekt-Regeln für Claude Code
├── .gitignore
├── src/
│   ├── app/                          # Next.js 16 App Router
│   │   ├── page.tsx                  # Landing/Dashboard — generierte Videos, Quick-Generate
│   │   ├── editor/
│   │   │   └── page.tsx              # Chart-Editor (AI-Modus + Manuell)
│   │   ├── videos/
│   │   │   └── page.tsx              # Video-Galerie + Download
│   │   └── api/
│   │       ├── generate/route.ts     # Video generieren (AI oder manuell)
│   │       ├── videos/route.ts       # Video CRUD
│   │       ├── topics/route.ts       # Themen-Verwaltung
│   │       └── upload/route.ts       # Daten/Bild-Upload
│   ├── remotion/                     # Remotion Video-Kompositionen
│   │   ├── Root.tsx                  # Remotion Entry Point (registriert Compositions)
│   │   ├── BarChartRace/
│   │   │   ├── index.tsx             # Hauptkomposition
│   │   │   ├── RaceAnimation.tsx     # Kern-Animation mit Balken
│   │   │   ├── Bar.tsx               # Einzelner Balken (Label, Wert, Logo, Farbe)
│   │   │   ├── TimeDisplay.tsx       # Zeitanzeige (animierter Counter)
│   │   │   ├── ValueAxis.tsx         # X-Achse
│   │   │   ├── IntroScreen.tsx       # Intro-Sequence
│   │   │   ├── OutroScreen.tsx       # Outro-Sequence
│   │   │   └── Background.tsx        # Hintergrund
│   │   ├── hooks/
│   │   │   ├── useBarPositions.ts    # D3-basierte Balken-Berechnung + Interpolation
│   │   │   └── useAnimatedValue.ts   # Smooth Value-Counter
│   │   └── styles/
│   │       └── themes.ts             # Vordefinierte Farbpaletten und Styles
│   ├── components/
│   │   ├── chart-editor/             # Editor-Komponenten
│   │   ├── preview/                  # Remotion Player Wrapper
│   │   └── ui/                       # Shared UI Components
│   ├── lib/
│   │   ├── render.ts                 # Remotion Rendering API aufrufen
│   │   ├── ai-researcher.ts          # Claude API + Web Search Agent
│   │   ├── topic-manager.ts          # Themen-History, Blickwinkel-Tracking
│   │   ├── db/
│   │   │   ├── schema.ts             # Drizzle Schema
│   │   │   └── index.ts              # DB Connection
│   │   └── sample-data.ts            # Beispieldaten für Development
│   └── cli/
│       └── index.ts                  # CLI-Kommandos (generate, list, etc.)
├── public/
│   ├── audio/                        # Mitgelieferte Soundtracks
│   └── fonts/                        # Lokale Font-Dateien
├── tests/
│   ├── visual/                       # Playwright Visual Tests + Remotion Stills
│   └── e2e/                          # End-to-End Tests
├── Dockerfile                        # Single Container (Node + Chromium)
├── captain-definition                # CapRover Deployment
├── remotion.config.ts                # Remotion Konfiguration
└── package.json
```

---

## Entwicklungs-Reihenfolge (Stories)

### Phase 1: Remotion Setup + Core Animation + Erstes Video

**Ziel: Am Ende von Phase 1 kann mit Beispieldaten ein komplettes Bar Chart Race Video gerendert werden.**

1. **Story 1.1:** Projekt-Setup
   - `git init` + `.gitignore` (node_modules, .env, out/, dist/, *.mp4)
   - `CLAUDE.md` und `.claude/settings.json` erstellen (siehe oben)
   - Next.js 16 Projekt erstellen
   - Remotion installieren und konfigurieren (`remotion.config.ts`)
   - Remotion Agent Skills installieren (`npx skills add remotion-dev/skills`)
   - Beispieldaten anlegen (Top 10 Tech-Firmen Umsatz 2015-2025)
   - Grundstruktur: `src/remotion/` Ordner mit `Root.tsx`
   - → **Commit: `chore(setup): initialize Next.js 16 + Remotion project with CLAUDE.md and permissions`**

2. **Story 1.2:** Bar Chart Race Kern-Animation
   - `BarChartRace` Composition erstellen
   - `Bar` Komponente: Balken mit Label, Wert, Farbe
   - `useBarPositions` Hook: D3-basierte Berechnung von Positionen und Breiten
   - `useCurrentFrame()` + `interpolate()` für zeitbasierte Animation
   - Smooth Reordering mit `spring()` wenn sich Ränge ändern
   - `TimeDisplay`: Animierte Zeitanzeige (z.B. "2020" → "2021")
   - Animierte Werte-Counter an den Balken
   - → **Playwright: Remotion Stills an 5 Zeitpunkten rendern, Screenshots analysieren, iterativ verbessern**

3. **Story 1.3:** Bilder/Logos an Balken
   - Logos am Balkenende oder -anfang anzeigen (via `<Img>` aus Remotion)
   - Korrekte Skalierung und Positionierung
   - → **Playwright: Screenshots prüfen — Logos korrekt platziert?**

4. **Story 1.4:** Audio + Intro/Outro
   - `<Audio>` Komponente mit mitgeliefertem Soundtrack
   - `IntroScreen` Sequence: Titel mit Fade-In
   - `OutroScreen` Sequence: End-Screen mit Fade-Out
   - Audio Fade-In/Fade-Out

5. **Story 1.5:** Video-Rendering + CLI
   - `npx remotion render` Integration in `src/lib/render.ts`
   - CLI-Befehl: `npx chart-racer render --data sample` → rendert Video mit Beispieldaten
   - Output als MP4 in konfigurierbarem Format (16:9, 9:16, 1:1)
   - → **E2E Test: CLI ausführen, prüfen ob MP4 erstellt wird (Existenz, Grösse, Format)**

6. **Story 1.6:** Visual Polish der Animation
   - Intensive Playwright-Screenshot-Review-Loops
   - Verschiedene Farbpaletten testen
   - Schriftgrössen optimieren
   - Kontrast, Spacing, Balken-Abstände feinjustieren
   - Vergleich mit Referenz-Videos (Flourish, "Data is Beautiful" Stil)
   - **Loop: Screenshot → analysieren → verbessern → Screenshot → bis es professionell aussieht**

### Phase 2: AI-Datenrecherche

7. **Story 2.1:** Claude API Integration mit Web Search Tool
   - `src/lib/ai-researcher.ts`: Agent-Loop
   - Thema → Blickwinkel wählen → Daten recherchieren → JSON zurückgeben
   - System-Prompt mit exaktem Output-JSON-Schema
   - Claude API Call mit `tools: [{ type: "web_search_20250305", name: "web_search" }]`

8. **Story 2.2:** Themen-History und Blickwinkel-Tracking (SQLite)
   - Drizzle Schema: Topics, Angles, GeneratedVideos
   - Sicherstellen dass bei wiederholtem Aufruf immer neuer Blickwinkel
   - Bereits behandelte Blickwinkel im AI-Prompt mitgeben

9. **Story 2.3:** Daten-Validierung und Fallback-Logik
   - Unvollständige Daten erkennen
   - Lücken füllen (Interpolation, letztbekannter Wert)
   - Bei ungenügenden Daten: alternativen Blickwinkel wählen

10. **Story 2.4:** CLI + API für AI-generierte Videos
    - `npx chart-racer generate --topic "Aktien"` → AI recherchiert + rendert
    - `npx chart-racer generate --topic "Aktien" --dry-run` → nur Daten, kein Video
    - API-Endpunkt: `POST /api/generate` mit `{ topic: "Aktien" }`
    - → **E2E Test: Topic → AI-Recherche → Rendering → fertiges MP4**

### Phase 3: Web Editor UI

11. **Story 3.1:** Editor-Seite mit AI-Themen-Input
    - Textfeld für Thema + "Generate" Button
    - Status-Anzeige: "AI recherchiert...", "Rendering...", "Fertig"
    - Generiertes Video als Download

12. **Story 3.2:** Manueller Daten-Upload (CSV/JSON)
    - Drag & Drop Upload
    - Daten-Preview in Tabelle
    - Validierung und Fehlermeldungen

13. **Story 3.3:** Visuelles Konfigurations-Panel
    - Sidebar mit allen Style-Optionen
    - Farbpaletten-Auswahl
    - Schriftart, Balkenstil, Anzahl Balken
    - Alle Änderungen aktualisieren den Remotion Player live

14. **Story 3.4:** Remotion Player als Live-Preview
    - Eingebetteter Player mit Play/Pause/Scrub
    - Reagiert auf Konfigurations-Änderungen in Echtzeit
    - → **Playwright: Editor-UI Screenshots — sieht professionell aus?**

15. **Story 3.5:** Video-Galerie + Dashboard
    - Liste aller generierten Videos mit Thumbnail, Titel, Datum
    - Download-Button
    - Themen-Übersicht mit behandelten Blickwinkeln

### Phase 4: Polish, Templates & Deployment

16. **Story 4.1:** Template-System
    - Vordefinierte Templates (Farbschema, Fonts, Balken-Stil, passender Soundtrack)
    - "Tech Race", "Sports Ranking", "Economic Data", "Pop Culture"
    - Custom Templates speichern und laden

17. **Story 4.2:** Social-Media Metadaten
    - AI generiert: Titel, Beschreibung, Hashtags pro Video
    - Optimiert für YouTube, Instagram, TikTok

18. **Story 4.3:** Multi-Format Rendering
    - Ein Klick → gleichzeitig 16:9 + 9:16 + 1:1 rendern
    - Format-spezifische Layouts (z.B. vertikale Balken für 9:16)

19. **Story 4.4:** Dockerfile + CapRover Deployment
    - Dockerfile: Node.js + Chromium (für Remotion Rendering)
    - captain-definition für CapRover
    - Environment Variables für Claude API Key, etc.

20. **Story 4.5:** Finales Visual Polish
    - Intensive Review aller Animations-Varianten
    - Edge Cases: Viele Teilnehmer, lange Labels, grosse Zahlen, fehlende Logos
    - Mobile-Preview für 9:16 Format
    - Performance-Optimierung des Rendering

---

## Wichtige technische Hinweise

### Remotion-spezifisch
- **Agent Skills:** Unbedingt installieren (`npx skills add remotion-dev/skills`) — diese steuern Claude Code zu korrektem Remotion-Code
- **Keine CSS-Transitions/Animationen:** Alles muss über `useCurrentFrame()`, `interpolate()`, `spring()` laufen
- **Keine auto-play Medien:** Audio/Video nur über Remotion-Komponenten (`<Audio>`, `<Video>`)
- **`<Img>` statt `<img>`:** Remotion's eigene Img-Komponente für korrekte Frame-Synchronisation
- **Determinismus:** Keine `Math.random()`, kein `Date.now()` — alles vom Frame abhängig
- **Rendering:** `npx remotion render src/remotion/Root.tsx BarChartRace out/video.mp4`

### AI-Researcher
- Claude API mit `tools: [{ type: "web_search_20250305", name: "web_search" }]`
- Agent-Loop: Mehrere API-Calls erlaubt bis Daten vollständig
- System-Prompt definiert exaktes Output-JSON-Schema
- Themen-History aus DB mitgeben damit kein Blickwinkel doppelt kommt
- Logo/Bild-URLs: AI sucht passende Logos via Web Search
- Sinnvolle Defaults wenn Daten lückenhaft (Interpolation, letztbekannter Wert)

### Scheduling (extern)
- Cron: `0 8 * * 1 curl -X POST https://app/api/generate -d '{"topic":"Aktien"}'`
- GitHub Actions: Scheduled Workflow mit `curl`
- Webhook: Jeder HTTP-Client kann den Endpunkt triggern
- Die App selbst hat KEINEN eigenen Scheduler — sie reagiert nur auf Anfragen

---

## Qualitätsmassstäbe

Die generierten Videos sollen visuell auf dem Niveau von **Flourish Studio** oder dem YouTube-Kanal **"Data is Beautiful"** sein:
- Butterweiche Animationen (keine Ruckler, kein Flackern)
- Professionelle Typografie (gut lesbare Labels, schöne Zahlen-Counter)
- Stimmige Farbpaletten
- Korrekte Sortierung und Reordering ohne visuelle Artefakte
- Saubere Balken-Kanten und Logo-Darstellung
- Passende Musik die zum Tempo der Animation passt

---

## Starte mit Phase 1, Story 1.1

**Wenn PROGRESS.md bereits existiert:** Lies sie zuerst und mach bei der dort angegebenen Story weiter.

**Wenn neues Projekt:** Beginne mit dem Projekt-Setup:
1. `git init` + `.gitignore`
2. `CLAUDE.md` erstellen (mit den Projekt-Regeln, siehe oben)
3. `.claude/settings.json` erstellen (mit den Permissions, siehe oben)
4. `PROGRESS.md` erstellen (mit dem initialen Tracking, siehe oben)
5. Next.js 16 + Remotion installieren und konfigurieren
6. Remotion Agent Skills installieren (`npx skills add remotion-dev/skills`)
7. Beispieldaten anlegen (Top 10 Tech-Firmen nach Umsatz 2015-2025, z.B. Apple, Microsoft, Google, Amazon, Meta, Samsung, Tesla, NVIDIA, TSMC, Netflix)
8. Grundstruktur erstellen mit `Root.tsx` und einer leeren `BarChartRace` Composition
9. **PROGRESS.md aktualisieren:** Story 1.1 → `[x]`, aktuelle Story → 1.2
10. **Commit: `chore(setup): initialize Next.js 16 + Remotion project with CLAUDE.md and permissions`**

Fahre dann direkt mit Story 1.2 fort: Implementiere die Kern-Animation. Nutze `useCurrentFrame()` und `interpolate()` für die zeitbasierte Animation. Verwende D3.js für die Balken-Berechnung. Die Balken sollen smooth animieren, ihre Position wechseln und Werte als animierte Counter anzeigen.

**Nach der Implementation: Rendere Remotion Stills (`npx remotion still`) an verschiedenen Zeitpunkten, analysiere die Frames und verbessere das Resultat iterativ, bis es professionell aussieht. Dann Commit.**
