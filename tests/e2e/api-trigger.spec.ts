/**
 * Tests für die API-Endpunkte
 * Testet /api/generate, /api/research, /api/videos, /api/topics via HTTP
 */

import { test, expect } from "@playwright/test";

test.describe("API Endpunkte", () => {
  test("GET /api/generate gibt Hilfetext zurück", async ({ request }) => {
    const res = await request.get("/api/generate");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toContain("POST");
  });

  test("GET /api/research gibt Hilfetext zurück", async ({ request }) => {
    const res = await request.get("/api/research");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toContain("POST");
  });

  test("GET /api/videos gibt leere oder befüllte Liste zurück", async ({ request }) => {
    const res = await request.get("/api/videos");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.videos)).toBe(true);
  });

  test("GET /api/topics gibt leere oder befüllte Liste zurück", async ({ request }) => {
    const res = await request.get("/api/topics");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.topics)).toBe(true);
  });

  test("POST /api/generate ohne data gibt 400 zurück", async ({ request }) => {
    const res = await request.post("/api/generate", {
      data: { format: "16:9" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test("POST /api/research ohne topic gibt 400 zurück", async ({ request }) => {
    const res = await request.post("/api/research", {
      data: {},
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test("POST /api/research ohne API-Key gibt 500 zurück (wenn kein Key)", async ({ request }) => {
    // Nur testen wenn kein API Key gesetzt
    if (process.env.ANTHROPIC_API_KEY) {
      test.skip();
      return;
    }
    const res = await request.post("/api/research", {
      data: { topic: "Test" },
    });
    expect(res.status()).toBe(500);
    const body = await res.json();
    expect(body.error).toContain("ANTHROPIC_API_KEY");
  });

  test("POST /api/topics gibt previousAngles zurück", async ({ request }) => {
    const res = await request.post("/api/topics", {
      data: { topic: "TestThema_" + Date.now() },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.previousAngles)).toBe(true);
    expect(body.previousAngles.length).toBe(0);
  });

  test("POST /api/topics ohne topic gibt 400 zurück", async ({ request }) => {
    const res = await request.post("/api/topics", {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  // Echter API-Call-Test — nur wenn ANTHROPIC_API_KEY gesetzt ist
  test("POST /api/research recherchiert Daten (dry-run via GenerateForm-Flow)", async ({ request }) => {
    test.skip(!process.env.ANTHROPIC_API_KEY, "Kein ANTHROPIC_API_KEY gesetzt");
    test.setTimeout(120_000);

    const res = await request.post("/api/research", {
      data: { topic: "Sport" },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.participants.length).toBeGreaterThanOrEqual(3);
  });
});
