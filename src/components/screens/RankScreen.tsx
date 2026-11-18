"use client";

import { Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import {
  RANKS,
  type RankId,
  type RankInfo,
  nextRank,
  rankForPoints,
} from "@/lib/types";
import { Medal } from "lucide-react";

const MEDAL_LOOK: Record<
  RankId,
  { face: string; rim: string; glow: string; label: string }
> = {
  bronze: {
    face: "linear-gradient(145deg, #F0C08A 0%, #CD7F32 45%, #8B5A2B 100%)",
    rim: "#6B3F1A",
    glow: "rgba(205, 127, 50, 0.45)",
    label: "Bronze",
  },
  silver: {
    face: "linear-gradient(145deg, #F5F7FA 0%, #C0C7D1 48%, #8A93A0 100%)",
    rim: "#5C6570",
    glow: "rgba(192, 199, 209, 0.5)",
    label: "Silver",
  },
  gold: {
    face: "linear-gradient(145deg, #FFE9A8 0%, #F5C518 42%, #C99700 100%)",
    rim: "#8A6A00",
    glow: "rgba(245, 197, 24, 0.55)",
    label: "Gold",
  },
  platinum: {
    face: "linear-gradient(145deg, #E8F4FF 0%, #A8C5E8 45%, #6E8FB8 100%)",
    rim: "#3D5A80",
    glow: "rgba(168, 197, 232, 0.5)",
    label: "Platinum",
  },
};

function RankMedal({
  rankId,
  size = "md",
  active = false,
}: {
  rankId: RankId;
  size?: "sm" | "md" | "lg";
  active?: boolean;
}) {
  const look = MEDAL_LOOK[rankId];
  const dim =
    size === "lg" ? "h-24 w-24" : size === "md" ? "h-16 w-16" : "h-11 w-11";
  const icon =
    size === "lg" ? "h-10 w-10" : size === "md" ? "h-7 w-7" : "h-5 w-5";

  return (
    <div
      className={`relative flex ${dim} shrink-0 items-center justify-center rounded-full ${
        active ? "scale-105" : ""
      }`}
      style={{
        background: look.face,
        boxShadow: active
          ? `0 0 0 3px ${look.rim}, 0 10px 28px ${look.glow}`
          : `0 0 0 2px ${look.rim}88, 0 6px 16px rgba(0,0,0,0.35)`,
      }}
      aria-hidden
    >
      <Medal className={`${icon} text-[var(--ink-on-bright)]/90`} strokeWidth={2.25} />
    </div>
  );
}

export function RankScreen() {
  const { goTo, squad, you } = useBunch();
  if (!squad || !you) return null;

  const rank = rankForPoints(squad.rankPoints);
  const upcoming = nextRank(squad.rankPoints);
  const questBonusReady = squad.questsCompletedThisSeason >= 3;
  const projected = rank.reward + (questBonusReady ? 1 : 0);
  const mainRanks = RANKS.filter((r) => r.id !== "platinum");
  const progressMax = upcoming
    ? Math.max(1, upcoming.pointsNeeded - rank.pointsNeeded)
    : 1;
  const progressValue = upcoming
    ? Math.max(0, squad.rankPoints - rank.pointsNeeded)
    : 1;

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <ScreenHeader
        title="Loot & ranks"
        subtitle="Climb medals → bigger grocery gift cards"
        onBack={() => goTo("home")}
      />

      <SectionCard className="overflow-hidden p-0" glass={false}>
        <div
          className="px-4 pb-5 pt-5"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${MEDAL_LOOK[rank.id].glow} 0%, transparent 60%), var(--card-solid)`,
          }}
        >
          <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            Your squad rank
          </p>
          <div className="mt-3 flex flex-col items-center">
            <RankMedal rankId={rank.id} size="lg" active />
            <h2 className="mt-3 font-display text-4xl leading-none text-[var(--ink)]">
              {rank.label}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--ink-muted)]">
              {squad.rankPoints} XP · ${rank.reward} gift card path
            </p>
          </div>

          {upcoming ? (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
                <span>
                  Next medal: <strong className="text-[var(--ink)]">{upcoming.label}</strong>
                </span>
                <span>
                  {squad.rankPoints}/{upcoming.pointsNeeded} XP
                </span>
              </div>
              <ProgressBar
                className="mt-2"
                value={progressValue}
                max={progressMax}
                tone="amber"
              />
              <p className="mt-2 text-center text-[11px] text-[var(--ink-faint)]">
                {upcoming.pointsNeeded - squad.rankPoints} XP to unlock {upcoming.label} ($
                {upcoming.reward})
              </p>
            </div>
          ) : (
            <p className="mt-4 text-center text-sm text-[var(--lime)]">
              Top medal unlocked — Platinum path.
            </p>
          )}
        </div>
      </SectionCard>

      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--peach)]">
        Medal ladder
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {mainRanks.map((r) => (
          <MedalTierCard key={r.id} rank={r} currentId={rank.id} points={squad.rankPoints} />
        ))}
      </div>

      <SectionCard className="mt-3 p-4" glass={false}>
        <div className="flex items-center gap-3">
          <RankMedal rankId="platinum" size="sm" active={rank.id === "platinum"} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[var(--ink)]">Platinum</p>
            <p className="text-[11px] text-[var(--ink-muted)]">
              24+ XP · $5 gift card · highest tier
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
              rank.id === "platinum"
                ? "bg-[var(--lime)] text-[var(--ink-on-bright)]"
                : squad.rankPoints >= 24
                  ? "bg-white/10 text-[var(--ink)]"
                  : "bg-white/5 text-[var(--ink-faint)]"
            }`}
          >
            {rank.id === "platinum" ? "Yours" : "$5"}
          </span>
        </div>
      </SectionCard>

      <SectionCard className="mt-3 p-4" glass={false}>
        <p className="text-sm font-bold text-[var(--ink)]">Projected grocery loot</p>
        <p className="mt-1 font-display text-3xl text-[var(--ink)]">
          ${projected}
          <span className="ml-2 text-sm font-sans font-medium text-[var(--ink-muted)]">
            gift card
          </span>
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
          Base ${rank.reward} from {rank.label} medal
          {questBonusReady
            ? " · quest bonus included"
            : " · finish 3/4 shared-meal weeks for +$1"}
          .
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
            label={`Shared-meal bonus · ${squad.questsCompletedThisSeason}/4 weeks`}
          />
        </div>
      </SectionCard>

      <div className="mt-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-xs leading-relaxed text-[var(--ink-muted)]">
        Hit personal goal-days with your squad to earn XP and climb medals.
        Extra food beyond the goal does not add rank points.
      </div>

      <Button className="mt-5 w-full" variant="secondary" onClick={() => goTo("recap")}>
        See weekly recap
      </Button>
    </div>
  );
}

