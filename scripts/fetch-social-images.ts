// Resolves each GitHub repository's current social-preview image, writes the
// URLs to src/content/social-images.json and keeps a local copy of each image
// in src/assets/social/<repository id>.<ext>.
//
// A repository's custom social preview is only exposed as the `og:image` meta
// on its github.com page (the public opengraph.githubassets.com endpoint always
// returns the auto-generated card), so the lookup happens at build time; CI
// runs this before every deploy and on a weekly schedule.
//
// The site serves the local copies, never GitHub's URLs: a custom preview's URL
// dies the moment its owner uploads a new one, and a generated card is rendered
// on demand and answers HTTP 429 when GitHub's renderer is busy. The copies and
// the JSON are committed as a snapshot so local dev and the Lovable build work
// without network access; a failed lookup or download keeps the snapshot.
//
// Generated cards are recorded but not copied: they show the owner's avatar and
// cut long names short, so a repository without a custom preview gets a
// hand-made image in `repository-images.ts` instead, and this script says so.
//
//   node scripts/fetch-social-images.ts
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";

import { repositories } from "../src/content/repositories.ts";

const OUTPUT = new URL("../src/content/social-images.json", import.meta.url);
const ASSETS = new URL("../src/assets/social/", import.meta.url);
const githubRepoPath = /^https:\/\/github\.com\/([^/]+\/[^/#?]+)/;
const generatedCard = /^https:\/\/opengraph\.githubassets\.com\//;
const extensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const readSnapshot = async (): Promise<Record<string, string>> => {
  try {
    return JSON.parse(await readFile(OUTPUT, "utf8")) as Record<string, string>;
  } catch {
    return {};
  }
};

const resolveOgImage = async (href: string): Promise<string | undefined> => {
  const response = await fetch(href, {
    headers: { accept: "text/html", "user-agent": "hietanen-homebase-build" },
  });
  if (!response.ok) throw new Error(`${href}: HTTP ${response.status}`);
  const html = await response.text();
  const match = /<meta\s+property="og:image"\s+content="([^"]+)"/.exec(html);
  return match?.[1];
};

/** Local copies by repository id, e.g. `sqlprovider` → `sqlprovider.png`. */
const readCopies = async (): Promise<Map<string, string>> => {
  const copies = new Map<string, string>();
  for (const file of await readdir(ASSETS).catch(() => [] as string[])) {
    const dot = file.lastIndexOf(".");
    if (dot > 0) copies.set(file.slice(0, dot), file);
  }
  return copies;
};

/** Downloads the image and replaces any earlier copy of this repository's. */
const saveCopy = async (id: string, image: string, previous?: string): Promise<string> => {
  const response = await fetch(image, { headers: { "user-agent": "hietanen-homebase-build" } });
  if (!response.ok) throw new Error(`${image}: HTTP ${response.status}`);
  const type = (response.headers.get("content-type") ?? "").split(";")[0]?.trim() ?? "";
  const extension = extensions[type];
  if (!extension) throw new Error(`${image}: unexpected content type "${type}"`);
  const file = `${id}.${extension}`;
  await writeFile(new URL(file, ASSETS), Buffer.from(await response.arrayBuffer()));
  if (previous && previous !== file) await rm(new URL(previous, ASSETS));
  return file;
};

await mkdir(ASSETS, { recursive: true });
const snapshot = await readSnapshot();
const copies = await readCopies();
const next: Record<string, string> = {};
let failures = 0;

for (const [id, { href }] of Object.entries(repositories)) {
  if (!githubRepoPath.test(href)) continue;
  let image = snapshot[href];
  try {
    const resolved = await resolveOgImage(href);
    if (!resolved) throw new Error(`${href}: no og:image meta`);
    image = resolved;
  } catch (error) {
    failures++;
    console.warn(`! ${String(error)}`);
  }
  if (!image) continue;
  next[href] = image;

  const copy = copies.get(id);
  const changed = image !== snapshot[href];
  if (generatedCard.test(image)) {
    console.log(`  ${href} — generated card; give it a hand-made image in repository-images.ts`);
    continue;
  }
  if (copy && !changed) {
    console.log(`  ${href}`);
    continue;
  }
  try {
    console.log(`* ${href} → ${await saveCopy(id, image, copy)}`);
  } catch (error) {
    failures++;
    console.warn(`! ${String(error)}${copy ? `; kept ${copy}` : ""}`);
  }
}

await writeFile(OUTPUT, JSON.stringify(next, null, 2) + "\n");
console.log(
  `${Object.keys(next).length} images resolved${failures ? `, ${failures} failures kept from snapshot` : ""}.`,
);
