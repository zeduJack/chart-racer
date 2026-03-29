/**
 * Topic Manager: Verwaltet Themen-History und Blickwinkel-Tracking
 * Sicherstellt dass bei wiederholtem Aufruf immer ein neuer Blickwinkel gewählt wird.
 */

import { getDb } from "./db/index";
import { topics, angles, generatedVideos } from "./db/schema";
import { eq } from "drizzle-orm";
import type { ResearchResult } from "./ai-researcher";

/**
 * Gibt alle bisherigen Blickwinkel für ein Thema zurück
 */
export async function getPreviousAngles(topicName: string): Promise<string[]> {
  const db = getDb();
  const topic = await db.query.topics.findFirst({
    where: eq(topics.name, topicName.toLowerCase().trim()),
    with: { angles: true },
  });

  if (!topic) return [];
  return topic.angles.map((a) => a.angle);
}

/**
 * Speichert einen neuen Blickwinkel für ein Thema
 * Erstellt das Thema falls es noch nicht existiert
 */
export async function saveAngle(
  topicName: string,
  result: ResearchResult
): Promise<number> {
  const db = getDb();
  const normalizedName = topicName.toLowerCase().trim();

  // Thema anlegen oder holen
  let topic = await db.query.topics.findFirst({
    where: eq(topics.name, normalizedName),
  });

  if (!topic) {
    const [inserted] = await db
      .insert(topics)
      .values({ name: normalizedName })
      .returning();
    topic = inserted;
  }

  // Blickwinkel speichern
  const [angle] = await db
    .insert(angles)
    .values({
      topicId: topic.id,
      angle: result.angle,
      title: result.title,
    })
    .returning();

  return angle.id;
}

/**
 * Erstellt einen neuen Video-Job in der DB
 */
export async function createVideoJob(
  angleId: number,
  result: ResearchResult,
  format: string = "16:9",
  resolution: string = "1080p",
  fps: number = 30
): Promise<number> {
  const db = getDb();
  const [video] = await db
    .insert(generatedVideos)
    .values({
      angleId,
      format,
      resolution,
      fps,
      status: "pending",
      researchDataJson: JSON.stringify(result),
    })
    .returning();

  return video.id;
}

/**
 * Aktualisiert den Status eines Video-Jobs
 */
export async function updateVideoStatus(
  videoId: number,
  status: "rendering" | "done" | "failed",
  extras: { outputPath?: string; durationSeconds?: number; errorMessage?: string } = {}
) {
  const db = getDb();
  await db
    .update(generatedVideos)
    .set({
      status,
      ...(extras.outputPath && { outputPath: extras.outputPath }),
      ...(extras.durationSeconds && { durationSeconds: extras.durationSeconds }),
      ...(extras.errorMessage && { errorMessage: extras.errorMessage }),
      ...(status === "done" || status === "failed"
        ? { completedAt: new Date().toISOString() }
        : {}),
    })
    .where(eq(generatedVideos.id, videoId));
}

/**
 * Gibt alle generierten Videos zurück
 */
export async function listVideos() {
  const db = getDb();
  return db.query.generatedVideos.findMany({
    orderBy: (v, { desc }) => [desc(v.createdAt)],
    with: { angle: { with: { topic: true } } },
  });
}

/**
 * Gibt alle Themen mit ihren Blickwinkeln zurück
 */
export async function listTopics() {
  const db = getDb();
  return db.query.topics.findMany({
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    with: { angles: true },
  });
}
