export type SeedTopic = {
  slug: string;
  name: string;
  subject: string;
  description: string;
};

/** Prelims / CSAT subject map used for tagging, filters, and topic-wise mocks. */
export const SEED_TOPICS: SeedTopic[] = [
  {
    slug: "polity-constitution",
    name: "Constitution & Polity",
    subject: "Polity",
    description: "Constitutional provisions, institutions, rights, and governance.",
  },
  {
    slug: "polity-governance",
    name: "Governance & Bodies",
    subject: "Polity",
    description: "Statutory bodies, local governance, and policy frameworks.",
  },
  {
    slug: "economy-basics",
    name: "Indian Economy",
    subject: "Economy",
    description: "Growth, inflation, banking, fiscal and external sector.",
  },
  {
    slug: "economy-agriculture",
    name: "Agriculture & Food",
    subject: "Economy",
    description: "Farming systems, MSP, food security, and rural economy.",
  },
  {
    slug: "economy-social-development",
    name: "Economic & Social Development",
    subject: "Economy",
    description: "Poverty, inclusion, demography, social sector initiatives.",
  },
  {
    slug: "history-ancient",
    name: "Ancient India",
    subject: "History",
    description: "Indus, Vedic, Mauryan, Gupta and related themes.",
  },
  {
    slug: "history-medieval",
    name: "Medieval India",
    subject: "History",
    description: "Sultanate, Mughals, Bhakti-Sufi and regional states.",
  },
  {
    slug: "history-modern",
    name: "Modern India",
    subject: "History",
    description: "Colonial rule, national movement, and socio-religious reform.",
  },
  {
    slug: "geography-physical",
    name: "Physical Geography",
    subject: "Geography",
    description: "Climate, landforms, oceans, and geomorphology.",
  },
  {
    slug: "geography-india",
    name: "Indian Geography",
    subject: "Geography",
    description: "Resources, drainage, soils, industries, and regional planning.",
  },
  {
    slug: "environment-ecology",
    name: "Environment & Ecology",
    subject: "Environment",
    description: "Ecosystems, climate change, pollution, and conservation.",
  },
  {
    slug: "environment-biodiversity",
    name: "Biodiversity & Conservation",
    subject: "Environment",
    description: "Protected areas, species, conventions, and wildlife.",
  },
  {
    slug: "science-tech",
    name: "Science & Technology",
    subject: "Science & Technology",
    description: "Space, biotech, ICT, defence tech, and applied science.",
  },
  {
    slug: "general-science",
    name: "General Science",
    subject: "Science & Technology",
    description: "Physics, chemistry, biology basics for Prelims.",
  },
  {
    slug: "art-culture",
    name: "Art & Culture",
    subject: "Art & Culture",
    description: "Architecture, literature, performing arts, and heritage.",
  },
  {
    slug: "international-relations",
    name: "International Relations",
    subject: "International Relations",
    description: "Organisations, treaties, and India’s external engagement.",
  },
  {
    slug: "current-affairs",
    name: "Current Affairs & GK",
    subject: "Current Affairs",
    description: "Static-current interface themes tested in Prelims GS.",
  },
  {
    slug: "security-disaster",
    name: "Security & Disaster Mgmt",
    subject: "Security",
    description: "Internal security, cyber, and disaster preparedness.",
  },
  {
    slug: "ethics-integrity",
    name: "Ethics & Integrity",
    subject: "Ethics",
    description: "Ethics, integrity, aptitude, and case studies for GS-IV.",
  },
  {
    slug: "society-social-issues",
    name: "Indian Society",
    subject: "Society",
    description: "Social structure, diversity, demography, and social change.",
  },
  {
    slug: "csat-comprehension",
    name: "CSAT Comprehension",
    subject: "CSAT",
    description: "Reading comprehension for CSAT Paper II.",
  },
  {
    slug: "csat-reasoning",
    name: "CSAT Reasoning",
    subject: "CSAT",
    description: "Logical reasoning and analytical ability.",
  },
  {
    slug: "csat-numeracy",
    name: "CSAT Numeracy",
    subject: "CSAT",
    description: "Basic numeracy and data interpretation.",
  },
];
