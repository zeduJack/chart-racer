/**
 * Drizzle ORM DB Connection (SQLite via better-sqlite3)
 * Lazy-Init: DB wird erst bei erster Nutzung geöffnet.
 */

import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

let _db: BetterSQLite3Database<typeof schema> | null = null;

function getDbPath(): string {
  return process.env.DB_PATH || path.join(process.cwd(), "data", "chartracer.db");
}

export function initDb() {
  const dbPath = getDbPath();
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS angles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL REFERENCES topics(id),
      angle TEXT NOT NULL,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS research_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic TEXT NOT NULL,
      title TEXT NOT NULL,
      angle TEXT NOT NULL,
      research_data_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_datasets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      data_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS generated_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      angle_id INTEGER NOT NULL REFERENCES angles(id),
      output_path TEXT,
      format TEXT NOT NULL DEFAULT '16:9',
      resolution TEXT NOT NULL DEFAULT '1080p',
      fps INTEGER NOT NULL DEFAULT 30,
      duration_seconds REAL,
      status TEXT NOT NULL DEFAULT 'pending',
      error_message TEXT,
      research_data_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT
    );
  `);

  _db = drizzle(sqlite, { schema });
  return _db;
}

export function getDb(): BetterSQLite3Database<typeof schema> {
  if (!_db) {
    return initDb();
  }
  return _db;
}

// Reset für Tests
export function resetDb() {
  _db = null;
}

export { schema };
