export type RankId = "bronze" | "silver" | "gold" | "platinum";

export type Member = {
  id: string;
  name: string;
  short: string;
  color: string;
  checkedInToday: boolean;
  goalDaysDone: number;
  goalDaysPlanned: number;
  isYou?: boolean;
};

export type MealIdea = {
  id: string;
  authorId: string;
  title: string;
  protein: number;
  tip: string;
  image: string;
  dayLabel: string;
};

export type RankInfo = {
  id: RankId;
  label: string;
  reward: number;
  pointsNeeded: number;
};

export const RANKS: RankInfo[] = [
  { id: "bronze", label: "Bronze", reward: 1, pointsNeeded: 0 },
  { id: "silver", label: "Silver", reward: 2, pointsNeeded: 8 },
  { id: "gold", label: "Gold", reward: 3, pointsNeeded: 16 },
  { id: "platinum", label: "Platinum", reward: 5, pointsNeeded: 24 },
];

export const SQUAD_NAME = "Protein Pod";
export const SEASON_LABEL = "Season 2 · Week 3 of 4";
export const QUEST_TARGET = 12;
export const WEEKLY_GOAL_TARGET = 20;
export const PERSONAL_PROTEIN_TARGET = 120;

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "you",
    name: "You",
    short: "YO",
    color: "#2F6B4F",
    checkedInToday: false,
    goalDaysDone: 3,
    goalDaysPlanned: 5,
    isYou: true,
  },
  {
    id: "maya",
    name: "Maya",
    short: "MA",
    color: "#C46B3A",
    checkedInToday: true,
    goalDaysDone: 4,
    goalDaysPlanned: 5,
  },
  {
    id: "leo",
    name: "Leo",
    short: "LE",
    color: "#3A6EA5",
    checkedInToday: true,
    goalDaysDone: 4,
    goalDaysPlanned: 5,
  },
  {
    id: "sam",
    name: "Sam",
    short: "SA",
    color: "#7A5C9E",
    checkedInToday: false,
    goalDaysDone: 3,
    goalDaysPlanned: 5,
  },
];

export const INITIAL_MEAL_IDEAS: MealIdea[] = [
  {
    id: "m1",
    authorId: "maya",
    title: "Greek yogurt parfait",
    protein: 28,
    tip: "Add hemp seeds for +10g.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    dayLabel: "Mon",
  },
  {
    id: "m2",
    authorId: "leo",
    title: "Chicken rice bowl",
    protein: 42,
    tip: "Meal-prep Sunday nights.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    dayLabel: "Mon",
  },
  {
    id: "m3",
    authorId: "sam",
    title: "Tofu scramble wrap",
    protein: 31,
    tip: "Extra-firm tofu holds better.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    dayLabel: "Tue",
  },
  {
    id: "m4",
    authorId: "maya",
    title: "Cottage cheese toast",
    protein: 24,
    tip: "Everything bagel seasoning!",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
    dayLabel: "Tue",
  },
  {
    id: "m5",
    authorId: "leo",
    title: "Salmon poke leftovers",
    protein: 38,
    tip: "Use frozen edamame packs.",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    dayLabel: "Wed",
  },
  {
    id: "m6",
    authorId: "sam",
    title: "Lentil pasta primavera",
    protein: 29,
    tip: "Barilla Protein+ works too.",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
    dayLabel: "Wed",
  },
  {
    id: "m7",
    authorId: "maya",
    title: "Egg white omelet",
    protein: 26,
    tip: "Spinach + feta is the move.",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
    dayLabel: "Thu",
  },
  {
    id: "m8",
    authorId: "leo",
    title: "Turkey chili",
    protein: 36,
    tip: "Freezes well for busy weeks.",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    dayLabel: "Thu",
  },
];

export const SAMPLE_LUNCH = {
  name: "Chicken quinoa bowl",
  protein: 38,
  image:
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
  tip: "Swap quinoa for farro if you want more chew.",
};

export function rankForPoints(points: number): RankInfo {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (points >= rank.pointsNeeded) current = rank;
  }
  return current;
}

export function nextRank(points: number): RankInfo | null {
  const current = rankForPoints(points);
  const idx = RANKS.findIndex((r) => r.id === current.id);
  return RANKS[idx + 1] ?? null;
}
