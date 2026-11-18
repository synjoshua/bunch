import { advanceWeek } from "@/lib/session-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionCode?: string;
      memberId?: string;
    };
    const state = advanceWeek(body.sessionCode ?? "", body.memberId ?? "");
    return NextResponse.json(state);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Week failed" },
      { status: 400 },
    );
  }
}
