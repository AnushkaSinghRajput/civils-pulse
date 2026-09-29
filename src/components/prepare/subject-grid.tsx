import Link from "next/link";
import { SUBJECT_CARDS, subjectMockHref, subjectPyqHref } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

type Counts = Record<string, number>;

export function SubjectPrepGrid({
  counts = {},
}: {
  counts?: Counts;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--brand)]">
        Prepare by subject
      </h2>
      <p className="mt-1 text-sm text-[var(--muted-fg)]">
        Filter verified PYQs or start a subject drill for standard Prelims paper hubs.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECT_CARDS.map((card) => {
          const n = counts[card.slug] ?? 0;
          return (
            <article
              key={card.slug}
              className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm"
            >
              <div
                className="px-4 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: card.accent }}
              >
                {card.title}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm text-[var(--muted-fg)]">{card.subtitle}</p>
                <p className="mt-2 text-xs text-[var(--muted-fg)]">
                  {n} verified PYQ{n === 1 ? "" : "s"} ready
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link href={subjectPyqHref(card)}>
                    <Button className="w-full" size="sm">
                      Explore PYQs
                    </Button>
                  </Link>
                  <Link href={subjectMockHref(card)}>
                    <Button className="w-full" size="sm" variant="outline">
                      Take subject mock
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
