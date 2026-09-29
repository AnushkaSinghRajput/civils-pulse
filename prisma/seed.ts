import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const UPSC_GS1_2023 =
  "https://upsc.gov.in/sites/default/files/QP-CSP-23-GENERAL-STUDIES-I-Engl-060623.pdf";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@civilspulse.local" },
    update: {},
    create: {
      email: "admin@civilspulse.local",
      name: "CivilsPulse Admin",
      passwordHash,
      role: "ADMIN",
      plan: "PRO",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@civilspulse.local" },
    update: {},
    create: {
      email: "student@civilspulse.local",
      name: "Demo Student",
      passwordHash,
      role: "STUDENT",
      plan: "FREE",
    },
  });

  const polity = await prisma.topic.upsert({
    where: { slug: "polity-constitution" },
    update: {},
    create: {
      slug: "polity-constitution",
      name: "Constitution & Polity",
      subject: "Polity",
    },
  });

  const economy = await prisma.topic.upsert({
    where: { slug: "economy-basics" },
    update: {},
    create: {
      slug: "economy-basics",
      name: "Indian Economy",
      subject: "Economy",
    },
  });

  const ecology = await prisma.topic.upsert({
    where: { slug: "environment-ecology" },
    update: {},
    create: {
      slug: "environment-ecology",
      name: "Environment & Ecology",
      subject: "Environment",
    },
  });

  const source = await prisma.sourceDocument.upsert({
    where: {
      year_paper_language_officialPdfUrl: {
        year: 2023,
        paper: "PRELIMS_GS1",
        language: "EN",
        officialPdfUrl: UPSC_GS1_2023,
      },
    },
    update: {},
    create: {
      title: "CSP 2023 General Studies I (English)",
      year: 2023,
      examType: "PRELIMS",
      paper: "PRELIMS_GS1",
      language: "EN",
      officialPdfUrl: UPSC_GS1_2023,
      pageCount: 20,
      extractedAt: new Date(),
    },
  });

  // Seed questions: mix of APPROVED (published) and EXTRACTED (queue)
  // Stems are illustrative placeholders for local MVP — replace via ingestion + admin verify.
  const seedQuestions = [
    {
      questionNumber: 1,
      stem: "Which one of the following statements best describes the term ‘Social Cost of Carbon’?",
      optionA: "Long-term damage from emitting one tonne of CO2 today",
      optionB: "Requirement of fossil fuel for a country",
      optionC: "Effort needed to capture CO2 from atmosphere",
      optionD: "Cost of fossil fuels for a country in a year",
      correctOption: "A",
      explanation:
        "Illustrative seed for MVP wiring. Replace with verified extraction from the official PDF.",
      topicId: ecology.id,
      status: "APPROVED" as const,
      confidence: 0.92,
    },
    {
      questionNumber: 2,
      stem: "Consider constitutional provisions relating to the Finance Commission. Which statement is correct?",
      optionA: "It is constituted every tenth year",
      optionB: "It recommends distribution of tax proceeds between Union and States",
      optionC: "Its recommendations are binding on the President",
      optionD: "It is a permanent body",
      correctOption: "B",
      explanation: "Illustrative seed — verify against official paper before production use.",
      topicId: polity.id,
      status: "APPROVED" as const,
      confidence: 0.88,
    },
    {
      questionNumber: 3,
      stem: "With reference to Indian economy, demand-pull inflation can be caused by which of the following?",
      optionA: "Increase in government spending",
      optionB: "Decline in productivity",
      optionC: "Rise in interest rates only",
      optionD: "Sudden supply shock alone",
      correctOption: "A",
      explanation: "Illustrative seed for mock engine testing.",
      topicId: economy.id,
      status: "APPROVED" as const,
      confidence: 0.9,
    },
    {
      questionNumber: 4,
      stem: "Which of the following is/are the purpose(s) of ‘District Mineral Foundations’?",
      optionA: "Work for interest of persons affected by mining",
      optionB: "Replace State Pollution Control Boards",
      optionC: "Approve mining leases nationally",
      optionD: "Collect GST on minerals",
      correctOption: "A",
      explanation: "Pending admin verification sample.",
      topicId: economy.id,
      status: "EXTRACTED" as const,
      confidence: 0.61,
    },
    {
      questionNumber: 5,
      stem: "In the context of India, which of the following is/are considered as ‘open market operations’?",
      optionA: "Sale and purchase of government securities by RBI",
      optionB: "Borrowing by scheduled banks from RBI",
      optionC: "Lending by banks to industry",
      optionD: "Issue of currency by RBI",
      correctOption: "A",
      explanation: "Illustrative approved PYQ-style item for mocks.",
      topicId: economy.id,
      status: "APPROVED" as const,
      confidence: 0.94,
    },
    {
      questionNumber: 6,
      stem: "Which one of the following best describes ‘Carbon Fertilisation’?",
      optionA: "Increased plant growth due to increased CO2 concentration",
      optionB: "Increased soil carbon from fertilisers",
      optionC: "Carbon trading between nations",
      optionD: "Sequestration of carbon in oceans",
      correctOption: "A",
      explanation: "Illustrative seed.",
      topicId: ecology.id,
      status: "APPROVED" as const,
      confidence: 0.91,
    },
    {
      questionNumber: 7,
      stem: "The Preamble of the Constitution of India is:",
      optionA: "A part of the Constitution as held by the Supreme Court",
      optionB: "Not a part of the Constitution",
      optionC: "Justiciable in all respects",
      optionD: "Amendable only by special majority of States",
      correctOption: "A",
      explanation: "Illustrative seed for polity mocks.",
      topicId: polity.id,
      status: "APPROVED" as const,
      confidence: 0.87,
    },
    {
      questionNumber: 8,
      stem: "Which of the following may be reasons for the ‘current account deficit’?",
      optionA: "High value of imports relative to exports",
      optionB: "Large remittances only",
      optionC: "Surplus tourism receipts only",
      optionD: "Decrease in gold imports alone",
      correctOption: "A",
      explanation: "Illustrative seed.",
      topicId: economy.id,
      status: "APPROVED" as const,
      confidence: 0.89,
    },
    {
      questionNumber: 9,
      stem: "With reference to ‘Eco-Sensitive Zones’, which of the following statements is/are correct?",
      optionA: "They are declared under Environment Protection Act",
      optionB: "They replace National Parks entirely",
      optionC: "They allow unrestricted mining",
      optionD: "They are only coastal",
      correctOption: "A",
      explanation: "Illustrative seed.",
      topicId: ecology.id,
      status: "APPROVED" as const,
      confidence: 0.86,
    },
    {
      questionNumber: 10,
      stem: "Which of the following is/are the most likely characteristics of biological warfare agents?",
      optionA: "Difficulty in detection and delayed effects",
      optionB: "Always visible colour and odour",
      optionC: "Immediate irreversible antidotes available for all",
      optionD: "Cannot be aerosolised",
      correctOption: "A",
      explanation: "Unverified extraction sample for admin queue.",
      topicId: ecology.id,
      status: "IN_REVIEW" as const,
      confidence: 0.55,
    },
  ];

  for (const item of seedQuestions) {
    const existing = await prisma.question.findFirst({
      where: {
        year: 2023,
        paper: "PRELIMS_GS1",
        questionNumber: item.questionNumber,
        language: "EN",
      },
    });
    if (existing) continue;

    const question = await prisma.question.create({
      data: {
        sourceDocumentId: source.id,
        year: 2023,
        examType: "PRELIMS",
        paper: "PRELIMS_GS1",
        subject: "General Studies",
        questionNumber: item.questionNumber,
        language: "EN",
        kind: "OFFICIAL_PYQ",
        stem: item.stem,
        optionA: item.optionA,
        optionB: item.optionB,
        optionC: item.optionC,
        optionD: item.optionD,
        correctOption: item.correctOption,
        explanation: item.explanation,
        officialSourceUrl: UPSC_GS1_2023,
        sourceMetadata: {
          note: "MVP seed — not a claim of exact PDF transcription",
          extractor: "seed",
        },
        extractionConfidence: item.confidence,
        verificationStatus: item.status,
        publishedAt: item.status === "APPROVED" ? new Date() : null,
        topics: {
          create: { topicId: item.topicId, isPrimary: true },
        },
      },
    });

    if (item.status === "APPROVED") {
      await prisma.questionVerification.create({
        data: {
          questionId: question.id,
          reviewerId: admin.id,
          fromStatus: "EXTRACTED",
          toStatus: "APPROVED",
          notes: "Seed approval for local MVP",
        },
      });
    }
  }

  await prisma.mockTemplate.upsert({
    where: { slug: "prelims-gs1-mini-10" },
    update: {},
    create: {
      slug: "prelims-gs1-mini-10",
      title: "Prelims GS-I Mini (10Q)",
      description: "Short verified-PYQ mock for MVP testing.",
      mode: "FULL_LENGTH",
      paper: "PRELIMS_GS1",
      questionCount: 5,
      durationMinutes: 15,
      negativeMarking: 0.66,
      marksPerQuestion: 2,
      yearFilter: [2023],
    },
  });

  await prisma.mockTemplate.upsert({
    where: { slug: "prelims-polity-topic" },
    update: {},
    create: {
      slug: "prelims-polity-topic",
      title: "Topic-wise: Polity",
      description: "Topic-filtered mock using verified PYQs only.",
      mode: "TOPIC_WISE",
      paper: "PRELIMS_GS1",
      questionCount: 5,
      durationMinutes: 12,
      negativeMarking: 0.66,
      marksPerQuestion: 2,
      topicIds: [polity.id],
    },
  });

  console.log("Seeded users:");
  console.log("  admin@civilspulse.local / password123");
  console.log("  student@civilspulse.local / password123");
  console.log(`Admin id: ${admin.id}, Student id: ${student.id}`);
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
