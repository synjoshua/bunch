"use client";

import { Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import {
  QUEST_TARGET,
  WEEKLY_GOAL_TARGET,
  rankForPoints,
} from "@/lib/demo-data";
import { useNori } from "@/lib/nori-context";

export function RecapScreen() {
  const {
    goTo,
    weeklyGoalDays,
    mealIdeas,
    goalDayComplete,
    sharedToQuest,
    rankPoints,
    startNextWeek,
    resetDemo,
  } = useNori();

  const weekPct = Math.round((weeklyGoalDays / WEEKLY_GOAL_TARGET) * 100);
  const weekSuccess = weekPct >= 75;
  const questDone = mealIdeas.length >= QUEST_TARGET;
  const pointsThisWeek = weekSuccess ? 4 : weekPct >= 50 ? 2 : 0;
  const rank = rankForPoints(rankPoints);

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <ScreenHeader
        title="Weekly recap"
        subtitle="Week 3 · why coming back matters"
        onBack={() => goTo("home")}
      />

      <SectionCard className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
          Goal-days completed
        </p>
        <p className="mt-2 font-display text-4xl text-[var(--ink)]">
          {weeklyGoalDays}/{WEEKLY_GOAL_TARGET}
        </p>
        <ProgressBar
          className="mt-3"
          value={weeklyGoalDays}
          max={WEEKLY_GOAL_TARGET}
        />
        <p className="mt-3 text-sm text-[var(--ink-muted)]">
          {weekSuccess
            ? "On track for a successful week — rank points inbound."
            : "Keep logging goal-days. Rank points follow consistency, not volume."}
        </p>
      </SectionCard>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <SectionCard className="p-4">
          <p className="text-xs text-[var(--ink-faint)]">Rank points</p>
          <p className="mt-1 font-display text-2xl text-[var(--ink)]">
            +{pointsThisWeek}
          </p>
          <p className="mt-1 text-[11px] text-[var(--ink-muted)]">
            Projected if the week closes like this · {rank.label} stays in play
          </p>
        </SectionCard>
        <SectionCard className="p-4">
          <p className="text-xs text-[var(--ink-faint)]">Quest result</p>
          <p className="mt-1 font-display text-2xl text-[var(--ink)]">
            {mealIdeas.length}/{QUEST_TARGET}
          </p>
          <p className="mt-1 text-[11px] text-[var(--ink-muted)]">
            {questDone
              ? "Recipe Relay complete"
              : sharedToQuest
                ? "Your idea counted today"
                : "Still room to contribute"}
          </p>
        </SectionCard>
      </div>

      <SectionCard className="mt-3 p-4">
        <p className="text-sm font-semibold text-[var(--ink)]">This week&apos;s story</p>
        <ul className="mt-3 space-y-2.5 text-sm text-[var(--ink-muted)]">
          <li className="flex gap-2">
            <span className="text-[var(--leaf)]">1.</span>
            {goalDayComplete
              ? "You finished a personal goal-day — the squad moved to 15/20."
              : "Log enough protein to finish your goal-day and bump the squad total."}
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--leaf)]">2.</span>
            {sharedToQuest
              ? "Your shared meal advanced Recipe Relay and joined the collection."
              : "Share one meal idea to help the quest without needing comments."}
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--leaf)]">3.</span>
            Stay consistent through Week 4 to qualify for the rank-tied gift card.
          </li>
        </ul>
      </SectionCard>

      <Button className="mt-5 w-full" size="lg" onClick={startNextWeek}>
        Start next week
      </Button>
      <Button
        className="mt-2 w-full"
        variant="ghost"
        onClick={() => goTo("rank")}
      >
        Review rank & reward rules
      </Button>
      <button
        type="button"
        onClick={resetDemo}
        className="mt-4 w-full text-center text-xs text-[var(--ink-faint)] underline-offset-2 hover:underline"
      >
        Reset demo from the start
      </button>
    </div>
  );
}
