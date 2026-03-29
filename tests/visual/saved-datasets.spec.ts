/**
 * Playwright-Tests für Datensatz-Verwaltung:
 * Speichern, in Preview laden, abspielen, CSV/JSON herunterladen
 */

import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const BASE = "http://localhost:3003";
const SCREENSHOTS_DIR = path.join(__dirname, "../screenshots");

const SAMPLE_DATA = {
  name: "E2E-Test Datensatz",
  data: {
    title: "Tech Marktkapitalisierung",
    subtitle: "in Milliarden USD",
    timeLabels: ["2020", "2021", "2022", "2023"],
    participants: [
      { name: "Apple", color: "#6b7280", values: [274, 366, 394, 383] },
      { name: "Microsoft", color: "#0078d4", values: [143, 168, 198, 212] },
      { name: "Alphabet", color: "#4285f4", values: [183, 258, 283, 307] },
    ],
  },
};

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

// Hilfsfunktion: Test-Datensatz anlegen und am Ende wieder löschen
async function createAndCleanDataset(
  request: Parameters<Parameters<typeof test>[1]>[0]["request"],
  cleanup: (id: number) => void
): Promise<number> {
  const res = await request.post(`${BASE}/api/datasets`, {
    data: SAMPLE_DATA,
    headers: { "Content-Type": "application/json" },
  });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  cleanup(json.id);
  return json.id;
}

test.describe("Datensatz: Speichern via API", () => {
  test("POST /api/datasets speichert Datensatz und gibt ID zurück", async ({ request }) => {
    const res = await request.post(`${BASE}/api/datasets`, {
      data: SAMPLE_DATA,
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(201);
    const json = await res.json();
    expect(json.id).toBeGreaterThan(0);
    expect(json.name).toBe(SAMPLE_DATA.name);

    // Aufräumen
    await request.delete(`${BASE}/api/datasets?id=${json.id}`);
  });

  test("GET /api/datasets listet gespeicherte Datensätze", async ({ request }) => {
    // Zuerst einen anlegen
    const createRes = await request.post(`${BASE}/api/datasets`, {
      data: SAMPLE_DATA,
      headers: { "Content-Type": "application/json" },
    });
    const { id } = await createRes.json();

    const listRes = await request.get(`${BASE}/api/datasets`);
    expect(listRes.ok()).toBeTruthy();
    const list = await listRes.json();
    expect(Array.isArray(list)).toBeTruthy();
    const found = list.find((d: { id: number }) => d.id === id);
    expect(found).toBeDefined();
    expect(found.name).toBe(SAMPLE_DATA.name);

    // Aufräumen
    await request.delete(`${BASE}/api/datasets?id=${id}`);
  });

  test("DELETE /api/datasets entfernt Datensatz", async ({ request }) => {
    const createRes = await request.post(`${BASE}/api/datasets`, {
      data: SAMPLE_DATA,
      headers: { "Content-Type": "application/json" },
    });
    const { id } = await createRes.json();

    const deleteRes = await request.delete(`${BASE}/api/datasets?id=${id}`);
    expect(deleteRes.ok()).toBeTruthy();

    // Prüfen ob wirklich weg
    const listRes = await request.get(`${BASE}/api/datasets`);
    const list = await listRes.json();
    const found = list.find((d: { id: number }) => d.id === id);
    expect(found).toBeUndefined();
  });
});

test.describe("Datensatz: Upload & Speichern via UI", () => {
  test("Beispiel-CSV laden, parsen und in DB speichern", async ({ page, request }) => {
    await page.goto("/editor");
    await expect(page.getByText("Editor").first()).toBeVisible({ timeout: 15000 });

    // Tab «Eigene Daten» öffnen
    await page.getByRole("button", { name: /Eigene Daten/ }).click();
    await expect(page.getByText("Eigene Daten hochladen")).toBeVisible();

    // Beispiel laden
    await page.getByRole("button", { name: "Beispiel laden" }).click();
    await expect(page.getByText("Daten erkannt")).toBeVisible({ timeout: 5000 });

    // Eindeutiger Name für diesen Test
    const testName = `E2E-Upload-${Date.now()}`;
    // Name-Input im Speichern-Bereich (liegt unterhalb "In Datenbank speichern")
    const saveSection = page.locator("text=In Datenbank speichern").locator("..");
    const nameInput = saveSection.locator("input[type=text]");
    await nameInput.fill(testName);

    // Speichern klicken
    await page.getByRole("button", { name: "Speichern" }).click();
    await expect(page.getByText("✓ Gespeichert")).toBeVisible({ timeout: 5000 });

    // Aufräumen via API
    const listRes = await request.get(`${BASE}/api/datasets`);
    const list = await listRes.json();
    const created = list.find((d: { name: string }) => d.name === testName);
    if (created) {
      await request.delete(`${BASE}/api/datasets?id=${created.id}`);
    }
  });
});

test.describe("Datensatz: Im Gespeichert-Tab anzeigen", () => {
  let createdId: number;

  test.beforeAll(async ({ request }) => {
    const res = await request.post(`${BASE}/api/datasets`, {
      data: SAMPLE_DATA,
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    createdId = json.id;
  });

  test.afterAll(async ({ request }) => {
    if (createdId) {
      await request.delete(`${BASE}/api/datasets?id=${createdId}`);
    }
  });

  test("Gespeichert-Tab zeigt den Datensatz mit Name und Metadaten", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.getByText("Editor").first()).toBeVisible({ timeout: 15000 });

    // Tab «Gespeichert» öffnen
    await page.getByRole("button", { name: /Gespeichert/ }).click();
    await expect(page.getByText("Gespeicherte Daten")).toBeVisible();

    // Datensatz-Name soll sichtbar sein
    await expect(page.getByText(SAMPLE_DATA.name)).toBeVisible({ timeout: 8000 });

    // Metadaten: Teilnehmer-Anzahl
    await expect(page.getByText(/3 Teilnehmer/)).toBeVisible();
  });

  test("Buttons haben korrekte title-Attribute (Hover-Text)", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.getByText("Editor").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /Gespeichert/ }).click();
    await expect(page.getByText(SAMPLE_DATA.name)).toBeVisible({ timeout: 8000 });

    // «In Preview laden» Button
    const loadBtn = page.getByRole("button", { name: "In Preview laden" }).first();
    await expect(loadBtn).toHaveAttribute("title", /[Pp]review|[Pp]layer|[Vv]orschau/);

    // CSV-Button
    const csvBtn = page.getByRole("button", { name: "CSV" }).first();
    await expect(csvBtn).toHaveAttribute("title", /CSV|herunterladen/i);

    // JSON-Button
    const jsonBtn = page.getByRole("button", { name: "JSON" }).first();
    await expect(jsonBtn).toHaveAttribute("title", /JSON|herunterladen/i);

    // Löschen-Button
    const deleteBtn = page.getByTitle(/[Ll]öschen|[Dd]atenbank/).first();
    await expect(deleteBtn).toBeVisible();
  });

  test("«In Preview laden» wechselt zu Upload-Tab mit geladenen Daten", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.getByText("Editor").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /Gespeichert/ }).click();
    await expect(page.getByText(SAMPLE_DATA.name)).toBeVisible({ timeout: 8000 });

    // In Preview laden klicken
    await page.getByRole("button", { name: "In Preview laden" }).first().click();

    // Soll zum Upload-Tab wechseln und Daten anzeigen
    await expect(page.getByText("Eigene Daten hochladen")).toBeVisible({ timeout: 5000 });
    // Der Titel des Datensatzes soll sichtbar sein
    await expect(page.getByText("Tech Marktkapitalisierung")).toBeVisible({ timeout: 5000 });
  });

  test("Nach «In Preview laden» ist Live-Preview spielbar", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.getByText("Editor").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /Gespeichert/ }).click();
    await expect(page.getByText(SAMPLE_DATA.name)).toBeVisible({ timeout: 8000 });
    await page.getByRole("button", { name: "In Preview laden" }).first().click();

    // Live-Preview öffnen
    await page.getByRole("button", { name: /Live-Preview/ }).click();

    // Warten bis der Player-Container sichtbar ist (Remotion rendert in einen div mit bg-black)
    await expect(page.locator(".bg-black.shadow-xl").first()).toBeVisible({ timeout: 10000 });
    // Player-Metadaten sollen sichtbar sein
    await expect(page.getByText(/1920×1080|9:16|1:1/).first()).toBeVisible({ timeout: 5000 });

    // Screenshot
    const screenshotPath = path.join(SCREENSHOTS_DIR, "saved-dataset-preview.png");
    await page.screenshot({ path: screenshotPath, fullPage: false });
    expect(fs.existsSync(screenshotPath)).toBeTruthy();
  });
});

