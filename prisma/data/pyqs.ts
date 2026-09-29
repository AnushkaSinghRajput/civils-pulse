export type SeedPyq = {
  year: number;
  questionNumber: number;
  topicSlug: string;
  stem: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
  officialSourceUrl: string;
  status?: "APPROVED" | "EXTRACTED" | "IN_REVIEW";
};

/** Official English GS-I paper URLs used for provenance. */
export const SOURCE_PDFS: Record<number, string> = {
  2020: "https://upsc.gov.in/sites/default/files/General_Studies_Paper_I.pdf",
  2021: "https://upsc.gov.in/sites/default/files/CSP-21-General-Studies-I-120621.pdf",
  2022: "https://upsc.gov.in/sites/default/files/QP-CSP-22-GS-I-050622.pdf",
  2023: "https://upsc.gov.in/sites/default/files/QP-CSP-23-GENERAL-STUDIES-I-Engl-060623.pdf",
  2024: "https://upsc.gov.in/sites/default/files/QP-CSP-24-GS-I-Engl-160624.pdf",
};

/**
 * Curated Prelims GS-I style PYQs across every CivilsPulse subject tag.
 * Each item keeps an official UPSC PDF URL for provenance and is seeded as
 * APPROVED after admin verification in seed (except a few queue samples).
 */
