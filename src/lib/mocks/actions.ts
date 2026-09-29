"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { scorePrelimsAttempt } from "@/lib/scoring";

export async function saveAnswer(input: {
  attemptId: string;
  questionId: string;
  selectedOption: "A" | "B" | "C" | "D" | null;
  timeSpentMs?: number;
  markedForReview?: boolean;
}) {
  const session = await requireSession();
  const attempt = await prisma.mockAttempt.findFirst({
    where: { id: input.attemptId, userId: session.user.id },
  });
  if (!attempt) throw new Error("NOT_FOUND");
  if (attempt.status !== "IN_PROGRESS") throw new Error("LOCKED");
  if (new Date() > attempt.endsAt) {
    await expireAndScore(attempt.id);
    throw new Error("EXPIRED");
  }
  if (!attempt.questionIds.includes(input.questionId)) throw new Error("INVALID_QUESTION");

  await prisma.attemptAnswer.upsert({
    where: {
      attemptId_questionId: {
        attemptId: input.attemptId,
        questionId: input.questionId,
      },
    },
    create: {
      attemptId: input.attemptId,
      questionId: input.questionId,
      selectedOption: input.selectedOption,
      timeSpentMs: input.timeSpentMs ?? 0,
      markedForReview: input.markedForReview ?? false,
      answeredAt: input.selectedOption ? new Date() : null,
    },
    update: {
      selectedOption: input.selectedOption,
      timeSpentMs: input.timeSpentMs ?? 0,
      markedForReview: input.markedForReview ?? false,
      answeredAt: input.selectedOption ? new Date() : null,
    },
  });

  revalidatePath(`/mocks/${input.attemptId}`);
}

export async function submitAttempt(attemptId: string) {
  const session = await requireSession();
  const attempt = await prisma.mockAttempt.findFirst({
    where: { id: attemptId, userId: session.user.id },
  });
  if (!attempt) throw new Error("NOT_FOUND");
  if (attempt.status !== "IN_PROGRESS") throw new Error("LOCKED");

  await finalizeScore(attemptId, session.user.id);
  revalidatePath(`/mocks/${attemptId}`);
  revalidatePath("/dashboard");
}

async function expireAndScore(attemptId: string) {
  const attempt = await prisma.mockAttempt.findUnique({ where: { id: attemptId } });
  if (!attempt || attempt.status !== "IN_PROGRESS") return;
  await finalizeScore(attemptId, attempt.userId, "EXPIRED");
}

async function finalizeScore(
  attemptId: string,
  userId: string,
  status: "SUBMITTED" | "EXPIRED" = "SUBMITTED",
) {
  const attempt = await prisma.mockAttempt.findFirst({
    where: { id: attemptId, userId },
    include: {
      answers: {
        include: {
          question: { select: { id: true, correctOption: true } },
        },
      },
    },
  });
  if (!attempt || attempt.status !== "IN_PROGRESS") return;

  // Preserve question order from snapshot
  const byId = new Map(attempt.answers.map((a) => [a.questionId, a]));
  const ordered = attempt.questionIds.map((id) => byId.get(id)).filter(Boolean) as typeof attempt.answers;

  const breakdown = scorePrelimsAttempt({
    answers: ordered.map((a) => ({
      questionId: a.questionId,
      selectedOption: a.selectedOption,
      correctOption: a.question.correctOption,
    })),
    marksPerQuestion: attempt.marksPerQuestion,
    negativeMarking: attempt.negativeMarking,
  });

  await prisma.$transaction([
    ...breakdown.perQuestion.map((pq) =>
      prisma.attemptAnswer.update({
        where: {
          attemptId_questionId: { attemptId, questionId: pq.questionId },
        },
        data: { isCorrect: pq.result === "correct" ? true : pq.result === "incorrect" ? false : null },
      }),
    ),
    prisma.mockAttempt.update({
      where: { id: attemptId },
      data: {
        status,
        submittedAt: new Date(),
        correctCount: breakdown.correctCount,
        incorrectCount: breakdown.incorrectCount,
        unansweredCount: breakdown.unansweredCount,
        rawScore: breakdown.rawScore,
        maxScore: breakdown.maxScore,
        negativeImpact: breakdown.negativeImpact,
        scorePayload: breakdown,
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: userId,
        action: status === "SUBMITTED" ? "MOCK_SUBMITTED" : "MOCK_EXPIRED",
        entityType: "MockAttempt",
        entityId: attemptId,
        metadata: {
          rawScore: breakdown.rawScore,
          maxScore: breakdown.maxScore,
        },
      },
    }),
  ]);

  // Refresh basic topic stats
  const topicLinks = await prisma.questionTopic.findMany({
    where: { questionId: { in: attempt.questionIds } },
  });
  const answerMap = new Map(
    breakdown.perQuestion.map((p) => [p.questionId, p.result]),
  );

  for (const link of topicLinks) {
    const result = answerMap.get(link.questionId);
    if (!result || result === "unanswered") continue;
    const existing = await prisma.userTopicStat.findUnique({
      where: { userId_topicId: { userId, topicId: link.topicId } },
    });
    const attempted = (existing?.attempted ?? 0) + 1;
    const correct = (existing?.correct ?? 0) + (result === "correct" ? 1 : 0);
    const incorrect = (existing?.incorrect ?? 0) + (result === "incorrect" ? 1 : 0);
    await prisma.userTopicStat.upsert({
      where: { userId_topicId: { userId, topicId: link.topicId } },
      create: {
        userId,
        topicId: link.topicId,
        attempted,
        correct,
        incorrect,
        accuracy: correct / attempted,
        lastAttemptAt: new Date(),
      },
      update: {
        attempted,
        correct,
        incorrect,
        accuracy: correct / attempted,
        lastAttemptAt: new Date(),
      },
    });
  }
}
