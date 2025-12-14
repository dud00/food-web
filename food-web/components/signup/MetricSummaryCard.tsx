import { calcBMI, calcBMR, calcRecommendedCalories } from "@/lib/health";

type Props = {
  gender: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  goal: "lose" | "maintain" | "gain";
  activityLevel: "low" | "medium" | "high";
};

export default function MetricSummaryCard(props: Props) {
  const bmi = calcBMI(props.heightCm, props.weightKg);
  const bmr = calcBMR(props.gender, props.age, props.heightCm, props.weightKg);
  const rec = calcRecommendedCalories(bmr, props.activityLevel, props.goal);

  const fmt = (n: number) => (Number.isFinite(n) ? n : 0);

  return (
    <div className="rounded-2xl border bg-gray-50 p-4">
      <p className="text-sm font-semibold text-gray-800">요약</p>
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="rounded-xl bg-white border p-3">
          <p className="text-xs text-gray-500">BMI</p>
          <p className="text-lg font-semibold">{fmt(bmi).toFixed(1)}</p>
        </div>
        <div className="rounded-xl bg-white border p-3">
          <p className="text-xs text-gray-500">BMR</p>
          <p className="text-lg font-semibold">{Math.round(fmt(bmr))} kcal</p>
        </div>
        <div className="rounded-xl bg-white border p-3">
          <p className="text-xs text-gray-500">권장 섭취</p>
          <p className="text-lg font-semibold">{Math.round(fmt(rec))} kcal</p>
        </div>
      </div>
    </div>
  );
}
