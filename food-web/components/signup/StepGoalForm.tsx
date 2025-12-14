"use client";

import { useFormContext } from "react-hook-form";
import type { SignupData } from "@/types/signup";

const TAGS = ["한식", "샐러드", "고단백", "저탄수", "간편식", "채식", "국물요리", "매운맛", "디저트"] as const;

export default function StepGoalForm() {
  const { register, setValue, getValues, formState: { errors } } = useFormContext<SignupData>();

  const preferences = getValues("preferences") ?? [];

  function toggleTag(tag: string) {
    const current = new Set(getValues("preferences") ?? []);
    if (current.has(tag)) current.delete(tag);
    else current.add(tag);
    setValue("preferences", Array.from(current), { shouldValidate: true, shouldDirty: true });
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">목표</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <label className="border rounded-xl px-3 py-2 flex gap-2 items-center">
            <input type="radio" value="lose" {...register("goal")} />
            감량
          </label>
          <label className="border rounded-xl px-3 py-2 flex gap-2 items-center">
            <input type="radio" value="maintain" {...register("goal")} />
            유지
          </label>
          <label className="border rounded-xl px-3 py-2 flex gap-2 items-center">
            <input type="radio" value="gain" {...register("goal")} />
            증량
          </label>
        </div>
        {errors.goal?.message && <p className="text-xs text-red-600">{errors.goal.message}</p>}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">활동량</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <label className="border rounded-xl px-3 py-2 flex gap-2 items-center">
            <input type="radio" value="low" {...register("activityLevel")} />
            낮음
          </label>
          <label className="border rounded-xl px-3 py-2 flex gap-2 items-center">
            <input type="radio" value="medium" {...register("activityLevel")} />
            보통
          </label>
          <label className="border rounded-xl px-3 py-2 flex gap-2 items-center">
            <input type="radio" value="high" {...register("activityLevel")} />
            높음
          </label>
        </div>
        {errors.activityLevel?.message && <p className="text-xs text-red-600">{errors.activityLevel.message}</p>}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">선호 태그 (선택)</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => {
            const active = preferences.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={[
                  "px-3 py-1 rounded-full border text-sm",
                  active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200",
                ].join(" ")}
              >
                {tag}
              </button>
            );
          })}
        </div>
        {errors.preferences?.message && <p className="text-xs text-red-600">{errors.preferences.message}</p>}
        <input type="hidden" {...register("preferences")} />
      </div>
    </section>
  );
}
