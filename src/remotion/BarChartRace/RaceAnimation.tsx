import { useBarPositions, LAYOUT } from "../hooks/useBarPositions";
import type { ChartRaceConfig } from "../types";
import { Bar } from "./Bar";
import { TimeDisplay } from "./TimeDisplay";
import { ValueAxis } from "./ValueAxis";

export const RaceAnimation: React.FC<ChartRaceConfig> = ({ data, style }) => {
  const { bars, stepProgress, currentLabel, nextLabel, maxValue, maxBarWidth } =
    useBarPositions(data, style);

  const slotHeight = style.barHeight + style.barGap;
  const barsEndY = LAYOUT.paddingTop + style.visibleBars * slotHeight;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Titel */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: LAYOUT.paddingLeft,
          right: LAYOUT.paddingRight,
          color: "rgba(255,255,255,0.95)",
          fontSize: 44,
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
          top: 92,
          left: LAYOUT.paddingLeft,
          right: LAYOUT.paddingRight,
          color: "rgba(255,255,255,0.45)",
          fontSize: 22,
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
    </div>
  );
};
