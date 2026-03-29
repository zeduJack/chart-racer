/**
 * Tests für den Topic Manager (SQLite-History-Tracking)
 * Läuft als Node.js-Test (kein Browser nötig)
 */

import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

// Test-DB-Pfad setzen BEVOR irgendwelche Module importiert werden
const TEST_DB = path.join(process.cwd(), "data", "test-chartracer.db");
process.env.DB_PATH = TEST_DB;

// Statische Imports (nach env-var-Setzen)
import {
  getPreviousAngles,
  saveAngle,
  createVideoJob,
  updateVideoStatus,
  listVideos,
  listTopics,
} from "../../src/lib/topic-manager";
import { resetDb } from "../../src/lib/db/index";

// Hilfsfunktion: Testdaten
function mockResult(angle: string) {
  return {
    angle,
    title: `Titel für ${angle}`,
    subtitle: "Test Untertitel",
    timeUnit: "year" as const,
    timeLabels: ["2020", "2021", "2022", "2023", "2024"],
    participants: [
      { name: "A", color: "#ff0000", values: [1, 2, 3, 4, 5] },
      { name: "B", color: "#00ff00", values: [5, 4, 3, 2, 1] },
      { name: "C", color: "#0000ff", values: [3, 3, 3, 3, 3] },
      { name: "D", color: "#ffff00", values: [2, 4, 1, 5, 2] },
      { name: "E", color: "#ff00ff", values: [4, 1, 5, 1, 4] },
    ],
    valueFormat: { prefix: "$", suffix: "", abbreviate: false },
  };
}

test.describe("Topic Manager", () => {
  test.afterAll(() => {
    resetDb();
    if (fs.existsSync(TEST_DB)) {
      fs.unlinkSync(TEST_DB);
    }
  });

  test("Neues Thema hat keine bisherigen Blickwinkel", async () => {
    const prevAngles = await getPreviousAngles("TestThema_" + Date.now());
    expect(prevAngles).toEqual([]);
  });

  test("Blickwinkel wird gespeichert und zurückgegeben", async () => {
    const topicName = "TestThema_" + Date.now();

    await saveAngle(topicName, mockResult("Erster Blickwinkel"));

    const prevAngles = await getPreviousAngles(topicName);
    expect(prevAngles).toContain("Erster Blickwinkel");
    expect(prevAngles.length).toBe(1);
  });

  test("Mehrere Blickwinkel werden akkumuliert", async () => {
    const topicName = "MultiThema_" + Date.now();

    await saveAngle(topicName, mockResult("Blickwinkel 1"));
    await saveAngle(topicName, mockResult("Blickwinkel 2"));
    await saveAngle(topicName, mockResult("Blickwinkel 3"));

    const prevAngles = await getPreviousAngles(topicName);
    expect(prevAngles.length).toBe(3);
    expect(prevAngles).toContain("Blickwinkel 1");
    expect(prevAngles).toContain("Blickwinkel 2");
    expect(prevAngles).toContain("Blickwinkel 3");
  });

  test("Video-Job kann erstellt und aktualisiert werden", async () => {
    const topicName = "VideoThema_" + Date.now();

    const angleId = await saveAngle(topicName, mockResult("Video Blickwinkel"));
    const videoId = await createVideoJob(angleId, mockResult("Video Blickwinkel"));

    expect(typeof videoId).toBe("number");

    await updateVideoStatus(videoId, "done", {
      outputPath: "/tmp/test.mp4",
      durationSeconds: 30,
    });

    const videos = await listVideos();
    const ourVideo = videos.find((v) => v.id === videoId);
    expect(ourVideo).toBeDefined();
    expect(ourVideo?.status).toBe("done");
    expect(ourVideo?.outputPath).toBe("/tmp/test.mp4");
  });

  test("listTopics gibt gespeicherte Themen zurück", async () => {
    const topicName = "ListThema_" + Date.now();
    await saveAngle(topicName, mockResult("List Test"));

    const allTopics = await listTopics();
    const ourTopic = allTopics.find((t) => t.name === topicName.toLowerCase());
    expect(ourTopic).toBeDefined();
    expect(ourTopic?.angles.length).toBeGreaterThanOrEqual(1);
  });
});
