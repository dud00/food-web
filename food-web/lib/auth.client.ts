export type StoredUser = {
  email: string;
  password: string; // 데모용(실서비스는 절대 평문 저장 X)
  profile: {
    gender: "male" | "female";
    age: number;
    heightCm: number;
    weightKg: number;
    goal: "lose" | "maintain" | "gain";
    activityLevel: "low" | "medium" | "high";
    preferences: string[];
  };
};

const USER_KEY = "food.user";
const SESSION_KEY = "food.session";

// ---------- User ----------
export function saveUser(user: StoredUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

// ---------- Session ----------
export function setSession() {
  if (typeof window === "undefined") return;

  // localStorage는 UI용(자동 로그인 판단 등)
  localStorage.setItem(SESSION_KEY, JSON.stringify({ loggedIn: true, at: Date.now() }));

  // cookie는 middleware용(접근 제어)
  document.cookie = `auth=1; Path=/; Max-Age=${60 * 60 * 24 * 7}`;
}

export function clearSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SESSION_KEY);
  document.cookie = "auth=; Path=/; Max-Age=0";
}

export function hasSessionInStorage(): boolean {
  if (typeof window === "undefined") return false;

  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as { loggedIn?: boolean };
    return !!parsed.loggedIn;
  } catch {
    return false;
  }
}
