// lib/auth.client.ts
export type StoredUser = {
  name: string;
  username: string;
  email: string; // ✅ 추가
  password: string;
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

const USERS_KEY = "food.users";
const SESSION_KEY = "food.session";

/* ---------------- users ---------------- */

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ✅ 아이디 중복 확인
export function isUsernameTaken(username: string): boolean {
  const users = getUsers();
  return users.some(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );
}

// ✅ 회원가입 저장
export function registerUser(user: StoredUser) {
  if (isUsernameTaken(user.username)) {
    throw new Error("이미 사용 중인 아이디입니다.");
  }
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

/* ---------------- session ---------------- */

export function getSessionUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function hasSession(): boolean {
  return !!getSessionUser();
}

export function setSession(user: StoredUser) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("food.session", JSON.stringify(user));
  } catch (e) {
    console.error("setSession failed:", e);
    throw e;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  document.cookie = "auth=; Max-Age=0; path=/";
}

/* ---------------- auth ---------------- */

export function loginWithUsername(username: string, password: string): boolean {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return false;
  setSession(user);
  document.cookie = "auth=1; path=/; SameSite=Lax"; // ✅ 미들웨어용
  return true;
}

/* ---------------- profile ---------------- */

export function updateUserProfile(profile: StoredUser["profile"]) {
  const session = getSessionUser();
  if (!session) return;

  const users = getUsers().map((u) =>
    u.username === session.username ? { ...u, profile } : u
  );

  saveUsers(users);
  setSession({ ...session, profile });
}

