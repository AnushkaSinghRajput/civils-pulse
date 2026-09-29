import Link from "next/link";
import type { Metadata } from "next";
import { startOfMonth } from "date-fns";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { canStartMock } from "@/lib/rbac";
import { startMockAttempt } from "@/lib/mocks/start";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JumpInBar } from "@/components/prepare/jump-in";
import { SUBJECT_CARDS } from "@/lib/catalog";

export const metadata: Metadata = { title: "Mocks" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MocksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireSession();
  const sp = await searchParams;
  const subject = typeof sp.subject === "string" ? sp.subject : "";
  const focusCard = SUBJECT_CARDS.find((c) => c.slug === subject);

  const [templates, usedThisMonth, inProgress] = await Promise.all([
    prisma.mockTemplate.findMany({
      where: {
        isPublished: true,
        ...(focusCard
          ? {
              OR: [
                { slug: `subject-${focusCard.slug}` },
                ...(focusCard.paper === "PRELIMS_CSAT"
                  ? [{ paper: "PRELIMS_CSAT" as const }]
                  : []),
                ...(focusCard.topicSlugs.length
                  ? focusCard.topicSlugs.map((slug) => ({
                      slug: `topic-${slug}`,
                    }))
                  : []),
              ],
            }
          : {}),
      },
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

  const preferred =
    focusCard &&
    templates.find(
      (t) => t.slug === `subject-${focusCard.slug}` || t.paper === focusCard.paper,
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
            Prelims mocks
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-fg)]">
            Server timers, autosave, negative marking, deterministic scoring. Free: 3 / month (
            {usedThisMonth} used).
          </p>
        </div>
        <Link href="/practice">
          <Button variant="outline" size="sm">
            Browse practice papers
          </Button>
        </Link>
      </div>

      <JumpInBar />

      {focusCard && (
        <div className="mt-6 rounded-lg border border-[var(--brand)] bg-[var(--brand-soft)] p-4">
          <p className="text-sm font-medium text-[var(--brand)]">
            Subject focus: {focusCard.title}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-fg)]">{focusCard.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/pyq?${
                focusCard.topicSlugs.length > 1
                  ? `subjectGroup=${focusCard.slug}`
                  : focusCard.topicSlugs[0]
                    ? `topic=${focusCard.topicSlugs[0]}`
                    : `paper=${focusCard.paper}`
              }&paper=${focusCard.paper}`}
            >
              <Button size="sm" variant="outline">
                Browse PYQs
              </Button>
            </Link>
            {preferred && allowed && (
              <form
                action={async () => {
                  "use server";
                  await startMockAttempt(preferred.id);
                }}
              >
                <Button type="submit" size="sm">
                  Start {focusCard.title} mock
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {inProgress.length > 0 && (
        <section className="mt-10">
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

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--brand)]">
          Mock templates
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {templates.map((t) => (
            <div key={t.id} className="border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone="brand">{t.mode.replaceAll("_", " ")}</Badge>
                <Badge>{t.paper.replaceAll("_", " ")}</Badge>
              </div>
              <h3 className="mt-3 text-lg font-medium">{t.title}</h3>
              {t.description && (
                <p className="mt-2 text-sm text-[var(--muted-fg)]">{t.description}</p>
              )}
              <p className="mt-3 text-xs text-[var(--muted-fg)]">
                up to {t.questionCount} Q · {t.durationMinutes} min · −{t.negativeMarking} / wrong
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
              No templates for this focus.{" "}
              <Link href="/practice" className="underline">
                Pick a paper from Practice
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {!allowed && (
        <p className="mt-6 text-sm text-amber-900">
          Free monthly mock limit reached. Upgrade to Pro for unlimited attempts.
        </p>
      )}
    </div>
  );
}
