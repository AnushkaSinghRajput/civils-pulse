import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validations";
import {
  hashPasswordResetToken,
  passwordResetIdentifier,
} from "@/lib/password-reset";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const identifier = passwordResetIdentifier(email);
    const hashed = hashPasswordResetToken(parsed.data.token);

    const record = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: { identifier, token: hashed },
      },
    });

    if (!record || record.expires < new Date()) {
      if (record) {
        await prisma.verificationToken.delete({
          where: { identifier_token: { identifier, token: hashed } },
        });
      }
      return NextResponse.json(
        { error: "Reset link is invalid or expired" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: hashed } },
      }),
      prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: "PASSWORD_RESET_COMPLETED",
          entityType: "User",
          entityId: user.id,
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not reset password" }, { status: 500 });
  }
}
