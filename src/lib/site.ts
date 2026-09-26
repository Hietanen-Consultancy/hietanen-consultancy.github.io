/**
 * Site-wide SEO data. The public origin comes from VITE_SITE_URL at build time
 * (CI derives it from public/CNAME or the GitHub Pages URL); locally it falls
 * back to the dev server so links still resolve. Everything social platforms
 * need — canonical, og:url, og:image — must be absolute, so build it here.
 */
import { company, engagements, productList, services } from "@/content/company";
import { repositories, type Repository, type RepositoryRole } from "@/content/repositories";

const base = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const origin = (import.meta.env["VITE_SITE_URL"] ?? "http://localhost:8080").replace(/\/+$/, "");

export const site = {
  name: company.name,
  legalName: company.legalName,
  origin,
  /** Absolute URL of the site root, including any sub-path base. */
  url: `${origin}${base}`,
  locale: "en_GB",
  twitterCard: "summary_large_image",
  founder: company.founder.name,
  sameAs: [company.github, company.bitbucket, company.founder.linkedIn],
} as const;

/** Absolute URL for a route path ("/", "/projects/fuuga") or a Vite asset URL. */
export const absoluteUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) return path;
  // Vite asset URLs already carry the base; route paths do not.
  const withBase = path.startsWith(base) ? path : `${base}${path.replace(/^\//, "")}`;
  return `${origin}${withBase}`;
};

/**
 * Absolute URL of a page route. Pages are served as <path>/index.html and the
 * router is set to `trailingSlash: "always"`, so the public URL ends with a
 * slash; GitHub Pages 301-redirects the slash-less form, which would make the
 * canonical and og:url point at a redirect.
 */
export const pageUrl = (path: string): string => absoluteUrl(path).replace(/\/*$/, "/");

type PageSeo = {
  title: string;
  description: string;
  /** Route path, e.g. "/projects/fuuga". */
  path: string;
  /** Social-card image: a Vite asset import (root-relative URL) or absolute URL. */
  image: string;
  imageAlt: string;
  type?: "website" | "article";
};

/** Head entries every page needs, for TanStack Start's `head()`. */
export const seoHead = ({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
}: PageSeo) => {
  const url = pageUrl(path);
  const imageUrl = absoluteUrl(image);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: site.locale },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: imageUrl },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:card", content: site.twitterCard },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
};

/**
 * Serialises structured data for an inline `<script type="application/ld+json">`.
 * A literal `<` in the JSON could open `</script>` and end the element early,
 * so it is written as an escape, which JSON parsers read back as `<`.
 */
const jsonLd = (data: object): string => JSON.stringify(data).replace(/</g, "\\u003c");

/** schema.org Organization, for the front page. */
export const organizationJsonLd = (logo: string) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: absoluteUrl(logo),
    description: company.summary,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Companies House",
      value: company.companyNumber,
    },
    foundingDate: String(company.founded),
    founder: {
      "@type": "Person",
      name: company.founder.name,
      jobTitle: company.founder.title,
      sameAs: [company.founder.linkedIn, company.github],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: company.city,
      addressCountry: company.country,
    },
    areaServed: "Worldwide",
    knowsAbout: company.expertise,
    email: company.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: company.email,
      url: company.founder.linkedIn,
      availableLanguage: ["English", "Finnish"],
    },
    sameAs: site.sameAs,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: [
        ...services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.copy,
            keywords: service.tags.join(", "),
          },
        })),
        ...productList.map((product) => ({
          "@type": "Offer",
          name: product.name,
          description: product.sold,
          category: "Product",
          itemOffered: {
            "@type": "Service",
            name: product.name,
            description: product.sold,
            url: absoluteUrl(product.path),
          },
        })),
        ...engagements.map((engagement) => ({
          "@type": "Offer",
          name: engagement.title,
          description: engagement.copy,
          priceSpecification: { "@type": "PriceSpecification", name: engagement.model },
          itemOffered: {
            "@type": "Service",
            name: engagement.title,
            serviceType: engagement.model,
          },
        })),
      ],
    },
  });

const organizationRef = () => ({ "@type": "Organization", "@id": `${site.url}#organization` });

const roleProperty: Record<RepositoryRole, "author" | "maintainer" | "contributor"> = {
  author: "author",
  maintainer: "maintainer",
  contributor: "contributor",
};

/** schema.org ItemList of every repository the site shows, for the front page. */
export const repositoriesJsonLd = () =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Open source by Hietanen Consultancy",
    itemListElement: (Object.values(repositories) as Repository[]).map((repository, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: repository.name,
        description: repository.detail,
        codeRepository: repository.href,
        url: repository.deepDive ? pageUrl(repository.deepDive.to) : repository.href,
        [roleProperty[repository.role ?? "author"]]: organizationRef(),
      },
    })),
  });

type SoftwareSeo = {
  name: string;
  description: string;
  /** Route path of the product page. */
  path: string;
  repository: string;
  nuget: string;
  keywords: readonly string[];
  /** Commercial terms, from src/content/company.ts. */
  offers?: readonly { kind: string; name: string; copy: string }[];
};

/** schema.org SoftwareSourceCode for a product page (both products are Unlicense). */
export const softwareJsonLd = ({
  name,
  description,
  path,
  repository,
  nuget,
  keywords,
  offers,
}: SoftwareSeo) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name,
    description,
    url: pageUrl(path),
    codeRepository: repository,
    installUrl: nuget,
    programmingLanguage: "F#",
    runtimePlatform: ".NET",
    license: "https://unlicense.org/",
    isAccessibleForFree: true,
    keywords: keywords.join(", "),
    author: organizationRef(),
    maintainer: organizationRef(),
    ...(offers?.length
      ? {
          offers: offers.map((offer) => ({
            "@type": "Offer",
            name: offer.name,
            description: offer.copy,
            category: offer.kind,
            seller: organizationRef(),
          })),
        }
      : {}),
  });
