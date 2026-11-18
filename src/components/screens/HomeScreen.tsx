"use client";

import { Avatar, Button, Pill, ProgressBar, SectionCard } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { nextRank, rankForPoints } from "@/lib/types";
import { Gift, MessageCircle, Sparkles, Utensils, Users } from "lucide-react";

export function HomeScreen() {
  const {
    squad,
    you,
    sessionCode,
    sessionStats,
    goTo,
    fillDemoTeammates,
    loading,
  } = useBunch();

  if (!squad || !you) {
    return (
      <div className="px-5 py-10 text-sm text-[var(--ink-muted)]">
        Loading your squad…
      </div>
    );
  }

  const rank = rankForPoints(squad.rankPoints);
  const upcoming = nextRank(squad.rankPoints);
  const weekPct = Math.round(
    (squad.weeklyGoalDays / Math.max(1, squad.weeklyGoalTarget)) * 100,
  );
  const needsTeammates = squad.members.length < 4;

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-[1.75rem] leading-none text-[var(--lime)]">
            bunch
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--ink-faint)]">
            Session {sessionCode} · Week {squad.weekNumber} of 4
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

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="xp-chip">{squad.rankPoints} XP</span>
        <span className="rounded-full bg-[var(--lavender)] px-2.5 py-1 text-[11px] font-bold text-[var(--ralli)]">
          Quest {squad.mealIdeas.length}/{squad.questTarget}
        </span>
        {sessionStats ? (
          <span className="text-xs text-[var(--ink-muted)]">
            Class live: {sessionStats.humanCount} in {sessionStats.squadCount}{" "}
            squad{sessionStats.squadCount === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      <SectionCard className="mt-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              {squad.name}
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
            {squad.weeklyGoalDays}
            <span className="text-lg text-[var(--ink-muted)]">
              /{squad.weeklyGoalTarget}
            </span>
          </p>
          <p className="text-xs text-[var(--ink-muted)]">
            Consistency, not total grams
          </p>
        </div>
        <ProgressBar
          className="mt-3"
          value={squad.weeklyGoalDays}
          max={Math.max(1, squad.weeklyGoalTarget)}
        />

        <div className="mt-4 grid grid-cols-4 gap-2">
          {squad.members.map((m) => (
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
                {m.isYou ? "You" : m.name}
              </p>
              <p className="text-[10px] text-[var(--ink-faint)]">
                {m.goalDaysDone}/{m.goalDaysPlanned}
              </p>
            </div>
          ))}
        </div>

        {needsTeammates ? (
          <Button
            className="mt-4 w-full"
            variant="soft"
            size="sm"
            disabled={loading}
            onClick={() => void fillDemoTeammates()}
          >
            <Users className="h-4 w-4" />
            Fill open seats with demo friends
          </Button>
        ) : null}
      </SectionCard>

      <SectionCard className="mt-3 p-4" onClick={() => goTo("chat")}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--leaf-soft)] text-[var(--lime)]">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-[var(--ink)]">Squad chat</p>
              <p className="text-xs font-bold text-[var(--lime)]">
                {squad.messages.length} msgs
              </p>
            </div>
            <p className="truncate text-xs text-[var(--ink-muted)]">
              {squad.messages.length
                ? squad.messages[squad.messages.length - 1]?.text
                : "Say hi and keep the streak social"}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard className="mt-3 p-4" onClick={() => goTo("quest")}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--lavender)] text-[var(--ralli)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-[var(--ink)]">Recipe Relay</p>
              <p className="text-sm font-bold text-[var(--ralli)]">
                {squad.mealIdeas.length}/{squad.questTarget}
              </p>
            </div>
            <p className="text-xs text-[var(--ink-muted)]">
              Weekly squad quest · live for your group
            </p>
            <ProgressBar
              className="mt-2"
              value={squad.mealIdeas.length}
              max={squad.questTarget}
              tone="sky"
            />
          </div>
        </div>
      </SectionCard>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <SectionCard className="p-4" onClick={() => goTo("rank")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime)] text-[var(--ink)]">
            <Gift className="h-4 w-4" />
          </div>
          <p className="mt-3 text-xs text-[var(--ink-faint)]">Possible reward</p>
          <p className="font-display text-xl text-[var(--ink)]">${rank.reward}</p>
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
            {Math.min(you.personalProtein, you.proteinTarget)}
            <span className="text-sm text-[var(--ink-muted)]">
              /{you.proteinTarget}g
            </span>
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-[var(--ink-muted)]">
            {you.goalDayComplete
              ? "Goal-day complete — squad +1"
              : `${Math.max(0, you.proteinTarget - you.personalProtein)}g to finish today`}
          </p>
        </SectionCard>
      </div>

      {you.goalDayComplete && you.sharedQuestToday ? (
        <SectionCard className="mt-3 p-4 bg-[var(--leaf-soft)] border-[var(--ralli)]/30">
          <p className="text-sm font-semibold text-[var(--lime)]">
            Nice — that helped {squad.name}.
          </p>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            Goal-days {squad.weeklyGoalDays}/{squad.weeklyGoalTarget} · Quest{" "}
            {squad.mealIdeas.length}/{squad.questTarget}. Teammates see this
            update live.
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
        {you.mealLogged ? "Log another meal" : "Log lunch"}
      </Button>
    </div>
  );
}
