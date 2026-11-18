"use client";

import { Avatar, Button, Pill, ProgressBar, SectionCard } from "@/components/ui";
import {
  PERSONAL_PROTEIN_TARGET,
  QUEST_TARGET,
  SEASON_LABEL,
  SQUAD_NAME,
  WEEKLY_GOAL_TARGET,
  nextRank,
  rankForPoints,
} from "@/lib/demo-data";
import { useNori } from "@/lib/nori-context";
import { Gift, Sparkles, Utensils } from "lucide-react";

export function HomeScreen() {
  const {
    members,
    mealIdeas,
    weeklyGoalDays,
    personalProtein,
    goalDayComplete,
    sharedToQuest,
    mealLogged,
    rankPoints,
    goTo,
  } = useNori();

  const rank = rankForPoints(rankPoints);
  const upcoming = nextRank(rankPoints);
  const questCount = mealIdeas.length;
  const weekPct = Math.round((weeklyGoalDays / WEEKLY_GOAL_TARGET) * 100);

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-[1.75rem] leading-none text-[var(--leaf-deep)]">
            nori
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--ink-faint)]">
            {SEASON_LABEL}
          </p>
        </div>
        <button
          onClick={() => goTo("rank")}
          className="rounded-2xl bg-white/80 px-3 py-2 text-left shadow-sm border border-white/70"
        >
          <p className="text-[10px] uppercase tracking-wider text-[var(--ink-faint)]">
            Rank
          </p>
          <p className="text-sm font-bold text-[var(--ink)]">{rank.label}</p>
        </button>
      </div>

      <SectionCard className="mt-5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              {SQUAD_NAME}
            </p>
            <h2 className="mt-1 font-display text-xl text-[var(--ink)]">
              Weekly goal-days
            </h2>
          </div>
          <Pill className="bg-[var(--leaf-soft)] text-[var(--leaf-deep)]">
            {weekPct}%
          </Pill>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <p className="font-display text-3xl text-[var(--ink)]">
            {weeklyGoalDays}
            <span className="text-lg text-[var(--ink-muted)]">
              /{WEEKLY_GOAL_TARGET}
            </span>
          </p>
          <p className="text-xs text-[var(--ink-muted)]">
            Consistency, not total grams
          </p>
        </div>
        <ProgressBar
          className="mt-3"
          value={weeklyGoalDays}
          max={WEEKLY_GOAL_TARGET}
        />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {members.map((m) => (
            <div key={m.id} className="text-center">
              <div className="relative mx-auto w-fit">
                <Avatar short={m.short} color={m.color} size="md" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                    m.checkedInToday ? "bg-[var(--leaf)]" : "bg-[var(--line)]"
                  }`}
                />
              </div>
              <p className="mt-1.5 truncate text-[11px] font-medium text-[var(--ink)]">
                {m.name}
              </p>
              <p className="text-[10px] text-[var(--ink-faint)]">
                {m.goalDaysDone}/{m.goalDaysPlanned}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard className="mt-3 p-4" onClick={() => goTo("quest")}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--sky-soft)] text-[var(--sky)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-[var(--ink)]">Recipe Relay</p>
              <p className="text-sm font-bold text-[var(--sky)]">
                {questCount}/{QUEST_TARGET}
              </p>
            </div>
            <p className="text-xs text-[var(--ink-muted)]">
              Weekly squad quest · tap to open
            </p>
            <ProgressBar
              className="mt-2"
              value={questCount}
              max={QUEST_TARGET}
              tone="sky"
            />
          </div>
        </div>
      </SectionCard>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <SectionCard className="p-4" onClick={() => goTo("rank")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--amber-soft)] text-[var(--amber-deep)]">
            <Gift className="h-4 w-4" />
          </div>
          <p className="mt-3 text-xs text-[var(--ink-faint)]">Possible reward</p>
          <p className="font-display text-xl text-[var(--ink)]">
            ${rank.reward}
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-[var(--ink-muted)]">
            {upcoming
              ? `${upcoming.label} unlocks $${upcoming.reward}`
              : "Top rank unlocked"}
          </p>
        </SectionCard>

        <SectionCard className="p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--leaf-soft)] text-[var(--leaf-deep)]">
            <Utensils className="h-4 w-4" />
          </div>
          <p className="mt-3 text-xs text-[var(--ink-faint)]">Your day</p>
          <p className="font-display text-xl text-[var(--ink)]">
            {Math.min(personalProtein, PERSONAL_PROTEIN_TARGET)}
            <span className="text-sm text-[var(--ink-muted)]">
              /{PERSONAL_PROTEIN_TARGET}g
            </span>
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-[var(--ink-muted)]">
            {goalDayComplete
              ? "Goal-day complete — squad +1"
              : `${PERSONAL_PROTEIN_TARGET - personalProtein}g to finish today`}
          </p>
        </SectionCard>
      </div>

      {goalDayComplete && sharedToQuest ? (
        <SectionCard className="mt-3 p-4 bg-[var(--leaf-soft)]/70 border-[var(--leaf)]/20">
          <p className="text-sm font-semibold text-[var(--leaf-deep)]">
            Nice — lunch helped the squad.
          </p>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            Goal-days {weeklyGoalDays}/{WEEKLY_GOAL_TARGET} · Quest {questCount}/
            {QUEST_TARGET}. Peek at the weekly recap when you&apos;re ready.
          </p>
          <Button
            className="mt-3 w-full"
            variant="secondary"
            size="sm"
            onClick={() => goTo("recap")}
          >
            View weekly recap
          </Button>
        </SectionCard>
      ) : null}

      <Button className="mt-5 w-full" size="lg" onClick={() => goTo("log")}>
        {mealLogged ? "Log another meal" : "Log lunch"}
      </Button>
    </div>
  );
}
