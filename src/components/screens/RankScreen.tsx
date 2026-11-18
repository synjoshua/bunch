"use client";

import { Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { RANKS, nextRank, rankForPoints } from "@/lib/types";
import { Check } from "lucide-react";

export function RankScreen() {
  const { goTo, squad, you } = useBunch();
  if (!squad || !you) return null;

  const rank = rankForPoints(squad.rankPoints);
  const upcoming = nextRank(squad.rankPoints);
  const questBonusReady = squad.questsCompletedThisSeason >= 3;
  const projected = rank.reward + (questBonusReady ? 1 : 0);

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <ScreenHeader
        title="Rank & rewards"
        subtitle="Consistency unlocks the gift card size"
        onBack={() => goTo("home")}
      />

      <SectionCard className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
          {squad.name} rank
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <h2 className="font-display text-4xl text-[var(--ink)]">{rank.label}</h2>
          <p className="text-right text-sm text-[var(--ink-muted)]">
            {squad.rankPoints} rank pts
          </p>
        </div>
        {upcoming ? (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[var(--ink-muted)]">
              <span>Next: {upcoming.label}</span>
              <span>
                {squad.rankPoints}/{upcoming.pointsNeeded} pts
              </span>
            </div>
            <ProgressBar
              className="mt-2"
              value={squad.rankPoints - rank.pointsNeeded}
              max={Math.max(1, upcoming.pointsNeeded - rank.pointsNeeded)}
              tone="amber"
            />
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--leaf-deep)]">
            Platinum reached — highest sample reward tier.
          </p>
        )}
      </SectionCard>

      <SectionCard className="mt-3 overflow-hidden">
        <div className="border-b border-[var(--line)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--ink)]">
            Example gift card by rank
          </p>
          <p className="text-xs text-[var(--ink-muted)]">
            Sample amounts for this class prototype only
          </p>
        </div>
        <ul>
          {RANKS.map((r) => {
            const active = r.id === rank.id;
            return (
              <li
                key={r.id}
                className={`flex items-center justify-between px-4 py-3 border-b border-[var(--line)] last:border-0 ${
                  active ? "bg-[var(--leaf-soft)]/60" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {active ? (
                    <Check className="h-4 w-4 text-[var(--leaf)]" />
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                  <span
                    className={`text-sm ${
                      active
                        ? "font-bold text-[var(--leaf-deep)]"
                        : "font-medium text-[var(--ink)]"
                    }`}
                  >
                    {r.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[var(--ink)]">
                  ${r.reward}
                </span>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <SectionCard className="mt-3 p-4">
        <p className="text-sm font-semibold text-[var(--ink)]">
          Projected for you this season
        </p>
        <p className="mt-1 font-display text-3xl text-[var(--ink)]">
          ${projected}
          <span className="ml-2 text-sm font-sans font-medium text-[var(--ink-muted)]">
            gift card
          </span>
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
          Base ${rank.reward} from {rank.label}
          {questBonusReady
            ? " · quest bonus included"
            : " · finish 3/4 quests for +$1"}
          . Not earned until season rules are met.
        </p>

        <div className="mt-4 space-y-2">
          <EligibilityRow
            ok={squad.seasonWeeksHit >= 2}
            label={`Squad weeks on target · ${squad.seasonWeeksHit}/4 (need 3)`}
          />
          <EligibilityRow
            ok={you.weeksParticipated >= 2}
            label={`Your participation · ${you.weeksParticipated}/4 (need 3)`}
          />
          <EligibilityRow
            ok={questBonusReady}
            label={`Quest bonus track · ${squad.questsCompletedThisSeason}/4 weeks`}
          />
        </div>
      </SectionCard>

      <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-xs leading-relaxed text-[var(--ink-muted)] border border-white/80">
        Weekly score = % of scheduled personal goal-days completed. Extra food
        does not add rank points. Private logs are never penalized.
      </div>

      <Button className="mt-5 w-full" variant="secondary" onClick={() => goTo("recap")}>
        See weekly recap
      </Button>
    </div>
  );
}

function EligibilityRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
          ok
            ? "bg-[var(--leaf)] text-white"
            : "bg-[var(--line)] text-[var(--ink-faint)]"
        }`}
      >
        {ok ? "✓" : "·"}
      </span>
      <span className="text-[var(--ink)]">{label}</span>
    </div>
  );
}
