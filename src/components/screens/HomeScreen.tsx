"use client";

import {
  Avatar,
  AvatarStack,
  Button,
  ProgressBar,
  SectionCard,
} from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { FOOD_SHOTS, SAMPLE_MEALS, rankForPoints } from "@/lib/types";
import { ArrowRight, Gift, MessageCircle, Sparkles } from "lucide-react";

type NextStep = {
  step: number;
  title: string;
  detail: string;
  cta: string;
  action: () => void;
};

export function HomeScreen() {
  const { squad, you, sessionCode, sessionStats, goTo } = useBunch();

  if (!squad || !you) {
    return (
      <div className="px-5 py-10 text-sm text-[var(--ink-muted)]">
        Loading your kitchen…
      </div>
    );
  }

  const rank = rankForPoints(squad.rankPoints);
  const people = squad.members.filter((m) => !m.isBot);
  const needsTeammates = people.length < 4;
  const checkedIn = people.filter((m) => m.checkedInToday).length;
  const lastChat = [...squad.messages].reverse().find((m) => m.kind === "chat");
  const saidHi = squad.messages.some(
    (m) => m.authorId === you.id && m.kind === "chat",
  );
  const weekPct = Math.round(
    (squad.weeklyGoalDays / Math.max(1, squad.weeklyGoalTarget)) * 100,
  );
  const pantry = squad.mealIdeas.length
    ? squad.mealIdeas.slice(0, 6)
    : SAMPLE_MEALS.map((m, i) => ({
        id: `sample-${i}`,
        title: m.name,
        image: m.image,
        protein: m.protein,
        authorName: "kitchen",
      }));

  const next: NextStep = needsTeammates
    ? {
        step: 1,
        title: "Waiting for classmates",
        detail: `${people.length}/4 real seats at ${squad.name}. Same code ${sessionCode} — they'll land here automatically.`,
        cta: you.mealLogged ? "Open table chat" : "Log a plate while you wait",
        action: () => goTo(you.mealLogged ? "chat" : "log"),
      }
    : !you.mealLogged
      ? {
          step: 2,
          title: "Log today's plate",
          detail: `Hit ${you.proteinTarget}g protein — pick a real photo from your camera roll.`,
          cta: "Snap / log lunch",
          action: () => goTo("log"),
        }
      : !you.sharedQuestToday
        ? {
            step: 3,
            title: "Drop a recipe in the quest",
            detail: `Recipe Relay is ${squad.mealIdeas.length}/${squad.questTarget} plates.`,
            cta: "Open kitchen quest",
            action: () => goTo("quest"),
          }
        : !saidHi
          ? {
              step: 4,
              title: "Talk food in chat",
              detail: "Trade tips, hype check-ins, ask what's for dinner.",
              cta: "Open squad chat",
              action: () => goTo("chat"),
            }
          : {
              step: 5,
              title: "Table's looking good",
              detail: "Peek at rewards or keep trading meal ideas.",
              cta: "See food rewards",
              action: () => goTo("rank"),
            };

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar short={you.short} color={you.color} size="lg" ring />
          <div>
            <p className="text-sm text-[var(--ink-muted)]">Hungry, {you.name}?</p>
            <p className="font-display text-xl leading-none text-[var(--ink)]">
              {squad.name}
            </p>
          </div>
        </div>
        <span className="xp-chip">{squad.rankPoints} XP</span>
      </div>

      {/* Food strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {(pantry as Array<{ id: string; title?: string; name?: string; image: string; protein?: number }>).map(
          (item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo("quest")}
              className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[18px] border border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title || item.name || "meal"}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1">
                <p className="truncate text-[9px] font-bold text-white">
                  {item.title || item.name}
                </p>
              </div>
            </button>
          ),
        )}
      </div>
      <p className="mt-1.5 text-[11px] text-[var(--ink-faint)]">
        Squad pantry · tap for Recipe Relay · code {sessionCode}
      </p>

      <section className="lime-blob wavy-top mt-4 overflow-hidden p-0 shadow-[0_20px_50px_rgba(223,255,131,0.2)]">
        <div className="relative h-24 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FOOD_SHOTS[0]}
            alt=""
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--lime)] via-[var(--lime)]/70 to-transparent" />
          <p className="absolute bottom-2 left-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--ink-on-bright)]/80">
            Mission {next.step}/5
          </p>
        </div>
        <div className="px-4 pb-4 pt-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-[1.45rem] leading-tight text-[var(--ink-on-bright)]">
                {next.title}
              </h2>
              <p className="muted mt-1 text-sm leading-relaxed">{next.detail}</p>
            </div>
            <AvatarStack members={people} />
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold text-[var(--ink-on-bright)]/70">
                Table progress
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
            className="mt-2 h-4 border-0 bg-[var(--ink-on-bright)]/15"
            value={squad.weeklyGoalDays}
            max={Math.max(1, squad.weeklyGoalTarget)}
            striped
          />
          <Button
            className="mt-3 w-full"
            size="lg"
            variant="primary"
            organic
            onClick={next.action}
          >
            {next.cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <div className="bento mt-4">
        <SectionCard className="overflow-hidden p-0" onClick={() => goTo("chat")} glass={false}>
          <div className="relative h-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FOOD_SHOTS[5]} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-solid)] to-transparent" />
            <div className="absolute bottom-2 left-3 flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--lime)] text-[var(--ink-on-bright)]">
              <MessageCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="p-3 pt-2">
            <p className="font-display text-lg text-[var(--ink)]">Table chat</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-[var(--ink-muted)]">
              {lastChat
                ? `${lastChat.authorName}: ${lastChat.text}`
                : "Ask what’s for dinner"}
            </p>
          </div>
        </SectionCard>

        <SectionCard className="overflow-hidden p-0" onClick={() => goTo("quest")} glass={false}>
          <div className="relative h-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FOOD_SHOTS[1]} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-solid)] to-transparent" />
            <div className="absolute bottom-2 left-3 flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--ralli-deep)] text-[var(--cream)]">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="p-3 pt-2">
            <p className="font-display text-lg text-[var(--ink)]">Kitchen quest</p>
            <p className="font-display text-xl text-[var(--peach)]">
              {squad.mealIdeas.length}/{squad.questTarget}
            </p>
          </div>
        </SectionCard>
      </div>

      <SectionCard className="mt-3 p-4" glass={false}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[var(--ink)]">At the table</p>
          <p className="text-xs text-[var(--ink-faint)]">
            {checkedIn}/{people.length} ate / checked in
            {sessionStats ? ` · ${sessionStats.humanCount} in class` : ""}
          </p>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {people.map((m) => (
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
          {needsTeammates
            ? Array.from({ length: 4 - people.length }).map((_, i) => (
                <div key={`empty-${i}`} className="w-16 shrink-0 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-white/25 text-[10px] text-[var(--ink-faint)]">
                    open
                  </div>
                  <p className="mt-1.5 text-[11px] text-[var(--ink-faint)]">Seat</p>
                </div>
              ))
            : null}
        </div>
        {needsTeammates ? (
          <p className="mt-3 text-xs leading-relaxed text-[var(--ink-muted)]">
            Open seats fill with real classmates who join code{" "}
            <span className="font-semibold text-[var(--ink)]">{sessionCode}</span>.
            No fake teammates.
          </p>
        ) : null}
      </SectionCard>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <SectionCard className="overflow-hidden p-0" glass={false}>
          <div className="relative h-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SAMPLE_MEALS[0].image}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-solid)] to-black/20" />
          </div>
          <div className="p-3 pt-1">
            <p className="text-xs text-[var(--ink-faint)]">Your fuel</p>
            <p className="font-display text-xl text-[var(--ink)]">
              {Math.min(you.personalProtein, you.proteinTarget)}
              <span className="text-sm text-[var(--ink-muted)]">
                /{you.proteinTarget}g
              </span>
            </p>
          </div>
        </SectionCard>
        <SectionCard
          className="p-4"
          onClick={() => goTo("rank")}
          glass={false}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lime)] text-[var(--ink-on-bright)]">
            <Gift className="h-4 w-4" />
          </div>
          <p className="mt-3 text-xs text-[var(--ink-faint)]">Grocery loot</p>
          <p className="font-display text-xl text-[var(--ink)]">{rank.label}</p>
          <p className="text-[11px] text-[var(--ink-muted)]">
            ${rank.reward} gift card path
          </p>
        </SectionCard>
      </div>

      <Button
        className="mt-5 w-full"
        size="lg"
        variant={you.mealLogged ? "secondary" : "lime"}
        organic
        onClick={() => goTo(you.mealLogged ? "chat" : "log")}
      >
        {you.mealLogged ? "Back to table chat" : "Log today’s plate"}
        {you.mealLogged ? (
          <MessageCircle className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
