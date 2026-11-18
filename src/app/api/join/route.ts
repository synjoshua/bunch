import { joinSession } from "@/lib/session-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionCode?: string;
      name?: string;
    };
    const result = joinSession(body.sessionCode ?? "NORI", body.name ?? "");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Join failed" },
      { status: 400 },
    );
  }
}
