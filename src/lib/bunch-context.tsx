"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_SESSION_CODE,
  SAMPLE_MEALS,
  type Member,
  type SquadView,
} from "./types";

export type Screen =
  | "join"
  | "home"
  | "log"
  | "quest"
  | "rank"
  | "recap"
  | "chat";

type SessionStats = {
  humanCount: number;
  squadCount: number;
  capacityHint: string;
};

type BunchState = {
  screen: Screen;
  loading: boolean;
  error: string | null;
  sessionCode: string;
  memberId: string | null;
  you: Member | null;
  squad: SquadView | null;
  sessionStats: SessionStats | null;
  goTo: (screen: Screen) => void;
  joinSquad: (name: string, code?: string) => Promise<void>;
  saveMeal: (opts: {
    shareToQuest: boolean;
    protein: number;
    name: string;
    imageDataUrl?: string;
  }) => Promise<void>;
  shareExistingIdea: () => Promise<void>;
  sendChat: (text: string) => Promise<void>;
  startNextWeek: () => Promise<void>;
  leaveSession: () => void;
  refresh: () => Promise<void>;
};

const STORAGE_KEY = "bunch-demo-identity";

const BunchContext = createContext<BunchState | null>(null);

async function parseJson(res: Response) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function BunchProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("join");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState(DEFAULT_SESSION_CODE);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [you, setYou] = useState<Member | null>(null);
  const [squad, setSquad] = useState<SquadView | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);

  const applyState = useCallback(
    (data: {
      sessionCode: string;
      you: Member;
      squad: SquadView;
      sessionStats: SessionStats;
    }) => {
      setSessionCode(data.sessionCode);
      setYou(data.you);
      setSquad(data.squad);
      setSessionStats(data.sessionStats);
      setMemberId(data.you.id);
      setError(null);
    },
    [],
  );

  const refresh = useCallback(async () => {
    if (!memberId) return;
    try {
      const res = await fetch(
        `/api/state?session=${encodeURIComponent(sessionCode)}&memberId=${encodeURIComponent(memberId)}`,
      );
      const data = await parseJson(res);
      applyState(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not refresh");
    }
  }, [applyState, memberId, sessionCode]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        sessionCode: string;
        memberId: string;
      };
      if (!saved.memberId || !saved.sessionCode) return;
      setSessionCode(saved.sessionCode);
      setMemberId(saved.memberId);
      setLoading(true);
      fetch(
        `/api/state?session=${encodeURIComponent(saved.sessionCode)}&memberId=${encodeURIComponent(saved.memberId)}`,
      )
        .then(parseJson)
        .then((data) => {
          applyState(data);
          setScreen("home");
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setMemberId(null);
        })
        .finally(() => setLoading(false));
    } catch {
      // ignore
    }
  }, [applyState]);

  useEffect(() => {
    if (!memberId || screen === "join") return;
    const id = window.setInterval(() => {
      void refresh();
    }, 2000);
    return () => window.clearInterval(id);
  }, [memberId, refresh, screen]);

  const goTo = useCallback((next: Screen) => setScreen(next), []);

  const joinSquad = useCallback(
    async (name: string, code = DEFAULT_SESSION_CODE) => {
      setLoading(true);
      setError(null);
      try {
        const joinRes = await fetch("/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, sessionCode: code }),
        });
        const joined = await parseJson(joinRes);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            sessionCode: joined.sessionCode,
            memberId: joined.memberId,
          }),
        );
        setSessionCode(joined.sessionCode);
        setMemberId(joined.memberId);
        const stateRes = await fetch(
          `/api/state?session=${encodeURIComponent(joined.sessionCode)}&memberId=${encodeURIComponent(joined.memberId)}`,
        );
        const state = await parseJson(stateRes);
        applyState(state);
        setScreen("home");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Join failed");
      } finally {
        setLoading(false);
      }
    },
    [applyState],
  );

  const saveMeal = useCallback(
    async (opts: {
      shareToQuest: boolean;
      protein: number;
      name: string;
      imageDataUrl?: string;
    }) => {
      if (!memberId) return;
      setLoading(true);
      try {
        const res = await fetch("/api/meal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionCode,
            memberId,
            mealName: opts.name,
            protein: opts.protein,
            shareToQuest: opts.shareToQuest,
            imageDataUrl: opts.imageDataUrl,
          }),
        });
        const data = await parseJson(res);
        applyState(data);
        setScreen("home");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save meal");
      } finally {
        setLoading(false);
      }
    },
    [applyState, memberId, sessionCode],
  );

  const shareExistingIdea = useCallback(async () => {
    if (!memberId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionCode, memberId }),
      });
      const data = await parseJson(res);
      applyState(data);
      setScreen("chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not share idea");
    } finally {
      setLoading(false);
    }
  }, [applyState, memberId, sessionCode]);

  const sendChat = useCallback(
    async (text: string) => {
      if (!memberId) return;
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionCode, memberId, text }),
        });
        const data = await parseJson(res);
        applyState(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not send");
      } finally {
        setLoading(false);
      }
    },
    [applyState, memberId, sessionCode],
  );

  const startNextWeek = useCallback(async () => {
    if (!memberId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionCode, memberId }),
      });
      const data = await parseJson(res);
      applyState(data);
      setScreen("home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not advance week");
    } finally {
      setLoading(false);
    }
  }, [applyState, memberId, sessionCode]);

  const leaveSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setMemberId(null);
    setYou(null);
    setSquad(null);
    setSessionStats(null);
    setScreen("join");
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      screen,
      loading,
      error,
      sessionCode,
      memberId,
      you,
      squad,
      sessionStats,
      goTo,
      joinSquad,
      saveMeal,
      shareExistingIdea,
      sendChat,
      startNextWeek,
      leaveSession,
      refresh,
    }),
    [
      screen,
      loading,
      error,
      sessionCode,
      memberId,
      you,
      squad,
      sessionStats,
      goTo,
      joinSquad,
      saveMeal,
      shareExistingIdea,
      sendChat,
      startNextWeek,
      leaveSession,
      refresh,
    ],
  );

  return <BunchContext.Provider value={value}>{children}</BunchContext.Provider>;
}

export function useBunch() {
  const ctx = useContext(BunchContext);
  if (!ctx) throw new Error("useBunch must be used within BunchProvider");
  return ctx;
}

export const DEMO_LUNCH = SAMPLE_MEALS[0];
