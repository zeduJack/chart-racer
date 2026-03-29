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
import { getPreviousAngles, saveAngle, saveResearchResult, listResearchResults, deleteResearchResult } from "@/lib/topic-manager";

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
    await Promise.all([
      saveAngle(topic, result),
      saveResearchResult(topic, result),
    ]);

    return NextResponse.json({ data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const results = await listResearchResults();
    return NextResponse.json({ results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") ?? "", 10);
  if (isNaN(id)) return NextResponse.json({ error: "id fehlt" }, { status: 400 });
  try {
    await deleteResearchResult(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
