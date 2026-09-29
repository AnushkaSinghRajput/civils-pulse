export type SeedUser = {
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN" | "INSTITUTION_ADMIN";
  plan: "FREE" | "PRO" | "INSTITUTION";
};

/**
 * Only real bootstrap accounts. Fake aspirant emails are intentionally omitted.
 * New users appear here after they register or sign in.
 */
export const SEED_USERS: SeedUser[] = [
  {
    email: "anushkasinghrajputt@gmail.com",
    name: "Anushka Singh Rajput",
    role: "ADMIN",
    plan: "PRO",
  },
];

/** Local demo emails previously seeded — purged on seed so admin Users stays real. */
export const FAKE_USER_EMAIL_SUFFIX = "@civilspulse.local";
