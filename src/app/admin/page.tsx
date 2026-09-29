import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { verifyQuestion } from "@/lib/admin/verify";

export const metadata: Metadata = { title: "Admin verification" };

export default async function AdminPage() {
  await requireRole(["ADMIN"]);

  const [queue, stats] = await Promise.all([
    prisma.question.findMany({
      where: { verificationStatus: { in: ["EXTRACTED", "IN_REVIEW", "NEEDS_FIX"] } },
      orderBy: [{ extractionConfidence: "asc" }, { createdAt: "asc" }],
      take: 25,
    }),
    prisma.question.groupBy({
      by: ["verificationStatus"],
      _count: true,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
        Admin verification
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted-fg)]">
        Extracted questions are never published automatically. Approve only after checking stem,
        options, answer, language, and official source URL.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {stats.map((s) => (
          <Badge key={s.verificationStatus}>
            {s.verificationStatus}: {s._count}
          </Badge>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {queue.length === 0 ? (
          <p className="text-[var(--muted-fg)]">Verification queue is empty.</p>
        ) : (
          queue.map((q) => (
            <article
              key={q.id}
              className="border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="flex flex-wrap gap-2">
                <Badge tone="warn">{q.verificationStatus}</Badge>
                <Badge>
                  {q.year} · {q.paper}
                </Badge>
                <Badge>confidence {(q.extractionConfidence ?? 0).toFixed(2)}</Badge>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm">{q.stem}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {(
                  [
                    ["A", q.optionA],
                    ["B", q.optionB],
                    ["C", q.optionC],
                    ["D", q.optionD],
                  ] as const
                ).map(([k, val]) =>
                  val ? (
                    <li key={k}>
                      ({k}) {val}
                      {q.correctOption === k ? " ✓" : ""}
                    </li>
                  ) : null,
                )}
              </ul>
              <p className="mt-3 text-xs">
                Source:{" "}
                <a
                  href={q.officialSourceUrl}
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {q.officialSourceUrl}
                </a>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <form
                  action={async () => {
                    "use server";
                    await verifyQuestion(q.id, "APPROVED");
                  }}
                >
                  <Button type="submit" size="sm">
                    Approve & publish
                  </Button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await verifyQuestion(q.id, "NEEDS_FIX");
                  }}
                >
                  <Button type="submit" size="sm" variant="outline">
                    Needs fix
                  </Button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await verifyQuestion(q.id, "REJECTED");
                  }}
                >
                  <Button type="submit" size="sm" variant="danger">
                    Reject
                  </Button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
