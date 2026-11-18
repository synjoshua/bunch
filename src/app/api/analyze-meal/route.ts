import { analyzeMealPhoto } from "@/lib/analyze-meal";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { imageDataUrl?: string };
    if (!body.imageDataUrl) {
      return NextResponse.json({ error: "Missing photo." }, { status: 400 });
    }
    const macros = await analyzeMealPhoto(body.imageDataUrl);
    return NextResponse.json(macros);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analyze failed" },
      { status: 400 },
    );
  }
}
