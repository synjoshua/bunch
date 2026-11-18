"use client";

import { Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import { DEMO_LUNCH, useBunch } from "@/lib/bunch-context";
import { Camera, Minus, Plus } from "lucide-react";
import { useState } from "react";

export function LogMealScreen() {
  const { goTo, saveMeal, you, loading } = useBunch();
  const [name, setName] = useState(DEMO_LUNCH.name);
  const [protein, setProtein] = useState(DEMO_LUNCH.protein);
  const [share, setShare] = useState(true);

  if (!you) return null;

  const projected = you.personalProtein + protein;
  const willComplete =
    !you.goalDayComplete && projected >= you.proteinTarget;
  const shareLocked = you.sharedQuestToday;

  return (
    <div className="px-5 pb-10 pt-6 animate-rise">
      <ScreenHeader
        title="Log lunch"
        subtitle="Photo or quick entry — private by default"
        onBack={() => goTo("home")}
      />

      <SectionCard className="overflow-hidden">
        <div className="relative aspect-[4/3] bg-[var(--leaf-soft)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DEMO_LUNCH.image}
            alt={name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--ink)]">
            <Camera className="h-3.5 w-3.5" />
            Demo photo ready
          </div>
        </div>

        <div className="space-y-4 p-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
              Meal name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-[15px] outline-none focus:border-[var(--leaf)]"
            />
          </label>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
                Protein estimate
              </span>
              <span className="font-display text-xl text-[var(--ink)]">
                {protein}g
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                aria-label="Decrease protein"
                onClick={() => setProtein((p) => Math.max(5, p - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <ProgressBar
                className="flex-1"
                value={Math.min(protein, 60)}
                max={60}
                tone="amber"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                aria-label="Increase protein"
                onClick={() => setProtein((p) => Math.min(80, p + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-[var(--ink-muted)]">
              Today after save:{" "}
              {Math.min(projected, you.proteinTarget + 40)}g / {you.proteinTarget}
              g
              {willComplete ? " · completes your goal-day" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => !shareLocked && setShare((s) => !s)}
            disabled={shareLocked}
            className={`flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${
              share && !shareLocked
                ? "border-[var(--sky)] bg-[var(--sky-soft)]"
                : "border-[var(--line)] bg-[var(--surface)]"
            } ${shareLocked ? "opacity-60" : ""}`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                share || shareLocked
                  ? "border-[var(--sky)] bg-[var(--sky)] text-white"
                  : "border-[var(--line)] bg-white"
              }`}
            >
              {(share || shareLocked) && (
                <span className="text-[11px] font-bold">✓</span>
              )}
            </span>
            <span>
              <span className="block text-sm font-semibold text-[var(--ink)]">
                Share to squad quest
              </span>
              <span className="mt-0.5 block text-xs text-[var(--ink-muted)]">
                {shareLocked
                  ? "You already contributed today — one quest post per day."
                  : "Counts toward Recipe Relay for everyone in your squad."}
              </span>
            </span>
          </button>
        </div>
      </SectionCard>

      <Button
        className="mt-5 w-full"
        size="lg"
        disabled={loading || !name.trim()}
        onClick={() =>
          void saveMeal({
            shareToQuest: share && !shareLocked,
            protein,
            name,
          })
        }
      >
        {loading ? "Saving…" : "Save meal"}
      </Button>
      <p className="mt-3 text-center text-xs text-[var(--ink-faint)]">
        Extra protein past your target doesn&apos;t add rank points.
      </p>
    </div>
  );
}
