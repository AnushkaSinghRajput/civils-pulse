import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { SUBJECT_CARDS } from "@/lib/catalog";
import { PracticePaperGrid } from "@/components/prepare/practice-paper-grid";
import { JumpInBar } from "@/components/prepare/jump-in";

export const metadata: Metadata = { title: "Practice" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PracticePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireSession();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  const approved = await prisma.question.findMany({
    where: { verificationStatus: "APPROVED", publishedAt: { not: null } },
    select: {
      paper: true,
      topics: { select: { topic: { select: { slug: true } } } },
    },
  });

  const counts: Record<string, number> = {};
  for (const card of SUBJECT_CARDS) {
    counts[card.slug] = approved.filter((item) => {
      if (card.slug === "gs-paper-1") return item.paper === "PRELIMS_GS1";
      if (card.paper === "PRELIMS_CSAT") return item.paper === "PRELIMS_CSAT";
      const slugs = item.topics.map((t) => t.topic.slug);
      return card.topicSlugs.some((s) => slugs.includes(s));
    }).length;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
        Practice
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted-fg)]">
        Built so UPSC aspirants can prepare subject by subject. Pick a paper, revise verified
        PYQs, and take a timed mock when you are ready.
      </p>

      <JumpInBar className="mt-8" />

      <div className="mt-10">
        <PracticePaperGrid counts={counts} query={q} />
      </div>
    </div>
  );
}
