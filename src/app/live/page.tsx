"use client";

import { ProgressBar } from "@/components/ui";
import { DEFAULT_SESSION_CODE, SQUAD_SIZE, type LiveSquadCard } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

type LiveBoard = {
  sessionCode: string;
  humanCount: number;
  squadCount: number;
  demoStarted: boolean;
  seatsFilled: number;
  seatsTarget: number;
  squads: LiveSquadCard[];
};

export default function LivePage() {
  const [code, setCode] = useState(DEFAULT_SESSION_CODE);
  const [board, setBoard] = useState<LiveBoard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/live?session=${encodeURIComponent(code || DEFAULT_SESSION_CODE)}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        if (!cancelled) {
          setBoard(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      }
    };
    void load();
    const id = window.setInterval(() => void load(), 2000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [code]);

  const reset = async () => {
    if (!window.confirm(`Reset session ${code}? Everyone will need to rejoin.`)) {
      return;
    }
    await fetch(`/api/live?session=${encodeURIComponent(code)}`, {
      method: "DELETE",
    });
  };

  const start = async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionCode: code, action: "start" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start");
      setBoard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start");
    } finally {
      setStarting(false);
    }
  };

  // TEMP — remove autofill before real class demo
  const autofill = async () => {
    setFilling(true);
    try {
      const res = await fetch("/api/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionCode: code,
          action: "autofill",
          targetPeople: 12,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not autofill");
      setBoard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not autofill");
    } finally {
      setFilling(false);
    }
  };

  const waiting = board ? !board.demoStarted : true;

  return (
    <main className="live-stage min-h-dvh px-5 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-4xl text-[var(--lime)] md:text-5xl">
              bunch live
            </p>
            <p className="mt-2 max-w-xl text-sm text-[var(--ink-muted)] md:text-base">
              {waiting
                ? "Waiting room — let everyone join a bunch, then start the demo."
                : "Demo is live. Watch bunches log meals and climb ranks."}{" "}
              Code{" "}
              <span className="font-semibold text-[var(--ink)]">
                {board?.sessionCode ?? code}
              </span>
              .
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm font-semibold tracking-[0.14em] text-[var(--ink)]"
              aria-label="Session code"
            />
            <Link
              href="/"
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
            >
              Open player app
            </Link>
            <button
              type="button"
              onClick={() => void reset()}
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-[var(--ink-muted)]"
            >
              Reset session
            </button>
          </div>
        </div>

        {waiting ? (
          <div className="mt-6 rounded-[28px] border border-[var(--lime)]/35 bg-[var(--lime)]/10 p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--ink-on-bright)]/70">
                  Host control
                </p>
                <p className="mt-1 font-display text-2xl text-[var(--ink-on-bright)] md:text-3xl">
                  {board?.humanCount ?? 0} people seated ·{" "}
                  {board?.squadCount ?? 0} bunches
                </p>
                <p className="mt-1 text-sm text-[var(--ink-on-bright)]/80">
                  Start when groups look ready (e.g. 12 people → 3 bunches of 4).
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={filling}
                  onClick={() => void autofill()}
                  className="rounded-full bg-white px-5 py-3.5 text-sm font-extrabold text-[var(--ink-on-bright)] disabled:opacity-50"
                >
                  {filling ? "Filling…" : "Autofill room (test)"}
                </button>
                <button
                  type="button"
                  disabled={starting || (board?.humanCount ?? 0) < 1}
                  onClick={() => void start()}
                  className="rounded-full bg-[var(--ink-on-bright)] px-6 py-3.5 text-base font-extrabold text-[var(--lime)] disabled:opacity-50"
                >
                  {starting ? "Starting…" : "Start demo"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--ink-muted)]">
            Demo started. Players left the waiting room and can log meals.
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="People in room" value={String(board?.humanCount ?? 0)} />
          <Stat label="Bunches" value={String(board?.squadCount ?? 0)} />
          <Stat
            label={waiting ? "Seats per bunch" : "Top quest"}
            value={
              waiting
                ? String(SQUAD_SIZE)
                : board?.squads[0]
                  ? `${Math.max(...board.squads.map((s) => s.questCount), 0)}/12`
                  : "0/12"
            }
          />
          <Stat
            label="Status"
            value={waiting ? "Waiting" : "Live"}
            subtle
          />
        </div>

        {error ? (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(board?.squads ?? []).length === 0 ? (
            <div className="rounded-[28px] border border-[var(--card-border)] bg-[var(--card)] p-6 text-[var(--ink-muted)] shadow-sm sm:col-span-2 xl:col-span-3">
              Waiting for the first people to join. Ask the room to open the
              player app, enter a name, and use code{" "}
              <strong className="text-[var(--ink)]">{code || "BUNCH"}</strong>.
            </div>
          ) : (
            board?.squads.map((squad) => (
              <SquadCard key={squad.id} squad={squad} waiting={waiting} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-[var(--card-border)] bg-[var(--card)] px-4 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
        {label}
      </p>
      <p
        className={`mt-2 font-display ${
          subtle ? "text-xl" : "text-3xl"
        } text-[var(--ink)]`}
      >
        {value}
      </p>
    </div>
  );
}

function SquadCard({
  squad,
  waiting,
}: {
  squad: LiveSquadCard;
  waiting: boolean;
}) {
  const weekPct = Math.round(
    (squad.weeklyGoalDays / Math.max(1, squad.weeklyGoalTarget)) * 100,
  );
  const open = Math.max(0, SQUAD_SIZE - squad.memberCount);

  if (waiting) {
    return (
      <article className="rounded-[28px] border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-[var(--ink)]">{squad.name}</h2>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              {squad.memberCount}/{SQUAD_SIZE} seated
              {open > 0 ? ` · ${open} open` : " · full"}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              open === 0
                ? "bg-[var(--lime)] text-[var(--ink-on-bright)]"
                : "bg-white/10 text-[var(--ink)]"
            }`}
          >
            {open === 0 ? "Ready" : "Filling"}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {squad.memberNames.map((name) => (
            <span
              key={name}
              className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-[var(--ink)]"
            >
              {name}
            </span>
          ))}
          {Array.from({ length: open }).map((_, i) => (
            <span
              key={`open-${i}`}
              className="rounded-full border border-dashed border-white/20 px-3 py-1 text-xs text-[var(--ink-faint)]"
            >
              open seat
            </span>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-[28px] border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-[var(--ink)]">{squad.name}</h2>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            {squad.memberCount} members · {squad.rankLabel}
          </p>
        </div>
        <span className="rounded-full bg-[var(--lime)] px-2.5 py-1 text-xs font-bold text-[var(--ink-on-bright)]">
          {weekPct}%
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
        Goal-days
      </p>
      <p className="font-display text-2xl text-[var(--ink)]">
        {squad.weeklyGoalDays}/{squad.weeklyGoalTarget}
      </p>
      <ProgressBar
        className="mt-2"
        value={squad.weeklyGoalDays}
        max={Math.max(1, squad.weeklyGoalTarget)}
      />

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
        Shared meals
      </p>
      <p className="text-sm font-semibold text-[var(--ink)]">
        {squad.questCount}/{squad.questTarget}
      </p>
      <ProgressBar
        className="mt-2"
        value={squad.questCount}
        max={squad.questTarget}
        tone="sky"
      />

      <p className="mt-4 text-xs leading-relaxed text-[var(--ink-muted)]">
        {squad.memberNames.join(" · ") || "Seats filling…"}
      </p>
    </article>
  );
}
