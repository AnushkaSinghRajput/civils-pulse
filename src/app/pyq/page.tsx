import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { QuestionCard } from "@/components/pyq/question-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JumpInBar } from "@/components/prepare/jump-in";
import { SUBJECT_CARDS } from "@/lib/catalog";
import { PaperCode, Language, Prisma } from "@/generated/prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "PYQ Explorer" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PyqExplorerPage({ searchParams }: { searchParams: SearchParams }) {
  await requireSession();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const year = typeof sp.year === "string" ? Number(sp.year) : undefined;
  const paper = typeof sp.paper === "string" ? (sp.paper as PaperCode) : undefined;
  const language = typeof sp.language === "string" ? (sp.language as Language) : undefined;
  const topic = typeof sp.topic === "string" ? sp.topic : undefined;
  const subjectGroup = typeof sp.subjectGroup === "string" ? sp.subjectGroup : undefined;
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
  const pageSize = 10;

  const group = SUBJECT_CARDS.find((c) => c.slug === subjectGroup);
  const groupTopicSlugs = group?.topicSlugs ?? [];

  const where: Prisma.QuestionWhereInput = {
    verificationStatus: "APPROVED",
    publishedAt: { not: null },
    ...(year && !Number.isNaN(year) ? { year } : {}),
    ...(paper && Object.values(PaperCode).includes(paper) ? { paper } : {}),
    ...(language && Object.values(Language).includes(language) ? { language } : {}),
    ...(topic
      ? { topics: { some: { topic: { slug: topic } } } }
      : groupTopicSlugs.length
        ? { topics: { some: { topic: { slug: { in: groupTopicSlugs } } } } }
        : {}),
    ...(q
      ? {
          OR: [
            { stem: { contains: q, mode: "insensitive" } },
            { explanation: { contains: q, mode: "insensitive" } },
            { subject: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, questions, topics] = await Promise.all([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      orderBy: [{ year: "desc" }, { questionNumber: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        topics: { include: { topic: true } },
      },
    }),
    prisma.topic.findMany({
      where: { parentId: null },
      orderBy: [{ subject: "asc" }, { name: "asc" }],
      take: 60,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeLabel =
    group?.title ??
    (paper ? String(paper).replaceAll("_", " ") : null) ??
    (topic ? topics.find((t) => t.slug === topic)?.name : null);

  function pageHref(nextPage: number) {
    return `?${new URLSearchParams({
      ...(q ? { q } : {}),
      ...(year ? { year: String(year) } : {}),
      ...(paper ? { paper } : {}),
      ...(language ? { language } : {}),
      ...(topic ? { topic } : {}),
      ...(subjectGroup ? { subjectGroup } : {}),
      page: String(nextPage),
    }).toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
        PYQ Explorer
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted-fg)]">
        Human-verified questions with official UPSC source links. Filter by paper or subject hub to
        start preparing immediately.
      </p>
      {activeLabel && (
        <p className="mt-3 text-sm font-medium text-[var(--brand)]">
          Active filter: {activeLabel} · {total} question{total === 1 ? "" : "s"}
        </p>
      )}

      <JumpInBar className="mt-6" />

      <form className="mt-6 grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-6">
        <Input
          name="q"
          placeholder="Search keywords / subject"
          defaultValue={q}
          className="md:col-span-2"
        />
        <Input
          name="year"
          type="number"
          min={2014}
          max={2026}
          placeholder="Year"
          defaultValue={year || ""}
        />
        <select
          name="paper"
          defaultValue={paper ?? ""}
          className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-sm"
        >
          <option value="">All papers</option>
          <option value="PRELIMS_GS1">Prelims GS-I</option>
          <option value="PRELIMS_CSAT">CSAT</option>
          <option value="MAINS_GS1">Mains GS-I</option>
          <option value="MAINS_GS2">Mains GS-II</option>
          <option value="MAINS_GS3">Mains GS-III</option>
          <option value="MAINS_GS4">Mains GS-IV</option>
          <option value="MAINS_ESSAY">Essay</option>
        </select>
        <select
          name="subjectGroup"
          defaultValue={subjectGroup ?? ""}
          className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-sm"
        >
          <option value="">Subject hub</option>
          {SUBJECT_CARDS.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          name="topic"
          defaultValue={topic ?? ""}
          className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-sm"
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.slug}>
              {t.subject} — {t.name}
            </option>
          ))}
        </select>
        <input type="hidden" name="language" value={language ?? ""} />
        <Button type="submit" className="md:col-span-6 md:w-fit">
          Apply filters
        </Button>
      </form>

      <p className="mt-4 text-sm text-[var(--muted-fg)]">
        {total} verified question{total === 1 ? "" : "s"}
      </p>

      <div className="mt-2">
        {questions.length === 0 ? (
          <p className="py-16 text-center text-[var(--muted-fg)]">
            No verified questions match these filters yet.
          </p>
        ) : (
          questions.map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              year={question.year}
              paper={question.paper}
              language={question.language}
              stem={question.stem}
              optionA={question.optionA}
              optionB={question.optionB}
              optionC={question.optionC}
              optionD={question.optionD}
              officialSourceUrl={question.officialSourceUrl}
              kind={question.kind}
              topics={question.topics.map((t) => t.topic.name)}
              showAnswer
              correctOption={question.correctOption}
              explanation={question.explanation}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between text-sm">
          <a
            className={page <= 1 ? "pointer-events-none opacity-40" : "underline"}
            href={pageHref(page - 1)}
          >
            Previous
          </a>
          <span>
            Page {page} / {totalPages}
          </span>
          <a
            className={page >= totalPages ? "pointer-events-none opacity-40" : "underline"}
            href={pageHref(page + 1)}
          >
            Next
          </a>
        </div>
      )}
    </div>
  );
}
