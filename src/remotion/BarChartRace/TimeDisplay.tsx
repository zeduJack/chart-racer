import { interpolate } from "remotion";
import { LAYOUT } from "../hooks/useBarPositions";

interface TimeDisplayProps {
  currentLabel: string;
  nextLabel: string;
  stepProgress: number;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  currentLabel,
  nextLabel,
  stepProgress,
}) => {
  // Label wechselt bei 70% des Schritts
  const showNext = stepProgress > 0.7;
  const label = showNext ? nextLabel : currentLabel;

  // Kurzer Scale-Effekt beim Wechsel
  const flipProgress = interpolate(stepProgress, [0.65, 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = showNext ? 1 + flipProgress * 0.03 : 1 - flipProgress * 0.03;

  return (
    <div
      style={{
        position: "absolute",
        bottom: LAYOUT.paddingBottom + 10,
        right: LAYOUT.paddingRight,
        color: "rgba(255,255,255,0.18)",
        fontSize: 180,
        fontWeight: 800,
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        lineHeight: 1,
        userSelect: "none",
        transform: `scale(${scale})`,
        transformOrigin: "right bottom",
      }}
    >
      {label}
    </div>
  );
};
