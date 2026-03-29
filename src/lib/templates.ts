import type { ChartStyle } from "@/remotion/types";

export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  style: ChartStyle;
  palette: string[]; // Empfohlene Farben
}

export const TEMPLATES: ChartTemplate[] = [
  {
    id: "dynamic",
    name: "Dynamic",
    description: "Schnell, kompakt – ideal für soziale Medien",
    emoji: "⚡",
    style: {
      visibleBars: 10,
      durationPerStep: 30,
      barHeight: 44,
      barGap: 8,
    },
    palette: ["#38bdf8", "#a78bfa", "#34d399", "#fb923c", "#f472b6", "#facc15", "#60a5fa", "#4ade80"],
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Langsam, episch – für Präsentationen",
    emoji: "🎬",
    style: {
      visibleBars: 8,
      durationPerStep: 90,
      barHeight: 60,
      barGap: 14,
    },
    palette: ["#e2e8f0", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#f1f5f9", "#cbd5e1"],
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professionell, ausgewogen – für Berichte",
    emoji: "📊",
    style: {
      visibleBars: 10,
      durationPerStep: 60,
      barHeight: 48,
      barGap: 10,
    },
    palette: ["#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed", "#0891b2", "#be185d", "#15803d"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Wenige Balken, viel Luft – clean und klar",
    emoji: "✦",
    style: {
      visibleBars: 5,
      durationPerStep: 75,
      barHeight: 64,
      barGap: 16,
    },
    palette: ["#f8fafc", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b"],
  },
  {
    id: "neon",
    name: "Neon",
    description: "Leuchtende Farben, energetisch",
    emoji: "🌈",
    style: {
      visibleBars: 12,
      durationPerStep: 45,
      barHeight: 40,
      barGap: 8,
    },
    palette: ["#00ff88", "#ff0066", "#00ccff", "#ffcc00", "#ff6600", "#cc00ff", "#00ff44", "#ff0044"],
  },
];

export const DEFAULT_TEMPLATE_ID = "corporate";

export function getTemplate(id: string): ChartTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
