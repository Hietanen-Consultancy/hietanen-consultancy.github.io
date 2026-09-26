/**
 * The company as the site describes it: the facts, the services and the ways
 * of working. Plain data with no asset imports, so `scripts/llms-txt.ts` can
 * load it under Node and the machine-readable copy of the site never drifts
 * from the pages.
 */
export const company = {
  name: "Hietanen Consultancy",
  legalName: "Hietanen Consultancy Ltd",
  /** Companies House registration. */
  companyNumber: "16823314",
  city: "London",
  country: "GB",
  founded: 2025,
  founder: {
    name: "Tuomas Hietanen",
    title: "Founder · Director · CTO",
    education: "MSc (Tech), Artificial Intelligence",
    linkedIn: "https://www.linkedin.com/in/thorium/",
  },
  /**
   * The only address the site publishes: a role mailbox that absorbs scraper spam
   * and can be filtered or rotated. The founder's own address goes on the CV,
   * LinkedIn and the decks, which are handed to people rather than crawled.
   */
  email: "hello@hietanen.co.uk",
  /**
   * Where a reader who wants to talk is sent, from every page and both decks:
   * the company mailbox. The founder's LinkedIn stays as a secondary route.
   */
  contact: "mailto:hello@hietanen.co.uk",
  github: "https://github.com/Thorium",
  bitbucket: "https://bitbucket.org/Thorium/workspace/repositories",
  /** One line for search engines and language models. */
  summary:
    "CTO advisory and hands-on engineering for regulated fintech, AI agents, cloud and functional .NET, delivered in the UK, US and EU. London-based, working internationally.",
  /** Subjects the company is known for; feeds schema.org `knowsAbout`. */
  expertise: [
    "F#",
    "C#",
    ".NET",
    "Functional programming",
    "Fintech",
    "FX and payout platforms",
    "Regulated lending",
    "Payments",
    "AI agents",
    "Large language models",
    "Machine learning",
    "Quantum optimisation",
    "AWS",
    "Azure",
    "Event-driven architecture",
    "Infrastructure as code",
    "Technical due diligence",
  ],
  /** How to buy: pricing model per engagement type, in prose for the note under the matrix. */
  terms:
    "Direct contracts and agency framework agreements, inside or outside IR35 as the engagement requires. NDA first, rates on request.",
} as const;

export type Service = { number: string; title: string; copy: string; tags: readonly string[] };
export type Engagement = { title: string; model: string; copy: string; tags: readonly string[] };
/** [years, role, what it involved] */
export type CareerStep = readonly [string, string, string];

export const services: readonly Service[] = [
  {
    number: "01",
    title: "Technology leadership",
    copy: "Fractional CTO work, technical due diligence and engineering direction grounded in years of executive and board responsibility.",
    tags: ["CTO advisory", "Team leadership", "Due diligence"],
  },
  {
    number: "02",
    title: "Fintech platforms",
    copy: "Architecture and delivery for regulated lending, FX and international payouts, payments, credit decisioning and financial integrations.",
    tags: ["Regulated systems", "FX & payments", "Security"],
  },
  {
    number: "03",
    title: "AI & agent engineering",
    copy: "Practical AI systems from model integration and agent teams to machine-learning applications that belong in production.",
    tags: ["AI agents", "LLM tooling", "Machine learning"],
  },
  {
    number: "04",
    title: "Cloud & functional .NET",
    copy: "High-integrity .NET platforms using C#, F#, AWS, Azure, event-driven design and infrastructure as code.",
    tags: ["F# / C#", "AWS / Azure", "Architecture"],
  },
];

// How clients buy the work (the engagement matrix). Embedded engineers on
// time and materials, singly or as a squad, are the core business; the other
// models grow out of it.
export const engagements: readonly Engagement[] = [
  {
    title: "Embedded engineer(s)",
    model: "Time & materials",
    copy: "One senior engineer or a small squad of them joins your team, on site in London, remote, or at an international client, billed by the day and scaling up or down with your roadmap. You set the direction; we bring the seniority, the delivery habits and the code that stays maintainable after we leave.",
    tags: ["Day rate", "One engineer or a squad", "On-site / remote"],
  },
  {
    title: "Fractional CTO",
    model: "Monthly retainer",
    copy: "Technology leadership for a fixed number of days a month: architecture, hiring, vendor and board conversations, technical due diligence for investors and acquirers.",
    tags: ["Retainer", "Board-level", "Due diligence"],
  },
  {
    title: "Fixed-scope delivery",
    model: "Fixed price",
    copy: "A defined outcome at an agreed price, often starting from one of the blueprints below: an integration, a migration, a proof of concept with a production path.",
    tags: ["Agreed scope", "Blueprint start", "Handover included"],
  },
];

