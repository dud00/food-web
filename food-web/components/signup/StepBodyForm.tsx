"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { SignupData } from "@/types/signup";
import MetricSummaryCard from "./MetricSummaryCard";

export default function StepBodyForm() {
  const { register, control, formState: { errors } } = useFormContext<SignupData>();

  const gender = useWatch({ control, name: "gender" });
  const age = useWatch({ control, name: "age" });
  const heightCm = useWatch({ control, name: "heightCm" });
  const weightKg = useWatch({ control, name: "weightKg" });
  const goal = useWatch({ control, name: "goal" });
  const activityLevel = useWatch({ control, name: "activityLevel" });

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-800">성별</p>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 border rounded-xl px-3 py-2">
              <input type="radio" value="male" {...register("gender")} />
              남
            </label>
            <label className="flex items-center gap-2 border rounded-xl px-3 py-2">
              <input type="radio" value="female" {...register("gender")} />
              여
            </label>
          </div>
          {errors.gender?.message && <p className="text-xs text-red-600">{errors.gender.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">나이</label>
            <input
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
            type="number"
            {...register("age", { valueAsNumber: true })}
            />
          {errors.age?.message && <p className="text-xs text-red-600">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">키 (cm)</label>
            <input
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
            type="number"
            {...register("heightCm", { valueAsNumber: true })}
            />
          {errors.heightCm?.message && <p className="text-xs text-red-600">{errors.heightCm.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">몸무게 (kg)</label>
            <input
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
            type="number"
            {...register("weightKg", { valueAsNumber: true })}
            />
          {errors.weightKg?.message && <p className="text-xs text-red-600">{errors.weightKg.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <MetricSummaryCard
          gender={gender}
          age={Number(age)}
          heightCm={Number(heightCm)}
          weightKg={Number(weightKg)}
          goal={goal}
          activityLevel={activityLevel}
        />
        <div className="text-xs text-gray-500 leading-relaxed">
          입력한 정보로 BMI/BMR과 권장 섭취량을 계산해요. 다음 단계에서 목표/활동량을 바꾸면 권장량도 함께 조정됩니다.
        </div>
      </div>
    </section>
  );
}
