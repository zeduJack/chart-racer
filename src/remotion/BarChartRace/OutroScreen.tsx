import { useCurrentFrame, interpolate, Easing } from "remotion";
import type { ChartData } from "../types";
import { formatValue } from "../hooks/useAnimatedValue";
import { Img, staticFile } from "remotion";

interface OutroScreenProps {
  data: ChartData;
  durationInFrames: number;
}

export const OutroScreen: React.FC<OutroScreenProps> = ({
  data,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // Fade-In
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Fade-Out am Ende
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // Finales Ranking aus dem letzten Zeitschritt
  const lastStep = data.timeLabels.length - 1;
  const finalRanking = [...data.participants]
    .map((p) => ({ ...p, finalValue: p.values[lastStep] ?? 0 }))
    .sort((a, b) => b.finalValue - a.finalValue)
    .slice(0, 5); // Top 5 im Outro

  const lastLabel = data.timeLabels[lastStep];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        backgroundColor: "#0d1117",
      }}
    >
      {/* Titel */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 600,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          marginBottom: 20,
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        Final Standings — {lastLabel}
      </div>

      {/* Top 5 */}
      {finalRanking.map((participant, rank) => {
        const entryDelay = rank * 6;
        const entryOpacity = interpolate(
          frame,
          [entryDelay, entryDelay + 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const entryX = interpolate(
          frame,
          [entryDelay, entryDelay + 15],
          [-30, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={participant.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 20,
              opacity: entryOpacity,
              transform: `translateX(${entryX}px)`,
              width: 700,
            }}
          >
            {/* Rang */}
            <div
              style={{
                width: 50,
                color:
                  rank === 0
                    ? "#fbbf24"
                    : rank === 1
                      ? "#9ca3af"
                      : rank === 2
                        ? "#cd7c2f"
                        : "rgba(255,255,255,0.4)",
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                textAlign: "right",
              }}
            >
              #{rank + 1}
            </div>

            {/* Logo */}
            {participant.imageUrl && (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: participant.color + "33",
                  border: `2px solid ${participant.color}`,
                  flexShrink: 0,
                }}
              >
                <Img
                  src={
                    participant.imageUrl.startsWith("http")
                      ? participant.imageUrl
                      : staticFile(participant.imageUrl)
                  }
                  style={{ width: 40, height: 40, objectFit: "contain" }}
                />
              </div>
            )}

            {/* Name */}
            <div
              style={{
                flex: 1,
                fontSize: 28,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {participant.name}
            </div>

            {/* Wert */}
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: participant.color,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {formatValue(participant.finalValue, data.valueFormat)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
