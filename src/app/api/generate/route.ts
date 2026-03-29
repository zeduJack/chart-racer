/**
 * POST /api/generate
 * Startet AI-Recherche + Video-Rendering (oder Dry-Run)
 *
 * Body: { topic: string, format?: string, resolution?: string, fps?: number, dryRun?: boolean }
 * Response: { videoId: number, status: string, data?: ResearchResult }
 */

import { NextRequest, NextResponse } from "next/server";
import { researchTopic } from "@/lib/ai-researcher";
import { getPreviousAngles, saveAngle, createVideoJob, updateVideoStatus } from "@/lib/topic-manager";
import { renderVideo } from "@/lib/render";
import type { OutputFormat, Resolution } from "@/lib/render";

export async function POST(req: NextRequest) {
  let body: {
    topic?: string;
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

  const { topic, format = "16:9", resolution = "1080p", fps = 30, dryRun = false } = body;

  if (!topic?.trim()) {
    return NextResponse.json({ error: "topic ist erforderlich" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY nicht konfiguriert" },
      { status: 500 }
    );
  }

  try {
    // 1. Blickwinkel-History laden
    const previousAngles = await getPreviousAngles(topic);

    // 2. AI-Recherche
    const result = await researchTopic(topic, previousAngles);

    // 3. In DB speichern
    const angleId = await saveAngle(topic, result);
    const videoId = await createVideoJob(angleId, result, format, resolution, fps);

    if (dryRun) {
      await updateVideoStatus(videoId, "failed", { errorMessage: "dry-run" });
      return NextResponse.json({
        videoId,
        status: "dry-run",
        data: result,
      });
    }

    // 4. Rendering (async im Background — für Production würde man hier eine Queue nutzen)
    // Im MVP: synchrones Rendering (kann dauern)
    await updateVideoStatus(videoId, "rendering");

    try {
      const outputPath = await renderVideo({
        format: format as OutputFormat,
        resolution: resolution as Resolution,
        fps: fps as 30 | 60,
        props: { data: result },
      });

      await updateVideoStatus(videoId, "done", { outputPath });

      return NextResponse.json({
        videoId,
        status: "done",
        outputPath,
        data: result,
      });
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
  return NextResponse.json({ message: "POST /api/generate mit { topic: string }" });
}
