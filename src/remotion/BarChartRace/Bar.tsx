import { interpolate, Img, staticFile } from "remotion";
import type { BarState, ChartData } from "../types";
import { formatValue } from "../hooks/useAnimatedValue";
import { LAYOUT } from "../hooks/useBarPositions";

const LOGO_SIZE = 48; // px, Logo-Grösse (quadratisch)

interface BarProps {
  bar: BarState;
  barHeight: number;
  stepProgress: number;
  valueFormat: ChartData["valueFormat"];
  maxRank: number;
}

export const Bar: React.FC<BarProps> = ({
  bar,
  barHeight,
  stepProgress,
  valueFormat,
  maxRank,
}) => {
  // Höherer Rang = niedrigerer z-index (Rank 0 = oben, hat höchsten z-index)
  const zIndex = maxRank - Math.round(bar.interpolatedRank);
  // Opacity: einblenden wenn entering, ausblenden wenn leaving
  let opacity = 1;
  if (bar.isEntering) {
    opacity = interpolate(stepProgress, [0, 0.3], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (bar.isLeaving) {
    opacity = interpolate(stepProgress, [0.7, 1], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const formattedValue = formatValue(bar.currentValue, valueFormat);
  const barWidthPx = Math.max(bar.barWidth, 2);

  // Logo sitzt am rechten Ende des Balkens (innerhalb wenn Platz, sonst daneben)
  const logoLeft = LAYOUT.paddingLeft + barWidthPx - LOGO_SIZE / 2;
  const showLogoInside = barWidthPx > LOGO_SIZE * 2;

  return (
    <div
      style={{
        position: "absolute",
        top: bar.yPosition,
        left: 0,
        right: 0,
        height: barHeight,
        opacity,
        zIndex,
      }}
    >
      {/* Hintergrund-Mask nur für den Label-Bereich links */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: LAYOUT.paddingLeft - 8,
          height: barHeight,
          backgroundColor: "#0d1117",
        }}
      />

      {/* Firmen-Label links */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: LAYOUT.paddingLeft - 20,
          height: barHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 20,
          color: "rgba(255,255,255,0.92)",
          fontSize: 22,
          fontWeight: 600,
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          letterSpacing: "-0.3px",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {bar.name}
      </div>

      {/* Balken */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.paddingLeft,
          top: 0,
          width: barWidthPx,
          height: barHeight,
          backgroundColor: bar.color,
          borderRadius: "0 8px 8px 0",
          boxShadow: `0 0 20px ${bar.color}66`,
        }}
      />

      {/* Wert rechts neben dem Balken */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.paddingLeft + barWidthPx + (bar.imageUrl ? LOGO_SIZE / 2 + 10 : 14),
          top: 0,
          height: barHeight,
          display: "flex",
          alignItems: "center",
          color: "rgba(255,255,255,0.75)",
          fontSize: 18,
          fontWeight: 500,
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {formattedValue}
      </div>

      {/* Logo am Balkenende */}
      {bar.imageUrl && (
        <div
          style={{
            position: "absolute",
            left: logoLeft,
            top: (barHeight - LOGO_SIZE) / 2,
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: showLogoInside ? "rgba(255,255,255,0.1)" : "#1e2736",
            border: "2px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={
              bar.imageUrl?.startsWith("http")
                ? bar.imageUrl
                : staticFile(bar.imageUrl!)
            }
            style={{
              width: LOGO_SIZE - 8,
              height: LOGO_SIZE - 8,
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        </div>
      )}
    </div>
  );
};
