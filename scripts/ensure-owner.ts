import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const email = "anushkasinghrajputt@gmail.com";
  const password = "password123";
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
      plan: "PRO",
      name: "Anushka Singh Rajput",
      emailVerified: new Date(),
    },
    create: {
      email,
      name: "Anushka Singh Rajput",
      passwordHash,
      role: "ADMIN",
      plan: "PRO",
      emailVerified: new Date(),
    },
  });

  const ok = await bcrypt.compare(password, user.passwordHash!);
  console.log({
    id: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
    passwordOk: ok,
  });

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