test.describe("Datensatz: Download auf Disk", () => {
  let createdId: number;

  test.beforeAll(async ({ request }) => {
    const res = await request.post(`${BASE}/api/datasets`, {
      data: SAMPLE_DATA,
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    createdId = json.id;
  });

  test.afterAll(async ({ request }) => {
    if (createdId) {
      await request.delete(`${BASE}/api/datasets?id=${createdId}`);
    }
  });

  test("CSV-Download: Datei wird heruntergeladen und hat korrekten Inhalt", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.getByText("Editor").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /Gespeichert/ }).click();
    await expect(page.getByText(SAMPLE_DATA.name)).toBeVisible({ timeout: 8000 });

    // Download-Event abfangen (funktioniert auf Mac, Windows und Linux)
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "CSV" }).first().click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.csv$/i);

    // Datei-Inhalt prüfen
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, "utf-8");
      expect(content).toContain("Apple");
      expect(content).toContain("Microsoft");
      expect(content).toContain("2020");
      expect(content).toContain("2023");
    }
  });

  test("JSON-Download: Datei wird heruntergeladen und ist valides JSON", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.getByText("Editor").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /Gespeichert/ }).click();
    await expect(page.getByText(SAMPLE_DATA.name)).toBeVisible({ timeout: 8000 });

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "JSON" }).first().click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/\.json$/i);

    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, "utf-8");
      // Muss valides JSON sein
      const parsed = JSON.parse(content);
      expect(parsed.title).toBe("Tech Marktkapitalisierung");
      expect(parsed.participants).toHaveLength(3);
      expect(parsed.timeLabels).toContain("2020");
    }
  });

  test("CSV-Download-Dateiname entspricht Datensatz-Name", async ({ page }) => {
    await page.goto("/editor");
    await expect(page.getByText("Editor").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: /Gespeichert/ }).click();
    await expect(page.getByText(SAMPLE_DATA.name)).toBeVisible({ timeout: 8000 });

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "CSV" }).first().click(),
    ]);

    // Dateiname soll den Datensatz-Namen enthalten
    expect(download.suggestedFilename()).toContain("E2E-Test");
  });
});