export const career: readonly CareerStep[] = [
  [
    "2025—now",
    "Hietanen Consultancy",
    "FX and payouts platform delivered for a US fintech; AI agent team leadership",
  ],
  [
    "2016—2025",
    "Finular Group · CTO & Co-founder",
    "Built and led regulated lending platforms across the UK and US",
  ],
  [
    "2010—2016",
    "Basware · Lead Software Engineer",
    "Enterprise purchase-to-pay architecture at global scale",
  ],
  [
    "2000—2010",
    "Tieto-Tapiola & JA Tietoteollisuus",
    "Finance, insurance and enterprise software engineering",
  ],
];

/** A revenue line: what the customer buys and on what terms. */
export type ProductOffer = {
  /** Pricing shape, e.g. "Licence", "Usage", "Project". */
  kind: string;
  name: string;
  copy: string;
};

/**
 * The commercial terms of a product, in the order a buyer asks about them:
 * what is sold, who pays, what a partner earns, how it starts and who owns
 * what. The last one matters most for the drone work — people assume a company
 * that talks about fleets owns aircraft — so it is written as the strength it
 * is, not as a list of things we do not do.
 */
export type Product = {
  name: string;
  /** Route path of the product page. */
  path: string;
  sold: string;
  buyer: string;
  /** What a channel partner earns, where the product sells through one. */
  partner?: string;
  start: string;
  boundary: string;
  offers: readonly ProductOffer[];
};

export const products = {
  quantum: {
    name: "FSharp.Azure.Quantum",
    path: "/projects/quantum/",
    sold: "Planning software: the optimisation SDK embedded in fleet software, and the hosted Swarm Planning API behind it. Constraints in, routes, assignments and MAVLink missions out.",
    buyer:
      "Aircraft makers and the vendors who ship ground-control and fleet-operations software, and the operators flying authorised BVLOS corridors — rail, power lines, wind farms.",
    partner:
      "A partner bundles coordinated operations into the fleet package and bills it per aircraft per month at their own margin, and we supply the automation evidence behind the pilot-to-aircraft ratio they want to document in the flight manual. Every aircraft they sell is recurring revenue for both of us.",
    start:
      "A fixed-scope integration or pilot: your product or your fleet, your constraints, a planner in production in twelve weeks, run by remote engineers.",
    boundary:
      "Asset-light by design: the aircraft, the operational authorisation, the pilots and the liability stay with the people who already carry them. Payload is a constraint we model rather than hardware we ship, so every fleet is addressable, and every mission leaves as a file your pilot-in-command inspects before anything flies.",
    offers: [
      {
        kind: "Licence",
        name: "Embedded planning SDK",
        copy: "Signed builds, long-term support, an SLA and private builders for vendors who ship the planner inside their own product.",
      },
      {
        kind: "Usage",
        name: "Swarm Planning API",
        copy: "Hosted planning billed per plan and per aircraft, direct or through a vendor's product. Hybrid solver today, quantum backends as an option.",
      },
      {
        kind: "Project",
        name: "Integration and pilots",
        copy: "Fixed scope, twelve weeks, converting to a licence or to usage.",
      },
    ],
  },
  fuuga: {
    name: "Fuuga",
    path: "/projects/fuuga/",
    sold: "The work that puts a calibrated model into production, and then the continuity that keeps it running: supported releases of the stack you run yourself, the evidence behind how a model behaves, and people who can bring your next engineers up to speed on it.",
    buyer:
      "Regulated organisations running on-premises .NET estates — air-gapped, sovereignty-bound, or needing evidence rather than a vendor statement — and the consultancies that implement for them. Vendors shipping on-premises .NET products are the later door, once the stack is proven inside their customers' networks.",
    partner:
      "A consultancy implementing Fuuga for its own clients is trained and certified by us and escalates to the people who wrote it. A vendor can embed the model in their product and redistribute it across every install, alongside their own support contract.",
    start:
      "A fixed-scope engagement on outcomes you already record, ending with a calibrated decision engine in production, the recipe that produced it and a team of yours who can repeat it without us.",
    boundary:
      "The library stays public domain: no licence key, no phone-home, no obligation to buy anything. Your data and your weights stay on your hardware, and we never need a copy of either.",
    offers: [
      {
        kind: "Engagement",
        name: "Decision engagements",
        copy: "Fixed scope on outcomes you already record, ending with a calibrated decision engine, a repeatable recipe and a trained team of your own.",
      },
      {
        kind: "Continuity",
        name: "Supported builds and continuity",
        copy: "Signed builds, long-term support branches, security advisories, an SLA and the provenance record — and when your people change, we bring the next ones up to speed on your own models. The capability outlives the team that built it.",
      },
      {
        kind: "Partner",
        name: "Enablement and certification",
        copy: "For consultancies implementing Fuuga for their own clients: training, certification and an escalation path to the people who wrote it.",
      },
      {
        kind: "Licence",
        name: "Embedded OEM licence",
        copy: "For vendors shipping Fuuga inside their product: redistribution across every install they deliver, alongside their own support contract.",
      },
    ],
  },
} as const satisfies Record<string, Product>;

/** The products in display order, for the catalogue and the machine-readable copies. */
export const productList: readonly Product[] = [products.quantum, products.fuuga];
