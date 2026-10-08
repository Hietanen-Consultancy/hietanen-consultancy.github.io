/**
 * Draws the Fuuga figure: a hosted frontier model, the same with the documents
 * you may share in its context, an open base model, and that open model
 * retrained on your data with Fuuga — ahead across your domain, with the small
 * loss just outside it that fine-tuning costs.
 *
 * An illustration, not a measurement: every pilot measures the curves on the
 * customer's own tasks. Colours are the Fuuga page palette, so the same drawing
 * works on the website and on the deck slide. Run: node scripts/fuuga-figures.ts
 */
import { mkdir, writeFile } from "node:fs/promises";

const W = 480;
const H = 320;
const left = 40;
const right = 468;
const top = 26;
const bottom = 270;
const domain = { centre: 262, from: 196, to: 328 };

const ink = { bg: "#0c0a1c", grid: "#2b2552", text: "#a9a3c9", strong: "#f1eefc" };
const colour = { hosted: "#7dd3fc", fuuga: "#a78bfa", base: "#6b6491" };
const font = "'JetBrains Mono', ui-monospace, Consolas, monospace";

const g = (x: number, mean: number, sd: number) => Math.exp(-(((x - mean) / sd) ** 2) / 2);

// Capability on a 0..1 scale.
// Where the open model starts: a little below the hosted model.
const open = 0.45;
const base = () => open;
const hosted = () => 0.6;
const hostedDocs = (x: number) => 0.6 + 0.16 * g(x, domain.centre, 48);
// A flat-topped rise (a fourth-power bell), so the retrained model stays above
// the hosted line across the whole domain band: the route figure's caption says
// every request in the domain is answered in-house, and the curve has to agree.
const plateau = (x: number) => Math.exp(-(((x - domain.centre) / 62) ** 4) / 2);
// Where fine-tuning costs a little general ability: just outside the band, so in
// the route figure those requests sit under the hosted line.
const loss = { left: domain.centre - 105, right: domain.centre + 105 };
const fuuga = (x: number) =>
  open + 0.45 * plateau(x) - 0.05 * (g(x, loss.left, 14) + g(x, loss.right, 14));

const y = (c: number) => bottom - c * (bottom - top);
const path = (f: (x: number) => number) => {
  const points: string[] = [];
  for (let x = left; x <= right; x += 2) points.push(`${x},${y(f(x)).toFixed(1)}`);
  return `M${points.join(" L")}`;
};

const line = (f: (x: number) => number, stroke: string, width: number, extra = "") =>
  `<path d="${path(f)}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"${extra}/>`;

const text = (x: number, yy: number, s: string, fill = ink.text, anchor = "start", size = 13) =>
  `<text x="${x}" y="${yy}" fill="${fill}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;

function frame(title: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}" font-family="${font}">
  <title>${title}</title>
  <rect width="${W}" height="${H}" fill="${ink.bg}"/>
  <rect x="${domain.from}" y="${top - 8}" width="${domain.to - domain.from}" height="${bottom - top + 8}" fill="${colour.fuuga}" opacity="0.09"/>
  ${text(domain.centre, bottom + 20, "your domain", colour.fuuga, "middle")}
  ${text(domain.centre, bottom + 36, "e.g. payments", ink.text, "middle", 12)}
  <path d="M${left} ${top - 10} V${bottom} H${right + 4}" fill="none" stroke="${ink.grid}" stroke-width="2"/>
  ${text(left + 6, top, "capability", ink.text, "start", 12)}
  ${text(right, bottom + 20, "topics →", ink.text, "end", 12)}
  ${body}
</svg>
`;
}

const retrain = frame(
  "Retraining an open model with Fuuga: ahead of the hosted model across your domain, a small measured loss just outside it",
  [
    line(base, colour.base, 2, ` stroke-dasharray="2 5"`),
    line(hosted, colour.hosted, 2.5),
    line(hostedDocs, colour.hosted, 2.5, ` stroke-dasharray="7 6" opacity="0.8"`),
    line(fuuga, colour.fuuga, 3.5),
    text(left + 8, y(0.6) - 8, "hosted model", colour.hosted, "start", 12),
    text(352, y(0.6) - 30, "+ documents", colour.hosted, "start", 12),
    text(352, y(0.6) - 16, "you can share", colour.hosted, "start", 12),
    `<path d="M350 ${y(0.6) - 17} L341 ${y(hostedDocs(341)) - 2}" stroke="${colour.hosted}" stroke-width="1.2"/>`,
    text(right, y(0.9) - 10, "your Fuuga model,", colour.fuuga, "end", 12),
    text(right, y(0.9) + 4, "retrained on your data", colour.fuuga, "end", 12),
    text(right, y(open) - 22, "open model,", ink.text, "end", 12),
    text(right, y(open) - 8, "before retraining", ink.text, "end", 12),
    // A leader to the dotted line, where the retrained model has risen off it.
    `<path d="M345 ${y(open) - 9} L336 ${y(open) - 1}" stroke="${ink.text}" stroke-width="1.2"/>`,
    // The cost of fine-tuning, next to the spike: kept small, and measured.
    `<path d="M${loss.left} ${y(open - 0.07)} V${y(open - 0.04) + 3}" stroke="${ink.text}" stroke-width="1.5"/>`,
    text(loss.left, y(open - 0.07) + 16, "small loss,", ink.text, "middle", 12),
    text(loss.left, y(open - 0.07) + 31, "measured", ink.text, "middle", 12),
  ].join("\n  "),
);

// The website serves it from public/fuuga/; the Fuuga decks embed the same
// drawing from their assets/ folder (upload it again after a change).
const site = new URL("../public/fuuga/", import.meta.url);
const deck = new URL("../docs/pitch-decks/fuuga/assets/", import.meta.url);
await mkdir(site, { recursive: true });
await writeFile(new URL("retrain.svg", site), retrain);
await writeFile(new URL("fuuga-retrain.svg", deck), retrain);
console.log("wrote public/fuuga/retrain.svg and docs/pitch-decks/fuuga/assets/fuuga-retrain.svg");
