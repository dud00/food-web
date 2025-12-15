"use client";

import { useEffect, useState } from "react";
import { getSessionUser, updateUserProfile } from "@/lib/auth.client";
import type { StoredUser } from "@/lib/auth.client";

type Profile = StoredUser["profile"];

export default function ProfileEditModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  // ✅ null 없는 기본값
  const [profile, setProfile] = useState<Profile>({
    gender: "male",
    age: 25,
    heightCm: 170,
    weightKg: 65,
    goal: "maintain",
    activityLevel: "medium",
    preferences: [],
  });

  // ✅ 모달이 열릴 때마다 최신 프로필 로드
  useEffect(() => {
    if (!open) return;
    const u = getSessionUser();
    if (u?.profile) setProfile(u.profile);
  }, [open]);

  if (!open) return null;

  function save() {
    updateUserProfile(profile);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">프로필 수정</div>
            <div className="text-sm text-gray-500 mt-1">
              목표/신체 정보는 추천과 리포트에 반영돼요.
            </div>
          </div>
          <button
            className="px-3 py-1.5 rounded-xl border text-sm"
            onClick={onClose}
            type="button"
          >
            닫기
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="성별">
            <select
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value as Profile["gender"] })}
            >
              <option value="male">남</option>
              <option value="female">여</option>
            </select>
          </Field>

          <Field label="나이">
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
            />
          </Field>

          <Field label="키(cm)">
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={profile.heightCm}
              onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
            />
          </Field>

          <Field label="몸무게(kg)">
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={profile.weightKg}
              onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) })}
            />
          </Field>

          <Field label="목표">
            <select
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value as Profile["goal"] })}
            >
              <option value="lose">감량</option>
              <option value="maintain">유지</option>
              <option value="gain">증량</option>
            </select>
          </Field>

          <Field label="활동량">
            <select
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={profile.activityLevel}
              onChange={(e) =>
                setProfile({ ...profile, activityLevel: e.target.value as Profile["activityLevel"] })
              }
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
          </Field>

          <Field label="선호 태그(쉼표로 구분)" full>
            <input
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={profile.preferences.join(",")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferences: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean)
                    .slice(0, 10),
                })
              }
              placeholder="예) 고단백, 저탄수, 한식"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-xl border text-sm" onClick={onClose} type="button">
            취소
          </button>
          <button className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm" onClick={save} type="button">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {children}
    </div>
  );
}
