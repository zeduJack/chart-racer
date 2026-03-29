"use client";

import { Player } from "@remotion/player";
import { BarChartRace, INTRO_DURATION, OUTRO_DURATION, computeRaceDuration } from "@/remotion/BarChartRace";
import { sampleData } from "@/lib/sample-data";
import type { ChartRaceConfig } from "@/remotion/types";

const DURATION_PER_STEP = 60;

const defaultStyle: ChartRaceConfig["style"] = {
  visibleBars: 10,
  durationPerStep: DURATION_PER_STEP,
  barHeight: 60,
  barGap: 24,
};

const inputProps: ChartRaceConfig = {
  data: sampleData,
  style: defaultStyle,
};

const raceDuration = computeRaceDuration(sampleData.timeLabels, DURATION_PER_STEP);
const durationInFrames = INTRO_DURATION + raceDuration + OUTRO_DURATION;

export function RemotionPlayer() {
  return (
    <Player
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component={BarChartRace as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inputProps={inputProps as any}
      durationInFrames={durationInFrames}
      fps={30}
      compositionWidth={1920}
      compositionHeight={1080}
      style={{ width: "100%", borderRadius: 12 }}
      controls
      loop
    />
  );
}
