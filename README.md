# Hietanen Consultancy — company site

The company website: who we are, how we work, the open source we maintain,
reference projects, customers, and detail pages for our two products, [Fuuga](https://www.nuget.org/packages/Fuuga) and
[FSharp.Azure.Quantum](https://github.com/Thorium/FSharp.Azure.Quantum).

The whole site is static HTML prerendered at build time and published to
GitHub Pages by the CI workflow in this repository. The source is public for
transparency; see [Licence](#licence).

## Stack

- [TanStack Start](https://tanstack.com/start) (React, file-based routes) on Vite,
  Tailwind CSS, shadcn/ui components, TypeScript.
- Every route is prerendered (`tanstackStart.prerender`), so the deployed site is
  plain files in `dist/client`; no server runs in production.
- [Bun](https://bun.sh) is the package manager (`bun.lock`); npm works for the
  scripts as well.
- The project was scaffolded with [Lovable](https://lovable.dev) and stays
  connected to it as an editor: the `@lovable.dev/vite-tanstack-config` preset
  and `.lovable/` are part of that connection. Deployment does **not** go through
  Lovable. See [Working with the repository](#working-with-the-repository).

## Development

```sh
bun install
bun run dev          # http://localhost:8080
```

Quality gates, all run by CI and combined in one command:

```sh
bun run check        # lint + typecheck + static build + HTML validation + SEO checks
```

| Script          | What it does                                                                                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lint`          | ESLint over the repository                                                                                                                                                                            |
| `typecheck`     | `tsc --noEmit`                                                                                                                                                                                        |
| `build:static`  | Prerendered static build into `dist/client` (`STATIC_BUILD=1`, no server), then `scripts/postprocess-html.ts` (validator-clean HTML, `Sitemap:` in robots.txt) and `scripts/llms-txt.ts` (`llms.txt`) |
| `validate:html` | [html-validate](https://html-validate.org) over the built pages                                                                                                                                       |
| `check:seo`     | `scripts/check-seo.ts`: titles, descriptions, Open Graph, canonical, JSON-LD, llms.txt, sitemap                                                                                                       |
| `social-images` | Refreshes `src/content/social-images.json` from the repositories' GitHub social previews                                                                                                              |
| `fonts`         | Refreshes `src/fonts.css` and `src/assets/fonts/` from Google Fonts (see [Fonts](#fonts))                                                                                                             |
| `format`        | Prettier                                                                                                                                                                                              |

Build-time environment:

| Variable       | Purpose                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------- |
| `STATIC_BUILD` | `1` skips the SSR server bundle; the static build the site is deployed from                 |
| `SITE_BASE`    | URL prefix the site is served under: `/` for a custom domain, `/<repo>/` for a project page |
| `SITE_URL`     | Public origin, used for canonical URLs, Open Graph URLs and `sitemap.xml`                   |

## Where the content lives

The pages are data-driven; most edits are to these files, not to the routes.

| File                               | Content                                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/content/company.ts`           | Company facts (legal name, company number, founder), services, engagement models, career |
| `src/content/repositories.ts`      | Every repository we show: name, one-line detail, link, our role, optional detail page    |
| `src/content/showcase.ts`          | Which repositories appear as deep dives, in the public-work carousel, and as blueprints  |
| `src/content/repository-images.ts` | Preview image overrides and card backgrounds per repository                              |
| `src/content/references.ts`        | Reference projects (paged on screen; all of them are in the HTML)                        |
| `src/content/customers.ts`         | Customer logo cloud, grouped by sector; logos in `src/assets/customers/`                 |
| `src/routes/index.tsx`             | Front page sections, including engagement models, career and contact                     |
| `src/routes/projects/fuuga.tsx`    | Fuuga product page                                                                       |
| `src/routes/projects/quantum.tsx`  | FSharp.Azure.Quantum product page                                                        |
| `src/lib/site.ts`                  | Site origin, `seoHead()` and the JSON-LD builders (Organization, repositories, products) |
| `public/brand/`                    | Logo files; `scripts/generate-logo.ts` regenerates them                                  |

Repository preview cards use each repository's GitHub social-preview image,
resolved at build time by `scripts/fetch-social-images.ts` (the weekly CI run
keeps them current). Fuuga and Prismatic live on Bitbucket, whose pages show a
file listing before the README, so their cards link to the NuGet package pages
instead and use the logos from the repositories.

## Machine readability

The site is meant to be read by search engines and language models as much as
by people, and the build guards that:

- Every page is prerendered HTML with schema.org JSON-LD: `Organization` (with
  the company number, services and engagement models as an offer catalogue)
  and a `SoftwareSourceCode` list of every repository on the front page, one
  `SoftwareSourceCode` per product page.
- `llms.txt` is generated from the content modules after every build, so it
  always matches the pages. `robots.txt` lists the common AI crawlers explicitly
  and gets a `Sitemap:` line at build time.
- `check:seo` fails the build when JSON-LD is missing or does not parse, when
  `llms.txt` is missing a page, or when the HTML carries something
  validator.w3.org rejects (`postprocess-html.ts` removes the two things React
  and TanStack Router emit that it does).

## Fonts

Manrope and JetBrains Mono are loaded from fonts.gstatic.com, the fastest CDN
for them, with a self-hosted copy of every subset as the fallback: each
`@font-face` in `src/fonts.css` lists the gstatic file first and
`src/assets/fonts/` second, so when the CDN is unreachable the typography
does not change. Google's stylesheet is not used. `bun run fonts` regenerates
both from Google Fonts; commit the result.

## Investor decks

`docs/pitch-decks/` holds the seed-round decks for Fuuga and FSharp.Azure.Quantum
as their sources (one HTML section per slide) and the script that builds them
for publishing. See [docs/pitch-decks/README.md](docs/pitch-decks/README.md).

## Deployment

`.github/workflows/ci.yml` runs the quality gates on every push and pull request
and, on `main`, publishes `dist/client` to GitHub Pages. The site base and URL
are resolved automatically:

- `public/CNAME` present → custom domain, served at `/`.
- Repository named `<owner>.github.io` → user/organisation site at
  `https://<owner>.github.io/`.
- Any other repository → project page at `https://<owner>.github.io/<repo>/`.

One-time repository setting: **Settings → Pages → Source: GitHub Actions**. A
weekly scheduled run rebuilds the site so the repository preview images stay
fresh.

## Working with the repository

- Development happens here, on `main`, with the checks above. The repository is
  also connected to Lovable as an editing surface: commits pushed to `main` sync
  into Lovable and Lovable's edits land as commits. Because of that sync, never
  rewrite published history on `main` — no force pushes, rebases or squashes of
  pushed commits.
- The public mirror at
  [Hietanen-Consultancy/hietanen-consultancy.github.io](https://github.com/Hietanen-Consultancy/hietanen-consultancy.github.io)
  receives snapshots of this repository as single commits; it is the source
  GitHub Pages publishes from, at https://hietanen-consultancy.github.io/.

## Licence

© Hietanen Consultancy Ltd. The source is published so that anyone can see how
the site is built; it is not licensed for reuse unless a licence file says
otherwise. Customer logos belong to their owners and appear with a link to each
company's site. Brand marks in `src/components/brand-icons.tsx` are from
[Simple Icons](https://simpleicons.org) (CC0).
