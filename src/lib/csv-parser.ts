/**
 * CSV/JSON Parser für Bar Chart Race Daten
 *
 * Erwartetes CSV-Format:
 *   name,color,2020,2021,2022,...
 *   Apple,#6b7280,233,216,229,...
 *
 * Erwartetes JSON-Format: ChartData (aus sample-data.ts) oder ResearchResult
 */

import type { ResearchResult } from "./ai-researcher";

export interface ParseResult {
  success: boolean;
  data?: ResearchResult;
  error?: string;
  warnings?: string[];
}

/**
 * Parst CSV-Text in ein ResearchResult
 */
export function parseCsv(csvText: string): ParseResult {
  const warnings: string[] = [];

  const lines = csvText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  if (lines.length < 2) {
    return { success: false, error: "CSV muss mindestens eine Header-Zeile und eine Daten-Zeile haben" };
  }

  // Header parsen
  const headers = splitCsvLine(lines[0]);
  if (headers.length < 3) {
    return { success: false, error: "CSV Header: name, color, [Zeitpunkt1], [Zeitpunkt2], ..." };
  }

  const nameIdx = headers.findIndex((h) => h.toLowerCase() === "name");
  const colorIdx = headers.findIndex((h) => h.toLowerCase() === "color" || h.toLowerCase() === "colour");

  if (nameIdx === -1) {
    return { success: false, error: "Keine 'name' Spalte im CSV gefunden" };
  }

  // Zeitpunkte sind alle Spalten ausser name und color
  const timeLabels = headers.filter(
    (_, i) => i !== nameIdx && i !== colorIdx
  );

  if (timeLabels.length < 2) {
    return { success: false, error: "Mindestens 2 Zeitpunkte erforderlich (z.B. 2020, 2021, ...)" };
  }

  // Datenzeilen parsen
  const participants = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length < headers.length) {
      warnings.push(`Zeile ${i + 1}: Zu wenige Spalten, übersprungen`);
      continue;
    }

    const name = cols[nameIdx]?.trim();
    if (!name) {
      warnings.push(`Zeile ${i + 1}: Kein Name, übersprungen`);
      continue;
    }

    const color = colorIdx !== -1 ? (cols[colorIdx]?.trim() || "") : "";

    const values: number[] = [];
    for (const h of headers) {
      const colIdx = headers.indexOf(h);
      if (colIdx === nameIdx || colIdx === colorIdx) continue;
      const raw = cols[colIdx]?.replace(/[^0-9.,\-]/g, "").replace(",", ".") || "0";
      const val = parseFloat(raw);
      values.push(isNaN(val) ? 0 : val);
    }

    participants.push({
      name,
      color: color || generateColor(name),
      values,
    });
  }

  if (participants.length < 2) {
    return { success: false, error: "Mindestens 2 Teilnehmer erforderlich" };
  }

  return {
    success: true,
    warnings,
    data: {
      angle: "Manuell hochgeladen",
      title: "Eigene Daten",
      subtitle: `${timeLabels[0]} – ${timeLabels[timeLabels.length - 1]}`,
      timeUnit: "year",
      timeLabels,
      participants,
      valueFormat: { abbreviate: true },
    },
  };
}

/**
 * Parst JSON-Text in ein ResearchResult
 */
export function parseJson(jsonText: string): ParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { success: false, error: "Ungültiges JSON" };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { success: false, error: "JSON muss ein Objekt sein" };
  }

  const obj = parsed as Record<string, unknown>;

  // ResearchResult-Format (direkt)
  if (Array.isArray(obj.participants) && Array.isArray(obj.timeLabels)) {
    return {
      success: true,
      data: {
        angle: (obj.angle as string) || "Manuell hochgeladen",
        title: (obj.title as string) || "Eigene Daten",
        subtitle: (obj.subtitle as string) || "",
        timeUnit: (obj.timeUnit as "year" | "month" | "quarter") || "year",
        timeLabels: obj.timeLabels as string[],
        participants: obj.participants as ResearchResult["participants"],
        valueFormat: (obj.valueFormat as ResearchResult["valueFormat"]) || { abbreviate: true },
        socialMedia: obj.socialMedia as ResearchResult["socialMedia"],
      },
    };
  }

  // ChartData-Format (aus sample-data.ts)
  if (Array.isArray(obj.participants) && !obj.timeLabels && obj.timeLabels === undefined) {
    return { success: false, error: "JSON fehlt 'timeLabels' Array" };
  }

  return { success: false, error: "JSON-Format nicht erkannt. Erwartete Felder: title, timeLabels, participants" };
}

/**
 * Auto-detect: CSV oder JSON?
 */
export function parseAuto(text: string): ParseResult {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return parseJson(trimmed);
  }
  return parseCsv(trimmed);
}

/** CSV-Zeile korrekt splitten (behandelt Anführungszeichen) */
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/** Deterministischen Farbe aus Name */
function generateColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}
