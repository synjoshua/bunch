"use client";

import { ChatScreen } from "@/components/screens/ChatScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { JoinScreen } from "@/components/screens/JoinScreen";
import { LogMealScreen } from "@/components/screens/LogMealScreen";
import { QuestScreen } from "@/components/screens/QuestScreen";
import { RankScreen } from "@/components/screens/RankScreen";
import { RecapScreen } from "@/components/screens/RecapScreen";
import { BunchProvider, useBunch } from "@/lib/bunch-context";
import { Gift, Home, MessageCircle, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

function Shell() {
  const { screen, goTo, memberId, squad } = useBunch();
  const showNav = Boolean(memberId) && screen !== "join" && screen !== "log";
  const chatCount = squad?.messages.filter((m) => m.kind === "chat").length ?? 0;

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
        {screen === "chat" && <ChatScreen />}
      </div>

      {showNav ? (
        <nav className="phone-nav">
          <NavBtn
            active={screen === "home" || screen === "recap"}
            label="Table"
            onClick={() => goTo("home")}
            icon={<Home className="h-4 w-4" />}
          />
          <NavBtn
            active={screen === "chat"}
            label="Chat"
            onClick={() => goTo("chat")}
            icon={
              <span className="relative">
                <MessageCircle className="h-4 w-4" />
                {chatCount > 0 && screen !== "chat" ? (
                  <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-[var(--peach)]" />
                ) : null}
              </span>
            }
          />
          <NavBtn
            active={screen === "quest"}
            label="Cook"
            onClick={() => goTo("quest")}
            icon={<Sparkles className="h-4 w-4" />}
          />
          <NavBtn
            active={screen === "rank"}
            label="Loot"
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
      className={`flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-bold transition ${
        active ? "text-[var(--ink-on-bright)]" : "text-[var(--ink-faint)]"
      }`}
    >
      <span className={active ? "nav-active-pill" : "inline-flex h-9 w-9 items-center justify-center"}>
        {icon}
      </span>
      <span className={active ? "text-[var(--lime)]" : undefined}>{label}</span>
    </button>
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
            <li>2. Follow the lime mission card</li>
            <li>3. Log food, quest, and chat</li>
            <li>4. Watch the room cook on /live</li>
          </ol>
        </div>
        <Shell />
      </main>
    </BunchProvider>
  );
}
