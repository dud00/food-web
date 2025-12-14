import { z } from "zod";

// Step 1
export const step1Schema = z
  .object({
    email: z.string().email("이메일 형식이 올바르지 않아요."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 해요."),
    passwordConfirm: z.string().min(8, "비밀번호 확인을 입력해주세요."),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: "비밀번호가 서로 달라요.",
    path: ["passwordConfirm"],
  });

// Step 2  ✅ coerce 제거 -> number로 통일
export const step2Schema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.number().int().min(10, "나이는 10 이상이어야 해요.").max(120, "나이는 120 이하여야 해요."),
  heightCm: z.number().min(100, "키는 100cm 이상이어야 해요.").max(250, "키는 250cm 이하여야 해요."),
  weightKg: z.number().min(30, "몸무게는 30kg 이상이어야 해요.").max(300, "몸무게는 300kg 이하여야 해요."),
});

// Step 3
export const step3Schema = z.object({
  goal: z.enum(["lose", "maintain", "gain"]),
  activityLevel: z.enum(["low", "medium", "high"]),
  preferences: z.array(z.string()).max(10, "선호 태그는 최대 10개까지 선택할 수 있어요."),
});

export const fullSignupSchema = step1Schema.and(step2Schema).and(step3Schema);

export type SignupSchema = z.infer<typeof fullSignupSchema>;
