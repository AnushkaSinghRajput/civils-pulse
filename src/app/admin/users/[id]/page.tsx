import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "User detail (Admin)",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminUserDetailPage({ params }: Props) {
  const session = await requireRole(["ADMIN"]);
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      accounts: {
        select: { provider: true, type: true, providerAccountId: true },
      },
      memberships: {
        select: {
          role: true,
          createdAt: true,
          organization: { select: { name: true, slug: true, plan: true } },
        },
      },
      mockAttempts: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          mode: true,
          rawScore: true,
          maxScore: true,
          startedAt: true,
          submittedAt: true,
          template: { select: { title: true } },
        },
      },
      _count: {
        select: {
          mockAttempts: true,
          verifications: true,
          auditLogs: true,
        },
      },
    },
  });

  if (!user) notFound();

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "ADMIN_USER_DETAIL_VIEWED",
      entityType: "User",
      entityId: user.id,
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <AdminNav current="users" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--brand)]">
            {user.name ?? "Unnamed user"}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-fg)]">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="brand">{user.role}</Badge>
            <Badge tone="warn">{user.plan}</Badge>
            <Badge tone={user.emailVerified ? "success" : "danger"}>
              {user.emailVerified ? "Email verified" : "Email unverified"}
            </Badge>
          </div>
        </div>
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            Back to directory
          </Button>
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Mock attempts" value={String(user._count.mockAttempts)} />
        <Stat label="Verifications done" value={String(user._count.verifications)} />
        <Stat label="Audit events" value={String(user._count.auditLogs)} />
        <Stat label="Joined" value={user.createdAt.toLocaleDateString()} />
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-medium text-[var(--brand)]">Account</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="User ID" value={user.id} mono />
            <Row label="Created" value={user.createdAt.toLocaleString()} />
            <Row label="Updated" value={user.updatedAt.toLocaleString()} />
            <Row
              label="Email verified at"
              value={user.emailVerified ? user.emailVerified.toLocaleString() : "—"}
            />
            <Row
              label="Auth providers"
              value={
                user.accounts.length
                  ? user.accounts.map((a) => a.provider).join(", ")
                  : "credentials"
              }
            />
          </dl>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-medium text-[var(--brand)]">Organizations</h2>
          {user.memberships.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted-fg)]">No organization memberships.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {user.memberships.map((m, i) => (
                <li key={`${m.organization.slug}-${i}`} className="flex justify-between gap-2">
                  <span>
                    {m.organization.name}{" "}
                    <span className="text-xs text-[var(--muted-fg)]">({m.organization.slug})</span>
                  </span>
                  <Badge>{m.role}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="font-medium text-[var(--brand)]">Recent mock attempts</h2>
        {user.mockAttempts.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-fg)]">No attempts yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--border)]">
            {user.mockAttempts.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-medium">{a.template?.title ?? a.mode}</p>
                  <p className="text-xs text-[var(--muted-fg)]">
                    {a.startedAt.toLocaleString()}
                    {a.submittedAt ? ` · submitted ${a.submittedAt.toLocaleString()}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{a.status}</Badge>
                  {a.rawScore != null && (
                    <Badge tone="brand">
                      {a.rawScore}/{a.maxScore}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">{label}</p>
      <p className="mt-2 text-xl font-medium text-[var(--brand)]">{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-[var(--muted-fg)]">{label}</dt>
      <dd className={mono ? "font-mono text-xs break-all sm:text-right" : "sm:text-right"}>
        {value}
      </dd>
    </div>
  );
}
