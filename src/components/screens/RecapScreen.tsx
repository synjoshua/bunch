"use client";

import { Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { rankForPoints } from "@/lib/types";

export function RecapScreen() {
  const { goTo, squad, you, startNextWeek, leaveSession, loading } = useBunch();
  if (!squad || !you) return null;

  const weekPct = Math.round(
    (squad.weeklyGoalDays / Math.max(1, squad.weeklyGoalTarget)) * 100,
  );
  const weekSuccess = weekPct >= 75;
  const questDone = squad.mealIdeas.length >= squad.questTarget;
  const pointsThisWeek = weekSuccess ? 4 : weekPct >= 50 ? 2 : 0;
  const rank = rankForPoints(squad.rankPoints);

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <ScreenHeader
        title="Week with your bunch"
        subtitle={`Week ${squad.weekNumber} · plates logged, meals shared`}
        onBack={() => goTo("home")}
      />

      <SectionCard className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
          Goal-days completed
        </p>
        <p className="mt-2 font-display text-4xl text-[var(--ink)]">
          {squad.weeklyGoalDays}/{squad.weeklyGoalTarget}
        </p>
        <ProgressBar
          className="mt-3"
          value={squad.weeklyGoalDays}
          max={Math.max(1, squad.weeklyGoalTarget)}
        />
        <p className="mt-3 text-sm text-[var(--ink-muted)]">
          {weekSuccess
            ? "On track for a successful week — rank points inbound."
            : "Keep logging goal-days. Rank points follow consistency."}
        </p>
      </SectionCard>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <SectionCard className="p-4">
          <p className="text-xs text-[var(--ink-faint)]">Rank points</p>
          <p className="mt-1 font-display text-2xl text-[var(--ink)]">
            +{pointsThisWeek}
          </p>
          <p className="mt-1 text-[11px] text-[var(--ink-muted)]">
            Projected close · {rank.label}
          </p>
        </SectionCard>
        <SectionCard className="p-4">
          <p className="text-xs text-[var(--ink-faint)]">Quest result</p>
          <p className="mt-1 font-display text-2xl text-[var(--ink)]">
            {squad.mealIdeas.length}/{squad.questTarget}
          </p>
          <p className="mt-1 text-[11px] text-[var(--ink-muted)]">
            {questDone
              ? "Shared meals complete"
              : you.sharedQuestToday
                ? "Your idea counted today"
                : "Still room to contribute"}
          </p>
        </SectionCard>
      </div>

      <SectionCard className="mt-3 p-4">
        <p className="text-sm font-semibold text-[var(--ink)]">
          This week&apos;s story
        </p>
        <ul className="mt-3 space-y-2.5 text-sm text-[var(--ink-muted)]">
          <li className="flex gap-2">
            <span className="text-[var(--leaf)]">1.</span>
            {you.goalDayComplete
              ? "You finished a personal goal-day and moved the bunch total."
              : "Log enough protein to finish your goal-day for the bunch."}
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--leaf)]">2.</span>
            {you.sharedQuestToday
              ? "Your shared meal helped the whole bunch."
              : "Share one meal idea so posting helps even without comments."}
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--leaf)]">3.</span>
            Stay consistent through Week 4 to qualify for the rank-tied gift card.
          </li>
        </ul>
      </SectionCard>

      <Button
        className="mt-5 w-full"
        size="lg"
        disabled={loading}
        onClick={() => void startNextWeek()}
      >
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
        onClick={leaveSession}
        className="mt-4 w-full text-center text-xs text-[var(--ink-faint)] underline-offset-2 hover:underline"
      >
        Leave and join as someone else
      </button>
    </div>
  );
}
