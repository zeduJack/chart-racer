import { Composition } from "remotion";
import { BarChartRace, INTRO_DURATION, OUTRO_DURATION, computeRaceDuration } from "./BarChartRace";
import { sampleData } from "@/lib/sample-data";
import type { ChartRaceConfig } from "./types";

// Frames pro Zeitschritt (bei 30fps = 2 Sekunden pro Jahr)
const DURATION_PER_STEP = 60;

const defaultStyle: ChartRaceConfig["style"] = {
  visibleBars: 10,
  durationPerStep: DURATION_PER_STEP,
  barHeight: 60,
  barGap: 24,
};

const defaultConfig: ChartRaceConfig = {
  data: sampleData,
  style: defaultStyle,
};

// Gesamtdauer: Intro + Race + Outro
const raceDuration = computeRaceDuration(sampleData.timeLabels, DURATION_PER_STEP);
const durationInFrames = INTRO_DURATION + raceDuration + OUTRO_DURATION;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BarChartRace"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={BarChartRace as any}
        durationInFrames={durationInFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultConfig}
      />
    </>
  );
};
