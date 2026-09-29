import type { LinkOptions } from "@tanstack/react-router";

/**
 * The registry of repositories the site can show. Each entry is referenced by
 * its key from `showcase.ts`, so a repository only needs describing once here
 * no matter how many sections use it.
 *
 * - Preview images live in `repository-images.ts`, not here: this file is also
 *   loaded by `scripts/fetch-social-images.ts` under plain Node, so it must stay
 *   free of asset imports.
 * - `deepDive` points at an in-site route; only repositories with a deep-dive
 *   page can be listed under `showcase.deepDives`.
 * - `href` is where a visitor lands. Fuuga and Prismatic are hosted on Bitbucket,
 *   which shows a file listing before the README, so they land on their NuGet
 *   package page instead and `source` keeps the git repository for machine
 *   metadata (schema.org `codeRepository`, the llms.txt "Source" line).
 * - `role` is Hietanen's relationship to the project; it is shown on the card
 *   so maintained-but-not-originated work is never presented as authorship.
 *   Omitted means "author". Always link the canonical repository, not a fork:
 *   that is where the stars, issues and maintainer history are visible.
 */
export type RepositoryRole = "author" | "maintainer" | "contributor";

export type Repository = {
  name: string;
  detail: string;
  href: string;
  /** The git repository when `href` is not it (see the note above). */
  source?: string;
  role?: RepositoryRole;
  /** A `<Link to>` target; the router is `trailingSlash: "always"`, so it ends with one. */
  deepDive?: { to: NonNullable<LinkOptions["to"]>; detail: string };
};

export const repositories = {
  linqkit: {
    name: "LINQKit",
    detail: "Expression-tree tooling · 133M NuGet downloads",
    href: "https://github.com/scottksmith95/LINQKit",
    role: "maintainer",
  },
  sqlprovider: {
    name: "SQLProvider",
    detail: "Typed data access for F# · 910K NuGet downloads",
    href: "https://github.com/fsprojects/SQLProvider",
    role: "maintainer",
  },
  linqExpressionOptimizer: {
    name: "Linq.Expression.Optimizer",
    detail: "High-performance .NET expression optimization · 630K NuGet downloads",
    href: "https://github.com/Thorium/Linq.Expression.Optimizer",
  },
  fuuga: {
    name: "Fuuga",
    detail: "A complete LLM training and serving stack in F# and .NET, no Python",
    href: "https://www.nuget.org/packages/Fuuga",
    source: "https://bitbucket.org/Thorium/fuuga",
    deepDive: {
      to: "/projects/fuuga/",
      detail: "Train, fine-tune and serve your own language models on .NET",
    },
  },
  fsharpAzureQuantum: {
    name: "FSharp.Azure.Quantum",
    detail: "Quantum optimisation for developers, drone fleets first",
    href: "https://github.com/Thorium/FSharp.Azure.Quantum",
    deepDive: {
      to: "/projects/quantum/",
      detail: "Quantum optimisation, shown through drone swarm coordination",
    },
  },
  clearBankNet: {
    name: "ClearBank.Net",
    detail: "A typed .NET client for UK/EU banking and payment integrations",
    href: "https://github.com/Thorium/ClearBank.Net",
  },
  carmelNet: {
    name: "CarmelNet",
    detail: "Financial platform integration for the US market",
    href: "https://github.com/Thorium/CarmelNet",
  },
  csharpRefactor: {
    name: "CSharp.Refactor",
    detail: "Clarifies agent-generated or legacy C# into readable code",
    href: "https://github.com/Thorium/csharp-refactor",
  },
  rollABallFSharp: {
    name: "Roll-a-ball-FSharp",
    detail: "Bringing functional programming into the Unity game engine",
    href: "https://github.com/Thorium/Roll-a-ball-FSharp",
  },
  prismatic: {
    name: "Prismatic",
    detail: "Multi-agent AI development workspace",
    href: "https://www.nuget.org/packages/Prismatic",
    source: "https://bitbucket.org/thorium/prismatic",
  },
  funStripeSample: {
    name: "FunStripe.Sample",
    detail: "Typed Stripe payment flows in F#",
    href: "https://github.com/Thorium/FunStripe.Sample",
  },
  websitePlayground: {
    name: "WebsitePlayground",
    detail: "A complete F# web stack: server, typed data access and client in one solution",
    href: "https://github.com/Thorium/WebsitePlayground",
  },
  simpleCqrs: {
    name: "SimpleCQRS-FSharp",
    detail: "Command–query separation and event sourcing, implemented plainly in F#",
    href: "https://github.com/Thorium/SimpleCQRS-FSharp",
  },
  proveSdk: {
    name: "ProveSDK",
    detail: "Unofficial .NET client for the Prove identity-verification API",
    href: "https://github.com/Thorium/ProveSDK",
  },
  fsharpRefactor: {
    name: "FSharp.Refactor",
    detail: "Clarifies agent-generated or legacy F# into readable, idiomatic code",
    href: "https://github.com/Thorium/fsharp-refactor",
  },
  owinCompression: {
    name: "Owin.Compression",
    detail: "Deflate and GZip compression middleware for OWIN and ASP.NET Core",
    href: "https://github.com/Thorium/Owin.Compression",
  },
  nppTreeSitter: {
    name: "NppTreeSitter",
    detail: "Tree-sitter syntax highlighting plugin for Notepad++",
    href: "https://github.com/Thorium/NppTreeSitter",
  },
  jsonProviderSerializer: {
    name: "FSharp.Data.JsonProvider.Serializer",
    detail: "Fast System.Text.Json serialization for FSharp.Data's JsonProvider",
    href: "https://github.com/Thorium/FSharp.Data.JsonProvider.Serializer",
  },
  efBulkInsert: {
    name: "EntityFramework.BulkInsert",
    detail: "High-volume bulk inserts for Entity Framework 6",
    href: "https://github.com/Thorium/EntityFramework.BulkInsert",
    role: "maintainer",
  },
  sqlproviderFable: {
    name: "SQLProvider.Fable",
    detail:
      "SQLProvider for Fable: typed data access compiled to JavaScript, Rust and other targets",
    href: "https://github.com/Thorium/SQLProvider.Fable",
  },
  kasino: {
    name: "Kasino",
    detail:
      "A traditional Finnish card game as a touch-first web app, written in F# and compiled to the browser",
    href: "https://github.com/Thorium/Kasino",
  },
  fabulousMauiTutorial: {
    name: "fabulousMauiTutorial",
    detail: "Cross-platform mobile apps with .NET MAUI and F#",
    href: "https://github.com/Thorium/fabulousMauiTutorial",
  },
} satisfies Record<string, Repository>;

export type RepositoryId = keyof typeof repositories;

export const roleLabels: Record<RepositoryRole, string> = {
  author: "Author",
  maintainer: "Maintainer",
  contributor: "Contributor",
};

export const repositoryRole = (id: RepositoryId): string =>
  roleLabels[(repositories[id] as Repository).role ?? "author"];

/** Repositories that have an in-site deep-dive page. */
export type DeepDiveRepositoryId = {
  [K in RepositoryId]: (typeof repositories)[K] extends { deepDive: unknown } ? K : never;
}[RepositoryId];
