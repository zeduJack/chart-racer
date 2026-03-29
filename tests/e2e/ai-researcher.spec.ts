/**
 * Tests für den AI-Researcher
 *
 * Bei vorhandenem ANTHROPIC_API_KEY: echter API-Call
 * Ohne Key: Validierungs-Tests mit Mock-Daten
 */

import { test, expect } from "@playwright/test";
import { researchTopic } from "../../src/lib/ai-researcher";

// Mock-Ergebnis das der AI-Researcher zurückgeben würde
const MOCK_RESULT = {
  angle: "Top 5 Tech-Aktien Performance 2020-2024",
  title: "Tech Giants: Kursperformance 2020–2024",
  subtitle: "Aktienkurs in USD",
  timeUnit: "year" as const,
  timeLabels: ["2020", "2021", "2022", "2023", "2024"],
  participants: [
    { name: "Apple", color: "#6b7280", values: [130, 180, 130, 190, 250] },
    { name: "Microsoft", color: "#0078d4", values: [220, 340, 240, 380, 450] },
    { name: "Alphabet", color: "#4285f4", values: [87, 144, 88, 140, 180] },
    { name: "Amazon", color: "#ff9900", values: [163, 188, 84, 153, 200] },
    { name: "NVIDIA", color: "#76b900", values: [13, 30, 15, 50, 130] },
  ],
  valueFormat: { prefix: "$", suffix: "", abbreviate: false },
  suggestedPalette: "tech-neon",
  socialMedia: {
    title: "Which stock grew 900%? 📈",
    description: "Tech-Aktien Performance Vergleich",
    hashtags: ["#stocks", "#investing"],
  },
};

test.describe("AI Researcher Modul", () => {
  test("ResearchResult Interface hat alle Pflichtfelder", () => {
    // Validiert Struktur des Mock-Ergebnisses
    expect(MOCK_RESULT).toHaveProperty("angle");
    expect(MOCK_RESULT).toHaveProperty("title");
    expect(MOCK_RESULT).toHaveProperty("subtitle");
    expect(MOCK_RESULT).toHaveProperty("timeUnit");
    expect(MOCK_RESULT).toHaveProperty("timeLabels");
    expect(MOCK_RESULT).toHaveProperty("participants");
    expect(MOCK_RESULT).toHaveProperty("valueFormat");
  });

  test("Teilnehmer haben korrekte Anzahl Werte", () => {
    for (const p of MOCK_RESULT.participants) {
      expect(p.values.length).toBe(MOCK_RESULT.timeLabels.length);
      expect(p.values.every((v) => v > 0)).toBe(true);
    }
  });

  test("Mindestanforderungen: 5+ Teilnehmer, 5+ Zeitpunkte", () => {
    expect(MOCK_RESULT.participants.length).toBeGreaterThanOrEqual(5);
    expect(MOCK_RESULT.timeLabels.length).toBeGreaterThanOrEqual(5);
  });

  test("Farben sind gültige Hex-Werte", () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    for (const p of MOCK_RESULT.participants) {
      expect(p.color).toMatch(hexPattern);
    }
  });

  test("AI-Researcher Funktion ist importierbar", () => {
    expect(typeof researchTopic).toBe("function");
  });

  test("Echter API-Call: Thema 'Technologie' liefert valides Ergebnis", async () => {
    test.skip(!process.env.ANTHROPIC_API_KEY, "Kein ANTHROPIC_API_KEY gesetzt");
    test.setTimeout(120_000); // 2 Minuten für Web Search

    const result = await researchTopic("Technologie", []);

    expect(result.participants.length).toBeGreaterThanOrEqual(5);
    expect(result.timeLabels.length).toBeGreaterThanOrEqual(5);
    expect(result.angle).toBeTruthy();
    expect(result.title).toBeTruthy();

    // Werte-Konsistenz prüfen
    for (const p of result.participants) {
      expect(p.values.length).toBe(result.timeLabels.length);
    }
  });
});
