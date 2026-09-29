import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandLogo size="sm" />
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--muted-fg)]">
            Verified UPSC previous-year questions with official-source provenance.
            Human review before publication. Deterministic scoring.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-fg)]">
          <Link href="/pyq" className="hover:text-[var(--brand)]">
            PYQs
          </Link>
          <Link href="/mocks" className="hover:text-[var(--brand)]">
            Mocks
          </Link>
          <Link href="/login" className="hover:text-[var(--brand)]">
            Log in
          </Link>
        </div>
      </div>
    </footer>
  );
}
