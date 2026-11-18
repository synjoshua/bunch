"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_MEAL_IDEAS,
  INITIAL_MEMBERS,
  PERSONAL_PROTEIN_TARGET,
  QUEST_TARGET,
  SAMPLE_LUNCH,
  WEEKLY_GOAL_TARGET,
  type MealIdea,
  type Member,
} from "./demo-data";

export type Screen =
  | "join"
  | "home"
  | "log"
  | "quest"
  | "rank"
  | "recap";

type NoriState = {
  screen: Screen;
  joined: boolean;
  members: Member[];
  mealIdeas: MealIdea[];
  weeklyGoalDays: number;
  personalProtein: number;
  goalDayComplete: boolean;
  sharedToQuest: boolean;
  mealLogged: boolean;
  seasonWeeksHit: number;
  personalWeeksParticipated: number;
  rankPoints: number;
  questsCompletedThisSeason: number;
  goTo: (screen: Screen) => void;
  joinSquad: () => void;
  saveMeal: (opts: { shareToQuest: boolean; protein: number; name: string }) => void;
  shareExistingIdea: () => void;
  startNextWeek: () => void;
  resetDemo: () => void;
};

const NoriContext = createContext<NoriState | null>(null);

const INITIAL_PROTEIN = 82;
const INITIAL_WEEKLY = 14;
const INITIAL_RANK_POINTS = 12;
const INITIAL_SEASON_WEEKS = 2;
const INITIAL_PERSONAL_WEEKS = 2;
const INITIAL_QUESTS_DONE = 2;

