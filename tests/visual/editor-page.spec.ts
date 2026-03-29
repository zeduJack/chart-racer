/**
 * Tests für die Editor-Seite
 * Nutzt HTTP-Requests (kein Browser-Binary nötig) für den Linux-Server.
 * Browser-basierte Visual-Tests: manuell via `npx playwright show-report` ausführen.
 */

import { test, expect } from "@playwright/test";

test.describe("Editor-Seite (HTTP)", () => {
  test("GET /editor gibt HTTP 200 zurück", async ({ request }) => {
    const res = await request.get("/editor");
    expect(res.status()).toBe(200);
  });

  test("Editor-HTML enthält Titel 'Video generieren'", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    expect(html).toContain("Video generieren");
  });

  test("Editor-HTML enthält Thema-Input Placeholder", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    expect(html).toContain("Tech-Aktien");
  });

  test("Editor-HTML enthält Format-Optionen", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    expect(html).toContain("16:9");
    expect(html).toContain("9:16");
    expect(html).toContain("1:1");
  });

  test("Editor-HTML enthält Navigation-Links", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    expect(html).toContain("/editor");
    expect(html).toContain("/videos");
    expect(html).toContain("Preview");
  });

  test("Editor-HTML enthält API-Key-Warnung", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    expect(html).toContain("ANTHROPIC_API_KEY");
  });

  test("Editor-HTML enthält KI-Recherche Info", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    expect(html).toContain("KI-Recherche");
  });

  test("Hauptseite verlinkt auf Editor", async ({ request }) => {
    const res = await request.get("/");
    const html = await res.text();
    expect(html).toContain("/editor");
  });
});
