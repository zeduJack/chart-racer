import { Sequence, Audio, staticFile } from "remotion";
import type { ChartRaceConfig } from "../types";
import { LAYOUT } from "../hooks/useBarPositions";
import { RaceAnimation } from "./RaceAnimation";
import { IntroScreen } from "./IntroScreen";
import { OutroScreen } from "./OutroScreen";

// Dauer der Sequenzen in Frames (bei 30fps)
export const INTRO_DURATION = 75;  // 2.5s
export const OUTRO_DURATION = 90;  // 3s

// Gesamtdauer berechnen: (Schritte - 1) × Frames pro Schritt
export function computeRaceDuration(
  timeLabels: string[],
  durationPerStep: number
): number {
  return (timeLabels.length - 1) * durationPerStep;
}

export const BarChartRace: React.FC<ChartRaceConfig> = (props) => {
  const { data, style } = props;

  const raceDuration = computeRaceDuration(data.timeLabels, style.durationPerStep);

  // Audio: optional — wird nur gerendert wenn Datei existiert
  // Lege eigene Tracks in public/audio/ ab (MP3 oder WAV)
  const hasAudio = false; // auf true setzen wenn public/audio/soundtrack.mp3 vorhanden
  const audioFile = "audio/soundtrack.mp3";

  return (
    <div
      style={{
        width: LAYOUT.canvasWidth,
        height: LAYOUT.canvasHeight,
        backgroundColor: "#0d1117",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Subtiler Hintergrund-Gradient (dauerhaft sichtbar) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.04) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Intro-Sequenz */}
      <Sequence durationInFrames={INTRO_DURATION}>
        <IntroScreen
          title={data.title}
          subtitle={data.subtitle}
          durationInFrames={INTRO_DURATION}
        />
      </Sequence>

      {/* Race-Animation */}
      <Sequence from={INTRO_DURATION} durationInFrames={raceDuration}>
        <RaceAnimation {...props} />
      </Sequence>

      {/* Outro-Sequenz */}
      <Sequence from={INTRO_DURATION + raceDuration} durationInFrames={OUTRO_DURATION}>
        <OutroScreen data={data} durationInFrames={OUTRO_DURATION} />
      </Sequence>

      {/* Audio (optional) */}
      {hasAudio && (
        <Audio
          src={staticFile(audioFile)}
          volume={(f) => {
            // Fade-In in den ersten 30 Frames
            if (f < 30) return f / 30;
            // Fade-Out in den letzten 30 Frames
            const total = INTRO_DURATION + raceDuration + OUTRO_DURATION;
            if (f > total - 30) return (total - f) / 30;
            return 1;
          }}
        />
      )}
    </div>
  );
};
