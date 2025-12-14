export function calcBMI(heightCm: number, weightKg: number) {
  const h = heightCm / 100;
  if (!h || !weightKg) return 0;
  return weightKg / (h * h);
}

// Mifflin-St Jeor
export function calcBMR(
  gender: "male" | "female",
  age: number,
  heightCm: number,
  weightKg: number
) {
  if (!age || !heightCm || !weightKg) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function activityMultiplier(level: "low" | "medium" | "high") {
  switch (level) {
    case "low":
      return 1.2;
    case "medium":
      return 1.55;
    case "high":
      return 1.725;
  }
}

export function goalAdjustment(goal: "lose" | "maintain" | "gain") {
  switch (goal) {
    case "lose":
      return -300;
    case "maintain":
      return 0;
    case "gain":
      return 300;
  }
}

export function calcRecommendedCalories(
  bmr: number,
  activity: "low" | "medium" | "high",
  goal: "lose" | "maintain" | "gain"
) {
  if (!bmr) return 0;
  const tdee = bmr * activityMultiplier(activity);
  return tdee + goalAdjustment(goal);
}
