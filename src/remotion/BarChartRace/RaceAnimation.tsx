import { useBarPositions } from "../hooks/useBarPositions";
import type { ChartRaceConfig } from "../types";
import { Bar } from "./Bar";
import { TimeDisplay } from "./TimeDisplay";
import { ValueAxis } from "./ValueAxis";
import { ProgressBar } from "./ProgressBar";

interface RaceAnimationProps extends ChartRaceConfig {
  totalDuration: number;
}

export const RaceAnimation: React.FC<RaceAnimationProps> = ({ data, style, totalDuration }) => {
  const { bars, stepProgress, currentLabel, nextLabel, maxValue, maxBarWidth, layout } =
    useBarPositions(data, style);

  const slotHeight = style.barHeight + style.barGap;
  const barsEndY = layout.paddingTop + style.visibleBars * slotHeight;

  const titleFontSize = Math.round(44 * layout.scale);
  const subtitleFontSize = Math.round(22 * layout.scale);
  const titleTop = Math.round(36 * layout.scale);
  const subtitleTop = Math.round(92 * layout.scale);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Hintergrund-Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 5% 50%, rgba(56,189,248,0.04) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 95% 20%, rgba(168,85,247,0.03) 0%, transparent 45%)",
          pointerEvents: "none",
        }}
      />

      {/* Accent-Linie neben Titel */}
      <div
        style={{
          position: "absolute",
          top: titleTop,
          left: layout.paddingLeft - Math.round(14 * layout.scale),
          width: Math.round(4 * layout.scale),
          height: titleFontSize * 1.2 + subtitleFontSize * 1.4 + Math.round(6 * layout.scale),
          background: "linear-gradient(to bottom, #38bdf8, #a78bfa88)",
          borderRadius: Math.round(2 * layout.scale),
        }}
      />

      {/* Titel */}
      <div
        style={{
          position: "absolute",
          top: titleTop,
          left: layout.paddingLeft,
          right: layout.paddingRight,
          color: "rgba(255,255,255,0.95)",
          fontSize: titleFontSize,
          fontWeight: 700,
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
        }}
      >
        {data.title}
      </div>

      {/* Untertitel */}
      <div
        style={{
          position: "absolute",
          top: subtitleTop,
          left: layout.paddingLeft,
          right: layout.paddingRight,
          color: "rgba(255,255,255,0.45)",
          fontSize: subtitleFontSize,
          fontWeight: 400,
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          letterSpacing: "0.1px",
        }}
      >
        {data.subtitle}
      </div>

      {/* Gridlines und Achse */}
      <ValueAxis
        maxValue={maxValue}
        maxBarWidth={maxBarWidth}
        barsEndY={barsEndY}
        valueFormat={data.valueFormat}
      />

      {/* Zeitanzeige (grosses Jahr im Hintergrund) */}
      <TimeDisplay
        currentLabel={currentLabel}
        nextLabel={nextLabel}
        stepProgress={stepProgress}
      />

      {/* Balken */}
      {bars.map((bar) => (
        <Bar
          key={bar.name}
          bar={bar}
          barHeight={style.barHeight}
          stepProgress={stepProgress}
          valueFormat={data.valueFormat}
          maxRank={style.visibleBars}
        />
      ))}

      {/* Progress-Indikator am unteren Rand */}
      <ProgressBar totalFrames={totalDuration} />
    </div>
  );
};
