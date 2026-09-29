export type MainsSeed = {
  year: number;
  paper: "MAINS_GS1" | "MAINS_GS2" | "MAINS_GS3" | "MAINS_GS4";
  questionNumber: number;
  topicSlug: string;
  stem: string;
  marks: number;
  wordLimit: number;
  /** Study model-answer framework — not an official UPSC key. */
  explanation: string;
  officialSourceUrl: string;
};

export const MAINS_PDF = {
  GS1: "/upsc/mains-2026/gs1.pdf",
  GS2: "/upsc/mains-2026/gs2.pdf",
  GS3: "/upsc/mains-2026/gs3.pdf",
  GS4: "/upsc/mains-2026/gs4.pdf",
} as const;
