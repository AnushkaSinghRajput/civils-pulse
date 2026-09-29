import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { JumpInBar } from "@/components/prepare/jump-in";

export default function HomePage() {
  return (
    <div>
      <section className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <BrandLogo size="lg" href={null} priority className="mb-6" />
          <h1 className="max-w-xl font-[family-name:var(--font-display)] text-3xl leading-snug text-[var(--brand)] sm:text-4xl">
            Your clear path through UPSC subjects
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--muted-fg)]">
            Practise verified previous-year questions by paper and topic, then move into timed
            mocks when you feel ready. Built to keep Civil Services prep simple and focused.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button size="lg">Start preparing</Button>
            </Link>
            <Link href="/practice">
              <Button size="lg" variant="outline">
                View practice papers
              </Button>
            </Link>
          </div>
          <JumpInBar />
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-4 rounded-full bg-[var(--accent-soft)]/60 blur-2xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/civilspulse-logo.jpg"
            alt="CivilsPulse emblem with teal C and gold dome"
            className="relative mx-auto w-full max-w-sm rounded-full shadow-[0_24px_60px_rgba(13,49,49,0.18)] ring-1 ring-[var(--border)]"
          />
        </div>
      </section>
    </div>
  );
}
