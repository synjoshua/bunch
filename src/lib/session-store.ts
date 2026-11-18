import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import {
  AVATAR_COLORS,
  DEFAULT_PROTEIN_TARGET,
  DEFAULT_SESSION_CODE,
  GOAL_DAYS_PER_PERSON,
  QUEST_TARGET,
  SAMPLE_MEALS,
  SQUAD_MAX,
  SQUAD_NAMES,
  SQUAD_SIZE,
  initials,
  rankForPoints,
  type ChatMessage,
  type LiveSquadCard,
  type MealIdea,
  type Member,
  type Session,
  type Squad,
  type SquadView,
} from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "sessions.json");

type StoreFile = {
  sessions: Record<string, Session>;
};

declare global {
  // eslint-disable-next-line no-var
  var __bunchStore: StoreFile | undefined;
}

function emptyStore(): StoreFile {
  return { sessions: {} };
}

function loadStore(): StoreFile {
  if (global.__bunchStore) return global.__bunchStore;
  try {
    if (existsSync(DATA_FILE)) {
      const parsed = JSON.parse(readFileSync(DATA_FILE, "utf8")) as StoreFile;
      global.__bunchStore = parsed;
      return parsed;
    }
  } catch {
    // fall through
  }
  const store = emptyStore();
  global.__bunchStore = store;
  return store;
}

function saveStore(store: StoreFile) {
  global.__bunchStore = store;
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

function normalizeCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12) || DEFAULT_SESSION_CODE;
}

function ensureSession(code: string): Session {
  const store = loadStore();
  const key = normalizeCode(code);
  if (!store.sessions[key]) {
    store.sessions[key] = {
      code: key,
      createdAt: Date.now(),
      members: {},
      squads: {},
    };
    saveStore(store);
  }
  return store.sessions[key];
}

function touch(session: Session) {
  const store = loadStore();
  store.sessions[session.code] = session;
  saveStore(store);
}

function nextSquadName(session: Session) {
  const used = new Set(Object.values(session.squads).map((s) => s.name));
  const available = SQUAD_NAMES.find((n) => !used.has(n));
  if (available) return available;
  return `Squad ${Object.keys(session.squads).length + 1}`;
}

function weeklyTargetFor(squad: Squad, session: Session) {
  const members = squad.memberIds
    .map((id) => session.members[id])
    .filter(Boolean);
  return members.reduce((sum, m) => sum + m.goalDaysPlanned, 0);
}

function weeklyDoneFor(squad: Squad, session: Session) {
  const members = squad.memberIds
    .map((id) => session.members[id])
    .filter(Boolean);
  return members.reduce((sum, m) => sum + m.goalDaysDone, 0);
}

function findOpenSquad(session: Session): Squad | null {
  const open = Object.values(session.squads).filter(
    (s) => s.open && s.memberIds.length < SQUAD_SIZE,
  );
  open.sort((a, b) => b.memberIds.length - a.memberIds.length);
  return open[0] ?? null;
}

function ensureMessages(squad: Squad) {
  if (!Array.isArray(squad.messages)) squad.messages = [];
  return squad.messages;
}

function pushMessage(
  squad: Squad,
  message: Omit<ChatMessage, "id" | "createdAt"> & { createdAt?: number },
) {
  const messages = ensureMessages(squad);
  messages.push({
    id: randomUUID(),
    createdAt: message.createdAt ?? Date.now(),
    authorId: message.authorId,
    authorName: message.authorName,
    authorShort: message.authorShort,
    authorColor: message.authorColor,
    text: message.text,
    kind: message.kind,
  });
  if (messages.length > 80) {
    squad.messages = messages.slice(-80);
  }
}

function createSquad(session: Session): Squad {
  const squad: Squad = {
    id: randomUUID(),
    name: nextSquadName(session),
    memberIds: [],
    mealIdeas: [],
    messages: [
      {
        id: randomUUID(),
        authorId: "system",
        authorName: "bunch",
        authorShort: "B",
        authorColor: "#5B50E8",
        text: "Squad chat is live — hype check-ins, meal tips, and quest wins here.",
        kind: "system",
        createdAt: Date.now(),
      },
    ],
    rankPoints: 12,
    seasonWeeksHit: 2,
    questsCompletedThisSeason: 2,
    weekNumber: 3,
    open: true,
  };
  session.squads[squad.id] = squad;
  return squad;
}

