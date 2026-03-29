import { interpolate, Img, staticFile } from "remotion";
import type { BarState, ChartData } from "../types";
import { formatValue } from "../hooks/useAnimatedValue";
import { useLayout } from "../hooks/useBarPositions";

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
  const layout = useLayout();
  const LOGO_SIZE = Math.round(48 * layout.scale);
  const rankWidth = Math.round(52 * layout.scale);
  const labelFontSize = Math.round(21 * layout.scale);
  const rankFontSize = Math.round(15 * layout.scale);
  const valueFontSize = Math.round(18 * layout.scale);

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
  const logoLeft = layout.paddingLeft + barWidthPx - LOGO_SIZE / 2;
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
      {/* Hintergrund-Mask für Label-Bereich */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: layout.paddingLeft - 8,
          height: barHeight,
          backgroundColor: "#0d1117",
        }}
      />
      {/* Rang-Nummer */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: rankWidth,
          height: barHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.2)",
          fontSize: rankFontSize,
          fontWeight: 700,
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        }}
      >
        #{Math.round(bar.interpolatedRank) + 1}
      </div>

      {/* Firmen-Label links (mit Platz für Rang-Nummer) */}
      <div
        style={{
          position: "absolute",
          left: rankWidth,
          width: layout.paddingLeft - rankWidth - 16,
          height: barHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 16,
          color: "rgba(255,255,255,0.92)",
          fontSize: labelFontSize,
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
          left: layout.paddingLeft,
          top: 0,
          width: barWidthPx,
          height: barHeight,
          background: `linear-gradient(90deg, ${bar.color}cc 0%, ${bar.color} 60%, ${bar.color}ee 100%)`,
          borderRadius: "0 8px 8px 0",
          boxShadow: `0 2px 16px ${bar.color}44`,
        }}
      />
      {/* Heller Glanzeffekt oben */}
      <div
        style={{
          position: "absolute",
          left: layout.paddingLeft,
          top: 0,
          width: barWidthPx,
          height: Math.floor(barHeight * 0.45),
          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
          borderRadius: "0 8px 0 0",
          pointerEvents: "none",
        }}
      />

      {/* Wert rechts neben dem Balken */}
      <div
        style={{
          position: "absolute",
          left: layout.paddingLeft + barWidthPx + (bar.imageUrl ? LOGO_SIZE / 2 + 10 : 14),
          top: 0,
          height: barHeight,
          display: "flex",
          alignItems: "center",
          color: "rgba(255,255,255,0.75)",
          fontSize: valueFontSize,
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
