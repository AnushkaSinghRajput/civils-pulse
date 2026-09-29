import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await requireSession();

  const [attempts, topicStats, publishedCount] = await Promise.all([
    prisma.mockAttempt.findMany({
      where: { userId: session.user.id, status: { in: ["SUBMITTED", "EXPIRED"] } },
      orderBy: { submittedAt: "desc" },
      take: 8,
      include: { template: true },
    }),
    prisma.userTopicStat.findMany({
      where: { userId: session.user.id },
      orderBy: { accuracy: "asc" },
      take: 8,
    }),
    prisma.question.count({
      where: { verificationStatus: "APPROVED", publishedAt: { not: null } },
    }),
  ]);

  const topicIds = topicStats.map((t) => t.topicId);
  const topics = topicIds.length
    ? await prisma.topic.findMany({ where: { id: { in: topicIds } } })
    : [];
  const topicName = new Map(topics.map((t) => [t.id, t.name]));

  const attempted = attempts.reduce((s, a) => s + (a.correctCount ?? 0) + (a.incorrectCount ?? 0) + (a.unansweredCount ?? 0), 0);
  const correct = attempts.reduce((s, a) => s + (a.correctCount ?? 0), 0);
  const neg = attempts.reduce((s, a) => s + (a.negativeImpact ?? 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-[var(--muted-fg)]">
        Welcome{session.user.name ? `, ${session.user.name}` : ""}. Plan: {session.user.plan}.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Verified PYQs" value={String(publishedCount)} />
        <Stat label="Questions attempted" value={String(attempted)} />
        <Stat
          label="Accuracy (scored)"
          value={attempted ? formatPercent(correct / Math.max(correct + (attempted - correct - attempts.reduce((s, a) => s + (a.unansweredCount ?? 0), 0)), 1)) : "—"}
        />
        <Stat label="Negative-mark impact" value={neg ? `−${neg}` : "0"} />
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium">Recent mocks</h2>
          <ul className="mt-3 space-y-2">
            {attempts.length === 0 && (
              <li className="text-sm text-[var(--muted-fg)]">
                No attempts yet.{" "}
                <Link href="/mocks" className="underline">
                  Start a mock
                </Link>
                .
              </li>
            )}
            {attempts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{a.template?.title ?? a.mode}</p>
                  <p className="text-xs text-[var(--muted-fg)]">
                    {a.submittedAt?.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>
                    {a.rawScore}/{a.maxScore}
                  </Badge>
                  <Link href={`/mocks/${a.id}`} className="underline">
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-medium">Weak topics</h2>
          <ul className="mt-3 space-y-2">
            {topicStats.length === 0 && (
              <li className="text-sm text-[var(--muted-fg)]">
                Topic stats appear after you submit mocks.
              </li>
            )}
            {topicStats.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              >
                <span>{topicName.get(t.topicId) ?? t.topicId}</span>
                <Badge tone={t.accuracy < 0.5 ? "danger" : "success"}>
                  {formatPercent(t.accuracy)} · {t.attempted} Q
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">{label}</p>
      <p className="mt-2 text-2xl font-medium text-[var(--brand)]">{value}</p>
    </div>
  );
}
