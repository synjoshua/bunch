"use client";

import { Button } from "@/components/ui";
import { DEFAULT_SESSION_CODE } from "@/lib/types";
import { useBunch } from "@/lib/bunch-context";
import { useState } from "react";

export function JoinScreen() {
  const { joinSquad, loading, error, sessionStats } = useBunch();
  const [name, setName] = useState("");
  const [code, setCode] = useState(DEFAULT_SESSION_CODE);

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-10 animate-rise">
      <div className="flex-1">
        <p className="font-display text-4xl tracking-tight text-[var(--leaf-deep)]">
          bunch
        </p>
        <p className="mt-2 max-w-[17rem] text-[15px] leading-relaxed text-[var(--ink-muted)]">
          Enter your name. We&apos;ll drop you into a squad so the whole class
          can play the week together.
        </p>

        <div className="mt-8 rounded-[28px] bg-white/85 p-5 shadow-[0_16px_40px_rgba(28,52,40,0.08)] border border-white/80 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
              Your name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan"
              className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-[15px] outline-none focus:border-[var(--leaf)]"
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
              className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-[15px] tracking-[0.18em] font-semibold outline-none focus:border-[var(--leaf)]"
              autoComplete="off"
            />
          </label>

          <ul className="space-y-2 text-sm text-[var(--ink)]">
            <li className="flex gap-2">
              <span className="text-[var(--leaf)]">●</span>
              Auto-groups into squads of about 4
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--leaf)]">●</span>
              Live progress syncs for everyone in the room
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--leaf)]">●</span>
              Projector board: /live
            </li>
          </ul>

          {sessionStats ? (
            <p className="text-xs text-[var(--ink-muted)]">
              Live now: {sessionStats.humanCount} people ·{" "}
              {sessionStats.squadCount} squads
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-red-700 bg-red-50 rounded-xl px-3 py-2">
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
          {loading ? "Joining…" : "Join a squad"}
        </Button>
        <p className="text-center text-xs text-[var(--ink-faint)]">
          Same name rejoins your seat · no passwords
        </p>
      </div>
    </div>
  );
}
