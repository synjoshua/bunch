"use client";

import { HomeScreen } from "@/components/screens/HomeScreen";
import { JoinScreen } from "@/components/screens/JoinScreen";
import { LogMealScreen } from "@/components/screens/LogMealScreen";
import { QuestScreen } from "@/components/screens/QuestScreen";
import { RankScreen } from "@/components/screens/RankScreen";
import { RecapScreen } from "@/components/screens/RecapScreen";
import { NoriProvider, useNori } from "@/lib/nori-context";
import { Gift, Home, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

function Shell() {
  const { screen, goTo, joined } = useNori();

  const showNav =
    joined && screen !== "join" && screen !== "log";

  return (
    <div className="phone-shell">
      <div className="phone-notch" aria-hidden />
      <div className="phone-scroll">
        {screen === "join" && <JoinScreen />}
        {screen === "home" && <HomeScreen />}
        {screen === "log" && <LogMealScreen />}
        {screen === "quest" && <QuestScreen />}
        {screen === "rank" && <RankScreen />}
        {screen === "recap" && <RecapScreen />}
      </div>

      {showNav ? (
        <nav className="phone-nav">
          <NavBtn
            active={screen === "home" || screen === "recap"}
            label="Home"
            onClick={() => goTo("home")}
            icon={<Home className="h-4 w-4" />}
          />
          <NavBtn
            active={screen === "quest"}
            label="Quest"
            onClick={() => goTo("quest")}
            icon={<Sparkles className="h-4 w-4" />}
          />
          <NavBtn
            active={screen === "rank"}
            label="Rank"
            onClick={() => goTo("rank")}
            icon={<Gift className="h-4 w-4" />}
          />
        </nav>
      ) : null}
    </div>
  );
}

function NavBtn({
  active,
  label,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold transition ${
        active ? "text-[var(--leaf-deep)]" : "text-[var(--ink-faint)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function NoriApp() {
  return (
    <NoriProvider>
      <main className="app-stage">
        <div className="stage-copy">
          <p className="font-display text-3xl text-[var(--leaf-deep)] md:text-4xl">
            nori
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
            Social nutrition prototype — log a meal, help your squad, finish the
            quest, and see why consistency earns the reward.
          </p>
          <ol className="mt-5 hidden space-y-2 text-sm text-[var(--ink-muted)] md:block">
            <li>1. Join Protein Pod</li>
            <li>2. Log lunch (share to quest)</li>
            <li>3. Watch goal-days & quest move</li>
            <li>4. Check rank reward preview</li>
            <li>5. Open the weekly recap</li>
          </ol>
        </div>
        <Shell />
      </main>
    </NoriProvider>
  );
}
