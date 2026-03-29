#!/usr/bin/env node
/**
 * ChartRacer CLI
 * Usage:
 *   npx ts-node src/cli/index.ts render [--format 16:9] [--resolution 1080p] [--fps 30]
 *   npx ts-node src/cli/index.ts still [--frame 0]
 */

import { renderVideo } from "../lib/render";
import type { OutputFormat, Resolution } from "../lib/render";

const args = process.argv.slice(2);
const command = args[0];

function getArg(flag: string, fallback: string): string {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

async function main() {
  switch (command) {
    case "render": {
      const format = getArg("--format", "16:9") as OutputFormat;
      const resolution = getArg("--resolution", "1080p") as Resolution;
      const fps = parseInt(getArg("--fps", "30"), 10) as 30 | 60;
      const output = getArg("--output", "");

      const outputPath = await renderVideo({
        format,
        resolution,
        fps,
        outputPath: output || undefined,
      });

      console.log(`\n✅ Video gerendert: ${outputPath}`);
      break;
    }

    case "still": {
      const frame = getArg("--frame", "0");
      const { execSync } = await import("child_process");
      const path = await import("path");
      const outPath = path.join(process.cwd(), "out", "stills", `frame-${frame}.png`);
      const cmd = `npx remotion still src/remotion/index.ts BarChartRace ${outPath} --frame=${frame}`;
      execSync(cmd, { stdio: "inherit" });
      console.log(`\n✅ Still gerendert: ${outPath}`);
      break;
    }

    default:
      console.log(`
ChartRacer CLI

Befehle:
  render   [--format 16:9|9:16|1:1] [--resolution 720p|1080p|4k] [--fps 30|60] [--output path.mp4]
  still    [--frame N]

Beispiele:
  npx ts-node src/cli/index.ts render --format 16:9 --resolution 1080p
  npx ts-node src/cli/index.ts still --frame 300
`);
  }
}

main().catch((err) => {
  console.error("❌ Fehler:", err.message);
  process.exit(1);
});
