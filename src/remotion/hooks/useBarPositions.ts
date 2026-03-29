import { useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { scaleLinear } from "d3-scale";
import type { ChartData, ChartStyle, BarState } from "../types";

// Layout-Berechnung basierend auf tatsächlicher Kompositions-Grösse
export interface Layout {
  canvasWidth: number;
  canvasHeight: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  scale: number; // Skalierungsfaktor für Schriften/Abstände
}

export function computeLayout(width: number, height: number): Layout {
  // Referenz: 1920×1080 (16:9)
  // Für andere Formate skalieren wir proportional
  const scaleX = width / 1920;
  const scaleY = height / 1080;
  const scale = Math.min(scaleX, scaleY);

  return {
    canvasWidth: width,
    canvasHeight: height,
    paddingLeft: Math.round(300 * scaleX),
    paddingRight: Math.round(100 * scaleX),
    paddingTop: Math.round(160 * scaleY),
    paddingBottom: Math.round(100 * scaleY),
    scale,
  };
}

// Statische Konstante für Backward-Kompatibilität (16:9 Standard)
export const LAYOUT = computeLayout(1920, 1080);

// Hook: gibt Layout für aktuelle Komposition zurück
export function useLayout(): Layout {
  const { width, height } = useVideoConfig();
  return computeLayout(width, height);
}

export type { Layout as LayoutType };

interface UseBarPositionsResult {
  bars: BarState[];
  stepIndex: number;
  stepProgress: number;
  currentLabel: string;
  nextLabel: string;
  maxValue: number;
  maxBarWidth: number;
  layout: Layout;
}

export function useBarPositions(
  data: ChartData,
  style: ChartStyle
): UseBarPositionsResult {
  const frame = useCurrentFrame();
  const layout = useLayout();

  const maxBarWidth = layout.canvasWidth - layout.paddingLeft - layout.paddingRight;
  const totalSteps = data.timeLabels.length;

  // Aktueller Schritt und Fortschritt innerhalb des Schritts
  const stepIndex = Math.min(
    Math.floor(frame / style.durationPerStep),
    totalSteps - 2
  );
  const rawProgress = Math.min(
    (frame - stepIndex * style.durationPerStep) / style.durationPerStep,
    1
  );
  // Easing für flüssige Animation
  const progress = Easing.inOut(Easing.quad)(rawProgress);

  const fromStep = stepIndex;
  const toStep = Math.min(stepIndex + 1, totalSteps - 1);

  const fromValues = data.participants.map((p) => p.values[fromStep] ?? 0);
  const toValues = data.participants.map((p) => p.values[toStep] ?? 0);

  // Max-Wert für Skalierung
  const maxValue = Math.max(...fromValues, ...toValues, 1);

  // D3 Scale: Wert → Balkenbreite in Pixel
  const xScale = scaleLinear().domain([0, maxValue]).range([0, maxBarWidth]);

  // Rang berechnen (0 = grösster Wert)
  const computeRanks = (values: number[]): number[] => {
    const indexed = values.map((v, i) => ({ i, v }));
    indexed.sort((a, b) => b.v - a.v);
    const ranks = new Array(values.length).fill(0);
    indexed.forEach((item, rank) => {
      ranks[item.i] = rank;
    });
    return ranks;
  };

  const fromRanks = computeRanks(fromValues);
  const toRanks = computeRanks(toValues);

  const slotHeight = style.barHeight + style.barGap;

  const bars: BarState[] = data.participants.map((participant, i) => {
    const fromRank = fromRanks[i];
    const toRank = toRanks[i];

    const fromY = fromRank * slotHeight + layout.paddingTop;
    const toY = toRank * slotHeight + layout.paddingTop;

    const fromWidth = xScale(fromValues[i]);
    const toWidth = xScale(toValues[i]);

    const yPosition = fromY + (toY - fromY) * progress;
    const barWidth = fromWidth + (toWidth - fromWidth) * progress;
    const currentValue =
      fromValues[i] + (toValues[i] - fromValues[i]) * progress;
    const interpolatedRank = fromRank + (toRank - fromRank) * progress;

    const isEntering = fromRank >= style.visibleBars && toRank < style.visibleBars;
    const isLeaving = fromRank < style.visibleBars && toRank >= style.visibleBars;

    return {
      name: participant.name,
      color: participant.color,
      imageUrl: participant.imageUrl,
      yPosition,
      barWidth,
      currentValue,
      interpolatedRank,
      isEntering,
      isLeaving,
    };
  });

  // Nur Balken rendern die im sichtbaren Bereich sind oder gerade ein/ausblenden
  const visibleBars = bars.filter((b) => {
    const rank = b.interpolatedRank;
    return rank < style.visibleBars + 1; // +1 für Enter/Exit-Animation
  });

  return {
    bars: visibleBars,
    stepIndex,
    stepProgress: progress,
    currentLabel: data.timeLabels[fromStep],
    nextLabel: data.timeLabels[toStep],
    maxValue,
    maxBarWidth,
    layout,
  };
}