function MedalTierCard({
  rank,
  currentId,
  points,
}: {
  rank: RankInfo;
  currentId: RankId;
  points: number;
}) {
  const reached = points >= rank.pointsNeeded;
  const active = rank.id === currentId;

  return (
    <div
      className={`rounded-[22px] border px-2.5 py-3 text-center ${
        active
          ? "border-[var(--lime)] bg-[var(--lime)]/10"
          : reached
            ? "border-white/15 bg-white/5"
            : "border-white/10 bg-[var(--card-solid)] opacity-80"
      }`}
    >
      <div className="flex justify-center">
        <RankMedal rankId={rank.id} size="md" active={active} />
      </div>
      <p className="mt-2 font-display text-lg leading-none text-[var(--ink)]">
        {rank.label}
      </p>
      <p className="mt-1 text-[11px] font-bold text-[var(--ink-muted)]">
        ${rank.reward}
      </p>
      <p className="mt-0.5 text-[10px] text-[var(--ink-faint)]">
        {rank.pointsNeeded === 0 ? "Start here" : `${rank.pointsNeeded}+ XP`}
      </p>
      {active ? (
        <p className="mt-2 rounded-full bg-[var(--lime)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--ink-on-bright)]">
          Current
        </p>
      ) : reached ? (
        <p className="mt-2 text-[10px] font-bold text-[var(--ink-muted)]">Cleared</p>
      ) : (
        <p className="mt-2 text-[10px] font-bold text-[var(--ink-faint)]">Locked</p>
      )}
    </div>
  );
}

function EligibilityRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
          ok
            ? "bg-[var(--lime)] text-[var(--ink-on-bright)]"
            : "bg-[var(--line)] text-[var(--ink-faint)]"
        }`}
      >
        {ok ? "✓" : "·"}
      </span>
      <span className="text-[var(--ink)]">{label}</span>
    </div>
  );
}
