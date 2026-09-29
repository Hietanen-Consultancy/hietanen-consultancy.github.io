# Investor decks

Two investor decks, one per product, kept for when an opportunity to raise
comes up. The company's own plan is self-funded, and each deck's `selfpath`
slide shows it; the round is the optional accelerator on the slide after. The
sources here are the decks: edit them, build, publish.

| Deck                          | Folder     | Hosted at                                         |
| ----------------------------- | ---------- | ------------------------------------------------- |
| Fuuga — sovereign LLM stack   | `fuuga/`   | https://claude.ai/artifact/HeZZsKrdFRtMZzKAX94zSK |
| FSharp.Azure.Quantum — drones | `quantum/` | https://claude.ai/artifact/FSXy1JgvTFTazCAjGp1uwF |

The hosted copies are private claude.ai Slides artifacts; share them from the
page's Share menu, export PDF or PowerPoint from there.

## Layout

```
<deck>/
  deck.json        index: title, slide order, sections, typefaces, artifact URL, asset ids
  slides/<id>.html one <section id="<id>"> per slide, 1920×1080 canvas, inline styles only
  assets/          images the slides reference as ../assets/<file>
```

A slide's last child may be an `<aside>` with speaker notes. The allowed HTML
and CSS subset is the Slides artifact's (flex/grid layout, px units, hex
colours, no classes or `<style>`); the reference is inside the artifact under
`artifact-type/reference/format.md`.

## Updating

1. Edit `slides/*.html` (or add a slide file and its id to `order` in
   `deck.json`).
2. `node scripts/pitch-decks.ts fuuga` (or `quantum`) writes a publishable
   bundle to `.output/pitch-decks/<deck>/project/` with the image references
   rewritten to the artifact's `/_blob/<id>` form.
3. Publish that bundle to the artifact URL — in a Claude Code session, the
   Artifact tool with `url` = the deck's artifact, `root` = `.output/pitch-decks/<deck>`,
   `file_path` = `project/deck.json` and the changed slides in `files`.

Customer briefings are variants of the same sources: `variants.customer` in
each `deck.json` lists the slides (no financials, raise or margins; the
`offer` slide closes it) and `node scripts/pitch-decks.ts fuuga customer`
builds `.output/pitch-decks/fuuga-customer/project/`. Footer page numbers are
rewritten to each deck's order, so a shared slide never needs editing for it.
A variant gets its own artifact and asset ids once published; until then the
build keeps `../assets/` paths and copies the images alongside. Published:
Fuuga https://claude.ai/artifact/UhDXDfKmGPtUocoPsLWjPV, quantum
https://claude.ai/artifact/996fvhgKh2CeMD2PsvyQCM.

The product pages offer the customer briefings as PDFs from `public/decks/`.
Regenerate them after any change to a customer slide, then commit the PDFs:

```bash
node scripts/pitch-decks.ts fuuga customer
node scripts/pitch-deck-pdf.ts fuuga customer public/decks/fuuga-customer-briefing.pdf
node scripts/pitch-decks.ts quantum customer
node scripts/pitch-deck-pdf.ts quantum customer public/decks/quantum-fleet-planning-customer-briefing.pdf
```

The PDF script prints with headless Edge or Chrome, drops speaker notes,
draws the viewer's icons and shapes as SVG, and puts the site's contact
mailbox in place of the founder's address, since the PDFs are public.

New image: upload it to the artifact as an asset first, then add
`"<file>": "<asset id>"` to `assets` in `deck.json` and drop the file in
`assets/`.

## Content rules the decks follow

- Bracketed values (`[£__k]`, `[Claude Fable]`) are placeholders, not claims.
- `{{founderEmail}}` in a slide is filled in by `scripts/pitch-decks.ts`; the address itself is never written in the sources, which are public.
  Replace them before a deck leaves the company.
- Financials are labelled illustrative scenarios; their drivers are on the
  assumptions slide. Roadmap and projections use months/years from close, not
  calendar dates.
- Both libraries are public domain (Unlicense); the decks say so and argue the
  moat is elsewhere. Do not let a copy imply otherwise.
- The decks must not contradict the product pages (`src/content/company.ts`
  and `src/routes/projects/`). What the site offers today is what a deck may
  present as sold today; anything the round would fund — the quantum hosted
  planning API, for one — is labelled "built with the round".
- Source comments (`<!-- -->`) cite where a figure comes from and are stripped
  from the published build.
