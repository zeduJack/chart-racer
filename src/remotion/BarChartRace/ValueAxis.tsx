import { scaleLinear } from "d3-scale";
import { useLayout } from "../hooks/useBarPositions";
import { formatValue } from "../hooks/useAnimatedValue";
import type { ChartData } from "../types";

interface ValueAxisProps {
  maxValue: number;
  maxBarWidth: number;
  barsEndY: number; // Y wo die Balken enden
  valueFormat: ChartData["valueFormat"];
}

const TICK_COUNT = 6;

export const ValueAxis: React.FC<ValueAxisProps> = ({
  maxValue,
  maxBarWidth,
  barsEndY,
  valueFormat,
}) => {
  const layout = useLayout();
  const xScale = scaleLinear().domain([0, maxValue]).range([0, maxBarWidth]);
  const ticks = xScale.ticks(TICK_COUNT);
  const tickFontSize = Math.round(16 * layout.scale);

  return (
    <div
      style={{
        position: "absolute",
        left: layout.paddingLeft,
        top: 0,
        width: maxBarWidth,
        height: layout.canvasHeight,
        pointerEvents: "none",
        zIndex: 200, // Über allen Balken
      }}
    >
      {ticks.map((tick) => {
        const x = xScale(tick);
        return (
          <div key={tick}>
            {/* Vertikale Gridline durch den gesamten Chart-Bereich */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: layout.paddingTop - 10,
                width: 1,
                height: barsEndY - layout.paddingTop + 10,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
            {/* Tick-Label */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: barsEndY + 14,
                transform: "translateX(-50%)",
                color: "rgba(255,255,255,0.35)",
                fontSize: tickFontSize,
                fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {formatValue(tick, valueFormat)}
            </div>
          </div>
        );
      })}

      {/* Horizontale Baseline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: barsEndY,
          width: maxBarWidth,
          height: 1,
          backgroundColor: "rgba(255,255,255,0.12)",
        }}
      />
    </div>
  );
};