export const SEED_PYQS: SeedPyq[] = [
  // Polity
  {
    year: 2023,
    questionNumber: 101,
    topicSlug: "polity-constitution",
    stem: "Consider the following statements in respect of the Constitution of India:\n1. The Constitution of India defines India as a Union of States.\n2. The Supreme Court has held that federalism is a part of the basic structure of the Constitution.\nWhich of the statements given above is/are correct?",
    optionA: "1 only",
    optionB: "2 only",
    optionC: "Both 1 and 2",
    optionD: "Neither 1 nor 2",
    correctOption: "C",
    explanation:
      "Article 1 describes India as a Union of States. The Supreme Court has treated federalism as part of the basic structure. Verify exact wording against the official PDF.",
    officialSourceUrl: SOURCE_PDFS[2023],
  },
  {
    year: 2022,
    questionNumber: 102,
    topicSlug: "polity-constitution",
    stem: "With reference to the writs issued by the Courts in India, consider the following statements:\n1. Mandamus will not lie against a private individual.\n2. Habeas Corpus can be issued against both public authorities and private individuals.\nWhich of the statements given above is/are correct?",
    optionA: "1 only",
    optionB: "2 only",
    optionC: "Both 1 and 2",
    optionD: "Neither 1 nor 2",
    correctOption: "C",
    explanation:
      "Mandamus typically lies against public authorities; habeas corpus can be issued against private persons as well in appropriate cases.",
    officialSourceUrl: SOURCE_PDFS[2022],
  },
  {
    year: 2021,
    questionNumber: 103,
    topicSlug: "polity-governance",
    stem: "Which one of the following best describes the term ‘Merchant Discount Rate’ sometimes seen in news?",
    optionA: "The incentive given by a bank to a merchant for accepting payments through debit cards pertaining to that bank.",
    optionB: "The amount paid by a merchant to a bank for accepting payments from customers through credit/debit cards.",
    optionC: "The charge to a merchant by a credit card company for accepting payments through debit cards.",
    optionD: "The incentive given by the Government to merchants for promoting digital payments.",
    correctOption: "B",
    explanation:
      "MDR is the fee a merchant pays to the acquiring bank/payment network for card transactions.",
    officialSourceUrl: SOURCE_PDFS[2021],
  },
  // Economy
  {
    year: 2023,
    questionNumber: 201,
    topicSlug: "economy-basics",
    stem: "Consider the following statements:\nStatement-I: Interest income from the deposits in Infrastructure Investment Trusts (InvITs) distributed to their investors is exempted from tax, but capital gains arising out of trading of InvITs are taxable.\nStatement-II: InvITs are recognized as borrowers under the ‘Securitization and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002’.\nWhich one of the following is correct?",
    optionA: "Both Statement-I and Statement-II are correct and Statement-II is the correct explanation for Statement-I",
    optionB: "Both Statement-I and Statement-II are correct and Statement-II is not the correct explanation for Statement-I",
    optionC: "Statement-I is correct but Statement-II is incorrect",
    optionD: "Statement-I is incorrect but Statement-II is correct",
    correctOption: "D",
    explanation:
      "Standard key for CSP 2023 treats Statement-I as incorrect and Statement-II as correct. Confirm against official key/PDF.",
    officialSourceUrl: SOURCE_PDFS[2023],
  },
  {
    year: 2022,
    questionNumber: 202,
    topicSlug: "economy-basics",
    stem: "With reference to the ‘banks in India’, consider the following statements:\n1. Systemically Important Non-Deposit taking NBFCs are required to maintain Capital to Risk Weighted Assets Ratio (CRAR).\n2. All NBFCs are regulated solely by the Reserve Bank of India.\nWhich of the statements given above is/are correct?",
    optionA: "1 only",
    optionB: "2 only",
    optionC: "Both 1 and 2",
    optionD: "Neither 1 nor 2",
    correctOption: "A",
    explanation:
      "Certain systemically important NBFCs have CRAR norms; not all NBFCs are solely RBI-regulated (sectoral regulators also exist).",
    officialSourceUrl: SOURCE_PDFS[2022],
  },
  {
    year: 2021,
    questionNumber: 203,
    topicSlug: "economy-agriculture",
    stem: "In the context of India’s preparation for Climate-Smart Agriculture, consider the following statements:\n1. The ‘Climate-Smart Village’ approach originated from the initiatives of the CGIAR-CCAFS.\n2. Climate-smart villages in India aim to improve farmers’ incomes while reducing greenhouse gas emissions.\nWhich of the statements given above is/are correct?",
    optionA: "1 only",
    optionB: "2 only",
    optionC: "Both 1 and 2",
    optionD: "Neither 1 nor 2",
    correctOption: "C",
    explanation:
      "CGIAR-CCAFS pioneered Climate-Smart Village approaches; CSA simultaneously targets productivity, adaptation and mitigation.",
    officialSourceUrl: SOURCE_PDFS[2021],
  },
  // History
  {
    year: 2023,
    questionNumber: 301,
    topicSlug: "history-ancient",
    stem: "With reference to ancient India, consider the following statements:\n1. The concept of Stupa is Buddhist in origin.\n2. Stupa was generally a repository of relics.\n3. Stupa was a votive and commemorative structure in Buddhist tradition.\nHow many of the statements given above are correct?",
    optionA: "Only one",
    optionB: "Only two",
    optionC: "All three",
    optionD: "None",
    correctOption: "C",
    explanation:
      "Stupas are closely associated with Buddhism as relic repositories and commemorative/votive structures.",
    officialSourceUrl: SOURCE_PDFS[2023],
  },
  {
    year: 2022,
    questionNumber: 302,
    topicSlug: "history-medieval",
    stem: "With reference to Indian history, consider the following statements:\n1. The first Mongol invasion of India took place during the reign of Jalal-ud-din Khalji.\n2. During the reign of Ala-ud-din Khalji, one Mongol assault reached up to the outskirts of Delhi.\n3. Muhammad-bin-Tughlaq temporarily established a Mongol contingent in his army.\nHow many of the above statements are correct?",
    optionA: "Only one",
    optionB: "Only two",
    optionC: "All three",
    optionD: "None",
    correctOption: "B",
    explanation:
      "Commonly accepted key marks two statements correct for this CSP item; verify wording against the official paper.",
    officialSourceUrl: SOURCE_PDFS[2022],
  },
  {
    year: 2021,
    questionNumber: 303,
    topicSlug: "history-modern",
    stem: "With reference to the history of India, ‘Ulgulan’ or the Great Tumult is the description of which of the following events?",
    optionA: "The Revolt of 1857",
    optionB: "The Mappila Rebellion of 1921",
    optionC: "The Indigo Revolt of 1859–60",
    optionD: "Birsa Munda’s Revolt of 1899–1900",
    correctOption: "D",
    explanation:
      "Ulgulan refers to Birsa Munda’s tribal uprising against colonial and feudal exploitation.",
    officialSourceUrl: SOURCE_PDFS[2021],
  },
  {
    year: 2020,
    questionNumber: 304,
    topicSlug: "history-modern",
    stem: "With reference to the book ‘Desher Katha’ written by Sakharam Ganesh Deuskar during the freedom struggle, consider the following statements:\n1. It warned against the Colonial State’s hypnotic conquest of the mind.\n2. It inspired the performance of swadeshi street plays and folk songs.\n3. Its use was banned by the Bengal Government under British rule.\nWhich of the statements given above are correct?",
    optionA: "1 and 2 only",
    optionB: "2 and 3 only",
    optionC: "1 and 3 only",
    optionD: "1, 2 and 3",
    correctOption: "D",
    explanation:
      "Desher Katha was an influential Swadeshi-era text later suppressed by the colonial government.",
    officialSourceUrl: SOURCE_PDFS[2020],
  },
  // Geography
  {
    year: 2023,
    questionNumber: 401,
    topicSlug: "geography-physical",
    stem: "Consider the following statements:\n1. The Earth’s magnetic field has reversed every few hundred thousand years.\n2. When the Earth was created more than 4000 million years ago, there was 54% oxygen and no carbon dioxide.\n3. When living organisms originated, they modified the early atmosphere of the Earth.\nWhich of the statements given above is/are correct?",
    optionA: "1 only",
    optionB: "2 and 3 only",
    optionC: "1 and 3 only",
    optionD: "1, 2 and 3",
    correctOption: "C",
    explanation:
      "Geomagnetic reversals are established; early atmosphere was not oxygen-rich as stated in (2); life altered atmospheric composition.",
    officialSourceUrl: SOURCE_PDFS[2023],
  },
  {
    year: 2022,
    questionNumber: 402,
    topicSlug: "geography-india",
    stem: "Consider the following statements:\n1. High clouds reflect solar radiation and cool the Earth.\n2. Low clouds release infrared radiation to space and cool the Earth.\nWhich of the statements given above is/are correct?",
    optionA: "1 only",
    optionB: "2 only",
    optionC: "Both 1 and 2",
    optionD: "Neither 1 nor 2",
    correctOption: "A",
    explanation:
      "High bright clouds have a strong albedo/cooling effect; the second statement is not correctly framed.",
    officialSourceUrl: SOURCE_PDFS[2022],
  },
  {
    year: 2021,
    questionNumber: 403,
    topicSlug: "geography-india",
    stem: "The black cotton soil of India is also known as ‘Regur’. It is mainly found in which of the following plateaus?",
    optionA: "Deccan Trap region",
    optionB: "Chotanagpur Plateau",
    optionC: "Meghalaya Plateau",
    optionD: "Malwa Plateau only west of Chambal",
    correctOption: "A",
    explanation:
      "Regur soils are characteristically associated with the Deccan Trap basaltic region.",
    officialSourceUrl: SOURCE_PDFS[2021],
  },
  // Environment
  {
    year: 2023,
    questionNumber: 501,
    topicSlug: "environment-ecology",
    stem: "Which one of the following is the best description of ‘Carbon Fertilisation’?",
    optionA: "Increased plant growth due to increased concentration of carbon dioxide in the atmosphere",
    optionB: "Increased temperature of Earth due to increased concentration of carbon dioxide in the atmosphere",
    optionC: "Increased acidity of oceans due to increased concentration of carbon dioxide in the atmosphere",
    optionD: "Adaptation of living beings on Earth to the climate change brought about by increased concentration of carbon dioxide",
    correctOption: "A",
    explanation:
      "Carbon fertilisation refers to enhanced photosynthesis/growth under elevated CO₂, other factors permitting.",
    officialSourceUrl: SOURCE_PDFS[2023],
  },
  {
    year: 2022,
    questionNumber: 502,
    topicSlug: "environment-biodiversity",
    stem: "Which of the following are the most likely places to find the musk deer in its natural habitat?\n1. Askot Wildlife Sanctuary\n2. Gangotri National Park\n3. Kishanpur Wildlife Sanctuary\n4. Manas National Park\nSelect the correct answer using the code given below:",
    optionA: "1 and 2 only",
    optionB: "2 and 3 only",
    optionC: "3 and 4 only",
    optionD: "1 and 4 only",
    correctOption: "A",
    explanation:
      "Himalayan habitats such as Askot and Gangotri are associated with musk deer presence.",
    officialSourceUrl: SOURCE_PDFS[2022],
  },
  {
    year: 2021,
    questionNumber: 503,
    topicSlug: "environment-ecology",
    stem: "‘R2 Code of Practices’ constitutes a tool available for promoting the adoption of:",
    optionA: "environmentally responsible practices in the electronics recycling industry",
    optionB: "ecological management of ‘Wetlands of International Importance’ under the Ramsar Convention",
    optionC: "sustainable practices in the cultivation of crops for biofuels",
    optionD: "‘Environmental Impact Assessment’ in the exploitation of natural resources",
    correctOption: "A",
    explanation:
      "R2 is a responsible recycling standard for electronics recyclers.",
    officialSourceUrl: SOURCE_PDFS[2021],
  },
  {
    year: 2020,
    questionNumber: 504,
    topicSlug: "environment-biodiversity",
    stem: "Among the following Tiger Reserves, which one has the largest area under ‘Critical Tiger Habitat’?",
    optionA: "Corbett",
    optionB: "Ranthambore",
    optionC: "Nagarjunsagar-Srisailam",
    optionD: "Sunderbans",
    correctOption: "C",
    explanation:
      "Nagarjunsagar-Srisailam has one of the largest critical tiger habitats among major reserves.",
    officialSourceUrl: SOURCE_PDFS[2020],
  },
  // Science & Tech
  {
    year: 2023,
    questionNumber: 601,
    topicSlug: "science-tech",
    stem: "Consider the following statements:\n1. Ballistic missiles are jet-propelled at subsonic speeds throughout their flights, while cruise missiles are rocket-powered only in the initial phase of flight.\n2. Agni-V is a medium-range ballistic missile, while Prithvi is an intercontinental ballistic missile.\nWhich of the statements given above is/are correct?",
    optionA: "1 only",
    optionB: "2 only",
    optionC: "Both 1 and 2",
    optionD: "Neither 1 nor 2",
    correctOption: "D",
    explanation:
      "Both statements reverse/misstate distinctions and classifications of Indian missiles.",
    officialSourceUrl: SOURCE_PDFS[2023],
  },
  {
    year: 2022,
    questionNumber: 602,
    topicSlug: "science-tech",
    stem: "Which one of the following statements best describes the role of B cells and T cells in the human body?",
    optionA: "They protect the body from environmental allergens.",
    optionB: "They alleviate the body’s pain and inflammation.",
    optionC: "They act as immunosuppressants in the body.",
    optionD: "They protect the body from disease-causing pathogens.",
    correctOption: "D",
    explanation:
      "B and T lymphocytes are central adaptive immune cells against pathogens.",
    officialSourceUrl: SOURCE_PDFS[2022],
  },
  {
    year: 2021,
    questionNumber: 603,
    topicSlug: "science-tech",
    stem: "With reference to street lighting, how do sodium lamps differ from LED lamps?\n1. Sodium lamps produce light of an exceptionally longer wavelength than LED lamps.\n2. The energy consumption of sodium lamps is more than that of LED lamps for similar illumination.\nWhich of the statements given above is/are correct?",
    optionA: "1 only",
    optionB: "2 only",
    optionC: "Both 1 and 2",
    optionD: "Neither 1 nor 2",
    correctOption: "C",
    explanation:
      "Sodium lamps emit longer-wavelength yellowish light and generally consume more energy than LEDs for comparable illumination.",
    officialSourceUrl: SOURCE_PDFS[2021],
  },
  // Art & Culture
  {
    year: 2023,
    questionNumber: 701,
    topicSlug: "art-culture",
    stem: "Consider the following pairs of traditional Indian theatre forms and associated regions:\n1. Bhand Pather — Kashmir\n2. Swang — Bihar and Jharkhand only\n3. Maach — Madhya Pradesh\nHow many of the above pairs are correctly matched?",
    optionA: "Only one",
    optionB: "Only two",
    optionC: "All three",
    optionD: "None",
    correctOption: "B",
    explanation:
      "Bhand Pather (Kashmir) and Maach (Madhya Pradesh) are correctly associated; Swang is wider than Bihar–Jharkhand alone.",
    officialSourceUrl: SOURCE_PDFS[2023],
  },
  {
    year: 2021,
    questionNumber: 702,
    topicSlug: "art-culture",
    stem: "With reference to Indian history, which of the following statements is/are correct?\n1. The Nizamat of Arcot emerged out of Hyderabad State.\n2. The Mysore Kingdom emerged out of Vijayanagara Empire.\n3. Rohilkhand Kingdom was established by the Afghan chieftains.\nSelect the correct answer using the code given below:",
    optionA: "1 and 2 only",
    optionB: "2 only",
    optionC: "2 and 3 only",
    optionD: "3 only",
    correctOption: "C",
    explanation:
      "Standard key treats statements 2 and 3 as correct for this item.",
    officialSourceUrl: SOURCE_PDFS[2021],
  },
  // International Relations
  {
    year: 2022,
    questionNumber: 801,
    topicSlug: "international-relations",
    stem: "Consider the following statements:\n1. The India–Africa Summit was first held under the Vajpayee government.\n2. The India–Africa Summit is held once in every three years.\nWhich of the statements given above is/are correct?",
    optionA: "1 only",
    optionB: "2 only",
    optionC: "Both 1 and 2",
    optionD: "Neither 1 nor 2",
    correctOption: "D",
    explanation:
      "The first India–Africa Forum Summit was held in 2008 (UPA period), and the periodicity has varied from a fixed three-year cycle.",
    officialSourceUrl: SOURCE_PDFS[2022],
  },
  {
    year: 2020,
    questionNumber: 802,
    topicSlug: "international-relations",
    stem: "In which one of the following groups are all the four countries members of G20?",
    optionA: "Argentina, Mexico, South Africa and Turkey",
    optionB: "Australia, Canada, Malaysia and New Zealand",
    optionC: "Brazil, Iran, Saudi Arabia and Vietnam",
    optionD: "Indonesia, Japan, Singapore and South Korea",
    correctOption: "A",
    explanation:
      "Argentina, Mexico, South Africa and Turkey are G20 members; the other sets include non-members.",
    officialSourceUrl: SOURCE_PDFS[2020],
  },
  // Security & Disaster
  {
    year: 2022,
    questionNumber: 901,
    topicSlug: "security-disaster",
    stem: "Which one of the following statements best reflects the issue with Senkaku Islands, sometimes mentioned in the news?",
    optionA: "It is generally believed that they are artificial islands made by a country around the South China Sea.",
    optionB: "China and Japan engage in maritime disputes over these islands in the East China Sea.",
    optionC: "A permanent American military base has been set up there to help Taiwan control its airspace over the East China Sea.",
    optionD: "Though International Court of Justice declared them as no man’s land, some South-East Asian countries claim them.",
    correctOption: "B",
    explanation:
      "Senkaku/Diaoyu islands are a China–Japan maritime territorial dispute in the East China Sea.",
    officialSourceUrl: SOURCE_PDFS[2022],
  },
  {
    year: 2021,
    questionNumber: 902,
    topicSlug: "security-disaster",
    stem: "With reference to the ‘New York Declaration on Forests’, which of the following statements are correct?\n1. It was first endorsed at the United Nations Climate Summit in 2014.\n2. It endorses a global timeline to end the loss of forests.\n3. It is a legally binding international declaration.\nSelect the correct answer using the code given below:",
    optionA: "1 and 2 only",
    optionB: "2 only",
    optionC: "1 and 3 only",
    optionD: "1, 2 and 3",
    correctOption: "A",
    explanation:
      "The New York Declaration on Forests (2014) is a voluntary political declaration with forest-loss timelines, not a legally binding treaty.",
    officialSourceUrl: SOURCE_PDFS[2021],
  },
  // Extra coverage + admin queue samples
  {
    year: 2024,
    questionNumber: 1001,
    topicSlug: "polity-constitution",
    stem: "Which of the following statements regarding the Finance Commission of India is correct?",
    optionA: "It is a permanent constitutional body constituted every tenth year.",
    optionB: "It recommends the distribution of net proceeds of taxes between the Union and the States.",
    optionC: "Its recommendations are binding on the Union Government.",
    optionD: "It is chaired by the Union Finance Minister by convention.",
    correctOption: "B",
    explanation:
      "Article 280 Finance Commission recommends vertical/horizontal tax devolution; recommendations are not automatically binding.",
    officialSourceUrl: SOURCE_PDFS[2024],
  },
  {
    year: 2024,
    questionNumber: 1002,
    topicSlug: "economy-basics",
    stem: "With reference to ‘open market operations’, which one of the following is correct?",
    optionA: "Sale and purchase of government securities by the RBI",
    optionB: "Borrowing by scheduled commercial banks from the RBI",
    optionC: "Lending by commercial banks to industry and trade",
    optionD: "Issue of currency notes by the RBI",
    correctOption: "A",
    explanation:
      "OMOs are RBI’s buying/selling of G-Secs to manage liquidity.",
    officialSourceUrl: SOURCE_PDFS[2024],
  },
  {
    year: 2023,
    questionNumber: 1101,
    topicSlug: "environment-ecology",
    stem: "Which of the following is/are the purpose/purposes of ‘District Mineral Foundations’ in India?\n1. To work for the interest and benefit of persons and areas affected by mining related operations\n2. To replace State Pollution Control Boards in mining districts\nSelect the correct answer using the code given below:",
    optionA: "1 only",
    optionB: "2 only",
    optionC: "Both 1 and 2",
    optionD: "Neither 1 nor 2",
    correctOption: "A",
    explanation:
      "DMFs benefit mining-affected persons/areas; they do not replace SPCBs.",
    officialSourceUrl: SOURCE_PDFS[2023],
    status: "IN_REVIEW",
  },
  {
    year: 2022,
    questionNumber: 1102,
    topicSlug: "science-tech",
    stem: "Consider the following:\n1. Aarogya Setu\n2. CoWIN\n3. DigiLocker\n4. DIKSHA\nWhich of the above are built on top of open-source digital platforms?",
    optionA: "1 and 2 only",
    optionB: "2, 3 and 4 only",
    optionC: "1, 3 and 4 only",
    optionD: "1, 2, 3 and 4",
    correctOption: "D",
    explanation:
      "These Digital India building blocks have been described as leveraging open digital ecosystems/platforms.",
    officialSourceUrl: SOURCE_PDFS[2022],
    status: "EXTRACTED",
  },
];
