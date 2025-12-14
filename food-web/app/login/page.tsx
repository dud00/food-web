"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUser, setSession, hasSessionInStorage } from "@/lib/auth.client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const storedUser = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getUser();
  }, []);

  // ✅ 이미 로그인(session)이면 바로 대시보드로
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasSessionInStorage()) {
      router.replace("/dashboard");
    }
  }, [router]);

  // ✅ 회원가입한 이메일이 있으면 자동 입력(편의)
  useEffect(() => {
    if (!storedUser) return;
    setEmail(storedUser.email);
  }, [storedUser]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const user = getUser();
    if (!user) {
      setErrorMsg("가입된 계정이 없어요. 회원가입을 먼저 해주세요.");
      return;
    }

    const ok = email.trim().toLowerCase() === user.email.toLowerCase() && password === user.password;
    if (!ok) {
      setErrorMsg("이메일 또는 비밀번호가 올바르지 않아요.");
      return;
    }

    // ✅ 로그인 성공: session 세팅(cookie + localStorage)
    setSession();

    // ✅ 대시보드로 이동
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold">로그인</h1>
        <p className="text-sm text-gray-500 mt-1">식단 기록을 시작해볼까요?</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">이메일</label>
            <input
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">비밀번호</label>
            <input
              type="password"
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 text-white py-2 disabled:opacity-50"
            disabled={!email || !password}
          >
            로그인
          </button>

          <p className="text-sm text-gray-600 text-center">
            아직 계정이 없나요?{" "}
            <Link href="/signup" className="text-gray-900 font-medium underline underline-offset-4">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
