import type { ChartData } from "../types";

// Zeigt Dezimalstelle nur wenn sinnvoll (nicht "233.0", sondern "233")
function smartFixed(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? String(Math.round(rounded)) : rounded.toFixed(1);
}

// Zahl formatieren (z.B. 394.2 → "$394.2B")
export function formatValue(
  value: number,
  format: ChartData["valueFormat"]
): string {
  const prefix = format.prefix ?? "";
  const suffix = format.suffix ?? "";

  if (format.abbreviate) {
    if (value >= 1_000_000_000_000) {
      return `${prefix}${smartFixed(value / 1_000_000_000_000)}T${suffix}`;
    }
    if (value >= 1_000_000_000) {
      return `${prefix}${smartFixed(value / 1_000_000_000)}B${suffix}`;
    }
    if (value >= 1_000_000) {
      return `${prefix}${smartFixed(value / 1_000_000)}M${suffix}`;
    }
    if (value >= 1_000) {
      return `${prefix}${smartFixed(value / 1_000)}K${suffix}`;
    }
  }

  return `${prefix}${smartFixed(value)}${suffix}`;
}
