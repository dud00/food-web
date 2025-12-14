export default function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { n: 1, label: "계정" },
    { n: 2, label: "신체" },
    { n: 3, label: "목표" },
  ] as const;

  return (
    <div className="flex gap-2">
      {items.map((it) => {
        const active = it.n === step;
        const done = it.n < step;
        return (
          <div
            key={it.n}
            className={[
              "px-3 py-1 rounded-full text-xs border",
              active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700",
              done ? "border-gray-900" : "border-gray-200",
            ].join(" ")}
          >
            {it.n}. {it.label}
          </div>
        );
      })}
    </div>
  );
}