function assignToSquad(session: Session, member: Member) {
  let squad = findOpenSquad(session);
  if (!squad) squad = createSquad(session);
  squad.memberIds.push(member.id);
  member.squadId = squad.id;
  pushMessage(squad, {
    authorId: "system",
    authorName: "bunch",
    authorShort: "B",
    authorColor: "#5B50E8",
    text: `${member.name} joined ${squad.name}. Welcome to the bunch.`,
    kind: "system",
  });
  if (squad.memberIds.length >= SQUAD_SIZE) squad.open = false;
  // Keep open until SQUAD_SIZE; allow late joiners up to SQUAD_MAX via reopen if under max
  if (squad.memberIds.length < SQUAD_MAX && squad.memberIds.length >= SQUAD_SIZE) {
    // closed at target size; presenter can still fill bots into open slots below
  }
}

export function joinSession(rawCode: string, rawName: string) {
  const session = ensureSession(rawCode || DEFAULT_SESSION_CODE);
  const name = rawName.trim().slice(0, 24);
  if (name.length < 2) {
    throw new Error("Name needs at least 2 characters.");
  }

  const existing = Object.values(session.members).find(
    (m) => !m.isBot && m.name.toLowerCase() === name.toLowerCase(),
  );
  if (existing) {
    existing.lastSeenAt = Date.now();
    touch(session);
    return { sessionCode: session.code, memberId: existing.id, resumed: true };
  }

  const color =
    AVATAR_COLORS[Object.keys(session.members).length % AVATAR_COLORS.length];
  const member: Member = {
    id: randomUUID(),
    name,
    short: initials(name),
    color,
    squadId: null,
    isBot: false,
    proteinTarget: DEFAULT_PROTEIN_TARGET,
    personalProtein: 82,
    goalDayComplete: false,
    goalDaysDone: 3,
    goalDaysPlanned: GOAL_DAYS_PER_PERSON,
    sharedQuestToday: false,
    mealLogged: false,
    weeksParticipated: 2,
    joinedAt: Date.now(),
    lastSeenAt: Date.now(),
  };
  session.members[member.id] = member;
  assignToSquad(session, member);
  touch(session);
  return { sessionCode: session.code, memberId: member.id, resumed: false };
}

function toSquadView(session: Session, squad: Squad, youId: string): SquadView {
  const members = squad.memberIds
    .map((id) => session.members[id])
    .filter(Boolean)
    .map((m) => ({
      id: m.id,
      name: m.name,
      short: m.short,
      color: m.color,
      isYou: m.id === youId,
      isBot: m.isBot,
      checkedInToday: m.mealLogged || m.goalDayComplete,
      goalDaysDone: m.goalDaysDone,
      goalDaysPlanned: m.goalDaysPlanned,
      personalProtein: m.personalProtein,
      proteinTarget: m.proteinTarget,
      goalDayComplete: m.goalDayComplete,
    }));

  return {
    id: squad.id,
    name: squad.name,
    members,
    weeklyGoalDays: weeklyDoneFor(squad, session),
    weeklyGoalTarget: Math.max(
      weeklyTargetFor(squad, session),
      members.length * GOAL_DAYS_PER_PERSON,
    ),
    mealIdeas: [...squad.mealIdeas].sort((a, b) => b.createdAt - a.createdAt),
    messages: [...ensureMessages(squad)].sort((a, b) => a.createdAt - b.createdAt),
    questTarget: QUEST_TARGET,
    rankPoints: squad.rankPoints,
    seasonWeeksHit: squad.seasonWeeksHit,
    questsCompletedThisSeason: squad.questsCompletedThisSeason,
    weekNumber: squad.weekNumber,
    open: squad.open,
  };
}

