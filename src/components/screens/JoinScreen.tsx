"use client";

import { Button } from "@/components/ui";
import { DEFAULT_SESSION_CODE } from "@/lib/types";
import { useBunch } from "@/lib/bunch-context";
import { useState } from "react";

export function JoinScreen() {
  const { joinSquad, loading, error } = useBunch();
  const [name, setName] = useState("");
  const [code, setCode] = useState(DEFAULT_SESSION_CODE);

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-10 animate-rise">
      <div className="flex-1">
        <p className="font-display text-4xl tracking-tight text-[var(--lime)]">
          bunch
        </p>
        <p className="mt-2 max-w-[18rem] text-[15px] leading-relaxed text-[var(--ink-muted)]">
          Track protein with friends. Chat, share meals, and finish a weekly
          quest together.
        </p>

        <ol className="mt-5 space-y-2">
          {[
            "Join with your name",
            "Get placed in a squad of ~4",
            "Log lunch, chat, and help the quest",
          ].map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-3 py-2.5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--lime)] text-xs font-extrabold text-[#15141f]">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-[var(--ink)]">{item}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-[28px] border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
              Your name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan"
              className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-[15px] text-[var(--ink)] outline-none focus:border-[var(--ralli)]"
              autoComplete="nickname"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
              Class session code
            </span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-[15px] tracking-[0.18em] font-semibold text-[var(--ink)] outline-none focus:border-[var(--ralli)]"
              autoComplete="off"
            />
            <span className="mt-1.5 block text-[11px] text-[var(--ink-faint)]">
              Everyone in class uses the same code (default BUNCH)
            </span>
          </label>

          {error ? (
            <p className="rounded-xl bg-[#3a1f28] px-3 py-2 text-sm text-[var(--peach)]">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          className="w-full"
          size="lg"
          disabled={loading || name.trim().length < 2}
          onClick={() => void joinSquad(name, code)}
        >
          {loading ? "Finding your squad…" : "Join my squad"}
        </Button>
        <p className="text-center text-xs text-[var(--ink-faint)]">
          No password · same name brings you back to your seat
        </p>
      </div>
    </div>
  );
}
