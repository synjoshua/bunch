"use client";

import { ProgressBar } from "@/components/ui";
import { DEFAULT_SESSION_CODE, type LiveSquadCard } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

type LiveBoard = {
  sessionCode: string;
  humanCount: number;
  squadCount: number;
  squads: LiveSquadCard[];
};

export default function LivePage() {
  const [code, setCode] = useState(DEFAULT_SESSION_CODE);
  const [board, setBoard] = useState<LiveBoard | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="live-stage min-h-dvh px-5 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-4xl text-[var(--leaf-deep)] md:text-5xl">
              nori live
            </p>
            <p className="mt-2 max-w-xl text-sm text-[var(--ink-muted)] md:text-base">
              Projector view for the class. Squads fill as people join session{" "}
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
              className="rounded-2xl border border-[var(--line)] bg-white/80 px-3 py-2 text-sm font-semibold tracking-[0.14em]"
              aria-label="Session code"
            />
            <Link
              href="/"
              className="rounded-2xl bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--ink)] border border-[var(--line)]"
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

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="People in room" value={String(board?.humanCount ?? 0)} />
          <Stat label="Active squads" value={String(board?.squadCount ?? 0)} />
          <Stat
            label="Top quest"
            value={
              board?.squads[0]
                ? `${Math.max(...board.squads.map((s) => s.questCount), 0)}/12`
                : "0/12"
            }
          />
          <Stat
            label="Join tip"
            value="Name + code"
            subtle
          />
        </div>

        {error ? (
          <p className="mt-4 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(board?.squads ?? []).length === 0 ? (
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 text-[var(--ink-muted)] shadow-sm sm:col-span-2 xl:col-span-3">
              Waiting for the first people to join. Ask the room to open the
              player app, enter a name, and use code{" "}
              <strong className="text-[var(--ink)]">{code || "NORI"}</strong>.
            </div>
          ) : (
            board?.squads.map((squad) => <SquadCard key={squad.id} squad={squad} />)
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
    <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-4 shadow-sm">
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

function SquadCard({ squad }: { squad: LiveSquadCard }) {
  const weekPct = Math.round(
    (squad.weeklyGoalDays / Math.max(1, squad.weeklyGoalTarget)) * 100,
  );
  return (
    <article className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_12px_40px_rgba(28,52,40,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-[var(--ink)]">{squad.name}</h2>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            {squad.memberCount} members · {squad.rankLabel} · ${squad.reward}
          </p>
        </div>
        <span className="rounded-full bg-[var(--leaf-soft)] px-2.5 py-1 text-xs font-bold text-[var(--leaf-deep)]">
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
        Recipe Relay
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
