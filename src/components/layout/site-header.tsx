import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/pyq", label: "PYQ Explorer" },
  { href: "/mocks", label: "Mocks" },
  { href: "/dashboard", label: "Dashboard" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--brand)]">
            CivilsPulse
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-[var(--muted-fg)] md:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[var(--foreground)]">
                {item.label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="hover:text-[var(--foreground)]">
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <span className="hidden text-xs text-[var(--muted-fg)] sm:inline">
                {session.user.email} · {session.user.plan}
              </span>
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
