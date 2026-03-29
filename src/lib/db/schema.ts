/**
 * Drizzle ORM Schema für ChartRacer
 * Tabellen: topics, angles, generated_videos
 */

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

// Themen (z.B. "Aktien", "Sport", "Technologie")
export const topics = sqliteTable("topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// Bereits behandelte Blickwinkel pro Thema
export const angles = sqliteTable("angles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  topicId: integer("topic_id")
    .notNull()
    .references(() => topics.id),
  angle: text("angle").notNull(),
  title: text("title").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// Gespeicherte Recherche-Ergebnisse (vollständige ResearchResult-Daten)
export const researchResults = sqliteTable("research_results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  topic: text("topic").notNull(),
  title: text("title").notNull(),
  angle: text("angle").notNull(),
  researchDataJson: text("research_data_json").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// Generierte Videos
export const generatedVideos = sqliteTable("generated_videos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  angleId: integer("angle_id")
    .notNull()
    .references(() => angles.id),
  outputPath: text("output_path"),
  format: text("format").notNull().default("16:9"),
  resolution: text("resolution").notNull().default("1080p"),
  fps: integer("fps").notNull().default(30),
  durationSeconds: real("duration_seconds"),
  status: text("status").notNull().default("pending"), // pending | rendering | done | failed
  errorMessage: text("error_message"),
  researchDataJson: text("research_data_json"), // vollständige ResearchResult als JSON
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  completedAt: text("completed_at"),
});

// Relationen (müssen nach den Tabellen stehen)
export const topicsRelations = relations(topics, ({ many }) => ({
  angles: many(angles),
}));

export const anglesRelations = relations(angles, ({ one, many }) => ({
  topic: one(topics, { fields: [angles.topicId], references: [topics.id] }),
  videos: many(generatedVideos),
}));

export const generatedVideosRelations = relations(generatedVideos, ({ one }) => ({
  angle: one(angles, { fields: [generatedVideos.angleId], references: [angles.id] }),
}));
