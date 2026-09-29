export type SeedUser = {
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN" | "INSTITUTION_ADMIN";
  plan: "FREE" | "PRO" | "INSTITUTION";
};

/** 20 platform users for local/demo authenticity (plus login-ready passwords via seed). */
export const SEED_USERS: SeedUser[] = [
  {
    email: "anushkasinghrajputt@gmail.com",
    name: "Anushka Singh Rajput",
    role: "ADMIN",
    plan: "PRO",
  },
  {
    email: "admin@civilspulse.local",
    name: "CivilsPulse Admin",
    role: "ADMIN",
    plan: "PRO",
  },
  { email: "aarav.sharma@civilspulse.local", name: "Aarav Sharma", role: "STUDENT", plan: "PRO" },
  { email: "diya.patel@civilspulse.local", name: "Diya Patel", role: "STUDENT", plan: "FREE" },
  { email: "kabir.mehta@civilspulse.local", name: "Kabir Mehta", role: "STUDENT", plan: "PRO" },
  { email: "ananya.iyer@civilspulse.local", name: "Ananya Iyer", role: "STUDENT", plan: "FREE" },
  { email: "rohan.gupta@civilspulse.local", name: "Rohan Gupta", role: "STUDENT", plan: "PRO" },
  { email: "isha.nair@civilspulse.local", name: "Isha Nair", role: "STUDENT", plan: "FREE" },
  { email: "vihaan.singh@civilspulse.local", name: "Vihaan Singh", role: "STUDENT", plan: "PRO" },
  { email: "sara.khan@civilspulse.local", name: "Sara Khan", role: "STUDENT", plan: "FREE" },
  { email: "aditya.rao@civilspulse.local", name: "Aditya Rao", role: "STUDENT", plan: "PRO" },
  { email: "meera.joshi@civilspulse.local", name: "Meera Joshi", role: "STUDENT", plan: "FREE" },
  { email: "arjun.desai@civilspulse.local", name: "Arjun Desai", role: "STUDENT", plan: "PRO" },
  { email: "navya.reddy@civilspulse.local", name: "Navya Reddy", role: "STUDENT", plan: "FREE" },
  { email: "yash.malhotra@civilspulse.local", name: "Yash Malhotra", role: "STUDENT", plan: "PRO" },
  { email: "priya.chatterjee@civilspulse.local", name: "Priya Chatterjee", role: "STUDENT", plan: "FREE" },
  { email: "kunal.bansal@civilspulse.local", name: "Kunal Bansal", role: "STUDENT", plan: "PRO" },
  { email: "tanya.verma@civilspulse.local", name: "Tanya Verma", role: "STUDENT", plan: "FREE" },
  { email: "harsh.pillai@civilspulse.local", name: "Harsh Pillai", role: "STUDENT", plan: "PRO" },
  { email: "riya.saxena@civilspulse.local", name: "Riya Saxena", role: "STUDENT", plan: "FREE" },
];
