import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const pyqSearchSchema = z.object({
  q: z.string().optional(),
  year: z.coerce.number().int().min(2014).max(2025).optional(),
  paper: z
    .enum([
      "PRELIMS_GS1",
      "PRELIMS_CSAT",
      "MAINS_GS1",
      "MAINS_GS2",
      "MAINS_GS3",
      "MAINS_GS4",
      "MAINS_ESSAY",
    ])
    .optional(),
  topic: z.string().optional(),
  language: z.enum(["EN", "HI"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export const verificationActionSchema = z.object({
  questionId: z.string().cuid(),
  toStatus: z.enum(["APPROVED", "REJECTED", "NEEDS_FIX", "IN_REVIEW"]),
  notes: z.string().max(2000).optional(),
});

export const startMockSchema = z.object({
  templateId: z.string().cuid().optional(),
  mode: z.enum(["FULL_LENGTH", "TOPIC_WISE", "CUSTOM"]).default("FULL_LENGTH"),
  topicIds: z.array(z.string()).optional(),
  questionCount: z.coerce.number().int().min(5).max(100).optional(),
});

export const saveAnswerSchema = z.object({
  attemptId: z.string().cuid(),
  questionId: z.string().cuid(),
  selectedOption: z.enum(["A", "B", "C", "D"]).nullable(),
  timeSpentMs: z.number().int().min(0).optional(),
  markedForReview: z.boolean().optional(),
});
