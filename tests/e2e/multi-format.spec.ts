import { test, expect } from "@playwright/test";
import { computeLayout } from "../../src/remotion/hooks/useBarPositions";

test.describe("Multi-Format Layout", () => {
  test("16:9 Layout — Standard 1920×1080", () => {
    const layout = computeLayout(1920, 1080);
    expect(layout.canvasWidth).toBe(1920);
    expect(layout.canvasHeight).toBe(1080);
    expect(layout.paddingLeft).toBe(300);
    expect(layout.paddingRight).toBe(100);
    expect(layout.paddingTop).toBe(160);
    expect(layout.paddingBottom).toBe(100);
    expect(layout.scale).toBe(1);
  });

  test("9:16 Layout — 1080×1920 (Reels/TikTok)", () => {
    const layout = computeLayout(1080, 1920);
    expect(layout.canvasWidth).toBe(1080);
    expect(layout.canvasHeight).toBe(1920);
    // paddingLeft skaliert mit Breite
    expect(layout.paddingLeft).toBe(Math.round(300 * (1080 / 1920)));
    // paddingTop skaliert mit Höhe
    expect(layout.paddingTop).toBe(Math.round(160 * (1920 / 1080)));
    // scale = min(scaleX, scaleY) = min(1080/1920, 1920/1080)
    const scaleX = 1080 / 1920;
    expect(layout.scale).toBeCloseTo(scaleX, 4);
  });

  test("1:1 Layout — 1080×1080 (Instagram)", () => {
    const layout = computeLayout(1080, 1080);
    expect(layout.canvasWidth).toBe(1080);
    expect(layout.canvasHeight).toBe(1080);
    const scaleX = 1080 / 1920;
    const scaleY = 1080 / 1080;
    const scale = Math.min(scaleX, scaleY);
    expect(layout.scale).toBeCloseTo(scale, 4);
  });

  test("maxBarWidth ist korrekt berechnet für alle Formate", () => {
    for (const [w, h] of [[1920, 1080], [1080, 1920], [1080, 1080]] as [number, number][]) {
      const layout = computeLayout(w, h);
      const maxBarWidth = layout.canvasWidth - layout.paddingLeft - layout.paddingRight;
      expect(maxBarWidth).toBeGreaterThan(0);
      expect(maxBarWidth).toBeLessThan(w);
    }
  });

  test("scale ist immer > 0", () => {
    for (const [w, h] of [[1920, 1080], [1080, 1920], [1080, 1080], [640, 360]] as [number, number][]) {
      const layout = computeLayout(w, h);
      expect(layout.scale).toBeGreaterThan(0);
    }
  });

  test("16:9 hat maximale scale = 1", () => {
    const layout = computeLayout(1920, 1080);
    expect(layout.scale).toBe(1);
  });

  test("kleinere Formate haben scale < 1", () => {
    const layout9x16 = computeLayout(1080, 1920);
    const layout1x1 = computeLayout(1080, 1080);
    expect(layout9x16.scale).toBeLessThan(1);
    expect(layout1x1.scale).toBeLessThan(1);
  });

  test("alle Paddings sind positiv", () => {
    for (const [w, h] of [[1920, 1080], [1080, 1920], [1080, 1080]] as [number, number][]) {
      const layout = computeLayout(w, h);
      expect(layout.paddingLeft).toBeGreaterThan(0);
      expect(layout.paddingRight).toBeGreaterThan(0);
      expect(layout.paddingTop).toBeGreaterThan(0);
      expect(layout.paddingBottom).toBeGreaterThan(0);
    }
  });
});
