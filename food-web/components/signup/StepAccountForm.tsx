"use client";

import { useFormContext } from "react-hook-form";
import { isUsernameTaken } from "@/lib/auth.client";
import type { SignupData } from "@/types/signup";

export default function StepAccountForm() {
  const {
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<SignupData>();

  const username = watch("username");

  function checkDuplicate() {
    if (!username?.trim()) {
      setError("username", { type: "manual", message: "아이디를 입력해주세요." });
      return;
    }

    if (isUsernameTaken(username.trim())) {
      setError("username", { type: "manual", message: "이미 사용 중인 아이디입니다." });
    } else {
      clearErrors("username");
      alert("사용 가능한 아이디입니다 🙂");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm">이름</label>
        <input
          className="w-full border rounded-xl px-3 py-2"
          {...register("name")}
          placeholder="예) 홍길동"
        />
        {errors.name?.message && (
          <p className="text-xs text-red-500 mt-1">{String(errors.name.message)}</p>
        )}
      </div>

      <div>
        <label className="text-sm">아이디</label>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-xl px-3 py-2"
            {...register("username")}
            placeholder="영문/숫자/_ 4~20자"
          />
          <button
            type="button"
            onClick={checkDuplicate}
            className="border px-3 rounded-xl text-sm"
          >
            중복 확인
          </button>
        </div>
        {errors.username?.message && (
          <p className="text-xs text-red-500 mt-1">{String(errors.username.message)}</p>
        )}
      </div>

      <div>
        <label className="text-sm">이메일</label>
        <input
          className="w-full border rounded-xl px-3 py-2"
          {...register("email")}
          placeholder="example@email.com"
          autoComplete="email"
        />
        {errors.email?.message && (
          <p className="text-xs text-red-500 mt-1">{String(errors.email.message)}</p>
        )}
      </div>

      <div>
        <label className="text-sm">비밀번호</label>
        <input
          type="password"
          className="w-full border rounded-xl px-3 py-2"
          {...register("password")}
          placeholder="6자 이상"
        />
        {errors.password?.message && (
          <p className="text-xs text-red-500 mt-1">{String(errors.password.message)}</p>
        )}
      </div>

      <div>
        <label className="text-sm">비밀번호 확인</label>
        <input
          type="password"
          className="w-full border rounded-xl px-3 py-2"
          {...register("passwordConfirm")}
          placeholder="비밀번호 다시 입력"
        />
        {errors.passwordConfirm?.message && (
          <p className="text-xs text-red-500 mt-1">{String(errors.passwordConfirm.message)}</p>
        )}
      </div>
    </div>
  );
}
