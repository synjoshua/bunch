"use client";

import {
  Avatar,
  AvatarStack,
  Button,
  ProgressBar,
  SectionCard,
} from "@/components/ui";
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
  const checkedIn = squad.members.filter((m) => m.checkedInToday).length;
  const lastChat = [...squad.messages].reverse().find((m) => m.kind === "chat");
  const saidHi = squad.messages.some(
    (m) => m.authorId === you.id && m.kind === "chat",
  );
  const weekPct = Math.round(
    (squad.weeklyGoalDays / Math.max(1, squad.weeklyGoalTarget)) * 100,
  );

  const next: NextStep = needsTeammates
    ? {
        step: 1,
        title: "Get your squad together",
        detail: `${squad.members.length}/4 seats filled in ${squad.name}.`,
        cta: "Fill my squad",
        action: () => void fillDemoTeammates(),
      }
    : !you.mealLogged
      ? {
          step: 2,
          title: "Log lunch for the squad",
          detail: `Hit ${you.proteinTarget}g — teammates see it live.`,
          cta: "Log lunch now",
          action: () => goTo("log"),
        }
      : !you.sharedQuestToday
        ? {
            step: 3,
            title: "Help the Recipe Relay",
            detail: `Quest sits at ${squad.mealIdeas.length}/${squad.questTarget}.`,
            cta: "Open quest",
            action: () => goTo("quest"),
          }
        : !saidHi
          ? {
              step: 4,
              title: "Say hi in squad chat",
              detail: "One message keeps the social loop warm.",
              cta: "Open chat",
              action: () => goTo("chat"),
            }
          : {
              step: 5,
              title: "You're caught up",
              detail: "Check rewards or keep the chat going.",
              cta: "See rewards",
              action: () => goTo("rank"),
            };

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar short={you.short} color={you.color} size="lg" ring />
          <div>
            <p className="text-sm text-[var(--ink-muted)]">Hey, {you.name}</p>
            <p className="font-display text-xl leading-none text-[var(--ink)]">
              {squad.name}
            </p>
          </div>
        </div>
        <span className="xp-chip">{squad.rankPoints} XP</span>
      </div>

      <p className="mt-4 text-sm text-[var(--ink-muted)]">
        You have{" "}
        <span className="font-extrabold text-[var(--ink)] underline decoration-[var(--lime)] decoration-2 underline-offset-4">
          {Math.max(0, 5 - you.goalDaysDone)} goal-days
        </span>{" "}
        left this week · code {sessionCode}
      </p>

      {/* Hero next-step — lime organic panel */}
      <section className="lime-blob wavy-top mt-5 p-5 shadow-[0_20px_50px_rgba(223,255,131,0.2)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--ink-on-bright)]/70">
              Do this next · {next.step}/5
            </p>
            <h2 className="mt-2 font-display text-[1.55rem] leading-tight text-[var(--ink-on-bright)]">
              {next.title}
            </h2>
            <p className="muted mt-1.5 text-sm leading-relaxed">{next.detail}</p>
          </div>
          <AvatarStack members={squad.members} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[var(--ink-on-bright)]/70">
              Squad week
            </p>
            <p className="font-display text-3xl text-[var(--ink-on-bright)]">
              {squad.weeklyGoalDays}
              <span className="text-lg opacity-70">
                /{squad.weeklyGoalTarget}
              </span>
            </p>
          </div>
          <p className="rounded-full bg-[var(--ink-on-bright)]/10 px-3 py-1 text-sm font-extrabold text-[var(--ink-on-bright)]">
            {weekPct}%
          </p>
        </div>
        <ProgressBar
          className="mt-3 h-4 border-0 bg-[var(--ink-on-bright)]/15"
          value={squad.weeklyGoalDays}
          max={Math.max(1, squad.weeklyGoalTarget)}
          striped
        />
        <Button
          className="mt-4 w-full"
          size="lg"
          variant="primary"
          organic
          disabled={loading && needsTeammates}
          onClick={next.action}
        >
          {next.cta}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      {/* Bento social */}
      <div className="bento mt-4">
        <SectionCard className="p-4" onClick={() => goTo("chat")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--lime)] text-[var(--ink-on-bright)]">
            <MessageCircle className="h-5 w-5" />
          </div>
          <p className="mt-3 font-display text-lg text-[var(--ink)]">Chat</p>
          <p className="mt-1 line-clamp-2 text-xs text-[var(--ink-muted)]">
            {lastChat
              ? `${lastChat.authorName}: ${lastChat.text}`
              : "Hype, tips, check-ins"}
          </p>
          <div className="mt-3">
            <AvatarStack members={squad.members} />
          </div>
        </SectionCard>

        <SectionCard className="p-4" onClick={() => goTo("quest")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--ralli-deep)] text-[var(--cream)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="mt-3 font-display text-lg text-[var(--ink)]">Quest</p>
          <p className="mt-1 font-display text-2xl text-[var(--peach)]">
            {squad.mealIdeas.length}/{squad.questTarget}
          </p>
          <ProgressBar
            className="mt-2"
            value={squad.mealIdeas.length}
            max={squad.questTarget}
            tone="sky"
          />
        </SectionCard>
      </div>

      <SectionCard className="mt-3 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[var(--ink)]">Who&apos;s in</p>
          <p className="text-xs text-[var(--ink-faint)]">
            {checkedIn}/{squad.members.length} checked in
            {sessionStats ? ` · ${sessionStats.humanCount} in class` : ""}
          </p>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {squad.members.map((m) => (
            <div key={m.id} className="w-16 shrink-0 text-center">
              <div className="relative mx-auto w-fit">
                <Avatar short={m.short} color={m.color} size="lg" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--card-solid)] ${
                    m.checkedInToday ? "bg-[var(--lime)]" : "bg-[var(--line)]"
                  }`}
                />
              </div>
              <p className="mt-1.5 truncate text-[11px] font-semibold text-[var(--ink)]">
                {m.isYou ? "You" : m.name}
              </p>
            </div>
          ))}
        </div>
        {needsTeammates ? (
          <Button
            className="mt-3 w-full"
            variant="soft"
            size="sm"
            organic
            disabled={loading}
            onClick={() => void fillDemoTeammates()}
          >
            <Users className="h-4 w-4" />
            Add demo friends
          </Button>
        ) : null}
      </SectionCard>

      <div className="bento mt-3">
        <SectionCard className="p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[var(--teal)]">
            <Utensils className="h-4 w-4" />
          </div>
          <p className="mt-3 text-xs text-[var(--ink-faint)]">Your day</p>
          <p className="font-display text-xl text-[var(--ink)]">
            {Math.min(you.personalProtein, you.proteinTarget)}
            <span className="text-sm text-[var(--ink-muted)]">
              /{you.proteinTarget}g
            </span>
          </p>
        </SectionCard>
        <SectionCard className="p-4" onClick={() => goTo("rank")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime)] text-[var(--ink-on-bright)]">
            <Gift className="h-4 w-4" />
          </div>
          <p className="mt-3 text-xs text-[var(--ink-faint)]">Rewards</p>
          <p className="font-display text-xl text-[var(--ink)]">{rank.label}</p>
          <p className="text-[11px] text-[var(--ink-muted)]">${rank.reward} path</p>
        </SectionCard>
      </div>

      {you.goalDayComplete && you.sharedQuestToday ? (
        <section className="purple-wave wavy-bottom mt-4 p-4">
          <p className="font-display text-lg">Nice work with {squad.name}</p>
          <p className="mt-1 text-sm text-white/80">
            Logged, quested, and visible to teammates. Keep the chat rolling.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="lime" size="sm" organic onClick={() => goTo("chat")}>
              Chat
            </Button>
            <Button
              variant="secondary"
              size="sm"
              organic
              onClick={() => goTo("recap")}
            >
              Recap
            </Button>
          </div>
        </section>
      ) : null}

      <Button
        className="mt-5 w-full"
        size="lg"
        variant={you.mealLogged ? "secondary" : "lime"}
        organic
        onClick={() => goTo(you.mealLogged ? "chat" : "log")}
      >
        {you.mealLogged ? "Continue in chat" : "Log lunch"}
        {you.mealLogged ? (
          <MessageCircle className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
