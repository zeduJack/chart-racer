import type { ChartRaceConfig } from "../types";
import { LAYOUT } from "../hooks/useBarPositions";
import { RaceAnimation } from "./RaceAnimation";

export const BarChartRace: React.FC<ChartRaceConfig> = (props) => {
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
      {/* Subtiler Hintergrund-Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.04) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.04) 0%, transparent 60%)",
        }}
      />

      <RaceAnimation {...props} />
    </div>
  );
};
