// Builds a publishable bundle of a deck from its sources in
// docs/pitch-decks/<name>/.
//
//   node scripts/pitch-decks.ts fuuga              the investor briefing
//   node scripts/pitch-decks.ts fuuga customer     a variant from deck.json
//
// The sources are the deck itself: deck.json (the index) and one HTML section
// per slide, with images referenced as ../assets/<file> so they render and
// diff locally. The deck is hosted as a claude.ai Slides artifact, which
// stores images as uploaded assets addressed by /_blob/<id>; deck.json's
// `assets` map records which id each file was uploaded under, and this script
// rewrites the references and drops the repo-only keys.
//
// A variant (deck.json `variants.<variant>`) is another deck cut from the same
// slides: its own title, order, sections, artifact and asset ids, plus `replace`
// — literal text swapped on every slide, such as the cover label. Footer page
// numbers are rewritten to each slide's position, so one slide serves any order.
//
// Output: .output/pitch-decks/<name>[-<variant>]/project/{deck.json,slides/*.html}.
// Publish that folder to the variant's `artifact` URL (the Artifact tool in a
// Claude Code session, root = the output folder). A new image must first be
// uploaded to that artifact as an asset; add its id to the matching `assets`.
// Until a variant has an artifact, images keep their ../assets/ paths and are
// copied next to the slides, so the bundle still renders locally.
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

type Variant = {
  title: string;
  order: string[];
  sections?: Record<string, unknown>;
  /** The variant's own creation stamp; its artifact is a separate deck. */
  createdOnFiles?: unknown;
  artifact?: string;
  assets?: Record<string, string>;
  replace?: Record<string, string>;
};

type DeckIndex = {
  artifact?: string;
  assets?: Record<string, string>;
  order: string[];
  variants?: Record<string, Variant>;
  [key: string]: unknown;
};

const [name, variantName] = process.argv.slice(2);
if (!name) {
  console.error("usage: node scripts/pitch-decks.ts <fuuga|quantum> [variant]");
  process.exit(2);
}

const src = path.resolve("docs/pitch-decks", name);
const label = variantName ? `${name}-${variantName}` : name;
const outRoot = path.resolve(".output/pitch-decks", label);
const out = path.join(outRoot, "project");

const index = JSON.parse(await readFile(path.join(src, "deck.json"), "utf8")) as DeckIndex;
const { artifact: baseArtifact, assets: baseAssets = {}, variants = {}, ...base } = index;

const variant = variantName ? variants[variantName] : undefined;
if (variantName && !variant)
  throw new Error(
    `${name}/deck.json has no variant "${variantName}" (have: ${Object.keys(variants).join(", ") || "none"})`,
  );

const artifact = variant ? variant.artifact : baseArtifact;
const assets = variant ? (variant.assets ?? {}) : baseAssets;
const replace = variant?.replace ?? {};
const published = variant
  ? {
      ...base,
      title: variant.title,
      order: variant.order,
      ...(variant.sections ? { sections: variant.sections } : {}),
      ...(variant.createdOnFiles ? { createdOnFiles: variant.createdOnFiles } : {}),
    }
  : base;
if (!variant && !artifact) throw new Error(`${name}/deck.json has no "artifact" URL`);

const slides = (await readdir(path.join(src, "slides"))).filter((f) => f.endsWith(".html"));
const missing = published.order.filter((id) => !slides.includes(`${id}.html`));
if (missing.length)
  throw new Error(`${label}: slides listed in order but missing: ${missing.join(", ")}`);

await rm(outRoot, { recursive: true, force: true });
await mkdir(path.join(out, "slides"), { recursive: true });
await writeFile(path.join(out, "deck.json"), JSON.stringify(published, null, 2) + "\n");

// The founder's address is assembled here from parts and substituted for the
// {{founderEmail}} token, so the public repository never carries it as a
// literal for scrapers; the built deck and the private artifact do.
const founderEmail = ["tuo", "mas", "@", "hietanen.co.uk"].join("");
const withContacts = (html: string) => html.replaceAll("{{founderEmail}}", founderEmail);

// <!-- --> comments in a slide cite where a figure comes from; they are for
// whoever edits the source, so they stay out of the published deck.
const withoutComments = (html: string) => html.replace(/[ \t]*<!--[\s\S]*?-->\r?\n?/g, "");

// Footers read "Hietanen Consultancy … · <product> · 08"; the number is the
// slide's position in this deck's order.
const withPageNumber = (html: string, page: number) =>
  html.replace(
    /(Hietanen Consultancy[^<]*? · )\d{2}(?=[ <])/,
    `$1${String(page).padStart(2, "0")}`,
  );

const withReplacements = (html: string) =>
  Object.entries(replace).reduce((text, [from, to]) => text.replaceAll(from, to), html);

const unpublishedAssets = new Set<string>();
for (const [i, id] of published.order.entries()) {
  const file = `${id}.html`;
  const html = withReplacements(
    withPageNumber(
      withContacts(withoutComments(await readFile(path.join(src, "slides", file), "utf8"))),
      i + 1,
    ),
  );
  const rewritten = html.replace(/\.\.\/assets\/([\w.-]+)/g, (ref, asset: string) => {
    const id = assets[asset];
    if (id) return `/_blob/${id}`;
    if (artifact) throw new Error(`${label}/slides/${file}: ${asset} has no asset id in deck.json`);
    unpublishedAssets.add(asset);
    return ref;
  });
  await writeFile(path.join(out, "slides", file), rewritten);
}

if (unpublishedAssets.size) {
  await mkdir(path.join(out, "assets"), { recursive: true });
  for (const asset of unpublishedAssets)
    await copyFile(path.join(src, "assets", asset), path.join(out, "assets", asset));
}

console.log(`${label}: ${published.order.length} slides → ${path.relative(process.cwd(), out)}`);
console.log(
  artifact
    ? `publish to ${artifact}`
    : `not yet published: create it from the Slides type, upload ${[...unpublishedAssets].join(", ") || "no assets"}, then record artifact and asset ids under variants.${variantName}`,
);