export function NoriProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("join");
  const [joined, setJoined] = useState(false);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [mealIdeas, setMealIdeas] = useState(INITIAL_MEAL_IDEAS);
  const [weeklyGoalDays, setWeeklyGoalDays] = useState(INITIAL_WEEKLY);
  const [personalProtein, setPersonalProtein] = useState(INITIAL_PROTEIN);
  const [goalDayComplete, setGoalDayComplete] = useState(false);
  const [sharedToQuest, setSharedToQuest] = useState(false);
  const [mealLogged, setMealLogged] = useState(false);
  const [seasonWeeksHit, setSeasonWeeksHit] = useState(INITIAL_SEASON_WEEKS);
  const [personalWeeksParticipated, setPersonalWeeksParticipated] = useState(
    INITIAL_PERSONAL_WEEKS,
  );
  const [rankPoints, setRankPoints] = useState(INITIAL_RANK_POINTS);
  const [questsCompletedThisSeason, setQuestsCompletedThisSeason] = useState(
    INITIAL_QUESTS_DONE,
  );

  const goTo = useCallback((next: Screen) => setScreen(next), []);

  const joinSquad = useCallback(() => {
    setJoined(true);
    setScreen("home");
  }, []);

  const saveMeal = useCallback(
    (opts: { shareToQuest: boolean; protein: number; name: string }) => {
      const nextProtein = Math.min(
        PERSONAL_PROTEIN_TARGET + 40,
        personalProtein + opts.protein,
      );
      setPersonalProtein(nextProtein);
      setMealLogged(true);

      const completedNow =
        !goalDayComplete && nextProtein >= PERSONAL_PROTEIN_TARGET;
      if (completedNow) {
        setGoalDayComplete(true);
        setWeeklyGoalDays((d) => Math.min(WEEKLY_GOAL_TARGET, d + 1));
        setMembers((prev) =>
          prev.map((m) =>
            m.isYou
              ? {
                  ...m,
                  checkedInToday: true,
                  goalDaysDone: Math.min(m.goalDaysPlanned, m.goalDaysDone + 1),
                }
              : m,
          ),
        );
      } else if (!goalDayComplete) {
        setMembers((prev) =>
          prev.map((m) => (m.isYou ? { ...m, checkedInToday: true } : m)),
        );
      }

      if (opts.shareToQuest && !sharedToQuest) {
        setSharedToQuest(true);
        const idea: MealIdea = {
          id: `you-${Date.now()}`,
          authorId: "you",
          title: opts.name,
          protein: opts.protein,
          tip: SAMPLE_LUNCH.tip,
          image: SAMPLE_LUNCH.image,
          dayLabel: "Today",
        };
        setMealIdeas((prev) => [...prev, idea]);
        if (mealIdeas.length + 1 >= QUEST_TARGET) {
          setQuestsCompletedThisSeason((q) => Math.min(4, q + 1));
        }
      }

      setScreen("home");
    },
    [goalDayComplete, mealIdeas.length, personalProtein, sharedToQuest],
  );

  const shareExistingIdea = useCallback(() => {
    if (sharedToQuest) {
      setScreen("quest");
      return;
    }
    setSharedToQuest(true);
    const idea: MealIdea = {
      id: `you-${Date.now()}`,
      authorId: "you",
      title: SAMPLE_LUNCH.name,
      protein: SAMPLE_LUNCH.protein,
      tip: SAMPLE_LUNCH.tip,
      image: SAMPLE_LUNCH.image,
      dayLabel: "Today",
    };
    setMealIdeas((prev) => [...prev, idea]);
    setScreen("quest");
  }, [sharedToQuest]);

  const startNextWeek = useCallback(() => {
    const percent = weeklyGoalDays / WEEKLY_GOAL_TARGET;
    const weekSuccess = percent >= 0.75;
    if (weekSuccess) {
      setSeasonWeeksHit((w) => Math.min(4, w + 1));
      setRankPoints((p) => p + 4);
    }
    if (mealLogged || goalDayComplete) {
      setPersonalWeeksParticipated((w) => Math.min(4, w + 1));
    }
    if (mealIdeas.length >= QUEST_TARGET) {
      setQuestsCompletedThisSeason((q) => Math.min(4, q + 1));
    }
    setScreen("home");
  }, [goalDayComplete, mealIdeas.length, mealLogged, weeklyGoalDays]);

  const resetDemo = useCallback(() => {
    setScreen("join");
    setJoined(false);
    setMembers(INITIAL_MEMBERS);
    setMealIdeas(INITIAL_MEAL_IDEAS);
    setWeeklyGoalDays(INITIAL_WEEKLY);
    setPersonalProtein(INITIAL_PROTEIN);
    setGoalDayComplete(false);
    setSharedToQuest(false);
    setMealLogged(false);
    setSeasonWeeksHit(INITIAL_SEASON_WEEKS);
    setPersonalWeeksParticipated(INITIAL_PERSONAL_WEEKS);
    setRankPoints(INITIAL_RANK_POINTS);
    setQuestsCompletedThisSeason(INITIAL_QUESTS_DONE);
  }, []);

  const value = useMemo(
    () => ({
      screen,
      joined,
      members,
      mealIdeas,
      weeklyGoalDays,
      personalProtein,
      goalDayComplete,
      sharedToQuest,
      mealLogged,
      seasonWeeksHit,
      personalWeeksParticipated,
      rankPoints,
      questsCompletedThisSeason,
      goTo,
      joinSquad,
      saveMeal,
      shareExistingIdea,
      startNextWeek,
      resetDemo,
    }),
    [
      screen,
      joined,
      members,
      mealIdeas,
      weeklyGoalDays,
      personalProtein,
      goalDayComplete,
      sharedToQuest,
      mealLogged,
      seasonWeeksHit,
      personalWeeksParticipated,
      rankPoints,
      questsCompletedThisSeason,
      goTo,
      joinSquad,
      saveMeal,
      shareExistingIdea,
      startNextWeek,
      resetDemo,
    ],
  );

  return <NoriContext.Provider value={value}>{children}</NoriContext.Provider>;
}

export function useNori() {
  const ctx = useContext(NoriContext);
  if (!ctx) throw new Error("useNori must be used within NoriProvider");
  return ctx;
}
