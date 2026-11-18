"use client";

import { Avatar, Button, ProgressBar } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const QUICK = [
  "What are you eating?",
  "Easy high-protein lunch ideas?",
  "I just logged my plate",
  "Who still needs a goal-day?",
];

export function ChatScreen() {
  const { squad, you, sendChat, loading, goTo } = useBunch();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [squad?.messages.length]);

  if (!squad || !you) return null;

  const onSend = async (text?: string) => {
    const value = (text ?? draft).trim();
    if (!value) return;
    setDraft("");
    await sendChat(value);
  };

  const people = squad.members.filter((m) => !m.isBot);
  const weekPct = Math.round(
    (squad.weeklyGoalDays / Math.max(1, squad.weeklyGoalTarget)) * 100,
  );
  const checkedIn = people.filter((m) => m.checkedInToday).length;

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-[#12101c] animate-rise">
      <header className="shrink-0 border-b border-white/8 px-4 pb-3 pt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo("home")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-[var(--lime)]"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl leading-none text-[var(--ink)]">
              {squad.name}
            </p>
            <p className="mt-1 truncate text-[11px] text-[var(--ink-muted)]">
              Bunch chat · {people.length} classmates
            </p>
          </div>
          <div className="flex -space-x-2">
            {people.slice(0, 4).map((m) => (
              <Avatar key={m.id} short={m.short} color={m.color} size="sm" ring />
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-[18px] border border-white/10 bg-white/5 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lime)]">
              Shared weekly goal
            </p>
            <p className="text-xs font-bold text-[var(--ink)]">
              {squad.weeklyGoalDays}/{squad.weeklyGoalTarget} · {weekPct}%
            </p>
          </div>
          <ProgressBar
            className="mt-2 h-2.5"
            value={squad.weeklyGoalDays}
            max={Math.max(1, squad.weeklyGoalTarget)}
            striped
          />
          <p className="mt-1.5 text-[11px] text-[var(--ink-muted)]">
            {checkedIn}/{people.length} checked in today · Shared meals{" "}
            {squad.mealIdeas.length}/{squad.questTarget}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {squad.messages.length === 0 ? (
          <div className="rounded-[22px] border border-[var(--card-border)] bg-[var(--card)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Start the conversation
            </p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Tap a quick message below or type your own. Meal photos show up here.
            </p>
          </div>
        ) : (
          squad.messages.map((msg) => {
            if (msg.kind === "system") {
              return (
                <div
                  key={msg.id}
                  className="mx-auto max-w-[92%] rounded-full bg-[var(--leaf-soft)] px-3 py-1.5 text-center text-[11px] font-medium text-[var(--leaf-deep)]"
                >
                  {msg.text}
                </div>
              );
            }

            const mine = msg.authorId === you.id;

            if (msg.kind === "meal") {
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
                >
                  {!mine ? (
                    <Avatar
                      short={msg.authorShort}
                      color={msg.authorColor}
                      size="sm"
                    />
                  ) : null}
                  <div
                    className={`max-w-[82%] overflow-hidden rounded-[20px] border border-[var(--lime)]/25 bg-[var(--bubble-them)] ${
                      mine ? "rounded-br-md" : "rounded-bl-md"
                    }`}
                  >
                    {msg.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={msg.image}
                        alt={msg.mealTitle || "Logged meal"}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : null}
                    <div className="px-3 py-2.5">
                      <p className="text-[11px] font-bold text-[var(--peach)]">
                        {mine ? "You" : msg.authorName} · plated
                      </p>
                      <p className="mt-0.5 font-display text-base text-[var(--ink)]">
                        {msg.mealTitle || "Meal"}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[var(--lime)]">
                        {typeof msg.protein === "number" ? `P ${msg.protein}g` : null}
                        {typeof msg.carbs === "number" ? ` · C ${msg.carbs}g` : null}
                        {typeof msg.fat === "number" ? ` · F ${msg.fat}g` : null}
                        {typeof msg.calories === "number" && msg.calories > 0
                          ? ` · ${msg.calories} kcal`
                          : null}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{msg.text}</p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
              >
                {!mine ? (
                  <Avatar
                    short={msg.authorShort}
                    color={msg.authorColor}
                    size="sm"
                  />
                ) : null}
                <div
                  className={`max-w-[78%] rounded-[18px] px-3.5 py-2.5 ${
                    mine
                      ? "rounded-br-md bg-[var(--bubble-me)] text-white"
                      : "rounded-bl-md bg-[var(--bubble-them)] text-[var(--ink)]"
                  }`}
                >
                  {!mine ? (
                    <p className="mb-0.5 text-[11px] font-bold text-[var(--peach)]">
                      {msg.authorName}
                    </p>
                  ) : null}
                  <p className="text-sm leading-snug">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-composer shrink-0 px-3 pb-[6.25rem] pt-2">
        <div className="mb-2 flex gap-2 overflow-x-auto pb-0.5">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => void onSend(q)}
              className="shrink-0 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1.5 text-[11px] font-semibold text-[var(--ink)]"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void onSend();
              }
            }}
            placeholder="Message your bunch…"
            maxLength={280}
            className="min-w-0 flex-1 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--ralli)]"
          />
          <Button
            size="md"
            disabled={loading || !draft.trim()}
            onClick={() => void onSend()}
            aria-label="Send message"
            className="shrink-0 px-3.5"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
