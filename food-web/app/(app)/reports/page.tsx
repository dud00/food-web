"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Meal = { id: string; date: string; type: string; name: string; kcal: number };

function loadMeals(): Meal[] {
  const raw = localStorage.getItem("food.logs");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Meal[];
  } catch {
    return [];
  }
}

function iso(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0~6
  const diff = (day + 6) % 7; // Monday start
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function ReportsPage() {
  const [tab, setTab] = useState<"일간" | "주간" | "월간">("주간");
  const meals = useMemo(() => (typeof window === "undefined" ? [] : loadMeals()), []);
  const today = useMemo(() => new Date(), []);

  const data = useMemo(() => {
    const rows: { label: string; kcal: number }[] = [];

    if (tab === "일간") {
      const key = iso(today);
      const sum = meals.filter((m) => m.date === key).reduce((a, m) => a + (Number(m.kcal) || 0), 0);
      rows.push({ label: key.slice(5), kcal: sum }); // MM-DD
      return rows;
    }

    if (tab === "주간") {
      const start = startOfWeek(today);
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = iso(d);
        const sum = meals.filter((m) => m.date === key).reduce((a, m) => a + (Number(m.kcal) || 0), 0);
        rows.push({ label: key.slice(5), kcal: sum }); // MM-DD
      }
      return rows;
    }

    // 월간(최근 30일)
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = iso(d);
      const sum = meals.filter((m) => m.date === key).reduce((a, m) => a + (Number(m.kcal) || 0), 0);
      rows.push({ label: key.slice(5), kcal: sum }); // MM-DD
    }
    return rows;
  }, [meals, tab, today]);

  const total = data.reduce((a, x) => a + x.kcal, 0);
  const avg = data.length ? Math.round(total / data.length) : 0;
  const max = data.reduce((m, x) => Math.max(m, x.kcal), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">리포트</h1>
        <p className="text-sm text-gray-500 mt-1">기록된 식단을 기간별로 요약해요.</p>
      </div>

      {/* 탭 */}
      <div className="rounded-2xl border bg-white p-2 inline-flex gap-2">
        {(["일간", "주간", "월간"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "px-4 py-2 rounded-xl text-sm",
              tab === t ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700",
            ].join(" ")}
            type="button"
          >
            {t} 리포트
          </button>
        ))}
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="총 섭취" value={`${total} kcal`} sub={`기간: ${tab}`} />
        <Card title="평균 섭취" value={`${avg} kcal`} sub="기간 내 평균" />
        <Card title="최대 섭취" value={`${max} kcal`} sub="최고치 기준" />
      </div>

      {/* 차트 */}
      <div className="rounded-2xl border bg-white p-5">
        <div className="text-sm font-semibold">섭취 추이</div>

        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="kcal" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {meals.length === 0 && (
          <div className="mt-4 text-sm text-gray-500">
            아직 기록이 없어요. <span className="font-medium">식단 기록</span>에서 먼저 추가해보세요.
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{sub}</div>
    </div>
  );
}
