// Writes dist/client/llms.txt: the site's content as one Markdown document
// for language models and their crawlers (https://llmstxt.org). It is built
// from the same src/content modules as the pages, so it cannot drift from
// them. Runs after the static build; the URLs come from SITE_URL/SITE_BASE
// like the pages' canonical links do.
//
//   SITE_URL=https://example.com node scripts/llms-txt.ts
import { writeFile } from "node:fs/promises";
import { registerHooks } from "node:module";

import type { Repository } from "../src/content/repositories.ts";

// The content modules use Vite's `@/` alias and import logo images. Resolve
// the alias to src/ and stand in an empty module for images so they load
// under plain Node.
registerHooks({
  resolve(specifier, context, next) {
    if (!specifier.startsWith("@/")) return next(specifier, context);
    const path = specifier.slice(2);
    const withExt = /\.[a-z]+$/.test(path) ? path : `${path}.ts`;
    return next(new URL(`../src/${withExt}`, import.meta.url).href, context);
  },
  load(url, context, next) {
    if (!/\.(svg|png|jpe?g|webp|gif)$/.test(url)) return next(url, context);
    return { format: "module", shortCircuit: true, source: "export default '';" };
  },
});

const { career, company, engagements, productList, services } =
  await import("../src/content/company.ts");
const { customerGroups } = await import("../src/content/customers.ts");
const { referenceProjects } = await import("../src/content/references.ts");
const { integrationGroups } = await import("../src/content/integrations.ts");
const { repositories, roleLabels } = await import("../src/content/repositories.ts");
const { deepDives, solutionTemplates } = await import("../src/content/showcase.ts");

const origin = (process.env["SITE_URL"] ?? "http://localhost:8080").replace(/\/+$/, "");
const base = (process.env["SITE_BASE"] ?? "/").replace(/\/*$/, "/");
const siteUrl = `${origin}${base}`;
// Pages end with a slash (see pageUrl in src/lib/site.ts); files such as
// sitemap.xml do not.
const pageUrl = (path: string) =>
  `${siteUrl}${path.replace(/^\//, "")}${/\.[a-z]+$/.test(path) ? "" : "/"}`;

const lines: string[] = [];
const h = (level: number, text: string) => lines.push("", `${"#".repeat(level)} ${text}`, "");
const li = (text: string) => lines.push(`- ${text}`);
const p = (text: string) => lines.push(text, "");

lines.push(`# ${company.name}`, "", `> ${company.summary}`);
p(
  `${company.legalName} is a UK limited company (Companies House no. ${company.companyNumber}) ` +
    `based in ${company.city}, founded in ${company.founded} and led by ${company.founder.name} ` +
    `(${company.founder.title}; ${company.founder.education}). It works with clients ` +
    `internationally. This file summarises the website at ${siteUrl}; the pages listed below ` +
    `are prerendered HTML with schema.org JSON-LD.`,
);
li(
  `[Home](${siteUrl}): services, engagement models, open source, blueprints, reference projects, customers, founder`,
);
for (const id of deepDives) {
  const repo = repositories[id];
  li(`[${repo.name}](${pageUrl(repo.deepDive.to)}): ${repo.deepDive.detail}`);
}
li(`[Sitemap](${pageUrl("/sitemap.xml")})`);

h(2, "Services");
for (const service of services)
  li(`**${service.title}**: ${service.copy} (${service.tags.join(", ")})`);

h(2, "Engagement models");
for (const item of engagements) li(`**${item.title}** — ${item.model}: ${item.copy}`);
lines.push("");
p(company.terms);

h(2, "Products");
for (const id of deepDives) {
  const repo = repositories[id];
  li(`**${repo.name}** — ${repo.detail}. Page: ${pageUrl(repo.deepDive.to)}. Source: ${repo.href}`);
}

h(2, "How the products are sold");
for (const product of productList) {
  h(3, product.name);
  li(`**What you buy**: ${product.sold}`);
  li(`**Who buys it**: ${product.buyer}`);
  if (product.partner) li(`**What a channel partner gets**: ${product.partner}`);
  li(`**How it starts**: ${product.start}`);
  li(`**Who owns what**: ${product.boundary}`);
  for (const offer of product.offers) li(`**${offer.name}** (${offer.kind}): ${offer.copy}`);
}

h(2, "Open source");
p("Repositories the company authors or maintains, with its role in each.");
for (const repo of Object.values(repositories) as Repository[]) {
  const role = roleLabels[repo.role ?? "author"];
  li(`[${repo.name}](${repo.href}): ${repo.detail} (${role})`);
}

h(2, "Blueprints");
p("Working templates that fixed-scope deliveries start from.");
for (const template of solutionTemplates) {
  const repo = repositories[template.repository];
  li(
    `**${template.outcome}** — ${template.copy} Starting point: [${repo.name}](${repo.href})` +
      (template.demo ? `; live demo: ${template.demo}` : ""),
  );
}

h(2, "Reference projects");
p("Delivery work the company or its founder has been part of, most recent first.");
for (const project of referenceProjects) {
  li(
    `**${project.title}** (${project.sector}; ${project.client}): ${project.outcome}` +
      (project.metric ? ` ${project.metric}.` : "") +
      ` Stack: ${project.stack.join(", ")}.`,
  );
}

h(2, "Some integrations we have helped to build");
p("Third-party services wired into the reference platforms and run in production.");
for (const group of integrationGroups) li(`**${group.name}**: ${group.items.join(", ")}`);

h(2, "Customers");
p("Organisations delivered for since 2000, directly and through employers and partners.");
for (const group of customerGroups)
  li(`**${group.sector}**: ${group.customers.map((c) => c.name).join(", ")}`);

h(2, "Founder");
p(`${company.founder.name}, ${company.founder.title}. ${company.founder.education}.`);
for (const [years, role, detail] of career) li(`${years} — ${role}: ${detail}`);

h(2, "Contact");
li(`Email: ${company.email}`);
li(`LinkedIn: ${company.founder.linkedIn}`);
li(`GitHub: ${company.github}`);
li(`Bitbucket: ${company.bitbucket}`);
li(
  `Registered in England and Wales, company no. ${company.companyNumber}; ${company.city}, working internationally.`,
);
lines.push("");

const out = new URL("../dist/client/llms.txt", import.meta.url);
await writeFile(out, lines.join("\n"));
console.log(`llms.txt: ${lines.length} lines → dist/client/llms.txt`);
