import { createHash, randomBytes } from "node:crypto";

export function createPasswordResetToken() {
  const raw = randomBytes(32).toString("hex");
  const hashed = hashPasswordResetToken(raw);
  return { raw, hashed };
}

export function hashPasswordResetToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export function passwordResetIdentifier(email: string) {
  return `password-reset:${email.toLowerCase()}`;
}

/** Dev-friendly mailer — logs the link; wire SMTP later via env. */
export async function sendPasswordResetEmail(input: {
  email: string;
  resetUrl: string;
}) {
  if (process.env.SMTP_HOST && process.env.SMTP_FROM) {
    // Placeholder for production SMTP (nodemailer / Resend / etc.)
    console.info("[mail] password reset queued", {
      to: input.email,
      from: process.env.SMTP_FROM,
    });
  }

  console.info("[mail] password reset link", {
    to: input.email,
    resetUrl: input.resetUrl,
  });
}
