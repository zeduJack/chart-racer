/**
 * Daten-Validierung und Fallback-Logik für AI-recherchierte Bar Chart Race Daten.
 *
 * Prüft:
 * - Vollständigkeit der Zeitreihe (keine Lücken)
 * - Korrekte Anzahl Werte pro Teilnehmer
 * - Positive Werte (Balken müssen > 0 sein)
 * - Mindestanzahl Teilnehmer und Zeitpunkte
 *
 * Fallback:
 * - Lücken werden durch Interpolation gefüllt
 * - Zu wenige Daten → Fehler mit Hinweis für AI
 */

import type { ResearchResult, ResearchedParticipant } from "./ai-researcher";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  data?: ResearchResult; // bereinigtes Ergebnis (falls valid oder repariert)
}

const MIN_PARTICIPANTS = 3;
const MIN_TIME_POINTS = 3;

/**
 * Validiert und bereinigt ein ResearchResult.
 * Gibt valides Ergebnis oder Fehlerdetails zurück.
 */
export function validateAndRepair(raw: ResearchResult): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Pflichtfelder
  if (!raw.title?.trim()) errors.push("Kein Titel vorhanden");
  if (!raw.timeLabels || raw.timeLabels.length === 0)
    errors.push("Keine Zeitpunkte vorhanden");
  if (!raw.participants || raw.participants.length === 0)
    errors.push("Keine Teilnehmer vorhanden");

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  // Mindestanforderungen
  if (raw.timeLabels.length < MIN_TIME_POINTS) {
    errors.push(
      `Zu wenige Zeitpunkte: ${raw.timeLabels.length} (Minimum: ${MIN_TIME_POINTS})`
    );
  }
  if (raw.participants.length < MIN_PARTICIPANTS) {
    errors.push(
      `Zu wenige Teilnehmer: ${raw.participants.length} (Minimum: ${MIN_PARTICIPANTS})`
    );
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  const expectedLength = raw.timeLabels.length;
  const repairedParticipants: ResearchedParticipant[] = [];
  const removedParticipants: string[] = [];

  for (const p of raw.participants) {
    if (!p.name?.trim()) {
      warnings.push("Teilnehmer ohne Namen übersprungen");
      continue;
    }

    if (!p.values || p.values.length === 0) {
      removedParticipants.push(p.name);
      warnings.push(`${p.name}: Keine Werte, Teilnehmer entfernt`);
      continue;
    }

    // Werte reparieren
    const repairedValues = repairValues(p.values, expectedLength, p.name, warnings);

    // Negative oder null-Werte auf 0 setzen
    const cleanValues = repairedValues.map((v) => (isNaN(v) || v < 0 ? 0 : v));

    // Prüfen ob alle Werte 0 sind (unbrauchbarer Teilnehmer)
    if (cleanValues.every((v) => v === 0)) {
      removedParticipants.push(p.name);
      warnings.push(`${p.name}: Alle Werte sind 0, Teilnehmer entfernt`);
      continue;
    }

    repairedParticipants.push({
      ...p,
      values: cleanValues,
      color: p.color || generateColor(p.name),
    });
  }

  if (removedParticipants.length > 0) {
    warnings.push(`Entfernte Teilnehmer: ${removedParticipants.join(", ")}`);
  }

  // Finale Mindestanzahl prüfen
  if (repairedParticipants.length < MIN_PARTICIPANTS) {
    errors.push(
      `Nach Bereinigung zu wenige Teilnehmer: ${repairedParticipants.length} (Minimum: ${MIN_PARTICIPANTS})`
    );
    return { valid: false, errors, warnings };
  }

  const repairedData: ResearchResult = {
    ...raw,
    participants: repairedParticipants,
    valueFormat: raw.valueFormat || { abbreviate: true },
  };

  return {
    valid: true,
    errors,
    warnings,
    data: repairedData,
  };
}

/**
 * Repariert eine Werte-Liste auf die erwartete Länge.
 * - Zu kurz: letzten Wert wiederholen (Flat-Line) oder linear interpolieren
 * - Zu lang: abschneiden
 */
function repairValues(
  values: number[],
  expectedLength: number,
  participantName: string,
  warnings: string[]
): number[] {
  if (values.length === expectedLength) return values;

  if (values.length > expectedLength) {
    warnings.push(
      `${participantName}: ${values.length} Werte → auf ${expectedLength} gekürzt`
    );
    return values.slice(0, expectedLength);
  }

  // Zu wenige Werte → linear auffüllen
  warnings.push(
    `${participantName}: Nur ${values.length}/${expectedLength} Werte → Lücken interpoliert`
  );

  const result = [...values];
  const lastKnown = values[values.length - 1] || 0;
  const secondToLast = values.length >= 2 ? values[values.length - 2] : lastKnown;
  const trend = lastKnown - secondToLast; // Linearer Trend

  while (result.length < expectedLength) {
    const next = result[result.length - 1] + trend;
    result.push(Math.max(0, next)); // Nicht negativ
  }

  return result;
}

/**
 * Generiert eine deterministischen Farbe aus einem Namen.
 */
function generateColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return hslToHex(hue, 70, 55);
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Gibt eine für den AI-Prompt geeignete Fehlerbeschreibung zurück.
 * Damit der AI-Agent beim Retry weiß was er besser machen soll.
 */
export function buildRetryHint(errors: string[], warnings: string[]): string {
  const lines = [
    "Die recherchierten Daten sind unvollständig. Bitte korrigiere folgendes:",
    ...errors.map((e) => `❌ ${e}`),
    ...warnings.map((w) => `⚠️ ${w}`),
    "",
    "Stelle sicher dass:",
    `- Mindestens ${MIN_PARTICIPANTS} Teilnehmer mit Daten vorhanden sind`,
    `- Mindestens ${MIN_TIME_POINTS} Zeitpunkte vorhanden sind`,
    "- Jeder Teilnehmer genau so viele Werte hat wie es Zeitpunkte gibt",
    "- Alle Werte positive Zahlen sind",
  ];
  return lines.join("\n");
}
