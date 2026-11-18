"use client";

import { Avatar } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { SQUAD_SIZE } from "@/lib/types";
import { Users } from "lucide-react";

export function WaitingRoomScreen() {
  const { you, squad, sessionCode, sessionStats, leaveSession } = useBunch();

  if (!you || !squad) {
    return (
      <div className="px-5 py-10 text-sm text-[var(--ink-muted)]">
        Finding your bunch…
      </div>
    );
  }

  // Include demo seats while autofill is enabled for testing
  const people = squad.members;
  const openSeats = Math.max(0, SQUAD_SIZE - people.length);
  const roomPeople = sessionStats?.humanCount ?? people.length;
  const roomBunches = sessionStats?.squadCount ?? 1;

  return (
    <div className="flex min-h-full flex-col px-5 pb-10 pt-8 animate-rise">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--peach)]">
        Waiting room
      </p>
      <h1 className="mt-2 font-display text-3xl leading-none text-[var(--ink)]">
        You&apos;re in {squad.name}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
        Hang tight while classmates join. The host will start the demo from the
        live screen when bunches look full.
      </p>

      <div className="mt-5 rounded-[28px] border border-white/10 bg-[var(--card-solid)] p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
            Your bunch
          </p>
          <p className="text-xs font-bold text-[var(--lime)]">
            {people.length}/{SQUAD_SIZE} seated
          </p>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {people.map((m) => (
            <div key={m.id} className="text-center">
              <div className="mx-auto w-fit">
                <Avatar short={m.short} color={m.color} size="lg" ring={m.isYou} />
              </div>
              <p className="mt-1.5 truncate text-[11px] font-semibold text-[var(--ink)]">
                {m.isYou ? "You" : m.isBot ? `${m.name}*` : m.name}
              </p>
            </div>
          ))}
          {Array.from({ length: openSeats }).map((_, i) => (
            <div key={`open-${i}`} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-white/25 text-[10px] text-[var(--ink-faint)]">
                open
              </div>
              <p className="mt-1.5 text-[11px] text-[var(--ink-faint)]">Seat</p>
            </div>
          ))}
        </div>

        {openSeats > 0 ? (
          <p className="mt-4 text-xs leading-relaxed text-[var(--ink-muted)]">
            {openSeats} open seat{openSeats === 1 ? "" : "s"} — friends joining
            code <span className="font-semibold text-[var(--ink)]">{sessionCode}</span>{" "}
            fill this bunch first.
          </p>
        ) : (
          <p className="mt-4 text-xs font-semibold text-[var(--lime)]">
            Bunch full — waiting for host to start.
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--ralli-deep)] text-[var(--cream)]">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-[var(--ink)]">
            {roomPeople} in the room · {roomBunches} bunch
            {roomBunches === 1 ? "" : "es"}
          </p>
          <p className="text-[11px] text-[var(--ink-muted)]">
            Updates live every couple seconds
          </p>
        </div>
      </div>

      <div className="mt-auto pt-8 text-center">
        <div className="mx-auto mb-3 flex h-2 w-28 gap-1.5">
          <span className="flex-1 animate-pulse rounded-full bg-[var(--lime)]" />
          <span className="flex-1 animate-pulse rounded-full bg-[var(--lime)]/50 [animation-delay:150ms]" />
          <span className="flex-1 animate-pulse rounded-full bg-[var(--lime)]/25 [animation-delay:300ms]" />
        </div>
        <p className="text-sm font-semibold text-[var(--ink)]">
          Waiting for demo to start…
        </p>
        <button
          type="button"
          onClick={leaveSession}
          className="mt-4 text-xs font-semibold text-[var(--ink-faint)] underline-offset-2 hover:underline"
        >
          Leave / switch name
        </button>
      </div>
    </div>
  );
}
