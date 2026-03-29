/**
 * POST /api/research
 * KI-Recherche zu einem Thema via Claude API
 *
 * Body: { topic: string }
 * Response: { data: ResearchResult }
 * Requires: ANTHROPIC_API_KEY
 */

import { NextRequest, NextResponse } from "next/server";
import { researchTopic } from "@/lib/ai-researcher";
import { getPreviousAngles, saveAngle } from "@/lib/topic-manager";

export async function POST(req: NextRequest) {
  let body: { topic?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiges JSON im Request-Body" }, { status: 400 });
  }

  const { topic } = body;

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
    const previousAngles = await getPreviousAngles(topic);
    const result = await researchTopic(topic, previousAngles);
    await saveAngle(topic, result);

    return NextResponse.json({ data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "POST /api/research mit { topic: string }" });
}
