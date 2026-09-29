import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { SEED_USERS } from "./data/users";
import { SEED_TOPICS } from "./data/topics";
import { SEED_PYQS, SOURCE_PDFS } from "./data/pyqs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  // ── Users (20) ──────────────────────────────────────────────────────────
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
    where: { paper: "PRELIMS_GS1", language: "EN" },
  });
  const sourceByYear = new Map(sources.map((s) => [s.year, s.id]));

  // ── Questions ───────────────────────────────────────────────────────────
  let approved = 0;
  let queued = 0;

  for (const item of SEED_PYQS) {
    const topicId = topicBySlug.get(item.topicSlug);
    if (!topicId) throw new Error(`Missing topic ${item.topicSlug}`);

    const status = item.status ?? "APPROVED";
    const existing = await prisma.question.findFirst({
      where: {
        year: item.year,
        paper: "PRELIMS_GS1",
        questionNumber: item.questionNumber,
        language: "EN",
      },
    });

    const data = {
      sourceDocumentId: sourceByYear.get(item.year) ?? null,
      year: item.year,
      examType: "PRELIMS" as const,
      paper: "PRELIMS_GS1" as const,
      subject: SEED_TOPICS.find((t) => t.slug === item.topicSlug)?.subject ?? "General Studies",
      questionNumber: item.questionNumber,
      language: "EN" as const,
      kind: "OFFICIAL_PYQ" as const,
      stem: item.stem,
      optionA: item.optionA,
      optionB: item.optionB,
      optionC: item.optionC,
      optionD: item.optionD,
      correctOption: item.correctOption,
      explanation: item.explanation,
      officialSourceUrl: item.officialSourceUrl,
      sourceMetadata: {
        curatedSeed: true,
        topicSlug: item.topicSlug,
        note: "Seeded with official PDF provenance; validate stem against PDF in admin review cycles.",
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

  // ── Mock templates ──────────────────────────────────────────────────────
  await prisma.mockTemplate.upsert({
    where: { slug: "prelims-gs1-mixed-10" },
    update: {
      title: "Prelims GS-I Mixed Drill (10Q)",
      questionCount: 10,
      durationMinutes: 20,
      isPublished: true,
    },
    create: {
      slug: "prelims-gs1-mixed-10",
      title: "Prelims GS-I Mixed Drill (10Q)",
      description: "Cross-subject verified PYQ drill with UPSC-style negative marking.",
      mode: "FULL_LENGTH",
      paper: "PRELIMS_GS1",
      questionCount: 10,
      durationMinutes: 20,
      negativeMarking: 0.66,
      marksPerQuestion: 2,
    },
  });

  for (const topic of SEED_TOPICS) {
    const topicId = topicBySlug.get(topic.slug)!;
    const slug = `topic-${topic.slug}`;
    await prisma.mockTemplate.upsert({
      where: { slug },
      update: {
        title: `Topic drill: ${topic.name}`,
        topicIds: [topicId],
        questionCount: 2,
        durationMinutes: 8,
        isPublished: true,
      },
      create: {
        slug,
        title: `Topic drill: ${topic.name}`,
        description: topic.description,
        mode: "TOPIC_WISE",
        paper: "PRELIMS_GS1",
        questionCount: 2,
        durationMinutes: 8,
        negativeMarking: 0.66,
        marksPerQuestion: 2,
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
