// Generates the Hietanen Consultancy brand mark candidates into public/brand/.
//
// Concept: the H as movement. Its crossbar flows into the right stem, which
// ends in an arrowhead — one continuous stroke, so it survives one-colour
// print, favicon size and dark backgrounds.
//
//   node scripts/generate-logo.ts
import { mkdir, writeFile } from "node:fs/promises";

const OUT = new URL("../public/brand/", import.meta.url);

const NAVY = "#152238";
const PRIMARY = "#3aa3d6";
const SIGNAL = "#4cc9c3";
const PAPER = "#f6f8fb";

const f = (n: number) => Number(n.toFixed(3)).toString();

type Options = {
  ink: string;
  /** Colour of the arrow stem and head; defaults to ink for one-colour use. */
  arrow?: string;
  /** Plain H, straight crossbar into an arrow stem, or a curve sweeping up into it. */
  flow?: "plain" | "straight" | "sweep";
};

/**
 * The mark in a 100×100 box. The left stem is a plain bar; the right stem is
 * an upward arrow; the crossbar joins it.
 */
const mark = ({ ink, arrow = ink, flow = "sweep" }: Options) => {
  const w = 13; // stroke weight
  const xl = 24; // left stem centre
  const xr = 74; // right stem centre
  const top = 14;
  const bottom = 88;
  const mid = 54; // crossbar centre line
  const headH = 20;
  const headW = 34;
  const cap = `stroke-width="${w}" stroke-linecap="butt" stroke-linejoin="round" fill="none"`;

  const leftStem = `<line x1="${xl}" y1="${top}" x2="${xl}" y2="${bottom}" stroke="${ink}" ${cap}/>`;
  if (flow === "plain") {
    const rightPlain = `<line x1="${xr}" y1="${top}" x2="${xr}" y2="${bottom}" stroke="${ink}" ${cap}/>`;
    const bar = `<line x1="${xl}" y1="${mid}" x2="${xr}" y2="${mid}" stroke="${ink}" ${cap}/>`;
    return `
  ${leftStem}
  ${rightPlain}
  ${bar}`;
  }
  // The right stem stops where the arrowhead begins.
  const rightStem = `<line x1="${xr}" y1="${top + headH - 2}" x2="${xr}" y2="${bottom}" stroke="${arrow}" ${cap}/>`;
  const head = `<polygon points="${f(xr - headW / 2)},${f(top + headH)} ${xr},${top} ${f(xr + headW / 2)},${f(top + headH)}" fill="${arrow}"/>`;
  const crossbar =
    flow === "straight"
      ? `<line x1="${f(xl + w / 2)}" y1="${mid}" x2="${xr}" y2="${mid}" stroke="${ink}" ${cap}/>`
      : // From the left stem, run flat, then curve up and merge with the right stem.
        `<path d="M${f(xl + w / 2)},${mid} H${f(xr - 22)} Q${xr},${mid} ${xr},${f(mid - 22)} V${f(top + headH + 4)}" stroke="${arrow}" ${cap}/>`;
  return `\n  ${leftStem}\n  ${rightStem}\n  ${head}\n  ${crossbar}`;
};

type SvgOptions = { viewBox?: string; ground?: string; radius?: number; label?: string };

const svg = (body: string, opts: SvgOptions = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${opts.viewBox ?? "0 0 100 100"}" role="img" aria-label="${opts.label ?? "Hietanen Consultancy"}">${
    opts.ground
      ? `\n  <rect width="100" height="100" rx="${opts.radius ?? 22}" fill="${opts.ground}"/>`
      : ""
  }${body}\n</svg>\n`;

const wordmark = (x: number, ink: string, sub: string) => `
  <text x="${x}" y="57" font-family="Manrope, 'Segoe UI', system-ui, sans-serif" font-weight="800" font-size="40" fill="${ink}" letter-spacing="-1">Hietanen</text>
  <text x="${x + 2}" y="83" font-family="'JetBrains Mono', ui-monospace, monospace" font-weight="500" font-size="14" fill="${sub}" letter-spacing="4">CONSULTANCY</text>`;

const files: Record<string, string> = {
  // Plain H, the mark in use for now.
  "mark-plain.svg": svg(mark({ ink: NAVY, flow: "plain" })),
  "icon-plain.svg": svg(mark({ ink: PAPER, flow: "plain" }), { ground: NAVY }),
  // Arrow variants, kept as candidates.
  "mark-mono.svg": svg(mark({ ink: NAVY })),
  "mark-mono-black.svg": svg(mark({ ink: "#000000" })),
  // Two colour: the arrow in the signal teal.
  "mark.svg": svg(mark({ ink: NAVY, arrow: SIGNAL })),
  // Straight-crossbar variant for comparison.
  "mark-straight.svg": svg(mark({ ink: NAVY, arrow: SIGNAL, flow: "straight" })),
  // Tiles for favicon / avatar: paper on navy, and pure white on black.
  "icon.svg": svg(mark({ ink: PAPER, arrow: SIGNAL }), { ground: NAVY }),
  "icon-mono.svg": svg(mark({ ink: "#ffffff" }), { ground: "#000000" }),
  // Round avatar.
  "mark-round.svg": svg(
    `\n  <circle cx="50" cy="50" r="50" fill="${NAVY}"/>\n  <g transform="translate(12 12) scale(0.76)">${mark({ ink: PAPER, arrow: SIGNAL })}\n  </g>`,
  ),
  // Lockups, colour and mono.
  "lockup.svg": svg(
    `\n  <rect width="100" height="100" rx="22" fill="${NAVY}"/>${mark({ ink: PAPER, arrow: SIGNAL })}${wordmark(126, NAVY, PRIMARY)}`,
    { viewBox: "0 0 440 100" },
  ),
  "lockup-mono.svg": svg(`${mark({ ink: "#000000" })}${wordmark(114, "#000000", "#000000")}`, {
    viewBox: "0 0 440 100",
  }),
  // Seal.
  "seal.svg": svg(
    `
  <defs>
    <path id="arc-top" d="M28,100 A72,72 0 0,1 172,100"/>
    <path id="arc-bottom" d="M28,100 A72,72 0 0,0 172,100"/>
  </defs>
  <circle cx="100" cy="100" r="98" fill="${PAPER}" stroke="${NAVY}" stroke-width="2"/>
  <circle cx="100" cy="100" r="88" fill="none" stroke="${NAVY}" stroke-width="0.75"/>
  <circle cx="100" cy="100" r="58" fill="none" stroke="${NAVY}" stroke-width="0.75"/>
  <g font-family="'JetBrains Mono', ui-monospace, monospace" font-size="11.5" font-weight="500" fill="${NAVY}" letter-spacing="2.2" text-anchor="middle">
    <text><textPath href="#arc-top" startOffset="50%">HIETANEN CONSULTANCY</textPath></text>
    <text><textPath href="#arc-bottom" startOffset="50%">LONDON</textPath></text>
  </g>
  <g transform="translate(62 62) scale(0.76)">${mark({ ink: NAVY, flow: "plain" })}
  </g>`,
    { viewBox: "0 0 200 200", label: "Hietanen Consultancy seal" },
  ),
};

await mkdir(OUT, { recursive: true });
for (const [name, body] of Object.entries(files)) await writeFile(new URL(name, OUT), body);
console.log(`Wrote ${Object.keys(files).join(", ")} to public/brand/`);
