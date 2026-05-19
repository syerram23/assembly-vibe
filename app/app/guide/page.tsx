"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";

/* ────────────────────────────────────────────────────────────────────────────
 * Guide — "How to use Assembly" walkthrough. Long-form, illustrated.
 * Left rail of anchors · long scrolling right column.
 * ──────────────────────────────────────────────────────────────────────────── */

const sections = [
  { id: "what",     n: "01", label: "What Assembly is (and isn't)" },
  { id: "five",     n: "02", label: "The five-step path" },
  { id: "connect",  n: "03", label: "Connect your first data source" },
  { id: "build",    n: "04", label: "Build your first app" },
  { id: "help",     n: "05", label: "Get help when you need it" },
  { id: "promote",  n: "06", label: "Promote to production" },
  { id: "faq",      n: "07", label: "FAQ" },
] as const;

export default function GuidePage() {
  const [active, setActive] = useState<string>("what");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Guide"
        title="How to use Assembly"
        description="Read top to bottom — or jump to a section. About a 15-minute read."
      />

      <div className="gd-grid">
        <aside className="gd-rail">
          <span className="rail-eyebrow">ON THIS PAGE</span>
          <nav>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={active === s.id ? "on" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                      setActive(s.id);
                    }}
                  >
                    <span className="rail-n">{s.n}</span>
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="gd-col">
          {/* 1 · What Assembly is (and isn't) */}
          <section id="what">
            <SectionHead n="01" title="What Assembly is (and isn't)" />
            <div className="prose">
              <p>
                Assembly is an <b>enabling platform</b>. We give your team a governed data plane,
                a library of pre-built agents, identity and permissions, audit, and
                human-in-the-loop review — pre-built and stitched together so you don't
                have to. You write only the small part of the app that's unique to your business;
                the rest is already there.
              </p>
              <p>
                Assembly is not a vibe-coding sandbox where the LLM writes whatever it wants.
                Every app you build runs inside the governed plane: permissions are enforced,
                PII is masked at field level, every action is audited, and production releases
                go through a pre-flight checklist and an Org Admin gate.
              </p>
              <p>
                Assembly is not a SaaS replacement for Salesforce or Workday. It's the layer
                <i> in front of</i> your systems of record that lets you build the company-specific
                apps your teams need — apps that read from those systems, follow your policies,
                and ship in a week instead of a year.
              </p>
            </div>

            <div className="isnt-grid">
              <article className="isnt isnt-is">
                <h4>What Assembly is</h4>
                <ul>
                  <li>A governed data plane over your systems of record</li>
                  <li>A library of pre-built agents (conversational, search, docgen, system, browser, workflow)</li>
                  <li>A pre-flight checklist + Org Admin approval for every release</li>
                  <li>Tamper-evident audit log retained for 7 years</li>
                  <li>Bring-your-own-key for AI model providers</li>
                </ul>
              </article>
              <article className="isnt isnt-isnt">
                <h4>What Assembly isn't</h4>
                <ul>
                  <li>A no-code vibe-coding tool where the LLM writes unreviewed code</li>
                  <li>A SaaS that replaces your CRM, HRIS, or ERP</li>
                  <li>A black-box consultancy you pay for hours of bespoke work</li>
                  <li>A multi-tenant shared environment — every org is single-tenant</li>
                </ul>
              </article>
            </div>
          </section>

          {/* 2 · The five-step path */}
          <section id="five">
            <SectionHead n="02" title="The five-step path" />
            <p className="prose-lead">
              Every Assembly app follows the same five-step lifecycle. The same steps you saw
              on the marketing site — now click any one to jump to the module that runs it.
            </p>

            <div className="five-grid">
              {[
                { num: "01", title: "Scope",   desc: "Describe the outcome. Assembly sets up the governed data plane, connects systems, readies pre-built agents.", href: "/app/applications/new", cta: "Open Applications · New" },
                { num: "02", title: "Build",   desc: "Open Claude Code already pointed at your governed data + agents. Build the part unique to you.", href: "#",                       cta: "Press ⌘J to open" },
                { num: "03", title: "Finish",  desc: "Raise tickets for productionization or support when you hit something only an engineer can do.",                href: "/app/work",                cta: "Open Work" },
                { num: "04", title: "Approve", desc: "Pre-flight checklist + Org Admin approval. The gate to production.",                                              href: "/app/releases",            cta: "Open Releases" },
                { num: "05", title: "Live",    desc: "Your app is in production. Monitor it from Home. Roll back or raise change requests.",                            href: "/app",                     cta: "Open Home" },
              ].map((s) => (
                <Link key={s.num} href={s.href} className="five-card">
                  <span className="five-n">{s.num}</span>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                  <span className="five-cta">{s.cta} <span className="arr">→</span></span>
                </Link>
              ))}
            </div>
          </section>

          {/* 3 · Connect your first data source */}
          <section id="connect">
            <SectionHead n="03" title="Connect your first data source" />
            <p className="prose-lead">
              Before you can build an app, your data has to be in the governed plane. Five
              numbered steps — each takes about 30 seconds.
            </p>

            {[
              { n: 1, title: "Open Connectors", body: "From the sidebar, click Connectors. You'll see the catalog of pre-built connectors plus everything you've already connected.", art: <ArtConnectorsTab /> },
              { n: 2, title: "Choose your system", body: "Pick from Workday, Salesforce, Snowflake, Postgres, Slack, Google Workspace, Guidewire, and 24 more. Click the tile to start authentication.", art: <ArtConnectorCatalog /> },
              { n: 3, title: "Authenticate · OAuth", body: "Sign in with your admin account. Assembly never sees your password — only the OAuth token, scoped to read access by default.", art: <ArtOAuth /> },
              { n: 4, title: "Scope read access", body: "Pick which tables, channels, or folders Assembly can see. Default is least-privilege; you can expand later.", art: <ArtScope /> },
              { n: 5, title: "Confirm sync", body: "Assembly schedules the first sync. Field-level PII detection runs as records arrive. You'll see them in the data plane within minutes.", art: <ArtConfirm /> },
            ].map((step) => (
              <div key={step.n} className="numstep">
                <div className="numstep-l">
                  <span className="numstep-n">{step.n}</span>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                  <button type="button" className="btn btn-secondary">▶ Watch the 30-second tour</button>
                </div>
                <div className="numstep-r">{step.art}</div>
              </div>
            ))}
          </section>

          {/* 4 · Build your first app */}
          <section id="build">
            <SectionHead n="04" title="Build your first app" />
            <p className="prose-lead">
              Once data is in the plane and agents are ready, building is the small,
              app-specific part. Here's the walkthrough.
            </p>

            <ol className="walkthrough">
              <li>
                <div>
                  <h5>1 · Open Applications → New app</h5>
                  <p>Fill scoping: name the app, write one sentence on the outcome, pick the entities it'll read, pick the agents it'll use.</p>
                </div>
                <ArtAppScope />
              </li>
              <li>
                <div>
                  <h5>2 · The Build Context panel appears</h5>
                  <p>Assembly creates a repository in <code>assembly-vibe-orgs/&lt;your-org&gt;</code> with the framework already in place. The panel shows the MCP endpoint, the repo link, and the build credential.</p>
                </div>
                <ArtBuildContext />
              </li>
              <li>
                <div>
                  <h5>3 · Press ⌘J to open the Claude Code terminal</h5>
                  <p>The terminal opens as a right-side panel. It's pre-connected to your MCP endpoint and the framework code — no setup required.</p>
                </div>
                <ArtTerminal />
              </li>
              <li>
                <div>
                  <h5>4 · Describe what you want in plain English</h5>
                  <p>Type the outcome. Claude Code reads the framework, calls your governed data through MCP, and shows you what it's about to build before writing code.</p>
                </div>
              </li>
              <li>
                <div>
                  <h5>5 · Build the unique part</h5>
                  <p>The framework already does auth, audit, data access, agents. You write the small, business-specific logic and presentation.</p>
                </div>
              </li>
              <li>
                <div>
                  <h5>6 · Test in staging</h5>
                  <p>Push to your branch. Staging deploys automatically. No checklist required — staging is the sandbox.</p>
                </div>
              </li>
              <li>
                <div>
                  <h5>7 · When ready: raise for promotion</h5>
                  <p>Go to Releases. The pre-flight checklist runs. An Org Admin reviews and approves. Your app advances to production.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* 5 · Get help */}
          <section id="help">
            <SectionHead n="05" title="Get help when you need it" />
            <p className="prose-lead">
              You'll hit things that require an Assembly engineer — a migration, a custom integration,
              a tricky bug. Raise a ticket in Work. Here's how to decide.
            </p>

            <div className="tree">
              <div className="tree-q">
                <h4>Can you describe what you want in plain English to Claude Code?</h4>
              </div>
              <div className="tree-branches">
                <div className="tree-branch tree-yes">
                  <Pill tone="sage">YES</Pill>
                  <p><b>Build it yourself.</b> Open the terminal, describe it, iterate. You'll be faster than waiting.</p>
                </div>
                <div className="tree-branch tree-no">
                  <Pill tone="amber">NO · stuck</Pill>
                  <p><b>Raise a ticket.</b> Assembly engineers see it, triage, and assign.</p>
                </div>
              </div>
            </div>

            <div className="ticket-types">
              <article>
                <h5>Support</h5>
                <p>Something's <i>broken</i>. The voice channel keeps dropping calls. The Slack integration sends duplicates. The connector won't sync.</p>
                <small>Median first response: 2 hours · resolution depends on scope.</small>
              </article>
              <article>
                <h5>Productionization</h5>
                <p>Something <i>needs an engineer</i>. A custom data migration. A new connector that isn't in the catalog. A performance optimization beyond what the framework handles.</p>
                <small>Triage within 24 hours · scoped fixed-bid or T&M.</small>
              </article>
            </div>

            <div className="lifecycle-strip">
              <span className="lc-step">triage</span>
              <span className="lc-arr">→</span>
              <span className="lc-step">engineer assigned</span>
              <span className="lc-arr">→</span>
              <span className="lc-step">PR opens</span>
              <span className="lc-arr">→</span>
              <span className="lc-step">merge</span>
              <span className="lc-arr">→</span>
              <span className="lc-step strong">app advances</span>
            </div>
          </section>

          {/* 6 · Promote to production */}
          <section id="promote">
            <SectionHead n="06" title="Promote to production" />
            <p className="prose-lead">
              Production is gated. Every app — built by you, by a partner, or by Assembly — goes
              through the same pre-flight checklist and the same Org Admin approval.
            </p>

            <Card title="Pre-production checklist" subtitle="Five items, automated where possible, owned by a human where it matters.">
              <ol className="checklist">
                <li><span className="ck-num">1</span><div><b>Permissions tested via Access simulator</b><small>Run the app as Builder, Reviewer, Viewer. Confirm each role sees what it should.</small></div></li>
                <li><span className="ck-num">2</span><div><b>PII / sensitive data reviewed</b><small>Field-level masking confirmed. No accidental exposure of SSN, DOB, salary, claimant identifiers.</small></div></li>
                <li><span className="ck-num">3</span><div><b>Security scan clean</b><small>No known CVEs. No leaked secrets. Framework conformance pass.</small></div></li>
                <li><span className="ck-num">4</span><div><b>App owner assigned</b><small>A named human inside your org accepts ownership. The audit trail attributes every action to them.</small></div></li>
                <li><span className="ck-num">5</span><div><b>Environment confirmed</b><small>Production · us-east-1. Single-tenant. The Org Admin clicks confirm.</small></div></li>
              </ol>
            </Card>

            <div className="promote-flow">
              <div className="pf-step">
                <Pill tone="amber">GATE</Pill>
                <h5>Org Admin approval</h5>
                <p>An Admin in your org reviews the checklist and clicks Approve. This is the only path to production — there is no override.</p>
              </div>
              <div className="pf-arr">↓</div>
              <div className="pf-step">
                <Pill tone="indigo">VERSION</Pill>
                <h5>A version is cut</h5>
                <p>Assembly tags a new release (e.g. <code>v0.3.0</code>) tied to the approved commit. The version becomes the rollback target if you ever need it.</p>
              </div>
              <div className="pf-arr">↓</div>
              <div className="pf-step">
                <Pill tone="sage">LIVE</Pill>
                <h5>App becomes Live</h5>
                <p>The app deploys to production. Home and Activity show it. Users can use it.</p>
              </div>
              <div className="pf-arr">↓</div>
              <div className="pf-step">
                <Pill tone="neutral">CHANGE</Pill>
                <h5>Change requests for live apps</h5>
                <p>Want to modify a live app? Raise a Change Request. Same checklist, same gate. The previous version stays available for rollback.</p>
              </div>
            </div>
          </section>

          {/* 7 · FAQ */}
          <section id="faq">
            <SectionHead n="07" title="FAQ" />
            <p className="prose-lead">The questions we hear most often.</p>

            <ul className="faq">
              {[
                { q: "What if I want to leave?",                 a: "Assembly transfers the repository to your GitHub org. You take everything — the framework code, your app code, the vector index manifests. You're not locked in. The transfer is an explicit action you trigger from Settings → GitHub." },
                { q: "Where does my data live?",                  a: "Inside your environment. Assembly's compute runs on Assembly's AWS (us-east-1, single-tenant for your org). Your customer data stays in your systems — Salesforce, Snowflake, Workday, your Postgres — and is read on demand through governed connectors. Embeddings and audit trail are stored in your dedicated tenancy." },
                { q: "Who owns the repository?",                  a: "Assembly during the build, so we can enforce spec compliance and the pre-flight checklist. You on offboarding, via the explicit transfer action. If you'd rather own from day one, that's available on the Enterprise tier." },
                { q: "Can I bring my own AI model key?",          a: "Yes. Settings → API keys. Paste your Anthropic, OpenAI, Google, or Azure key. Per-request inference spend hits your provider account directly. Assembly only bills for platform compute (storage, sync, audit, agent infra)." },
                { q: "What if my app is wrong in production?",    a: "One-click rollback to any previous approved version from Releases. For longer-term fixes, raise a Change Request — it flows through the same checklist + Org Admin gate. The previous version stays running until you approve the new one." },
                { q: "How long does first-app take?",             a: "Median 1 week for a self-service team. The pre-built framework — auth, audit, data access, the agent library — means you write the ten percent unique to your business. The five-step path is designed to be walkthrough-able in a single afternoon for a small app." },
              ].map((item, i) => (
                <li key={i}>
                  <details>
                    <summary>
                      <span className="faq-q">{item.q}</span>
                      <span className="faq-caret">+</span>
                    </summary>
                    <p>{item.a}</p>
                  </details>
                </li>
              ))}
            </ul>

            <div className="cta-end">
              <h3>Still have questions?</h3>
              <p>Reach out — we read every message.</p>
              <a href="mailto:founders@assembly-industries.com" className="btn btn-primary">Email the founders <span className="arr">→</span></a>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .gd-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 48px;
          align-items: flex-start;
        }
        @media (max-width: 980px) { .gd-grid { grid-template-columns: 1fr; gap: 24px; } }

        .gd-rail { position: sticky; top: 100px; }
        .rail-eyebrow {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
          display: block;
          margin-bottom: 12px;
          padding-left: 12px;
        }
        .gd-rail nav ul { list-style: none; margin: 0; padding: 0; }
        .gd-rail nav a {
          display: flex;
          gap: 12px;
          align-items: baseline;
          padding: 8px 12px;
          font-size: 13.5px;
          color: var(--color-ink-500);
          border-radius: 8px;
          border-left: 2px solid transparent;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 2px;
        }
        .gd-rail nav a:hover { background: var(--color-ink-50); color: var(--color-ink-950); }
        .gd-rail nav a.on { color: var(--color-indigo-700); background: var(--color-indigo-50); border-left-color: var(--color-indigo-600); font-weight: 500; }
        .rail-n {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-400);
          letter-spacing: 0.04em;
        }
        .on .rail-n { color: var(--color-indigo-600); }
        @media (max-width: 980px) {
          .gd-rail { position: static; overflow-x: auto; }
          .gd-rail nav ul { display: flex; gap: 4px; }
          .gd-rail nav a { white-space: nowrap; padding: 6px 10px; font-size: 12.5px; }
          .rail-eyebrow { display: none; }
        }

        .gd-col { display: flex; flex-direction: column; gap: 56px; }
        .gd-col > section { scroll-margin-top: 80px; }

        .prose { max-width: 680px; font-size: 15.5px; line-height: 1.7; color: var(--color-ink-700); }
        .prose p { margin-bottom: 14px; }
        .prose b { color: var(--color-ink-950); }
        .prose-lead { max-width: 680px; font-size: 15.5px; line-height: 1.65; color: var(--color-ink-500); margin-bottom: 24px; }

        /* Is / isn't grid */
        .isnt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
        @media (max-width: 720px) { .isnt-grid { grid-template-columns: 1fr; } }
        .isnt { padding: 22px; border-radius: 12px; border: 1px solid; }
        .isnt h4 { font-size: 14px; font-family: var(--font-display); font-weight: 600; margin-bottom: 12px; letter-spacing: -0.005em; }
        .isnt ul { margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.65; color: var(--color-ink-700); }
        .isnt-is { background: rgba(214, 235, 219, 0.45); border-color: var(--color-sage-bg); }
        .isnt-is h4 { color: var(--color-sage-fg); }
        .isnt-isnt { background: var(--color-ink-50); border-color: var(--color-ink-200); }

        /* Five-step grid */
        .five-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        @media (max-width: 1200px) { .five-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .five-grid { grid-template-columns: 1fr; } }
        .five-card {
          padding: 20px;
          border: 1px solid var(--color-ink-200);
          border-radius: 12px;
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
          text-decoration: none;
        }
        .five-card:hover {
          border-color: var(--color-indigo-600);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -12px rgba(79, 70, 229, 0.18);
        }
        .five-n { font-family: var(--font-mono); font-size: 11px; color: var(--color-indigo-600); font-weight: 600; letter-spacing: 0.06em; }
        .five-card h4 { font-size: 15px; color: var(--color-ink-950); margin-top: 2px; }
        .five-card p { font-size: 12.5px; color: var(--color-ink-500); line-height: 1.55; flex: 1; }
        .five-cta { font-family: var(--font-mono); font-size: 11px; color: var(--color-indigo-700); margin-top: 6px; letter-spacing: 0.04em; }

        /* Numbered steps with artwork */
        .numstep {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 32px;
          align-items: flex-start;
          padding: 24px 0;
          border-top: 1px solid var(--color-ink-100);
        }
        .numstep:first-of-type { border-top: 0; padding-top: 8px; }
        @media (max-width: 900px) { .numstep { grid-template-columns: 1fr; gap: 18px; } }
        .numstep-l { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .numstep-n {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          font-family: var(--font-display);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .numstep-l h4 { font-family: var(--font-display); font-size: 17px; color: var(--color-ink-950); }
        .numstep-l p { font-size: 14px; line-height: 1.65; color: var(--color-ink-500); }
        .numstep-l .btn { font-size: 12.5px; padding: 8px 14px; }

        /* Screenshot frame */
        .screenshot {
          border: 1px solid var(--color-ink-200);
          border-radius: 12px;
          background: var(--color-ink-50);
          overflow: hidden;
          font-family: var(--font-mono);
          box-shadow: 0 1px 0 rgba(15,17,42,0.04), 0 24px 48px -24px rgba(15,17,42,0.12);
        }
        .ss-bar {
          background: #fff;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid var(--color-ink-100);
        }
        .ss-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--color-ink-200); }
        .ss-url { font-family: var(--font-mono); font-size: 10.5px; color: var(--color-ink-500); margin-left: 8px; }
        .ss-body { padding: 18px; background: #fff; min-height: 180px; }

        /* Walkthrough */
        .walkthrough { list-style: none; margin: 0; padding: 0; counter-reset: wt; display: flex; flex-direction: column; gap: 12px; }
        .walkthrough > li {
          padding: 18px 20px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 10px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 22px;
          align-items: center;
        }
        @media (max-width: 800px) { .walkthrough > li { grid-template-columns: 1fr; } }
        .walkthrough h5 { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--color-ink-950); margin-bottom: 4px; }
        .walkthrough p  { font-size: 13.5px; color: var(--color-ink-500); line-height: 1.6; }

        /* Decision tree */
        .tree { display: flex; flex-direction: column; align-items: center; padding: 24px; background: var(--color-ink-50); border: 1px solid var(--color-ink-100); border-radius: 12px; margin-bottom: 24px; }
        .tree-q { background: #fff; padding: 16px 22px; border-radius: 10px; border: 1px solid var(--color-ink-200); margin-bottom: 20px; }
        .tree-q h4 { font-family: var(--font-display); font-size: 15px; color: var(--color-ink-950); }
        .tree-branches { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; max-width: 720px; }
        @media (max-width: 640px) { .tree-branches { grid-template-columns: 1fr; } }
        .tree-branch { background: #fff; padding: 16px 18px; border-radius: 10px; border: 1px solid var(--color-ink-200); display: flex; flex-direction: column; gap: 10px; }
        .tree-yes { border-color: var(--color-sage-bg); }
        .tree-no { border-color: var(--color-amber-bg); }
        .tree-branch p { font-size: 13.5px; color: var(--color-ink-700); line-height: 1.55; }

        .ticket-types { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
        @media (max-width: 720px) { .ticket-types { grid-template-columns: 1fr; } }
        .ticket-types article { padding: 22px; border: 1px solid var(--color-ink-200); border-radius: 12px; background: #fff; }
        .ticket-types h5 { font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--color-ink-950); margin-bottom: 8px; }
        .ticket-types p { font-size: 13.5px; color: var(--color-ink-700); line-height: 1.6; }
        .ticket-types small { display: block; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--color-ink-100); font-family: var(--font-mono); font-size: 11px; color: var(--color-ink-500); }

        .lifecycle-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding: 14px 18px;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-200);
          border-radius: 12px;
          font-family: var(--font-mono);
          font-size: 12px;
        }
        .lc-step { color: var(--color-ink-700); padding: 4px 10px; border: 1px solid var(--color-indigo-200); border-radius: 999px; background: #fff; }
        .lc-step.strong { color: var(--color-indigo-700); font-weight: 600; border-color: var(--color-indigo-600); }
        .lc-arr { color: var(--color-indigo-600); }

        /* Promote checklist */
        .checklist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
        .checklist li { display: grid; grid-template-columns: 32px 1fr; gap: 14px; align-items: flex-start; }
        .ck-num {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 12px;
        }
        .checklist b { font-family: var(--font-display); font-size: 14.5px; font-weight: 600; color: var(--color-ink-950); }
        .checklist small { display: block; font-size: 12.5px; color: var(--color-ink-500); margin-top: 3px; line-height: 1.55; }

        /* Promote flow */
        .promote-flow { margin-top: 22px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .pf-step {
          width: 100%;
          max-width: 560px;
          padding: 18px 22px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pf-step h5 { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--color-ink-950); margin-top: 4px; }
        .pf-step p  { font-size: 13.5px; color: var(--color-ink-700); line-height: 1.6; }
        .pf-arr { color: var(--color-ink-400); font-size: 22px; font-family: var(--font-mono); }

        /* FAQ */
        .faq { list-style: none; margin: 0; padding: 0; }
        .faq li { border-bottom: 1px solid var(--color-ink-100); }
        .faq li:last-child { border-bottom: 0; }
        .faq details { padding: 18px 4px; }
        .faq summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        .faq summary::-webkit-details-marker { display: none; }
        .faq-q { font-family: var(--font-display); font-size: 16.5px; font-weight: 600; color: var(--color-ink-950); }
        .faq-caret {
          font-family: var(--font-mono);
          font-size: 20px;
          color: var(--color-ink-400);
          transition: transform 0.2s, color 0.15s;
        }
        .faq details[open] .faq-caret { transform: rotate(45deg); color: var(--color-indigo-600); }
        .faq details p { margin-top: 10px; max-width: 720px; font-size: 14.5px; line-height: 1.65; color: var(--color-ink-700); }

        .cta-end { margin-top: 40px; padding: 32px; background: var(--color-ink-950); color: #fff; border-radius: 16px; text-align: center; }
        .cta-end h3 { color: #fff; font-size: 22px; }
        .cta-end p { color: var(--color-ink-300); margin: 8px 0 20px; }
      `}</style>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tiny artwork helpers — styled "screenshot frames" with placeholder content.

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div style={{ marginBottom: 24, paddingBottom: 14, borderBottom: "1px solid var(--color-ink-100)" }}>
      <div style={{ display: "inline-flex", alignItems: "baseline", gap: 14 }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-indigo-600)",
          fontWeight: 600,
          letterSpacing: "0.08em",
        }}>{n}</span>
        <h2 style={{ fontSize: "clamp(22px, 2.4vw, 28px)" }}>{title}</h2>
      </div>
    </div>
  );
}

function ScreenshotFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="screenshot">
      <div className="ss-bar">
        <span className="ss-dot" />
        <span className="ss-dot" />
        <span className="ss-dot" />
        <span className="ss-url">{url}</span>
      </div>
      <div className="ss-body">{children}</div>
    </div>
  );
}

function ArtConnectorsTab() {
  return (
    <ScreenshotFrame url="app.assembly-industries.com/connectors">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {["workday · 1,247 rows", "salesforce · 8,402 rows", "snowflake · 1.84M rows"].map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--color-ink-50)", borderRadius: 6, fontSize: 11, color: "var(--color-ink-700)" }}>
            <code>{t}</code>
            <span style={{ color: "var(--color-sage-fg)" }}>● healthy</span>
          </div>
        ))}
      </div>
    </ScreenshotFrame>
  );
}

function ArtConnectorCatalog() {
  return (
    <ScreenshotFrame url="app.assembly-industries.com/connectors/catalog">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {["WD", "SF", "SN", "SL", "GW", "PG", "GO", "MS"].map((t) => (
          <div key={t} style={{
            aspectRatio: "1",
            background: "#fff",
            border: "1px solid var(--color-ink-200)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-ink-700)",
            fontWeight: 600,
          }}>
            {t}
          </div>
        ))}
      </div>
    </ScreenshotFrame>
  );
}

function ArtOAuth() {
  return (
    <ScreenshotFrame url="login.salesforce.com/oauth">
      <div style={{ textAlign: "center", padding: "10px 0", fontFamily: "var(--font-body)" }}>
        <div style={{ fontSize: 13, color: "var(--color-ink-950)", fontWeight: 600 }}>Authorize Assembly Industries</div>
        <div style={{ fontSize: 11, color: "var(--color-ink-500)", marginTop: 8, lineHeight: 1.5 }}>
          Read access to your selected Salesforce objects.<br />
          Assembly never sees your password.
        </div>
        <div style={{ marginTop: 14, padding: "8px 18px", background: "var(--color-indigo-600)", color: "#fff", borderRadius: 6, display: "inline-block", fontSize: 11, fontWeight: 600 }}>
          Allow access
        </div>
      </div>
    </ScreenshotFrame>
  );
}

function ArtScope() {
  return (
    <ScreenshotFrame url="app.assembly-industries.com/connectors/scope">
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {["accounts · read", "contacts · read", "opportunities · denied"].map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderBottom: "1px dashed var(--color-ink-100)", fontSize: 11 }}>
            <code>{t.split(" · ")[0]}</code>
            <span style={{
              color: t.includes("denied") ? "var(--color-warn-fg)" : "var(--color-sage-fg)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
            }}>{t.split(" · ")[1]}</span>
          </div>
        ))}
      </div>
    </ScreenshotFrame>
  );
}

function ArtConfirm() {
  return (
    <ScreenshotFrame url="app.assembly-industries.com/connectors/sync">
      <div style={{ textAlign: "center", padding: "14px 0" }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--color-sage-bg)",
          color: "var(--color-sage-fg)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 700,
          margin: "0 auto 10px",
          fontFamily: "var(--font-mono)",
        }}>✓</div>
        <div style={{ fontSize: 12, color: "var(--color-ink-950)", fontFamily: "var(--font-body)", fontWeight: 600 }}>First sync scheduled</div>
        <div style={{ fontSize: 10.5, color: "var(--color-ink-500)", marginTop: 6 }}>est. 4 minutes · field-level PII detection active</div>
      </div>
    </ScreenshotFrame>
  );
}

function ArtAppScope() {
  return (
    <ScreenshotFrame url="app.assembly-industries.com/applications/new">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 10, color: "var(--color-ink-500)", textTransform: "uppercase", letterSpacing: "0.14em" }}>name</div>
        <div style={{ padding: "6px 8px", background: "var(--color-ink-50)", borderRadius: 4, fontSize: 11, color: "var(--color-ink-950)" }}>fnol-intake</div>
        <div style={{ fontSize: 10, color: "var(--color-ink-500)", textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 4 }}>outcome</div>
        <div style={{ padding: "6px 8px", background: "var(--color-ink-50)", borderRadius: 4, fontSize: 11, color: "var(--color-ink-700)", lineHeight: 1.4 }}>Intake first-notice-of-loss claims on voice + text and open a Guidewire file.</div>
      </div>
    </ScreenshotFrame>
  );
}

function ArtBuildContext() {
  return (
    <ScreenshotFrame url="app.assembly-industries.com/applications/fnol-intake/build">
      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11 }}>
        <div style={{ color: "var(--color-ink-500)" }}>MCP endpoint</div>
        <code style={{ background: "var(--color-ink-50)", padding: "4px 8px", fontSize: 10, borderRadius: 4 }}>mcp://acme.assembly.io/app_fnol</code>
        <div style={{ color: "var(--color-ink-500)", marginTop: 4 }}>repository</div>
        <code style={{ background: "var(--color-ink-50)", padding: "4px 8px", fontSize: 10, borderRadius: 4 }}>github.com/assembly-vibe-orgs/acme/fnol-intake</code>
        <div style={{ color: "var(--color-ink-500)", marginTop: 4 }}>credential</div>
        <code style={{ background: "var(--color-ink-50)", padding: "4px 8px", fontSize: 10, borderRadius: 4 }}>asm_live_…0c11</code>
      </div>
    </ScreenshotFrame>
  );
}

function ArtTerminal() {
  return (
    <ScreenshotFrame url="claude-code · terminal">
      <div style={{
        background: "var(--color-ink-950)",
        color: "#A8AEEF",
        fontFamily: "var(--font-mono)",
        padding: 12,
        borderRadius: 6,
        fontSize: 10.5,
        lineHeight: 1.6,
      }}>
        <div style={{ color: "#8086EA" }}>$ claude --project fnol-intake</div>
        <div style={{ color: "#A8AEEF" }}>connected · mcp://acme/app_fnol · 4 entities, 6 agents</div>
        <div style={{ color: "#8086EA", marginTop: 6 }}>&gt; <span style={{ color: "#fff" }}>build the voice intake flow</span></div>
        <div style={{ color: "#A8AEEF", marginTop: 4 }}>reading framework · planning · 4 steps</div>
      </div>
    </ScreenshotFrame>
  );
}
