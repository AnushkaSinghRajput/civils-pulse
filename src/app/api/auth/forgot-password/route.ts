import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations";
import {
  createPasswordResetToken,
  passwordResetIdentifier,
  sendPasswordResetEmail,
} from "@/lib/password-reset";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    // Always return the same message to avoid account enumeration
    const okMessage = {
      ok: true,
      message: "If an account exists for that email, a reset link has been sent.",
    };

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true },
    });

    // Only credential accounts can reset a password
    if (!user?.passwordHash) {
      return NextResponse.json(okMessage);
    }

    const { raw, hashed } = createPasswordResetToken();
    const identifier = passwordResetIdentifier(email);
    const expires = new Date(Date.now() + RESET_TTL_MS);

    // Invalidate previous tokens for this identifier
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    await prisma.verificationToken.create({
      data: { identifier, token: hashed, expires },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(raw)}&email=${encodeURIComponent(email)}`;

    await sendPasswordResetEmail({ email, resetUrl });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "PASSWORD_RESET_REQUESTED",
        entityType: "User",
        entityId: user.id,
      },
    });

    const response: Record<string, unknown> = { ...okMessage };
    // Surface link only in development so local testing works without SMTP
    if (process.env.NODE_ENV === "development") {
      response.devResetUrl = resetUrl;
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Could not process request" }, { status: 500 });
  }
}
