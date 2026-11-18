import { getMemberState } from "@/lib/session-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionCode = searchParams.get("session") ?? "";
    const memberId = searchParams.get("memberId") ?? "";
    if (!sessionCode || !memberId) {
      return NextResponse.json(
        { error: "session and memberId are required" },
        { status: 400 },
      );
    }
    const state = getMemberState(sessionCode, memberId);
    return NextResponse.json(state);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "State failed" },
      { status: 400 },
    );
  }
}