export function getMemberState(sessionCode: string, memberId: string) {
  const session = ensureSession(sessionCode);
  const member = session.members[memberId];
  if (!member) throw new Error("Member not found. Join again.");
  member.lastSeenAt = Date.now();

  if (!member.squadId || !session.squads[member.squadId]) {
    assignToSquad(session, member);
  }
  const squad = session.squads[member.squadId!];
  touch(session);

  const humanCount = Object.values(session.members).filter((m) => !m.isBot).length;
  const squadCount = Object.keys(session.squads).length;

  return {
    sessionCode: session.code,
    you: member,
    squad: toSquadView(session, squad, member.id),
    sessionStats: {
      humanCount,
      squadCount,
      capacityHint: `Squads of ${SQUAD_SIZE} · up to ~${SQUAD_MAX}`,
    },
  };
}

export function logMeal(input: {
  sessionCode: string;
  memberId: string;
  mealName: string;
  protein: number;
  shareToQuest: boolean;
}) {
  const session = ensureSession(input.sessionCode);
  const member = session.members[input.memberId];
  if (!member || !member.squadId) throw new Error("Member not found.");
  const squad = session.squads[member.squadId];
  if (!squad) throw new Error("Squad not found.");

  const protein = Math.max(1, Math.min(80, Math.round(input.protein)));
  member.personalProtein = Math.min(
    member.proteinTarget + 40,
    member.personalProtein + protein,
  );
  member.mealLogged = true;

  if (!member.goalDayComplete && member.personalProtein >= member.proteinTarget) {
    member.goalDayComplete = true;
    member.goalDaysDone = Math.min(
      member.goalDaysPlanned,
      member.goalDaysDone + 1,
    );
  }

  const mealTitle = input.mealName.trim() || SAMPLE_MEALS[0].name;
  pushMessage(squad, {
    authorId: member.id,
    authorName: member.name,
    authorShort: member.short,
    authorColor: member.color,
    text: member.goalDayComplete
      ? `Logged ${mealTitle} (+${protein}g) and finished today's goal-day.`
      : `Logged ${mealTitle} (+${protein}g protein).`,
    kind: "meal",
  });

  if (input.shareToQuest && !member.sharedQuestToday) {
    member.sharedQuestToday = true;
    const sample = SAMPLE_MEALS[0];
    const idea: MealIdea = {
      id: randomUUID(),
      authorId: member.id,
      authorName: member.name,
      title: mealTitle,
      protein,
      tip: sample.tip,
      image: sample.image,
      dayLabel: "Today",
      createdAt: Date.now(),
    };
    squad.mealIdeas.push(idea);
    pushMessage(squad, {
      authorId: "system",
      authorName: "bunch",
      authorShort: "B",
      authorColor: "#5B50E8",
      text: `${member.name} shared a meal idea to Recipe Relay (${squad.mealIdeas.length}/${QUEST_TARGET}).`,
      kind: "system",
    });
    if (squad.mealIdeas.length >= QUEST_TARGET) {
      squad.questsCompletedThisSeason = Math.min(
        4,
        squad.questsCompletedThisSeason + 1,
      );
    }
  }

  touch(session);
  return getMemberState(session.code, member.id);
}

export function shareIdea(sessionCode: string, memberId: string) {
  const session = ensureSession(sessionCode);
  const member = session.members[memberId];
  if (!member || !member.squadId) throw new Error("Member not found.");
  const squad = session.squads[member.squadId];
  if (!squad) throw new Error("Squad not found.");
  if (member.sharedQuestToday) {
    return getMemberState(session.code, memberId);
  }

  const sample = SAMPLE_MEALS[squad.mealIdeas.length % SAMPLE_MEALS.length];
  member.sharedQuestToday = true;
  squad.mealIdeas.push({
    id: randomUUID(),
    authorId: member.id,
    authorName: member.name,
    title: sample.name,
    protein: sample.protein,
    tip: sample.tip,
    image: sample.image,
    dayLabel: "Today",
    createdAt: Date.now(),
  });
  pushMessage(squad, {
    authorId: member.id,
    authorName: member.name,
    authorShort: member.short,
    authorColor: member.color,
    text: `Shared ${sample.name} to the Recipe Relay (${squad.mealIdeas.length}/${QUEST_TARGET}). Tip: ${sample.tip}`,
    kind: "meal",
  });
  touch(session);
  return getMemberState(session.code, memberId);
}

