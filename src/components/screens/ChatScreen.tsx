"use client";

import { Avatar, Button, ScreenHeader } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ChatScreen() {
  const { squad, you, sendChat, loading, goTo } = useBunch();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [squad?.messages.length]);

  if (!squad || !you) return null;

  const onSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await sendChat(text);
  };

  return (
    <div className="flex h-full min-h-full flex-col animate-rise">
      <div className="px-5 pt-6">
        <ScreenHeader
          title={`${squad.name} chat`}
          subtitle="Hype, tips, and check-ins — live with your squad"
          onBack={() => goTo("home")}
        />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4 min-h-0">
        {squad.messages.length === 0 ? (
          <div className="rounded-[22px] border border-[var(--card-border)] bg-[var(--card)] p-4 text-sm text-[var(--ink-muted)]">
            No messages yet. Say hi and keep the streak social.
          </div>
        ) : (
          squad.messages.map((msg) => {
            if (msg.kind === "system") {
              return (
                <div
                  key={msg.id}
                  className="mx-auto max-w-[90%] rounded-full bg-[var(--leaf-soft)] px-3 py-1.5 text-center text-[11px] font-medium text-[var(--leaf-deep)]"
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
                        ? "rounded-bl-md bg-[var(--amber-soft)] text-[var(--ink)] border border-[var(--lime)]/30"
                        : "rounded-bl-md bg-[var(--bubble-them)] text-[var(--ink)]"
                  }`}
                >
                  {!mine ? (
                    <p className="mb-0.5 text-[11px] font-bold text-[var(--peach)]">
                      {msg.authorName}
                      {msg.kind === "meal" ? " · meal" : ""}
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
            placeholder="Message the squad…"
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
          Meal logs also show up here so the squad stays in the loop
        </p>
      </div>
    </div>
  );
}
