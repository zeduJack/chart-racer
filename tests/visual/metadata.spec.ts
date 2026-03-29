import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3003";

test.describe("Social-Media Metadaten", () => {
  test("Homepage hat OG-Title", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/`);
    const html = await res.text();
    expect(html).toContain('og:title');
    expect(html.toLowerCase()).toContain("chartracer");
  });

  test("Homepage hat Twitter-Card Meta-Tag", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/`);
    const html = await res.text();
    expect(html).toContain('twitter:card');
    expect(html).toContain('summary_large_image');
  });

  test("Homepage hat OG-Description", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/`);
    const html = await res.text();
    expect(html).toContain('og:description');
  });

  test("Homepage hat OG-Image Meta-Tag", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/`);
    const html = await res.text();
    expect(html).toContain('og:image');
  });

  test("Editor-Seite hat eigenen Page-Title", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/editor`);
    const html = await res.text();
    expect(html).toContain("Editor");
    expect(html).toContain("ChartRacer");
  });

  test("Videos-Seite hat eigenen Page-Title", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/videos`);
    const html = await res.text();
    expect(html).toContain("Video-Galerie");
    expect(html).toContain("ChartRacer");
  });

  test("HTML-Lang-Attribut ist 'de'", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/`);
    const html = await res.text();
    expect(html).toContain('lang="de"');
  });

  test("OG-Image Route gibt Bild zurück", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/opengraph-image`);
    expect(res.status()).toBe(200);
    const contentType = res.headers()["content-type"] ?? "";
    expect(contentType).toContain("image");
  });
});
