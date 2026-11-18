"use client";

import { GooeyCta } from "@/components/ui";
import { DEFAULT_SESSION_CODE, FOOD_SHOTS, SAMPLE_MEALS } from "@/lib/types";
import { useBunch } from "@/lib/bunch-context";
import { useState } from "react";

export function JoinScreen() {
  const { joinSquad, loading, error } = useBunch();
  const [name, setName] = useState("");
  const [code, setCode] = useState(DEFAULT_SESSION_CODE);

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-8 animate-rise">
      <p className="font-display text-2xl text-[var(--lime)]">bunch</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--peach)]">
        Food quests with friends
      </p>

      {/* Food photo collage — game packaging vibe */}
      <div className="relative mt-5 h-52 overflow-hidden rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="grid h-full grid-cols-3 gap-1">
          {[FOOD_SHOTS[0], FOOD_SHOTS[1], FOOD_SHOTS[2], FOOD_SHOTS[3], FOOD_SHOTS[4], SAMPLE_MEALS[0].image].map(
            (src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src + i}
                src={src}
                alt=""
                className={`h-full w-full object-cover ${i === 1 || i === 4 ? "row-span-1" : ""}`}
              />
            ),
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#100f18] via-[#100f18]/35 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-xl text-white">Kitchen co-op</p>
            <p className="text-xs text-white/80">Log plates · share recipes · level up</p>
          </div>
          <span className="rounded-full bg-[var(--lime)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--ink-on-bright)]">
            +XP for meals
          </span>
        </div>
      </div>

      <h1 className="mt-6 font-display text-[1.85rem] leading-[1.08] text-[var(--ink)]">
        Eat better as a{" "}
        <span className="text-[var(--lime)]">squad</span>
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
        Snap lunch, fuel your protein goal, drop meal ideas in the quest, and
        talk it out in chat — like a co-op game for real food.
      </p>

      <div className="mt-5 space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
            Player name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jordan"
            className="w-full rounded-[22px] border border-white/12 bg-[var(--card-solid)] px-4 py-3.5 text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--lime)]"
            autoComplete="nickname"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
            Table code
          </span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full rounded-[22px] border border-white/12 bg-[var(--card-solid)] px-4 py-3.5 text-[15px] font-semibold tracking-[0.16em] text-[var(--ink)] outline-none focus:border-[var(--lime)]"
            autoComplete="off"
          />
        </label>
        {error ? (
          <p className="rounded-2xl bg-[#3a1f28] px-3 py-2 text-sm text-[var(--peach)]">
            {error}
          </p>
        ) : null}
      </div>

      <GooeyCta
        className="mt-6"
        disabled={loading || name.trim().length < 2}
        onClick={() => void joinSquad(name, code)}
      >
        {loading ? "Finding your table…" : "Sit down at the table"}
      </GooeyCta>
      <p className="mt-3 text-center text-xs text-[var(--ink-faint)]">
        Same name brings you back · no passwords
      </p>
    </div>
  );
}
