import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Terminal } from "lucide-react";

import fuugaImage from "@/assets/fuuga-llm.jpg";
import { BitbucketIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import { company, products } from "@/content/company";
import { seoHead, softwareJsonLd } from "@/lib/site";

export const Route = createFileRoute("/projects/fuuga")({
  component: FuugaPage,
  head: () => ({
    ...seoHead({
      title: "Fuuga — The Sovereign LLM Stack for .NET | Hietanen Consultancy",
      description: summary,
      path: "/projects/fuuga",
      image: fuugaImage,
      imageAlt: "Fuuga: the sovereign large-language-model stack for .NET",
      type: "article",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: softwareJsonLd({
          name: "Fuuga",
          description: summary,
          path: "/projects/fuuga",
          repository: repoUrl,
          nuget: nugetUrl,
          keywords: [
            "LLM",
            "language models",
            "fine-tuning",
            "inference",
            "TorchSharp",
            "F#",
            ".NET",
          ],
          offers: products.fuuga.offers,
        }),
      },
    ],
  }),
});

const fuuga = products.fuuga;
const commercialTerms = [
  ["What you buy", fuuga.sold],
  ["Who buys it", fuuga.buyer],
  ["How it starts", fuuga.start],
  ["What stays yours", fuuga.boundary],
] as const;

const summary =
  "Fuuga is a complete language-model pipeline in F# and .NET: train, fine-tune, compress and serve your own models with no Python and no data leaving the building.";
const repoUrl = "https://bitbucket.org/Thorium/fuuga";
const nugetUrl = "https://www.nuget.org/packages/Fuuga";
const contactUrl = `${company.contact}?subject=${encodeURIComponent("Fuuga investor deck")}`;

const problems = [
  [
    "Rented models, rented terms",
    "A hosted AI subscription sends customer records, contracts and code to a third party, bills every request, and can change or retire the model at any time. Compliance teams say no to the most valuable uses.",
  ],
  [
    "Built by specialists, not by the engineering team",
    "In-house model work is done by a data scientist in research tools the company's own engineers do not use. It ships as a one-off; when that person leaves, nobody can maintain it.",
  ],
  [
    "Regulation is arriving",
    "The EU AI Act, DORA and data-residency rules ask for provenance, auditability and control over the model. A model you trained on data you can trace is the simplest answer.",
  ],
] as const;

const decisionCase = [
  [
    "The data you have",
    "Outcomes, not a corpus",
    "Few companies own a training corpus, and building one is a project nobody funds. Every company owns outcomes: which team took the case, whether the claim was approved, whether the transaction turned out to be fraud. Those are labels, produced by running the business, and a decision engine learns from them directly.",
  ],
  [
    "The number you get",
    'An answer to "is it better?"',
    "Nobody can say whether a fine-tuned chat model beats the one it replaced. A typed decision has ground truth, so it has arithmetic: accuracy, log loss, Brier score and calibration error on held-out cases — right so often, and right about how sure it is.",
  ],
  [
    "The line it moves",
    "Act, or escalate",
    "Above the confidence threshold the software acts; below it the case goes to a person. The share handled without a human is the return, and it is measured rather than asserted — which is also what lets a regulated buyer approve it at all.",
  ],
] as const;

const pipeline = [
  [
    "01",
    "Ingest",
    "Documents, Parquet and text become a hashed, traceable corpus. Every checkpoint records which sources trained it.",
  ],
  [
    "02",
    "Transfer",
    "Donor weights from Llama 3, Phi, Qwen, Mistral, Gemma, DeepSeek, GLM and Kimi, mapped architecture-aware — or pre-train a small model from scratch.",
  ],
  [
    "03",
    "Fine-tune",
    "LoRA and QLoRA on consumer GPUs, DPO for preferences, GRPO reinforcement learning with verifiable rewards.",
  ],
  [
    "04",
    "Compress",
    "Distil, merge, prune and quantise to a bit budget; export GGUF for llama.cpp and Ollama, ONNX, or HuggingFace safetensors.",
  ],
  [
    "05",
    "Serve",
    "OpenAI- and Anthropic-compatible APIs, both mounted by default, with continuous batching, guardrails, tool calling, MCP and A2A — on your own hardware.",
  ],
] as const;

const capabilities = [
  [
    "Training",
    "BPE tokenizer, transformer with RoPE, GQA, MLA and MoE, AdamW and Muon, gradient checkpointing, CPU and NVMe offload for models larger than VRAM.",
  ],
  [
    "Fine-tuning",
    "SFT, prompt tuning, DPO, GRPO, rejection sampling, LoRA and QLoRA, adapter merging.",
  ],
  [
    "Model operations",
    "Weight transfer from nine donor families, distillation, N-ary merging, pruning, NF4 and INT8 quantisation, bit-exact export round-trips.",
  ],
  [
    "Evaluation",
    "MMLU, HellaSwag, ARC, GSM8K, MATH-500 and HumanEval built in, a typed judge arena that compares old against new on your own work, plus drift detection and a quality gate that reports regressions plainly.",
  ],
  [
    "Serving and agents",
    "Streaming, function calling, structured outputs, bearer auth, guardrails, local minion delegation with sandboxed tools and skills.",
  ],
  [
    "Image and video",
    "Stable Diffusion 1.5 implemented from scratch in F#, text-to-video and captioning, exposed as MCP tools.",
  ],
] as const;

const adoption = [
  [
    "01",
    "Connect, do not rewrite",
    "Fuuga speaks both the OpenAI and the Anthropic interface, and serves them together by default. An application built on either is pointed at a new address; the code that calls the model stays as it is.",
  ],
  [
    "02",
    "Run both, route by rule",
    "Fuuga's cost-aware router sends sensitive or routine requests to the in-house model and the rest to the existing subscription, within a budget.",
  ],
  [
    "03",
    "Learn from the incumbent",
    "Endpoint distillation collects the hosted model's answers to your own prompts and trains your model on them; a typed judge compares the two on your own work, both ways round, on held-out data.",
  ],
  [
    "04",
    "Switch when the numbers say so",
    "When the gate passes, the workload moves and the subscription shrinks. The next workload repeats the loop, faster.",
  ],
] as const;

function FuugaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 shrink-0" />{" "}
            <span className="truncate">Hietanen Consultancy</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <a href={nugetUrl} target="_blank" rel="noreferrer">
                NuGet <ExternalLink className="size-4" />
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={repoUrl} target="_blank" rel="noreferrer">
                <BitbucketIcon className="size-4" /> Bitbucket
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Fuuga theme: dark terminal in the violet of the Fuuga logo */}
      <div className="bg-[#0c0a1c] font-mono text-[#ddd6f3]">
        <section className="mx-auto max-w-5xl px-5 pb-14 pt-12 sm:px-8 sm:pt-16">
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#a78bfa]">
            <Terminal className="size-3.5" /> ~/products/fuuga
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            The sovereign LLM stack <span className="text-[#a78bfa]">for .NET.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#a9a3c9] sm:text-lg">
            Fuuga is the complete toolchain for making a language model, or retraining an existing
            one — preparing data, training, fine-tuning, shrinking, testing and running it —
            delivered on .NET, the platform your business systems already run on, for the engineers
            you already employ. No separate research stack. GPU or CPU. Your data never leaves your
            hardware.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {["dotnet add package Fuuga", "Fuuga.cpu", "Fuuga.Image", "public domain"].map((t) => (
              <span
                key={t}
                className="rounded-sm border border-[#2b2552] px-2.5 py-1 text-[#c4b5fd]"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8 overflow-hidden rounded-lg border border-[#2b2552] bg-[#120f2a] p-2 shadow-[0_0_60px_-20px_rgba(167,139,250,0.35)]">
            <img
              src={fuugaImage}
              alt="A developer workstation running a local large language model alongside code"
              width={1536}
              height={864}
              className="w-full rounded object-cover"
            />
          </div>
        </section>

        <section className="border-y border-[#2b2552] bg-[#100d24] py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <span className="text-[#a78bfa]">&gt;</span> the-problem
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a9a3c9]">
              Enterprises rent their AI, and cannot maintain the AI they build. The regulated
              back-offices of the world run on .NET, and none of the model-building tools do.
            </p>
            <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[#2b2552] bg-[#2b2552] sm:grid-cols-3">
              {problems.map(([title, copy]) => (
                <article key={title} className="bg-[#0c0a1c] p-6">
                  <h3 className="font-bold text-[#f1eefc]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#a9a3c9]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            <span className="text-[#a78bfa]">&gt;</span> where-it-pays-first
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a9a3c9]">
            Typed decisions are the part of AI a business can actually measure. Nothing here
            generates text: Fuuga scores a fixed set of options in one pass and returns a calibrated
            probability for each, so the answer can be logged, audited, priced and trusted.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[#2b2552] bg-[#2b2552] sm:grid-cols-3">
            {decisionCase.map(([label, title, copy]) => (
              <article key={title} className="bg-[#100d24] p-6">
                <span className="text-xs uppercase tracking-widest text-[#a78bfa]">{label}</span>
                <h3 className="mt-3 font-bold text-[#f1eefc]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#a9a3c9]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            <span className="text-[#a78bfa]">&gt;</span> the-pipeline
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a9a3c9]">
            Start from an open model. Make it yours. Keep it in-house. One recipe file drives each
            workflow: scaffold it, edit a few paths, run.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[#2b2552] bg-[#2b2552] sm:grid-cols-2 lg:grid-cols-5">
            {pipeline.map(([number, title, copy]) => (
              <article
                key={number}
                className="bg-[#100d24] p-6 transition-colors hover:bg-[#120f2a]"
              >
                <span className="text-xs text-[#a78bfa]">[{number}]</span>
                <h3 className="mt-4 text-lg font-bold text-[#f1eefc]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#a9a3c9]">{copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 overflow-hidden rounded-lg border border-[#2b2552] bg-[#120f2a]">
            <p className="border-b border-[#2b2552] bg-[#1a1636] px-5 py-2.5 text-xs text-[#a9a3c9]">
              the common path — donor model to served model
            </p>
            <pre className="overflow-x-auto p-5 text-sm leading-7 text-[#f1eefc]">
              <code>
                {[
                  "fuuga scaffold finetune",
                  "fuuga transfer --recipe my.json",
                  "fuuga sft --recipe my.json",
                  "fuuga eval --recipe my.json",
                  "fuuga export gguf --tokenizer tok/",
                  "fuuga-serve --checkpoint best/",
                ].map((line) => (
                  <span key={line} className="block">
                    <span className="text-[#a78bfa]">&gt;</span> {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </section>

        <section className="border-y border-[#2b2552] bg-[#100d24] py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <span className="text-[#a78bfa]">&gt;</span> what-runs-today
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a9a3c9]">
              Not a roadmap. Everything below is in the repository, with tests, and can be walked
              through live.
            </p>
            <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[#2b2552] bg-[#2b2552] sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map(([title, copy]) => (
                <article key={title} className="bg-[#0c0a1c] p-6">
                  <h3 className="font-bold text-[#f1eefc]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#a9a3c9]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            <span className="text-[#a78bfa]">&gt;</span> how-we-work-with-you
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a9a3c9]">
            The library is public domain by choice: source is the cheap part now. Adoption is free,
            every line can be audited, and what organisations pay for is the part that does not copy
            — reliability, the evidence behind a model's behaviour, and somebody answerable when it
            is wrong.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[#2b2552] bg-[#2b2552] sm:grid-cols-2">
            {fuuga.offers.map((offer) => (
              <article key={offer.name} className="bg-[#100d24] p-6">
                <span className="text-xs uppercase tracking-widest text-[#a78bfa]">
                  {offer.kind}
                </span>
                <h3 className="mt-3 font-bold text-[#f1eefc]">{offer.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#a9a3c9]">{offer.copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {commercialTerms.map(([label, copy]) => (
              <article key={label} className="rounded-lg border border-[#2b2552] bg-[#100d24] p-6">
                <h3 className="text-xs uppercase tracking-widest text-[#a78bfa]">{label}</h3>
                <p className="mt-3 text-sm leading-6 text-[#a9a3c9]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-[#2b2552] bg-[#100d24] py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <span className="text-[#a78bfa]">&gt;</span> already-on-a-hosted-api
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a9a3c9]">
              An existing AI strategy is not replaced. It gains an in-house option for the parts
              compliance blocks, the bills that keep growing, and the models a vendor may retire.
              Nothing is rewritten: coexistence first, then migration by evidence. Fuuga speaks the
              OpenAI and the Anthropic interface, and the weights leave again as GGUF, safetensors
              or ONNX — the model runs anywhere, including without us.
            </p>
            <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[#2b2552] bg-[#2b2552] sm:grid-cols-2 lg:grid-cols-4">
              {adoption.map(([number, title, copy]) => (
                <article key={number} className="bg-[#0c0a1c] p-6">
                  <span className="text-xs text-[#a78bfa]">[{number}]</span>
                  <h3 className="mt-4 font-bold text-[#f1eefc]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#a9a3c9]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#2b2552] bg-[#a78bfa] py-16 text-[#0c0a1c]">
          <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#2b2552]">
                for-investors-and-partners
              </p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                We are raising a seed round to make Fuuga the model stack of the .NET enterprise.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#2b2552]">
                Built by the maintainer of SQLProvider and LINQKit, with twenty-five years of
                regulated fintech delivery. Ask for the investor deck, a code walkthrough, or a
                pilot on your own recorded outcomes — a first reply usually comes the same day.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild className="bg-[#0c0a1c] font-mono text-[#f1eefc] hover:bg-[#2b2552]">
                <a href={contactUrl}>
                  Request the deck <ExternalLink className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#0c0a1c] bg-transparent font-mono text-[#0c0a1c] hover:bg-[#c4b5fd] hover:text-[#0c0a1c]"
              >
                <a href={repoUrl} target="_blank" rel="noreferrer">
                  Read the source <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <nav aria-label="Other pages" className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="outline"
              className="border-[#2b2552] bg-transparent font-mono text-[#ddd6f3] hover:bg-[#120f2a] hover:text-[#f1eefc]"
            >
              <Link to="/">Back to overview</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#2b2552] bg-transparent font-mono text-[#ddd6f3] hover:bg-[#120f2a] hover:text-[#f1eefc]"
            >
              <Link to="/projects/quantum/">Next product: FSharp.Azure.Quantum</Link>
            </Button>
          </div>
        </nav>

        <footer className="border-t border-[#2b2552]">
          <div className="mx-auto grid max-w-5xl gap-3 px-5 py-8 text-xs text-[#a9a3c9] sm:grid-cols-[minmax(0,1fr)_auto] sm:px-8">
            <p className="font-bold text-[#f1eefc]">Hietanen Consultancy Ltd</p>
            <p>London · Working internationally · Company no. {company.companyNumber} · © 2026</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
