"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/session";
import type { VerificationStatus } from "@/generated/prisma/client";

export async function verifyQuestion(
  questionId: string,
  toStatus: Extract<VerificationStatus, "APPROVED" | "REJECTED" | "NEEDS_FIX" | "IN_REVIEW">,
  notes?: string,
) {
  const session = await requireRole(["ADMIN"]);

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) throw new Error("NOT_FOUND");

  const publishedAt = toStatus === "APPROVED" ? new Date() : null;

  await prisma.$transaction([
    prisma.question.update({
      where: { id: questionId },
      data: {
        verificationStatus: toStatus,
        publishedAt: toStatus === "APPROVED" ? publishedAt : question.publishedAt && toStatus !== "REJECTED" ? question.publishedAt : null,
      },
    }),
    prisma.questionVerification.create({
      data: {
        questionId,
        reviewerId: session.user.id,
        fromStatus: question.verificationStatus,
        toStatus,
        notes,
        checklist: {
          stem: true,
          options: true,
          answer: true,
          sourceUrl: true,
        },
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: `QUESTION_${toStatus}`,
        entityType: "Question",
        entityId: questionId,
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/pyq");
}
