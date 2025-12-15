"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  loginWithUsername,
  hasSession,
} from "@/lib/auth.client";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ 이미 로그인 되어 있으면 대시보드로
  useEffect(() => {
  if (hasSession()) router.replace("/dashboard");
}, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!username.trim() || !password) {
      setMsg("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    const ok = loginWithUsername(username, password);
    if (!ok) {
      setMsg("아이디 또는 비밀번호가 올바르지 않습니다");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">로그인</h1>
        <p className="text-sm text-gray-500 mt-1">아이디로 로그인하세요.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm">아이디</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디(username)"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-sm">비밀번호</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
            />
          </div>

          {msg && <p className="text-sm text-red-600">{msg}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gray-900 text-white py-2 text-sm disabled:opacity-60"
          >
            {submitting ? "로그인 중..." : "로그인"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="w-full rounded-xl border py-2 text-sm"
          >
            회원가입으로 가기
          </button>
        </form>
      </div>
    </div>
  );
}
