// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Every route is prerendered to plain HTML. Lovable's build keeps the SSR server
// next to it; the GitHub Pages workflow (`npm run build:static`) sets
// STATIC_BUILD=1 to skip the server bundle and serve dist/client as-is.
//
// SITE_BASE is the URL prefix the static site is served under: "/" for a custom
// domain, "/<repo>/" for a project page at <user>.github.io/<repo>/. TanStack
// Start derives the router basepath from Vite's `base`, so this one setting
// covers both asset URLs and in-app links.
//
// SITE_URL is the public origin (e.g. https://hietanen.example). Pages read it as
// VITE_SITE_URL to build absolute canonical/og:url/og:image values and the
// sitemap; without it they fall back to the dev server.
const staticBuild = process.env["STATIC_BUILD"] === "1";
const siteBase = process.env["SITE_BASE"] ?? "/";
const siteUrl = process.env["SITE_URL"];
if (siteUrl) process.env["VITE_SITE_URL"] = siteUrl;

export default defineConfig({
  ...(staticBuild ? { nitro: false } : {}),
  vite: {
    base: siteBase,
    build: {
      // Vite inlines small SVGs as `data:image/svg+xml,` URLs with a minimal
      // encoding that leaves `{`, `[` and friends raw; the HTML validator
      // rejects those as illegal URL characters. Serve SVGs as files instead
      // (they are lazy-loaded logos). Fonts stay files too: the small subsets
      // are only fetched when the CDN copy fails, so inlining them into the
      // stylesheet would cost every visitor bytes for nothing. Other small
      // assets keep the default.
      assetsInlineLimit: (file) => (/\.(svg|woff2)$/.test(file) ? false : undefined),
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Every route is static and discovered from the route tree, so no link
    // crawling: under a sub-path the crawler re-prefixes already-prefixed links
    // and duplicates every page in the sitemap.
    prerender: { enabled: true, crawlLinks: false, failOnError: true },
    // sitemap.xml lists the prerendered routes under the public URL.
    ...(siteUrl
      ? {
          sitemap: {
            enabled: true,
            host: siteUrl.replace(/\/+$/, "") + siteBase.replace(/\/$/, ""),
          },
        }
      : {}),
  },
});
