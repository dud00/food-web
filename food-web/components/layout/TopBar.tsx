"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getSessionUser, logout } from "@/lib/auth.client";

export default function TopBar() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const u = getSessionUser();
    setUsername(u?.username ?? "");
  }, []);

  function onLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="h-14 border-b bg-white px-6 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        오늘도 기록해볼까요? 🙂
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700">
          {username ? `${username}` : ""}
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl border text-sm"
          type="button"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
