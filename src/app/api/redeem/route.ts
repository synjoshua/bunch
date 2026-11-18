import { NextResponse } from "next/server";
import { redeemGiftCard } from "@/lib/session-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      sessionCode?: string;
      memberId?: string;
    };
    if (!body.sessionCode || !body.memberId) {
      return NextResponse.json(
        { error: "sessionCode and memberId are required." },
        { status: 400 },
      );
    }
    const state = redeemGiftCard(body.sessionCode, body.memberId);
    return NextResponse.json(state);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Redeem failed" },
      { status: 400 },
    );
  }
}
