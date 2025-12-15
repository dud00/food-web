export type SignupData = {
  name: string;
  username: string;
  password: string;
  passwordConfirm: string;

  gender: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;

  goal: "lose" | "maintain" | "gain";
  activityLevel: "low" | "medium" | "high";
  preferences: string[];
};