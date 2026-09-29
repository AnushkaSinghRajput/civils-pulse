import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl flex-col justify-center px-4 py-16">
        <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--brand)] sm:text-7xl">
          CivilsPulse
        </p>
        <h1 className="mt-6 max-w-2xl text-2xl font-medium leading-snug text-[var(--foreground)] sm:text-3xl">
          Verified UPSC PYQs. Reproducible mocks. Honest analytics.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted-fg)]">
          Every question traces to an official UPSC source and passes human
          verification before you see it. Scores are deterministic. AI insights —
          when they arrive — will never be confused with official evaluation.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register">
            <Button size="lg">Start preparing</Button>
          </Link>
          <Link href="/pyq">
            <Button size="lg" variant="outline">
              Browse PYQs
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
