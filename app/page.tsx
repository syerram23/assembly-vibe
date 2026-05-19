import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { agents, connectors } from "@/lib/mocks";
import Link from "next/link";

/*
 * Marketing landing — the full 10-section long-form page. Everything is real
 * DOM, no PNGs. Tailwind utilities for layout; vanilla CSS in the <style>
 * block for page-specific custom rules.
 */

const heroConnectors = ["Workday", "Salesforce", "Snowflake", "Slack", "Guidewire"];

const lifecycleSteps = [
  {
    num: "01",
    title: "Scope the app",
    actor: "You + Assembly.",
    body: "Describe the outcome; Assembly sets up a governed data plane, connects your systems, and readies the pre-built agents.",
    artifact: "scope.md · governed data · agent shortlist",
  },
  {
    num: "02",
    title: "Build it",
    actor: "Your team, or an Assembly Partner.",
    body: "Open Claude Code, already pointed at your governed data and agents. Build the part unique to you — the rest is already there.",
    artifact: "claude code · vibe prompt · live preview",
  },
  {
    num: "03",
    title: "Finish it for production",
    actor: "Assembly engineer.",
    body: "Hit something that needs an engineer? Raise a ticket. An Assembly engineer hardens it — durable workflows, edge cases, scale — and hands it back.",
    artifact: "ticket → PR · durable workflow · scale tests",
  },
  {
    num: "04",
    title: "Approve for production",
    actor: "Your Org Admin.",
    body: "Nothing goes live on its own. The app must pass a pre-production checklist — permissions tested, data reviewed, security scan clean — and your Org Admin signs off.",
    artifact: "5/5 checks · signed by admin · audit entry",
    highlight: true,
  },
  {
    num: "05",
    title: "Live — and governed",
    actor: "Assembly keeps it running.",
    body: "The app runs in production: versioned, audited, monitored. Every later change goes through the same gate.",
    artifact: "v0.3.0 · 99.97% · audit on",
  },
];

const waysToBuild = [
  {
    label: "Self-service, with support",
    body: "Your own builder ships apps on the governed platform. We back them with onboarding, training, priority support, and the full agent library. Best when you have someone technical-adjacent who likes to build.",
    tag: "Your builder",
    featured: false,
  },
  {
    label: "Assembly Partners",
    body: "No one internal to build it? Hire a certified Assembly Partner — a Forward-Deployed Engineer who embeds with your team and builds it for you. Built for SMBs without an in-house builder.",
    tag: "Certified FDE",
    featured: true,
  },
  {
    label: "AI-native delivery",
    body: "Want it handed to you, done? Assembly's team takes a use case from idea to a working, production-grade app.",
    tag: "Assembly team",
    featured: false,
  },
];

const partnerPoints = [
  {
    title: "Certified on the platform",
    body: "Every Partner is trained on the governed data plane, the agent library, and the production gate. They start fluent — not learning on your time.",
  },
  {
    title: "Embedded, not a black box",
    body: "A Partner works alongside your team and hands the apps back trained, documented, and yours. You keep ownership the whole way through.",
  },
  {
    title: "Flexible",
    body: "Pick the engagement that fits — a single app, a quarter-long sprint, or an ongoing builder on retainer. No procurement gauntlet.",
  },
];

const platformGroups = [
  {
    label: "Sign in & stay secure",
    items: ["SSO", "Roles & permissions", "User management", "Audit trail"],
  },
  {
    label: "Your data, ready to use",
    items: ["Governed data plane", "Connectors", "Search", "Files", "Secure storage"],
  },
  {
    label: "Reach people",
    items: ["Email", "SMS", "Conversations", "Notifications"],
  },
  {
    label: "Build faster",
    items: ["Ready-made components", "Scheduled jobs", "Doc generation", "Secrets handling"],
  },
  {
    label: "Run with confidence",
    items: ["Hosting", "Monitoring", "Production workflows", "Admin & governance"],
  },
];

const comparisonRows = [
  {
    dimension: "Getting to your data",
    vibe: "Sandbox only — copy/paste or manual upload",
    vibeGood: false,
    assembly: "Connected to your real systems through a governed plane",
    assemblyGood: true,
  },
  {
    dimension: "Permissioning",
    vibe: "None — anyone in the tool sees everything",
    vibeGood: false,
    assembly: "Per-role, per-field permissions enforced at the data layer",
    assemblyGood: true,
  },
  {
    dimension: "Security",
    vibe: "Public cloud sandbox, shared environment",
    vibeGood: false,
    assembly: "Your environment · SSO · secrets handled · scoped credentials",
    assemblyGood: true,
  },
  {
    dimension: "Production-readiness",
    vibe: "You finish the production work yourself",
    vibeGood: false,
    assembly: "Assembly engineers harden it; durable workflows included",
    assemblyGood: true,
  },
  {
    dimension: "Audit & compliance",
    vibe: "No audit trail · no approval gate",
    vibeGood: false,
    assembly: "Full audit log · admin sign-off gate before production",
    assemblyGood: true,
  },
  {
    dimension: "Starting point",
    vibe: "A blank canvas every time",
    vibeGood: false,
    assembly: "Six pre-built agents · connectors · workspace · ready to point",
    assemblyGood: true,
  },
];

const proofCases = [
  {
    codename: "ATLAS-07",
    industry: "Regulated banking · 1,200 employees",
    outcome: "Reg-E quarterly run, end-to-end, from 6 weeks of manual prep to one week.",
    quote: "We stopped renting compliance contractors for the quarter-end push. The app does the sampling and prep; our team disposes the borderline cases.",
    quoter: "Director of Compliance",
  },
  {
    codename: "MERIDIAN-04",
    industry: "Multi-state insurance carrier",
    outcome: "FNOL intake on voice + text, with state-aware coverage logic and Guidewire file open.",
    quote: "We had a vendor quote for this. It came in at $1.4M and 11 months. We shipped on Assembly with two builders in five weeks.",
    quoter: "VP, Claims Operations",
  },
  {
    codename: "OAKLINE-02",
    industry: "PE-backed services roll-up · 47 brands",
    outcome: "AR follow-up agent across brands, with per-customer throttling and tone control.",
    quote: "The Org Admin sign-off was actually the part that sold IT. Nothing goes live until the box is checked.",
    quoter: "Group CFO",
  },
];

