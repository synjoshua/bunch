import { logMeal } from "@/lib/session-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionCode?: string;
      memberId?: string;
      mealName?: string;
      protein?: number;
      shareToQuest?: boolean;
      imageDataUrl?: string;
      carbs?: number;
      fat?: number;
      calories?: number;
    };
    const state = logMeal({
      sessionCode: body.sessionCode ?? "",
      memberId: body.memberId ?? "",
      mealName: body.mealName ?? "Logged meal",
      protein: body.protein ?? 30,
      shareToQuest: Boolean(body.shareToQuest),
      imageDataUrl: body.imageDataUrl,
      carbs: body.carbs,
      fat: body.fat,
      calories: body.calories,
    });
    return NextResponse.json(state);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Meal failed" },
      { status: 400 },
    );
  }
}
