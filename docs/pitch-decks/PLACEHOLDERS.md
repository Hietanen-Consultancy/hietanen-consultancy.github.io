# Deck placeholders

Everything in either deck that is still a placeholder — figures, names,
statuses and contact details — in one place. Fill the **Value** column from the
spreadsheet, apply the edits to the files listed, then rebuild:

```bash
node scripts/pitch-decks.ts fuuga && node scripts/pitch-decks.ts quantum
```

Nothing is substituted automatically: the placeholders live in the slide HTML
and this file is the index of what they mean. For where they are _right now_ —
line numbers drift every time a slide is edited — ask the script:

```bash
npm run check:placeholders
```

It reports every deck, or one of them (`dotnet fsi scripts/check-placeholders.fsx fuuga`),
and marks anything that sits in the speaker notes rather than on the slide.
Add `--strict` and it exits non-zero while any placeholder remains — that is
the last gate before a deck goes to a reader, not something to run while the
numbers are still open.

## What can be sourced, and what cannot

A desk check of the 53 placeholders, September 2026. They fall into three
groups, and it matters which is which: a number you can defend has a source, a
number you invented has a bracket, and pretending otherwise is the thing that
loses a room.

**Grounded — use these as working values.**

| Placeholder                                             | Proposed                         | Basis                                                                                                                                                                                       |
| ------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fully loaded engineer cost                              | `£110k` — keep                   | Median London software engineer base is ~£85k and UK fully loaded cost runs 1.25–1.4× base, so £106k–£119k. The figure in the deck is already right.                                        |
| Closes per seller per year                              | `5`                              | Median enterprise AE new-business quota is ~$800k ACV; at a £60–80k ACV that is 7–8 closes at full attainment, and median mid-market quota attainment is 40–55%. Five is the honest middle. |
| Month the first seller starts                           | `7` — keep                       | Matches the roadmap, which hires the head of sales in months 7–12.                                                                                                                          |
| Sellers by year three                                   | `3`                              | Arithmetic, not research — see the note below.                                                                                                                                              |
| European fleet-software and GCS vendors (quantum `[N]`) | `20–30`, to confirm by screening | The commercial ground-control software market is reported as fragmented with 50+ active vendors worldwide; Europe is a large minority of that. Candidates to screen are listed below.       |

**Not publicly benchmarkable — the first conversation sets them.** Every ACV
and unit price: the embedded vendor licence, the enterprise subscription, the
evidence pack, the planning API monthly, the fixed-scope pilot. OEM and ISV
redistribution licences are negotiated privately and there are no published
comparables, so any figure quoted here would be invention with a citation
stapled to it. The decks already say these close on the first vendor
conversation, which is the correct answer.

**Only you can supply.** Consultancy revenue and gross margin, customer and
vendor names, pipeline status, advisor names, the contact address, and the
typed-decision accuracy — which has to come from a real run on a customer's own
recorded outcomes, not from anywhere else. The year-two ARR milestone is an
output of the rest.

### Raise size, in context

A London seed in 2026 typically lands between £500k and £2.5m with a cluster
around £1m–£1.5m; the UK median seed investment was about £560k in 2024. AI
companies carry a premium, with a median deal size near $4.6m. So the Fuuga
`[£2.5m]` sits at the top of the normal range and is defensible on the AI
premium; the quantum `[£3.0m]` is above it, from a company with no signed
customer. Worth deciding deliberately rather than by symmetry.

### The arithmetic that does not close

One quota-carrying seller at five closes a year cannot deliver the customer
counts in the projections: Fuuga goes 4 → 12 → 30, so year three alone needs
eighteen new customers, and the quantum deck needs fifteen. That is three to
four quota carriers by year three, not one. Either the seller line grows — the
assumptions slides now say three by year three — or the customer counts come
down. An investor will do this division in the meeting, so it is better done
here.

### Candidates for the quantum vendor screen

