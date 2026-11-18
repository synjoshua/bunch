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
        title="Kitchen quest"
        subtitle="Recipe Relay — post real meals your friends can cook later"
        onBack={() => goTo("home")}
      />

      <div className="relative mb-4 h-36 overflow-hidden rounded-[28px] border border-white/10">
        <div className="grid h-full grid-cols-3 gap-0.5">
          {[FOOD_SHOTS[2], FOOD_SHOTS[1], SAMPLE_MEALS[3].image].map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="h-full w-full object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#12101c] via-[#12101c]/40 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--peach)]">
              Recipe Relay
            </p>
            <p className="font-display text-2xl text-white">
              {squad.mealIdeas.length}/{squad.questTarget} plates
            </p>
          </div>
          <p className="max-w-[7.5rem] text-right text-[11px] font-semibold text-white/80">
            {complete
              ? "Quest complete"
              : `${squad.questTarget - squad.mealIdeas.length} more to cook`}
          </p>
        </div>
      </div>

      <SectionCard className="p-4" glass={false}>
        <ProgressBar
          value={squad.mealIdeas.length}
          max={squad.questTarget}
          tone="sky"
        />
        <div className="lime-blob mt-4 px-3.5 py-3">
          <p className="text-sm font-extrabold text-[var(--ink-on-bright)]">
            Quest bonus · +$1 grocery
          </p>
          <p className="muted mt-1 text-xs leading-relaxed">
            Finish 3 of 4 weekly kitchen quests this season for an extra $1.
            Progress: {squad.questsCompletedThisSeason}/4.
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
