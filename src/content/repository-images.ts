import efBulkInsertCard from "@/assets/ef-bulkinsert-card.png";
import fuugaLogo from "@/assets/fuuga-logo.png";
import linqkitCard from "@/assets/linqkit-card.png";
import prismaticLogo from "@/assets/prismatic-logo.png";

import type { RepositoryId } from "./repositories";
import { repositories } from "./repositories";
import socialImages from "./social-images.json" with { type: "json" };

/**
 * Hand-picked preview images for repositories whose host has no usable social
 * preview (NuGet, Bitbucket), or whose only preview is GitHub's generated card. That
 * card is rendered on demand and rate-limited: an uncached one answers HTTP 429
 * and shows as a broken image, so it is pinned here as a local copy instead.
 * Drop the file in `src/assets/` and import it here.
 */
const imageOverrides: Partial<Record<RepositoryId, string>> = {
  efBulkInsert: efBulkInsertCard,
  linqkit: linqkitCard,
  fuuga: fuugaLogo,
  prismatic: prismaticLogo,
};

/**
 * Background behind each preview image, matched by hand to the image's own
 * edge colour so the letterboxing in the 2:1 card box is invisible. Repositories
 * left out get the neutral card surface (fine for photographic previews).
 */
const imageBackgrounds: Partial<Record<RepositoryId, string>> = {
  linqkit: "#ffffff",
  sqlprovider: "#ffffff",
  linqExpressionOptimizer: "#ffffff",
  fuuga: "#ffffff",
  fsharpAzureQuantum: "#000e27",
  clearBankNet: "#ffffff",
  carmelNet: "#ffffff",
  csharpRefactor: "#1c2125",
  prismatic: "#060606",
  simpleCqrs: "#ffffff",
  proveSdk: "#ebf3f6",
  fsharpRefactor: "#ffffff",
  owinCompression: "#ffffff",
  nppTreeSitter: "#041632",
  jsonProviderSerializer: "#ffffff",
  efBulkInsert: "#ffffff",
  sqlproviderFable: "#ffffff",
  kasino: "#063e1b",
};

export const repositoryImageBackground = (id: RepositoryId): string | undefined =>
  imageBackgrounds[id];

const resolvedSocialImages: Record<string, string> = socialImages;
const githubRepoPath = /^https:\/\/github\.com\/([^/]+\/[^/#?]+)/;

/**
 * Local copies of the GitHub social previews, saved by
 * `scripts/fetch-social-images.ts` as `src/assets/social/<repository id>.<ext>`.
 */
const socialCopies: Partial<Record<string, string>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../assets/social/*.{png,jpg,webp,gif}", {
      eager: true,
      import: "default",
    }),
  ).map(([path, url]) => [path.replace(/^.*\/|\.[^.]+$/g, ""), url]),
);

/**
 * Override above, else the local copy of the repository's social preview, else
 * the preview's URL on GitHub (only until the script has copied it), else
 * GitHub's auto-generated card, else nothing.
 */
export const repositoryImage = (id: RepositoryId): string | undefined => {
  const override = imageOverrides[id];
  if (override) return override;
  const copy = socialCopies[id];
  if (copy) return copy;
  const { href } = repositories[id];
  const resolved = resolvedSocialImages[href];
  if (resolved) return resolved;
  const match = githubRepoPath.exec(href);
  return match ? `https://opengraph.githubassets.com/1/${match[1]}` : undefined;
};
