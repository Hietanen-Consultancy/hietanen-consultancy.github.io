import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronDown, ExternalLink, Mail, Menu } from "lucide-react";
import { Fragment, useRef, useState } from "react";

import collaborationImage from "@/assets/hietanen-client-collaboration-tuomas.jpg";
import bookCover from "@/assets/book-guidance-dotnet.jpg";
import founderPortrait from "@/assets/tuomas-hietanen.png";
import customersImage from "@/assets/customers-team.jpg";
import { BitbucketIcon, GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import { useScrollEdges } from "@/hooks/use-scroll-edges";
import { organizationJsonLd, repositoriesJsonLd, seoHead } from "@/lib/site";
import { career, company, engagements, services } from "@/content/company";
import { customerGroups } from "@/content/customers";
import { integrationGroups } from "@/content/integrations";
import { referenceProjects } from "@/content/references";
import { repositories, repositoryRole } from "@/content/repositories";
import { repositoryImage, repositoryImageBackground } from "@/content/repository-images";
import { deepDives, publicWork, solutionTemplates } from "@/content/showcase";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    ...seoHead({
      title: "Hietanen Consultancy — Technology Leadership & Engineering",
      description:
        "CTO advisory and hands-on engineering for regulated fintech, AI agents, cloud and functional .NET, delivered in the UK, US and EU. London-based, working internationally.",
      path: "/",
      image: "/og/home.png",
      imageAlt:
        "Hietanen Consultancy — senior engineering for systems that cannot afford ambiguity",
    }),
    scripts: [
      { type: "application/ld+json", children: organizationJsonLd("/brand/apple-touch-icon.png") },
      { type: "application/ld+json", children: repositoriesJsonLd() },
    ],
  }),
});

