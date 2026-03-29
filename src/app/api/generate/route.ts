/**
 * POST /api/generate
 * Rendert ein Video aus bereits vorhandenen Daten — KEIN AI, KEIN API-Key nötig.
 *
 * Body: { data: ResearchResult, format?: string, resolution?: string, fps?: number, dryRun?: boolean }
 * Response: { videoId: number, status: string, outputPath?: string, data: ResearchResult }
 */

import { NextRequest, NextResponse } from "next/server";
import { saveAngle, createVideoJob, updateVideoStatus } from "@/lib/topic-manager";
import { renderVideo } from "@/lib/render";
import type { OutputFormat, Resolution } from "@/lib/render";
import type { ResearchResult } from "@/lib/ai-researcher";

export async function POST(req: NextRequest) {
  let body: {
    data?: ResearchResult;
    format?: string;
    resolution?: string;
    fps?: number;
    dryRun?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiges JSON im Request-Body" }, { status: 400 });
  }

  const { data, format = "16:9", resolution = "1080p", fps = 30, dryRun = false } = body;

  if (!data || !data.participants || !data.timeLabels) {
    return NextResponse.json(
      { error: "data mit participants und timeLabels ist erforderlich" },
      { status: 400 }
    );
  }

  try {
    // Sicherstellen dass angle gesetzt ist (bei manuell hochgeladenen Daten fehlt es)
    const dataWithAngle: ResearchResult = {
      ...data,
      angle: data.angle || "Eigene Daten",
      timeUnit: data.timeUnit || "year",
      socialMedia: data.socialMedia ?? undefined,
    };

    // In DB speichern (Titel als Topic-Name)
    const angleId = await saveAngle(dataWithAngle.title || "upload", dataWithAngle);
    const videoId = await createVideoJob(angleId, data, format, resolution, fps);

    if (dryRun) {
      await updateVideoStatus(videoId, "failed", { errorMessage: "dry-run" });
      return NextResponse.json({ videoId, status: "dry-run", data: dataWithAngle });
    }

    await updateVideoStatus(videoId, "rendering");

    try {
      const outputPath = await renderVideo({
        format: format as OutputFormat,
        resolution: resolution as Resolution,
        fps: fps as 30 | 60,
        props: { data: dataWithAngle },
      });

      await updateVideoStatus(videoId, "done", { outputPath });

      return NextResponse.json({ videoId, status: "done", outputPath, data: dataWithAngle });
    } catch (renderErr) {
      const msg = renderErr instanceof Error ? renderErr.message : String(renderErr);
      await updateVideoStatus(videoId, "failed", { errorMessage: msg });
      return NextResponse.json({ error: `Rendering fehlgeschlagen: ${msg}`, videoId }, { status: 500 });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "POST /api/generate mit { data: ResearchResult }" });
}
