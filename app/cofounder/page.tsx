import Link from "next/link";
import type { Metadata } from "next";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";

/*
 * Co-founder pitch page — unlisted internal long-form memo.
 * Argues the singular-blocker thesis · maps competitive gap · enumerates moats ·
 * lays out PLG pricing + growth ladder · partitions self-service vs delivery ·
 * shows the Claude-Code-for-enterprise product UI built into Assembly.
 */

export const metadata: Metadata = {
  title: "Assembly — co-founder memo",
  description: "Internal. The opportunity, the gap, the moats, the price, the growth ladder. For co-founder review.",
  robots: { index: false, follow: false },
};

export default function CofounderMemo() {
  return (
    <>
      <MarketingNav />

      {/* Confidential strip */}
      <div className="conf-strip">
        <span className="conf-tag">Confidential · co-founder memo</span>
        <span className="conf-meta">Doc-CF01 · rev 0.1 · do not redistribute</span>
        <span className="conf-doc">Author: founder ·  for: co-founder</span>
      </div>

      <main>
        {/* ─── COVER ──────────────────────────────────────────────────────── */}
        <section className="cover">
          <div className="wrap cover-wrap">
            <span className="eb">For your eyes</span>
            <h1>
              We&apos;re building the <em>orchestration layer</em><br/>
              for enterprise AI &mdash; and the window<br/>
              to own it is open <em>right now</em>.
            </h1>
            <p className="lede">
              This memo is the case I want you to read once and react to. <b>Every enterprise that wants to ship AI is blocked by the same thing</b> &mdash; the plumbing between the model and the app. Nobody owns that layer. The model companies are building it for themselves; the SIs are trying to bill labor against it; the vibe-coding tools wave at it from the sandbox. We&apos;ve already built it. <b>The market is moving from &ldquo;can you write the code&rdquo; to &ldquo;can you ship the app inside an enterprise&rdquo; &mdash; and the answer is no, for almost everyone, almost everywhere.</b>
            </p>
            <p className="lede">
              Below: why this is a singular blocker today, what&apos;s actually broken about every existing alternative, why our moat compounds, how we price to land + expand, and exactly how a customer's first vibe-coded Slack agent becomes a seven-figure platform-plus-services account inside twelve months.
            </p>
            <div className="cover-meta">
              <span className="cm-stat">
                <b>~$50B</b>
                <span>SI services revenue exposed to AI-native disruption in 24 months</span>
              </span>
              <span className="cm-stat">
                <b>21</b>
                <span>capabilities every enterprise rebuilds per app today — we&apos;ve built once</span>
              </span>
              <span className="cm-stat">
                <b>5,230%</b>
                <span>YoY growth in forward-deployed-engineer postings — the FDE category is now</span>
              </span>
              <span className="cm-stat">
                <b>12&ndash;24 mo</b>
                <span>before model companies productize the rest of this layer themselves</span>
              </span>
            </div>
          </div>
        </section>

        {/* ─── 01 · The singular blocker ─────────────────────────────────── */}
        <section className="sec sec-blocker">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">01</span>
              <h2>The singular blocker.</h2>
            </div>
            <div className="sec-grid">
              <div className="sec-prose">
                <p>
                  Walk into any F1000 today and ask &ldquo;what&apos;s your AI strategy.&rdquo; You&apos;ll hear: <em>we&apos;re piloting Cursor</em>, <em>we&apos;re evaluating Cognition</em>, <em>we&apos;re running a Claude POC with our consulting partner</em>. Ask the next question &mdash; <b>what have you shipped to production in the last twelve months?</b> &mdash; and the answer is almost always nothing. Zero. Not a prototype, not a hackathon win &mdash; nothing in production, audited, governed, in front of a real internal user.
                </p>
                <p>
                  The reason is the same in every conversation. It is not capability (Claude can write the code) and it is not talent (engineers can vibe-code). It is the gap between <em>the working prototype</em> and <em>the app a Chief Information Security Officer will let touch real data</em>. That gap is identity, audit, HITL, hosting, secrets, comms, durable workflows, the data plane, the connectors, retention policies, model isolation, BYOK, single-tenant deploy. <b>Twenty-one separate things</b>, each owned by a different vendor and a different team and a different procurement cycle.
                </p>
                <p>
                  Every enterprise rebuilds these twenty-one things, in full or in part, on every single AI initiative. <b>It is the singular blocker.</b> It&apos;s why most enterprise AI projects die between the demo and the deploy.
                </p>
              </div>
              <aside className="blocker-art">
                <div className="ba-head">
                  <span className="ba-dot" />
                  <span className="ba-title">What stands between &ldquo;prototype works&rdquo; and &ldquo;in production&rdquo;</span>
                </div>
                <ol className="ba-list">
                  <li><span className="ba-n">01</span><span>Single sign-on</span></li>
                  <li><span className="ba-n">02</span><span>Roles &amp; permissions</span></li>
                  <li><span className="ba-n">03</span><span>User &amp; team management</span></li>
                  <li><span className="ba-n">04</span><span>Audit trail (tamper-evident)</span></li>
                  <li><span className="ba-n">05</span><span>Governed data plane</span></li>
                  <li><span className="ba-n">06</span><span>Live connectors to systems of record</span></li>
                  <li><span className="ba-n">07</span><span>Search / RAG</span></li>
                  <li><span className="ba-n">08</span><span>Files &amp; documents</span></li>
                  <li><span className="ba-n">09</span><span>Secure encrypted storage</span></li>
                  <li><span className="ba-n">10</span><span>Email + SMS + phone integrations</span></li>
                  <li><span className="ba-n">11</span><span>Multi-modal conversation engine</span></li>
                  <li><span className="ba-n">12</span><span>In-app notifications</span></li>
                  <li><span className="ba-n">13</span><span>UI component library</span></li>
                  <li><span className="ba-n">14</span><span>Scheduled jobs</span></li>
                  <li><span className="ba-n">15</span><span>Document generation</span></li>
                  <li><span className="ba-n">16</span><span>Secrets handling</span></li>
                  <li><span className="ba-n">17</span><span>Hosting + backups</span></li>
                  <li><span className="ba-n">18</span><span>Error monitoring + alerting</span></li>
                  <li><span className="ba-n">19</span><span>Durable production workflows</span></li>
                  <li><span className="ba-n">20</span><span>Admin + governance console</span></li>
                  <li><span className="ba-n">21</span><span>Pre-prod checklist + Org Admin approval gate</span></li>
                </ol>
                <div className="ba-foot">
                  Every team. Every project. Every time. <b>Until us.</b>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ─── 02 · Market gap ───────────────────────────────────────────── */}
        <section className="sec sec-gap">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">02</span>
              <h2>The market gap &mdash; what every category misses.</h2>
            </div>
            <p className="sec-lede">
              Eight categories of vendor compete for &ldquo;help us ship AI&rdquo; dollars today. Each leaves the same fundamental gap: <b>the orchestration layer between the model and the production app</b>. We are the only category that owns it.
            </p>

            <div className="gap-grid">
              {[
                {
                  cat: "AI coding tools",
                  examples: "Cursor · Claude Code · Replit · Windsurf",
                  ships: "Generates code fast.",
                  gap: "Hands the customer a blank sandbox. No identity, no audit, no connectors, no production runtime. Code that compiles is not an app that ships.",
                },
                {
                  cat: "Vibe-coding platforms",
                  examples: "Lovable · Bolt · v0",
                  ships: "Prototype-to-demo workflow in an afternoon.",
                  gap: "Same gap, dressed prettier. Cannot touch governed enterprise data. No HITL, no pre-prod gate, no audit. Demos beautifully, never ships.",
                },
                {
                  cat: "Internal-tool builders",
                  examples: "Retool · Internal · Tooljet · Appsmith",
                  ships: "Drag-and-drop UI over your databases.",
                  gap: "Pre-AI architecture. Built for CRUD over Postgres, not for orchestrated agents calling models with HITL gates. No agent primitives, no Claude-Code-friendly build surface.",
                },
                {
                  cat: "Workflow automation",
                  examples: "Zapier · n8n · Make · Workato",
                  ships: "If-this-then-that automation.",
                  gap: "Brittle, sequential, no AI-native primitives. Can&apos;t run a multi-step conversational agent with retries, HITL, and a durable state machine. Built for a pre-Claude world.",
                },
                {
                  cat: "Vertical SaaS",
                  examples: "Salesforce + Einstein · Workday + AI · Guidewire",
                  ships: "The standard 80% of a category.",
                  gap: "Closed product surface. Configures up to where your operation differs. The 20% edge cases &mdash; the eighty percent of why you&apos;d hire someone to build &mdash; aren&apos;t reachable.",
                },
                {
                  cat: "Strategy consultancies",
                  examples: "McKinsey Digital · Bain · BCG X",
                  ships: "A roadmap and a steering committee.",
                  gap: "Strategy, not software. Slides ship; apps don&apos;t. Their answer to &ldquo;can you build it&rdquo; is &ldquo;here&apos;s a maturity model and a vendor matrix.&rdquo;",
                },
                {
                  cat: "Systems integrators",
                  examples: "Accenture · Deloitte · Cognizant · Infosys · TCS",
                  ships: "Bodies in seats, billed hourly.",
                  gap: "Body-shop economics. Margin 25&ndash;30%. Rebuilds the same 21 capabilities per engagement. TCS just laid off 12k citing AI disruption &mdash; the model is structurally exposed.",
                },
                {
                  cat: "Foundation-model FDE orgs",
                  examples: "OpenAI Deployment Co · Anthropic Applied AI",
                  ships: "Forward-deployed engineers attached to model contracts.",
                  gap: "Captive to one model vendor. Goal is model consumption, not customer leverage. Customer has zero portability. McKinsey/Bain/Capgemini already bought seats &mdash; they&apos;d rather pay than compete.",
                },
              ].map((c) => (
                <article className="gap-card" key={c.cat}>
                  <header>
                    <h3>{c.cat}</h3>
                    <small>{c.examples}</small>
                  </header>
                  <div className="gap-row">
                    <span className="gap-k gap-k-pos">SHIPS</span>
                    <span className="gap-v">{c.ships}</span>
                  </div>
                  <div className="gap-row">
                    <span className="gap-k gap-k-neg">MISSES</span>
                    <span className="gap-v">{c.gap}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="gap-foot">
              <span className="gf-tag">The opportunity</span>
              <p>
                None of these eight categories owns the orchestration layer. Each leaves the customer to wire the twenty-one capabilities together, or to do without and stay in prototype. <b>The category exists. There is no incumbent.</b> The model companies will eventually try to fill it &mdash; OpenAI&apos;s $4B Deployment Co is the leading indicator &mdash; but they&apos;ll be locked to one model and one set of contracts. We are model-agnostic, customer-owned, and operational <em>now</em>.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 03 · Why we're defensible ─────────────────────────────────── */}
        <section className="sec sec-moats">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">03</span>
              <h2>Why we&apos;re defensible &mdash; seven moats that compound.</h2>
            </div>
            <p className="sec-lede">
              Anyone can wire up twenty-one capabilities given enough time. What makes us defensible is that we&apos;ve already done it, and every customer makes the next one cheaper. Each moat below independently moves the bar; together they create a category lead measured in years, not quarters.
            </p>

            <ol className="moats">
              {[
                {
                  n: "01",
                  title: "The 21-capability substrate, day one",
                  body: "Identity, audit, HITL, hosting, governed data plane, connectors, comms, secrets, durable workflows. We&apos;ve assembled it. A competitor with money and engineers can replicate it in 18 months and $15&ndash;25M of build cost. We&apos;re shipping customer apps on it today.",
                  receipt: "See it in /app/branding &middot; /app/access &middot; /app/governance",
                },
                {
                  n: "02",
                  title: "The framework constraint (the technical moat)",
                  body: "AI generates code <em>against our framework</em>, not as free text. That single constraint is what makes the 90% AI / 10% human ratio actually work in production &mdash; outputs are typed, audited, replayable. Random Claude Code in a vacuum doesn&apos;t have this. Neither does Cursor in a sandbox.",
                  receipt: "Visible in the Claude Code terminal — ⌘J anywhere in the app",
                },
                {
                  n: "03",
                  title: "The Org-Admin release gate",
                  body: "Pre-prod checklist + Org Admin approval before anything reaches production. This is the thing IT and Legal will sign off on. The CISO at every customer we&apos;ve talked to has the same reaction: &ldquo;If it goes through that gate, I can live with it.&rdquo;",
                  receipt: "See /app/releases — the queue waiting for approval right now",
                },
                {
                  n: "04",
                  title: "Pre-built vertical agents (the IP we own)",
                  body: "Eight named agents that compose from our six primitives. Reg-E, FNOL, post-placement, carrier-exception, comp-band, vendor-onboarding, AR-follow-up, contract-redline. Each one took us months to build right. Each one ships in a customer&apos;s account in days.",
                  receipt: "Library at /app/agents",
                },
                {
                  n: "05",
                  title: "Anthropic + Temporal + open-source Claude operating depth",
                  body: "We&apos;re not a paper partnership. Our production runs on Temporal for durable execution and on Claude (open-source weights for non-data-sensitive paths, hosted for the rest). When Anthropic ships Applied-AI competitors, we&apos;re already inside the ecosystem with operational depth a new entrant takes a year to match.",
                  receipt: "Concrete in lib/mocks workflows · Temporal-runtime visible per workflow",
                },
                {
                  n: "06",
                  title: "Per-customer data plane = compounding lock-in",
                  body: "Once a customer&apos;s data plane is provisioned and their first three apps inherit it, the marginal cost of their next app drops to near-zero. Switching back to body-shop or rebuilding on Replit looks insane in retrospect. The first three apps are the moat.",
                  receipt: "See /app/applications — six apps, same data plane",
                },
                {
                  n: "07",
                  title: "Operating model: 3-person teams, 90/10 AI/human, SaaS margins",
                  body: "We charge SaaS prices and deliver against an SI engagement scope. Our cost basis is 5&times; cheaper than Accenture, our delivery is 10&times; faster, our margin is 3&times; higher. The body-shop model literally cannot compete &mdash; they&apos;re structurally locked into per-hour billing.",
                  receipt: "Reference the economics table on /acquisition",
                },
              ].map((m) => (
                <li className="moat" key={m.n}>
                  <span className="moat-n">{m.n}</span>
                  <div className="moat-body">
                    <h3>{m.title}</h3>
                    <p dangerouslySetInnerHTML={{ __html: m.body }} />
                    <div className="moat-receipt">
                      <span className="mr-tag">Receipt</span>
                      <span>{m.receipt}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="moats-foot">
              These compound. The framework constraint makes the agent library possible. The agent library makes the 3-person team viable. The 3-person team enables SaaS margins. The release gate is what the customer&apos;s IT signs. <b>The system is self-reinforcing.</b>
            </div>
          </div>
        </section>

        {/* ─── 04 · Pricing ─────────────────────────────────────────────── */}
        <section className="sec sec-price">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">04</span>
              <h2>How we price &mdash; PLG entry, services expansion.</h2>
            </div>
            <p className="sec-lede">
              Two tracks. The first lands a department or SMB with a flat monthly subscription. The second expands into a delivery engagement once the customer wants production-grade or vertical-specific apps. The pricing intentionally <b>does not gate use of the platform on per-app fees</b> &mdash; we want a thousand apps per customer, even if most are throwaway internal tools.
            </p>

            <div className="price-grid">
              <article className="price-card price-card-plg">
                <header>
                  <span className="pc-tag">Track 1 · Self-service · PLG</span>
                  <h3>Platform subscription</h3>
                  <span className="pc-meta">SMB · department · self-serve</span>
                </header>
                <div className="pc-lines">
                  <div className="pc-line">
                    <span className="pc-line-k">AI readiness setup</span>
                    <span className="pc-line-v">$30,000 one-time</span>
                  </div>
                  <div className="pc-line">
                    <span className="pc-line-k">Operations subscription</span>
                    <span className="pc-line-v">$2,500 / month flat</span>
                  </div>
                  <div className="pc-line">
                    <span className="pc-line-k">Building apps</span>
                    <span className="pc-line-v pc-line-v-on">Unlimited · $0 / app</span>
                  </div>
                  <div className="pc-line">
                    <span className="pc-line-k">Production-sprint hardening</span>
                    <span className="pc-line-v">$15,000 / app (optional)</span>
                  </div>
                </div>
                <div className="pc-summary">
                  <span className="pc-summary-l">Year 1 all-in</span>
                  <span className="pc-summary-v">$60,000</span>
                </div>
                <div className="pc-summary">
                  <span className="pc-summary-l">Year 2 onward</span>
                  <span className="pc-summary-v">$30,000 / year</span>
                </div>
                <footer>
                  <b>Targeting</b>: ops teams, finance teams, dept leads, SMB CIOs. Buyer self-signs, builds first app in their second week. No procurement gauntlet, no per-app friction.
                </footer>
              </article>

              <article className="price-card price-card-svc">
                <header>
                  <span className="pc-tag dark">Track 2 · Delivery</span>
                  <h3>AI-native services on the platform</h3>
                  <span className="pc-meta">Mid-market &amp; enterprise · regulated · vertical-specific</span>
                </header>
                <div className="pc-lines">
                  <div className="pc-line">
                    <span className="pc-line-k">Studio scope</span>
                    <span className="pc-line-v">Included</span>
                  </div>
                  <div className="pc-line">
                    <span className="pc-line-k">90-day delivery</span>
                    <span className="pc-line-v">Usage-based</span>
                  </div>
                  <div className="pc-line">
                    <span className="pc-line-k">Per-conversation</span>
                    <span className="pc-line-v">$0.40 &mdash; $1.20</span>
                  </div>
                  <div className="pc-line">
                    <span className="pc-line-k">Per-document generated</span>
                    <span className="pc-line-v">$0.80 &mdash; $3.00</span>
                  </div>
                  <div className="pc-line">
                    <span className="pc-line-k">Per-workflow run</span>
                    <span className="pc-line-v">$2.50 &mdash; $9.00</span>
                  </div>
                </div>
                <div className="pc-summary">
                  <span className="pc-summary-l">Typical engagement</span>
                  <span className="pc-summary-v">$250k &mdash; $1.2M / yr</span>
                </div>
                <div className="pc-summary">
                  <span className="pc-summary-l">Gross margin</span>
                  <span className="pc-summary-v pc-summary-v-on">70 &mdash; 80%</span>
                </div>
                <footer>
                  <b>Targeting</b>: regulated industries, multi-stakeholder workflows, anything needing a CISO sign-off path. Studio leads with a 60-minute scoping call → signable SOW.
                </footer>
              </article>
            </div>

            <div className="price-rule">
              <span className="pr-tag">The pricing principle</span>
              <p>
                <b>We do not charge per app.</b> The economics of platform leverage require that every customer&apos;s second, fifth, and twentieth app feels free at the margin. If they build a hundred throwaway internal tools on our platform &mdash; great. We make money on the substrate, not on every artifact built on top of it.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 05 · PLG → services growth ──────────────────────────────── */}
        <section className="sec sec-growth">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">05</span>
              <h2>PLG to services &mdash; the growth ladder.</h2>
            </div>
            <p className="sec-lede">
              The conversion engine. Every customer starts at the top with a $2,500/mo self-signup. The land-and-expand path is engineered into the product: the moment a builder hits a wall, we surface a ticket; the moment IT wants production-grade, we surface Releases; the moment ops wants a complex agent, we surface Delivery. <b>Customer LTV ladder: $60k → $250k → $1.2M+ in 12 months.</b>
            </p>

            <ol className="ladder">
              {[
                {
                  step: "01",
                  stage: "PLG entry",
                  who: "1 builder · dept",
                  acv: "$60k year-1",
                  what: "SMB / department self-signup. Builder configures first connector, builds first app on Slack within two weeks. Apps are simple, internal, low-stakes.",
                  trigger: "Builder needs to ship → starts trial",
                },
                {
                  step: "02",
                  stage: "Builder expansion",
                  who: "3&ndash;5 builders · same dept",
                  acv: "$60k year-1 (flat sub)",
                  what: "More people in the same team start building. App count crosses 5+. Some apps start touching real customer data. Org Admin sees the dashboard.",
                  trigger: "Org Admin asks: &ldquo;is any of this in production?&rdquo;",
                },
                {
                  step: "03",
                  stage: "Productionization · first paid",
                  who: "Admin + 1 production app",
                  acv: "+$15k production sprint",
                  what: "One internal app needs to actually go live &mdash; customer data, real users. The pre-prod checklist surfaces work that needs an engineer. First Productionization ticket → first paid engineering engagement on top of the subscription.",
                  trigger: "App needs CISO sign-off → engineer raises ticket",
                },
                {
                  step: "04",
                  stage: "Multi-department expansion",
                  who: "3+ depts · 20+ apps",
                  acv: "$120k subscription tier",
                  what: "Apps multiply across departments. Subscription tier moves to enterprise. Org Admin sees a portfolio. Some apps are live in production; some are internal tools. The platform is now mission-critical.",
                  trigger: "Procurement consolidates: enterprise plan + DPA + SCIM",
                },
                {
                  step: "05",
                  stage: "Delivery engagement",
                  who: "Regulated workflow needed",
                  acv: "+$250k&ndash;$1.2M / yr",
                  what: "A vertical-specific, regulated, or multi-system app surfaces &mdash; Reg E for the bank, FNOL for the insurer. This is delivery territory. Studio scopes it in 60 minutes; FDE+QA+TPM ships in 90 days. Usage-based pricing kicks in.",
                  trigger: "Compliance / IT mandates: &ldquo;build this right or don&apos;t build it&rdquo;",
                },
                {
                  step: "06",
                  stage: "Reference + repeat",
                  who: "Multi-LOB · 50+ apps",
                  acv: "$1.2M+ ARR",
                  what: "Customer hits 50+ apps across multiple lines of business, multiple production deployments, multiple delivery engagements. Becomes a reference. Brings their builders to events. Their CIO talks about us on panels.",
                  trigger: "We close the next ten customers off this one's logo",
                },
              ].map((s) => (
                <li className="ladder-rung" key={s.step}>
                  <span className="lr-num">{s.step}</span>
                  <div className="lr-body">
                    <header>
                      <h3>{s.stage}</h3>
                      <span className="lr-who">{s.who}</span>
                      <span className="lr-acv">{s.acv}</span>
                    </header>
                    <p>{s.what}</p>
                    <span className="lr-trigger" dangerouslySetInnerHTML={{ __html: `<b>Trigger:</b> ${s.trigger}` }} />
                  </div>
                </li>
              ))}
            </ol>

            <div className="ladder-summary">
              <div className="ls-stat">
                <span className="ls-v">$60k</span>
                <span className="ls-k">Year-1 ACV at PLG entry</span>
              </div>
              <div className="ls-sep">→</div>
              <div className="ls-stat">
                <span className="ls-v">$120k</span>
                <span className="ls-k">Multi-dept expansion (month 6)</span>
              </div>
              <div className="ls-sep">→</div>
              <div className="ls-stat ls-stat-on">
                <span className="ls-v">$1.2M+</span>
                <span className="ls-k">With one delivery engagement (month 12)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 06 · Self-service vs delivery ──────────────────────────── */}
        <section className="sec sec-svc">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">06</span>
              <h2>What majority self-services &mdash; and what doesn&apos;t.</h2>
            </div>
            <p className="sec-lede">
              The PLG motion only works if most use cases can be self-served. That&apos;s real and we&apos;ve sized it: <b>roughly 80% of apps a customer ever builds are self-serviceable</b>; the remaining 20% drive 60%+ of revenue via delivery. Below: where the line actually sits.
            </p>

            <div className="svc-grid">
              <article className="svc-card svc-card-self">
                <header>
                  <span className="sc-tag sc-tag-self">Self-service · majority</span>
                  <h3>Apps a builder ships solo in 1&ndash;2 weeks</h3>
                </header>
                <ul>
                  <li>
                    <span className="sc-name">comp-band-bot</span>
                    <small>Slack command answering HR comp questions from Workday data</small>
                  </li>
                  <li>
                    <span className="sc-name">ar-follow-up</span>
                    <small>Daily outstanding-invoice reminder with escalation when ghosted</small>
                  </li>
                  <li>
                    <span className="sc-name">internal-faq-deflector</span>
                    <small>Slack/Teams bot that handles tier-1 internal HR/IT questions from a knowledge base</small>
                  </li>
                  <li>
                    <span className="sc-name">time-tracking-checkin</span>
                    <small>SMS daily check-in for field workers, with late escalation</small>
                  </li>
                  <li>
                    <span className="sc-name">vendor-onboard-light</span>
                    <small>NDA generation + DocuSign send + tracking</small>
                  </li>
                  <li>
                    <span className="sc-name">weekly-report-generator</span>
                    <small>Pull data + draft narrative + email to stakeholders</small>
                  </li>
                  <li>
                    <span className="sc-name">customer-feedback-loop</span>
                    <small>NPS prompt + automated dig-in conversation on low scores</small>
                  </li>
                  <li>
                    <span className="sc-name">meeting-prep-brief</span>
                    <small>Pulls account/contact/last-touch data, drafts the call brief</small>
                  </li>
                </ul>
                <footer>
                  <b>Characteristics</b>: internal-facing, no regulated data, no CISO sign-off needed, no system-of-record write-backs at scale. Builder is the buyer. Lands inside the $2,500/mo subscription.
                </footer>
              </article>

              <article className="svc-card svc-card-delivery">
                <header>
                  <span className="sc-tag sc-tag-delivery">Delivery · the high-margin 20%</span>
                  <h3>Apps that require Assembly to build</h3>
                </header>
                <ul>
                  <li>
                    <span className="sc-name">reg-e-compliance</span>
                    <small>Quarterly Reg E run · CFPB rule-pack evaluation · auditor-grade lineage</small>
                  </li>
                  <li>
                    <span className="sc-name">fnol-intake</span>
                    <small>Voice + text first-notice-of-loss · state-aware coverage check · Guidewire integration</small>
                  </li>
                  <li>
                    <span className="sc-name">carrier-exception-resolution</span>
                    <small>EDI 214/990 ingestion · browser-automated carrier portal disputes</small>
                  </li>
                  <li>
                    <span className="sc-name">contract-redline-engine</span>
                    <small>Multi-stakeholder redline workflow with audit lineage against MSA playbook</small>
                  </li>
                  <li>
                    <span className="sc-name">claims-triage-v2</span>
                    <small>Multi-system claim adjudication with HITL for borderline cases</small>
                  </li>
                  <li>
                    <span className="sc-name">vendor-onboarding-enterprise</span>
                    <small>Full vendor risk assessment + SOC 2 / KYC checks + ServiceNow ticket creation</small>
                  </li>
                  <li>
                    <span className="sc-name">election-polling-staffing</span>
                    <small>Walmart-scale seasonal staffing + training + scheduling comms</small>
                  </li>
                  <li>
                    <span className="sc-name">audit-trail-streamer</span>
                    <small>Custom audit-log streaming to customer SIEM with replay + reporting</small>
                  </li>
                </ul>
                <footer>
                  <b>Characteristics</b>: regulated data, multi-stakeholder workflows, audit + compliance edges, system-of-record write-backs, CISO must sign off, vertical-specific rule packs. Buyer is the Org Admin / COO. <b>This is where the $250k&ndash;$1.2M engagements live.</b>
                </footer>
              </article>
            </div>

            <div className="svc-bottom">
              <span className="sb-tag">The mix</span>
              <p>
                A mature customer ends up with roughly <b>80 self-service apps and 4 delivery engagements</b> across a year. The 80 cost us nearly nothing to host; the 4 generate the bulk of revenue. <b>Both motions need the same platform</b> &mdash; that&apos;s why we have to win both.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 07 · Claude Code for enterprise — the product ───────────── */}
        <section className="sec sec-product">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">07</span>
              <h2>Claude Code for the enterprise &mdash; the features we&apos;ve built.</h2>
            </div>
            <p className="sec-lede">
              Everything in the application <Link href="/app" className="prod-link">at /app</Link> exists to make Claude Code (or any AI coding tool) shippable inside a real enterprise. This is the product. Each feature below is live; click through to see it.
            </p>

            <div className="prod-grid">
              {[
                {
                  feat: "01 · The Claude Code terminal, persistent and contextual",
                  body: "Right-side dockable panel, ⌘J anywhere in the app. Pre-pointed at the active application's MCP endpoint. Scripted Claude Code session showing build commands, output streaming, and live state changes. Every customer sees the platform-to-Claude-Code interplay in their own context.",
                  ux: "Press ⌘J anywhere in /app",
                  link: "/app",
                },
                {
                  feat: "02 · Per-app MCP endpoint + build credential",
                  body: "Every application provisions an MCP endpoint scoped to that app's data and permissions. The build credential is a per-app token; Claude Code connects with that one-line config from the Build Context tab. Identity flows automatically; the agent can only see what the app's scope allows.",
                  ux: "Click any app → Build context tab",
                  link: "/app/applications/app_compband",
                },
                {
                  feat: "03 · skills.md — the build playbook in the repo",
                  body: "The framework constraint as a Claude-Code-readable file. Lists sources, logic, surfaces, conventions for that specific app. Claude Code reads it automatically. Result: AI generates against the framework, not against random typing.",
                  ux: "Code block inside the Build context tab",
                  link: "/app/applications/app_compband",
                },
                {
                  feat: "04 · Pre-built agent library",
                  body: "Six primitive agent types — Conversational, Search, Doc-gen, System, Browser, Workflow — plus 8 vertical-tuned named agents. Each is callable from Claude Code via the MCP, configurable in the UI, and inherits the platform's audit and identity.",
                  ux: "Browse /app/agents",
                  link: "/app/agents",
                },
                {
                  feat: "05 · One-click \"raise a ticket\" from Claude Code",
                  body: "When the builder hits a wall (data migration, scale issue, regulated edge case), they click in the terminal to raise a ticket. The app moves to Blocked status. Lin or Omar — our FDEs — pick it up. PR merge unblocks the app automatically.",
                  ux: "Footer action in the Claude Code panel",
                  link: "/app/work",
                },
                {
                  feat: "06 · The pre-prod checklist + Org Admin gate",
                  body: "Nothing reaches production without passing five checklist items (permissions tested, PII reviewed, security scan clean, owner assigned, environment confirmed) and getting an Org Admin's signature. The thing IT signs off on.",
                  ux: "See pending releases at /app/releases",
                  link: "/app/releases",
                },
                {
                  feat: "07 · Versioning + one-click rollback",
                  body: "Every promotion creates an immutable app version. Every previous version is one click away from production. Change requests for live apps re-enter the same gate. No app silently mutates in production, ever.",
                  ux: "Version history per release in /app/releases",
                  link: "/app/releases",
                },
                {
                  feat: "08 · The Access simulator",
                  body: "Pick a user, pick a record, see exactly what they would see. PII masked, salary blocked, all of it. This is the demo CISOs love because it turns abstract permissions into something visible.",
                  ux: "See /app/access/simulator",
                  link: "/app/access/simulator",
                },
                {
                  feat: "09 · Unified org branding",
                  body: "Set logo, palette, typography, voice, and per-surface templates once. Every app inherits them. Per-app overrides for the exceptions. The customer feels like they're shipping their own product, not ours.",
                  ux: "See /app/branding — live preview included",
                  link: "/app/branding",
                },
                {
                  feat: "10 · Tamper-evident audit log",
                  body: "Every action — every read, every model call, every reviewer disposition, every PR merge — logged with 7-year retention, exportable, streamable to customer SIEMs. The audit story compliance teams need.",
                  ux: "See /app/activity",
                  link: "/app/activity",
                },
                {
                  feat: "11 · Bring-your-own-key for AI model providers",
                  body: "The customer pastes their Anthropic / OpenAI key. Our compute runs in our infra, but model spend hits their account directly. No vendor-lock pricing tricks; the customer controls their own model bill.",
                  ux: "Settings → API keys",
                  link: "/app/settings",
                },
                {
                  feat: "12 · GitHub integration with framework-compliance bots",
                  body: "Each app gets a private repo provisioned in our GitHub org from a framework template. Spec-compliance + security-scan bots run on every PR. Repo transfers to the customer at offboarding — the no-lock-in promise in code.",
                  ux: "Build context tab of any app",
                  link: "/app/applications/app_compband",
                },
              ].map((f) => (
                <article className="prod-card" key={f.feat}>
                  <h4>{f.feat}</h4>
                  <p>{f.body}</p>
                  <Link href={f.link} className="prod-ux">
                    <span className="pu-tag">UX</span>
                    <span className="pu-text">{f.ux}</span>
                    <span className="pu-arr">→</span>
                  </Link>
                </article>
              ))}
            </div>

            <div className="product-bottom">
              <p>
                Twelve features. <b>Each one is the answer to a question a customer&apos;s IT, Legal, or Compliance team would ask before approving Claude Code anywhere near their stack.</b> Together, they&apos;re the difference between &ldquo;we tried Cursor for a quarter&rdquo; and &ldquo;we&apos;ve shipped twelve apps to production in twelve weeks.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ─── 08 · The bet ──────────────────────────────────────────── */}
        <section className="sec sec-bet">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">08</span>
              <h2>The bet, in one paragraph.</h2>
            </div>
            <div className="bet-card">
              <p>
                Every enterprise will need to ship dozens of AI-augmented internal apps in the next eighteen months. The model companies will hand them a sandbox; the SIs will hand them an invoice; the SaaS vendors will hand them a configuration screen. <b>None of those will ship.</b> We hand them the orchestration layer that makes the shipping actually happen &mdash; pre-built, governed, ready to compose. The window where this category has no incumbent is twelve to twenty-four months. We have eight live customers and a product that&apos;s currently the best in market because no other product like it exists. <b>The bet is: ride the wave from PLG land to seven-figure delivery in twelve months per customer, and own the category before the foundation-model companies productize their way into it.</b>
              </p>
              <div className="bet-foot">
                <span>What we need</span>
                <ul>
                  <li><b>Commit</b> — you in, full-time, this quarter</li>
                  <li><b>First three target customers</b> — your network, my network, mutual</li>
                  <li><b>Series A timing</b> — 8 logos by month 9 → raise on the strength of the customer base, not a deck</li>
                  <li><b>Co-founder split</b> — let&apos;s talk over the weekend</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Closing ──────────────────────────────────────────────── */}
        <section className="sec sec-close">
          <div className="wrap close-wrap">
            <p className="close-lede">
              Read it twice. Walk the product at <Link href="/app">/app</Link>. Then let&apos;s talk.
            </p>
            <div className="close-row">
              <Link href="/app" className="btn btn-primary">
                Open the product <span className="arr">→</span>
              </Link>
              <Link href="/" className="btn btn-secondary">
                Back to the public site
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />

      <style>{`
        /* ════════════════════════════════════════════════════════
           Confidential strip
           ════════════════════════════════════════════════════════ */
        .conf-strip {
          background: var(--color-ink-950);
          color: rgba(255, 255, 255, 0.78);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 8px 32px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.06em;
        }
        .conf-tag {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          padding: 3px 9px;
          border-radius: 3px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .conf-meta { color: rgba(255, 255, 255, 0.5); flex: 1; }
        .conf-doc  { color: rgba(255, 255, 255, 0.4); }

        /* ════════════════════════════════════════════════════════
           Cover
           ════════════════════════════════════════════════════════ */
        .cover {
          padding: 80px 0 56px;
          background:
            radial-gradient(800px 480px at 80% -10%, var(--color-indigo-50) 0%, transparent 60%),
            radial-gradient(680px 400px at -5% 30%, var(--color-lavender-50) 0%, transparent 55%),
            #fff;
        }
        .cover-wrap { max-width: 920px; }
        .eb {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-indigo-600);
          margin-bottom: 18px;
          display: inline-block;
        }
        .cover h1 {
          font-size: clamp(40px, 4.4vw, 56px);
          letter-spacing: -0.024em;
          line-height: 1.08;
          color: var(--color-ink-950);
        }
        .cover h1 em {
          font-style: normal;
          color: var(--color-indigo-600);
        }
        .lede {
          margin-top: 24px;
          font-size: 18px;
          color: var(--color-ink-700);
          line-height: 1.6;
          max-width: 720px;
        }
        .lede b { color: var(--color-ink-950); font-weight: 600; }
        .cover-meta {
          margin-top: 48px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          padding-top: 28px;
          border-top: 1px solid var(--color-ink-200);
        }
        @media (max-width: 920px) { .cover-meta { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 540px) { .cover-meta { grid-template-columns: 1fr; } }
        .cm-stat {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-right: 18px;
          border-right: 1px solid var(--color-ink-100);
        }
        .cm-stat:last-child { border-right: 0; }
        .cm-stat b {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 28px;
          letter-spacing: -0.022em;
          color: var(--color-ink-950);
          line-height: 1;
        }
        .cm-stat span {
          font-size: 12px;
          color: var(--color-ink-500);
          line-height: 1.45;
        }

        /* ════════════════════════════════════════════════════════
           Section base
           ════════════════════════════════════════════════════════ */
        .sec {
          padding: 80px 0;
          border-top: 1px solid var(--color-ink-100);
        }
        .sec-head {
          display: flex;
          align-items: baseline;
          gap: 24px;
          margin-bottom: 16px;
        }
        .sec-num {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--color-ink-400);
        }
        .sec h2 {
          font-size: clamp(28px, 3vw, 38px);
          letter-spacing: -0.022em;
          line-height: 1.15;
          color: var(--color-ink-950);
        }
        .sec h2 em { font-style: italic; color: var(--color-ink-700); font-weight: 500; }
        .sec-lede {
          font-size: 17px;
          color: var(--color-ink-700);
          line-height: 1.6;
          max-width: 780px;
          margin-bottom: 36px;
        }
        .sec-lede b { color: var(--color-ink-950); font-weight: 600; }

        /* ════════════════════════════════════════════════════════
           01 — Blocker
           ════════════════════════════════════════════════════════ */
        .sec-blocker { background: #fff; }
        .sec-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 36px;
          align-items: start;
          margin-top: 8px;
        }
        @media (max-width: 980px) { .sec-grid { grid-template-columns: 1fr; } }
        .sec-prose p {
          font-size: 16.5px;
          color: var(--color-ink-700);
          line-height: 1.7;
          margin-bottom: 18px;
        }
        .sec-prose p:last-child { margin-bottom: 0; }
        .sec-prose b { color: var(--color-ink-950); font-weight: 600; }
        .sec-prose em { font-style: italic; color: var(--color-ink-500); }

        .blocker-art {
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          padding: 22px;
          position: sticky;
          top: 92px;
        }
        @media (max-width: 980px) { .blocker-art { position: static; } }
        .ba-head { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .ba-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--color-warn-fg);
        }
        .ba-title {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .ba-list {
          list-style: none;
          margin: 0; padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ba-list li {
          display: grid;
          grid-template-columns: 24px 1fr;
          gap: 10px;
          padding: 6px 8px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-700);
          background: #fff;
          border-radius: 4px;
        }
        .ba-n { color: var(--color-ink-400); letter-spacing: 0.04em; }
        .ba-foot {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px dashed var(--color-ink-200);
          font-size: 13px;
          color: var(--color-ink-700);
          line-height: 1.5;
        }
        .ba-foot b { color: var(--color-warn-fg); font-weight: 600; }

        /* ════════════════════════════════════════════════════════
           02 — Gap
           ════════════════════════════════════════════════════════ */
        .sec-gap { background: var(--color-ink-50); }
        .gap-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        @media (max-width: 820px) { .gap-grid { grid-template-columns: 1fr; } }
        .gap-card {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .gap-card header h3 {
          font-size: 17px;
          letter-spacing: -0.012em;
          color: var(--color-ink-950);
        }
        .gap-card header small {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.02em;
          display: block;
          margin-top: 4px;
        }
        .gap-row {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 14px;
          align-items: start;
          padding-top: 10px;
          border-top: 1px dashed var(--color-ink-100);
        }
        .gap-row:first-of-type { border-top: 0; padding-top: 0; }
        .gap-k {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          padding-top: 3px;
        }
        .gap-k-pos { color: var(--color-sage-fg); }
        .gap-k-neg { color: var(--color-warn-fg); }
        .gap-v {
          font-size: 13.5px;
          color: var(--color-ink-700);
          line-height: 1.55;
        }

        .gap-foot {
          padding: 22px 28px;
          background: var(--color-ink-950);
          color: rgba(255, 255, 255, 0.85);
          border-radius: var(--radius-lg);
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 720px) { .gap-foot { grid-template-columns: 1fr; gap: 12px; } }
        .gf-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-lavender-300);
          background: rgba(255, 255, 255, 0.08);
          padding: 5px 12px;
          border-radius: 999px;
          align-self: start;
          padding-top: 6px;
          white-space: nowrap;
        }
        .gap-foot p {
          font-size: 15.5px;
          line-height: 1.65;
          margin: 0;
        }
        .gap-foot p b { color: #fff; font-weight: 600; }
        .gap-foot p em { color: var(--color-lavender-300); font-style: italic; }

        /* ════════════════════════════════════════════════════════
           03 — Moats
           ════════════════════════════════════════════════════════ */
        .sec-moats { background: #fff; }
        .moats { list-style: none; margin: 0; padding: 0; }
        .moat {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 1px solid var(--color-ink-100);
          align-items: start;
        }
        .moat:first-child { padding-top: 0; }
        .moat:last-child { border-bottom: 0; }
        @media (max-width: 720px) { .moat { grid-template-columns: 1fr; gap: 10px; } }
        .moat-n {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--color-indigo-600);
          padding-top: 6px;
        }
        .moat-body h3 {
          font-size: 19px;
          letter-spacing: -0.012em;
          margin-bottom: 8px;
          color: var(--color-ink-950);
        }
        .moat-body p {
          font-size: 14.5px;
          color: var(--color-ink-700);
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .moat-body p :global(em) { font-style: italic; color: var(--color-ink-950); }
        .moat-receipt {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-100);
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-indigo-700);
        }
        .mr-tag {
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-size: 9.5px;
        }

        .moats-foot {
          margin-top: 32px;
          padding: 18px 22px;
          background: var(--color-lavender-50);
          border: 1px solid var(--color-lavender-200);
          border-radius: var(--radius-md);
          font-size: 14.5px;
          color: var(--color-ink-700);
          line-height: 1.6;
        }
        .moats-foot b { color: var(--color-ink-950); font-weight: 600; }

        /* ════════════════════════════════════════════════════════
           04 — Pricing
           ════════════════════════════════════════════════════════ */
        .sec-price { background: var(--color-ink-50); }
        .price-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 24px;
        }
        @media (max-width: 880px) { .price-grid { grid-template-columns: 1fr; } }
        .price-card {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .price-card-plg {
          border-color: var(--color-indigo-600);
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 20px 56px -28px rgba(79, 70, 229, 0.4);
        }
        .price-card-svc {
          background: var(--color-ink-950);
          color: rgba(255, 255, 255, 0.85);
          border-color: transparent;
        }
        .price-card header h3 {
          font-size: 22px;
          letter-spacing: -0.018em;
          color: var(--color-ink-950);
          margin: 8px 0 4px;
        }
        .price-card-svc header h3 { color: #fff; }
        .pc-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-indigo-600);
          background: var(--color-indigo-50);
          padding: 4px 9px;
          border-radius: 4px;
          align-self: flex-start;
        }
        .pc-tag.dark {
          color: var(--color-lavender-300);
          background: rgba(255, 255, 255, 0.08);
        }
        .pc-meta {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }
        .price-card-svc .pc-meta { color: rgba(255, 255, 255, 0.55); }

        .pc-lines { display: flex; flex-direction: column; }
        .pc-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 10px 0;
          border-top: 1px dashed var(--color-ink-100);
          font-size: 14px;
        }
        .price-card-svc .pc-line { border-top-color: rgba(255, 255, 255, 0.08); }
        .pc-line:first-child { border-top: 0; padding-top: 0; }
        .pc-line-k { color: var(--color-ink-700); }
        .price-card-svc .pc-line-k { color: rgba(255, 255, 255, 0.7); }
        .pc-line-v {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14.5px;
          letter-spacing: -0.005em;
          color: var(--color-ink-950);
        }
        .price-card-svc .pc-line-v { color: #fff; }
        .pc-line-v-on { color: var(--color-sage-fg) !important; }

        .pc-summary {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 12px 14px;
          background: var(--color-ink-50);
          border-radius: var(--radius-md);
        }
        .price-card-svc .pc-summary { background: rgba(255, 255, 255, 0.06); }
        .pc-summary-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .price-card-svc .pc-summary-l { color: var(--color-lavender-300); }
        .pc-summary-v {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 22px;
          letter-spacing: -0.018em;
          color: var(--color-ink-950);
        }
        .price-card-svc .pc-summary-v { color: #fff; }
        .pc-summary-v-on { color: var(--color-sage-fg) !important; }

        .price-card footer {
          padding-top: 14px;
          border-top: 1px solid var(--color-ink-100);
          font-size: 13px;
          color: var(--color-ink-500);
          line-height: 1.55;
        }
        .price-card-svc footer {
          border-top-color: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.65);
        }
        .price-card footer b { color: var(--color-ink-950); font-weight: 600; }
        .price-card-svc footer b { color: #fff; }

        .price-rule {
          padding: 22px 26px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 720px) { .price-rule { grid-template-columns: 1fr; gap: 12px; } }
        .pr-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-indigo-600);
          background: var(--color-indigo-50);
          padding: 5px 12px;
          border-radius: 999px;
          white-space: nowrap;
          align-self: start;
          padding-top: 6px;
        }
        .price-rule p {
          font-size: 14.5px;
          color: var(--color-ink-700);
          line-height: 1.65;
          margin: 0;
        }
        .price-rule p b { color: var(--color-ink-950); font-weight: 600; }

        /* ════════════════════════════════════════════════════════
           05 — Growth ladder
           ════════════════════════════════════════════════════════ */
        .sec-growth { background: #fff; }
        .ladder { list-style: none; margin: 0; padding: 0; }
        .ladder-rung {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 24px;
          padding: 24px 0;
          border-top: 1px solid var(--color-ink-100);
          align-items: start;
        }
        .ladder-rung:first-child { border-top: 0; padding-top: 0; }
        @media (max-width: 720px) { .ladder-rung { grid-template-columns: 1fr; gap: 10px; } }
        .lr-num {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 36px;
          letter-spacing: -0.025em;
          color: var(--color-indigo-600);
          line-height: 1;
        }
        .lr-body header {
          display: flex;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .lr-body h3 {
          font-size: 19px;
          letter-spacing: -0.012em;
          color: var(--color-ink-950);
          margin-right: 12px;
        }
        .lr-who, .lr-acv {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          padding: 3px 9px;
          border-radius: 999px;
          background: var(--color-ink-50);
          color: var(--color-ink-700);
        }
        .lr-acv {
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          font-weight: 600;
        }
        .lr-body p {
          font-size: 14.5px;
          color: var(--color-ink-700);
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .lr-trigger {
          display: inline-block;
          padding: 6px 12px;
          background: var(--color-sage-bg);
          color: var(--color-sage-fg);
          border-radius: 6px;
          font-size: 12.5px;
          line-height: 1.5;
        }

        .ladder-summary {
          margin-top: 36px;
          padding: 28px;
          background: var(--color-ink-50);
          border-radius: var(--radius-lg);
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          gap: 14px;
          align-items: center;
        }
        @media (max-width: 720px) {
          .ladder-summary { grid-template-columns: 1fr; }
          .ls-sep { display: none; }
        }
        .ls-stat { display: flex; flex-direction: column; gap: 6px; text-align: center; }
        .ls-stat-on { background: var(--color-indigo-50); border: 1px solid var(--color-indigo-100); border-radius: 8px; padding: 10px; }
        .ls-v {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 30px;
          letter-spacing: -0.022em;
          color: var(--color-ink-950);
          line-height: 1;
        }
        .ls-stat-on .ls-v { color: var(--color-indigo-700); }
        .ls-k {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
          letter-spacing: 0.02em;
          line-height: 1.4;
        }
        .ls-sep {
          font-family: var(--font-mono);
          font-size: 22px;
          color: var(--color-ink-300);
          font-weight: 300;
        }

        /* ════════════════════════════════════════════════════════
           06 — Self-service vs delivery
           ════════════════════════════════════════════════════════ */
        .sec-svc { background: var(--color-ink-50); }
        .svc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 24px;
        }
        @media (max-width: 880px) { .svc-grid { grid-template-columns: 1fr; } }
        .svc-card {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .svc-card-delivery {
          background: var(--color-ink-950);
          color: rgba(255, 255, 255, 0.85);
          border-color: transparent;
        }
        .sc-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 4px;
          align-self: flex-start;
        }
        .sc-tag-self     { background: var(--color-sage-bg); color: var(--color-sage-fg); }
        .sc-tag-delivery { background: rgba(255, 255, 255, 0.08); color: var(--color-lavender-300); }
        .svc-card header h3 {
          font-size: 18px;
          letter-spacing: -0.012em;
          color: var(--color-ink-950);
          margin-top: 8px;
        }
        .svc-card-delivery h3 { color: #fff; }
        .svc-card ul {
          list-style: none;
          margin: 0; padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .svc-card ul li {
          padding: 10px 12px;
          background: var(--color-ink-50);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .svc-card-delivery ul li { background: rgba(255, 255, 255, 0.04); }
        .sc-name {
          font-family: var(--font-mono);
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-ink-950);
        }
        .svc-card-delivery .sc-name { color: #fff; }
        .svc-card ul li small {
          font-size: 12px;
          color: var(--color-ink-500);
          line-height: 1.45;
        }
        .svc-card-delivery ul li small { color: rgba(255, 255, 255, 0.6); }
        .svc-card footer {
          padding-top: 16px;
          border-top: 1px solid var(--color-ink-100);
          font-size: 13px;
          color: var(--color-ink-500);
          line-height: 1.6;
        }
        .svc-card-delivery footer {
          border-top-color: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
        }
        .svc-card footer b { color: var(--color-ink-950); font-weight: 600; }
        .svc-card-delivery footer b { color: #fff; }

        .svc-bottom {
          padding: 22px 26px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 720px) { .svc-bottom { grid-template-columns: 1fr; gap: 10px; } }
        .sb-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-indigo-600);
          background: var(--color-indigo-50);
          padding: 5px 12px;
          border-radius: 999px;
          white-space: nowrap;
          align-self: start;
          padding-top: 6px;
        }
        .svc-bottom p {
          font-size: 14.5px;
          color: var(--color-ink-700);
          line-height: 1.65;
          margin: 0;
        }
        .svc-bottom p b { color: var(--color-ink-950); font-weight: 600; }

        /* ════════════════════════════════════════════════════════
           07 — Product features
           ════════════════════════════════════════════════════════ */
        .sec-product { background: #fff; }
        .prod-link { color: var(--color-indigo-600); text-decoration: underline; text-underline-offset: 2px; }
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        @media (max-width: 880px) { .prod-grid { grid-template-columns: 1fr; } }
        .prod-card {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 3px solid var(--color-indigo-600);
        }
        .prod-card h4 {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 15px;
          letter-spacing: -0.005em;
          color: var(--color-ink-950);
          line-height: 1.3;
        }
        .prod-card p {
          font-size: 13.5px;
          color: var(--color-ink-700);
          line-height: 1.55;
          flex: 1;
        }
        .prod-ux {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 6px;
          text-decoration: none;
          font-size: 12px;
          color: var(--color-ink-700);
          font-family: var(--font-mono);
          margin-top: 4px;
          transition: border-color 0.12s, background 0.12s;
        }
        .prod-ux:hover {
          border-color: var(--color-indigo-300);
          background: var(--color-indigo-50);
        }
        .pu-tag {
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-size: 9.5px;
          color: var(--color-indigo-600);
        }
        .pu-text { flex: 1; }
        .pu-arr { color: var(--color-indigo-600); transition: transform 0.15s; }
        .prod-ux:hover .pu-arr { transform: translateX(3px); }

        .product-bottom {
          padding: 22px 26px;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-100);
          border-radius: var(--radius-md);
        }
        .product-bottom p {
          font-size: 15px;
          color: var(--color-ink-700);
          line-height: 1.65;
          margin: 0;
        }
        .product-bottom p b { color: var(--color-indigo-700); font-weight: 600; }

        /* ════════════════════════════════════════════════════════
           08 — The bet
           ════════════════════════════════════════════════════════ */
        .sec-bet { background: var(--color-ink-950); color: rgba(255, 255, 255, 0.85); }
        .sec-bet h2 { color: #fff; }
        .sec-bet .sec-num { color: var(--color-lavender-300); }
        .bet-card {
          padding: 32px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
        }
        .bet-card p {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(17px, 1.8vw, 22px);
          letter-spacing: -0.012em;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.92);
          margin-bottom: 24px;
        }
        .bet-card p b { color: #fff; font-weight: 600; }
        .bet-foot {
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .bet-foot span {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-lavender-300);
          display: block;
          margin-bottom: 12px;
        }
        .bet-foot ul {
          list-style: none;
          margin: 0; padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bet-foot li {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.78);
        }
        .bet-foot li b { color: #fff; font-weight: 600; margin-right: 6px; }

        /* ════════════════════════════════════════════════════════
           Close
           ════════════════════════════════════════════════════════ */
        .sec-close { background: #fff; padding: 64px 0 96px; }
        .close-wrap { max-width: 720px; text-align: center; }
        .close-lede {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(22px, 2.2vw, 28px);
          letter-spacing: -0.012em;
          line-height: 1.4;
          color: var(--color-ink-950);
        }
        .close-lede a { color: var(--color-indigo-600); text-decoration: underline; text-underline-offset: 3px; }
        .close-row {
          margin-top: 28px;
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
}
