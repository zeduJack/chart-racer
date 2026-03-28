import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

interface IntroScreenProps {
  title: string;
  subtitle: string;
  durationInFrames: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  title,
  subtitle,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade-In in den ersten 20 Frames
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Fade-Out in den letzten 15 Frames
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // Titel von unten einschwingen
  const titleY = interpolate(frame, [0, 25], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtitle verzögert
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Dekorativer Akzentbalken */}
      <div
        style={{
          width: 80,
          height: 4,
          backgroundColor: "#38bdf8",
          borderRadius: 2,
          marginBottom: 40,
          boxShadow: "0 0 24px #38bdf880",
        }}
      />

      {/* Haupttitel */}
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: "rgba(255,255,255,0.95)",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          letterSpacing: "-1px",
          textAlign: "center",
          maxWidth: 1400,
          lineHeight: 1.15,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </div>

      {/* Untertitel */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 400,
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          marginTop: 28,
          textAlign: "center",
          opacity: subtitleOpacity,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
