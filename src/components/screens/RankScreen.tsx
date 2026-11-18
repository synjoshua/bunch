"use client";

import { Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import {
  GOLD_GIFT_AMOUNT,
  RANKS,
  type RankId,
  type RankInfo,
  nextRank,
  rankForPoints,
} from "@/lib/types";
import { Check, Medal, Share2, Target } from "lucide-react";
import type { ReactNode } from "react";

const MEDAL_LOOK: Record<
  RankId,
  { face: string; rim: string; glow: string }
> = {
  bronze: {
    face: "linear-gradient(145deg, #F0C08A 0%, #CD7F32 45%, #8B5A2B 100%)",
    rim: "#6B3F1A",
    glow: "rgba(205, 127, 50, 0.45)",
  },
  silver: {
    face: "linear-gradient(145deg, #F5F7FA 0%, #C0C7D1 48%, #8A93A0 100%)",
    rim: "#5C6570",
    glow: "rgba(192, 199, 209, 0.5)",
  },
  gold: {
    face: "linear-gradient(145deg, #FFE9A8 0%, #F5C518 42%, #C99700 100%)",
    rim: "#8A6A00",
    glow: "rgba(245, 197, 24, 0.55)",
  },
  platinum: {
    face: "linear-gradient(145deg, #E8F4FF 0%, #A8C5E8 45%, #6E8FB8 100%)",
    rim: "#3D5A80",
    glow: "rgba(168, 197, 232, 0.5)",
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
  const { goTo, squad, you, redeemGift, loading, error } = useBunch();
  if (!squad || !you) return null;

  const rank = rankForPoints(squad.rankPoints);
  const upcoming = nextRank(squad.rankPoints);
  const mainRanks = RANKS.filter((r) => r.id !== "platinum");
  const progressMax = upcoming
    ? Math.max(1, upcoming.pointsNeeded - rank.pointsNeeded)
    : 1;
  const progressValue = upcoming
    ? Math.max(0, squad.rankPoints - rank.pointsNeeded)
    : 1;
  const isGoldPlus = rank.id === "gold" || rank.id === "platinum";
  const goalsNeeded = Math.max(0, 2 - squad.goalsHitToday);
  const sharesNeeded = Math.max(0, 2 - squad.sharedToday);

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <ScreenHeader
        title="Loot & ranks"
        subtitle={`Share + hit 100% goals together → Gold → $${GOLD_GIFT_AMOUNT} gift card`}
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
            Your bunch rank
          </p>
          <div className="mt-3 flex flex-col items-center">
            <RankMedal rankId={rank.id} size="lg" active />
            <h2 className="mt-3 font-display text-4xl leading-none text-[var(--ink)]">
              {rank.label}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--ink-muted)]">
              {squad.rankPoints} XP
              {isGoldPlus
                ? ` · $${squad.giftAmount} gift card unlocked`
                : ` · unlock Gold for $${GOLD_GIFT_AMOUNT}`}
            </p>
          </div>

          {upcoming && upcoming.id !== "platinum" ? (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
                <span>
                  Next: <strong className="text-[var(--ink)]">{upcoming.label}</strong>
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
            </div>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard className="mt-3 p-4" glass={false}>
        <p className="text-sm font-bold text-[var(--ink)]">Path to Gold gift card</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">
          When multiple teammates share plates and hit 100% of their protein
          goal, your bunch earns XP. Reach Gold to redeem.
        </p>

        <div className="mt-4 space-y-2.5">
          <PathRow
            icon={<Target className="h-4 w-4" />}
            ok={squad.goalsHitToday >= 2}
            title="Hit 100% goals"
            detail={
              squad.goalsHitToday >= 2
                ? `${squad.goalsHitToday} teammates at 100% today`
                : `${goalsNeeded} more teammate${goalsNeeded === 1 ? "" : "s"} need 100% today`
            }
          />
          <PathRow
            icon={<Share2 className="h-4 w-4" />}
            ok={squad.sharedToday >= 2}
            title="Share meals"
            detail={
              squad.sharedToday >= 2
                ? `${squad.sharedToday} shared plates today`
                : `${sharesNeeded} more share${sharesNeeded === 1 ? "" : "s"} today`
            }
          />
          <PathRow
            icon={<Medal className="h-4 w-4" />}
            ok={isGoldPlus}
            title="Reach Gold medal"
            detail={
              isGoldPlus
                ? "Gold unlocked — redeem below"
                : `${Math.max(0, 16 - squad.rankPoints)} XP to Gold`
            }
          />
        </div>
      </SectionCard>

      {isGoldPlus ? (
        <SectionCard className="mt-3 p-4" glass={false}>
          <div className="flex items-center gap-3">
            <RankMedal rankId="gold" size="sm" active />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--ink)]">
                ${squad.giftAmount} grocery gift card
              </p>
              <p className="text-[11px] text-[var(--ink-muted)]">
                Demo redeem — show this code in class
              </p>
            </div>
          </div>
          {squad.giftRedeemed && squad.giftCode ? (
            <div className="mt-3 rounded-2xl border border-[var(--lime)]/40 bg-[var(--lime)]/10 px-3 py-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--ink-faint)]">
                Redeemed code
              </p>
              <p className="mt-1 font-display text-2xl tracking-wide text-[var(--lime)]">
                {squad.giftCode}
              </p>
            </div>
          ) : (
            <Button
              className="mt-3 w-full"
              size="lg"
              variant="lime"
              disabled={loading}
              onClick={() => void redeemGift()}
            >
              Redeem ${squad.giftAmount} gift card
            </Button>
          )}
          {error ? (
            <p className="mt-2 text-center text-xs text-[var(--peach)]">{error}</p>
          ) : null}
        </SectionCard>
      ) : (
        <SectionCard className="mt-3 p-4" glass={false}>
          <p className="text-sm font-bold text-[var(--ink)]">Gift card locked</p>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            Log meals, share with your bunch, and hit 100% goals together to
            climb to Gold.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => goTo("log")}
            >
              Log meal
            </Button>
            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => goTo("quest")}
            >
              Shared meals
            </Button>
          </div>
        </SectionCard>
      )}

      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--peach)]">
        Medal ladder
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {mainRanks.map((r) => (
          <MedalTierCard key={r.id} rank={r} currentId={rank.id} points={squad.rankPoints} />
        ))}
      </div>

      <Button className="mt-5 w-full" variant="secondary" onClick={() => goTo("recap")}>
        See weekly recap
      </Button>
    </div>
  );
}

function PathRow({
  icon,
  ok,
  title,
  detail,
}: {
  icon: ReactNode;
  ok: boolean;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          ok
            ? "bg-[var(--lime)] text-[var(--ink-on-bright)]"
            : "bg-white/10 text-[var(--ink-muted)]"
        }`}
      >
        {ok ? <Check className="h-4 w-4" /> : icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[var(--ink)]">{title}</p>
        <p className="text-[11px] text-[var(--ink-muted)]">{detail}</p>
      </div>
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
  const giftLabel =
    rank.id === "gold" ? `$${GOLD_GIFT_AMOUNT} card` : rank.id === "bronze" ? "Start" : "Climb";

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
      <p className="mt-1 text-[11px] font-bold text-[var(--ink-muted)]">{giftLabel}</p>
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
