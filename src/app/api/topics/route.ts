/**
 * GET  /api/topics  — Alle Themen mit Blickwinkeln
 * POST /api/topics  — Thema anlegen (ohne AI-Recherche)
 */

import { NextRequest, NextResponse } from "next/server";
import { listTopics, getPreviousAngles } from "@/lib/topic-manager";

export async function GET() {
  try {
    const topics = await listTopics();
    return NextResponse.json({ topics });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { topic?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiges JSON" }, { status: 400 });
  }

  const { topic } = body;
  if (!topic?.trim()) {
    return NextResponse.json({ error: "topic ist erforderlich" }, { status: 400 });
  }

  try {
    const previousAngles = await getPreviousAngles(topic);
    return NextResponse.json({ topic, previousAngles });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
