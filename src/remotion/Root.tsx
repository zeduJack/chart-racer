import { Composition } from "remotion";

// Platzhalter — wird in Story 1.2 durch die echte Animation ersetzt
const BarChartRacePlaceholder: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        color: "#f1f5f9",
        fontFamily: "sans-serif",
        fontSize: 48,
      }}
    >
      ChartRacer — Bar Chart Race
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BarChartRace"
        component={BarChartRacePlaceholder}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
