import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/generated/prisma/client";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

export async function requireRole(roles: Role[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) redirect("/dashboard");
  return session;
}
