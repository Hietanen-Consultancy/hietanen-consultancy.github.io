// Renders a built deck to a PDF for the website, one 1920×1080 page per slide.
//
//   node scripts/pitch-decks.ts fuuga customer
//   node scripts/pitch-deck-pdf.ts fuuga customer public/decks/fuuga-customer-briefing.pdf
//
// It reads the bundle scripts/pitch-decks.ts wrote to .output/pitch-decks/, so
// run that first. Speaker notes are dropped. The slide viewer's own elements
// have no browser rendering, so <x-icon> becomes the matching lucide icon and
// <x-shape> a plain SVG; images come from the deck's assets/ folder, mapped back
// from their /_blob/<id> form. Headless Edge (or Chrome) prints the page, and
// the Google Fonts the deck names are loaded as they are in the viewer.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as lucide from "lucide-react";
import type { LucideProps } from "lucide-react";

type Face = { family: string; href?: string };
type Built = { order: string[]; faces?: Record<string, Face> };
type Source = {
  assets?: Record<string, string>;
  variants?: Record<string, { assets?: Record<string, string> }>;
};

const [name, variantName, outFile] = process.argv.slice(2);
if (!name || !outFile) {
  console.error("usage: node scripts/pitch-deck-pdf.ts <deck> [variant] <out.pdf>");
  process.exit(2);
}

const label = variantName ? `${name}-${variantName}` : name;
const built = path.resolve(".output/pitch-decks", label, "project");
const src = path.resolve("docs/pitch-decks", name);

const index = JSON.parse(await readFile(path.join(built, "deck.json"), "utf8")) as Built;
const source = JSON.parse(await readFile(path.join(src, "deck.json"), "utf8")) as Source;
const assets = (variantName ? source.variants?.[variantName]?.assets : source.assets) ?? {};
const assetById = new Map(Object.entries(assets).map(([file, id]) => [id, file]));

// The slide viewer's icon names, mapped to lucide's.
const iconNames: Record<string, string> = {
  Activity: "Activity",
  Book: "Book",
  Chart: "BarChart3",
  Chat: "MessageSquare",
  Check: "Check",
  CheckCircle: "CircleCheck",
  Clock: "Clock",
  Cloud: "Cloud",
  Code: "Code",
  Database: "Database",
  Globe: "Globe",
  GraduationCap: "GraduationCap",
  Home: "House",
  Key: "Key",
  Lightbulb: "Lightbulb",
  Lightning: "Zap",
  Link: "Link",
  Lock: "Lock",
  PaperPlane: "Send",
  Play: "Play",
  Search: "Search",
  Settings: "Settings",
  Star: "Star",
  ThumbsUp: "ThumbsUp",
  Tool: "Hammer",
  Trust: "ShieldCheck",
  Users: "Users",
  Verified: "BadgeCheck",
  Warning: "TriangleAlert",
  Wrench: "Wrench",
};

const icon = (_: string, name: string, style: string) => {
  const lucideName = iconNames[name];
  const component =
    lucideName && (lucide as unknown as Record<string, ComponentType<LucideProps>>)[lucideName];
  if (!component) throw new Error(`${label}: no lucide icon for x-icon "${name}"`);
  const svg = renderToStaticMarkup(createElement(component, { width: "100%", height: "100%" }));
  return `<span style="${style}; display:inline-block; flex-shrink:0">${svg}</span>`;
};

// Block arrows fill their box, head on the last 40% of the length, as the viewer draws them.
const arrows: Record<string, string> = {
  "arrow-down": "25,0 75,0 75,60 100,60 50,100 0,60 25,60",
  "arrow-up": "50,0 100,40 75,40 75,100 25,100 25,40 0,40",
  "arrow-right": "0,25 60,25 60,0 100,50 60,100 60,75 0,75",
  "arrow-left": "40,0 40,25 100,25 100,75 40,75 40,100 0,50",
};

