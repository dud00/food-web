"use client";

import { useMemo, useState } from "react";

type MealType = "아침" | "점심" | "저녁" | "간식";
type Meal = { id: string; date: string; type: MealType; name: string; kcal: number };

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function loadMeals(): Meal[] {
  const raw = localStorage.getItem("food.logs");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Meal[];
  } catch {
    return [];
  }
}
function saveMeals(meals: Meal[]) {
  localStorage.setItem("food.logs", JSON.stringify(meals));
}

const PRESETS = [
  { name: "리코타 치즈 샐러드", kcal: 420, type: "점심" as const, tags: ["고단백", "가벼움"] },
  { name: "닭가슴살 현미 도시락", kcal: 520, type: "점심" as const, tags: ["균형", "포만감"] },
  { name: "연어 덮밥", kcal: 650, type: "저녁" as const, tags: ["오메가3", "만족감"] },
  { name: "그릭요거트 + 견과", kcal: 280, type: "간식" as const, tags: ["단백질", "간편"] },
  { name: "오트밀 바나나 볼", kcal: 380, type: "아침" as const, tags: ["식이섬유", "에너지"] },
];

export default function RecommendationsPage() {
  const [date, setDate] = useState(todayISO());
  const [message, setMessage] = useState<string | null>(null);

  const items = useMemo(() => PRESETS, []);

  function addToLogs(item: { name: string; kcal: number; type: MealType }) {
    const meals = loadMeals();
    const next: Meal[] = [{ id: uid(), date, type: item.type, name: item.name, kcal: item.kcal }, ...meals];
    saveMeals(next);

    setMessage(`✅ ${item.name} (${item.kcal}kcal)를 ${date} 기록에 추가했어요!`);
    setTimeout(() => setMessage(null), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">식단 추천</h1>
        <p className="text-sm text-gray-500 mt-1">추천을 눌러 바로 식단 기록에 추가할 수 있어요.</p>
      </div>

      <div className="rounded-2xl border bg-white p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">추가할 날짜</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
          />
        </div>

        {message && (
          <div className="text-sm text-gray-700 rounded-xl border bg-gray-50 px-3 py-2">
            {message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.name} className="rounded-2xl border bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{it.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {it.type} · {it.kcal} kcal
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full border text-gray-700">{it.type}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {it.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {t}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addToLogs(it)}
              className="mt-4 w-full px-4 py-2 rounded-xl bg-gray-900 text-white text-sm"
            >
              기록에 추가
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
