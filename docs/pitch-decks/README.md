# Investor decks

Two seed-round decks, one per product. The sources here are the decks: edit
them, build, publish.

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
