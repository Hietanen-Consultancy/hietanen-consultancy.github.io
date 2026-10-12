// Tidies the prerendered pages in dist/client after `vite build`, so that the
// published HTML validates (validator.w3.org/nu) without touching what the
// browser sees.
//
//   node scripts/postprocess-html.ts
//
// - TanStack Router separates the parts of a match id with U+0000, and the
//   hydration script carries those ids as raw bytes; a NUL is a parse error in
//   HTML. Inside a JavaScript string literal the escape `\u0000` is the same
//   character, so the raw byte is rewritten to the escape.
// - React renders void elements as `<meta … />`. The slash is ignored by
//   parsers and only invites confusion (the validator flags each one), so it
//   is dropped. React escapes `>` in attribute values, which keeps the tag
//   match safe.
// - robots.txt gets a `Sitemap:` line when the public URL is known, so the
//   sitemap is discoverable without a search-console registration.
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../dist/client/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const siteUrl = process.env["SITE_URL"]?.replace(/\/+$/, "");
const siteBase = (process.env["SITE_BASE"] ?? "/").replace(/\/*$/, "/");

const htmlFiles = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  for (const entry of await readdir(dir)) {
    const path = join(dir, entry);
    if ((await stat(path)).isDirectory()) out.push(...(await htmlFiles(path)));
    else if (entry.endsWith(".html")) out.push(path);
  }
  return out;
};

const voidTag =
  /<(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)\b([^>]*?)\s*\/>/g;

let changed = 0;
for (const file of await htmlFiles(root)) {
  const html = await readFile(file, "utf8");
  const nulls = html.split("\u0000").length - 1;
  const slashes = html.match(voidTag)?.length ?? 0;
  if (!nulls && !slashes) continue;
  const tidy = html.replaceAll("\u0000", "\\u0000").replace(voidTag, "<$1$2>");
  await writeFile(file, tidy);
  changed++;
  console.log(
    `  · ${relative(root, file).replace(/\\/g, "/")}: ${nulls} NUL escaped, ${slashes} void slashes dropped`,
  );
}

if (siteUrl) {
  // TanStack writes page paths without the trailing slash the pages are
  // actually served under (see pageUrl in src/lib/site.ts).
  const sitemap = join(root, "sitemap.xml");
  const xml = await readFile(sitemap, "utf8");
  const slashed = xml.replace(/<loc>([^<]*[^/<])<\/loc>/g, "<loc>$1/</loc>");
  if (slashed !== xml) {
    await writeFile(sitemap, slashed);
    console.log("  · sitemap.xml: trailing slashes added");
  }

  const robots = join(root, "robots.txt");
  const text = await readFile(robots, "utf8");
  if (!/^Sitemap:/m.test(text)) {
    await writeFile(robots, `${text.trimEnd()}\n\nSitemap: ${siteUrl}${siteBase}sitemap.xml\n`);
    console.log("  · robots.txt: Sitemap line added");
  }
}

console.log(`Post-processed ${changed} page(s).`);
