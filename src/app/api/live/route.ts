import { getLiveBoard, resetSession } from "@/lib/session-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionCode = searchParams.get("session") ?? "BUNCH";
  return NextResponse.json(getLiveBoard(sessionCode));
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionCode = searchParams.get("session") ?? "BUNCH";
  return NextResponse.json(resetSession(sessionCode));
}
