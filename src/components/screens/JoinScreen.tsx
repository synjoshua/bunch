"use client";

import { Button } from "@/components/ui";
import { DEFAULT_SESSION_CODE } from "@/lib/types";
import { useBunch } from "@/lib/bunch-context";
import { ArrowRight, Star } from "lucide-react";
import { useState } from "react";

export function JoinScreen() {
  const { joinSquad, loading, error } = useBunch();
  const [name, setName] = useState("");
  const [code, setCode] = useState(DEFAULT_SESSION_CODE);

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-10 animate-rise">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl text-[var(--lime)]">bunch</p>
        <span className="text-xs font-semibold text-[var(--ink-faint)]">
          class demo
        </span>
      </div>

      <div className="relative mx-auto mt-8 h-44 w-full max-w-[280px]">
        <div className="absolute left-2 top-6 z-[1] w-[72%] -rotate-6 rounded-[26px] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-md animate-floaty">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--teal)]">
            Squad check-in
          </p>
          <p className="mt-1 text-sm font-bold text-white">Chicken bowl · 38g</p>
          <p className="mt-1 text-[11px] text-white/70">Goal-day almost done</p>
        </div>
        <div className="lime-blob absolute bottom-0 right-0 z-0 h-28 w-[58%] rotate-6 p-3 shadow-[0_18px_40px_rgba(223,255,131,0.25)]">
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--ink-on-bright)]/70">
            Recipe Relay
          </p>
          <p className="mt-1 font-display text-2xl text-[var(--ink-on-bright)]">
            9/12
          </p>
        </div>
        <div className="absolute right-8 top-0 z-[2] flex items-center gap-1 rounded-full bg-[var(--teal)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--ink-on-bright)] shadow-lg">
          <Star className="h-3 w-3 fill-current" />
          play with friends
        </div>
      </div>

      <h1 className="mt-8 font-display text-[2rem] leading-[1.05] text-[var(--ink)]">
        Take <span className="mark-circle">control</span> of nutrition
        <span className="text-[var(--lime)]"> together</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
        Join a squad, chat live, log meals, and finish weekly quests as a bunch.
      </p>

      <div className="mt-6 space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
            Your name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jordan"
            className="w-full rounded-[22px] border border-white/15 bg-white/5 px-4 py-3.5 text-[15px] text-[var(--ink)] outline-none backdrop-blur-md placeholder:text-[var(--ink-faint)] focus:border-[var(--lime)]"
            autoComplete="nickname"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
            Session code
          </span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full rounded-[22px] border border-white/15 bg-white/5 px-4 py-3.5 text-[15px] font-semibold tracking-[0.16em] text-[var(--ink)] outline-none backdrop-blur-md focus:border-[var(--lime)]"
            autoComplete="off"
          />
        </label>
        {error ? (
          <p className="rounded-2xl bg-[#3a1f28] px-3 py-2 text-sm text-[var(--peach)]">
            {error}
          </p>
        ) : null}
      </div>

      <Button
        className="mt-6 w-full"
        size="lg"
        variant="lime"
        organic
        disabled={loading || name.trim().length < 2}
        onClick={() => void joinSquad(name, code)}
      >
        {loading ? "Finding your squad…" : "Get started"}
        <ArrowRight className="h-4 w-4" />
      </Button>
      <p className="mt-3 text-center text-xs text-[var(--ink-faint)]">
        Same name rejoins your seat · no passwords
      </p>
    </div>
  );
}
