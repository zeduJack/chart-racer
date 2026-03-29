export interface Participant {
  name: string;
  color: string;
  imageUrl?: string;
  values: number[];
}

export interface ChartData {
  title: string;
  subtitle: string;
  timeLabels: string[];
  participants: Participant[];
  valueFormat: {
    prefix?: string;
    suffix?: string;
    abbreviate: boolean;
  };
}

export interface ChartStyle {
  visibleBars: number;
  durationPerStep: number; // Frames pro Zeitschritt
  barHeight: number;
  barGap: number;
  templateId?: string; // Aktives Template (optional)
}

export interface ChartRaceConfig {
  data: ChartData;
  style: ChartStyle;
}

export interface BarState {
  name: string;
  color: string;
  imageUrl?: string;
  yPosition: number;
  barWidth: number;
  currentValue: number;
  interpolatedRank: number;
  isEntering: boolean; // Rank ausserhalb visibleBars beim from-Step
  isLeaving: boolean;  // Rank ausserhalb visibleBars beim to-Step
}
