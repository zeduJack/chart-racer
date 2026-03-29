"use client";

import { useMemo } from "react";
import { Player } from "@remotion/player";
import { BarChartRace, INTRO_DURATION, OUTRO_DURATION, computeRaceDuration } from "@/remotion/BarChartRace";
import type { ChartRaceConfig, ChartStyle } from "@/remotion/types";
import type { ResearchResult } from "@/lib/ai-researcher";
import { sampleData } from "@/lib/sample-data";

interface ConfigurablePlayerProps {
  data?: ResearchResult | null;
  style: ChartStyle;
  format?: "16:9" | "9:16" | "1:1";
}

// Dimensions pro Format
const FORMAT_DIMS = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1":  { width: 1080, height: 1080 },
};

export function ConfigurablePlayer({ data, style, format = "16:9" }: ConfigurablePlayerProps) {
  const dims = FORMAT_DIMS[format];

  const inputProps: ChartRaceConfig = useMemo(() => {
    if (data) {
      return {
        data: {
          title: data.title,
          subtitle: data.subtitle,
          timeLabels: data.timeLabels,
          participants: data.participants,
          valueFormat: data.valueFormat,
        },
        style,
      };
    }
    return { data: sampleData, style };
  }, [data, style]);

  const durationInFrames = useMemo(() => {
    const raceDuration = computeRaceDuration(inputProps.data.timeLabels, style.durationPerStep);
    return INTRO_DURATION + raceDuration + OUTRO_DURATION;
  }, [inputProps.data.timeLabels, style.durationPerStep]);

  return (
    <div className="w-full">
      {/* Format-Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-white/30">Preview</span>
        <span className="text-xs text-white/50 bg-white/[0.06] px-2 py-0.5 rounded">
          {format} · {dims.width}×{dims.height}
        </span>
        <span className="text-xs text-white/30">
          {(durationInFrames / 30).toFixed(1)}s · {durationInFrames} frames
        </span>
      </div>

      {/* Player */}
      <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black shadow-xl">
        <Player
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={BarChartRace as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputProps={inputProps as any}
          durationInFrames={durationInFrames}
          fps={30}
          compositionWidth={dims.width}
          compositionHeight={dims.height}
          style={{ width: "100%" }}
          controls
          loop
          acknowledgeRemotionLicense
        />
      </div>

      {/* Daten-Info */}
      {data && (
        <div className="mt-2 flex items-center gap-3 text-xs text-white/30">
          <span>{data.participants.length} Teilnehmer</span>
          <span>·</span>
          <span>{data.timeLabels.length} Zeitpunkte</span>
          <span>·</span>
          <span>{data.timeLabels[0]} – {data.timeLabels[data.timeLabels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}
