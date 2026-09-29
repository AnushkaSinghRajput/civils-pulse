import { Badge } from "@/components/ui/badge";

type QuestionCardProps = {
  id: string;
  year: number;
  paper: string;
  language: string;
  stem: string;
  optionA?: string | null;
  optionB?: string | null;
  optionC?: string | null;
  optionD?: string | null;
  officialSourceUrl: string;
  kind: string;
  topics?: string[];
  showAnswer?: boolean;
  correctOption?: string | null;
  explanation?: string | null;
};

export function QuestionCard(q: QuestionCardProps) {
  const options = [
    ["A", q.optionA],
    ["B", q.optionB],
    ["C", q.optionC],
    ["D", q.optionD],
  ] as const;

  return (
    <article className="border-b border-[var(--border)] py-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="brand">{q.year}</Badge>
        <Badge>{q.paper.replaceAll("_", " ")}</Badge>
        <Badge>{q.language}</Badge>
        {q.kind === "GENERATED_PRACTICE" && (
          <Badge tone="warn">Generated practice — not official UPSC</Badge>
        )}
        {q.kind === "OFFICIAL_PYQ" && <Badge tone="success">Verified PYQ</Badge>}
        {q.topics?.map((t) => (
          <Badge key={t} tone="neutral">
            {t}
          </Badge>
        ))}
      </div>
      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--foreground)]">{q.stem}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {options.map(([key, value]) =>
          value ? (
            <li key={key} className="flex gap-2">
              <span className="font-medium text-[var(--brand)]">({key})</span>
              <span>{value}</span>
            </li>
          ) : null,
        )}
      </ul>
      {q.showAnswer && q.correctOption && (
        <div className="mt-4 rounded-md bg-[var(--surface-2)] p-3 text-sm">
          <p>
            <span className="font-medium">Answer:</span> ({q.correctOption})
          </p>
          {q.explanation && <p className="mt-2 text-[var(--muted-fg)]">{q.explanation}</p>}
        </div>
      )}
      <p className="mt-4 text-xs text-[var(--muted-fg)]">
        Official source:{" "}
        <a
          href={q.officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[var(--border)] underline-offset-2 hover:text-[var(--brand)]"
        >
          UPSC PDF
        </a>
      </p>
    </article>
  );
}
