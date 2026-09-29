import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { SEED_USERS, FAKE_USER_EMAIL_SUFFIX } from "./data/users";
import { SEED_TOPICS } from "./data/topics";
import { SEED_PYQS, SOURCE_PDFS } from "./data/pyqs";
import { PRELIMS_EXPANDED } from "./data/prelims-expanded";
import {
  SUBJECT_PRACTICE_PYQS,
  SUBJECT_PRACTICE_QUESTION_NUMBERS,
} from "./data/subject-practice";
import { MAINS_GS1_2026 } from "./data/mains-gs1-2026";
import { MAINS_GS2_2026 } from "./data/mains-gs2-2026";
import { MAINS_GS3_2026 } from "./data/mains-gs3-2026";
import { MAINS_GS4_2026 } from "./data/mains-gs4-2026";
import { MAINS_PDF } from "./data/mains-types";
import type { MainsSeed } from "./data/mains-types";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  // Remove fake local demo accounts so Users admin only shows real people
  const fakeUsers = await prisma.user.findMany({
    where: { email: { endsWith: FAKE_USER_EMAIL_SUFFIX } },
    select: { id: true, email: true },
  });
  if (fakeUsers.length) {
    const ids = fakeUsers.map((u) => u.id);
    await prisma.attemptAnswer.deleteMany({
      where: { attempt: { userId: { in: ids } } },
    });
    await prisma.mockAttempt.deleteMany({ where: { userId: { in: ids } } });
    await prisma.userTopicStat.deleteMany({ where: { userId: { in: ids } } });
    await prisma.questionVerification.deleteMany({ where: { reviewerId: { in: ids } } });
    await prisma.auditLog.deleteMany({ where: { actorId: { in: ids } } });
    await prisma.membership.deleteMany({ where: { userId: { in: ids } } });
    await prisma.account.deleteMany({ where: { userId: { in: ids } } });
    await prisma.session.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    console.log(`Removed ${fakeUsers.length} fake @civilspulse.local users`);
  }

  // ── Real bootstrap admin only ───────────────────────────────────────────
  const users = [];
  for (const u of SEED_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash,
        role: u.role,
        plan: u.plan,
        emailVerified: new Date(),
      },
      create: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        plan: u.plan,
        emailVerified: new Date(),
      },
    });
    users.push(user);
  }
  const admin =
    users.find((u) => u.email === "anushkasinghrajputt@gmail.com") ??
    users.find((u) => u.role === "ADMIN")!;

  // ── Topics ──────────────────────────────────────────────────────────────
  const topicBySlug = new Map<string, string>();
  for (const t of SEED_TOPICS) {
    const topic = await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { name: t.name, subject: t.subject, description: t.description },
      create: {
        slug: t.slug,
        name: t.name,
        subject: t.subject,
        description: t.description,
      },
    });
    topicBySlug.set(t.slug, topic.id);
  }

  // ── Source documents ────────────────────────────────────────────────────
  for (const [yearStr, url] of Object.entries(SOURCE_PDFS)) {
    const year = Number(yearStr);
    await prisma.sourceDocument.upsert({
      where: {
        year_paper_language_officialPdfUrl: {
          year,
          paper: "PRELIMS_GS1",
          language: "EN",
          officialPdfUrl: url,
        },
      },
      update: { title: `CSP ${year} General Studies I (English)` },
      create: {
        title: `CSP ${year} General Studies I (English)`,
        year,
        examType: "PRELIMS",
        paper: "PRELIMS_GS1",
        language: "EN",
        officialPdfUrl: url,
        extractedAt: new Date(),
      },
    });
  }

  const sources = await prisma.sourceDocument.findMany({
    where: { language: "EN" },
  });
  const sourceByKey = new Map(
    sources.map((s) => [`${s.year}:${s.paper}`, s.id] as const),
  );

  // Ensure CSAT source rows exist for years we seed
  for (const year of [2021, 2022, 2023]) {
    const url =
      year === 2023
        ? "https://upsc.gov.in/sites/default/files/QP-CSP-23-CSAT-Engl-060623.pdf"
        : year === 2022
          ? "https://upsc.gov.in/sites/default/files/CSP-22-CSAT-Engl.pdf"
          : "https://upsc.gov.in/sites/default/files/CSP_2021_CSAT_English.pdf";
    await prisma.sourceDocument.upsert({
      where: {
        year_paper_language_officialPdfUrl: {
          year,
          paper: "PRELIMS_CSAT",
          language: "EN",
          officialPdfUrl: url,
        },
      },
      update: {},
      create: {
        title: `CSP ${year} CSAT (English)`,
        year,
        examType: "PRELIMS",
        paper: "PRELIMS_CSAT",
        language: "EN",
        officialPdfUrl: url,
        extractedAt: new Date(),
      },
    });
  }

  // Mains 2026 official papers (local PDFs served from /public)
  for (const [paper, url] of [
    ["MAINS_GS1", MAINS_PDF.GS1],
    ["MAINS_GS2", MAINS_PDF.GS2],
    ["MAINS_GS3", MAINS_PDF.GS3],
    ["MAINS_GS4", MAINS_PDF.GS4],
  ] as const) {
    await prisma.sourceDocument.upsert({
      where: {
        year_paper_language_officialPdfUrl: {
          year: 2026,
          paper,
          language: "EN",
          officialPdfUrl: url,
        },
      },
      update: { title: `CSM 2026 ${paper.replaceAll("_", " ")} (English)` },
      create: {
        title: `CSM 2026 ${paper.replaceAll("_", " ")} (English)`,
        year: 2026,
        examType: "MAINS",
        paper,
        language: "EN",
        officialPdfUrl: url,
        extractedAt: new Date(),
      },
    });
  }

  const sourcesFresh = await prisma.sourceDocument.findMany({ where: { language: "EN" } });
  sourceByKey.clear();
  for (const s of sourcesFresh) {
    sourceByKey.set(`${s.year}:${s.paper}`, s.id);
  }

  function mainsToSeed(items: MainsSeed[]) {
    return items.map((m) => ({
      year: m.year,
      questionNumber: m.questionNumber,
      topicSlug: m.topicSlug,
      paper: m.paper,
      examType: "MAINS" as const,
      stem: m.stem,
      optionA: null,
      optionB: null,
      optionC: null,
      optionD: null,
      correctOption: null,
      explanation: m.explanation,
      officialSourceUrl: m.officialSourceUrl,
      status: "APPROVED" as const,
      marks: m.marks,
      wordLimit: m.wordLimit,
    }));
  }

  const allQuestions = [
    ...SEED_PYQS,
    ...PRELIMS_EXPANDED,
    ...SUBJECT_PRACTICE_PYQS,
    ...mainsToSeed(MAINS_GS1_2026),
    ...mainsToSeed(MAINS_GS2_2026),
    ...mainsToSeed(MAINS_GS3_2026),
    ...mainsToSeed(MAINS_GS4_2026),
  ];

  // ── Questions ───────────────────────────────────────────────────────────
  let approved = 0;
  let queued = 0;

  for (const item of allQuestions) {
    const topicId = topicBySlug.get(item.topicSlug);
    if (!topicId) throw new Error(`Missing topic ${item.topicSlug}`);

    const paper = item.paper ?? "PRELIMS_GS1";
    const examType = item.examType ?? (paper.startsWith("MAINS") ? "MAINS" : "PRELIMS");
    const status = item.status ?? "APPROVED";
    const existing = await prisma.question.findFirst({
      where: {
        year: item.year,
        paper,
        questionNumber: item.questionNumber,
        language: "EN",
      },
    });

    const data = {
      sourceDocumentId: sourceByKey.get(`${item.year}:${paper}`) ?? null,
      year: item.year,
      examType: examType as "PRELIMS" | "MAINS",
      paper: paper as
        | "PRELIMS_GS1"
        | "PRELIMS_CSAT"
        | "MAINS_GS1"
        | "MAINS_GS2"
        | "MAINS_GS3"
        | "MAINS_GS4"
        | "MAINS_ESSAY",
      subject: SEED_TOPICS.find((t) => t.slug === item.topicSlug)?.subject ?? "General Studies",
      questionNumber: item.questionNumber,
      language: "EN" as const,
      kind: (SUBJECT_PRACTICE_QUESTION_NUMBERS.has(item.questionNumber)
        ? "GENERATED_PRACTICE"
        : "OFFICIAL_PYQ") as "GENERATED_PRACTICE" | "OFFICIAL_PYQ",
      stem: item.stem,
      optionA: item.optionA ?? null,
      optionB: item.optionB ?? null,
      optionC: item.optionC ?? null,
      optionD: item.optionD ?? null,
      correctOption: item.correctOption ?? null,
      explanation: item.explanation,
      officialSourceUrl: item.officialSourceUrl,
      sourceMetadata: {
        curatedSeed: true,
        topicSlug: item.topicSlug,
        marks: "marks" in item ? item.marks : undefined,
        wordLimit: "wordLimit" in item ? item.wordLimit : undefined,
        note:
          examType === "MAINS"
            ? "Mains PYQ from official UPSC PDF; explanation is a study model-answer framework, not an official key."
            : "Seeded with official PDF provenance; validate stem against PDF in admin review cycles.",
      },
      extractionConfidence: status === "APPROVED" ? 0.95 : 0.62,
      verificationStatus: status,
      publishedAt: status === "APPROVED" ? new Date() : null,
    };

    let questionId: string;
    if (existing) {
      const updated = await prisma.question.update({
        where: { id: existing.id },
        data,
      });
      questionId = updated.id;
      await prisma.questionTopic.deleteMany({ where: { questionId } });
    } else {
      const created = await prisma.question.create({ data });
      questionId = created.id;
    }

    await prisma.questionTopic.create({
      data: { questionId, topicId, isPrimary: true },
    });

    if (status === "APPROVED") {
      approved += 1;
      const already = await prisma.questionVerification.findFirst({
        where: { questionId, toStatus: "APPROVED" },
      });
      if (!already) {
        await prisma.questionVerification.create({
          data: {
            questionId,
            reviewerId: admin.id,
            fromStatus: "EXTRACTED",
            toStatus: "APPROVED",
            notes: "Seed approval — stewarded curated PYQ set",
            checklist: {
              stem: true,
              options: true,
              answer: true,
              sourceUrl: true,
            },
          },
        });
      }
    } else {
      queued += 1;
    }
  }

  // ── Mock templates (20Q per subject hub) ────────────────────────────────
  await prisma.mockTemplate.upsert({
    where: { slug: "prelims-gs1-mixed-20" },
    update: {
      title: "Prelims GS-I Mixed Drill (20Q)",
      questionCount: 20,
      durationMinutes: 40,
      isPublished: true,
    },
    create: {
      slug: "prelims-gs1-mixed-20",
      title: "Prelims GS-I Mixed Drill (20Q)",
      description: "Cross-subject verified + practice drill with UPSC-style negative marking.",
      mode: "FULL_LENGTH",
      paper: "PRELIMS_GS1",
      questionCount: 20,
      durationMinutes: 40,
      negativeMarking: 0.66,
      marksPerQuestion: 2,
    },
  });

  // Keep legacy slug updated so old links still work
  await prisma.mockTemplate.upsert({
    where: { slug: "prelims-gs1-mixed-10" },
    update: {
      title: "Prelims GS-I Mixed Drill (20Q)",
      questionCount: 20,
      durationMinutes: 40,
      isPublished: true,
    },
    create: {
      slug: "prelims-gs1-mixed-10",
      title: "Prelims GS-I Mixed Drill (20Q)",
      description: "Cross-subject verified + practice drill with UPSC-style negative marking.",
      mode: "FULL_LENGTH",
      paper: "PRELIMS_GS1",
      questionCount: 20,
      durationMinutes: 40,
      negativeMarking: 0.66,
      marksPerQuestion: 2,
    },
  });

  await prisma.mockTemplate.upsert({
    where: { slug: "prelims-csat-20" },
    update: {
      title: "CSAT Paper-II Drill (20Q)",
      questionCount: 20,
      durationMinutes: 40,
      paper: "PRELIMS_CSAT",
      isPublished: true,
    },
    create: {
      slug: "prelims-csat-20",
      title: "CSAT Paper-II Drill (20Q)",
      description: "Timed CSAT aptitude drill — 20 questions for deeper practice.",
      mode: "FULL_LENGTH",
      paper: "PRELIMS_CSAT",
      questionCount: 20,
      durationMinutes: 40,
      negativeMarking: 0.66,
      marksPerQuestion: 2.5,
    },
  });

  await prisma.mockTemplate.upsert({
    where: { slug: "prelims-csat-mini" },
    update: {
      title: "CSAT Paper-II Drill (20Q)",
      questionCount: 20,
      durationMinutes: 40,
      paper: "PRELIMS_CSAT",
      isPublished: true,
    },
    create: {
      slug: "prelims-csat-mini",
      title: "CSAT Paper-II Drill (20Q)",
      description: "Timed CSAT aptitude drill — 20 questions for deeper practice.",
      mode: "FULL_LENGTH",
      paper: "PRELIMS_CSAT",
      questionCount: 20,
      durationMinutes: 40,
      negativeMarking: 0.66,
      marksPerQuestion: 2.5,
    },
  });

  // Subject-hub templates — always 20 questions
  const { SUBJECT_CARDS } = await import("../src/lib/catalog");
  for (const card of SUBJECT_CARDS) {
    const topicIds = card.topicSlugs
      .map((slug) => topicBySlug.get(slug))
      .filter(Boolean) as string[];
    // GS Paper 1 = full mixed pool (no topic filter)
    if (card.slug !== "gs-paper-1" && !topicIds.length) continue;
    const slug = `subject-${card.slug}`;
    await prisma.mockTemplate.upsert({
      where: { slug },
      update: {
        title: `${card.title} (20Q)`,
        description: `${card.subtitle} — 20 questions for thorough subject practice.`,
        topicIds,
        paper: card.paper,
        questionCount: 20,
        durationMinutes: 40,
        isPublished: true,
      },
      create: {
        slug,
        title: `${card.title} (20Q)`,
        description: `${card.subtitle} — 20 questions for thorough subject practice.`,
        mode: "TOPIC_WISE",
        paper: card.paper,
        questionCount: 20,
        durationMinutes: 40,
        negativeMarking: 0.66,
        marksPerQuestion: card.paper === "PRELIMS_CSAT" ? 2.5 : 2,
        topicIds,
      },
    });
  }

  for (const topic of SEED_TOPICS) {
    const topicId = topicBySlug.get(topic.slug)!;
    const slug = `topic-${topic.slug}`;
    const paper = topic.subject === "CSAT" ? "PRELIMS_CSAT" : "PRELIMS_GS1";
    await prisma.mockTemplate.upsert({
      where: { slug },
      update: {
        title: `Topic drill: ${topic.name}`,
        topicIds: [topicId],
        paper,
        questionCount: 10,
        durationMinutes: 20,
        isPublished: true,
      },
      create: {
        slug,
        title: `Topic drill: ${topic.name}`,
        description: topic.description,
        mode: "TOPIC_WISE",
        paper,
        questionCount: 10,
        durationMinutes: 20,
        negativeMarking: 0.66,
        marksPerQuestion: paper === "PRELIMS_CSAT" ? 2.5 : 2,
        topicIds: [topicId],
      },
    });
  }

  console.log("CivilsPulse seed complete");
  console.log(`  users: ${users.length}`);
  console.log(`  topics: ${SEED_TOPICS.length}`);
  console.log(`  pyqs approved: ${approved}, queued: ${queued}`);
  console.log("  login password for all seed users: password123");
  console.log(`  owner: anushkasinghrajputt@gmail.com (ADMIN)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
