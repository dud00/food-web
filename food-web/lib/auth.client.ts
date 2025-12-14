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
  localStorage.setItem("food.session", "1");
  document.cookie = "auth=1; path=/; SameSite=Lax";
}

export function clearSession() {
  if (typeof window === "undefined") return;

  // localStorage 정리
  localStorage.removeItem("food.session");

  // ✅ 쿠키 삭제 (path=/ 필수)
  document.cookie = "auth=; Max-Age=0; path=/";
  document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
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

export function updateUserProfile(profile: StoredUser["profile"]) {
  if (typeof window === "undefined") return;

  const user = getUser();
  if (!user) return;

  const next: StoredUser = {
    ...user,
    profile,
  };

  saveUser(next);
}
