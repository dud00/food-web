"use client";

import { useMemo, useState } from "react";

type MealType = "아침" | "점심" | "저녁" | "간식";
type Meal = {
  id: string;
  date: string; // YYYY-MM-DD
  type: MealType;
  name: string;
  kcal: number;
};

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

export default function LogsPage() {
  const [date, setDate] = useState<string>(todayISO());
  const [meals, setMeals] = useState<Meal[]>(() => (typeof window === "undefined" ? [] : loadMeals()));

  const dayMeals = useMemo(() => meals.filter((m) => m.date === date), [meals, date]);
  const totalKcal = useMemo(() => dayMeals.reduce((acc, m) => acc + (Number(m.kcal) || 0), 0), [dayMeals]);

  // 입력 폼
  const [type, setType] = useState<MealType>("아침");
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState<number>(0);

  function addMeal() {
    if (!name.trim()) return;

    const next: Meal[] = [
      { id: uid(), date, type, name: name.trim(), kcal: Number(kcal) || 0 },
      ...meals,
    ];
    setMeals(next);
    saveMeals(next);

    setName("");
    setKcal(0);
  }

  function removeMeal(id: string) {
    const next = meals.filter((m) => m.id !== id);
    setMeals(next);
    saveMeals(next);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">식단 기록</h1>
        <p className="text-sm text-gray-500 mt-1">날짜별로 식단을 추가하고 관리하세요.</p>
      </div>

      {/* 상단 */}
      <div className="rounded-2xl border bg-white p-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="text-xs text-gray-500">날짜 선택</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
          />
        </div>

        <div className="text-sm text-gray-700">
          합계: <span className="font-semibold">{totalKcal} kcal</span>
        </div>
      </div>

      {/* 추가 폼 */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm font-semibold">식단 추가</div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MealType)}
            className="rounded-xl border px-3 py-2 text-sm"
          >
            <option>아침</option>
            <option>점심</option>
            <option>저녁</option>
            <option>간식</option>
          </select>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 닭가슴살 샐러드"
            className="rounded-xl border px-3 py-2 text-sm md:col-span-2"
          />

          <input
            type="number"
            value={kcal || ""}
            onChange={(e) => setKcal(Number(e.target.value))}
            placeholder="kcal"
            className="rounded-xl border px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={addMeal}
            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm disabled:opacity-50"
            disabled={!name.trim()}
          >
            추가
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="rounded-2xl border bg-white overflow-hidden">
        <div className="px-4 py-3 border-b text-sm font-semibold">기록 리스트</div>

        {dayMeals.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">아직 기록이 없어요. 위에서 식단을 추가해보세요.</div>
        ) : (
          <ul className="divide-y">
            {dayMeals.map((m) => (
              <li key={m.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    <span className="mr-2 inline-flex px-2 py-0.5 rounded-full border text-xs text-gray-700">
                      {m.type}
                    </span>
                    {m.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{m.kcal} kcal</div>
                </div>

                <button
                  type="button"
                  onClick={() => removeMeal(m.id)}
                  className="px-3 py-1.5 rounded-xl border text-sm"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
