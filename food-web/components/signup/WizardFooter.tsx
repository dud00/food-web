"use client";

export default function WizardFooter({
  step,
  submitting,
  onPrev,
}: {
  step: 1 | 2 | 3;
  submitting: boolean;
  onPrev: () => void;
}) {
  const isLast = step === 3;

  return (
    <div className="flex items-center justify-between pt-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={step === 1 || submitting}
        className="px-4 py-2 rounded-xl border disabled:opacity-50"
      >
        이전
      </button>

      {/* ✅ Next도 submit: Enter를 눌러도 다음으로 자연스럽게 진행 */}
      {!isLast ? (
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-50"
        >
          다음
        </button>
      ) : (
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-50"
        >
          {submitting ? "처리 중..." : "가입 완료"}
        </button>
      )}
    </div>
  );
}
