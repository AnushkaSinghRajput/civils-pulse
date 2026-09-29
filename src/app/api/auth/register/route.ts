import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
      },
      select: { id: true, email: true },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "USER_REGISTERED",
        entityType: "User",
        entityId: user.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
