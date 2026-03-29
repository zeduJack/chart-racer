/**
 * Tests für den CSV/JSON Parser
 */

import { test, expect } from "@playwright/test";
import { parseCsv, parseJson, parseAuto } from "../../src/lib/csv-parser";

test.describe("CSV Parser", () => {
  test("Parst valides CSV korrekt", () => {
    const csv = `name,color,2020,2021,2022
Apple,#6b7280,274,366,394
Microsoft,#0078d4,143,168,198
Alphabet,#4285f4,183,258,283`;

    const result = parseCsv(csv);
    expect(result.success).toBe(true);
    expect(result.data!.participants.length).toBe(3);
    expect(result.data!.timeLabels).toEqual(["2020", "2021", "2022"]);
    expect(result.data!.participants[0].name).toBe("Apple");
    expect(result.data!.participants[0].values).toEqual([274, 366, 394]);
  });

  test("Erkennt fehlende name-Spalte", () => {
    const csv = `title,color,2020,2021\nApple,#fff,100,200`;
    const result = parseCsv(csv);
    expect(result.success).toBe(false);
    expect(result.error).toContain("name");
  });

  test("Fehler bei zu wenigen Zeitpunkten", () => {
    const csv = `name,color,2020\nApple,#fff,100`;
    const result = parseCsv(csv);
    expect(result.success).toBe(false);
  });

  test("Generiert Farbe wenn keine angegeben", () => {
    const csv = `name,2020,2021,2022\nApple,274,366,394\nMicrosoft,143,168,198`;
    const result = parseCsv(csv);
    expect(result.success).toBe(true);
    // Farbe sollte generiert sein (nicht leer)
    expect(result.data!.participants[0].color).toBeTruthy();
  });

  test("Behandelt Zahlen mit Tausender-Trennzeichen", () => {
    const csv = `name,color,2020,2021,2022\nApple,#fff,1000,2000,3000\nMS,#0078d4,500,1000,2000\nGoogle,#4285f4,800,1200,1800`;
    const result = parseCsv(csv);
    expect(result.success).toBe(true);
    expect(result.data!.participants[0].values[0]).toBe(1000);
  });
});

test.describe("JSON Parser", () => {
  test("Parst valides ResearchResult JSON", () => {
    const json = JSON.stringify({
      angle: "Test",
      title: "Test Titel",
      subtitle: "Untertitel",
      timeUnit: "year",
      timeLabels: ["2020", "2021", "2022"],
      participants: [
        { name: "A", color: "#ff0000", values: [10, 20, 30] },
        { name: "B", color: "#00ff00", values: [30, 20, 10] },
      ],
      valueFormat: { abbreviate: true },
    });

    const result = parseJson(json);
    expect(result.success).toBe(true);
    expect(result.data!.title).toBe("Test Titel");
    expect(result.data!.participants.length).toBe(2);
  });

  test("Fehler bei ungültigem JSON", () => {
    const result = parseJson("{ ungültig json }");
    expect(result.success).toBe(false);
    expect(result.error).toContain("JSON");
  });

  test("Fehler wenn participants fehlt", () => {
    const result = parseJson(JSON.stringify({ title: "Test", timeLabels: ["2020"] }));
    expect(result.success).toBe(false);
  });
});

test.describe("Auto-Detect", () => {
  test("Erkennt JSON automatisch", () => {
    const json = JSON.stringify({
      angle: "Test",
      title: "Test",
      subtitle: "",
      timeUnit: "year",
      timeLabels: ["2020", "2021"],
      participants: [
        { name: "A", color: "#fff", values: [1, 2] },
        { name: "B", color: "#000", values: [2, 1] },
      ],
      valueFormat: { abbreviate: false },
    });
    const result = parseAuto(json);
    expect(result.success).toBe(true);
    expect(result.data!.title).toBe("Test");
  });

  test("Erkennt CSV automatisch", () => {
    const csv = `name,color,2020,2021,2022\nApple,#6b7280,274,366,394\nMS,#0078d4,143,168,198`;
    const result = parseAuto(csv);
    expect(result.success).toBe(true);
    expect(result.data!.participants[0].name).toBe("Apple");
  });
});
