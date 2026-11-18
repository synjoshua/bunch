"use client";

import { Avatar, Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { FOOD_SHOTS, SAMPLE_MEALS } from "@/lib/types";

export function QuestScreen() {
  const {
    goTo,
    squad,
    you,
    shareExistingIdea,
    loading,
  } = useBunch();

  if (!squad || !you) return null;

  const complete = squad.mealIdeas.length >= squad.questTarget;

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <ScreenHeader
        title="Shared meals"
        subtitle="Browse plates your squad logged and steal ideas for your next one"
        onBack={() => goTo("home")}
      />

      <div className="relative mb-4 h-36 overflow-hidden rounded-[28px] border border-white/10">
        <div className="grid h-full grid-cols-3 gap-0.5">
          {[FOOD_SHOTS[2], FOOD_SHOTS[1], SAMPLE_MEALS[3].image].map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="h-full w-full object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b14] via-[#0d0b14]/70 to-black/30" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--lime)]">
              Squad cookbook
            </p>
            <p className="font-display text-2xl text-white drop-shadow">
              {squad.mealIdeas.length}/{squad.questTarget} shared
            </p>
          </div>
          <p className="max-w-[8rem] rounded-2xl bg-black/45 px-2.5 py-1.5 text-right text-[11px] font-semibold text-white backdrop-blur-sm">
            {complete
              ? "Cookbook full"
              : `${squad.questTarget - squad.mealIdeas.length} more ideas`}
          </p>
        </div>
      </div>

      <SectionCard className="p-4" glass={false}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--ink-faint)]">
            This week&apos;s shares
          </p>
          <p className="text-xs font-bold text-[var(--ink-muted)]">
            {squad.mealIdeas.length}/{squad.questTarget}
          </p>
        </div>
        <ProgressBar
          className="mt-2"
          value={squad.mealIdeas.length}
          max={squad.questTarget}
          tone="sky"
        />

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--ink)]">
                Season bonus · +$1 grocery
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">
                Hit shared-meal weeks 3 out of 4 this season for an extra dollar
                on your gift card.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--lime)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--ink-on-bright)]">
              +$1
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {[0, 1, 2, 3].map((i) => {
              const done = i < squad.questsCompletedThisSeason;
              const needed = i < 3;
              return (
                <div
                  key={i}
                  className={`h-2.5 flex-1 rounded-full ${
                    done
                      ? "bg-[var(--lime)]"
                      : needed
                        ? "bg-white/15"
                        : "bg-white/8"
                  }`}
                  title={`Week ${i + 1}`}
                />
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-[var(--ink-faint)]">
            {squad.questsCompletedThisSeason >= 3
              ? "Bonus unlocked for this season"
              : `${Math.max(0, 3 - squad.questsCompletedThisSeason)} more week${
                  3 - squad.questsCompletedThisSeason === 1 ? "" : "s"
                } to unlock · ${squad.questsCompletedThisSeason}/4 done`}
          </p>
        </div>
      </SectionCard>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-display text-lg text-[var(--ink)]">Squad cookbook</h2>
        <p className="text-xs text-[var(--ink-faint)]">Live updates</p>
      </div>

      <div className="mt-3 space-y-3">
        {squad.mealIdeas.length === 0 ? (
          <SectionCard className="overflow-hidden p-0" glass={false}>
            <div className="relative h-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FOOD_SHOTS[0]}
                alt=""
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-solid)] to-transparent" />
            </div>
            <p className="px-4 pb-4 text-sm text-[var(--ink-muted)]">
              Empty cookbook. Be the first to drop a plate for {squad.name}.
            </p>
          </SectionCard>
        ) : (
          squad.mealIdeas.map((idea) => {
            const author =
              squad.members.find((m) => m.id === idea.authorId) ?? null;
            return (
              <SectionCard key={idea.id} className="overflow-hidden p-0" glass={false}>
                <div className="relative h-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="font-display text-lg text-white">{idea.title}</p>
                      <p className="text-[11px] text-white/80">
                        {idea.protein}g protein · {idea.dayLabel}
                      </p>
                    </div>
                    <Avatar
                      short={author?.short ?? idea.authorName.slice(0, 2)}
                      color={author?.color ?? "#2F6B4F"}
                      size="sm"
                    />
                  </div>
                </div>
                <p className="px-3.5 py-2.5 text-xs leading-relaxed text-[var(--ink-muted)]">
                  <span className="font-semibold text-[var(--ink)]">{idea.authorName}: </span>
                  {idea.tip}
                </p>
              </SectionCard>
            );
          })
        )}
      </div>

      <div className="mt-5 space-y-2">
        {you.sharedQuestToday ? (
          <>
            <Button className="w-full" variant="soft" disabled>
              You already dropped a plate today
            </Button>
            <Button className="w-full" size="lg" organic onClick={() => goTo("chat")}>
              Talk food in table chat
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            size="lg"
            variant="lime"
            organic
            disabled={loading}
            onClick={() => void shareExistingIdea()}
          >
            Drop a recipe for the squad
          </Button>
        )}
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => goTo("log")}
        >
          Need a meal first? Log a plate
        </Button>
      </div>
    </div>
  );
}
