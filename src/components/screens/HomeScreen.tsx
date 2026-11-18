"use client";

import {
  Avatar,
  Button,
  ProgressBar,
  SectionCard,
} from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { FOOD_SHOTS, SAMPLE_MEALS, rankForPoints } from "@/lib/types";
import { ChefHat, Gift, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export function HomeScreen() {
  const { squad, you, sessionCode, sessionStats, goTo, sendChat, loading } =
    useBunch();
  const [chatDraft, setChatDraft] = useState("");

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
  const recentChat = [...squad.messages]
    .filter((m) => m.kind !== "system")
    .slice(-4);
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

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {(
          pantry as Array<{
            id: string;
            title?: string;
            name?: string;
            image: string;
          }>
        ).map((item) => (
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
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-[var(--ink-faint)]">
        Squad pantry · code {sessionCode}
      </p>

      <SectionCard className="mt-4 p-4" glass={false}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
              Table progress
            </p>
            <p className="mt-1 font-display text-3xl text-[var(--ink)]">
              {squad.weeklyGoalDays}
              <span className="text-lg text-[var(--ink-muted)]">
                /{squad.weeklyGoalTarget}
              </span>
            </p>
          </div>
          <p className="rounded-full bg-[var(--lime)] px-3 py-1 text-sm font-extrabold text-[var(--ink-on-bright)]">
            {weekPct}%
          </p>
        </div>
        <ProgressBar
          className="mt-3"
          value={squad.weeklyGoalDays}
          max={Math.max(1, squad.weeklyGoalTarget)}
          striped
        />
      </SectionCard>

      <SectionCard
        className="mt-3 overflow-hidden p-0"
        onClick={() => goTo("quest")}
        glass={false}
      >
        <div className="relative h-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOOD_SHOTS[1]} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          <div className="absolute inset-0 flex items-center justify-between gap-3 px-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--ralli-deep)] text-[var(--cream)] shadow-lg">
                <ChefHat className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg leading-tight text-white drop-shadow">
                  Shared meals
                </p>
                <p className="mt-0.5 text-[11px] font-semibold leading-snug text-white/90">
                  Get inspired by plates your squad logged
                </p>
              </div>
            </div>
            <p className="shrink-0 rounded-full bg-[var(--lime)] px-2.5 py-1 font-display text-base text-[var(--ink-on-bright)]">
              {squad.mealIdeas.length}/{squad.questTarget}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard className="mt-3 p-4" glass={false}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[var(--lime)]" />
            <p className="font-display text-lg text-[var(--ink)]">Table chat</p>
          </div>
          <button
            type="button"
            onClick={() => goTo("chat")}
            className="text-xs font-bold text-[var(--peach)]"
          >
            Full chat
          </button>
        </div>
        <div className="mt-3 space-y-2.5">
          {recentChat.length === 0 ? (
            <p className="text-xs text-[var(--ink-muted)]">
              No messages yet — say what you&apos;re eating.
            </p>
          ) : (
            recentChat.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2">
                <Avatar
                  short={msg.authorShort}
                  color={msg.authorColor}
                  size="sm"
                />
                <div className="min-w-0 flex-1 rounded-2xl bg-white/5 px-3 py-2">
                  <p className="text-[11px] font-bold text-[var(--peach)]">
                    {msg.authorId === you.id ? "You" : msg.authorName}
                    {msg.kind === "meal" ? " · plated" : ""}
                  </p>
                  {msg.kind === "meal" && msg.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={msg.image}
                      alt={msg.mealTitle || "meal"}
                      className="mt-1.5 h-20 w-full rounded-xl object-cover"
                    />
                  ) : null}
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--ink)]">
                    {msg.kind === "meal"
                      ? `${msg.mealTitle || "Meal"}${
                          typeof msg.protein === "number"
                            ? ` · +${msg.protein}g`
                            : ""
                        }`
                      : msg.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            value={chatDraft}
            onChange={(e) => setChatDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && chatDraft.trim()) {
                e.preventDefault();
                const text = chatDraft.trim();
                setChatDraft("");
                void sendChat(text);
              }
            }}
            placeholder="Message the table…"
            maxLength={280}
            className="min-w-0 flex-1 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--ralli)]"
          />
          <Button
            size="sm"
            disabled={loading || !chatDraft.trim()}
            aria-label="Send"
            onClick={() => {
              const text = chatDraft.trim();
              if (!text) return;
              setChatDraft("");
              void sendChat(text);
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SectionCard>

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
          <p className="mt-3 text-xs text-[var(--ink-faint)]">Loot rank</p>
          <p className="font-display text-xl text-[var(--ink)]">{rank.label} medal</p>
          <p className="text-[11px] text-[var(--ink-muted)]">
            {rank.id === "gold" || rank.id === "platinum"
              ? "Gift card ready to redeem"
              : "Share + 100% goals → Gold"}
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