export function fillDemoTeammates(sessionCode: string, memberId: string) {
  const session = ensureSession(sessionCode);
  const member = session.members[memberId];
  if (!member || !member.squadId) throw new Error("Member not found.");
  const squad = session.squads[member.squadId];
  if (!squad) throw new Error("Squad not found.");

  const botNames = ["Maya", "Leo", "Sam", "Jordan", "Avery"];
  let i = 0;
  while (squad.memberIds.length < SQUAD_SIZE && i < botNames.length) {
    const botName = botNames[i++];
    if (
      squad.memberIds.some(
        (id) => session.members[id]?.name.toLowerCase() === botName.toLowerCase(),
      )
    ) {
      continue;
    }
    const bot: Member = {
      id: randomUUID(),
      name: botName,
      short: initials(botName),
      color: AVATAR_COLORS[(squad.memberIds.length + i) % AVATAR_COLORS.length],
      squadId: squad.id,
      isBot: true,
      proteinTarget: DEFAULT_PROTEIN_TARGET,
      personalProtein: 120,
      goalDayComplete: true,
      goalDaysDone: 3 + (i % 2),
      goalDaysPlanned: GOAL_DAYS_PER_PERSON,
      sharedQuestToday: true,
      mealLogged: true,
      weeksParticipated: 2,
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
    };
    session.members[bot.id] = bot;
    squad.memberIds.push(bot.id);
    pushMessage(squad, {
      authorId: "system",
      authorName: "bunch",
      authorShort: "B",
      authorColor: "#5B50E8",
      text: `${bot.name} hopped into the chat.`,
      kind: "system",
      createdAt: Date.now() - (20 - i) * 60000,
    });

    const sample = SAMPLE_MEALS[i % SAMPLE_MEALS.length];
    if (squad.mealIdeas.length < 8) {
      squad.mealIdeas.push({
        id: randomUUID(),
        authorId: bot.id,
        authorName: bot.name,
        title: sample.name,
        protein: sample.protein,
        tip: sample.tip,
        image: sample.image,
        dayLabel: ["Mon", "Tue", "Wed", "Thu"][i % 4],
        createdAt: Date.now() - i * 1000,
      });
    }
  }

  if (squad.memberIds.length >= SQUAD_SIZE) squad.open = false;
  // Seed quest closer to the brief's 8/12 when filling demo friends
  while (squad.mealIdeas.length < 8) {
    const sample = SAMPLE_MEALS[squad.mealIdeas.length % SAMPLE_MEALS.length];
    squad.mealIdeas.push({
      id: randomUUID(),
      authorId: member.id,
      authorName: "Squad",
      title: sample.name,
      protein: sample.protein,
      tip: sample.tip,
      image: sample.image,
      dayLabel: "Earlier",
      createdAt: Date.now() - 5000,
    });
  }

  const bots = squad.memberIds
    .map((id) => session.members[id])
    .filter((m) => m && m.isBot);
  if (bots[0]) {
    pushMessage(squad, {
      authorId: bots[0].id,
      authorName: bots[0].name,
      authorShort: bots[0].short,
      authorColor: bots[0].color,
      text: "Who's meal-prepping tonight? Drop ideas in the quest.",
      kind: "chat",
      createdAt: Date.now() - 8 * 60000,
    });
  }
  if (bots[1]) {
    pushMessage(squad, {
      authorId: bots[1].id,
      authorName: bots[1].name,
      authorShort: bots[1].short,
      authorColor: bots[1].color,
      text: "I hit my protein with leftover chili — easy win.",
      kind: "chat",
      createdAt: Date.now() - 5 * 60000,
    });
  }
  if (bots[2]) {
    pushMessage(squad, {
      authorId: bots[2].id,
      authorName: bots[2].name,
      authorShort: bots[2].short,
      authorColor: bots[2].color,
      text: "We're close on Recipe Relay. One more idea each?",
      kind: "chat",
      createdAt: Date.now() - 2 * 60000,
    });
  }

  touch(session);
  return getMemberState(session.code, memberId);
}

