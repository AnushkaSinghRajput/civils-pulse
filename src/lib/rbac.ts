import { Role, Plan } from "@/generated/prisma/client";

export type SessionUser = {
  id: string;
  role: Role;
  plan: Plan;
  email?: string | null;
  name?: string | null;
};

export function isAdmin(user: SessionUser | null | undefined): boolean {
  return user?.role === Role.ADMIN;
}

export function isInstitutionAdmin(user: SessionUser | null | undefined): boolean {
  return user?.role === Role.INSTITUTION_ADMIN || user?.role === Role.ADMIN;
}

export function canAccessAdmin(user: SessionUser | null | undefined): boolean {
  return isAdmin(user);
}

/** Server-side entitlement checks — never trust the client. */
export function canStartMock(user: SessionUser | null | undefined, usedThisMonth: number): boolean {
  if (!user) return false;
  if (user.plan === Plan.PRO || user.plan === Plan.INSTITUTION) return true;
  // Free: limited mock attempts per month
  const FREE_MONTHLY_MOCKS = 3;
  return usedThisMonth < FREE_MONTHLY_MOCKS;
}

export function canUseAdvancedAnalytics(user: SessionUser | null | undefined): boolean {
  if (!user) return false;
  return user.plan === Plan.PRO || user.plan === Plan.INSTITUTION;
}

export function assertRole(
  user: SessionUser | null | undefined,
  allowed: Role[],
): asserts user is SessionUser {
  if (!user || !allowed.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
}
