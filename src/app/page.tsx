import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    title: "Official provenance",
    body: "Every PYQ keeps its UPSC PDF link, year, paper, and verification status.",
  },
  {
    title: "Human verification",
    body: "Extracted items never reach students until an admin approves them.",
  },
  {
    title: "Honest scoring",
    body: "Prelims mocks use server timers, negative marking, and reproducible marks.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <BrandLogo size="lg" href={null} priority className="mb-6" />
          <h1 className="max-w-xl font-[family-name:var(--font-display)] text-3xl leading-snug text-[var(--brand)] sm:text-4xl">
            Prepare with verified UPSC PYQs — not unverified dumps.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--muted-fg)]">
            CivilsPulse is built for Prelims authenticity first: subject-tagged previous-year
            questions, topic-wise and full-length mocks, and clear analytics you can trust.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg">Start preparing</Button>
            </Link>
            <Link href="/pyq">
              <Button size="lg" variant="outline">
                Explore PYQs
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-4 rounded-full bg-[var(--accent-soft)]/60 blur-2xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/civilspulse-logo.jpg"
            alt="CivilsPulse emblem — teal C with gold dome"
            className="relative mx-auto w-full max-w-sm rounded-full shadow-[0_24px_60px_rgba(13,49,49,0.18)] ring-1 ring-[var(--border)]"
          />
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--surface)]/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title}>
              <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--brand)]">
                {p.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-fg)]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
