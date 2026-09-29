import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Users (Admin)",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireRole(["ADMIN"]);
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const role = typeof sp.role === "string" ? sp.role : "";
  const plan = typeof sp.plan === "string" ? sp.plan : "";

  const where: Prisma.UserWhereInput = {
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(role === "STUDENT" || role === "ADMIN" || role === "INSTITUTION_ADMIN"
      ? { role }
      : {}),
    ...(plan === "FREE" || plan === "PRO" || plan === "INSTITUTION" ? { plan } : {}),
  };

  const [users, total, roleStats, planStats] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            mockAttempts: true,
            memberships: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.user.groupBy({ by: ["plan"], _count: true }),
  ]);

  // Audit: admin opened confidential user directory (no PII in metadata beyond counts)
  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "ADMIN_USERS_VIEWED",
      entityType: "UserDirectory",
      metadata: {
        resultCount: users.length,
        filterQ: Boolean(q),
        filterRole: role || null,
        filterPlan: plan || null,
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <AdminNav current="users" />

      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
        Platform users
      </h1>
      <p className="mt-2 text-sm text-[var(--muted-fg)]">
        {total} account{total === 1 ? "" : "s"} matching filters. Password hashes are never shown.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {roleStats.map((s) => (
          <Badge key={s.role} tone={s.role === "ADMIN" ? "brand" : "neutral"}>
            {s.role}: {s._count}
          </Badge>
        ))}
        {planStats.map((s) => (
          <Badge key={s.plan} tone="warn">
            {s.plan}: {s._count}
          </Badge>
        ))}
      </div>

      <form className="mt-6 grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-4">
        <Input
          name="q"
          placeholder="Search name or email"
          defaultValue={q}
          className="md:col-span-2"
          autoComplete="off"
        />
        <select
          name="role"
          defaultValue={role}
          className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-sm"
        >
          <option value="">All roles</option>
          <option value="STUDENT">STUDENT</option>
          <option value="ADMIN">ADMIN</option>
          <option value="INSTITUTION_ADMIN">INSTITUTION_ADMIN</option>
        </select>
        <select
          name="plan"
          defaultValue={plan}
          className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-sm"
        >
          <option value="">All plans</option>
          <option value="FREE">FREE</option>
          <option value="PRO">PRO</option>
          <option value="INSTITUTION">INSTITUTION</option>
        </select>
        <Button type="submit" className="md:col-span-4 md:w-fit">
          Filter
        </Button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-xs uppercase tracking-wide text-[var(--muted-fg)]">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Mocks</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[var(--muted-fg)]">
                  No users match these filters.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--foreground)]">{u.name ?? "—"}</p>
                    <p className="text-xs text-[var(--muted-fg)]">{u.email}</p>
                    {!u.emailVerified && (
                      <span className="mt-1 inline-block text-[10px] text-amber-800">
                        email unverified
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.role === "ADMIN" ? "brand" : "neutral"}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="warn">{u.plan}</Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-fg)]">{u._count.mockAttempts}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-fg)]">
                    {u.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-xs font-medium text-[var(--brand)] underline"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
