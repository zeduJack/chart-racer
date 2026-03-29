/**
 * Tests für den Upload-und-Render-Flow (Eigene Daten Tab)
 *
 * Verifiziert dass /api/generate mit eigenen Daten funktioniert
 * OHNE ANTHROPIC_API_KEY — kein AI-Schritt nötig.
 *
 * Nutzt HTTP-Request-basierte Tests (kein Browser-Binary nötig).
 */

import { test, expect } from "@playwright/test";

const CROATIAN_DATA = {
  title: "Croatian Diaspora: Croats Living Abroad",
  subtitle: "Population by Country (1890–2021)",
  timeLabels: ["1890", "1920", "1950", "1980", "1991", "2001", "2011", "2021"],
  participants: [
    { name: "USA",         color: "#3b82f6", values: [20000,  80000,  150000, 250000, 350000, 400000,  600000, 1200000] },
    { name: "Germany",     color: "#60a5fa", values: [5000,   30000,  100000, 250000, 150000, 200000,  350000,  500000] },
    { name: "Argentina",   color: "#93c5fd", values: [10000, 100000,  180000, 220000, 230000, 240000,  245000,  250000] },
    { name: "Chile",       color: "#bfdbfe", values: [5000,   50000,  150000, 280000, 300000, 320000,  350000,  400000] },
    { name: "Australia",   color: "#1e3a8a", values: [2000,   10000,   50000, 100000, 120000, 140000,  150000,  164000] },
    { name: "Austria",     color: "#fbbf24", values: [50000,  80000,  100000, 130000, 140000, 145000,  148000,  151000] },
    { name: "Canada",      color: "#ef4444", values: [5000,   20000,   40000,  80000, 100000, 115000,  125000,  134000] },
    { name: "Switzerland", color: "#22c55e", values: [2000,   10000,   40000,  70000,  75000,  78000,   79000,   80000] },
    { name: "Brazil",      color: "#f97316", values: [5000,   30000,   60000,  65000,  68000,  70000,   71000,   70000] },
    { name: "Peru",        color: "#a855f7", values: [500,     2000,   10000,  50000, 100000, 150000,  180000,  195000] },
  ],
  valueFormat: { abbreviate: true },
};

test.describe("Upload-Render Flow (Eigene Daten)", () => {
  test("Editor-Seite enthält Tab 'Eigene Daten'", async ({ request }) => {
    const res = await request.get("/editor");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain("Eigene Daten");
  });

  test("Editor-Seite enthält 'Eigene Daten hochladen' Beschreibung", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    // Sicherstellen dass der Upload-Tab im Editor vorhanden ist
    expect(html).toContain("Eigene Daten");
    expect(html).toContain("KI-Recherche");
  });

  test("POST /api/generate mit eigenen Daten (dryRun) funktioniert OHNE API-Key", async ({ request }) => {
    const res = await request.post("/api/generate", {
      data: { data: CROATIAN_DATA, format: "16:9", dryRun: true },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("dry-run");
    expect(body.data).toBeDefined();
    expect(body.data.title).toBe("Croatian Diaspora: Croats Living Abroad");
    expect(body.data.participants).toHaveLength(10);
    expect(body.data.timeLabels).toHaveLength(8);
  });

  test("POST /api/generate mit eigenen Daten validiert Datenstruktur", async ({ request }) => {
    // Vollständige Daten → 200
    const res = await request.post("/api/generate", {
      data: { data: CROATIAN_DATA, format: "16:9", dryRun: true },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.participants[0].name).toBe("USA");
    expect(body.data.participants[0].values[7]).toBe(1200000);
  });

  test("POST /api/generate ohne data gibt 400 zurück", async ({ request }) => {
    const res = await request.post("/api/generate", {
      data: { format: "16:9" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test("POST /api/generate mit fehlenden participants gibt 400 zurück", async ({ request }) => {
    const res = await request.post("/api/generate", {
      data: { data: { title: "Test", timeLabels: ["2020"] }, format: "16:9" },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/generate benötigt KEINEN ANTHROPIC_API_KEY", async ({ request }) => {
    // Dieser Test verifiziert explizit: kein API-Key-Check in /api/generate
    const res = await request.post("/api/generate", {
      data: { data: CROATIAN_DATA, format: "16:9", dryRun: true },
    });
    const body = await res.json();

    // Darf NICHT mit API-Key-Fehler scheitern
    expect(body.error ?? "").not.toContain("ANTHROPIC_API_KEY");
    expect(res.status()).toBe(200);
  });

  test("POST /api/generate unterstützt alle Formate", async ({ request }) => {
    for (const format of ["16:9", "9:16", "1:1"]) {
      const res = await request.post("/api/generate", {
        data: { data: CROATIAN_DATA, format, dryRun: true },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.status).toBe("dry-run");
    }
  });
});
