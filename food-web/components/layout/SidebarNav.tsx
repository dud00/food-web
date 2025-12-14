"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "홈" },
  { href: "/logs", label: "식단 기록" },
  { href: "/reports", label: "리포트" },
  { href: "/recommendations", label: "식단 추천" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="p-5">
        <div className="text-lg font-semibold">FOOD</div>
        <div className="text-xs text-gray-500 mt-1">식단 기록 웹</div>
      </div>

      <nav className="px-3 pb-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-xl px-3 py-2 text-sm transition",
                active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t text-xs text-gray-500">
        v0.1 데모 인증(로컬 저장)
      </div>
    </aside>
  );
}
