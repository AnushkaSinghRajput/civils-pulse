import Link from "next/link";
import { Bookmark, Clock3, Star } from "lucide-react";
import { SUBJECT_CARDS, subjectMockHref, subjectPyqHref, type SubjectCard } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Counts = Record<string, number>;

function matchesQuery(card: SubjectCard, q: string) {
  if (!q) return true;
  const hay = `${card.title} ${card.subtitle} ${card.slug}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

export function PracticePaperGrid({
  counts = {},
  query = "",
}: {
  counts?: Counts;
  query?: string;
}) {
  const papers = SUBJECT_CARDS.filter((c) => matchesQuery(c, query));

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-fg)]">
          <Bookmark className="h-4 w-4 text-[var(--accent)]" aria-hidden />
          <span>Prepare by subject</span>
          <span className="text-[var(--brand)]">· {papers.length}</span>
        </div>
        <form
          className="flex w-full max-w-md gap-2 sm:justify-end"
          action="/practice"
          method="get"
        >
          <Input
            name="q"
            placeholder="Search subjects…"
            defaultValue={query}
            aria-label="Search subjects"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      {papers.length === 0 ? (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-12 text-center text-sm text-[var(--muted-fg)]">
          No subjects match “{query}”.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((card, index) => {
            const n = counts[card.slug] ?? 0;
            return (
              <article
                key={card.slug}
                className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-colors hover:border-[var(--brand)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white"
                    style={{ backgroundColor: card.accent }}
                    aria-hidden
                  >
                    <Bookmark className="h-4 w-4" />
                  </span>
                  <span className="text-xs text-[var(--muted-fg)]">#{index + 1}</span>
                </div>

                <h2 className="mt-4 text-base font-semibold leading-snug text-[var(--foreground)]">
                  {card.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted-fg)]">{card.subtitle}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--muted-fg)]">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {card.paper === "PRELIMS_CSAT" ? "CSAT · timed" : "Prelims · drill"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-[var(--accent)]" />
                    {n} verified PYQ{n === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Link href={subjectPyqHref(card)} className="block">
                    <Button className="w-full" size="sm">
                      Start practice
                    </Button>
                  </Link>
                  <Link href={subjectMockHref(card)} className="block">
                    <Button className={cn("w-full")} size="sm" variant="outline">
                      Take mock test
                    </Button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
