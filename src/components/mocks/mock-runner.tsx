"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveAnswer } from "@/lib/mocks/actions";

type Q = {
  index: number;
  answerId: string;
  questionId: string;
  stem: string;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  selectedOption: string | null;
  markedForReview: boolean;
  officialSourceUrl: string;
};

export function MockRunner({
  attemptId,
  endsAt,
  questions,
}: {
  attemptId: string;
  endsAt: string;
  questions: Q[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [local, setLocal] = useState(questions);
  const [pending, startTransition] = useTransition();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remainingMs = Math.max(0, new Date(endsAt).getTime() - now);
  const mm = Math.floor(remainingMs / 60000);
  const ss = Math.floor((remainingMs % 60000) / 1000);

  useEffect(() => {
    if (remainingMs === 0) {
      router.refresh();
    }
  }, [remainingMs, router]);

  const q = local[current];
  const options = useMemo(
    () =>
      [
        ["A", q?.optionA],
        ["B", q?.optionB],
        ["C", q?.optionC],
        ["D", q?.optionD],
      ] as const,
    [q],
  );

  function select(option: "A" | "B" | "C" | "D" | null) {
    if (!q) return;
    setLocal((prev) =>
      prev.map((item) =>
        item.questionId === q.questionId ? { ...item, selectedOption: option } : item,
      ),
    );
    startTransition(async () => {
      await saveAnswer({
        attemptId,
        questionId: q.questionId,
        selectedOption: option,
      });
    });
  }

  if (!q) return null;

  return (
    <div>
      <div className="sticky top-0 z-10 mb-4 flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <Badge tone={remainingMs < 5 * 60_000 ? "danger" : "brand"}>
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </Badge>
        <span className="text-sm text-[var(--muted-fg)]">
          Q {current + 1} / {local.length}
          {pending ? " · saving…" : " · saved"}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {local.map((item, i) => (
          <button
            key={item.questionId}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-8 w-8 text-xs ${
              i === current
                ? "bg-[var(--brand)] text-white"
                : item.selectedOption
                  ? "bg-[var(--brand-soft)]"
                  : "bg-[var(--surface-2)]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{q.stem}</p>
      <div className="mt-4 space-y-2">
        {options.map(([key, value]) =>
          value ? (
            <button
              key={key}
              type="button"
              onClick={() => select(key)}
              className={`flex w-full gap-2 border px-3 py-3 text-left text-sm ${
                q.selectedOption === key
                  ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <span className="font-medium">({key})</span>
              <span>{value}</span>
            </button>
          ) : null,
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={current >= local.length - 1}
          onClick={() => setCurrent((c) => Math.min(local.length - 1, c + 1))}
        >
          Next
        </Button>
        <Button variant="ghost" onClick={() => select(null)}>
          Clear
        </Button>
      </div>
    </div>
  );
}
