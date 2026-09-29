export type MainsSeed = {
  year: number;
  paper: "MAINS_GS3";
  questionNumber: number;
  topicSlug: string;
  stem: string;
  marks: number;
  wordLimit: number;
  explanation: string; // concise model-answer framework (intro + 3-5 points + way forward), clearly study guidance not official UPSC key
  officialSourceUrl: string;
};

const SRC = "/upsc/mains-2026/gs3.pdf";

export const MAINS_GS3_2026: MainsSeed[] = [
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 1,
    topicSlug: "economy-basics",
    stem: "What do you mean by Digital Rupee? In this context, explain the working and progress of India's Central Bank Digital Currency (CBDC).",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: Digital Rupee (e₹) is RBI’s CBDC — a sovereign digital form of fiat currency, distinct from crypto and bank deposits.\n" +
      "Points: (1) Retail (e₹-R) and wholesale (e₹-W) designs; token/account-based pilots. (2) Issued by RBI, distributed via banks; programmable features and offline pilots. (3) Aims: settlement efficiency, financial inclusion, reduced cash cost, payment resilience. (4) Progress: phased pilots since 2022–23; expanding use-cases (P2P, P2M, cross-border experiments).\n" +
      "Way forward: Scale interoperability with UPI, strong privacy/AML design, clear legal framework, and staged rollout — study framework, not an official UPSC key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 2,
    topicSlug: "economy-basics",
    stem: "Examine the view that financial inclusion is an integral part of social and economic inclusion in a country like India. Also throw light on the usefulness of the R.B.I.'s Financial Inclusion Index.",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: In a diverse, informal economy, access to affordable formal finance underpins livelihood security, entrepreneurship, and welfare delivery.\n" +
      "Points: (1) Links to social inclusion via DBT, insurance, pensions, and women’s account ownership (PMJDY). (2) Economic inclusion through credit, savings, and digital payments reducing leakages. (3) RBI FI-Index (0–100) tracks access, usage, and quality across geographies/time. (4) Usefulness: evidence-based policy targeting, benchmarking states, spotting last-mile gaps beyond account opening.\n" +
      "Way forward: Deepen credit usage, digital literacy, and consumer protection alongside index monitoring — study guidance only.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 3,
    topicSlug: "economy-agriculture",
    stem: "Describe the various Technology Missions initiated in Indian agriculture and examine their role in food security.",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: Technology Missions package R&D, extension, and input support around strategic crops/commodities to raise productivity and resilience.\n" +
      "Points: (1) Illustrative missions — oilseeds, pulses, horticulture, cotton, dairy/livestock-related technology thrusts; National Mission for Sustainable Agriculture; digital/tech missions (soil health, precision farming). (2) Role in food security: yield gains, crop diversification, post-harvest reduction of losses. (3) Nutrition security via horticulture/protein crops. (4) Climate-smart practices and water-use efficiency.\n" +
      "Way forward: Mission convergence with FPOs, market linkages, and climate adaptation — study framework, not official key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 4,
    topicSlug: "economy-agriculture",
    stem: "Explain the factors responsible for inefficiency of agri-produce marketing. How e-commerce helps to reduce inefficiency of agri-produce marketing? Explain.",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: Agri-marketing inefficiency means high intermediation costs, price discovery failures, and weak farmer realisation.\n" +
      "Points: (1) Causes: fragmented holdings, APMC bottlenecks, information asymmetry, poor storage/logistics, multiple intermediaries. (2) e-commerce/e-NAM-type platforms: wider buyer access, transparent price discovery, reduced middlemen layers. (3) Traceability, contract farming linkages, and direct-to-consumer channels. (4) Logistics integration and payment certainty improve incentives.\n" +
      "Way forward: Digital literacy, quality grading, cold-chain, and regulatory reforms to make online markets inclusive — study guidance.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 5,
    topicSlug: "economy-agriculture",
    stem: "Explain by giving two examples, how biotechnology has helped the Indian farmers in processing their perishable crops.",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: Biotech extends shelf life and value addition for perishables, cutting post-harvest losses and raising farm incomes.\n" +
      "Points: (1) Example — enzyme/fermentation tech for fruit pulp, juices, wine, pickles; controlled ripening and pectinases. (2) Example — dairy/biotech starters for cheese, yogurt; microbial/enzymatic processing of tomato, potato starch, or banana fibre/value products. (3) Biopreservatives and packaging biotech reduce spoilage. (4) Links to FPOs and food parks for scale.\n" +
      "Way forward: Affordable tech transfer, cold-chain + biotech clusters, and farmer training — illustrative study answer, not UPSC key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 6,
    topicSlug: "science-tech",
    stem: "Distinguish between a Fast Breeder Reactor (FBR) and a thermal nuclear reactor. In the context of first indigenously developed prototype FBR at Kalpakkam, explain the term ‘criticality’. What are its implications for clean energy future of our country ?",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: India’s three-stage nuclear programme places FBRs between PHWRs and thorium utilisation.\n" +
      "Points: (1) Thermal reactors use moderated neutrons (e.g., PHWR); FBRs use fast neutrons and breed more fissile material (U-238→Pu-239). (2) PFBR Kalpakkam: sodium-cooled prototype. (3) Criticality = self-sustaining chain reaction (neutron production ≈ losses). (4) Implications: fuel efficiency, reduced waste relative to once-through cycle, pathway to thorium stage, low-carbon baseload.\n" +
      "Way forward: Safety culture, spent-fuel management, and staged commercialisation — study framework only.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 7,
    topicSlug: "environment-ecology",
    stem: "Discuss how the contradiction between ‘rapid infrastructure development’ and ‘disaster-risk reduction’ in ecologically-sensitive areas of India can be managed, with suitable examples.",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: Roads, hydropower, and tourism in Himalayas/Western Ghats often raise landslide, flood, and ecosystem risks.\n" +
      "Points: (1) Manage via mandatory EIA, carrying-capacity norms, and land-use zoning. (2) Nature-based solutions, slope stabilisation, and climate-resilient design codes. (3) Examples: Char Dham scrutiny, Kerala/Himachal landslide lessons, eco-sensitive zone restrictions. (4) Early-warning systems and community preparedness alongside projects.\n" +
      "Way forward: ‘Build back better’, transparent clearances, and green infrastructure finance — study guidance, not official key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 8,
    topicSlug: "environment-biodiversity",
    stem: "Discuss the aim and goals of Kunming-Montreal global biodiversity framework. Mention India’s commitments and initiatives to achieve the goals and targets of this framework giving suitable examples.",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: KMGBF (CBD COP15) sets 2030/2050 biodiversity targets to halt and reverse nature loss (‘30x30’, ecosystem restoration, financing).\n" +
      "Points: (1) Aims: protect ecosystems, sustainable use, fair ABS, reduced pollution/invasive species. (2) India’s commitments: National Biodiversity Strategy/Action Plans alignment; protected area expansion; LiFE. (3) Initiatives: Project Tiger/Elephant, CAMPA, wetland/mangrove programmes, community conservancies. (4) Examples: updated NBTs, restoration missions, Green Credit/eco-restoration pilots.\n" +
      "Way forward: Mainstream biodiversity in budgets, land-use, and corporate disclosure — study framework only.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 9,
    topicSlug: "security-disaster",
    stem: "Explain how fake news and disinformation pose threat to Internal Security and Public Order in Indian context? In this regard, discuss salient features of amendments in respect of Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021.",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: Viral falsehoods can inflame communal tensions, undermine institutions, and aid radicalisation or panic.\n" +
      "Points: (1) Threats: mob violence, election integrity risks, communal polarisation, terror propaganda. (2) IT Rules 2021: due diligence for intermediaries, grievance redressal, significant social media user thresholds. (3) Amendments: fact-check/govt. notification controversies; compliance timelines; traceability/takedown duties (discuss constitutionally contested aspects carefully). (4) Need to balance free speech, Article 19, and public order.\n" +
      "Way forward: Media literacy, tech transparency, proportionate regulation, and judicial oversight — study guidance, not UPSC key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 10,
    topicSlug: "security-disaster",
    stem: "Ladakh is strategically located between China and Pakistan. As a measure to win hearts and minds of locals, discuss the Border Area Development Programmes (BADP) by the Central Government and civic actions by the Army. Also discuss demand of promulgation of provision of the Sixth Schedule of constitution for Ladakh.",
    marks: 10,
    wordLimit: 150,
    explanation:
      "Intro: Border stability in Ladakh needs both hard security and inclusive development for local trust.\n" +
      "Points: (1) BADP: infrastructure, livelihoods, education/health in border blocks; strategic connectivity. (2) Army civic action: medical camps, education support, disaster aid, sports — ‘winning hearts and minds’. (3) Sixth Schedule demand: autonomous district councils for cultural/land protection post-UT status. (4) Trade-offs: national security, demography, and local aspirations.\n" +
      "Way forward: Participatory planning, safeguarded land rights, and transparent dialogue on constitutional options — study framework only.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 11,
    topicSlug: "economy-basics",
    stem: "Explain the key challenges for India's energy security. What measures do you suggest for ensuring energy security along with economic growth and sustainability?",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: Energy security means reliable, affordable, sustainable supply for growth without strategic vulnerability.\n" +
      "Points: (1) Challenges: high fossil import dependence, price volatility, coal logistics, grid integration of renewables, critical-mineral supply. (2) Demand surge from industry, EVs, cooling. (3) Measures: diversify fuels/suppliers; expand solar/wind + storage; nuclear baseload; green hydrogen; energy efficiency (PAT, buildings). (4) Domestic exploration, strategic reserves, and resilient grids/smart metering. (5) Just transition for coal regions.\n" +
      "Way forward: Integrated energy planning linking NDC goals, Make-in-India manufacturing, and demand-side management — study guidance, not official key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 12,
    topicSlug: "economy-basics",
    stem: "How are startups in India promoting entrepreneurship, innovation and employment? Discuss the global and domestic challenges in their working and suggest suitable measures to overcome these challenges.",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: India’s startup ecosystem (DPIIT recognition, unicorns, Tier-2/3 hubs) is a growth and jobs engine.\n" +
      "Points: (1) Promotion: Startup India, tax holidays, incubators, digital public infrastructure lowering entry barriers. (2) Innovation in fintech, healthtech, agritech, deep tech; formal and gig employment. (3) Domestic challenges: funding winters, regulatory compliance, talent retention, late-stage capital. (4) Global challenges: geopolitics, export market access, IP competitiveness, valuation reset.\n" +
      "Way forward: Patient capital, easier exit markets, skilling, simplified compliance, and R&D linkages with academia — study framework only.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 13,
    topicSlug: "economy-agriculture",
    stem: "How Indian agriculture has been transformed from food scarcity to food surplus level ? Explain the various government policies implemented for diversification of Indian agriculture.",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: From PL-480 dependence to net cereal exporter status via Green Revolution and later reforms.\n" +
      "Points: (1) Drivers: HYVs, irrigation, fertilisers, MSP/PDS, research (ICAR), extension. (2) Buffer stocks and procurement architecture. (3) Diversification policies: horticulture missions, livestock/dairy (NDDB), fisheries (Blue Revolution/PMMSY), oilseeds-pulses missions, organic/natural farming. (4) Cropping pattern shift incentives, FPOs, and market reforms.\n" +
      "Way forward: Nutrition-sensitive, climate-resilient diversification beyond calorie surplus — study guidance, not UPSC key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 14,
    topicSlug: "economy-agriculture",
    stem: "Discuss the different types of subsidies and supports provided by the Government of India to agricultural sector. Examine the related issues pertaining to Agreement on Agriculture of World Trade Organisation (WTO).",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: Farm support spans input, price, and income instruments aimed at food security and farmer welfare.\n" +
      "Points: (1) Types: fertiliser, power/irrigation, credit interest subvention, MSP/procurement, crop insurance (PMFBY), income support (PM-KISAN), infrastructure. (2) AoA boxes: Amber (trade-distorting), Blue, Green; de minimis; market access/export competition. (3) Issues for India: AMS calculation on administered prices, public stockholding peace clause, developed-country subsidies asymmetry. (4) Negotiation need for permanent solution and special & differential treatment.\n" +
      "Way forward: Better targeting of domestic support plus proactive WTO diplomacy — study framework only.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 15,
    topicSlug: "science-tech",
    stem: "Mention salient features of 'Mission Drishti'. Discuss the imaging techniques used in the satellite launched on 3rd May 2026. Why it is being considered world's first satellite of its kind ?",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: Frame as India’s advanced EO/imaging initiative (Mission Drishti) and the May 2026 launch’s claimed first-of-kind capability — verify specifics from current affairs while writing.\n" +
      "Points: (1) Salient features: high-resolution multi-spectral/hyperspectral or dual-use imaging for mapping, disaster, security, resource monitoring (state as per official brief). (2) Imaging techniques: optical, SAR, hyperspectral, or multi-sensor fusion as applicable to the mission. (3) ‘World’s first’ claim: unique payload combo, resolution/revisit, or indigenous tech milestone cited by ISRO/agency. (4) Applications: agriculture, urban planning, defence, climate.\n" +
      "Way forward: Data-sharing policy, civilian spin-offs, and continuous constellation build-out — study guidance pending exact official specs; not an UPSC key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 16,
    topicSlug: "science-tech",
    stem: "What is agentic Artificial Intelligence (AI) ? Explain its working. Describe its applications with suitable examples. Discuss the advantages, risks and challenges associated with agentic AI systems.",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: Agentic AI systems pursue goals autonomously via planning, tool use, and multi-step actions beyond single-prompt chatbots.\n" +
      "Points: (1) Working: perception → planning → tool/API calls → memory/feedback loops; multi-agent orchestration. (2) Applications: customer ops, software coding agents, logistics optimisation, scientific discovery assistants, e-governance workflow bots. (3) Advantages: productivity, 24×7 scale, complex task automation. (4) Risks: hallucination cascades, privacy, bias, misuse, accountability gaps, job displacement.\n" +
      "Way forward: Human-in-loop, audit trails, IndiaAI safety norms, and sectoral regulation — study framework, not official key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 17,
    topicSlug: "environment-ecology",
    stem: "What are the challenges to solid waste management in India? Discuss the governmental policy framework on solid waste management. Discuss the success/failure cases of Delhi and Indore cities highlighting the salient feature of their solid waste management initiatives.",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: Rapid urbanisation has outpaced collection, segregation, and scientific disposal capacity.\n" +
      "Points: (1) Challenges: mixed waste, informal sector exclusion, landfill fires, plastic, financing, behaviour change. (2) Framework: SWM Rules 2016, PWM Rules, C&D Rules, SBM-U, EPR. (3) Indore: source segregation, door-to-door, processing plants, IEC — ranking success model. (4) Delhi: legacy dumpsites, mixed waste, landfill crises vs incremental WTE/bio-mining efforts — partial success/persistent gaps.\n" +
      "Way forward: Circular economy, decentralised composting, and inclusive informal-worker integration — study guidance only.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 18,
    topicSlug: "environment-ecology",
    stem: "“Community participation is the cornerstone of effective disaster management”. Analyse this statement with suitable examples from India. Also discuss the challenges to community participation and measures to strengthen it.",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: First responders are local communities; NDMA frameworks stress community-based DRM.\n" +
      "Points: (1) Why cornerstone: early warning last-mile, local knowledge, evacuation, recovery ownership. (2) Examples: Odisha cyclone shelters/volunteers; Aapda Mitra; Kerala floods community rescue; Himalayan local warning networks. (3) Challenges: awareness gaps, exclusion of women/disabled, politicisation, funding, fatigue. (4) Strengthen: drills, school curricula, village DM plans, social audits, digital alerts in local languages.\n" +
      "Way forward: Institutionalise volunteers with insurance/incentives and link to SDMAs — study framework, not UPSC key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 19,
    topicSlug: "security-disaster",
    stem: "Separatist movements have been one of the major factors contributing to militancy and instability in Jammu & Kashmir (J & K). Bring out actions taken by the Government to bring J & K into national mainstream. Discuss pre and post abrogation status of Articles 370 and 35A. Also bring out positive impacts of abrogation of both articles in mainstreaming the state.",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: Separatism and cross-border terrorism shaped J&K’s security landscape for decades.\n" +
      "Points: (1) Actions: security ops, development packages, political outreach, UT reorganisation (2019), infrastructure/tourism push. (2) Pre-abrogation: Art. 370 special status; 35A defined permanent residents and related rights. (3) Post-abrogation: full applicability of Union laws; domicile policy changes; legislative/administrative integration as UT(s). (4) Claimed positives: legal uniformity, investment access, reservation extension, reduced stone-pelting/militancy metrics (cite carefully), democratic local body processes.\n" +
      "Way forward: Inclusive politics, human rights, and economic opportunity to consolidate peace — study guidance, not official key.",
    officialSourceUrl: SRC,
  },
  {
    year: 2026,
    paper: "MAINS_GS3",
    questionNumber: 20,
    topicSlug: "security-disaster",
    stem: "Discuss counterfeit currency and money laundering as major sources of terror funding in India. State the actions being taken at International level to check these menaces. Highlight the role of Financial Action Task Force (FATF) and methods of compliance by its member states in preventing terror funding.",
    marks: 15,
    wordLimit: 250,
    explanation:
      "Intro: Terror networks exploit FICN and laundering channels to move and obscure funds across borders.\n" +
      "Points: (1) FICN: cross-border printing/smuggling undermines economy and finances modules. (2) Laundering: hawala, trade-based, shell entities, virtual assets. (3) International action: UN conventions, Egmont Group, Interpol, bilateral MLATs; India’s PMLA/UAPA/FIU-IND. (4) FATF: standards on CFT/AML, mutual evaluations, grey/blacklist leverage. (5) Compliance: customer due diligence, STR reporting, beneficial ownership, targeted financial sanctions, virtual-asset rules.\n" +
      "Way forward: Tech-enabled analytics, regional cooperation, and formalising remittances — study framework only.",
    officialSourceUrl: SRC,
  },
];
