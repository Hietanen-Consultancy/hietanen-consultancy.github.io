// Checks every prerendered page in dist/client for the metadata social
// platforms and search engines need. Fails the build on the first page that
// is missing something, so a broken share card never reaches production.
//
//   SITE_URL=https://example.com node scripts/check-seo.ts
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../dist/client/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const siteUrl = process.env["SITE_URL"];

const htmlFiles = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  for (const entry of await readdir(dir)) {
    const path = join(dir, entry);
    if ((await stat(path)).isDirectory()) out.push(...(await htmlFiles(path)));
    else if (entry.endsWith(".html")) out.push(path);
  }
  return out;
};

const attr = (
  html: string,
  tag: string,
  key: string,
  value: string,
  want: string,
): string | undefined => {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<${tag}\\b[^>]*\\b${key}="${escaped}"[^>]*>`, "i");
  const el = re.exec(html)?.[0];
  if (!el) return undefined;
  return new RegExp(`\\b${want}="([^"]*)"`, "i").exec(el)?.[1];
};

const meta = (html: string, name: string) =>
  attr(html, "meta", "name", name, "content") ?? attr(html, "meta", "property", name, "content");

let problems = 0;
const fail = (page: string, message: string) => {
  problems++;
  console.error(`  ✖ ${page}: ${message}`);
};

const localAssetExists = async (url: string) => {
  if (!siteUrl || !url.startsWith(siteUrl)) return true; // external image, cannot check
  const path = url.slice(siteUrl.length);
  // The URL may carry the repository sub-path (/repo/og/home.png); try both.
  const candidates = [path, path.replace(/^\/[^/]+/, "")].map((p) =>
    join(root, p.replace(/^\//, "")),
  );
  for (const c of candidates) {
    try {
      await stat(c);
      return true;
    } catch {
      /* try next */
    }
  }
  return false;
};

const pages = await htmlFiles(root);
const pageCanonicals = new Map<string, string>();
if (pages.length === 0) {
  console.error("No prerendered pages found in dist/client — run the static build first.");
  process.exit(1);
}

for (const file of pages) {
  const page = relative(root, file).replace(/\\/g, "/");
  const html = await readFile(file, "utf8");

  if (!/<html[^>]*\blang="/.test(html)) fail(page, "<html> has no lang attribute");
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim();
  if (!title) fail(page, "no <title>");
  else if (title.length > 70) fail(page, `title is ${title.length} chars (keep it under 70)`);
  const description = meta(html, "description");
  if (!description) fail(page, "no meta description");
  else if (description.length < 50 || description.length > 170)
    fail(page, `description is ${description.length} chars (aim for 50–170)`);

  const h1s = html.match(/<h1\b/g)?.length ?? 0;
  if (h1s !== 1) fail(page, `${h1s} <h1> elements (want exactly one)`);

  const canonical = attr(html, "link", "rel", "canonical", "href");
  if (!canonical) fail(page, "no canonical link");
  else if (!/^https?:\/\//.test(canonical)) fail(page, `canonical is not absolute: ${canonical}`);
  else if (siteUrl && !canonical.startsWith(siteUrl))
    fail(page, `canonical ${canonical} is not under ${siteUrl}`);
  // Pages are served as <path>/index.html; the static host redirects the
  // slash-less URL, and a canonical that redirects is a canonical crawlers
  // second-guess. og:url must be the same URL.
  else if (!canonical.endsWith("/")) fail(page, `canonical ${canonical} lacks a trailing slash`);
  else if (meta(html, "og:url") !== canonical) fail(page, "og:url differs from canonical");
  if (canonical) pageCanonicals.set(page, canonical);

  for (const p of ["og:title", "og:description", "og:type", "og:url", "og:image", "twitter:card"]) {
    if (!meta(html, p)) fail(page, `missing ${p}`);
  }
  for (const p of ["og:url", "og:image"]) {
    const v = meta(html, p);
    if (v && !/^https?:\/\//.test(v)) fail(page, `${p} is not absolute: ${v}`);
  }
  const image = meta(html, "og:image");
  if (image && !(await localAssetExists(image)))
    fail(page, `og:image does not exist in the build: ${image}`);

  const imgsWithoutAlt = html.match(/<img\b(?![^>]*\balt=)[^>]*>/g)?.length ?? 0;
  if (imgsWithoutAlt) fail(page, `${imgsWithoutAlt} <img> without alt`);

  // Every page carries schema.org JSON-LD, and it must parse: a stray quote
  // silently turns structured data into nothing. A raw `<` inside the JSON is
  // a `</script>` waiting to happen; site.ts writes it as <.
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  if (jsonLd.length === 0) fail(page, "no JSON-LD");
  for (const [, json] of jsonLd) {
    if (json?.includes("<")) fail(page, "JSON-LD contains a raw < (jsonLd in site.ts escapes it)");
    try {
      const data = JSON.parse(json ?? "") as { "@type"?: string };
      if (!data["@type"]) fail(page, "JSON-LD without @type");
    } catch (error) {
      fail(page, `JSON-LD does not parse: ${(error as Error).message}`);
    }
  }

  // What validator.w3.org/nu rejects and postprocess-html.ts / the Vite
  // config are there to prevent.
  if (html.includes("\u0000")) fail(page, "contains U+0000 (postprocess-html.ts did not run?)");
  const badDataUrls = html.match(/src="data:[^"]*[{}[\]|^`\\][^"]*"/g)?.length ?? 0;
  if (badDataUrls) fail(page, `${badDataUrls} data: URL(s) with characters the validator rejects`);
}

// llms.txt is generated from the content modules after the build and should
// link every page.
try {
  const llms = await readFile(join(root, "llms.txt"), "utf8");
  for (const file of pages) {
    const path = relative(root, file)
      .replace(/\\/g, "/")
      .replace(/\/?index\.html$/, "");
    if (path && !llms.includes(`/${path}`)) fail("llms.txt", `does not link /${path}`);
  }
} catch {
  fail("llms.txt", "missing (scripts/llms-txt.ts did not run?)");
}

const sitemap = join(root, "sitemap.xml");
try {
  const xml = await readFile(sitemap, "utf8");
  const urls = new Set([...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]));
  if (urls.size < pages.length)
    fail("sitemap.xml", `lists ${urls.size} URLs for ${pages.length} pages`);
  // The sitemap and the canonicals must agree, or search engines see two
  // URLs for every page.
  for (const [page, canonical] of pageCanonicals)
    if (!urls.has(canonical))
      fail("sitemap.xml", `does not list the canonical of ${page}: ${canonical}`);
} catch {
  if (siteUrl)
    fail("sitemap.xml", "missing (SITE_URL is set, so the build should have generated it)");
  else console.log("  · sitemap.xml skipped: SITE_URL not set");
}

console.log(
  problems
    ? `${problems} SEO problem(s) across ${pages.length} pages.`
    : `SEO OK: ${pages.length} pages.`,
);
process.exit(problems ? 1 : 0);
