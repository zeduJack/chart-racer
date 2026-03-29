import { useCurrentFrame, useVideoConfig } from "remotion";

interface ProgressBarProps {
  totalFrames: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const progress = Math.min(frame / totalFrames, 1);
  const barWidth = progress * width;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: barWidth,
          background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)",
          boxShadow: "0 0 8px #38bdf880",
        }}
      />
    </div>
  );
};
