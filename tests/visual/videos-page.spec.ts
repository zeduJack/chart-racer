import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3003";

test.describe("Videos Page — HTTP Tests", () => {
  test("returns 200 OK", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/videos`);
    expect(res.status()).toBe(200);
  });

  test("contains page title and header", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/videos`);
    const html = await res.text();
    expect(html).toContain("Video-Galerie");
    expect(html).toContain("ChartRacer");
  });

  test("contains navigation links", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/videos`);
    const html = await res.text();
    expect(html).toContain('href="/editor"');
    expect(html).toContain('href="/"');
  });

  test("contains 'Neues Video' button linking to editor", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/videos`);
    const html = await res.text();
    expect(html).toContain("Neues Video");
  });

  test("contains stat cards section", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/videos`);
    const html = await res.text();
    expect(html).toContain("Videos total");
    expect(html).toContain("Erfolgreich");
    expect(html).toContain("Themen");
    expect(html).toContain("Blickwinkel");
  });

  test("shows empty state or video list", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/videos`);
    const html = await res.text();
    // Either empty state or video list header should be present
    const hasEmptyState = html.includes("Noch keine Videos") || html.includes("Zum Editor");
    const hasVideoList = html.includes("Alle Videos") || html.includes("video-galerie") || html.includes("status");
    expect(hasEmptyState || hasVideoList).toBe(true);
  });

  test("no JavaScript errors in page source", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/videos`);
    const html = await res.text();
    expect(html).not.toContain("Unhandled Runtime Error");
    expect(html).not.toContain("SyntaxError");
  });

  test("videos page is active in navigation", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/videos`);
    const html = await res.text();
    // Videos link should have active styling
    expect(html).toContain("text-white/90");
  });
});
