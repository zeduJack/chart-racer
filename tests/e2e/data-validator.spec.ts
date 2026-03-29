/**
 * Tests für Daten-Validierung und Fallback-Logik
 */

import { test, expect } from "@playwright/test";
import {
  validateAndRepair,
  buildRetryHint,
} from "../../src/lib/data-validator";
import type { ResearchResult } from "../../src/lib/ai-researcher";

function makeValid(): ResearchResult {
  return {
    angle: "Test Blickwinkel",
    title: "Test Titel",
    subtitle: "Test Untertitel",
    timeUnit: "year",
    timeLabels: ["2020", "2021", "2022", "2023", "2024"],
    participants: [
      { name: "A", color: "#ff0000", values: [10, 20, 30, 40, 50] },
      { name: "B", color: "#00ff00", values: [50, 40, 30, 20, 10] },
      { name: "C", color: "#0000ff", values: [30, 30, 30, 30, 30] },
    ],
    valueFormat: { prefix: "$", suffix: "", abbreviate: false },
  };
}

test.describe("Data Validator", () => {
  test("Gültige Daten werden als valid markiert", () => {
    const result = validateAndRepair(makeValid());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toBeDefined();
  });

  test("Fehlender Titel wird als Fehler erkannt", () => {
    const data = makeValid();
    data.title = "";
    const result = validateAndRepair(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Titel"))).toBe(true);
  });

  test("Zu wenige Zeitpunkte werden abgelehnt", () => {
    const data = makeValid();
    data.timeLabels = ["2020", "2021"];
    data.participants.forEach((p) => (p.values = p.values.slice(0, 2)));
    const result = validateAndRepair(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Zeitpunkte"))).toBe(true);
  });

  test("Zu wenige Teilnehmer werden abgelehnt", () => {
    const data = makeValid();
    data.participants = data.participants.slice(0, 1);
    const result = validateAndRepair(data);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Teilnehmer"))).toBe(true);
  });

  test("Zu kurze Werte-Arrays werden interpoliert", () => {
    const data = makeValid();
    data.participants[0].values = [10, 20]; // Nur 2 statt 5 Werte
    const result = validateAndRepair(data);
    expect(result.valid).toBe(true);
    expect(result.data!.participants[0].values.length).toBe(5);
    expect(result.warnings.some((w) => w.includes("interpoliert"))).toBe(true);
  });

  test("Zu lange Werte-Arrays werden gekürzt", () => {
    const data = makeValid();
    data.participants[0].values = [10, 20, 30, 40, 50, 60, 70]; // 7 statt 5
    const result = validateAndRepair(data);
    expect(result.valid).toBe(true);
    expect(result.data!.participants[0].values.length).toBe(5);
  });

  test("Negative Werte werden auf 0 gesetzt", () => {
    const data = makeValid();
    data.participants[0].values = [-10, 20, -5, 40, 50];
    const result = validateAndRepair(data);
    expect(result.valid).toBe(true);
    expect(result.data!.participants[0].values[0]).toBe(0);
    expect(result.data!.participants[0].values[2]).toBe(0);
  });

  test("Teilnehmer ohne Farbe bekommt generierten Hex-Wert", () => {
    const data = makeValid();
    data.participants[0].color = "";
    const result = validateAndRepair(data);
    expect(result.valid).toBe(true);
    expect(result.data!.participants[0].color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  test("Teilnehmer mit allen Null-Werten wird entfernt", () => {
    const data = makeValid();
    // 4 Teilnehmer, einer davon nur Nullen
    data.participants.push({ name: "D", color: "#cccccc", values: [0, 0, 0, 0, 0] });
    const result = validateAndRepair(data);
    expect(result.valid).toBe(true);
    expect(result.data!.participants.find((p) => p.name === "D")).toBeUndefined();
    expect(result.warnings.some((w) => w.includes("D") && w.includes("entfernt"))).toBe(true);
  });

  test("buildRetryHint enthält Fehler und Mindestanforderungen", () => {
    const hint = buildRetryHint(["Zu wenige Teilnehmer"], ["Teilnehmer X entfernt"]);
    expect(hint).toContain("Zu wenige Teilnehmer");
    expect(hint).toContain("Teilnehmer X entfernt");
    expect(hint).toContain("Mindestens");
  });
});
