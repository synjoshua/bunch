"use client";

import { Avatar, Button, ProgressBar, SectionCard } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { rankForPoints } from "@/lib/types";
import { CalendarDays, LogOut, Trophy } from "lucide-react";

export function ProfileScreen() {
  const { you, squad, sessionCode, goTo, leaveSession, sessionStats } =
    useBunch();

  if (!you || !squad) return null;

  const people = squad.members.filter((m) => !m.isBot);
  const rank = rankForPoints(squad.rankPoints);
  const proteinPct = Math.min(
    100,
    Math.round((you.personalProtein / Math.max(1, you.proteinTarget)) * 100),
  );

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--peach)]">
        Your profile
      </p>
      <div className="mt-3 flex items-center gap-3">
        <Avatar short={you.short} color={you.color} size="lg" ring />
        <div className="min-w-0">
          <h1 className="font-display text-3xl leading-none text-[var(--ink)]">
            {you.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {squad.name} · code {sessionCode}
          </p>
        </div>
      </div>

      <SectionCard className="mt-5 p-4" glass={false}>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
          Today&apos;s protein
        </p>
        <p className="mt-1 font-display text-3xl text-[var(--ink)]">
          {Math.min(you.personalProtein, you.proteinTarget + 40)}
          <span className="text-lg text-[var(--ink-muted)]">
            /{you.proteinTarget}g
          </span>
        </p>
        <ProgressBar
          className="mt-3"
          value={you.personalProtein}
          max={Math.max(1, you.proteinTarget)}
          tone="amber"
        />
        <p className="mt-2 text-xs text-[var(--ink-muted)]">
          {you.mealLogged
            ? you.goalDayComplete
              ? "Goal-day complete — nice work."
              : `${proteinPct}% of today’s target`
            : "Log a meal to start today’s goal."}
        </p>
        {!you.mealLogged ? (
          <Button
            className="mt-3 w-full rounded-full"
            variant="lime"
            onClick={() => goTo("log")}
          >
            Log a meal
          </Button>
        ) : null}
      </SectionCard>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <SectionCard className="p-4" glass={false}>
          <Trophy className="h-4 w-4 text-[var(--lime)]" />
          <p className="mt-2 text-xs text-[var(--ink-faint)]">Bunch medal</p>
          <p className="font-display text-xl text-[var(--ink)]">{rank.label}</p>
          <p className="text-[11px] text-[var(--ink-muted)]">
            {squad.rankPoints} XP
            {rank.id === "gold" || rank.id === "platinum"
              ? " · gift card unlocked"
              : " · climb to Gold"}
          </p>
        </SectionCard>
        <SectionCard className="p-4" glass={false}>
          <CalendarDays className="h-4 w-4 text-[var(--peach)]" />
          <p className="mt-2 text-xs text-[var(--ink-faint)]">Your week</p>
          <p className="font-display text-xl text-[var(--ink)]">
            {you.goalDaysDone}/{you.goalDaysPlanned}
          </p>
          <p className="text-[11px] text-[var(--ink-muted)]">goal-days done</p>
        </SectionCard>
      </div>

      <SectionCard className="mt-3 p-4" glass={false}>
        <p className="text-sm font-bold text-[var(--ink)]">Your bunch</p>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">
          {people.length} classmates
          {sessionStats ? ` · ${sessionStats.humanCount} in the room` : ""}
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {people.map((m) => (
            <div key={m.id} className="w-14 shrink-0 text-center">
              <Avatar short={m.short} color={m.color} size="md" />
              <p className="mt-1 truncate text-[10px] font-semibold text-[var(--ink)]">
                {m.isYou ? "You" : m.name}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <Button
        className="mt-4 w-full"
        variant="secondary"
        onClick={() => goTo("recap")}
      >
        Weekly recap
      </Button>
      <Button
        className="mt-2 w-full"
        variant="secondary"
        onClick={() => goTo("rank")}
      >
        Grocery loot & ranks
      </Button>

      <button
        type="button"
        onClick={leaveSession}
        className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-semibold text-[var(--ink-muted)]"
      >
        <LogOut className="h-4 w-4" />
        Leave bunch / switch name
      </button>
    </div>
  );
}
