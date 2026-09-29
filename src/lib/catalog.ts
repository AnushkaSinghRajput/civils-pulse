/**
 * Exam catalog aligned with common UPSC Prelims subject hubs
 * (e.g. modelexam-style GS / CSAT / subject drills).
 * Kept separate from brand theme so cards stay functional and filterable.
 */

export type JumpInKey = "prelims-gs" | "csat" | "mains" | "start-mock";

export const JUMP_IN = [
  {
    key: "prelims-gs" as const,
    label: "Prelims GS",
    href: "/pyq?paper=PRELIMS_GS1",
    description: "GS Paper I previous-year questions",
  },
  {
    key: "csat" as const,
    label: "CSAT",
    href: "/pyq?paper=PRELIMS_CSAT",
    description: "CSAT Paper II aptitude PYQs",
  },
  {
    key: "mains" as const,
    label: "Mains",
    href: "/pyq?paper=MAINS_GS1",
    description: "Mains GS papers & essay bank",
  },
  {
    key: "start-mock" as const,
    label: "Start a mock",
    href: "/mocks",
    description: "Timed Prelims mocks with scoring",
  },
];

export type SubjectCard = {
  slug: string;
  title: string;
  subtitle: string;
  paper: "PRELIMS_GS1" | "PRELIMS_CSAT" | "MAINS_GS1";
  /** Topic slugs used for PYQ filter + mock composition */
  topicSlugs: string[];
  /** Accent for card header (brand-safe variants). */
  accent: string;
};

export const SUBJECT_CARDS: SubjectCard[] = [
  {
    slug: "gs-paper-1",
    title: "General Studies Paper 1",
    subtitle: "Civil Services Prelims Paper I",
    paper: "PRELIMS_GS1",
    topicSlugs: [],
    accent: "#0d3131",
  },
  {
    slug: "csat-paper-2",
    title: "General Studies Paper 2 (CSAT)",
    subtitle: "Civil Services Prelims Paper II",
    paper: "PRELIMS_CSAT",
    topicSlugs: ["csat-comprehension", "csat-reasoning", "csat-numeracy"],
    accent: "#1a4a4a",
  },
  {
    slug: "economy-social",
    title: "Economic and Social Development",
    subtitle: "Civil Services Prelims Paper 1",
    paper: "PRELIMS_GS1",
    topicSlugs: ["economy-basics", "economy-agriculture", "economy-social-development"],
    accent: "#8b6914",
  },
  {
    slug: "geography",
    title: "India and World Geography",
    subtitle: "Civil Services Prelims Paper 1",
    paper: "PRELIMS_GS1",
    topicSlugs: ["geography-physical", "geography-india"],
    accent: "#0f4c5c",
  },
  {
    slug: "gk-current",
    title: "General Knowledge and Current Affairs",
    subtitle: "General Studies Paper 1",
    paper: "PRELIMS_GS1",
    topicSlugs: ["current-affairs", "international-relations"],
    accent: "#7a3e2e",
  },
  {
    slug: "history",
    title: "Indian History",
    subtitle: "Civil Services Prelims Paper 1",
    paper: "PRELIMS_GS1",
    topicSlugs: ["history-ancient", "history-medieval", "history-modern", "art-culture"],
    accent: "#1e3a5f",
  },
  {
    slug: "polity",
    title: "Indian Polity and Governance",
    subtitle: "Civil Services Prelims Paper 1",
    paper: "PRELIMS_GS1",
    topicSlugs: ["polity-constitution", "polity-governance"],
    accent: "#2c2a5c",
  },
  {
    slug: "science-environment",
    title: "General Science and Environmental Ecology",
    subtitle: "Civil Services Prelims Paper 1",
    paper: "PRELIMS_GS1",
    topicSlugs: ["science-tech", "environment-ecology", "environment-biodiversity", "general-science"],
    accent: "#1f5c3a",
  },
];

export function subjectPyqHref(card: SubjectCard) {
  const params = new URLSearchParams();
  params.set("paper", card.paper);
  if (card.topicSlugs.length === 1) {
    params.set("topic", card.topicSlugs[0]!);
  } else if (card.topicSlugs.length > 1) {
    params.set("subjectGroup", card.slug);
  }
  return `/pyq?${params.toString()}`;
}

export function subjectMockHref(card: SubjectCard) {
  return `/mocks?subject=${card.slug}`;
}
