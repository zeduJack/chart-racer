import { test, expect } from "@playwright/test";
import { TEMPLATES, DEFAULT_TEMPLATE_ID, getTemplate } from "../../src/lib/templates";

test.describe("Template-System", () => {
  test("hat mindestens 4 Templates", () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(4);
  });

  test("jedes Template hat alle Pflichtfelder", () => {
    for (const t of TEMPLATES) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.emoji).toBeTruthy();
      expect(t.palette.length).toBeGreaterThanOrEqual(4);
      // Style-Felder
      expect(t.style.visibleBars).toBeGreaterThan(0);
      expect(t.style.durationPerStep).toBeGreaterThan(0);
      expect(t.style.barHeight).toBeGreaterThan(0);
      expect(t.style.barGap).toBeGreaterThan(0);
    }
  });

  test("IDs sind eindeutig", () => {
    const ids = TEMPLATES.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("getTemplate() findet Template per ID", () => {
    const t = getTemplate("corporate");
    expect(t).toBeDefined();
    expect(t?.name).toBe("Corporate");
  });

  test("getTemplate() gibt undefined für unbekannte ID", () => {
    expect(getTemplate("existiert-nicht")).toBeUndefined();
  });

  test("DEFAULT_TEMPLATE_ID ist ein gültiges Template", () => {
    const t = getTemplate(DEFAULT_TEMPLATE_ID);
    expect(t).toBeDefined();
  });

  test("Dynamic-Template hat schnelle Animations-Einstellungen", () => {
    const t = getTemplate("dynamic");
    expect(t).toBeDefined();
    expect(t!.style.durationPerStep).toBeLessThanOrEqual(45);
  });

  test("Cinematic-Template hat langsame Animations-Einstellungen", () => {
    const t = getTemplate("cinematic");
    expect(t).toBeDefined();
    expect(t!.style.durationPerStep).toBeGreaterThanOrEqual(60);
  });

  test("Minimal-Template hat wenige Balken", () => {
    const t = getTemplate("minimal");
    expect(t).toBeDefined();
    expect(t!.style.visibleBars).toBeLessThanOrEqual(6);
  });

  test("alle Farben in Paletten sind gültige Hex-Werte", () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    for (const t of TEMPLATES) {
      for (const color of t.palette) {
        expect(color).toMatch(hexRegex);
      }
    }
  });
});
