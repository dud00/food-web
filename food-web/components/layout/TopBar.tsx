"use client";

import { useRouter } from "next/navigation";
import { clearSession, getUser } from "@/lib/auth.client";
import { useEffect, useState } from "react";

export default function TopBar() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const u = getUser();
    if (u) setEmail(u.email);
  }, []);

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="text-sm text-gray-600">오늘도 기록해볼까요? 🙂</div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700">
          {email ? <span className="font-medium">{email}</span> : "로그인 사용자"}
        </div>
        <button onClick={logout} className="px-3 py-1.5 rounded-xl border text-sm">
          로그아웃
        </button>
      </div>
    </header>
  );
}
