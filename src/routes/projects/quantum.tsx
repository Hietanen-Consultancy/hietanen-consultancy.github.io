import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Download, ExternalLink, Orbit } from "lucide-react";

import droneSwarmImage from "@/assets/drone-swarm.jpg";
import { GitHubIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import { company, products } from "@/content/company";
import { seoHead, softwareJsonLd } from "@/lib/site";

export const Route = createFileRoute("/projects/quantum")({
  component: QuantumPage,
  head: () => ({
    ...seoHead({
      title: "FSharp.Azure.Quantum — Quantum Optimisation for Drone Fleets",
      description: summary,
      path: "/projects/quantum",
      image: droneSwarmImage,
      imageAlt: "A coordinated drone swarm, the FSharp.Azure.Quantum showcase",
      type: "article",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: softwareJsonLd({
          name: "FSharp.Azure.Quantum",
          description: summary,
          path: "/projects/quantum",
          repository: repoUrl,
          nuget: nugetUrl,
          keywords: [
            "quantum computing",
            "QUBO",
            "optimisation",
            "drone swarm",
            "Azure Quantum",
            "F#",
            ".NET",
          ],
          offers: products.quantum.offers,
        }),
      },
    ],
  }),
});

const summary =
  "Quantum optimisation for developers and AI agents in one .NET package. First application: coordinating drone fleets — routes, tasks and formations, re-planned on the fly.";
const repoUrl = "https://github.com/Thorium/FSharp.Azure.Quantum";
const examplesUrl = `${repoUrl}/tree/main/examples`;
const nugetUrl = "https://www.nuget.org/packages/FSharp.Azure.Quantum/";
const contactUrl = `${company.contact}?subject=${encodeURIComponent("FSharp.Azure.Quantum demo")}`;
// Built by scripts/pitch-deck-pdf.ts from the deck's customer variant.
const briefingUrl = "/decks/quantum-fleet-planning-customer-briefing.pdf";

const quantum = products.quantum;
const commercialTerms = [
  ["What you buy", quantum.sold],
  ["Who buys it", quantum.buyer],
  ["What the partner gets", quantum.partner ?? ""],
  ["How it starts", quantum.start],
  ["Who owns what", quantum.boundary],
] as const;

const problems = [
  [
    "Routing and assignment are NP-hard",
    "Which drone flies where, in what order, within range and airspace limits. One failed unit or a new task and the whole plan must be recomputed in seconds.",
  ],
  [
    "Quantum tooling is written for physicists",
    "Qiskit, Cirq and Q# expect gates, Hamiltonians and hand-encoded QUBOs. A fleet-software team has none of that vocabulary and no way to hire it.",
  ],
  [
    "Hardware arrived without a developer path",
    "Azure Quantum, D-Wave and Braket sell machine time today. Nothing lets an ordinary .NET application describe a business problem and run it there.",
  ],
] as const;

const swarmSteps = [
  [
    "01",
    "Describe the fleet",
    "Units, their range and capabilities, the tasks to cover and the airspace and altitude limits they fly under.",
  ],
  [
    "02",
    "Give the objective",
    "Shortest total flight time, balanced battery use, guaranteed coverage — expressed as a business goal, not a Hamiltonian.",
  ],
  [
    "03",
    "Solve the assignment",
    "The library turns the model into an optimisation problem and solves it on a simulator, a hybrid path or a real quantum backend.",
  ],
  [
    "04",
    "Re-route on the fly",
    "A unit fails or the mission changes, the swarm is re-planned in place and exported to the flight controllers again.",
  ],
] as const;

const droneExamples = [
  [
    "Fleet path planning",
    "Waypoints become a tour, split into range-safe sorties across the fleet, with altitudes checked against the regulatory ceiling.",
    `${repoUrl}/tree/main/examples/Drones/FleetPathPlanning`,
  ],
  [
    "Swarm task allocation",
    "Tasks with dependencies and priorities scheduled across drones with capacity limits, minimising mission time.",
    `${repoUrl}/tree/main/examples/Drones/SwarmTaskAllocation`,
  ],
  [
    "Swarm choreography",
    "Formation transitions solved with QAOA and exported to Crazyflie micro-drones indoors and as ArduPilot missions outdoors.",
    `${repoUrl}/tree/main/examples/Drones/SwarmChoreography`,
  ],
  [
    "Wildfire air bridge",
    "Water moves as flow along corridors between the lake and the fire sector, capped by fill slots, in-trail spacing and drop slots; the planner decides which corridors to open as the wind turns.",
    `${repoUrl}/tree/main/examples/Drones/FireAirBridge`,
  ],
] as const;

// Snapshots of the examples' missions flown in ArduPilot SITL, copied from
// examples/Drones/_images in the repository. Each SVG animates the whole flight.
const droneFlights = [
  [
    "Fleet path planning",
    "A carrier sets down six relay repeaters, then one fixed-wing sortie flies all seven waypoints · closest 14.1 m",
    "/drones/fleet-path-planning-sitl.svg",
  ],
  [
    "Swarm task allocation",
    "Eight tasks on three aircraft, one of them a fixed-wing VTOL · closest 10.0 m",
    "/drones/swarm-task-allocation-sitl.svg",
  ],
  [
    "Swarm choreography",
    "Four drones fly a 117-second show in a vertical plane · closest 6.1 m",
    "/drones/swarm-choreography-sitl.svg",
  ],
  [
    "Wildfire air bridge",
    "The indoor can demo: ten cans, ten sorties, 0.5 m separation · closest 0.6 m",
    "/drones/fire-air-bridge-sitl.svg",
  ],
] as const;

// The wildfire air bridge planner on a map: the FireAirBridge example run with
// `--fire`, `--water` and `--map` over the Oakland hills (the README's command),
// its map.svg copied here. Opened on its own it zooms and pans.
const airBridgeMap = {
  src: "/drones/fire-air-bridge-map.svg",
  caption:
    "The wildfire air bridge planner's choice each round, above the Oakland hills: dotted corridors are the candidates, one qubit each, ten per round from three water points to eight burning sectors under two ground crews and four drop coordinators; solid corridors are the plan, with the drones flowing along them; red is the fire's intensity. The footer gives each round's qubits, how many plans they span (2^10 for ten), the quantum circuits run to search them, and three scores: the plan the Quantum Approximate Optimisation Algorithm (QAOA) found, the exact oracle's, and the classical greedy planner's. Open it to zoom.",
} as const;

// The choreography example's scale run: `dotnet run -- --drones 100 --lights` in
// examples/Drones/SwarmChoreography, its show.svg copied here.
const lightShow = {
  src: "/drones/swarm-light-show.svg",
  // The same run's trajectories: every drone's timed keyframes, the GUIDED-mode show
  // controller that flies them (ArduPilot SITL or real links) and the SITL start script.
  zip: "/drones/swarm-light-show-trajectories.zip",
  caption:
    "A hundred drones on a 2.5 m launch grid, 3 m apart in the air and under 120 m: a globe whose lands turn a full turn in 24 steps while the drones hold (a change of lights only), then a diamond, a star with its inner lights off, a turning mug, a doughnut and a cube turning a full turn, the turns flown as one continuous move. Every flight between formations was solved in blocks of four drones on 16-qubit circuits and passed the same in-flight separation gate as the four-drone show. The zip holds every drone's timed keyframes, the show controller that flies them in GUIDED mode on ArduPilot, in its simulator or on real links, and the script that starts one simulator per drone.",
} as const;

const layers = [
  [
    "Layer 1 · Builders",
    "The business vocabulary: routing, scheduling, assignment, knapsack, portfolio, network flow; fraud, churn and workforce builders. Written by developers or AI agents in F# or C#.",
  ],
  [
    "Layer 2 · Solvers",
    "QAOA for optimisation; VQE and ADAPT-VQE for chemistry; Grover and amplitude amplification; QFT-based arithmetic and phase estimation.",
  ],
  [
    "Layer 3 · Backends",
    "One interface over the local simulator, Azure Quantum (IonQ, Pasqal, Quantinuum, Rigetti), D-Wave annealers, an AWS Braket plugin and a topological simulator for the Majorana era. Circuits arrive as OpenQASM from Qiskit and leave as OpenQASM, QIR or a MAVLink mission.",
  ],
] as const;

const capabilities = [
  ["One NuGet package", "dotnet add package FSharp.Azure.Quantum — no research stack to assemble."],
  ["F# builders, C# fluent API", "Written like any other .NET code, reviewable by the whole team."],
  [
    "Quantum-first, honestly",
    "A quantum solver never silently returns a classical answer; the hybrid router says which method produced a result.",
  ],
  [
    "Every backend, one interface",
    "Simulator on a laptop today, cloud QPUs and annealers when the problem needs them. OpenQASM 1.0–3.0 in and out, QIR emission, error mitigation and qubit routing, so nothing built here is stranded.",
  ],
] as const;

const chemistryExamples = [
  [
    "Antibiotic precursor synthesis",
    `${repoUrl}/blob/main/examples/DrugDiscovery/AntibioticPrecursorSynthesis.fsx`,
  ],
  ["Binding affinity", `${repoUrl}/blob/main/examples/DrugDiscovery/BindingAffinity.fsx`],
  [
    "Electron transport chain",
    `${repoUrl}/blob/main/examples/Chemistry/ElectronTransportChain.fsx`,
  ],
] as const;

function QuantumPage() {
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
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Quantum theme: deep blue and sky, from the drone-swarm seascape */}
      <div className="bg-[#f0f9ff] text-[#061a33]">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.22),transparent_60%)]"
          />
          <div className="relative mx-auto max-w-5xl px-5 pb-14 pt-12 sm:px-8 sm:pt-16">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#0284c7]">
              <Orbit className="size-3.5" /> FSharp.Azure.Quantum · drone-first
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Describe the problem. <span className="text-[#0284c7]">Skip the physics.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#3b5f85] sm:text-lg">
              Quantum optimisation that ordinary developers and AI agents can ship. The problem goes
              in as everyday .NET code, not quantum circuits; the library builds and runs the
              circuits on a simulator or real quantum hardware and returns the answer. The
              algorithms and error correction are already done. First application: coordinating
              drone fleets.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-[#bcd6ee] bg-white/70 p-2 shadow-[0_20px_60px_-20px_rgba(2,132,199,0.35)] backdrop-blur">
              <img
                src={droneSwarmImage}
                alt="A coordinated swarm of drones flying over a Nordic harbour"
                width={1536}
                height={864}
                className="w-full rounded-xl object-cover"
              />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#0284c7]">
              First application · Drone fleet coordination
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Coordinating a fleet is a combinatorial problem that grows faster than the fleet.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {problems.map(([title, copy]) => (
              <article
                key={title}
                className="rounded-2xl border border-[#bcd6ee] bg-white/70 p-6 backdrop-blur"
              >
                <h3 className="font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#3b5f85]">{copy}</p>
              </article>
            ))}
          </div>
          <figure className="mt-8 flex flex-col">
            <a
              href={airBridgeMap.src}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-2xl border border-[#bcd6ee] bg-white/70 p-2 shadow-[0_20px_60px_-20px_rgba(2,132,199,0.35)] backdrop-blur transition-colors hover:border-[#0284c7]/60"
            >
              <img
                src={airBridgeMap.src}
                alt="The wildfire air bridge planner on a map of the Oakland hills: candidate corridors dotted, the chosen corridors solid with drones flowing, the fire sectors red"
                loading="lazy"
                decoding="async"
                width={1000}
                height={710}
                className="w-full rounded-xl"
              />
            </a>
            <figcaption className="mt-3 text-sm leading-6 text-[#3b5f85]">
              <span className="font-bold text-[#0b2a4d]">The choice, drawn.</span>{" "}
              {airBridgeMap.caption}
            </figcaption>
          </figure>
        </section>

        <section className="border-y border-[#bcd6ee] bg-[#0b2a4d] py-16 text-[#e0f2fe]">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Drone-first: what flies today.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#bae6fd]">
              Give the swarm its tasks, calculate the routes, re-route on the fly if a unit fails.
              The hard part is the combinatorics — that is exactly what quantum optimisation is for.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {swarmSteps.map(([number, title, copy]) => (
                <article
                  key={number}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:bg-white/10 sm:p-8"
                >
                  <span className="font-mono text-xs text-[#7dd3fc]">{number}</span>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#bae6fd]">{copy}</p>
                </article>
              ))}
            </div>
            <p className="mt-12 font-mono text-[10px] uppercase tracking-widest text-[#7dd3fc]">
              Four runnable examples in the repository
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {droneExamples.map(([title, copy, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col rounded-2xl border border-white/10 bg-[#061a33]/60 p-5 transition-colors hover:border-[#38bdf8]/60"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-bold">{title}</span>
                    <ExternalLink className="size-4 shrink-0 text-[#7dd3fc] transition-colors group-hover:text-white" />
                  </span>
                  <span className="mt-2 text-sm leading-6 text-[#bae6fd]">{copy}</span>
                  <span className="mt-4 font-mono text-[10px] text-[#7dd3fc]">
                    examples/Drones/{href.split("/").pop()}
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-12 font-mono text-[10px] uppercase tracking-widest text-[#7dd3fc]">
              Flown in ArduPilot's own simulator (SITL) · ArduPilot 4.7.1 · 29 September 2026
            </p>
            <p className="mt-3 text-sm leading-6 text-[#bae6fd]">
              Every example exports ArduPilot missions, and one shared launcher flies them. These
              flights ran in ArduPilot's software-in-the-loop simulator: the real autopilot firmware
              on a simulated airframe. Each picture shows the flight in 3-D, with the whole flight
              playing in 20 seconds. Open it for the plan against the flight, from above and as
              height over time.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {droneFlights.map(([title, caption, src]) => (
                <figure key={src} className="flex flex-col">
                  <a
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-2xl border border-white/10 bg-white transition-colors hover:border-[#38bdf8]/60"
                  >
                    {/* The 3-D view is always the bottom 596 of the drawing's 820 x 1798 units. */}
                    <img
                      src={src}
                      alt={`${title}: the flight in 3-D, flown in ArduPilot SITL`}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[820/596] w-full object-cover object-bottom"
                    />
                  </a>
                  <figcaption className="mt-3 text-sm leading-6 text-[#bae6fd]">
                    <span className="font-bold text-[#e0f2fe]">{title}.</span> {caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-12 font-mono text-[10px] uppercase tracking-widest text-[#7dd3fc]">
              A hundred drones on sixteen qubits · the laptop simulator · 9 October 2026
            </p>
            <p className="mt-3 text-sm leading-6 text-[#bae6fd]">
              A swarm's formation change is an assignment of every drone to a slot, n² qubits as one
              circuit. A hundred drones would need 10,000. The choreography example instead improves
              the assignment in blocks of four drones, each block a 16-qubit QAOA circuit on the
              same laptop simulator, until no block moves and every drone keeps its safety distance
              in flight. No classical solver stands in for the quantum one; the runs grow with the
              swarm, not with its square. The picture is the show as planned: every drone in the
              colour its light is set to. Any show works the same way: hand the software the
              pictures, as points with the colour each light should show, and it plans every flight
              between them, checks the separation in flight and writes the plan each drone flies.
            </p>
            <figure className="mt-4 flex flex-col">
              <a
                href={lightShow.src}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1a] transition-colors hover:border-[#38bdf8]/60"
              >
                <img
                  src={lightShow.src}
                  alt="A hundred drones flying a light show: a turning globe, a diamond, a cube and a star, each drone drawn in the colour of its light"
                  loading="lazy"
                  decoding="async"
                  width={1000}
                  height={560}
                  className="w-full"
                />
              </a>
              <figcaption className="mt-3 text-sm leading-6 text-[#bae6fd]">
                <span className="font-bold text-[#e0f2fe]">Swarm choreography at scale.</span>{" "}
                {lightShow.caption}
              </figcaption>
              <div className="mt-4">
                <Button
                  asChild
                  variant="outline"
                  className="border-[#38bdf8]/50 bg-transparent text-[#f0f9ff] hover:bg-[#0b2a4d] hover:text-[#f0f9ff]"
                >
                  <a href={lightShow.zip} download>
                    Download the flight plan (zip) <Download className="size-4" />
                  </a>
                </Button>
              </div>
            </figure>
            <div className="mt-8 rounded-2xl border border-[#38bdf8]/40 bg-[#061a33]/60 p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#7dd3fc]">
                Where the hardware is
              </p>
              <p className="mt-3 text-sm leading-6 text-[#e0f2fe]">
                The choreography example runs four drones on sixteen qubits on a laptop simulator,
                with the quantum solver executing every transition, and a hundred drones on the same
                sixteen qubits a block at a time. A wider device takes wider blocks: 31 drones per
                circuit at 1,000 qubits. Cloud QPU and annealer backends sit behind the same API,
                and the code does not change as the machines grow.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Three layers. Developers touch only the top one.
          </h2>
          <div className="mt-8 grid gap-4">
            {layers.map(([title, copy], index) => (
              <article
                key={title}
                className={
                  index === 0
                    ? "rounded-2xl bg-[#0284c7] p-6 text-[#f0f9ff]"
                    : "rounded-2xl border border-[#bcd6ee] bg-white/70 p-6 backdrop-blur"
                }
              >
                <h3 className="font-mono text-xs uppercase tracking-widest">{title}</h3>
                <p
                  className={
                    index === 0 ? "mt-3 text-sm leading-6" : "mt-3 text-sm leading-6 text-[#3b5f85]"
                  }
                >
                  {copy}
                </p>
              </article>
            ))}
          </div>
          <h2 className="mt-16 text-3xl font-extrabold sm:text-4xl">
            Write it today. Run it at scale later.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {capabilities.map(([title, copy]) => (
              <article
                key={title}
                className="rounded-2xl border border-[#bcd6ee] bg-white/70 p-6 backdrop-blur"
              >
                <h3 className="font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#3b5f85]">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#bcd6ee] bg-white/60 py-16">
          <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#0284c7]">
                Second act · chemistry
              </p>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Antibiotics from Western materials.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-[#3b5f85]">
                Most of the world's key antibiotic intermediates come from a single country. The
                same solver layer runs VQE to compare alternative β-lactam synthesis routes by
                activation energy, next to binding-affinity and metabolism examples. Regulated drug
                development is not a market we can demonstrate on our own, so we take it forward
                with pharma and academic partners who own that path — after the fleets are flying.
              </p>
            </div>
            <div className="grid gap-3">
              {chemistryExamples.map(([title, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-[#bcd6ee] bg-white/70 px-5 py-4 transition-colors hover:border-[#0284c7]"
                >
                  <span className="font-bold">{title}</span>
                  <ExternalLink className="size-4 shrink-0 text-[#0284c7]" />
                </a>
              ))}
              <a
                href={examplesUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-[#0284c7] hover:underline"
              >
                All 100+ examples, from business-ready to research →
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[#0284c7]">
            How this is sold
          </p>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            We sell the plan. Our partners sell the fleet.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {commercialTerms.map(([label, copy], i) => (
              <article
                key={label}
                className={`rounded-2xl border border-[#bcd6ee] bg-white/70 p-6 backdrop-blur ${
                  // An odd last panel spans both columns instead of leaving a hole.
                  i === commercialTerms.length - 1 && commercialTerms.length % 2 === 1
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#0284c7]">
                  {label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#3b5f85]">{copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {quantum.offers.map((offer) => (
              <article
                key={offer.name}
                className="rounded-2xl border border-[#bcd6ee] bg-white/70 p-6 backdrop-blur"
              >
                <span className="font-mono text-xs text-[#0284c7]">{offer.kind}</span>
                <h3 className="mt-3 font-bold">{offer.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#3b5f85]">{offer.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#061a33] py-16 text-[#f0f9ff]">
          <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#38bdf8]">
                For vendors and operators
              </p>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                Bring us a fleet-planning problem.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#bae6fd]">
                The library is public domain and free to use. When you want it inside your product
                or your operation, we take it on as a fixed-scope project and support the build you
                ship. Ask for a live demo: four drones, one laptop, a quantum solver, twenty
                minutes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild className="bg-[#38bdf8] text-[#061a33] hover:bg-[#7dd3fc]">
                <a href={contactUrl}>
                  Ask for a demo <ExternalLink className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#38bdf8]/50 bg-transparent text-[#f0f9ff] hover:bg-[#0b2a4d] hover:text-[#f0f9ff]"
              >
                <a href={repoUrl} target="_blank" rel="noreferrer">
                  View the library <ExternalLink className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#38bdf8]/50 bg-transparent text-[#f0f9ff] hover:bg-[#0b2a4d] hover:text-[#f0f9ff]"
              >
                <a href={briefingUrl} download>
                  Briefing (PDF) <Download className="size-4" />
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
              className="border-[#bcd6ee] bg-transparent text-[#061a33] hover:bg-white/70 hover:text-[#061a33]"
            >
              <Link to="/">Back to overview</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#bcd6ee] bg-transparent text-[#061a33] hover:bg-white/70 hover:text-[#061a33]"
            >
              <Link to="/projects/fuuga/">Next product: Fuuga</Link>
            </Button>
          </div>
        </nav>

        <footer className="border-t border-[#bcd6ee]">
          <div className="mx-auto grid max-w-5xl gap-3 px-5 py-8 text-xs text-[#3b5f85] sm:grid-cols-[minmax(0,1fr)_auto] sm:px-8">
            <p className="font-bold text-[#061a33]">Hietanen Consultancy Ltd</p>
            <p>London · Working internationally · Company no. {company.companyNumber} · © 2026</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
