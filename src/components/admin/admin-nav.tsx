import Link from "next/link";

const links = [
  { href: "/admin", label: "Verification" },
  { href: "/admin/users", label: "Users" },
];

export function AdminNav({ current }: { current: "verification" | "users" }) {
  return (
    <div className="mb-8 space-y-4">
      <div className="rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--brand)]">
        <strong>Confidential admin area.</strong> User identities and account details are visible
        only to ADMIN roles. Do not share screenshots or exports outside the trust boundary.
      </div>
      <nav className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-3 text-sm">
        {links.map((link) => {
          const active =
            (current === "verification" && link.href === "/admin") ||
            (current === "users" && link.href === "/admin/users");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "rounded-md border border-[var(--border)] bg-[var(--brand-soft)] px-3 py-1.5 font-medium text-[var(--brand)]"
                  : "rounded-md border border-transparent px-3 py-1.5 text-[var(--muted-fg)] hover:bg-[var(--surface-2)] hover:text-[var(--brand)]"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
