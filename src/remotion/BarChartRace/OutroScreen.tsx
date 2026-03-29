import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import type { ChartData } from "../types";
import { formatValue } from "../hooks/useAnimatedValue";
import { computeLayout } from "../hooks/useBarPositions";
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
  const { width, height } = useVideoConfig();
  const layout = computeLayout(width, height);

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

  // Skalierte Grössen
  const headerFontSize = Math.round(28 * layout.scale);
  const rankFontSize = Math.round(26 * layout.scale);
  const nameFontSize = Math.round(26 * layout.scale);
  const valueFontSize = Math.round(24 * layout.scale);
  const logoSize = Math.round(44 * layout.scale);
  const rowWidth = Math.min(Math.round(700 * layout.scale), width - layout.paddingLeft * 2);
  const rowGap = Math.round(18 * layout.scale);
  const rankWidth = Math.round(50 * layout.scale);
  const rowGapItems = Math.round(20 * layout.scale);
  const headerMargin = Math.round(32 * layout.scale);

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
        overflow: "hidden",
      }}
    >
      {/* Hintergrund-Dekoration */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(56,189,248,0.05) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          fontSize: headerFontSize,
          fontWeight: 600,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          marginBottom: headerMargin,
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        Final Standings — {lastLabel}
      </div>

      {/* Top 5 Einträge */}
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
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        // Medaillen-Farben für Top 3
        const rankColor =
          rank === 0
            ? "#fbbf24"
            : rank === 1
              ? "#9ca3af"
              : rank === 2
                ? "#cd7c2f"
                : "rgba(255,255,255,0.35)";

        return (
          <div
            key={participant.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: rowGapItems,
              marginBottom: rowGap,
              opacity: entryOpacity,
              transform: `translateX(${entryX}px)`,
              width: rowWidth,
            }}
          >
            {/* Rang */}
            <div
              style={{
                width: rankWidth,
                color: rankColor,
                fontSize: rankFontSize,
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                textAlign: "right",
                flexShrink: 0,
                textShadow: rank < 3 ? `0 0 12px ${rankColor}80` : "none",
              }}
            >
              #{rank + 1}
            </div>

            {/* Logo */}
            {participant.imageUrl && (
              <div
                style={{
                  width: logoSize,
                  height: logoSize,
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: participant.color + "22",
                  border: `2px solid ${participant.color}80`,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Img
                  src={
                    participant.imageUrl.startsWith("http")
                      ? participant.imageUrl
                      : staticFile(participant.imageUrl)
                  }
                  style={{
                    width: logoSize - 8,
                    height: logoSize - 8,
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {/* Name */}
            <div
              style={{
                flex: 1,
                fontSize: nameFontSize,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                fontFamily: "'Inter', sans-serif",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {participant.name}
            </div>

            {/* Wert */}
            <div
              style={{
                fontSize: valueFontSize,
                fontWeight: 700,
                color: participant.color,
                fontFamily: "'Inter', sans-serif",
                flexShrink: 0,
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
