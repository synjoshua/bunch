export type MealMacros = {
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  confidence: "high" | "medium" | "low";
  source: "ai" | "demo";
  note: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function demoEstimate(imageDataUrl: string): MealMacros {
  // Deterministic-ish demo so the class still works without an API key
  let hash = 0;
  const sample = imageDataUrl.slice(0, 800);
  for (let i = 0; i < sample.length; i++) {
    hash = (hash * 31 + sample.charCodeAt(i)) >>> 0;
  }
  const bowls = [
    "Chicken rice bowl",
    "Salmon salad plate",
    "Tofu veggie scramble",
    "Turkey wrap plate",
    "Greek yogurt bowl",
    "Steak and veggies",
  ];
  const name = bowls[hash % bowls.length];
  const protein = 22 + (hash % 28);
  const carbs = 18 + ((hash >> 3) % 40);
  const fat = 8 + ((hash >> 6) % 18);
  const calories = protein * 4 + carbs * 4 + fat * 9;
  return {
    name,
    protein: clamp(protein, 12, 55),
    carbs: clamp(carbs, 5, 70),
    fat: clamp(fat, 3, 35),
    calories: clamp(calories, 180, 750),
    confidence: "medium",
    source: "demo",
    note: "Demo estimate — add OPENAI_API_KEY on Railway for real vision AI.",
  };
}

function parseMacros(raw: string): Omit<MealMacros, "source" | "note"> | null {
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end < 0) return null;
    const data = JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
    const name = String(data.name || data.meal || "Logged meal").slice(0, 48);
    return {
      name: name.length >= 2 ? name : "Logged meal",
      protein: clamp(Number(data.protein) || 25, 1, 80),
      carbs: clamp(Number(data.carbs) || 20, 0, 120),
      fat: clamp(Number(data.fat) || 10, 0, 80),
      calories: clamp(Number(data.calories) || 350, 50, 1500),
      confidence:
        data.confidence === "high" || data.confidence === "low"
          ? data.confidence
          : "medium",
    };
  } catch {
    return null;
  }
}

export async function analyzeMealPhoto(imageDataUrl: string): Promise<MealMacros> {
  if (!imageDataUrl.startsWith("data:image/")) {
    throw new Error("Need a food photo to analyze.");
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return demoEstimate(imageDataUrl);
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content:
              "You estimate nutrition from a single meal photo for a class nutrition app. Reply with JSON only: {\"name\":\"short meal name\",\"protein\":g,\"carbs\":g,\"fat\":g,\"calories\":kcal,\"confidence\":\"high|medium|low\"}. Be realistic for one plate. No markdown.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Estimate macros for the food in this photo.",
              },
              {
                type: "image_url",
                image_url: { url: imageDataUrl, detail: "low" },
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI vision failed", res.status, errText.slice(0, 300));
      return {
        ...demoEstimate(imageDataUrl),
        note: "AI request failed — using demo estimate. Check OPENAI_API_KEY.",
      };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content || "";
    const parsed = parseMacros(content);
    if (!parsed) {
      return {
        ...demoEstimate(imageDataUrl),
        note: "AI returned an unexpected shape — using demo estimate.",
      };
    }

    return {
      ...parsed,
      source: "ai",
      note: "AI estimate from your photo — tweak if needed, then save to your goal.",
    };
  } catch (err) {
    console.error(err);
    return {
      ...demoEstimate(imageDataUrl),
      note: "AI unreachable — using demo estimate.",
    };
  }
}
