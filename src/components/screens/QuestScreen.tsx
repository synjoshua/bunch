"use client";

import { Avatar, Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import { useNori } from "@/lib/nori-context";

export function QuestScreen() {
  const {
    goTo,
    squad,
    you,
    shareExistingIdea,
    loading,
  } = useNori();

  if (!squad || !you) return null;

  const complete = squad.mealIdeas.length >= squad.questTarget;

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <ScreenHeader
        title="Recipe Relay"
        subtitle="Share meal ideas your squad can reuse"
        onBack={() => goTo("home")}
      />

      <SectionCard className="p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              Squad quest
            </p>
            <p className="mt-1 font-display text-3xl text-[var(--ink)]">
              {squad.mealIdeas.length}
              <span className="text-lg text-[var(--ink-muted)]">
                /{squad.questTarget}
              </span>
            </p>
          </div>
          <p className="max-w-[9rem] text-right text-xs text-[var(--ink-muted)]">
            {complete
              ? "Quest complete — bonus on track"
              : `${squad.questTarget - squad.mealIdeas.length} ideas to go`}
          </p>
        </div>
        <ProgressBar
          className="mt-3"
          value={squad.mealIdeas.length}
          max={squad.questTarget}
          tone="sky"
        />
        <div className="mt-4 rounded-2xl bg-[var(--amber-soft)] px-3.5 py-3">
          <p className="text-sm font-semibold text-[var(--amber-deep)]">
            Quest bonus · +$1
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">
            Finish 3 of 4 weekly quests this season for an extra $1.
            Progress: {squad.questsCompletedThisSeason}/4.
          </p>
        </div>
      </SectionCard>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--ink)]">Squad collection</h2>
        <p className="text-xs text-[var(--ink-faint)]">Updates live</p>
      </div>

      <div className="mt-3 space-y-3">
        {squad.mealIdeas.length === 0 ? (
          <SectionCard className="p-4 text-sm text-[var(--ink-muted)]">
            No meal ideas yet. Be the first to share one for {squad.name}.
          </SectionCard>
        ) : (
          squad.mealIdeas.map((idea) => {
            const author =
              squad.members.find((m) => m.id === idea.authorId) ?? null;
            return (
              <SectionCard key={idea.id} className="overflow-hidden">
                <div className="flex gap-3 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Avatar
                        short={author?.short ?? idea.authorName.slice(0, 2)}
                        color={author?.color ?? "#2F6B4F"}
                        size="sm"
                      />
                      <p className="truncate text-sm font-semibold text-[var(--ink)]">
                        {idea.title}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-[var(--ink-muted)]">
                      {idea.protein}g protein · {idea.dayLabel} ·{" "}
                      {idea.authorName}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--ink)]">
                      {idea.tip}
                    </p>
                  </div>
                </div>
              </SectionCard>
            );
          })
        )}
      </div>

      <div className="mt-5 space-y-2">
        {you.sharedQuestToday ? (
          <Button className="w-full" variant="soft" disabled>
            Already shared today
          </Button>
        ) : (
          <Button
            className="w-full"
            size="lg"
            disabled={loading}
            onClick={() => void shareExistingIdea()}
          >
            Share a meal idea
          </Button>
        )}
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => goTo("log")}
        >
          Log a meal instead
        </Button>
      </div>
    </div>
  );
}
