import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warn" | "danger" | "brand";
  className?: string;
}) {
  const tones = {
    neutral: "bg-[var(--surface-2)] text-[var(--foreground)]",
    success: "bg-emerald-100 text-emerald-900",
    warn: "bg-amber-100 text-amber-950",
    danger: "bg-red-100 text-red-900",
    brand: "bg-[var(--brand-soft)] text-[var(--brand)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
