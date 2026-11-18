import { fillDemoTeammates } from "@/lib/session-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionCode?: string;
      memberId?: string;
    };
    const state = fillDemoTeammates(body.sessionCode ?? "", body.memberId ?? "");
    return NextResponse.json(state);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fill failed" },
      { status: 400 },
    );
  }
}
