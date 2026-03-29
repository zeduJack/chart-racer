import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const SCREENSHOTS_DIR = path.join(__dirname, "../screenshots");

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

test.describe("ChartRacer Dashboard", () => {
  test("zeigt korrekten Titel und Navigation", async ({ page }) => {
    await page.goto("/");
    // Auf den Seitentitel warten statt auf networkidle (Remotion Player streamt kontinuierlich)
    await expect(page.getByText("ChartRacer").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Bar Chart Race Videos")).toBeVisible();
    await expect(page.getByText("Preview")).toBeVisible();
  });

  test("zeigt Stats-Karten", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("ChartRacer").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("2015 – 2025").first()).toBeVisible();
    await expect(page.getByText("1920 × 1080 · 30fps")).toBeVisible();
    await expect(page.getByText("Bar Chart Race", { exact: true })).toBeVisible();
  });

  test("zeigt Render-Commands", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("ChartRacer").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("npm run render", { exact: true })).toBeVisible();
    await expect(page.getByText("npm run render:reels")).toBeVisible();
    await expect(page.getByText("npm run render:square")).toBeVisible();
  });

  test("hat keine JS-Konsolenfehler beim Laden", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await expect(page.getByText("ChartRacer").first()).toBeVisible({ timeout: 15000 });
    // Kurz warten für Client-seitige Hydration
    await page.waitForTimeout(3000);

    // Nur kritische Fehler prüfen (Remotion-interne Warnungen ignorieren)
    const criticalErrors = errors.filter(
      (e) => !e.includes("Warning") && !e.includes("remotion")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("Screenshot der vollständigen Dashboard-Seite", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("ChartRacer").first()).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(2500); // Player-Initialisierung

    const screenshotPath = path.join(SCREENSHOTS_DIR, "dashboard-full.png");
    await page.screenshot({ path: screenshotPath, fullPage: true });

    expect(fs.existsSync(screenshotPath)).toBe(true);
    const { size } = fs.statSync(screenshotPath);
    expect(size).toBeGreaterThan(50_000);
    console.log(`Screenshot: ${screenshotPath} (${(size / 1024).toFixed(0)} KB)`);
  });
});
