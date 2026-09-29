"use server";

import { redirect } from "next/navigation";
import { startOfMonth } from "date-fns";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { canStartMock } from "@/lib/rbac";

export async function startMockAttempt(templateId: string) {
  const session = await requireSession();

  const usedThisMonth = await prisma.mockAttempt.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: startOfMonth(new Date()) },
      status: { in: ["SUBMITTED", "IN_PROGRESS", "EXPIRED"] },
    },
  });

  if (
    !canStartMock(
      { id: session.user.id, role: session.user.role, plan: session.user.plan },
      usedThisMonth,
    )
  ) {
    throw new Error("MOCK_LIMIT_REACHED");
  }

  const template = await prisma.mockTemplate.findFirst({
    where: { id: templateId, isPublished: true },
  });
  if (!template) throw new Error("TEMPLATE_NOT_FOUND");

  const where = {
    verificationStatus: "APPROVED" as const,
    publishedAt: { not: null },
    paper: template.paper,
    examType: (template.paper.startsWith("MAINS") ? "MAINS" : "PRELIMS") as
      | "PRELIMS"
      | "MAINS",
    ...(template.paper.startsWith("MAINS") ? {} : { correctOption: { not: null } }),
    ...(template.yearFilter.length
      ? { year: { in: template.yearFilter } }
      : {}),
    ...(template.topicIds.length
      ? { topics: { some: { topicId: { in: template.topicIds } } } }
      : {}),
  };

  const pool = await prisma.question.findMany({
    where,
    select: { id: true },
  });

  if (pool.length === 0) {
    throw new Error("INSUFFICIENT_QUESTIONS");
  }

  const take = Math.min(template.questionCount, pool.length);

  // Deterministic-enough shuffle for MVP (Fisher–Yates with Math.random)
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const questionIds = shuffled.slice(0, take).map((q) => q.id);

  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + template.durationMinutes * 60_000);

  const attempt = await prisma.mockAttempt.create({
    data: {
      userId: session.user.id,
      templateId: template.id,
      mode: template.mode,
      paper: template.paper,
      questionIds,
      startedAt,
      endsAt,
      durationMinutes: template.durationMinutes,
      negativeMarking: template.negativeMarking,
      marksPerQuestion: template.marksPerQuestion,
      answers: {
        create: questionIds.map((questionId) => ({ questionId })),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "MOCK_STARTED",
      entityType: "MockAttempt",
      entityId: attempt.id,
      metadata: { templateId },
    },
  });

  redirect(`/mocks/${attempt.id}`);
}
