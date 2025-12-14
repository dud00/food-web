"use client";

import { useFormContext } from "react-hook-form";
import type { SignupData } from "@/types/signup";

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function StepAccountForm() {
  const { register, formState: { errors } } = useFormContext<SignupData>();

  return (
    <section className="space-y-4">
      <Field label="이메일" error={errors.email?.message}>
        <input
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
          placeholder="you@example.com"
          {...register("email")}
        />
      </Field>

      <Field label="비밀번호" error={errors.password?.message}>
        <input
          type="password"
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
          placeholder="8자 이상"
          {...register("password")}
        />
      </Field>

      <Field label="비밀번호 확인" error={errors.passwordConfirm?.message}>
        <input
          type="password"
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2"
          placeholder="비밀번호를 다시 입력"
          {...register("passwordConfirm")}
        />
      </Field>
    </section>
  );
}