const shape = (_: string, kind: string, style: string) => {
  const fill = /background:\s*([^;]+)/.exec(style)?.[1]?.trim() ?? "currentColor";
  const box = `${style.replace(/background:[^;]+;?/, "")}; display:block`;
  const points = arrows[kind];
  if (points)
    return `<span style="${box}"><svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%"><polygon points="${points}" fill="${fill}"/></svg></span>`;
  const radius = kind === "ellipse" ? "50%" : kind === "rounded" ? "16px" : "0";
  return `<span style="${style}; display:block; border-radius:${radius}"></span>`;
};

// The PDF is public, so the founder's address the bundle carries gives way to
// the site's contact mailbox (src/content/company.ts), as on every web page.
const companySource = await readFile(path.resolve("src/content/company.ts"), "utf8");
const publicContact = /contact:\s*"mailto:([^"]+)"/.exec(companySource)?.[1];
if (!publicContact) throw new Error("no contact mailbox in src/content/company.ts");
const founderEmail = ["tuo", "mas", "@", "hietanen.co.uk"].join("");

const slides: string[] = [];
for (const id of index.order) {
  let html = await readFile(path.join(built, "slides", `${id}.html`), "utf8");
  html = html
    .replaceAll(founderEmail, publicContact)
    .replace(/<aside>[\s\S]*?<\/aside>/g, "")
    .replace(/<x-icon name="([^"]+)" style="([^"]*)"><\/x-icon>/g, icon)
    .replace(/<x-shape kind="([^"]+)" style="([^"]*)"><\/x-shape>/g, shape)
    .replace(/\/_blob\/([0-9a-f]{32})/g, (blob, assetId: string) => {
      const file = assetById.get(assetId);
      if (!file) throw new Error(`${label}/${id}: ${blob} has no local asset`);
      return pathToFileURL(path.join(src, "assets", file)).href;
    });
  if (/<x-(icon|shape|connector|embed)/.test(html))
    throw new Error(`${label}/${id}: a viewer element was left unconverted`);
  slides.push(html);
}

const fonts = Object.values(index.faces ?? {})
  .flatMap((face) => (face.href ? [`<link rel="stylesheet" href="${face.href}">`] : []))
  .join("\n");

const page = `<!doctype html>
<html><head><meta charset="utf-8">
${fonts}
<style>
  @page { size: 1920px 1080px; margin: 0 }
  html, body { margin: 0; padding: 0 }
  section { width: 1920px; height: 1080px; position: relative; overflow: hidden; box-sizing: border-box; break-after: page }
  section:last-child { break-after: auto }
  /* The viewer paints flow content as one layer where the first flow child
     sits, so a pinned backdrop listed earlier stays behind the text. A browser
     paints positioned boxes over flow content instead; making the flow
     children positioned restores the viewer's source-order stacking. */
  section > :not([style*="position:absolute"]) { position: relative }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact }
  p, h1, h2, h3, ul { margin: 0 }
  table { border-collapse: collapse; width: 100% }
  td, th { padding: 0.35em 0.6em; border-bottom: 1px solid rgba(127,127,127,0.25) }
  a { text-decoration: none }
</style></head>
<body>
${slides.join("\n")}
</body></html>`;

const work = path.resolve(".output/pitch-decks", `${label}-pdf`);
await rm(work, { recursive: true, force: true });
await mkdir(work, { recursive: true });
const htmlPath = path.join(work, "deck.html");
await writeFile(htmlPath, page);

const browsers = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/chromium",
  "/usr/bin/google-chrome",
];
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error("no Edge or Chrome found to print the PDF");

const out = path.resolve(outFile);
await mkdir(path.dirname(out), { recursive: true });
execFileSync(browser, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--virtual-time-budget=15000",
  `--user-data-dir=${path.join(work, "profile")}`,
  `--print-to-pdf=${out}`,
  pathToFileURL(htmlPath).href,
]);
console.log(`${label}: ${slides.length} pages → ${path.relative(process.cwd(), out)}`);
