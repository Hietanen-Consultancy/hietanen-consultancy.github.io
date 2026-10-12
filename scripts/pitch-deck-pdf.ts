// Renders a built deck to a PDF for the website, one 1920×1080 page per slide.
//
//   node scripts/pitch-decks.ts fuuga customer
//   node scripts/pitch-deck-pdf.ts fuuga customer public/decks/fuuga-customer-briefing.pdf
//
// It reads the bundle scripts/pitch-decks.ts wrote to .output/pitch-decks/, so
// run that first. The speaker notes follow the slides as a Notes appendix, so
// the PDF carries them as text a reader and a search engine can see, and the
// deck's title becomes the PDF's title. The slide viewer's own elements
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
type Built = { title?: string; order: string[]; faces?: Record<string, Face> };
type Note = { number: string; title: string; text: string };
type Source = {
  assets?: Record<string, string>;
  variants?: Record<string, { assets?: Record<string, string> }>;
};

const args = process.argv.slice(2);
const [name, variantName, outFile] = args.length === 2 ? [args[0], undefined, args[1]] : args;
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

// A PDF written under public/ is published with the site, so the founder's
// address the bundle carries gives way to the site's contact mailbox
// (src/content/company.ts), as on every web page. A PDF written anywhere else
// is handed to a person and keeps the founder's address, as the deck viewer does.
const companySource = await readFile(path.resolve("src/content/company.ts"), "utf8");
const publicContact = /contact:\s*"mailto:([^"]+)"/.exec(companySource)?.[1];
if (!publicContact) throw new Error("no contact mailbox in src/content/company.ts");
const founderEmail = ["tuo", "mas", "@", "hietanen.co.uk"].join("");
const underPublic = path.relative(path.resolve("public"), path.resolve(outFile));
const published = !underPublic.startsWith("..") && !path.isAbsolute(underPublic);
const contact = published ? publicContact : founderEmail;

const plain = (html: string) =>
  html
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const slides: string[] = [];
const notes: Note[] = [];
for (const [i, id] of index.order.entries()) {
  let html = await readFile(path.join(built, "slides", `${id}.html`), "utf8");
  html = html.replaceAll(founderEmail, contact);
  const aside = /<aside>([\s\S]*?)<\/aside>/.exec(html)?.[1]?.trim();
  if (aside)
    notes.push({
      number: String(i + 1).padStart(2, "0"),
      title: plain(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/.exec(html)?.[1] ?? id),
      text: aside,
    });
  html = html
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

// The notes pages use the deck's body typeface, from its second slide (the
// first after the cover).
const second = await readFile(
  path.join(built, "slides", `${index.order[1] ?? index.order[0]}.html`),
  "utf8",
);
const bodyFont =
  /<section[^>]*style="[^"]*font-family:\s*([^;"]+)/.exec(second)?.[1]?.trim() ??
  "Arial, sans-serif";

// A heading line in the notes is short and ends without punctuation ("Detail",
// "Common questions"); a line opening with a dash is a point; the rest is prose.
const noteLine = (line: string) => {
  const text = escape(line.trim());
  if (text.startsWith("— ")) return `<p class="point">${text}</p>`;
  if (text.length <= 40 && !/[.?!:;,)]$/.test(text)) return `<p class="sub">${text}</p>`;
  return `<p>${text}</p>`;
};
const noteBlock = (note: Note) => `<div class="note">
<h2>${escape(note.number)} · ${escape(note.title)}</h2>
${note.text
  .split(/\n+/)
  .filter((line) => line.trim())
  .map(noteLine)
  .join("\n")}
</div>`;
const notesHtml = notes.length
  ? `<article class="notes">\n<h1>Speaker notes · ${escape(index.title ?? label)}</h1>\n${notes.map(noteBlock).join("\n")}\n</article>`
  : "";

const title = [index.title, "Hietanen Consultancy"].filter(Boolean).join(" · ");

const fonts = Object.values(index.faces ?? {})
  .flatMap((face) => (face.href ? [`<link rel="stylesheet" href="${face.href}">`] : []))
  .join("\n");

const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${escape(title)}</title>
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
  /* The notes are a reference, not part of the show: plain white A4 after the
     slides, small type in two columns. */
  @page notes { size: A4; margin: 10mm 11mm }
  .notes { page: notes; break-before: page; columns: 2; column-gap: 7mm; color: #1f1f1f; background: #ffffff; font-family: ${bodyFont}; font-size: 6.5pt; line-height: 1.25 }
  .notes h1 { column-span: all; font-size: 11pt; font-weight: 600; margin: 0 0 3mm }
  .note { margin: 0 0 2.5mm }
  .note h2 { font-size: 7pt; font-weight: 600; margin: 0 0 0.8mm; break-after: avoid }
  .note p { margin: 0 0 0.6mm }
  .note p.point { padding-left: 2.5mm; text-indent: -2.5mm }
  .note p.sub { font-size: 6pt; letter-spacing: 0.5px; text-transform: uppercase; color: #6b6b6b; margin-top: 1mm; break-after: avoid }
</style></head>
<body>
${slides.join("\n")}
${notesHtml}
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
console.log(
  `${label}: ${slides.length} slides, notes for ${notes.length} → ${path.relative(process.cwd(), out)}`,
);
