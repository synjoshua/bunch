"use client";

import { ChatScreen } from "@/components/screens/ChatScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { JoinScreen } from "@/components/screens/JoinScreen";
import { LogMealScreen } from "@/components/screens/LogMealScreen";
import { QuestScreen } from "@/components/screens/QuestScreen";
import { RankScreen } from "@/components/screens/RankScreen";
import { RecapScreen } from "@/components/screens/RecapScreen";
import { BunchProvider, useBunch } from "@/lib/bunch-context";
import { Camera, Gift, Home, MessageCircle, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

function GooeySvgDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: "absolute" }}
    >
      <defs>
        <filter id="bunch-gooey" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

function Shell() {
  const { screen, goTo, memberId, squad, you } = useBunch();
  const showNav = Boolean(memberId) && screen !== "join";
  const chatCount = squad?.messages.filter((m) => m.kind === "chat").length ?? 0;
  const needsMeal = Boolean(you && !you.mealLogged);

  const items: Array<{
    id: string;
    label: string;
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    badge?: boolean;
    primary?: boolean;
  }> = [
    {
      id: "home",
      label: "Table",
      active: screen === "home" || screen === "recap",
      onClick: () => goTo("home"),
      icon: <Home />,
    },
    {
      id: "chat",
      label: "Chat",
      active: screen === "chat",
      onClick: () => goTo("chat"),
      icon: <MessageCircle />,
      badge: chatCount > 0 && screen !== "chat",
    },
    {
      id: "log",
      label: "Log meal",
      active: screen === "log",
      onClick: () => goTo("log"),
      icon: <Camera />,
      primary: true,
    },
    {
      id: "quest",
      label: "Cook",
      active: screen === "quest",
      onClick: () => goTo("quest"),
      icon: <Sparkles />,
    },
    {
      id: "rank",
      label: "Loot",
      active: screen === "rank",
      onClick: () => goTo("rank"),
      icon: <Gift />,
    },
  ];

  return (
    <div className="phone-shell">
      <GooeySvgDefs />
      <div className="phone-notch" aria-hidden />
      <div className="phone-scroll">
        {screen === "join" && <JoinScreen />}
        {screen === "home" && <HomeScreen />}
        {screen === "log" && <LogMealScreen />}
        {screen === "quest" && <QuestScreen />}
        {screen === "rank" && <RankScreen />}
        {screen === "recap" && <RecapScreen />}
        {screen === "chat" && <ChatScreen />}
      </div>

      {showNav ? (
        <nav className="phone-nav" aria-label="Main">
          <div className="gooey-nav">
            <div className="gooey-nav-blobs" aria-hidden>
              {items.map((item) => (
                <span
                  key={item.id}
                  className={`gooey-nav-blob${item.primary ? " gooey-nav-blob-primary" : ""}`}
                />
              ))}
            </div>
            <div className="gooey-nav-items">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  aria-current={item.active ? "page" : undefined}
                  className={`gooey-nav-btn${item.active ? " is-active" : ""}${
                    item.primary ? " is-log" : ""
                  }${item.primary && needsMeal && screen !== "log" ? " is-log-pulse" : ""}`}
                  onClick={item.onClick}
                >
                  {item.icon}
                  {item.primary ? (
                    <span className="gooey-nav-log-label">Log</span>
                  ) : null}
                  {item.badge ? <span className="gooey-nav-dot" /> : null}
                </button>
              ))}
            </div>
          </div>
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
            A co-op food game: log real plates, share recipes, chat at the table,
            and climb ranks with your squad.
          </p>
          <ol className="mt-5 hidden space-y-2 text-sm text-[var(--ink-muted)] md:block">
            <li>1. Sit down with your name</li>
            <li>2. Tap the green Log button</li>
            <li>3. Photo food, quest, and chat</li>
            <li>4. Watch the room cook on /live</li>
          </ol>
        </div>
        <Shell />
      </main>
    </BunchProvider>
  );
}
