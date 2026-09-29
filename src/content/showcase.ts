import type { DeepDiveRepositoryId, RepositoryId } from "./repositories";

/**
 * Which repositories appear in which section of the front page, in display
 * order. Swap, reorder or drop entries here; the repositories themselves are
 * described once in `repositories.ts`.
 */

/** 02 / Public work — the two large "Deep dive" cards linking to in-site pages. */
export const deepDives: readonly DeepDiveRepositoryId[] = ["fuuga", "fsharpAzureQuantum"];

/** 02 / Public work — the swipeable repository carousel. */
export const publicWork: readonly RepositoryId[] = [
  "clearBankNet",
  "carmelNet",
  "csharpRefactor",
  "fsharpRefactor",
  "proveSdk",
  "sqlprovider",
  "sqlproviderFable",
  "nppTreeSitter",
  "linqExpressionOptimizer",
  "owinCompression",
  "jsonProviderSerializer",
  "linqkit",
  "efBulkInsert",
  "prismatic",
];

/**
 * 03 / Blueprints — "Start from a working template." cards. Each names the
 * business outcome and the repository that serves as the starting point.
 * `image` overrides the repository's preview picture for this card only;
 * `demo` adds a "Try it live" link when the template is deployed somewhere.
 */
export type SolutionTemplate = {
  repository: RepositoryId;
  outcome: string;
  copy: string;
  tags: readonly string[];
  image?: string;
  demo?: string;
};

export const solutionTemplates: readonly SolutionTemplate[] = [
  {
    repository: "funStripeSample",
    outcome: "Stripe payments",
    copy: "A practical starting point for typed Stripe payment flows, from checkout through integration handling.",
    tags: ["Payments", "Stripe", "F#"],
  },
  {
    repository: "fabulousMauiTutorial",
    outcome: "Mobile application",
    copy: "A cross-platform foundation for building Android and iOS applications with .NET MAUI and F#.",
    tags: ["Android", "iOS", ".NET MAUI"],
  },
  {
    repository: "kasino",
    outcome: "Mobile web application",
    copy: "A touch-first web app that installs like a native one and works offline: a complete game written in F# and compiled to run in any browser, with no app-store round trip.",
    tags: ["Mobile web", "F#", "Fable"],
    demo: "https://thorium.github.io/Kasino/",
  },
  {
    repository: "websitePlayground",
    outcome: "Enterprise web application",
    copy: "A full-stack starting point for line-of-business web applications: typed from the database to the browser, ready to grow into a product.",
    tags: ["Web", "Full stack", "F#"],
  },
  {
    repository: "simpleCqrs",
    outcome: "Event-driven architecture",
    copy: "A clear, minimal reference for CQRS and event sourcing: commands, events and read models you can reason about before scaling up.",
    tags: ["CQRS", "Event sourcing", "Architecture"],
  },
  {
    repository: "rollABallFSharp",
    outcome: "Unity games",
    copy: "A small, working Unity example that demonstrates functional game development with F#.",
    tags: ["Unity", "Games", "F#"],
  },
];
