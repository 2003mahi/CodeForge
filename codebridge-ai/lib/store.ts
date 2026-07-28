// Global state & persistence store for user progress

export interface UserState {
  name: string;
  college: string;
  xp: number;
  streak: number;
  level: string;
  solvedProblemIds: string[];
  weeklyActivity: { day: string; problems: number; xp: number }[];
}

const STORAGE_KEY = "codebridge_user_state";

const initialUserState: UserState = {
  name: "Aryan Sharma",
  college: "BITS Pilani",
  xp: 4280,
  streak: 14,
  level: "Mid-Level Engineer",
  solvedProblemIds: ["1", "2"],
  weeklyActivity: [
    { day: "Mon", problems: 4, xp: 120 },
    { day: "Tue", problems: 7, xp: 210 },
    { day: "Wed", problems: 2, xp: 60 },
    { day: "Thu", problems: 9, xp: 270 },
    { day: "Fri", problems: 5, xp: 150 },
    { day: "Sat", problems: 11, xp: 330 },
    { day: "Sun", problems: 3, xp: 90 },
  ],
};

export function getUserState(): UserState {
  if (typeof window === "undefined") return initialUserState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialUserState;
  } catch {
    return initialUserState;
  }
}

export function saveUserState(state: UserState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("codebridge_state_change", { detail: state }));
  } catch (e) {
    console.error("Failed to save user state:", e);
  }
}

export function addSolvedProblem(problemId: string, xpEarned: number): UserState {
  const current = getUserState();
  if (current.solvedProblemIds.includes(problemId)) return current;

  const newXp = current.xp + xpEarned;
  let newLevel = current.level;
  if (newXp > 8000) newLevel = "Staff Engineer";
  else if (newXp > 6000) newLevel = "Senior Engineer";
  else if (newXp > 4000) newLevel = "Mid-Level Engineer";
  else if (newXp > 2000) newLevel = "Junior Engineer";

  const updated: UserState = {
    ...current,
    xp: newXp,
    level: newLevel,
    solvedProblemIds: [...current.solvedProblemIds, problemId],
  };

  saveUserState(updated);
  return updated;
}