export default function LandingPage() {
  return (
    <>
      <MarketingNav />
      <main>

        {/* ───────────────────────────── HERO ───────────────────────────── */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow"><span className="dot" />Enterprise & SMB AI enablement</span>
              <h1>
                Ship enterprise AI apps in <em>a week</em> &mdash;<br />
                pre-built for your stack.
              </h1>
              <p className="lede">
                Assembly comes pre-wired: <b>40+ connectors</b> to your systems of record, <b>6 production-ready agents</b>, and the identity, audit, HITL, hosting, and durable-workflow runtime your team would otherwise build from scratch &mdash; already there. Your team writes the part unique to your business; the other ninety percent ships day one. Vibe-code inside the enterprise.
              </p>
              <div className="cta-row">
                <Link href="/app" className="btn btn-primary">
                  Get a data-readiness assessment <span className="arr">→</span>
                </Link>
                <Link href="#how-it-works" className="btn btn-secondary">
                  See what's pre-built
                </Link>
              </div>
              <div className="meta-row">
                <span><b>47 connectors</b> · pre-built · Workday, SF, Snowflake, +44</span>
                <span><b>6 agents</b> · production-ready · point and configure</span>
                <span><b>~1 week to first app</b> · vs 12+ weeks from scratch</span>
              </div>
            </div>

            {/* Three-layer architecture diagram */}
            <aside className="hero-art">
              <div className="art-tag">
                <span className="art-tag-dot pulse" />
                Live · governed data plane
              </div>

              <div className="stack">
                {/* Top layer — build surface */}
                <div className="stack-layer stack-layer-top">
                  <div className="stack-layer-head">
                    <span className="stack-pin">01</span>
                    <span className="stack-title">The build surface</span>
                    <span className="stack-meta">Claude Code · any AI coding tool</span>
                  </div>
                  <div className="stack-body">
                    <code className="chip-cmd">claude: build a slack /comp command on workday</code>
                    <code className="chip-cmd">claude: turn this into a daily ar follow-up agent</code>
                  </div>
                </div>

                <div className="stack-cnx" aria-hidden />

                {/* Middle layer — Assembly (prominent) */}
                <div className="stack-layer stack-layer-mid">
                  <div className="stack-layer-head">
                    <span className="stack-pin indigo">02</span>
                    <span className="stack-title light">Assembly · governed data plane + pre-built agents</span>
                  </div>
                  <div className="stack-body stack-body-mid">
                    <div className="agent-badge-row">
                      {agents.map((a) => (
                        <span key={a.id} className="agent-badge" title={a.name}>{a.code}</span>
                      ))}
                    </div>
                    <div className="conn-row">
                      {heroConnectors.map((name, i) => (
                        <span key={name} className="conn-chip">
                          <span className="conn-dot" />{name}
                          {i < heroConnectors.length - 1 && <span className="conn-sep">·</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="stack-cnx" aria-hidden />

                {/* Bottom — systems of record */}
                <div className="stack-layer stack-layer-bot">
                  <div className="stack-layer-head">
                    <span className="stack-pin">03</span>
                    <span className="stack-title">Your systems of record</span>
                    <span className="stack-meta">read-only · scoped credentials</span>
                  </div>
                  <div className="stack-body stack-body-tight">
                    {connectors.slice(0, 6).map((c) => (
                      <span key={c.id} className="sor-chip">{c.displayName}</span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ─────────────────────── SECTION 2 · THE SHIFT ─────────────────────── */}
        <section className="sec sec-shift">
          <div className="wrap">
            <span className="eyebrow"><span className="dot" />Why pre-built matters</span>
            <h2 className="sec-headline">Vibe-coding made building easy. <em className="indigo-em">Pre-built tooling</em> makes shipping fast.</h2>
            <p className="sec-body">
              An app you vibe-code in an afternoon still has to authenticate against your company SSO, read from your real systems of record, send notifications, store secrets, host reliably, route human-review gates, and pass IT&rsquo;s checklist. That&rsquo;s twelve weeks of plumbing per app &mdash; unless someone has already built it once and shares it. Assembly is that someone: forty-plus connectors, six production-ready agents, identity, audit, HITL, durable workflows, hosting &mdash; all already wired. Your team writes the ten percent unique to your business. The other ninety percent ships day one.
            </p>

            <div className="shift-grid">
              <div className="shift-card shift-card-muted">
                <span className="shift-tag">From scratch</span>
                <h3 className="shift-h">Build the app &mdash; <em>and</em> the plumbing</h3>
                <div className="shift-art shift-art-muted">
                  <span className="shift-word">SSO</span>
                  <span className="shift-word">connectors</span>
                  <span className="shift-word">audit</span>
                  <span className="shift-word">hosting</span>
                  <span className="shift-word">HITL</span>
                  <span className="shift-word">workflows</span>
                  <span className="shift-word">comms</span>
                  <span className="shift-word">secrets</span>
                </div>
                <p className="shift-cap"><b>~12 weeks</b> per app · most never make it past prototype</p>
              </div>

              <div className="shift-arrow" aria-hidden>
                <span className="shift-arrow-line" />
                <span className="shift-arrow-head">→</span>
              </div>

              <div className="shift-card shift-card-accent">
                <span className="shift-tag indigo">With Assembly</span>
                <h3 className="shift-h">Build the app &mdash; <em>the rest is pre-built</em></h3>
                <div className="shift-art shift-art-accent">
                  <span className="shift-glyph indigo">⌬</span>
                  <span className="shift-word strong">idea</span>
                  <span className="shift-word strong">business&nbsp;logic</span>
                  <span className="shift-word strong">ship</span>
                </div>
                <p className="shift-cap"><b>~1 week</b> per app · every app inherits the stack, day one</p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────── SECTION 3 · THE PROBLEM ───────────────────── */}
        <section className="sec sec-problem">
          <div className="wrap">
            <span className="eyebrow"><span className="dot warn" />The problem</span>
            <h2 className="sec-headline">Vibe coding alone doesn&rsquo;t work inside a real company</h2>

            <div className="prob-grid">
              <div className="prob-card">
                <span className="prob-num">i</span>
                <h3 className="prob-h">Apps built in a vacuum</h3>
                <p className="prob-b">A tool built in a sandbox can&rsquo;t safely touch your real customer, candidate, or financial data — so it never leaves the demo.</p>
              </div>
              <div className="prob-card">
                <span className="prob-num">ii</span>
                <h3 className="prob-h">No governance, no approval</h3>
                <p className="prob-b">No permissions, no audit trail, no compliance controls. IT can&rsquo;t sign off on it, so it never ships.</p>
              </div>
              <div className="prob-card">
                <span className="prob-num">iii</span>
                <h3 className="prob-h">Starting from zero, every time</h3>
                <p className="prob-b">Every app re-wires login, email, search, storage and security by hand. Most of the work isn&rsquo;t the app at all.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── SECTION 4 · WHAT ASSEMBLY DOES ─────────────── */}
        <section className="sec sec-what">
          <div className="wrap">
            <div className="sec-head-grid">
              <div>
                <span className="eyebrow"><span className="dot" />What Assembly does</span>
                <h2 className="sec-headline">We make your data the safe foundation — and hand you the building blocks</h2>
              </div>
              <p className="sec-body sec-body-right">
                Assembly connects your systems, structures and governs your data, and sets the permissions — so it is genuinely safe to build on. Then we hand your team a library of pre-built agents and tools, ready to point at that data. Your people build the apps; the hard, unsafe parts are already done.
              </p>
            </div>

            {/* Rich three-layer diagram */}
            <div className="big-stack">
              <div className="big-layer big-layer-top">
                <div className="big-layer-side">
                  <span className="big-layer-pin">01</span>
                  <span className="big-layer-name">The build surface</span>
                  <span className="big-layer-sub">Any AI coding tool</span>
                </div>
                <div className="big-layer-body">
                  <span className="bs-chip">Claude Code</span>
                  <span className="bs-chip">Cursor</span>
                  <span className="bs-chip">Replit</span>
                  <span className="bs-chip">Your favorite editor</span>
                  <span className="bs-note">— pointed at Assembly via MCP & scoped tokens —</span>
                </div>
              </div>

              <div className="big-cnx">
                <span className="big-cnx-label">scoped credentials · MCP</span>
              </div>

              <div className="big-layer big-layer-mid">
                <div className="big-layer-side big-layer-side-mid">
                  <span className="big-layer-pin indigo">02</span>
                  <span className="big-layer-name light">Assembly</span>
                  <span className="big-layer-sub light">Governed data plane + pre-built agents</span>
                </div>
                <div className="big-layer-body big-layer-body-mid">
                  <div className="big-row">
                    <span className="big-row-label">Pre-built agents</span>
                    <div className="big-row-items">
                      {agents.map((a) => (
                        <span key={a.id} className="big-agent">
                          <span className="big-agent-code">{a.code}</span>
                          <span className="big-agent-name">{a.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="big-row big-row-divider">
                    <span className="big-row-label">Governed plane</span>
                    <div className="big-row-items">
                      <span className="big-tile">Unified data model</span>
                      <span className="big-tile">Permissions</span>
                      <span className="big-tile">Search</span>
                      <span className="big-tile">PII masking</span>
                      <span className="big-tile">Audit log</span>
                      <span className="big-tile">Workspace</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="big-cnx">
                <span className="big-cnx-label">read-only · scoped · audited</span>
              </div>

              <div className="big-layer big-layer-bot">
                <div className="big-layer-side">
                  <span className="big-layer-pin">03</span>
                  <span className="big-layer-name">Your systems of record</span>
                  <span className="big-layer-sub">Stay where they are</span>
                </div>
                <div className="big-layer-body">
                  {connectors.map((c) => (
                    <span key={c.id} className="sor-chip">{c.displayName}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── SECTION 5 · HOW IT WORKS (centerpiece) ───────────────── */}
        <section className="sec sec-how" id="how-it-works">
          <div className="wrap">
            <span className="eyebrow"><span className="dot" />How it works</span>
            <h2 className="sec-headline">From idea to a production app your business can trust</h2>
            <p className="sec-body">
              Every app follows the same path. Your team builds the part that&rsquo;s unique to you — Assembly handles the data, the finishing, and the gate to production.
            </p>

            <ol className="life">
              {lifecycleSteps.map((s, i) => (
                <li key={s.num} className={`life-step ${s.highlight ? "life-step-hl" : ""}`}>
                  <div className="life-rail">
                    <div className={`life-num ${s.highlight ? "life-num-hl" : ""}`}>
                      {s.highlight ? (
                        <svg className="life-shield" viewBox="0 0 24 24" aria-hidden>
                          <path
                            d="M12 2.5l8 3v6.2c0 4.6-3.2 8.5-8 9.8-4.8-1.3-8-5.2-8-9.8V5.5l8-3z"
                            fill="currentColor"
                            opacity="0.18"
                          />
                          <path
                            d="M12 2.5l8 3v6.2c0 4.6-3.2 8.5-8 9.8-4.8-1.3-8-5.2-8-9.8V5.5l8-3z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.5 12.2l2.4 2.4 4.6-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <span>{s.num}</span>
                      )}
                    </div>
                    {i < lifecycleSteps.length - 1 && <span className={`life-line ${s.highlight ? "life-line-hl" : ""}`} />}
                  </div>
                  <div className="life-body">
                    <div className="life-head">
                      <span className="life-step-tag">step {s.num}</span>
                      <h3 className="life-title">{s.title}</h3>
                    </div>
                    <p className="life-actor">{s.actor}</p>
                    <p className="life-copy">{s.body}</p>
                    <div className="life-artifact">
                      <span className="life-artifact-dot" />
                      <code>{s.artifact}</code>
                    </div>
                    {s.highlight && (
                      <div className="life-checklist">
                        <span className="life-check life-check-pass">✓ Permissions tested</span>
                        <span className="life-check life-check-pass">✓ PII reviewed</span>
                        <span className="life-check life-check-pass">✓ Security scan clean</span>
                        <span className="life-check life-check-pass">✓ App owner assigned</span>
                        <span className="life-check life-check-pass">✓ Environment confirmed</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <p className="life-close">
              <em>The same path every time — and the approval gate is why an app built this way is something IT can actually sign off on.</em>
            </p>
          </div>
        </section>

        {/* ─────────────── SECTION 5b · PRE-BUILT AGENTS ─────────────── */}
        <section className="sec sec-agents" id="agents">
          <div className="wrap">
            <span className="eyebrow"><span className="dot" />Pre-built and ready</span>
            <h2 className="sec-headline">You don&rsquo;t start from a blank platform — you start from working agents</h2>
            <p className="sec-body">
              Every Assembly account comes with a library of pre-built, production-ready agents and tools. You don&rsquo;t build the plumbing — you point each one at your governed data, set your rules, and switch it on.
            </p>

            <div className="agent-grid">
              {agents.map((a) => (
                <article key={a.id} className="agent-card lift">
                  <div className="agent-card-top">
                    <span className="agent-ready">
                      <span className="agent-ready-dot" />
                      Ready to configure
                    </span>
                    <span className="agent-code">{a.code}</span>
                  </div>
                  <h3 className="agent-name">{a.name}</h3>
                  <p className="agent-desc">{a.description}</p>
                  <div className="agent-eg">
                    <span className="agent-eg-lbl">e.g.</span>
                    <span className="agent-eg-body">{a.examples}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────── SECTION 6 · THREE WAYS TO BUILD ─────────────── */}
        <section className="sec sec-ways" id="ways-to-build">
          <div className="wrap">
            <span className="eyebrow"><span className="dot" />How you build</span>
            <h2 className="sec-headline">Three ways to get there — pick the one that fits your team</h2>

            <div className="ways-grid">
              {waysToBuild.map((w) => (
                <article key={w.label} className={`way-card lift ${w.featured ? "way-card-featured" : ""}`}>
                  {w.featured && <span className="way-flag">Most common for SMBs</span>}
                  <span className="way-tag">{w.tag}</span>
                  <h3 className="way-h">{w.label}</h3>
                  <p className="way-b">{w.body}</p>
                  <span className="way-foot">
                    {w.featured ? "→ Hire a Partner" : w.label.startsWith("AI-native") ? "→ Talk to delivery" : "→ Onboard your builder"}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────── SECTION 7 · ASSEMBLY PARTNERS ─────────────── */}
        <section className="sec sec-partners" id="partners">
          <div className="wrap">
            <div className="sec-head-grid">
              <div>
                <span className="eyebrow"><span className="dot" />Assembly Partners</span>
                <h2 className="sec-headline">No one to build it? Hire someone who already knows the platform</h2>
              </div>
              <p className="sec-body sec-body-right">
                Assembly Partners are certified Forward-Deployed Engineers. A Partner embeds with your team, sets up your data plane, configures the pre-built agents, and ships your first apps — then hands them over with your team trained to keep going. It is how a smaller company gets AI-enabled without hiring an engineer.
              </p>
            </div>

            <div className="partner-grid">
              {partnerPoints.map((p) => (
                <div key={p.title} className="partner-card lift">
                  <h3 className="partner-h">{p.title}</h3>
                  <p className="partner-b">{p.body}</p>
                </div>
              ))}
            </div>

            <div className="cta-row partner-cta">
              <Link href="#cta" className="btn btn-primary">Find an Assembly Partner <span className="arr">→</span></Link>
              <Link href="#cta" className="btn btn-secondary">Become an Assembly Partner</Link>
            </div>
          </div>
        </section>

        {/* ─────────────── SECTION 8 · THE PLATFORM ─────────────── */}
        <section className="sec sec-platform" id="platform">
          <div className="wrap">
            <span className="eyebrow"><span className="dot" />The platform</span>
            <h2 className="sec-headline">Everything your apps need — governed, and included</h2>
            <p className="sec-body">
              Under every Assembly app is a governed data plane: your connected systems, a unified data model, search, permissions, the agent library, and the workspace where apps are built and run. The parts that normally take weeks to wire up are already there.
            </p>

            <div className="plat-grid">
              {platformGroups.map((g) => (
                <div key={g.label} className="plat-card">
                  <div className="plat-head">
                    <span className="plat-dot" />
                    <h3 className="plat-h">{g.label}</h3>
                  </div>
                  <ul className="plat-list">
                    {g.items.map((it) => (
                      <li key={it}><span className="plat-tick">✓</span>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Link href="/app" className="plat-link">
              See the full platform <span className="arr">→</span>
            </Link>
          </div>
        </section>

        {/* ─────────────── SECTION 9 · VS VIBE-CODING TOOL ─────────────── */}
        <section className="sec sec-vs">
          <div className="wrap">
            <span className="eyebrow"><span className="dot" />Assembly vs. a vibe-coding tool</span>
            <h2 className="sec-headline">Tools like Replit build apps in a sandbox. Assembly makes your data safe to build on.</h2>
            <p className="sec-body">
              A standalone vibe-coding tool is genuinely great at producing an app — in a vacuum. It has no governed access to your real data, no permissions, no audit, and it hands you a blank canvas. Assembly is the layer that makes the apps your team builds something the business can actually run and IT can actually approve.
            </p>

            <div className="vs-table">
              <div className="vs-row vs-row-head">
                <span className="vs-dim">Dimension</span>
                <span className="vs-vibe">Standalone vibe-coding tool</span>
                <span className="vs-asm">Assembly</span>
              </div>
              {comparisonRows.map((r) => (
                <div key={r.dimension} className="vs-row">
                  <span className="vs-dim">{r.dimension}</span>
                  <span className={`vs-cell ${r.vibeGood ? "vs-good" : "vs-bad"}`}>
                    <span className="vs-mark">{r.vibeGood ? "✓" : "✕"}</span>
                    <span>{r.vibe}</span>
                  </span>
                  <span className={`vs-cell ${r.assemblyGood ? "vs-good" : "vs-bad"}`}>
                    <span className="vs-mark">{r.assemblyGood ? "✓" : "✕"}</span>
                    <span>{r.assembly}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────── SECTION 10 · SPEED / PROOF / PRICING / CTA ─────────────── */}
        <section className="sec sec-speed" id="cta">
          <div className="wrap">
            {/* Speed block */}
            <span className="eyebrow"><span className="dot" />Speed</span>
            <h2 className="sec-headline">It comes down to how fast your teams ship.</h2>

            <div className="speed-grid">
              <div className="speed-card speed-card-before">
                <span className="speed-tag">Before Assembly</span>
                <div className="speed-bar speed-bar-before">
                  <div className="speed-bar-fill" style={{ width: "92%" }} />
                  <span className="speed-bar-label">~6 months · scoped, sliced, prioritized</span>
                </div>
                <ul className="speed-list">
                  <li>Engineering ticket queue</li>
                  <li>Procurement + vendor selection</li>
                  <li>Custom integration build</li>
                  <li>Approval at every stage</li>
                </ul>
              </div>
              <div className="speed-arrow" aria-hidden>→</div>
              <div className="speed-card speed-card-after">
                <span className="speed-tag indigo">With Assembly</span>
                <div className="speed-bar speed-bar-after">
                  <div className="speed-bar-fill" style={{ width: "16%" }} />
                  <span className="speed-bar-label">~1 week · scoped → built → approved → live</span>
                </div>
                <ul className="speed-list">
                  <li>Governed data already wired</li>
                  <li>Six agents ready to point</li>
                  <li>Builder ships from Claude Code</li>
                  <li>One admin sign-off and it&rsquo;s live</li>
                </ul>
              </div>
            </div>
            <p className="speed-close"><em>Weeks → about a week · one useful app a quarter becomes one a week.</em></p>

            {/* Proof block */}
            <div className="proof-block">
              <span className="eyebrow"><span className="dot" />Proof</span>
              <h2 className="sec-headline">Teams already building on Assembly.</h2>

              <div className="proof-grid">
                {proofCases.map((c) => (
                  <article key={c.codename} className="proof-card lift">
                    <div className="proof-spine">
                      <span className="proof-code">{c.codename}</span>
                      <span className="proof-meta">{c.industry}</span>
                    </div>
                    <p className="proof-outcome">{c.outcome}</p>
                    <blockquote className="proof-quote">
                      <span className="proof-quote-mark">&ldquo;</span>
                      {c.quote}
                    </blockquote>
                    <span className="proof-quoter">— {c.quoter}</span>
                  </article>
                ))}
              </div>
            </div>

            {/* Pricing teaser */}
            <div className="price-block">
              <span className="eyebrow"><span className="dot" />Pricing</span>
              <h2 className="sec-headline">Pricing built for departments and SMBs, not enterprise procurement.</h2>
              <p className="sec-body">
                A one-time setup, a flat monthly subscription, and optional production work. No per-app fees, no lock-in. Exact pricing is shared in a short scoping call.
              </p>

              <div className="price-grid">
                <div className="price-tile">
                  <span className="price-tile-lbl">One-time</span>
                  <span className="price-tile-h">Data-readiness + setup</span>
                  <span className="price-tile-b">Connect your systems · structure entities · permissions · agent library configured</span>
                </div>
                <div className="price-tile">
                  <span className="price-tile-lbl">Monthly</span>
                  <span className="price-tile-h">Flat subscription</span>
                  <span className="price-tile-b">Platform, agents, hosting, monitoring, support · no per-app fees</span>
                </div>
                <div className="price-tile">
                  <span className="price-tile-lbl">Optional</span>
                  <span className="price-tile-h">Productionization</span>
                  <span className="price-tile-b">Assembly engineers harden specific apps on a ticket basis · billed as used</span>
                </div>
              </div>

              <div className="cta-row price-cta">
                <Link href="/app" className="btn btn-primary">Get a data-readiness assessment <span className="arr">→</span></Link>
              </div>
            </div>

            {/* Closing CTA band */}
            <div className="close-band">
              <div className="close-band-inner">
                <h2 className="close-h">Give your team a safe way to build with AI.</h2>
                <div className="cta-row close-cta">
                  <Link href="/app" className="btn btn-primary close-btn">Get a data-readiness assessment <span className="arr">→</span></Link>
                </div>
                <p className="close-reassure">
                  <em>No lock-in. Your data stays in your environment, and you can leave any time with everything.</em>
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <MarketingFooter />

      <style>{`
        /* ─────────── shared section primitives ─────────── */
        .sec {
          padding: 100px 0;
          position: relative;
        }
        .sec:not(:last-child) {
          border-bottom: 1px solid var(--color-ink-100);
        }
        .sec-headline {
          margin-top: 18px;
          max-width: 880px;
        }
        .sec-body {
          margin-top: 22px;
          max-width: 760px;
          font-size: clamp(16px, 1.15vw, 18px);
          color: var(--color-ink-500);
          line-height: 1.6;
        }
        .sec-body-right { margin-top: 0; }
        .sec-head-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
          gap: 56px;
          align-items: end;
        }
        @media (max-width: 960px) { .sec-head-grid { grid-template-columns: 1fr; gap: 24px; } }

        .eyebrow .dot.warn { background: var(--color-warn-fg); }

        /* ─────────── HERO ─────────── */
        .hero {
          padding: 84px 0 96px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(900px 540px at 85% -10%, var(--color-indigo-50) 0%, transparent 60%),
            radial-gradient(700px 420px at -5% 30%, var(--color-lavender-50) 0%, transparent 55%);
        }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
          gap: 56px;
          align-items: start;
          padding-top: 16px;
        }
        @media (max-width: 1080px) { .hero-grid { grid-template-columns: 1fr; gap: 48px; } }

        .hero h1 { margin-top: 22px; }
        .hero h1 em {
          font-style: normal;
          color: var(--color-indigo-600);
        }
        .hero .lede {
          margin-top: 24px;
          font-size: clamp(16.5px, 1.3vw, 19px);
          color: var(--color-ink-500);
          max-width: 580px;
          line-height: 1.55;
        }
        .cta-row { margin-top: 32px; display: flex; gap: 12px; flex-wrap: wrap; }
        .meta-row {
          margin-top: 40px;
          display: flex;
          gap: 26px;
          flex-wrap: wrap;
          color: var(--color-ink-500);
          font-size: 12.5px;
          font-family: var(--font-mono);
        }
        .meta-row b { color: var(--color-ink-950); font-weight: 600; font-family: var(--font-display); font-size: 13px; }

        .hero-art { display: flex; flex-direction: column; gap: 10px; }
        .art-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .art-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-sage-fg);
          box-shadow: 0 0 0 3px rgba(47, 107, 64, 0.15);
        }
        .art-tag-dot.pulse { animation: pulse 1.8s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(47, 107, 64, 0.15); }
          50%      { box-shadow: 0 0 0 6px rgba(47, 107, 64, 0.05); }
        }

        /* ─ 3-layer stack (hero) ─ */
        .stack {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .stack-layer {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          box-shadow: var(--shadow-card);
        }
        .stack-layer-mid {
          background:
            linear-gradient(180deg, var(--color-indigo-700) 0%, var(--color-indigo-600) 100%);
          border-color: var(--color-indigo-700);
          color: #fff;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            0 18px 40px -22px rgba(79, 70, 229, 0.55),
            var(--shadow-card);
        }
        .stack-layer-head {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap;
        }
        .stack-pin {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--color-ink-500);
          padding: 3px 8px;
          background: var(--color-ink-50);
          border-radius: 4px;
          border: 1px solid var(--color-ink-100);
        }
        .stack-pin.indigo {
          color: #fff;
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.22);
        }
        .stack-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14.5px;
          color: var(--color-ink-950);
        }
        .stack-title.light { color: #fff; }
        .stack-meta {
          margin-left: auto;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-400);
        }
        .stack-body {
          margin-top: 12px;
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .stack-body-mid { gap: 12px; flex-direction: column; }
        .stack-body-tight { gap: 6px; }
        .chip-cmd {
          font-family: var(--font-mono);
          font-size: 11.5px;
          background: var(--color-ink-50);
          color: var(--color-ink-700);
          border: 1px solid var(--color-ink-100);
          padding: 6px 10px;
          border-radius: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        .agent-badge-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .agent-badge {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--color-indigo-700);
          background: #fff;
          padding: 5px 9px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.65);
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
        }
        .conn-row {
          display: flex; flex-wrap: wrap; gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(255,255,255,0.85);
        }
        .conn-chip { display: inline-flex; align-items: center; gap: 6px; }
        .conn-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--color-sage-bg);
          box-shadow: 0 0 0 2px rgba(214, 235, 219, 0.18);
        }
        .conn-sep { margin-left: 6px; opacity: 0.45; }
        .sor-chip {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-700);
          background: var(--color-ink-50);
          padding: 5px 10px;
          border-radius: 6px;
          border: 1px solid var(--color-ink-100);
        }
        .stack-cnx {
          width: 1px;
          height: 22px;
          background: linear-gradient(180deg, var(--color-ink-200) 0%, var(--color-ink-300) 100%);
          margin: 0 auto;
        }

        /* ─────────── SECTION 2 · THE SHIFT ─────────── */
        .sec-shift { background: #fff; }
        .shift-grid {
          margin-top: 56px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 56px minmax(0, 1fr);
          gap: 0;
          align-items: stretch;
        }
        @media (max-width: 880px) {
          .shift-grid { grid-template-columns: 1fr; gap: 16px; }
          .shift-arrow { display: none; }
        }
        .shift-card {
          padding: 28px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-ink-200);
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .shift-card-muted { background: var(--color-ink-50); border-color: var(--color-ink-200); }
        .shift-card-accent {
          background: linear-gradient(180deg, #fff 0%, var(--color-indigo-50) 100%);
          border-color: var(--color-indigo-200);
          box-shadow: 0 18px 40px -22px rgba(79, 70, 229, 0.25);
        }
        .shift-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          align-self: flex-start;
        }
        .shift-tag.indigo { color: var(--color-indigo-700); }
        .shift-h { font-size: 22px; }
        .shift-art {
          margin-top: 8px;
          display: flex; align-items: center; gap: 18px;
          padding: 22px 18px;
          border-radius: var(--radius-md);
          border: 1px dashed var(--color-ink-200);
          flex-wrap: wrap;
        }
        .shift-art-muted { background: #fff; }
        .shift-art-accent { background: #fff; border-color: var(--color-indigo-200); }
        .shift-glyph {
          font-family: var(--font-mono);
          font-size: 38px;
          font-weight: 600;
          color: var(--color-ink-400);
          line-height: 1;
        }
        .shift-glyph.indigo { color: var(--color-indigo-600); }
        .shift-word {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-500);
          letter-spacing: 0.02em;
        }
        .shift-word.strong { color: var(--color-ink-950); font-weight: 600; }
        .shift-cap {
          color: var(--color-ink-500);
          font-size: 14.5px;
          line-height: 1.55;
        }
        .shift-arrow {
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .shift-arrow-line {
          height: 1px; width: 70%;
          background: linear-gradient(90deg, var(--color-ink-200) 0%, var(--color-indigo-400) 100%);
        }
        .shift-arrow-head {
          position: absolute;
          right: 8px;
          color: var(--color-indigo-600);
          font-size: 22px;
          line-height: 1;
        }

        /* ─────────── SECTION 3 · PROBLEM ─────────── */
        .sec-problem { background: var(--color-ink-50); }
        .prob-grid {
          margin-top: 52px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 880px) { .prob-grid { grid-template-columns: 1fr; } }
        .prob-card {
          padding: 28px;
          border-radius: var(--radius-lg);
          background: var(--color-warn-bg);
          border: 1px solid rgba(155, 44, 36, 0.18);
          display: flex; flex-direction: column; gap: 14px;
        }
        .prob-num {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--color-warn-fg);
          background: rgba(255,255,255,0.55);
          padding: 4px 9px;
          border-radius: 4px;
          align-self: flex-start;
          text-transform: uppercase;
        }
        .prob-h { color: var(--color-warn-fg); font-size: 19px; }
        .prob-b { color: var(--color-ink-700); font-size: 14.5px; line-height: 1.55; }

        /* ─────────── SECTION 4 · WHAT ASSEMBLY DOES ─────────── */
        .sec-what { background: #fff; }
        .big-stack {
          margin-top: 64px;
          display: flex;
          flex-direction: column;
        }
        .big-layer {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          display: grid;
          grid-template-columns: 220px 1fr;
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }
        @media (max-width: 880px) { .big-layer { grid-template-columns: 1fr; } }
        .big-layer-side {
          padding: 22px 22px;
          border-right: 1px solid var(--color-ink-100);
          background: var(--color-ink-50);
          display: flex; flex-direction: column; gap: 4px; justify-content: center;
        }
        .big-layer-mid {
          background: linear-gradient(180deg, var(--color-indigo-700) 0%, var(--color-indigo-600) 100%);
          border-color: var(--color-indigo-700);
          color: #fff;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            0 24px 56px -26px rgba(79, 70, 229, 0.55),
            var(--shadow-card);
        }
        .big-layer-side-mid {
          background: rgba(255,255,255,0.06);
          border-right: 1px solid rgba(255,255,255,0.18);
        }
        .big-layer-pin {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          color: var(--color-ink-500);
          padding: 3px 8px;
          background: #fff;
          border-radius: 4px;
          border: 1px solid var(--color-ink-100);
          align-self: flex-start;
        }
        .big-layer-pin.indigo {
          color: #fff;
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.28);
        }
        .big-layer-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 17px;
          color: var(--color-ink-950);
          margin-top: 6px;
        }
        .big-layer-name.light { color: #fff; }
        .big-layer-sub {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.02em;
        }
        .big-layer-sub.light { color: rgba(255,255,255,0.78); }
        .big-layer-body {
          padding: 22px 24px;
          display: flex; flex-wrap: wrap; gap: 8px;
          align-items: center;
        }
        .big-layer-body-mid {
          flex-direction: column;
          align-items: stretch;
          gap: 0;
          padding: 0;
        }
        .bs-chip {
          font-family: var(--font-mono);
          font-size: 12px;
          background: var(--color-ink-50);
          color: var(--color-ink-700);
          padding: 6px 11px;
          border-radius: 6px;
          border: 1px solid var(--color-ink-100);
        }
        .bs-note {
          margin-left: auto;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-400);
        }
        .big-cnx {
          width: 1px;
          height: 36px;
          background: linear-gradient(180deg, var(--color-ink-200) 0%, var(--color-ink-300) 100%);
          margin: 0 auto;
          position: relative;
        }
        .big-cnx-label {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-400);
          letter-spacing: 0.06em;
          white-space: nowrap;
        }
        .big-row {
          padding: 18px 24px;
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 18px;
          align-items: center;
        }
        @media (max-width: 720px) {
          .big-row { grid-template-columns: 1fr; gap: 10px; }
        }
        .big-row-divider { border-top: 1px solid rgba(255,255,255,0.14); }
        .big-row-label {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
        }
        .big-row-items { display: flex; flex-wrap: wrap; gap: 8px; }
        .big-agent {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 6px;
          padding: 5px 10px 5px 6px;
        }
        .big-agent-code {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          background: #fff;
          color: var(--color-indigo-700);
          padding: 3px 6px;
          border-radius: 4px;
        }
        .big-agent-name {
          font-size: 12px;
          color: #fff;
        }
        .big-tile {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: #fff;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 5px 10px;
          border-radius: 6px;
        }

        /* ─────────── SECTION 5 · HOW IT WORKS ─────────── */
        .sec-how {
          background: var(--color-ink-50);
        }
        .life {
          margin: 56px 0 0;
          padding: 0;
          list-style: none;
          display: flex; flex-direction: column;
        }
        .life-step {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 28px;
          padding-bottom: 36px;
          position: relative;
        }
        .life-rail {
          display: flex; flex-direction: column; align-items: center;
          position: relative;
        }
        .life-num {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: 14px;
          color: var(--color-ink-700);
          letter-spacing: 0.05em;
          flex-shrink: 0;
          box-shadow: 0 1px 0 rgba(15,17,42,0.04);
        }
        .life-num-hl {
          background: var(--color-indigo-600);
          color: #fff;
          border-color: var(--color-indigo-700);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            0 12px 30px -14px rgba(79, 70, 229, 0.55);
        }
        .life-shield { width: 26px; height: 26px; color: #fff; }
        .life-line {
          flex: 1;
          width: 1px;
          background: linear-gradient(180deg, var(--color-ink-200) 0%, var(--color-ink-200) 100%);
          margin-top: 8px;
          min-height: 40px;
        }
        .life-line-hl {
          background: linear-gradient(180deg, var(--color-indigo-400) 0%, var(--color-ink-200) 100%);
        }
        .life-body {
          background: #fff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-ink-200);
          padding: 22px 24px;
          box-shadow: var(--shadow-card);
        }
        .life-step-hl .life-body {
          border-color: var(--color-indigo-300);
          background: linear-gradient(180deg, #fff 0%, var(--color-indigo-50) 100%);
          box-shadow:
            0 18px 40px -22px rgba(79, 70, 229, 0.35),
            var(--shadow-card);
        }
        .life-head { display: flex; align-items: baseline; gap: 12px; }
        .life-step-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-400);
        }
        .life-step-hl .life-step-tag { color: var(--color-indigo-700); }
        .life-title { font-size: 21px; }
        .life-actor {
          margin-top: 6px;
          font-style: italic;
          color: var(--color-ink-500);
          font-size: 14px;
        }
        .life-copy {
          margin-top: 10px;
          color: var(--color-ink-700);
          font-size: 15px;
          line-height: 1.55;
          max-width: 680px;
        }
        .life-artifact {
          margin-top: 16px;
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          padding: 5px 10px;
          border-radius: 6px;
        }
        .life-step-hl .life-artifact {
          background: #fff;
          border-color: var(--color-indigo-200);
          color: var(--color-indigo-700);
        }
        .life-artifact-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--color-sage-fg);
        }
        .life-artifact code { background: transparent; padding: 0; color: inherit; }
        .life-checklist {
          margin-top: 14px;
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .life-check {
          font-family: var(--font-mono);
          font-size: 11.5px;
          padding: 4px 9px;
          border-radius: 4px;
          background: var(--color-sage-bg);
          color: var(--color-sage-fg);
        }
        .life-close {
          margin-top: 24px;
          max-width: 760px;
          color: var(--color-ink-500);
          font-size: 15.5px;
          line-height: 1.55;
        }
        .life-close em { font-style: italic; }

        /* ─────────── SECTION 5b · AGENTS ─────────── */
        .sec-agents { background: #fff; }
        .agent-grid {
          margin-top: 56px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 980px) { .agent-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 680px) { .agent-grid { grid-template-columns: 1fr; } }
        .agent-card {
          padding: 22px;
          border-radius: var(--radius-lg);
          background: #fff;
          border: 1px solid var(--color-ink-200);
          display: flex; flex-direction: column; gap: 12px;
        }
        .agent-card-top {
          display: flex; justify-content: space-between; align-items: center;
        }
        .agent-ready {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-sage-fg);
          background: var(--color-sage-bg);
          padding: 4px 9px;
          border-radius: 999px;
        }
        .agent-ready-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--color-sage-fg);
        }
        .agent-code {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-indigo-700);
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-200);
          padding: 4px 8px;
          border-radius: 4px;
        }
        .agent-name { font-size: 18px; }
        .agent-desc { color: var(--color-ink-700); font-size: 14px; line-height: 1.55; }
        .agent-eg {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px dashed var(--color-ink-200);
          display: flex;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
        }
        .agent-eg-lbl { color: var(--color-ink-400); flex-shrink: 0; }
        .agent-eg-body { line-height: 1.5; }

        /* ─────────── SECTION 6 · THREE WAYS ─────────── */
        .sec-ways { background: var(--color-ink-50); }
        .ways-grid {
          margin-top: 56px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: stretch;
        }
        @media (max-width: 920px) { .ways-grid { grid-template-columns: 1fr; } }
        .way-card {
          padding: 28px;
          border-radius: var(--radius-lg);
          background: #fff;
          border: 1px solid var(--color-ink-200);
          display: flex; flex-direction: column; gap: 14px;
          position: relative;
        }
        .way-card-featured {
          border-color: var(--color-indigo-600);
          box-shadow: 0 24px 56px -26px rgba(79, 70, 229, 0.4), var(--shadow-card);
        }
        .way-flag {
          position: absolute;
          top: -12px; left: 24px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: var(--color-indigo-600);
          color: #fff;
          padding: 4px 10px;
          border-radius: 999px;
          box-shadow: 0 6px 14px -6px rgba(79, 70, 229, 0.6);
        }
        .way-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .way-card-featured .way-tag { color: var(--color-indigo-700); }
        .way-h { font-size: 20px; }
        .way-b { color: var(--color-ink-700); font-size: 14.5px; line-height: 1.55; }
        .way-foot {
          margin-top: auto;
          padding-top: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-500);
        }
        .way-card-featured .way-foot { color: var(--color-indigo-700); }

        /* ─────────── SECTION 7 · PARTNERS ─────────── */
        .sec-partners { background: #fff; }
        .partner-grid {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 880px) { .partner-grid { grid-template-columns: 1fr; } }
        .partner-card {
          padding: 24px;
          border-radius: var(--radius-lg);
          background: var(--color-lavender-50);
          border: 1px solid var(--color-lavender-200);
        }
        .partner-h { font-size: 17px; }
        .partner-b { margin-top: 10px; color: var(--color-ink-700); font-size: 14px; line-height: 1.55; }
        .partner-cta { margin-top: 36px; }

        /* ─────────── SECTION 8 · PLATFORM ─────────── */
        .sec-platform { background: var(--color-ink-50); }
        .plat-grid {
          margin-top: 56px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }
        @media (max-width: 1100px) { .plat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 720px)  { .plat-grid { grid-template-columns: 1fr; } }
        .plat-card {
          padding: 22px;
          border-radius: var(--radius-lg);
          background: #fff;
          border: 1px solid var(--color-ink-200);
          display: flex; flex-direction: column; gap: 14px;
        }
        .plat-head { display: flex; align-items: center; gap: 8px; }
        .plat-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--color-indigo-600);
        }
        .plat-h { font-size: 15.5px; line-height: 1.2; }
        .plat-list {
          margin: 0; padding: 0;
          list-style: none;
          display: flex; flex-direction: column; gap: 8px;
        }
        .plat-list li {
          font-size: 13.5px;
          color: var(--color-ink-700);
          display: flex; align-items: baseline; gap: 8px;
        }
        .plat-tick {
          color: var(--color-sage-fg);
          font-weight: 700;
          font-size: 12px;
        }
        .plat-link {
          margin-top: 28px;
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--color-indigo-600);
          font-family: var(--font-mono);
          font-size: 13px;
        }
        .plat-link:hover { text-decoration: underline; }

        /* ─────────── SECTION 9 · VS ─────────── */
        .sec-vs { background: #fff; }
        .vs-table {
          margin-top: 48px;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #fff;
        }
        .vs-row {
          display: grid;
          grid-template-columns: 220px 1fr 1fr;
          gap: 0;
          border-bottom: 1px solid var(--color-ink-100);
        }
        @media (max-width: 880px) {
          .vs-row { grid-template-columns: 1fr; }
          .vs-row-head { display: none; }
          .vs-row .vs-dim {
            background: var(--color-ink-50);
            font-weight: 600;
            color: var(--color-ink-950);
          }
        }
        .vs-row:last-child { border-bottom: 0; }
        .vs-row-head {
          background: var(--color-ink-50);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .vs-dim {
          padding: 16px 20px;
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--color-ink-950);
          font-size: 14px;
          border-right: 1px solid var(--color-ink-100);
          display: flex; align-items: center;
        }
        .vs-row-head .vs-dim { font-family: var(--font-mono); font-weight: 500; color: var(--color-ink-500); font-size: 11px; }
        .vs-vibe, .vs-asm {
          padding: 16px 20px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .vs-vibe { border-right: 1px solid var(--color-ink-100); }
        .vs-cell {
          padding: 16px 20px;
          display: flex; gap: 10px;
          font-size: 13.5px;
          line-height: 1.5;
          border-right: 1px solid var(--color-ink-100);
        }
        .vs-cell:last-child { border-right: 0; }
        .vs-mark {
          flex-shrink: 0;
          width: 22px; height: 22px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
          font-size: 12px;
        }
        .vs-good { color: var(--color-ink-700); }
        .vs-good .vs-mark { background: var(--color-sage-bg); color: var(--color-sage-fg); }
        .vs-bad { color: var(--color-ink-500); }
        .vs-bad .vs-mark { background: var(--color-warn-bg); color: var(--color-warn-fg); }

        /* ─────────── SECTION 10 · SPEED + PROOF + PRICING + CLOSE ─────────── */
        .sec-speed { background: var(--color-ink-50); }
        .speed-grid {
          margin-top: 48px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 56px minmax(0, 1fr);
          align-items: stretch;
          gap: 0;
        }
        @media (max-width: 920px) {
          .speed-grid { grid-template-columns: 1fr; gap: 16px; }
          .speed-arrow { display: none; }
        }
        .speed-card {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .speed-card-after {
          border-color: var(--color-indigo-300);
          background: linear-gradient(180deg, #fff 0%, var(--color-indigo-50) 100%);
        }
        .speed-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .speed-tag.indigo { color: var(--color-indigo-700); }
        .speed-bar {
          position: relative;
          height: 36px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 6px;
          overflow: hidden;
        }
        .speed-bar-after { background: #fff; border-color: var(--color-indigo-200); }
        .speed-bar-fill {
          position: absolute; top: 0; left: 0;
          height: 100%;
          background: linear-gradient(90deg, var(--color-ink-300) 0%, var(--color-ink-400) 100%);
        }
        .speed-bar-after .speed-bar-fill {
          background: linear-gradient(90deg, var(--color-indigo-500) 0%, var(--color-indigo-600) 100%);
        }
        .speed-bar-label {
          position: absolute;
          top: 50%; left: 12px;
          transform: translateY(-50%);
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-700);
          letter-spacing: 0.02em;
        }
        .speed-bar-after .speed-bar-label { color: var(--color-indigo-800); }
        .speed-list {
          margin: 0; padding-left: 18px;
          color: var(--color-ink-700);
          font-size: 14px;
          line-height: 1.7;
        }
        .speed-arrow {
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
          color: var(--color-indigo-600);
        }
        .speed-close {
          margin-top: 24px;
          color: var(--color-ink-500);
          font-size: 15px;
        }

        .proof-block {
          margin-top: 96px;
          padding-top: 56px;
          border-top: 1px solid var(--color-ink-200);
        }
        .proof-grid {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 980px) { .proof-grid { grid-template-columns: 1fr; } }
        .proof-card {
          padding: 0;
          border-radius: var(--radius-lg);
          background: #fff;
          border: 1px solid var(--color-ink-200);
          overflow: hidden;
          display: flex; flex-direction: column;
        }
        .proof-spine {
          padding: 14px 22px;
          background: var(--color-ink-950);
          color: #fff;
          display: flex; flex-direction: column; gap: 4px;
        }
        .proof-code {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: #fff;
        }
        .proof-meta {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--color-ink-300);
        }
        .proof-outcome {
          padding: 22px;
          font-size: 16px;
          color: var(--color-ink-950);
          line-height: 1.45;
          font-family: var(--font-display);
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .proof-quote {
          margin: 0;
          padding: 0 22px;
          color: var(--color-ink-700);
          font-size: 14px;
          line-height: 1.6;
          position: relative;
        }
        .proof-quote-mark {
          color: var(--color-indigo-600);
          font-family: var(--font-display);
          font-size: 28px;
          line-height: 0;
          margin-right: 2px;
          vertical-align: -6px;
        }
        .proof-quoter {
          padding: 14px 22px 22px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
        }

        .price-block {
          margin-top: 96px;
          padding-top: 56px;
          border-top: 1px solid var(--color-ink-200);
        }
        .price-grid {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 880px) { .price-grid { grid-template-columns: 1fr; } }
        .price-tile {
          padding: 24px;
          border-radius: var(--radius-lg);
          background: #fff;
          border: 1px solid var(--color-ink-200);
          display: flex; flex-direction: column; gap: 10px;
        }
        .price-tile-lbl {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-indigo-700);
        }
        .price-tile-h {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          color: var(--color-ink-950);
        }
        .price-tile-b { color: var(--color-ink-500); font-size: 13.5px; line-height: 1.55; }
        .price-cta { margin-top: 32px; }

        .close-band {
          margin-top: 96px;
          border-radius: var(--radius-xl);
          background:
            radial-gradient(700px 320px at 80% -10%, rgba(255,255,255,0.18) 0%, transparent 60%),
            linear-gradient(180deg, var(--color-indigo-700) 0%, var(--color-indigo-600) 100%);
          color: #fff;
          padding: 64px 48px;
          box-shadow: 0 24px 56px -22px rgba(79, 70, 229, 0.5);
        }
        @media (max-width: 720px) { .close-band { padding: 44px 28px; } }
        .close-band-inner {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 18px;
        }
        .close-h {
          color: #fff;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1.05;
        }
        .close-cta { margin-top: 8px; }
        .close-btn {
          background: #fff;
          color: var(--color-indigo-700);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.6),
            0 12px 30px -14px rgba(0,0,0,0.4);
        }
        .close-btn:hover { background: var(--color-indigo-50); }
        .close-reassure {
          color: rgba(255,255,255,0.85);
          font-size: 14px;
          margin-top: 6px;
        }
        .close-reassure em { font-style: italic; }
      `}</style>
    </>
  );
}
