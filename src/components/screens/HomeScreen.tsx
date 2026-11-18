"use client";

import { Avatar, Button, ProgressBar, SectionCard } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { rankForPoints } from "@/lib/types";
import {
  ArrowRight,
  Gift,
  MessageCircle,
  Sparkles,
  Utensils,
  Users,
} from "lucide-react";

type NextStep = {
  step: number;
  title: string;
  detail: string;
  cta: string;
  action: () => void;
};

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
  const needsTeammates = squad.members.length < 4;
  const humanTeammates = squad.members.filter((m) => !m.isYou);
  const checkedIn = squad.members.filter((m) => m.checkedInToday).length;
  const lastChat = [...squad.messages].reverse().find((m) => m.kind === "chat");
  const saidHi = squad.messages.some(
    (m) => m.authorId === you.id && m.kind === "chat",
  );

  const next: NextStep = needsTeammates
    ? {
        step: 1,
        title: "Get your squad together",
        detail: `You're in ${squad.name} with ${squad.members.length}/4 seats filled. Add demo friends so the social demo feels real.`,
        cta: "Fill my squad",
        action: () => void fillDemoTeammates(),
      }
    : !you.mealLogged
      ? {
          step: 2,
          title: "Log lunch for the squad",
          detail: `Hit ${you.proteinTarget}g today and ${squad.name} moves up on goal-days. Teammates see it live.`,
          cta: "Log lunch now",
          action: () => goTo("log"),
        }
      : !you.sharedQuestToday
        ? {
            step: 3,
            title: "Help the Recipe Relay",
            detail: `Quest is ${squad.mealIdeas.length}/${squad.questTarget}. Share one meal idea — it counts for the whole bunch.`,
            cta: "Open quest",
            action: () => goTo("quest"),
          }
        : !saidHi
          ? {
              step: 4,
              title: "Say hi in squad chat",
              detail: "Posting tips and check-ins is the social loop — even one message keeps the squad warm.",
              cta: "Open chat",
              action: () => goTo("chat"),
            }
          : {
              step: 5,
              title: "You're caught up",
              detail: `${squad.name} is at ${squad.weeklyGoalDays}/${squad.weeklyGoalTarget} goal-days. Peek at rank or keep chatting.`,
              cta: "See rank & reward",
              action: () => goTo("rank"),
            };

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[1.75rem] leading-none text-[var(--lime)]">
            bunch
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--ink-faint)]">
            {squad.name} · code {sessionCode}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-right">
          <p className="text-[10px] uppercase tracking-wider text-[var(--ink-faint)]">
            Together
          </p>
          <p className="text-sm font-bold text-[var(--ink)]">
            {checkedIn}/{squad.members.length} in
          </p>
        </div>
      </div>

      {/* Clear next action */}
      <section className="mt-4 rounded-[24px] border border-[var(--ralli)]/45 bg-gradient-to-br from-[var(--ralli-deep)]/40 to-[var(--card)] p-4 shadow-[0_12px_40px_rgba(91,80,232,0.25)]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--lime)]">
          Do this next · Step {next.step} of 5
        </p>
        <h2 className="mt-2 font-display text-[1.35rem] leading-tight text-[var(--ink)]">
          {next.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-muted)]">
          {next.detail}
        </p>
        <Button
          className="mt-4 w-full"
          size="lg"
          disabled={loading && needsTeammates}
          onClick={next.action}
        >
          {next.cta}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      {/* Social presence */}
      <section className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--ink)]">Your squad</h3>
          <p className="text-[11px] text-[var(--ink-faint)]">
            {sessionStats
              ? `${sessionStats.humanCount} people in class`
              : "Live with friends"}
          </p>
        </div>
        <SectionCard className="p-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {squad.members.map((m) => (
              <div key={m.id} className="w-[4.4rem] shrink-0 text-center">
                <div className="relative mx-auto w-fit">
                  <Avatar short={m.short} color={m.color} size="lg" />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--card)] ${
                      m.checkedInToday ? "bg-[var(--lime)]" : "bg-[var(--line)]"
                    }`}
                  />
                </div>
                <p className="mt-2 truncate text-xs font-semibold text-[var(--ink)]">
                  {m.isYou ? "You" : m.name}
                </p>
                <p className="text-[10px] text-[var(--ink-faint)]">
                  {m.checkedInToday ? "checked in" : "waiting"}
                </p>
              </div>
            ))}
          </div>
          {needsTeammates ? (
            <Button
              className="mt-3 w-full"
              variant="soft"
              size="sm"
              disabled={loading}
              onClick={() => void fillDemoTeammates()}
            >
              <Users className="h-4 w-4" />
              Add demo friends so chat feels alive
            </Button>
          ) : (
            <p className="mt-3 text-xs text-[var(--ink-muted)]">
              {humanTeammates.length
                ? `${checkedIn} of you checked in today. Chat keeps everyone accountable.`
                : "Demo friends are in — chat and log so the board moves."}
            </p>
          )}
        </SectionCard>
      </section>

      {/* Social actions first */}
      <section className="mt-4 space-y-3">
        <h3 className="text-sm font-bold text-[var(--ink)]">Stay social</h3>

        <SectionCard className="p-4" onClick={() => goTo("chat")}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--lime)] text-[#15141f]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-[var(--ink)]">Squad chat</p>
                <span className="text-xs font-bold text-[var(--lime)]">Open</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-[var(--ink-muted)]">
                {lastChat
                  ? `${lastChat.authorName}: ${lastChat.text}`
                  : "Send a tip or hype message — teammates see it live"}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="p-4" onClick={() => goTo("quest")}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--leaf-soft)] text-[var(--peach)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-[var(--ink)]">Shared quest</p>
                <span className="text-sm font-bold text-[var(--peach)]">
                  {squad.mealIdeas.length}/{squad.questTarget}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                Recipe Relay — post meal ideas the squad can reuse
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
      </section>

      {/* Personal progress, quieter */}
      <section className="mt-4 space-y-3">
        <h3 className="text-sm font-bold text-[var(--ink)]">Your progress</h3>
        <div className="grid grid-cols-2 gap-3">
          <SectionCard className="p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--leaf-soft)] text-[var(--leaf-deep)]">
              <Utensils className="h-4 w-4" />
            </div>
            <p className="mt-3 text-xs text-[var(--ink-faint)]">Today</p>
            <p className="font-display text-xl text-[var(--ink)]">
              {Math.min(you.personalProtein, you.proteinTarget)}
              <span className="text-sm text-[var(--ink-muted)]">
                /{you.proteinTarget}g
              </span>
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--ink-muted)]">
              {you.goalDayComplete
                ? "Goal done — squad +1"
                : `${Math.max(0, you.proteinTarget - you.personalProtein)}g left`}
            </p>
          </SectionCard>
          <SectionCard className="p-4" onClick={() => goTo("rank")}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime)] text-[#15141f]">
              <Gift className="h-4 w-4" />
            </div>
            <p className="mt-3 text-xs text-[var(--ink-faint)]">Squad rank</p>
            <p className="font-display text-xl text-[var(--ink)]">{rank.label}</p>
            <p className="mt-0.5 text-[11px] text-[var(--ink-muted)]">
              ${rank.reward} gift card path
            </p>
          </SectionCard>
        </div>

        <SectionCard className="p-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs text-[var(--ink-faint)]">Weekly goal-days</p>
              <p className="font-display text-2xl text-[var(--ink)]">
                {squad.weeklyGoalDays}
                <span className="text-base text-[var(--ink-muted)]">
                  /{squad.weeklyGoalTarget}
                </span>
              </p>
            </div>
            <p className="max-w-[8rem] text-right text-[11px] text-[var(--ink-muted)]">
              Everyone&apos;s check-ins add up here
            </p>
          </div>
          <ProgressBar
            className="mt-3"
            value={squad.weeklyGoalDays}
            max={Math.max(1, squad.weeklyGoalTarget)}
          />
        </SectionCard>
      </section>

      {you.goalDayComplete && you.sharedQuestToday ? (
        <SectionCard className="mt-3 p-4 border-[var(--lime)]/35 bg-[var(--amber-soft)]">
          <p className="text-sm font-semibold text-[var(--lime)]">
            Nice work with {squad.name}
          </p>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            You logged, helped the quest, and teammates can see it. Keep the chat
            going or review the week.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" onClick={() => goTo("chat")}>
              Chat
            </Button>
            <Button variant="soft" size="sm" onClick={() => goTo("recap")}>
              Weekly recap
            </Button>
          </div>
        </SectionCard>
      ) : null}

      {!you.mealLogged ? (
        <Button className="mt-5 w-full" size="lg" onClick={() => goTo("log")}>
          Log lunch
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          className="mt-5 w-full"
          size="lg"
          variant="secondary"
          onClick={() => goTo("chat")}
        >
          Continue in squad chat
          <MessageCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
