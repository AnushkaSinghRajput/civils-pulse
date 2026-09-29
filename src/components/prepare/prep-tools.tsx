import Link from "next/link";
import { BookOpenCheck, Clock3, LayoutGrid, LineChart, Search } from "lucide-react";

const tools = [
  {
    href: "/practice",
    title: "Practice papers",
    description: "Full paper set in sequence. Start any subject.",
    icon: LayoutGrid,
  },
  {
    href: "/pyq",
    title: "PYQ Explorer",
    description: "Filter by year, paper, subject and topic.",
    icon: Search,
  },
  {
    href: "/mocks",
    title: "Mock tests",
    description: "Timed Prelims and CSAT papers.",
    icon: Clock3,
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Accuracy and attempts, by subject.",
    icon: LineChart,
  },
];

export function PrepTools() {
  return (
    <section className="mt-10">
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--brand)]">
        Your prep tools
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--brand)]"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brand-soft)] text-[var(--brand)]">
              <tool.icon className="h-4 w-4" aria-hidden />
            </span>
            <h3 className="mt-3 font-medium text-[var(--foreground)]">{tool.title}</h3>
            <p className="mt-1 text-sm text-[var(--muted-fg)]">{tool.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--brand)] group-hover:underline">
              Open <BookOpenCheck className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
