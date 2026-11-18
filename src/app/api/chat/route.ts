import { postChat } from "@/lib/session-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionCode?: string;
      memberId?: string;
      text?: string;
    };
    const state = postChat({
      sessionCode: body.sessionCode ?? "",
      memberId: body.memberId ?? "",
      text: body.text ?? "",
    });
    return NextResponse.json(state);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat failed" },
      { status: 400 },
    );
  }
}
