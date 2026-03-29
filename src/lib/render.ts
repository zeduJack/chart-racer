import path from "path";
import { execSync } from "child_process";
import fs from "fs";

export type OutputFormat = "16:9" | "9:16" | "1:1";
export type Resolution = "720p" | "1080p" | "4k";

interface RenderOptions {
  composition?: string;
  outputPath?: string;
  format?: OutputFormat;
  resolution?: Resolution;
  fps?: 30 | 60;
  props?: Record<string, unknown>;
}

const RESOLUTION_MAP: Record<Resolution, { width: number; height: number }> = {
  "720p":  { width: 1280, height: 720 },
  "1080p": { width: 1920, height: 1080 },
  "4k":    { width: 3840, height: 2160 },
};

// Für 9:16 und 1:1 werden Breite/Höhe getauscht bzw. quadratisch
function getDimensions(format: OutputFormat, resolution: Resolution) {
  const base = RESOLUTION_MAP[resolution];
  if (format === "9:16") {
    return { width: base.height, height: base.width };
  }
  if (format === "1:1") {
    return { width: base.height, height: base.height };
  }
  return base;
}

export async function renderVideo(options: RenderOptions = {}): Promise<string> {
  const {
    composition = "BarChartRace",
    format = "16:9",
    resolution = "1080p",
    fps = 30,
    props,
  } = options;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outputPath =
    options.outputPath ??
    path.join(process.cwd(), "out", `${composition}-${timestamp}.mp4`);

  // Output-Verzeichnis erstellen
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const { width, height } = getDimensions(format, resolution);
  const entryPoint = path.join(process.cwd(), "src", "remotion", "index.ts");

  const propsArg = props
    ? `--props '${JSON.stringify(props)}'`
    : "";

  const cmd = [
    "npx remotion render",
    entryPoint,
    composition,
    outputPath,
    `--width=${width}`,
    `--height=${height}`,
    `--fps=${fps}`,
    propsArg,
    "--log=verbose",
  ]
    .filter(Boolean)
    .join(" ");

  console.log(`\n🎬 Rendering: ${composition}`);
  console.log(`   Format: ${format} (${width}×${height} @ ${fps}fps)`);
  console.log(`   Output: ${outputPath}\n`);

  execSync(cmd, { stdio: "inherit" });

  return outputPath;
}
