export type RankId = "bronze" | "silver" | "gold" | "platinum";

export type RankInfo = {
  id: RankId;
  label: string;
  reward: number;
  pointsNeeded: number;
};

export type MealIdea = {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  protein: number;
  tip: string;
  image: string;
  dayLabel: string;
  createdAt: number;
};

export type ChatMessage = {
  id: string;
  authorId: string;
  authorName: string;
  authorShort: string;
  authorColor: string;
  text: string;
  kind: "chat" | "system" | "meal";
  createdAt: number;
};

export type Member = {
  id: string;
  name: string;
  short: string;
  color: string;
  squadId: string | null;
  isBot: boolean;
  proteinTarget: number;
  personalProtein: number;
  goalDayComplete: boolean;
  goalDaysDone: number;
  goalDaysPlanned: number;
  sharedQuestToday: boolean;
  mealLogged: boolean;
  weeksParticipated: number;
  joinedAt: number;
  lastSeenAt: number;
};

export type Squad = {
  id: string;
  name: string;
  memberIds: string[];
  mealIdeas: MealIdea[];
  messages: ChatMessage[];
  rankPoints: number;
  seasonWeeksHit: number;
  questsCompletedThisSeason: number;
  weekNumber: number;
  open: boolean;
};

export type Session = {
  code: string;
  createdAt: number;
  members: Record<string, Member>;
  squads: Record<string, Squad>;
};

export type SquadView = {
  id: string;
  name: string;
  members: Array<{
    id: string;
    name: string;
    short: string;
    color: string;
    isYou: boolean;
    isBot: boolean;
    checkedInToday: boolean;
    goalDaysDone: number;
    goalDaysPlanned: number;
    personalProtein: number;
    proteinTarget: number;
    goalDayComplete: boolean;
  }>;
  weeklyGoalDays: number;
  weeklyGoalTarget: number;
  mealIdeas: MealIdea[];
  messages: ChatMessage[];
  questTarget: number;
  rankPoints: number;
  seasonWeeksHit: number;
  questsCompletedThisSeason: number;
  weekNumber: number;
  open: boolean;
};

export type LiveSquadCard = {
  id: string;
  name: string;
  memberCount: number;
  memberNames: string[];
  weeklyGoalDays: number;
  weeklyGoalTarget: number;
  questCount: number;
  questTarget: number;
  rankLabel: string;
  reward: number;
};

export const RANKS: RankInfo[] = [
  { id: "bronze", label: "Bronze", reward: 1, pointsNeeded: 0 },
  { id: "silver", label: "Silver", reward: 2, pointsNeeded: 8 },
  { id: "gold", label: "Gold", reward: 3, pointsNeeded: 16 },
  { id: "platinum", label: "Platinum", reward: 5, pointsNeeded: 24 },
];

export const QUEST_TARGET = 12;
export const GOAL_DAYS_PER_PERSON = 5;
export const SQUAD_SIZE = 4;
export const SQUAD_MAX = 5;
export const DEFAULT_PROTEIN_TARGET = 120;
export const DEFAULT_SESSION_CODE = "BUNCH";
export const SEASON_WEEKS = 4;

export const SQUAD_NAMES = [
  "Protein Pod",
  "Leaf League",
  "Macro Mates",
  "Bite Crew",
  "Goal Bunch",
  "Plate Patrol",
  "Fuel Friends",
  "Snack Squad",
  "Bowl Bunch",
  "Quest Quartet",
  "Rank Raisers",
  "Meal Movers",
  "Daily Dozen",
  "XP Pack",
  "Consistency Club",
];

export const AVATAR_COLORS = [
  "#5B50E8",
  "#FFAE98",
  "#25243A",
  "#7C74F0",
  "#E8896F",
  "#4338CA",
  "#9B93F5",
  "#DFFF83",
];

export const SAMPLE_MEALS = [
  {
    name: "Chicken quinoa bowl",
    protein: 38,
    tip: "Swap quinoa for farro if you want more chew.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
  },
  {
    name: "Greek yogurt parfait",
    protein: 28,
    tip: "Add hemp seeds for +10g.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
  },
  {
    name: "Tofu scramble wrap",
    protein: 31,
    tip: "Extra-firm tofu holds better.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  },
  {
    name: "Turkey chili",
    protein: 36,
    tip: "Freezes well for busy weeks.",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
  },
];

/** Extra food shots for splash / home atmosphere */
export const FOOD_SHOTS = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop",
];

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

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
