import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string | null;
  size?: "sm" | "md" | "lg" | "hero";
  showWordmark?: boolean;
  className?: string;
  priority?: boolean;
};

const sizes = {
  sm: { box: 36, word: "text-base" },
  md: { box: 44, word: "text-lg" },
  lg: { box: 72, word: "text-2xl" },
  hero: { box: 120, word: "text-4xl sm:text-5xl" },
};

export function BrandLogo({
  href = "/",
  size = "md",
  showWordmark = true,
  className,
  priority = false,
}: BrandLogoProps) {
  const s = sizes[size];
  const mark = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/brand/civilspulse-logo.jpg"
        alt="CivilsPulse"
        width={s.box}
        height={s.box}
        priority={priority}
        className="rounded-full object-cover shadow-sm ring-1 ring-[var(--border)]"
      />
      {showWordmark && (
        <span
          className={cn(
            "font-[family-name:var(--font-display)] font-semibold tracking-tight",
            s.word,
          )}
        >
          <span className="text-[var(--brand)]">Civils</span>
          <span className="text-[var(--accent)]">Pulse</span>
        </span>
      )}
    </span>
  );

  if (href === null) return mark;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="CivilsPulse home">
      {mark}
    </Link>
  );
}
