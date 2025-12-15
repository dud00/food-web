"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getSessionUser } from "@/lib/auth.client";
import ProfileEditModal from "@/components/profile/ProfileEditModal";

/* ---------------- utils ---------------- */

type Meal = {
  id: string;
  date: string;
  type: "아침" | "점심" | "저녁" | "간식";
  name: string;
  kcal: number;
};

function loadMeals(): Meal[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("food.logs");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Meal[];
  } catch {
    return [];
  }
}

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/* ---------------- page ---------------- */

export default function DashboardPage() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileVersion, setProfileVersion] = useState(0);

  const [todayKcal, setTodayKcal] = useState(0);
  const [goalKcal, setGoalKcal] = useState(2000);
  const [streak, setStreak] = useState(0);

  const today = useMemo(() => todayISO(), []);

  useEffect(() => {
    const user = getSessionUser();
    if (!user) return;

    // (데모) 목표 칼로리
    setGoalKcal(2000);

    const meals = loadMeals();
    const todayMeals = meals.filter((m) => m.date === today);
    const sum = todayMeals.reduce((acc, m) => acc + (Number(m.kcal) || 0), 0);
    setTodayKcal(sum);

    // 연속 기록 계산 (간단 버전)
    const dates = new Set(meals.map((m) => m.date));
    let s = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const iso = `${d.getFullYear()}-${mm}-${dd}`;
      if (dates.has(iso)) s++;
      else break;
    }
    setStreak(s);
  }, [today, profileVersion]);

  const remain = Math.max(0, goalKcal - todayKcal);
  const ratio = goalKcal ? Math.round((todayKcal / goalKcal) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">홈</h1>
          <p className="text-sm text-gray-500 mt-1">
            오늘 섭취와 목표를 한눈에 확인하세요.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="px-4 py-2 rounded-xl border text-sm"
        >
          프로필 수정
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="오늘 섭취" value={`${todayKcal} kcal`} sub={`기준일: ${today}`} />
        <Card title="목표 대비" value={`${ratio}%`} sub={`목표: ${goalKcal} kcal`} />
        <Card title="남은 칼로리" value={`${remain} kcal`} sub="무리하지 않게 채워봐요" />
        <Card title="연속 기록" value={`${streak}일`} sub="꾸준함이 성과를 만듭니다" />
      </div>

      {/* CTA + 코치 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border bg-white p-5">
          <h2 className="text-base font-semibold">오늘 식단 기록하기</h2>
          <p className="text-sm text-gray-500 mt-1">
            기록이 쌓이면 리포트와 추천이 더 똑똑해져요.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/logs"
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm"
            >
              식단 기록으로 이동
            </Link>
            <Link
              href="/recommendations"
              className="px-4 py-2 rounded-xl border text-sm"
            >
              식단 추천 보기
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <div className="text-sm font-semibold">코치 한마디</div>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            오늘은 목표 대비{" "}
            <span className="font-medium text-gray-900">{ratio}%</span>{" "}
            달성했어요.<br />
            남은 칼로리는{" "}
            <span className="font-medium text-gray-900">{remain} kcal</span>!
            <br />
            단백질을 조금 보충해보면 좋아요.
          </p>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onSaved={() => setProfileVersion((v) => v + 1)}
      />
    </div>
  );
}

/* ---------------- components ---------------- */

function Card({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{sub}</div>
    </div>
  );
}
