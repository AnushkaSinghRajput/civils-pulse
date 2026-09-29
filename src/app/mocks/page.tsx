import Link from "next/link";
import type { Metadata } from "next";
import { startOfMonth } from "date-fns";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { canStartMock } from "@/lib/rbac";
import { startMockAttempt } from "@/lib/mocks/start";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Mocks" };

export default async function MocksPage() {
  const session = await requireSession();

  const [templates, usedThisMonth, inProgress] = await Promise.all([
    prisma.mockTemplate.findMany({
      where: { isPublished: true },
      orderBy: { title: "asc" },
    }),
    prisma.mockAttempt.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: startOfMonth(new Date()) },
        status: { in: ["SUBMITTED", "IN_PROGRESS", "EXPIRED"] },
      },
    }),
    prisma.mockAttempt.findMany({
      where: { userId: session.user.id, status: "IN_PROGRESS" },
      orderBy: { startedAt: "desc" },
      take: 5,
      include: { template: true },
    }),
  ]);

  const allowed = canStartMock(
    { id: session.user.id, role: session.user.role, plan: session.user.plan },
    usedThisMonth,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
        Prelims mocks
      </h1>
      <p className="mt-2 text-sm text-[var(--muted-fg)]">
        Server-authoritative timers, autosave, negative marking, and deterministic scoring.
        Free plan: 3 attempts / month ({usedThisMonth} used).
      </p>

      {inProgress.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-medium">Resume in progress</h2>
          <ul className="mt-3 space-y-2">
            {inProgress.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
              >
                <div>
                  <p className="font-medium">{a.template?.title ?? a.mode}</p>
                  <p className="text-xs text-[var(--muted-fg)]">
                    Ends {a.endsAt.toLocaleString()}
                  </p>
                </div>
                <Link href={`/mocks/${a.id}`}>
                  <Button size="sm">Continue</Button>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {templates.map((t) => (
          <div key={t.id} className="border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="brand">{t.mode.replaceAll("_", " ")}</Badge>
              <Badge>{t.paper.replaceAll("_", " ")}</Badge>
            </div>
            <h2 className="mt-3 text-xl font-medium">{t.title}</h2>
            {t.description && (
              <p className="mt-2 text-sm text-[var(--muted-fg)]">{t.description}</p>
            )}
            <p className="mt-3 text-xs text-[var(--muted-fg)]">
              {t.questionCount} Q · {t.durationMinutes} min · −{t.negativeMarking} / wrong ·{" "}
              {t.marksPerQuestion} / correct
            </p>
            <form
              action={async () => {
                "use server";
                await startMockAttempt(t.id);
              }}
            >
              <Button type="submit" className="mt-4" disabled={!allowed}>
                Start mock
              </Button>
            </form>
          </div>
        ))}
        {templates.length === 0 && (
          <p className="text-[var(--muted-fg)] md:col-span-2">
            No mock templates yet. Seed the database to get started.
          </p>
        )}
      </section>

      {!allowed && (
        <p className="mt-6 text-sm text-amber-900">
          Free monthly mock limit reached. Upgrade to Pro for unlimited attempts.
        </p>
      )}
    </div>
  );
}
