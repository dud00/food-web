"use client";

import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodIssue } from "zod";
import { useRouter } from "next/navigation";

import type { SignupData } from "@/types/signup";
import { fullSignupSchema, step1Schema, step2Schema, step3Schema } from "@/lib/schemas";
import { saveUser } from "@/lib/auth.client";

import StepIndicator from "./StepIndicator";
import StepAccountForm from "./StepAccountForm";
import StepBodyForm from "./StepBodyForm";
import StepGoalForm from "./StepGoalForm";
import WizardFooter from "./WizardFooter";

const defaultValues: SignupData = {
  email: "",
  password: "",
  passwordConfirm: "",

  gender: "male",
  age: 25,
  heightCm: 170,
  weightKg: 65,

  goal: "lose",
  activityLevel: "medium",
  preferences: [],
};

export default function SignupWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<SignupData>({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(fullSignupSchema),
  });

  const stepFields = useMemo(() => {
    if (step === 1) return ["email", "password", "passwordConfirm"] as const;
    if (step === 2) return ["gender", "age", "heightCm", "weightKg"] as const;
    return ["goal", "activityLevel", "preferences"] as const;
  }, [step]);

  async function validateCurrentStep(): Promise<boolean> {
    const values = methods.getValues();
    const stepSchema = step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema;

    const parsed = stepSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue: ZodIssue) => {
        const key = issue.path?.[0] as keyof SignupData | undefined;
        if (key) methods.setError(key, { type: "manual", message: issue.message });
      });
      await methods.trigger(stepFields);
      return false;
    }
    return true;
  }

  async function goNext() {
    const ok = await validateCurrentStep();
    if (!ok) return;
    setStep((prev) => (prev === 3 ? 3 : ((prev + 1) as 1 | 2 | 3)));
  }

  function goPrev() {
    setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as 1 | 2 | 3)));
  }

async function onSubmitAll(data: SignupData) {
  setSubmitting(true);
  try {
    console.log("✅ onSubmitAll 실행됨", data);

    saveUser({
      email: data.email,
      password: data.password,
      profile: {
        gender: data.gender,
        age: data.age,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        goal: data.goal,
        activityLevel: data.activityLevel,
        preferences: data.preferences,
      },
    });

    // ✅ 저장 직후 바로 확인 (이 값이 null이면 저장이 안 된 것)
    console.log("✅ 저장 직후 food.user =", localStorage.getItem("food.user"));

    alert("가입이 완료되었어요! 이제 로그인 해주세요 🙂");
    router.replace("/login"); // push 대신 replace 추천
  } catch (err) {
    console.error("❌ 회원가입 저장 실패", err);
    alert("회원가입 저장 중 오류가 발생했어요. 콘솔을 확인해주세요.");
  } finally {
    setSubmitting(false);
  }
}


  // ✅ 핵심: form submit이 발생해도 step<3이면 "가입완료"가 아니라 "다음 단계"로 처리
  const onSubmit = methods.handleSubmit(async (data, e) => {
    if (step < 3) {
      e?.preventDefault();
      await goNext();
      return;
    }
    await onSubmitAll(data);
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">3단계로 빠르게 설정을 완료해요.</p>
        </div>
        <StepIndicator step={step} />
      </div>

      <div className="mt-6">
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="space-y-6">
            {step === 1 && <StepAccountForm />}
            {step === 2 && <StepBodyForm />}
            {step === 3 && <StepGoalForm />}

            <WizardFooter step={step} submitting={submitting} onPrev={goPrev} />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
