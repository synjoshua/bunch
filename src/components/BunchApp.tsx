"use client";

import { ChatScreen } from "@/components/screens/ChatScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { JoinScreen } from "@/components/screens/JoinScreen";
import { LogMealScreen } from "@/components/screens/LogMealScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { QuestScreen } from "@/components/screens/QuestScreen";
import { RankScreen } from "@/components/screens/RankScreen";
import { RecapScreen } from "@/components/screens/RecapScreen";
import { WaitingRoomScreen } from "@/components/screens/WaitingRoomScreen";
import { BunchProvider, useBunch } from "@/lib/bunch-context";
import { Camera, ChefHat, Gift, Home, UserRound } from "lucide-react";
import type { ReactNode } from "react";

function Shell() {
  const { screen, goTo, memberId } = useBunch();
  const showNav =
    Boolean(memberId) && screen !== "join" && screen !== "waiting";

  const items: Array<{
    id: string;
    label: string;
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
  }> = [
    {
      id: "home",
      label: "Bunch",
      active: screen === "home" || screen === "chat" || screen === "recap",
      onClick: () => goTo("home"),
      icon: <Home className="h-5 w-5" />,
    },
    {
      id: "quest",
      label: "Cook",
      active: screen === "quest",
      onClick: () => goTo("quest"),
      icon: <ChefHat className="h-5 w-5" />,
    },
    {
      id: "log",
      label: "Log meal",
      active: screen === "log",
      onClick: () => goTo("log"),
      icon: <Camera className="h-5 w-5" />,
    },
    {
      id: "rank",
      label: "Loot",
      active: screen === "rank",
      onClick: () => goTo("rank"),
      icon: <Gift className="h-5 w-5" />,
    },
    {
      id: "profile",
      label: "Profile",
      active: screen === "profile",
      onClick: () => goTo("profile"),
      icon: <UserRound className="h-5 w-5" />,
    },
  ];

  return (
    <div className="phone-shell">
      <div className="phone-scroll">
        {screen === "join" && <JoinScreen />}
        {screen === "waiting" && <WaitingRoomScreen />}
        {screen === "home" && <HomeScreen />}
        {screen === "log" && <LogMealScreen />}
        {screen === "quest" && <QuestScreen />}
        {screen === "rank" && <RankScreen />}
        {screen === "recap" && <RecapScreen />}
        {screen === "chat" && <ChatScreen />}
        {screen === "profile" && <ProfileScreen />}
      </div>

      {showNav ? (
        <nav className="phone-nav" aria-label="Main">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-current={item.active ? "page" : undefined}
              className={`nav-tab${item.active ? " is-active" : ""}`}
            >
              <span className="nav-tab-icon">{item.icon}</span>
              <span className="nav-tab-label">{item.label}</span>
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

export function BunchApp() {
  return (
    <BunchProvider>
      <main className="app-stage">
        <div className="stage-copy">
          <p className="font-display text-4xl text-[var(--lime)]">bunch</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
            A co-op food game: log real plates, share recipes, chat with your
            bunch, and climb ranks together.
          </p>
          <ol className="mt-5 hidden space-y-2 text-sm text-[var(--ink-muted)] md:block">
            <li>1. Everyone joins a bunch in the waiting room</li>
            <li>2. Host starts the demo from /live</li>
            <li>3. Log meals, share, climb to Gold</li>
            <li>4. Watch bunches on the projector</li>
          </ol>
        </div>
        <Shell />
      </main>
    </BunchProvider>
  );
}
