"use client";

import { Avatar, Button, ScreenHeader } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const QUICK = [
  "Just checked in — you got this!",
  "Anyone have an easy high-protein lunch?",
  "I'm on for Recipe Relay today",
  "Who still needs their goal-day?",
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

  return (
    <div className="flex h-full min-h-full flex-col animate-rise">
      <div className="px-5 pt-6">
        <ScreenHeader
          title="Squad chat"
          subtitle={`Talk with ${squad.name} — tips, hype, and check-ins`}
          onBack={() => goTo("home")}
        />
        <div className="mb-3 flex -space-x-2">
          {squad.members.map((m) => (
            <Avatar key={m.id} short={m.short} color={m.color} size="sm" ring />
          ))}
          <span className="ml-3 self-center text-xs text-[var(--ink-muted)]">
            {squad.members.length} in this chat
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4 min-h-0">
        {squad.messages.length === 0 ? (
          <div className="rounded-[22px] border border-[var(--card-border)] bg-[var(--card)] p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Start the conversation
            </p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Tap a quick message below or type your own. Meal logs also show up
              here automatically.
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
                      : msg.kind === "meal"
                        ? "rounded-bl-md border border-[var(--lime)]/30 bg-[var(--amber-soft)] text-[var(--ink)]"
                        : "rounded-bl-md bg-[var(--bubble-them)] text-[var(--ink)]"
                  }`}
                >
                  {!mine ? (
                    <p className="mb-0.5 text-[11px] font-bold text-[var(--peach)]">
                      {msg.authorName}
                      {msg.kind === "meal" ? " · logged a meal" : ""}
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

      <div className="chat-composer px-4 pb-24 pt-3">
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
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
            placeholder="Message your squad…"
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
        <p className="mt-2 text-center text-[11px] text-[var(--ink-faint)]">
          Next: keep chatting, or head Home to log a meal / help the quest
        </p>
      </div>
    </div>
  );
}
