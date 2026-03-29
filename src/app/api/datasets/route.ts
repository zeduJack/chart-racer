import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { userDatasets } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.select().from(userDatasets).orderBy(desc(userDatasets.createdAt)).all();
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, data } = await req.json();
    if (!name || !data) {
      return NextResponse.json({ error: "name und data erforderlich" }, { status: 400 });
    }
    const db = getDb();
    const inserted = db
      .insert(userDatasets)
      .values({ name, dataJson: JSON.stringify(data) })
      .returning()
      .get();
    return NextResponse.json(inserted, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "id erforderlich" }, { status: 400 });
    const db = getDb();
    db.delete(userDatasets).where(eq(userDatasets.id, id)).run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
