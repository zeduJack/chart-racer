/**
 * GET /api/videos
 * Gibt alle generierten Videos zurück
 */

import { NextResponse } from "next/server";
import { listVideos } from "@/lib/topic-manager";

export async function GET() {
  try {
    const videos = await listVideos();
    return NextResponse.json({ videos });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
