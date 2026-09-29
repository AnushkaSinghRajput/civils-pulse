import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileSearch,
  Pencil,
  ShieldCheck,
  BarChart3,
  Timer,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Dashboard" };

const trust = [
  { label: "Official UPSC Sources", Icon: BookOpen },
  { label: "Human-Verified", Icon: ShieldCheck },
  { label: "Deterministic Scoring", Icon: BarChart3 },
] as const;

const jump = [
  { href: "/pyq", title: "PYQ Explorer", Icon: FileSearch, tone: "bg-[var(--brand-soft)] text-[var(--brand)]" },
  { href: "/mocks", title: "Mock Tests", Icon: Timer, tone: "bg-[var(--accent-soft)] text-[var(--accent)]" },
  { href: "/dashboard#performance", title: "Performance", Icon: BarChart3, tone: "bg-[var(--surface-2)] text-[var(--muted-fg)]" },
  { href: "/practice", title: "Mains Practice", Icon: Pencil, tone: "bg-[var(--accent-soft)] text-[#8b6914]" },
] as const;

export default async function DashboardPage() {
  const session = await requireSession();
  const [attempts, topicStats, topics] = await Promise.all([
    prisma.mockAttempt.findMany({
      where: { userId: session.user.id, status: { in: ["SUBMITTED", "EXPIRED"] } },
      orderBy: { submittedAt: "desc" },
      take: 4,
      include: { template: true },
    }),
    prisma.userTopicStat.findMany({
      where: { userId: session.user.id },
      orderBy: { accuracy: "asc" },
      take: 4,
    }),
    prisma.topic.findMany({ select: { id: true, slug: true, name: true } }),
  ]);
  const names = new Map(topics.map((t) => [t.id, t.name]));
  const slugs = new Map(topics.map((t) => [t.id, t.slug]));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:pt-12">
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.15] text-[var(--brand)] sm:text-5xl">
            Practice UPSC with{" "}
            <span className="text-[var(--accent)]">verified</span> questions.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/mocks">
              <Button size="lg">
                Start a Mock <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pyq">
              <Button size="lg" variant="outline">
                Browse PYQs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
            {trust.map(({ label, Icon }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-[var(--muted-fg)]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-[4%] rounded-full border border-[var(--accent)]/40" />
          <div className="absolute inset-[12%] rounded-full border border-[var(--accent)]/25" />
          <div className="absolute inset-[20%] overflow-hidden rounded-full bg-[var(--surface)] shadow-[0_24px_60px_rgba(13,49,49,0.12)] ring-1 ring-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/civilspulse-logo.jpg"
              alt="CivilsPulse"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">Jump in</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {jump.map(({ href, title, Icon, tone }) => (
            <Link
              key={title}
              href={href}
              className="group flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 transition hover:border-[var(--brand)] hover:shadow-[0_12px_32px_rgba(13,49,49,0.08)]"
            >
              <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1 text-sm font-semibold text-[var(--brand)]">{title}</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-fg)] transition group-hover:border-[var(--brand)] group-hover:text-[var(--brand)]">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="performance" className="mt-12 scroll-mt-24 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--brand)]">Recent mocks</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {attempts.length === 0 && <li className="text-[var(--muted-fg)]">No attempts yet — start a mock to track scores.</li>}
            {attempts.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 border-b border-[var(--border)]/60 py-2">
                <span className="truncate">{a.template?.title ?? a.mode}</span>
                <Link href={`/mocks/${a.id}`}><Badge>{a.rawScore}/{a.maxScore}</Badge></Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--brand)]">Focus areas</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {topicStats.length === 0 && <li className="text-[var(--muted-fg)]">Weak topics appear after you attempt mocks.</li>}
            {topicStats.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2 border-b border-[var(--border)]/60 py-2">
                <Link href={`/pyq?topic=${slugs.get(t.topicId) ?? ""}`} className="truncate hover:underline">
                  {names.get(t.topicId) ?? t.topicId}
                </Link>
                <Badge tone={t.accuracy < 0.5 ? "danger" : "success"}>{formatPercent(t.accuracy)}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