export function postChat(input: {
  sessionCode: string;
  memberId: string;
  text: string;
}) {
  const session = ensureSession(input.sessionCode);
  const member = session.members[input.memberId];
  if (!member || !member.squadId) throw new Error("Member not found.");
  const squad = session.squads[member.squadId];
  if (!squad) throw new Error("Squad not found.");

  const text = input.text.trim().slice(0, 280);
  if (text.length < 1) throw new Error("Message can’t be empty.");

  pushMessage(squad, {
    authorId: member.id,
    authorName: member.name,
    authorShort: member.short,
    authorColor: member.color,
    text,
    kind: "chat",
  });
  member.lastSeenAt = Date.now();
  touch(session);
  return getMemberState(session.code, member.id);
}

export function advanceWeek(sessionCode: string, memberId: string) {
  const session = ensureSession(sessionCode);
  const member = session.members[memberId];
  if (!member || !member.squadId) throw new Error("Member not found.");
  const squad = session.squads[member.squadId];
  if (!squad) throw new Error("Squad not found.");

  const target = weeklyTargetFor(squad, session) || SQUAD_SIZE * GOAL_DAYS_PER_PERSON;
  const done = weeklyDoneFor(squad, session);
  const pct = done / target;
  if (pct >= 0.75) {
    squad.seasonWeeksHit = Math.min(4, squad.seasonWeeksHit + 1);
    squad.rankPoints += 4;
  }
  if (squad.mealIdeas.length >= QUEST_TARGET) {
    squad.questsCompletedThisSeason = Math.min(
      4,
      squad.questsCompletedThisSeason + 1,
    );
  }
  if (member.mealLogged || member.goalDayComplete) {
    member.weeksParticipated = Math.min(4, member.weeksParticipated + 1);
  }

  // Reset daily-ish fields for next week simulation
  for (const id of squad.memberIds) {
    const m = session.members[id];
    if (!m) continue;
    m.personalProtein = m.isBot ? m.proteinTarget : 40;
    m.goalDayComplete = m.isBot;
    m.mealLogged = m.isBot;
    m.sharedQuestToday = false;
    m.goalDaysDone = 0;
  }
  squad.mealIdeas = [];
  squad.weekNumber = Math.min(4, squad.weekNumber + 1);
  touch(session);
  return getMemberState(session.code, memberId);
}

export function getLiveBoard(sessionCode: string): {
  sessionCode: string;
  humanCount: number;
  squadCount: number;
  squads: LiveSquadCard[];
} {
  const session = ensureSession(sessionCode);
  const squads = Object.values(session.squads)
    .map((squad) => {
      const members = squad.memberIds
        .map((id) => session.members[id])
        .filter(Boolean);
      const humans = members.filter((m) => !m.isBot);
      const rank = rankForPoints(squad.rankPoints);
      const target = Math.max(
        weeklyTargetFor(squad, session),
        members.length * GOAL_DAYS_PER_PERSON,
      );
      return {
        id: squad.id,
        name: squad.name,
        memberCount: members.length,
        memberNames: humans.map((m) => m.name).concat(
          members.filter((m) => m.isBot).map((m) => `${m.name} (demo)`),
        ),
        weeklyGoalDays: weeklyDoneFor(squad, session),
        weeklyGoalTarget: target || SQUAD_SIZE * GOAL_DAYS_PER_PERSON,
        questCount: squad.mealIdeas.length,
        questTarget: QUEST_TARGET,
        rankLabel: rank.label,
        reward: rank.reward,
      } satisfies LiveSquadCard;
    })
    .sort((a, b) => b.weeklyGoalDays - a.weeklyGoalDays);

  return {
    sessionCode: session.code,
    humanCount: Object.values(session.members).filter((m) => !m.isBot).length,
    squadCount: squads.length,
    squads,
  };
}

export function resetSession(sessionCode: string) {
  const store = loadStore();
  const key = normalizeCode(sessionCode);
  store.sessions[key] = {
    code: key,
    createdAt: Date.now(),
    members: {},
    squads: {},
  };
  saveStore(store);
  return { ok: true, sessionCode: key };
}