// Reference projects are paged on screen, but every project is in the HTML
// (the other pages are hidden, not skipped) so crawlers and language models
// read the whole list from the prerendered page.
const REFERENCES_PER_PAGE = 8;

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const projectsEdges = useScrollEdges(projectsRef);
  const templatesEdges = useScrollEdges(templatesRef);
  const [referencePage, setReferencePage] = useState(0);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const referencePages = Math.ceil(referenceProjects.length / REFERENCES_PER_PAGE);

  const moveProjects = (direction: number) => {
    projectsRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  const moveTemplates = (direction: number) => {
    templatesRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8">
          <a
            href="#top"
            className="flex min-w-0 items-center gap-3"
            aria-label="Hietanen Consultancy home"
          >
            <img
              src={`${import.meta.env.BASE_URL}brand/seal.svg`}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0"
            />
            <span className="truncate text-sm font-bold">
              Hietanen <span className="font-normal text-muted-foreground">Consultancy</span>
            </span>
          </a>
          <nav
            className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"
            aria-label="Main navigation"
          >
            <a href="#expertise" className="transition-colors hover:text-foreground">
              Expertise
            </a>
            <a href="#engagement" className="transition-colors hover:text-foreground">
              How we work
            </a>
            <a href="#work" className="transition-colors hover:text-foreground">
              Public work
            </a>
            <a href="#templates" className="transition-colors hover:text-foreground">
              Blueprints
            </a>
            <a href="#references" className="transition-colors hover:text-foreground">
              References
            </a>
            <a href="#experience" className="transition-colors hover:text-foreground">
              Founder
            </a>
            <Button asChild variant="dark">
              <a href="#contact">Start a conversation</a>
            </Button>
          </nav>
          <button
            type="button"
            className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-surface md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
        {menuOpen && (
          <nav
            className="grid border-t border-border bg-background px-5 py-4 text-sm font-medium md:hidden"
            aria-label="Mobile navigation"
          >
            {[
              ["Expertise", "#expertise"],
              ["How we work", "#engagement"],
              ["Public work", "#work"],
              ["Blueprints", "#templates"],
              ["References", "#references"],
              ["Customers", "#customers"],
              ["Founder", "#experience"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border/60 py-3 last:border-0"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section
        id="top"
        className="relative mx-auto max-w-7xl px-5 pb-14 pt-14 sm:px-8 sm:pt-20 lg:pb-20 lg:pt-24"
      >
        <div className="absolute -left-32 top-0 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <p className="animate-rise font-mono text-xs font-medium uppercase text-primary">
              Fintech · AI · Cloud · Functional .NET
            </p>
            <h1 className="mt-6 max-w-4xl animate-rise text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-7xl [animation-delay:80ms]">
              Senior engineering for systems that cannot afford ambiguity.
            </h1>
            <p className="mt-6 max-w-2xl animate-rise text-base leading-7 text-muted-foreground sm:text-lg [animation-delay:160ms]">
              Hietanen Consultancy brings CTO-level judgment and hands-on delivery to regulated
              fintech, AI and complex cloud platforms across the UK, the US and the EU.
            </p>
            <div className="mt-8 flex animate-rise flex-col gap-3 sm:flex-row [animation-delay:240ms]">
              <Button asChild>
                <a href="#expertise">
                  Explore expertise <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="#work">View public work</a>
              </Button>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="rotate-[-2deg] overflow-hidden rounded-lg border border-border bg-surface p-2 shadow-2xl shadow-foreground/10">
              <img
                src={collaborationImage}
                alt="Experienced Finnish technology consultants collaborating at an ultrawide professional workstation"
                width={1024}
                height={1280}
                className="aspect-[4/5] w-full rounded object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-3 rounded-md border border-border bg-surface px-4 py-3 backdrop-blur-xl sm:-left-5">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Current focus</p>
              <p className="mt-1 text-sm font-bold">FinTech · AI agents</p>
            </div>
          </div>
        </div>
        <p className="mt-16 font-mono text-[10px] uppercase text-muted-foreground">
          Selected career and client-platform outcomes
        </p>
        <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
          {[
            ["25+", "Years in software"],
            ["9", "Years as Finular CTO"],
            ["800K+", "Finular registered users"],
            ["99.99%", "Finular platform uptime"],
          ].map(([value, label]) => (
            <div key={label} className="bg-surface p-5 sm:p-6">
              <p className="text-2xl font-extrabold sm:text-3xl">{value}</p>
              <p className="mt-2 font-mono text-[10px] uppercase text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="expertise"
        className="border-y border-border bg-foreground py-20 text-background"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase text-signal">01 / Expertise</p>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Strategy that reaches production.
            </h2>
            <p className="mt-4 leading-7 text-background/65">
              Technical advice and implementation stay together. The same senior perspective shapes
              the decision, architecture and delivery.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-background/15 bg-background/15 sm:grid-cols-2">
            {services.map((service) => (
              <article key={service.number} className="bg-foreground p-6 sm:p-8">
                <span className="font-mono text-xs text-signal">{service.number}</span>
                <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-background/65">{service.copy}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-background/15 px-2 py-1 font-mono text-[10px] text-background/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="engagement" className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase text-primary">02 / How we work</p>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Senior engineer(s), embedded where the work is.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Most of our work is straightforward: an experienced engineer, or several, joins your
              team and is billed for the time spent, on site or remote. Everything else on this page
              is what that engineer brings along.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {engagements.map((item) => (
              <article key={item.title} className="flex flex-col bg-surface p-6 sm:p-7">
                <p className="font-mono text-[10px] uppercase text-primary">{item.model}</p>
                <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{item.copy}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl leading-7 text-muted-foreground">
            UK limited company (no. {company.companyNumber}), London based, working with clients
            internationally, with a delivery track record in the UK, the US and the EU.{" "}
            {company.terms}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href="#contact">
                Ask for availability <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#references">See where we have done this</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="lg:col-span-4">
          <p className="font-mono text-xs uppercase text-primary">03 / Public work</p>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Open source we maintain, running in production.
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
            Not experiments: libraries and tools that other teams ship with every day, from typed
            data access and expression-tree optimisation to banking integrations and developer
            tooling, with well over 130 million downloads between them.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {deepDives.map((id) => {
            const repository = repositories[id];
            const image = repositoryImage(id);
            return (
              <Link
                key={id}
                to={repository.deepDive.to}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-primary/50"
              >
                {image ? (
                  <img
                    src={image}
                    alt={`${repository.name} social preview`}
                    loading="lazy"
                    className="aspect-[2/1] w-full border-b border-border bg-surface-strong/40 object-contain"
                    style={{ backgroundColor: repositoryImageBackground(id) }}
                  />
                ) : null}
                <span className="flex items-start justify-between gap-4 p-5">
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase text-primary">
                      Deep dive
                    </span>
                    <span className="mt-2 block font-bold">{repository.name}</span>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                      {repository.deepDive.detail}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase text-muted-foreground">
              Swipe or browse libraries and tools
            </p>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveProjects(-1)}
                disabled={projectsEdges.atStart}
                aria-label="Previous projects"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveProjects(1)}
                disabled={projectsEdges.atEnd}
                aria-label="More projects"
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
          <div
            ref={projectsRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {publicWork.map((id) => {
              const { name, detail, href } = repositories[id];
              const image = repositoryImage(id);
              return (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-primary/50 sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`${name} social preview`}
                      loading="lazy"
                      className="aspect-[2/1] w-full border-b border-border bg-surface-strong/40 object-contain"
                      style={{ backgroundColor: repositoryImageBackground(id) }}
                    />
                  ) : null}
                  <span className="flex flex-1 items-start justify-between gap-4 p-5">
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase text-primary">
                        {repositoryRole(id)}
                      </span>
                      <span className="mt-2 block font-bold">{name}</span>
                      <span className="mt-3 block text-sm leading-6 text-muted-foreground">
                        {detail}
                      </span>
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="templates" className="border-y border-border bg-surface-strong/60 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase text-primary">04 / Blueprints</p>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Start from a working template.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Every engagement can begin from a proven public repository: a running first
                implementation to build on, not a slide deck or a black box.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase text-muted-foreground">
                  Swipe or browse blueprints
                </p>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveTemplates(-1)}
                    disabled={templatesEdges.atStart}
                    aria-label="Previous blueprints"
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveTemplates(1)}
                    disabled={templatesEdges.atEnd}
                    aria-label="More blueprints"
                  >
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
              <div
                ref={templatesRef}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {solutionTemplates.map((item, index) => {
                  const repository = repositories[item.repository];
                  const image = item.image ?? repositoryImage(item.repository);
                  return (
                    <article
                      key={item.outcome}
                      className="group flex min-h-72 w-[86%] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-primary/50 sm:w-[calc(50%-0.375rem)]"
                    >
                      <a
                        href={repository.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-1 flex-col"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={`${item.outcome} example`}
                            loading="lazy"
                            className="aspect-[2/1] w-full border-b border-border bg-surface-strong/40 object-contain"
                            style={{ backgroundColor: repositoryImageBackground(item.repository) }}
                          />
                        ) : null}
                        <div className="flex flex-1 flex-col p-6 pb-0">
                          <div className="flex items-start justify-between gap-4">
                            <span className="font-mono text-xs text-primary">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                          </div>
                          <h3 className="mt-7 text-xl font-extrabold">{item.outcome}</h3>
                          <p className="mt-2 font-mono text-xs text-primary">
                            Built on {repository.name}
                          </p>
                          <p className="mt-5 flex-1 text-sm leading-6 text-muted-foreground">
                            {item.copy}
                          </p>
                        </div>
                      </a>
                      <div className="flex flex-wrap items-center gap-2 p-6 pt-6">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-sm border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.demo ? (
                          <a
                            href={item.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto inline-flex items-center gap-1.5 rounded-sm bg-primary px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-primary-foreground transition-colors hover:bg-primary/85"
                          >
                            Try it live <ExternalLink className="size-3" />
                          </a>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="references" className="py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase text-primary">05 / Reference projects</p>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Solutions we have helped to build.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              A selection of delivery work we have been part of, sometimes leading and often as one
              team among many, across fintech, insurance, enterprise software, retail analytics and
              energy: regulated platforms, high-volume products and the frameworks that let teams
              ship them faster.
            </p>
          </div>
          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase text-muted-foreground">
              Page {referencePage + 1} of {referencePages}
            </p>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setReferencePage((page) => Math.max(0, page - 1))}
                disabled={referencePage === 0}
                aria-label="Previous reference projects"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setReferencePage((page) => Math.min(referencePages - 1, page + 1))}
                disabled={referencePage >= referencePages - 1}
                aria-label="More reference projects"
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {referenceProjects.map((project, index) => (
              <article
                key={project.title}
                hidden={Math.floor(index / REFERENCES_PER_PAGE) !== referencePage}
                className="flex flex-col rounded-lg border border-border bg-surface p-6 sm:p-7"
              >
                <p className="font-mono text-[10px] uppercase text-primary">{project.sector}</p>
                <h3 className="mt-4 text-xl font-bold">{project.title}</h3>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{project.client}</p>
                <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">
                  {project.outcome}
                </p>
                {project.metric ? (
                  <p className="mt-4 font-mono text-xs text-foreground">{project.metric}</p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-sm border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Collapsed by default: the list is long and matters only to a buyer checking
              for a specific counterparty. It stays in the DOM (grid-rows animation, not
              unmounting) so crawlers and llms.txt readers see the same names. */}
          <div className="mt-14 border-t border-border pt-10">
            <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
              <div className="max-w-3xl">
                <p className="font-mono text-xs uppercase text-primary">
                  Some integrations we've helped to build
                </p>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Many third-party services have been wired into the platforms above and run in
                  production across the UK, the US, the EU and Latin America, from credit bureaus
                  and identity checks to banking rails, FX payouts, open banking and regulatory
                  reporting.{integrationsOpen ? " Here are some examples:" : ""}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIntegrationsOpen((open) => !open)}
                aria-expanded={integrationsOpen}
                aria-controls="integrations-list"
              >
                {integrationsOpen ? "Fewer details" : "More details"}
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${integrationsOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
            <div
              id="integrations-list"
              aria-hidden={!integrationsOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                integrationsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-[13rem_1fr]">
                  {integrationGroups.map((group) => (
                    <Fragment key={group.name}>
                      <dt className="font-mono text-[10px] uppercase leading-6 text-muted-foreground">
                        {group.name}
                      </dt>
                      <dd className="text-sm leading-6 text-foreground">
                        {group.items.join(" · ")}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="customers" className="border-y border-border bg-surface-strong/60 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase text-primary">06 / Customers</p>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Trusted where the stakes are high.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Organisations we have delivered for since 2000, directly and through employers and
                partners: regulated lending in the UK (Fund Ourselves) and the US (WeLendUs), FX
                payouts in the US (3 Degrees), finance and insurance in the EU (Tapiola), and
                enterprise software, energy, retail and industry across the Nordics.
              </p>
              <div className="mt-8 overflow-hidden rounded-lg border border-border bg-surface p-2">
                <img
                  src={customersImage}
                  alt="A client team laughing together around a laptop in a London office, Canary Wharf in the window"
                  width={1376}
                  height={768}
                  loading="lazy"
                  className="aspect-video w-full rounded object-cover object-left lg:aspect-[4/3]"
                />
              </div>
            </div>
            <div className="grid gap-6 lg:col-span-8">
              {customerGroups.map((group) => (
                <div key={group.sector}>
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">
                    {group.sector}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {group.customers.map((customer) => {
                      const content = customer.logo ? (
                        <img
                          src={customer.logo}
                          alt={customer.name}
                          title={customer.name}
                          loading="lazy"
                          className="h-6 w-auto max-w-32 object-contain sm:h-7"
                        />
                      ) : (
                        <span className="text-sm font-semibold">{customer.name}</span>
                      );
                      const tile =
                        "flex h-12 items-center rounded-md border border-border bg-background px-4 sm:h-14";
                      return (
                        <li key={customer.name}>
                          {customer.href ? (
                            <a
                              href={customer.href}
                              target="_blank"
                              rel="noreferrer"
                              className={`${tile} transition-colors hover:border-primary/50`}
                            >
                              {content}
                            </a>
                          ) : (
                            <span className={tile}>{content}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-mono text-xs uppercase text-primary">07 / Founder</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="text-3xl font-extrabold sm:text-4xl">Led by Tuomas Hietanen.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                Director, CTO and still a working engineer. Every engagement is led or reviewed by
                the founder, and the career below is the standard the rest of the team is hired
                against.
              </p>
            </div>
            <div className="flex items-center gap-5 lg:col-span-4 lg:justify-end">
              <img
                src={founderPortrait}
                alt="Tuomas Hietanen"
                width={96}
                height={96}
                loading="lazy"
                className="size-20 shrink-0 rounded-full border border-border object-cover sm:size-24"
              />
              <div>
                <p className="font-bold">Tuomas Hietanen</p>
                <p className="text-sm text-muted-foreground">Founder · Director · CTO</p>
                <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">
                  MSc (Tech), Artificial Intelligence
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-border">
            {career.map(([years, role, detail]) => (
              <article
                key={role}
                className="grid gap-2 border-b border-border py-6 sm:grid-cols-[9rem_minmax(0,1fr)] lg:grid-cols-[10rem_20rem_minmax(0,1fr)]"
              >
                <p className="font-mono text-xs text-primary">{years}</p>
                <h3 className="font-bold">{role}</h3>
                <p className="text-sm leading-6 text-muted-foreground sm:col-start-2 lg:col-start-auto">
                  {detail}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-start">
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground lg:col-span-7">
              Tuomas holds a Master of Science in Technology specialising in artificial
              intelligence, with additional business administration studies. He founded the Greater
              Helsinki Area F# User Group, maintains SQLProvider and LINQKit, and is a published
              author on .NET systems development.
            </p>
            <a
              href="https://amzn.eu/d/cSLnify"
              target="_blank"
              rel="noreferrer"
              className="group flex gap-5 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/50 lg:col-span-5"
            >
              <img
                src={bookCover}
                alt="Cover of Guidance for .NET Systems Development by Tuomas Hietanen"
                width={333}
                height={500}
                loading="lazy"
                className="h-36 w-auto shrink-0 rounded-sm border border-border object-cover shadow-md"
              />
              <span className="flex min-w-0 flex-col">
                <span className="font-mono text-[10px] uppercase text-primary">Publication</span>
                <cite className="mt-2 block text-base font-bold not-italic leading-snug">
                  Guidance for .NET Systems Development
                </cite>
                <span className="mt-1 text-sm leading-6 text-muted-foreground">
                  Development, Architecture and Maintainability
                </span>
                <span className="mt-3 font-mono text-[10px] uppercase text-muted-foreground">
                  Kindle &amp; paperback · ISBN 979-8287818418
                </span>
                <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-foreground">
                  View on Amazon
                  <ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-7 sm:p-12">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="font-mono text-xs uppercase text-primary">08 / Contact</p>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              Bring the difficult system problem.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
              For technology leadership, architecture reviews or hands-on engineering in fintech, AI
              and cloud platforms, get in touch directly.
            </p>
            <a
              href={`mailto:${company.email}`}
              className="group mt-8 flex max-w-xl items-center gap-5 rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/50 sm:p-5"
            >
              <span className="grid size-20 shrink-0 place-items-center rounded-lg border border-border bg-surface text-primary sm:size-24">
                <Mail className="size-10 sm:size-12" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] uppercase text-primary">
                  Contact here
                </span>
                <span className="mt-1 block text-lg font-bold">Tuomas Hietanen</span>
                <span className="block text-sm text-muted-foreground">
                  Founder · Hietanen Consultancy Ltd
                </span>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  {company.email}
                  <ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </span>
              </span>
            </a>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <a href={company.founder.linkedIn} target="_blank" rel="noreferrer">
                  <LinkedInIcon className="size-4" /> LinkedIn
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://github.com/Thorium" target="_blank" rel="noreferrer">
                  <GitHubIcon className="size-4" /> GitHub profile
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://bitbucket.org/Thorium/workspace/repositories"
                  target="_blank"
                  rel="noreferrer"
                >
                  <BitbucketIcon className="size-4" /> Bitbucket portfolio
                </a>
              </Button>
            </div>
            <div className="mt-10 border-t border-border pt-6">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Join the team</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                We are growing. If you are a senior engineer who prefers typed, functional code and
                systems that have to be right, we would like to hear from you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-8 text-xs text-muted-foreground sm:grid-cols-[minmax(0,1fr)_auto] sm:px-8">
          <p className="font-bold text-foreground">Hietanen Consultancy Ltd</p>
          <p>London · Working internationally · Company no. {company.companyNumber} · © 2026</p>
        </div>
      </footer>
    </main>
  );
}
