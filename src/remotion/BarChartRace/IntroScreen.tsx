import { useCurrentFrame, interpolate, useVideoConfig, Easing } from "remotion";
import type { ChartData } from "../types";
import { computeLayout } from "../hooks/useBarPositions";

interface IntroScreenProps {
  data: ChartData;
  durationInFrames: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
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

  // Titel animiert rein
  const titleX = interpolate(frame, [5, 25], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Untertitel mit Verzögerung
  const subtitleX = interpolate(frame, [12, 32], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const subtitleOpacity = interpolate(frame, [12, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Zeitraum-Badge mit weiterer Verzögerung
  const badgeOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const firstLabel = data.timeLabels[0];
  const lastLabel = data.timeLabels[data.timeLabels.length - 1];

  const titleFontSize = Math.round(72 * layout.scale);
  const subtitleFontSize = Math.round(30 * layout.scale);
  const badgeFontSize = Math.round(20 * layout.scale);
  const accentWidth = Math.round(6 * layout.scale);
  const accentHeight = Math.round(80 * layout.scale);
  const paddingH = Math.round(120 * layout.scale);
  const gap = Math.round(24 * layout.scale);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `0 ${paddingH}px`,
        opacity,
        backgroundColor: "#0d1117",
        overflow: "hidden",
      }}
    >
      {/* Hintergrund-Dekoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at 15% 50%, rgba(56,189,248,0.07) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 85% 30%, rgba(168,85,247,0.05) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* Accent-Linie */}
      <div
        style={{
          width: accentWidth,
          height: accentHeight,
          borderRadius: accentWidth / 2,
          background: "linear-gradient(to bottom, #38bdf8, #a78bfa)",
          marginBottom: gap,
          boxShadow: "0 0 20px rgba(56,189,248,0.4)",
        }}
      />

      {/* Titel */}
      <div
        style={{
          fontSize: titleFontSize,
          fontWeight: 800,
          color: "rgba(255,255,255,0.95)",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          letterSpacing: "-1.5px",
          lineHeight: 1.1,
          marginBottom: Math.round(16 * layout.scale),
          transform: `translateX(${titleX}px)`,
        }}
      >
        {data.title}
      </div>

      {/* Untertitel */}
      <div
        style={{
          fontSize: subtitleFontSize,
          fontWeight: 400,
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          marginBottom: Math.round(40 * layout.scale),
          transform: `translateX(${subtitleX}px)`,
          opacity: subtitleOpacity,
          letterSpacing: "0.2px",
        }}
      >
        {data.subtitle}
      </div>

      {/* Zeitraum-Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: Math.round(10 * layout.scale),
          opacity: badgeOpacity,
          alignSelf: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: Math.round(8 * layout.scale),
            padding: `${Math.round(10 * layout.scale)}px ${Math.round(20 * layout.scale)}px`,
            borderRadius: Math.round(8 * layout.scale),
            border: "1px solid rgba(56,189,248,0.25)",
            backgroundColor: "rgba(56,189,248,0.08)",
          }}
        >
          <div
            style={{
              width: Math.round(8 * layout.scale),
              height: Math.round(8 * layout.scale),
              borderRadius: "50%",
              backgroundColor: "#38bdf8",
              boxShadow: "0 0 6px #38bdf8",
            }}
          />
          <span
            style={{
              fontSize: badgeFontSize,
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "1px",
            }}
          >
            {firstLabel} – {lastLabel}
          </span>
        </div>

        <div
          style={{
            padding: `${Math.round(10 * layout.scale)}px ${Math.round(20 * layout.scale)}px`,
            borderRadius: Math.round(8 * layout.scale),
            border: "1px solid rgba(255,255,255,0.07)",
            backgroundColor: "rgba(255,255,255,0.03)",
            fontSize: badgeFontSize,
            fontWeight: 500,
            color: "rgba(255,255,255,0.3)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {data.participants.length} Teilnehmer
        </div>
      </div>
    </div>
  );
};
