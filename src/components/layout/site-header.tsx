import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/pyq", label: "PYQ Explorer" },
  { href: "/mocks", label: "Mocks" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-8">
          <BrandLogo size="sm" priority />
          <nav className="hidden items-center gap-5 text-sm text-[var(--muted-fg)] md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[var(--brand)]"
              >
                {item.label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" && (
              <>
                <Link href="/admin" className="transition-colors hover:text-[var(--brand)]">
                  Admin
                </Link>
                <Link href="/admin/users" className="transition-colors hover:text-[var(--brand)]">
                  Users
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <span className="hidden max-w-[12rem] truncate text-xs text-[var(--muted-fg)] sm:inline">
                {session.user.name ?? session.user.email}
                <span className="text-[var(--accent)]"> · {session.user.plan}</span>
              </span>
              <Link href="/practice">
                <Button size="sm" variant="outline">
                  Practice
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
