import Link from "next/link";
import { JUMP_IN } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function JumpInBar({ className }: { className?: string }) {
  return (
    <section className={cn("mt-10", className)}>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--brand)]">
        Jump in
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {JUMP_IN.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--brand)] transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]",
              item.key === "start-mock" &&
                "border-[var(--brand)] bg-[var(--brand)] text-[var(--surface)] hover:bg-[var(--brand-hover)] hover:text-[var(--surface)]",
            )}
            title={item.description}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
