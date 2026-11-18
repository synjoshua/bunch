import {
  fillDemoRoom,
  getLiveBoard,
  resetSession,
  startDemo,
} from "@/lib/session-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionCode = searchParams.get("session") ?? "BUNCH";
  return NextResponse.json(getLiveBoard(sessionCode));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionCode?: string;
      action?: string;
      targetPeople?: number;
    };
    const sessionCode = body.sessionCode ?? "BUNCH";
    if (body.action === "start") {
      return NextResponse.json(startDemo(sessionCode));
    }
    // TEMP test helper — remove autofill later
    if (body.action === "autofill") {
      return NextResponse.json(
        fillDemoRoom(sessionCode, body.targetPeople ?? 12),
      );
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionCode = searchParams.get("session") ?? "BUNCH";
  return NextResponse.json(resetSession(sessionCode));
}
