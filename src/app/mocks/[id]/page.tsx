import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockRunner } from "@/components/mocks/mock-runner";
import { submitAttempt } from "@/lib/mocks/actions";

export const metadata: Metadata = { title: "Mock attempt" };

type Props = { params: Promise<{ id: string }> };

export default async function MockAttemptPage({ params }: Props) {
  const session = await requireSession();
  const { id } = await params;

  const attempt = await prisma.mockAttempt.findFirst({
    where: { id, userId: session.user.id },
    include: {
      template: true,
      answers: {
        include: {
          question: {
            include: { topics: { include: { topic: true } } },
          },
        },
      },
    },
  });

  if (!attempt) notFound();

  const ordered = attempt.questionIds
    .map((qid) => attempt.answers.find((a) => a.questionId === qid))
    .filter(Boolean) as typeof attempt.answers;

  if (attempt.status !== "IN_PROGRESS") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
          Results
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="brand">{attempt.status}</Badge>
          <Badge>
            Score {attempt.rawScore}/{attempt.maxScore}
          </Badge>
          <Badge tone="success">Correct {attempt.correctCount}</Badge>
          <Badge tone="danger">Incorrect {attempt.incorrectCount}</Badge>
          <Badge>Unanswered {attempt.unansweredCount}</Badge>
          <Badge tone="warn">Neg. impact −{attempt.negativeImpact}</Badge>
        </div>
        <p className="mt-4 text-sm text-[var(--muted-fg)]">
          Scoring is deterministic from your locked answers and the attempt parameters.
        </p>
        <div className="mt-8 space-y-6">
          {ordered.map((a, idx) => (
            <div key={a.id} className="border-b border-[var(--border)] pb-4">
              <p className="text-xs text-[var(--muted-fg)]">Q{idx + 1}</p>
              <p className="mt-1 whitespace-pre-wrap">{a.question.stem}</p>
              <p className="mt-2 text-sm">
                Your answer: <strong>{a.selectedOption ?? "—"}</strong> · Correct:{" "}
                <strong>{a.question.correctOption}</strong>
              </p>
              {a.question.explanation && (
                <p className="mt-2 text-sm text-[var(--muted-fg)]">{a.question.explanation}</p>
              )}
              <a
                href={a.question.officialSourceUrl}
                className="mt-2 inline-block text-xs underline"
                target="_blank"
                rel="noreferrer"
              >
                Official source
              </a>
            </div>
          ))}
        </div>
        <Link href="/dashboard" className="mt-8 inline-block">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--brand)]">
            {attempt.template?.title ?? "Mock attempt"}
          </h1>
          <p className="text-xs text-[var(--muted-fg)]">
            Autosave on · submission locks answers
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await submitAttempt(id);
          }}
        >
          <Button type="submit" variant="danger">
            Submit test
          </Button>
        </form>
      </div>
      <MockRunner
        attemptId={attempt.id}
        endsAt={attempt.endsAt.toISOString()}
        questions={ordered.map((a, idx) => ({
          index: idx,
          answerId: a.id,
          questionId: a.questionId,
          stem: a.question.stem,
          optionA: a.question.optionA,
          optionB: a.question.optionB,
          optionC: a.question.optionC,
          optionD: a.question.optionD,
          selectedOption: a.selectedOption,
          markedForReview: a.markedForReview,
          officialSourceUrl: a.question.officialSourceUrl,
        }))}
      />
    </div>
  );
}
