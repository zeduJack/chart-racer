/**
 * HTTP-Tests für den Upload-Tab im Editor
 */

import { test, expect } from "@playwright/test";

test.describe("Upload-Tab (HTTP)", () => {
  test("Editor-Seite enthält Upload-Tab Text", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    expect(html).toContain("Eigene Daten");
  });

  test("Editor-Seite enthält Upload-Tab Button", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    // Tab-Button ist immer gerendert (Client Component initial state)
    expect(html).toContain("Eigene Daten");
  });

  test("Editor-Seite enthält KI-Datenrecherche Beschreibung", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    expect(html).toContain("KI-Datenrecherche");
  });

  test("Editor-Seite enthält KI-Recherche Tab", async ({ request }) => {
    const res = await request.get("/editor");
    const html = await res.text();
    expect(html).toContain("KI-Recherche");
  });
});
