/**
 * Remotion Still-Rendering + visuelle Analyse
 *
 * Rendert 5 Frames an definierten Zeitpunkten und prüft:
 * - Datei wurde erstellt (nicht leer)
 * - Dateigrösse sinnvoll (> 50KB = hat Inhalt)
 *
 * Für tiefere Analyse: Screenshots manuell öffnen und prüfen.
 */
import { test, expect } from "@playwright/test";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const STILLS_DIR = path.join(process.cwd(), "out/stills");
const ENTRY = path.join(process.cwd(), "src/remotion/index.ts");

// Frames: Start, 25%, 50%, 75%, Ende der Race-Animation
// Intro = 75 Frames, Race = 600, Outro = 90 → Total = 765
const CHECKPOINTS = [
  { frame: 37,  label: "intro-mitte" },
  { frame: 110, label: "race-start-2015" },
  { frame: 375, label: "race-mitte-2020" },
  { frame: 600, label: "race-ende-2024" },
  { frame: 720, label: "outro" },
];

test.describe("Remotion Stills — 5 Checkpoints", () => {
  test.beforeAll(() => {
    fs.mkdirSync(STILLS_DIR, { recursive: true });
  });

  for (const { frame, label } of CHECKPOINTS) {
    test(`Frame ${frame} (${label}) rendert korrekt`, () => {
      const outputPath = path.join(STILLS_DIR, `check-${label}.png`);

      execSync(
        `npx remotion still "${ENTRY}" BarChartRace "${outputPath}" --frame=${frame}`,
        { stdio: "pipe" }
      );

      expect(fs.existsSync(outputPath)).toBe(true);

      const { size } = fs.statSync(outputPath);
      expect(size).toBeGreaterThan(50_000); // > 50KB = hat echten Inhalt
      console.log(`  ✓ ${label}: ${(size / 1024).toFixed(0)} KB`);
    });
  }
});
