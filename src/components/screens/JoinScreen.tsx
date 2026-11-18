"use client";

import { Avatar, Button } from "@/components/ui";
import { INITIAL_MEMBERS, SQUAD_NAME } from "@/lib/demo-data";
import { useNori } from "@/lib/nori-context";

export function JoinScreen() {
  const { joinSquad } = useNori();
  const friends = INITIAL_MEMBERS.filter((m) => !m.isYou);

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-10 animate-rise">
      <div className="flex-1">
        <p className="font-display text-4xl tracking-tight text-[var(--leaf-deep)]">
          nori
        </p>
        <p className="mt-2 max-w-[16rem] text-[15px] leading-relaxed text-[var(--ink-muted)]">
          Track your protein with friends. Hit your goal-days. Climb ranks
          together.
        </p>

        <div className="mt-8 rounded-[28px] bg-white/85 p-5 shadow-[0_16px_40px_rgba(28,52,40,0.08)] border border-white/80">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            You&apos;re invited
          </p>
          <h2 className="mt-2 font-display text-2xl text-[var(--ink)]">
            {SQUAD_NAME}
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            4 friends · 5 goal-days each · Season 2 underway
          </p>

          <div className="mt-5 flex -space-x-2">
            {friends.map((m) => (
              <Avatar key={m.id} short={m.short} color={m.color} ring />
            ))}
          </div>

          <ul className="mt-5 space-y-2.5 text-sm text-[var(--ink)]">
            <li className="flex gap-2">
              <span className="text-[var(--leaf)]">●</span>
              Personal daily protein target: 120g
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--leaf)]">●</span>
              Weekly quest: Recipe Relay (12 meal ideas)
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--leaf)]">●</span>
              Rank reward preview: Silver · $2 gift card
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button className="w-full" size="lg" onClick={joinSquad}>
          Join {SQUAD_NAME}
        </Button>
        <p className="text-center text-xs text-[var(--ink-faint)]">
          Class prototype · no accounts or payments
        </p>
      </div>
    </div>
  );
}