Starting points only, to be checked against the actual criterion (do they ship
fleet software that needs multi-aircraft planning?), not evidence of interest:
Auterion, SPH Engineering (UgCS), Delair, Quantum-Systems, Wingtra, Parrot,
AgEagle/senseFly, Flyability, Percepto. The screened count is what closes `[N]`
on the market slide.

Sources: [Glassdoor](https://www.glassdoor.co.uk/Salaries/london-software-engineer-salary-SRCH_IL.0,6_IM1035_KO7,24.htm),
[OSCABE](https://oscabe.com/blog/cost-to-hire-software-engineer-uk-2026),
[Boomerang quota benchmarks](https://www.getboomerang.ai/glossaries/quota-attainment-benchmarks-2026),
[Bridge Group AE metrics](https://blog.bridgegroupinc.com/2024-ae-metrics-compensation-benchmark),
[Idea London seed guide](https://idea-london.co.uk/how-to-raise-seed-round-london/),
[Pitchwise median seed by industry](https://www.pitchwise.se/blog/median-seed-round-size-by-industry-in-2026-data),
[Drone Intelligence GCS market](https://droneintelligence.ai/intelligence/ground-control-station-market).

## Both decks

| What                                        | Where                                                              | Current                   | Value |
| ------------------------------------------- | ------------------------------------------------------------------ | ------------------------- | ----- |
| Advisors                                    | `fuuga/slides/team.html`, `quantum/slides/team.html`               | `[names to confirm]`      |       |
| Consultancy revenue, trailing twelve months | `fuuga/slides/traction.html`, `quantum/slides/traction.html`       | `[£__k]`                  |       |
| Pipeline status wording                     | `fuuga/slides/traction.html`, `quantum/slides/traction.html`       | `[verbal / LOI / signed]` |       |
| Month the first seller starts               | `fuuga/slides/assumptions.html`, `quantum/slides/assumptions.html` | `[7]`                     |       |
| Closes per seller per year                  | `fuuga/slides/assumptions.html`, `quantum/slides/assumptions.html` | `[__]`                    |       |
| Fully loaded engineer cost                  | `fuuga/slides/assumptions.html`, `quantum/slides/assumptions.html` | `[£110k]`                 |       |

## Fuuga

| What                                               | Where                            | Current                        | Value |
| -------------------------------------------------- | -------------------------------- | ------------------------------ | ----- |
| Raise size                                         | `ask.html`, `funds.html`         | `[£2.5m]`                      |       |
| Use of funds — engineering (55%)                   | `funds.html`                     | `[£1.375m]`                    |       |
| Use of funds — sales and marketing (18%)           | `funds.html`                     | `[£450k]`                      |       |
| Use of funds — GPU compute (12%)                   | `funds.html`                     | `[£300k]`                      |       |
| Use of funds — operations, legal, compliance (10%) | `funds.html`                     | `[£250k]`                      |       |
| Use of funds — reserve (5%)                        | `funds.html`                     | `[£125k]`                      |       |
| Embedded OEM licence ACV                           | `assumptions.html`               | `[£80k]`                       |       |
| Partner enablement — count and fee                 | `assumptions.html`               | `[N]`, `[£__k]`                |       |
| Fuuga Enterprise subscription ACV                  | `assumptions.html`, `model.html` | `[£60k]` / `[£__k]`            |       |
| Evidence pack, per production model per month      | `assumptions.html`               | `[£2k]`                        |       |
| Addressable regulated organisations (Europe)       | `market.html`                    | `[N]`                          |       |
| Serviceable market                                 | `market.html`                    | `[£__m]`                       |       |
| Gross margin on consultancy today                  | `traction.html`                  | `[__]%`                        |       |
| Named customer conversations                       | `traction.html`                  | `[Customer A]`, `[Customer B]` |       |
| Year-2 ARR milestone                               | `roadmap.html`                   | `[£__m]`                       |       |
| Typed-decision accuracy from the first engagement  | `decisions.html`                 | `[94]`                         |       |

## FSharp.Azure.Quantum

| What                                               | Where                                           | Current                      | Value |
| -------------------------------------------------- | ----------------------------------------------- | ---------------------------- | ----- |
| Raise size                                         | `ask.html`, `funds.html`                        | `[£3.0m]`                    |       |
| Use of funds — engineering (50%)                   | `funds.html`                                    | `[£1.5m]`                    |       |
| Use of funds — QPU and cloud compute (15%)         | `funds.html`                                    | `[£450k]`                    |       |
| Use of funds — sales and marketing (15%)           | `funds.html`                                    | `[£450k]`                    |       |
| Use of funds — operations, legal, regulatory (10%) | `funds.html`                                    | `[£300k]`                    |       |
| Use of funds — drone flight lab (5%)               | `funds.html`                                    | `[£150k]`                    |       |
| Use of funds — reserve (5%)                        | `funds.html`                                    | `[£150k]`                    |       |
| Embedded SDK licence ACV per vendor                | `assumptions.html`, `model.html`, `market.html` | `[£40k]` / `[£__k]`          |       |
| Planning API, per active operator per month        | `assumptions.html`                              | `[£6k]`                      |       |
| Integration or pilot, fixed scope                  | `assumptions.html`                              | `[£150k]`                    |       |
| Addressable vendor and integrator count (Europe)   | `market.html`                                   | `[N]`                        |       |
| Serviceable market                                 | `market.html`                                   | `[£__m]`                     |       |
| Named vendor and operator conversations            | `traction.html`                                 | `[Vendor A]`, `[Operator B]` |       |
| Year-2 ARR milestone                               | `roadmap.html`                                  | `[£__m]`                     |       |

## Not bracketed, but derived from the above

These read as settled and are not. They move whenever a driver above moves, or
the deck contradicts itself.

- **Projections tables** — `fuuga/slides/projections.html`, `quantum/slides/projections.html`.
  Every revenue line, the totals, the customer counts and the headcount rows
  are outputs of the bracketed ACVs and sales cycles. The "judge the software
  line" figures under each table (£0.25m / £1.2m / £3.7m for Fuuga, £0.25m /
  £1.1m / £3.3m for the quantum deck) are sums of the table's own software rows
  — recompute them whenever a row changes.
- **Headcount by year end** — the same two slides and the hiring line on each
  team slide. Must agree with the engineering share of the use of funds divided
  by the engineer cost.
- **Contact route** — the decks and both pages point at the LinkedIn profile. The
  company domain has no mailbox yet, so that is the live contact medium; if a
  mail alias is set up later it belongs in `src/content/company.ts` (the
  `contact` field) and flows to every page and both decks from there.
- **Counts that age** — "thirty-two shipped reference projects", "over one
  hundred runnable examples", "nine donor families", "twelve open-source
  libraries", "roughly a dozen UK BVLOS operators", "a test suite in the
  thousands". All verifiable, all drift.

A pinned package version used to sit in this list, restated in three places and
stale in all of them — the deck said 1.4.2 while the repository was on 1.4.10.
It is gone rather than corrected: no reader of a deck needs a patch number, and
"on NuGet, public source" carries the whole signal. The same test applies to
anything else here — if restating a fact means maintaining it in two places,
either say the durable version or drop it.

## Commitments the decks now make

Not placeholders, but promises a reader can hold you to. Each has a home on a
slide and needs to be true before that slide is shown.

- The ninety-day list on both traction slides: the screened vendor list, two
  signed pilots, the published hybrid-versus-classical benchmark, IP and
  trademark paperwork.
- "We will not claim quantum advantage before the benchmark table exists"
  (`quantum/slides/whynow.html`).
- "A first reply usually comes the same day" on the Fuuga page CTA.
