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
            label="Home"
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
                  <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-[var(--lime)]" />
                ) : null}
              </span>
            }
          />
          <NavBtn
            active={screen === "quest"}
            label="Quest"
            onClick={() => goTo("quest")}
            icon={<Sparkles className="h-4 w-4" />}
          />
          <NavBtn
            active={screen === "rank"}
            label="Rewards"
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
        active ? "text-[var(--lime)]" : "text-[var(--ink-faint)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function BunchApp() {
  return (
    <BunchProvider>
      <main className="app-stage">
        <div className="stage-copy">
          <p className="font-display text-3xl text-[var(--lime)] md:text-4xl">
            bunch
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
            Follow the purple &quot;Do this next&quot; card on Home — it always
            points to the clearest social action.
          </p>
          <ol className="mt-5 hidden space-y-2 text-sm text-[var(--ink-muted)] md:block">
            <li>1. Join with your name</li>
            <li>2. Fill the squad if seats are open</li>
            <li>3. Log lunch / help the quest</li>
            <li>4. Keep the energy in Chat</li>
            <li>5. Watch the class board at /live</li>
          </ol>
        </div>
        <Shell />
      </main>
    </BunchProvider>
  );
}
