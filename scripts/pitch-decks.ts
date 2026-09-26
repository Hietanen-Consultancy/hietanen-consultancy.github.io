// Builds a publishable bundle of an investor deck from its sources in
// docs/pitch-decks/<name>/.
//
//   node scripts/pitch-decks.ts fuuga
//   node scripts/pitch-decks.ts quantum
//
// The sources are the deck itself: deck.json (the index) and one HTML section
// per slide, with images referenced as ../assets/<file> so they render and
// diff locally. The deck is hosted as a claude.ai Slides artifact, which
// stores images as uploaded assets addressed by /_blob/<id>; deck.json's
// `assets` map records which id each file was uploaded under, and this script
// rewrites the references and drops the repo-only keys.
//
// Output: .output/pitch-decks/<name>/project/{deck.json,slides/*.html}.
// Publish that folder to the URL in deck.json's `artifact` field (the Artifact
// tool in a Claude Code session, root = the <name> folder). A new image must
// first be uploaded to the artifact as an asset; add its id to `assets`.
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

type DeckIndex = {
  artifact?: string;
  assets?: Record<string, string>;
  order: string[];
  [key: string]: unknown;
};

const name = process.argv[2];
if (!name) {
  console.error("usage: node scripts/pitch-decks.ts <fuuga|quantum>");
  process.exit(2);
}

const src = path.resolve("docs/pitch-decks", name);
const out = path.resolve(".output/pitch-decks", name, "project");

const index = JSON.parse(await readFile(path.join(src, "deck.json"), "utf8")) as DeckIndex;
const { artifact, assets = {}, ...published } = index;
if (!artifact) throw new Error(`${name}/deck.json has no "artifact" URL`);

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, "slides"), { recursive: true });
await writeFile(path.join(out, "deck.json"), JSON.stringify(published, null, 2) + "\n");

const slides = (await readdir(path.join(src, "slides"))).filter((f) => f.endsWith(".html"));
const missing = index.order.filter((id) => !slides.includes(`${id}.html`));
if (missing.length)
  throw new Error(`${name}: slides listed in order but missing: ${missing.join(", ")}`);

// The founder's address is assembled here from parts and substituted for the
// {{founderEmail}} token, so the public repository never carries it as a
// literal for scrapers; the built deck and the private artifact do.
const founderEmail = ["tuo", "mas", "@", "hietanen.co.uk"].join("");
const withContacts = (html: string) => html.replaceAll("{{founderEmail}}", founderEmail);

for (const file of slides) {
  const html = withContacts(await readFile(path.join(src, "slides", file), "utf8"));
  const rewritten = html.replace(/\.\.\/assets\/([\w.-]+)/g, (_, asset: string) => {
    const id = assets[asset];
    if (!id) throw new Error(`${name}/slides/${file}: ${asset} has no asset id in deck.json`);
    return `/_blob/${id}`;
  });
  await writeFile(path.join(out, "slides", file), rewritten);
}

console.log(`${name}: ${slides.length} slides → ${path.relative(process.cwd(), out)}`);
console.log(`publish to ${artifact}`);
