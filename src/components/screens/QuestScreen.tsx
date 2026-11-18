"use client";

import { Avatar, Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import { INITIAL_MEMBERS, QUEST_TARGET } from "@/lib/demo-data";
import { useNori } from "@/lib/nori-context";

export function QuestScreen() {
  const {
    goTo,
    mealIdeas,
    sharedToQuest,
    shareExistingIdea,
    questsCompletedThisSeason,
  } = useNori();

  const memberMap = Object.fromEntries(INITIAL_MEMBERS.map((m) => [m.id, m]));
  const complete = mealIdeas.length >= QUEST_TARGET;

  return (
    <div className="px-5 pb-8 pt-6 animate-rise">
      <ScreenHeader
        title="Recipe Relay"
        subtitle="Share 12 different meal ideas this week"
        onBack={() => goTo("home")}
      />

      <SectionCard className="p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              Squad quest
            </p>
            <p className="mt-1 font-display text-3xl text-[var(--ink)]">
              {mealIdeas.length}
              <span className="text-lg text-[var(--ink-muted)]">
                /{QUEST_TARGET}
              </span>
            </p>
          </div>
          <p className="max-w-[9rem] text-right text-xs text-[var(--ink-muted)]">
            {complete
              ? "Quest complete — bonus on track"
              : `${QUEST_TARGET - mealIdeas.length} ideas to go`}
          </p>
        </div>
        <ProgressBar
          className="mt-3"
          value={mealIdeas.length}
          max={QUEST_TARGET}
          tone="sky"
        />
        <div className="mt-4 rounded-2xl bg-[var(--amber-soft)] px-3.5 py-3">
          <p className="text-sm font-semibold text-[var(--amber-deep)]">
            Quest bonus · +$1
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">
            Finish 3 of 4 weekly quests this season for an extra $1 on the gift
            card. Progress: {questsCompletedThisSeason}
            {complete ? "+1 pending" : ""}/4.
          </p>
        </div>
      </SectionCard>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-semibold text-[var(--ink)]">Squad collection</h2>
        <p className="text-xs text-[var(--ink-faint)]">Useful later, not just a feed</p>
      </div>

      <div className="mt-3 space-y-3">
        {[...mealIdeas].reverse().map((idea) => {
          const author = memberMap[idea.authorId] ?? {
            name: "Friend",
            short: "?",
            color: "#888",
          };
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
                      short={author.short}
                      color={author.color}
                      size="sm"
                    />
                    <p className="truncate text-sm font-semibold text-[var(--ink)]">
                      {idea.title}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">
                    {idea.protein}g protein · {idea.dayLabel} · {author.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--ink)]">
                    {idea.tip}
                  </p>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <div className="mt-5 space-y-2">
        {sharedToQuest ? (
          <Button className="w-full" variant="soft" disabled>
            Already shared today
          </Button>
        ) : (
          <Button className="w-full" size="lg" onClick={shareExistingIdea}>
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
