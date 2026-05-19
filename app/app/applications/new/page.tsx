"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { entities, agents, users } from "@/lib/mocks";

type Step = 1 | 2 | 3 | 4;

function slugify(name: string): string {
  const base = name.trim().toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "new-application";
}

export default function NewApplicationPage() {
  const [step, setStep] = useState<Step>(1);
  const [provisioned, setProvisioned] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [outcome, setOutcome] = useState("");
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [reviewerId, setReviewerId] = useState<string>("u_maria");

  const slug = useMemo(() => slugify(name), [name]);

  const toggle = (arr: string[], id: string) =>
    arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

  const canAdvance: Record<Step, boolean> = {
    1: name.trim().length > 1 && outcome.trim().length > 4,
    2: selectedEntities.length > 0,
    3: selectedAgents.length > 0,
    4: !!reviewerId,
  };

  const stepLabels = [
    { n: 1, label: "Name & outcome" },
    { n: 2, label: "Data & entities" },
    { n: 3, label: "Agents & tools" },
    { n: 4, label: "Reviewers & summary" },
  ] as const;

  if (provisioned) {
    return <ProvisionedScreen
      slug={slug || "claims-triage-bot"}
      name={name || "Claims triage bot"}
      reviewer={users.find((u) => u.id === reviewerId)}
      selectedEntities={selectedEntities}
      selectedAgents={selectedAgents}
    />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Applications · scoping"
        title="New application"
        description="Scope an outcome, pick the data and agents that make it real, and Assembly will provision a governed build context for Claude Code."
        actions={
          <Link href="/app/applications" className="btn btn-secondary">
            ← Back to applications
          </Link>
        }
      />

      <div className="stepper" aria-label="Scoping steps">
        {stepLabels.map((s, i) => {
          const state = s.n < step ? "done" : s.n === step ? "current" : "todo";
          return (
            <div key={s.n} className={"sx sx-" + state}>
              <span className="sx-n">{s.n < step ? "✓" : s.n}</span>
              <span className="sx-l">
                <small>Step {s.n} / 4</small>
                <b>{s.label}</b>
              </span>
              {i < stepLabels.length - 1 && <span className="sx-sep" aria-hidden />}
            </div>
          );
        })}
      </div>

      <Card>
        {step === 1 && (
          <div className="step">
            <h2 className="step-h">Name & outcome</h2>
            <p className="step-d">Give the app a short, memorable name. Then describe the outcome it should produce in plain language — Assembly uses this to scaffold the skills file.</p>

            <label className="lbl" htmlFor="appname">Application name</label>
            <input
              id="appname"
              className="inp"
              type="text"
              placeholder="e.g. Claims triage bot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              spellCheck={false}
            />
            <div className="slug-row">
              <span className="slug-l">Generated slug</span>
              <code className="slug-c">{slug}</code>
            </div>

            <label className="lbl" htmlFor="outcome">Describe the outcome in plain language</label>
            <textarea
              id="outcome"
              className="ta"
              rows={5}
              placeholder="When a new claim comes in, triage it against the carrier playbook, fetch supporting policy docs, and open a Guidewire file if coverage is confirmed. HITL for borderline cases."
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <h2 className="step-h">Data & entities</h2>
            <p className="step-d">Pick the governed entities this app will read. Reads always go through the data plane — PII rules and access policies apply automatically.</p>

            <div className="card-grid">
              {entities.map((e) => {
                const on = selectedEntities.includes(e.id);
                return (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => setSelectedEntities((arr) => toggle(arr, e.id))}
                    className={"pickcard " + (on ? "on" : "")}
                  >
                    <div className="pc-head">
                      <code className="pc-code">{e.name}</code>
                      <span className="pc-chk" aria-hidden>{on ? "✓" : ""}</span>
                    </div>
                    <div className="pc-title">{e.displayName}</div>
                    <div className="pc-meta">
                      <span>{e.recordCount.toLocaleString()} records</span>
                      <span className="dotsep">·</span>
                      <span>{e.fields.length} fields</span>
                    </div>
                    <div className="pc-foot">
                      {e.fields.filter((f) => f.isPII).length > 0 && (
                        <span className="pc-pill">{e.fields.filter((f) => f.isPII).length} PII fields</span>
                      )}
                      <span className="pc-pill ghost">{e.source ?? "manual"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step">
            <h2 className="step-h">Agents & tools</h2>
            <p className="step-d">Pick the building blocks. Agents come pre-configured and respect the same governance as your data.</p>

            <div className="card-grid">
              {agents.map((g) => {
                const on = selectedAgents.includes(g.id);
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setSelectedAgents((arr) => toggle(arr, g.id))}
                    className={"pickcard " + (on ? "on" : "")}
                  >
                    <div className="pc-head">
                      <span className="agent-code">{g.code}</span>
                      <span className="pc-chk" aria-hidden>{on ? "✓" : ""}</span>
                    </div>
                    <div className="pc-title">{g.name}</div>
                    <div className="pc-desc">{g.description}</div>
                    <div className="pc-foot">
                      <span className={"pc-pill " + (g.status === "Configured" ? "pcp-ok" : "ghost")}>
                        {g.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step">
            <h2 className="step-h">Reviewers & summary</h2>
            <p className="step-d">Assign a reviewer who will own the production approval gate. Then confirm everything before Assembly provisions the build context.</p>

            <label className="lbl" htmlFor="reviewer">Assigned reviewer</label>
            <select
              id="reviewer"
              className="sel"
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
            >
              {users
                .filter((u) => !u.fullName.includes("Assembly"))
                .map((u) => (
                  <option key={u.id} value={u.id}>{u.fullName} · {u.email}</option>
                ))}
            </select>

            <div className="summary-grid">
              <div className="sg-block">
                <span className="sg-l">Application</span>
                <code className="sg-c">{slug || "—"}</code>
                <p className="sg-p">{name || "Untitled"}</p>
              </div>
              <div className="sg-block">
                <span className="sg-l">Outcome</span>
                <p className="sg-p">{outcome || "—"}</p>
              </div>
              <div className="sg-block">
                <span className="sg-l">Entities</span>
                <div className="sg-pills">
                  {selectedEntities.length === 0 && <span className="sg-muted">none selected</span>}
                  {selectedEntities.map((id) => {
                    const e = entities.find((x) => x.id === id);
                    return e ? <Pill key={id} tone="indigo">{e.displayName}</Pill> : null;
                  })}
                </div>
              </div>
              <div className="sg-block">
                <span className="sg-l">Agents</span>
                <div className="sg-pills">
                  {selectedAgents.length === 0 && <span className="sg-muted">none selected</span>}
                  {selectedAgents.map((id) => {
                    const g = agents.find((x) => x.id === id);
                    return g ? <Pill key={id} tone="neutral">{g.code} · {g.name}</Pill> : null;
                  })}
                </div>
              </div>
              <div className="sg-block">
                <span className="sg-l">Reviewer</span>
                <p className="sg-p">{users.find((u) => u.id === reviewerId)?.fullName ?? "—"}</p>
              </div>
              <div className="sg-block">
                <span className="sg-l">Region · governance</span>
                <p className="sg-p">us-east-1 · org default policy bundle (PII v1.4, Reg E v2.1, Retention v1.0)</p>
              </div>
            </div>
          </div>
        )}

        <footer className="step-foot">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
            disabled={step === 1}
          >
            ← Back
          </button>
          {step < 4 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep((s) => ((s + 1) as Step))}
              disabled={!canAdvance[step]}
            >
              Continue <span className="arr">→</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setProvisioned(true)}
              disabled={!canAdvance[4]}
            >
              Provision app <span className="arr">→</span>
            </button>
          )}
        </footer>
      </Card>

      <style>{`
        .stepper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          margin-bottom: 20px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          padding: 14px 18px;
          position: relative;
        }
        .sx {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          position: relative;
          padding-right: 14px;
        }
        .sx-sep {
          position: absolute;
          right: 0; top: 50%;
          width: 1px; height: 20px;
          background: var(--color-ink-100);
          transform: translateY(-50%);
        }
        .sx-n {
          width: 26px; height: 26px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          background: var(--color-ink-100);
          color: var(--color-ink-500);
          flex-shrink: 0;
        }
        .sx-current .sx-n { background: var(--color-indigo-600); color: #fff; }
        .sx-done .sx-n { background: var(--color-sage-bg); color: var(--color-sage-fg); }
        .sx-l { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .sx-l small {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-400);
        }
        .sx-l b {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 13px;
          color: var(--color-ink-950);
          letter-spacing: -0.005em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sx-todo .sx-l b { color: var(--color-ink-400); }

        @media (max-width: 880px) {
          .stepper { grid-template-columns: 1fr 1fr; gap: 12px; }
          .sx-sep { display: none; }
        }
        @media (max-width: 540px) {
          .stepper { grid-template-columns: 1fr; }
        }

        .step { display: flex; flex-direction: column; gap: 6px; }
        .step-h {
          font-family: var(--font-display);
          font-size: 22px;
          letter-spacing: -0.014em;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .step-d {
          color: var(--color-ink-500);
          font-size: 14px;
          margin-bottom: 18px;
          max-width: 620px;
          line-height: 1.55;
        }

        .lbl {
          display: block;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--color-ink-500);
          margin: 12px 0 8px;
        }

        .inp, .ta, .sel {
          width: 100%;
          padding: 12px 14px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 10px;
          font-family: var(--font-body);
          font-size: 14.5px;
          color: var(--color-ink-950);
          outline: 0;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ta { font-family: var(--font-body); resize: vertical; min-height: 110px; line-height: 1.5; }
        .sel { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--color-ink-400) 50%), linear-gradient(135deg, var(--color-ink-400) 50%, transparent 50%); background-position: calc(100% - 18px) center, calc(100% - 13px) center; background-size: 5px 5px; background-repeat: no-repeat; padding-right: 36px; }
        .inp:focus, .ta:focus, .sel:focus {
          border-color: var(--color-indigo-400);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }

        .slug-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          padding: 8px 12px;
          background: var(--color-ink-50);
          border-radius: 8px;
          border: 1px dashed var(--color-ink-200);
        }
        .slug-l {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .slug-c {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          font-weight: 600;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
          margin-top: 8px;
        }
        .pickcard {
          text-align: left;
          padding: 16px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
          cursor: pointer;
        }
        .pickcard:hover { border-color: var(--color-indigo-300); transform: translateY(-1px); }
        .pickcard.on {
          border-color: var(--color-indigo-600);
          background: var(--color-indigo-50);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }
        .pc-head { display: flex; align-items: center; justify-content: space-between; }
        .pc-code {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 2px 8px;
          background: var(--color-ink-100);
          color: var(--color-ink-700);
          border-radius: 4px;
        }
        .pickcard.on .pc-code { background: var(--color-indigo-100); color: var(--color-indigo-700); }
        .agent-code {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 24px;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          border-radius: 5px;
        }
        .pickcard.on .agent-code { background: #fff; }
        .pc-chk {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: transparent;
          border: 1.5px solid var(--color-ink-200);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
        }
        .pickcard.on .pc-chk {
          background: var(--color-indigo-600);
          border-color: var(--color-indigo-600);
        }
        .pc-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 16px;
          color: var(--color-ink-950);
          letter-spacing: -0.008em;
          margin-top: 4px;
        }
        .pc-meta, .pc-desc {
          font-size: 12.5px;
          color: var(--color-ink-500);
          line-height: 1.5;
        }
        .pc-meta { font-family: var(--font-mono); font-size: 11.5px; display: inline-flex; gap: 6px; }
        .dotsep { color: var(--color-ink-300); }
        .pc-foot { display: inline-flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
        .pc-pill {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 2px 8px;
          background: var(--color-ink-50);
          color: var(--color-ink-500);
          border-radius: 999px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .pc-pill.ghost { background: transparent; border: 1px solid var(--color-ink-200); }
        .pc-pill.pcp-ok { background: var(--color-sage-bg); color: var(--color-sage-fg); }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 18px;
        }
        @media (max-width: 720px) { .summary-grid { grid-template-columns: 1fr; } }
        .sg-block {
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sg-l {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .sg-c {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          font-weight: 600;
        }
        .sg-p { font-size: 13.5px; color: var(--color-ink-700); line-height: 1.5; }
        .sg-pills { display: inline-flex; gap: 6px; flex-wrap: wrap; }
        .sg-muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 11px; }

        .step-foot {
          display: flex;
          justify-content: space-between;
          padding-top: 22px;
          margin-top: 22px;
          border-top: 1px solid var(--color-ink-100);
        }
        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .btn:disabled:hover { transform: none; }
      `}</style>
    </>
  );
}

// ─── Provisioned success screen ───────────────────────────────────────────

function ProvisionedScreen({
  slug,
  name,
  reviewer,
  selectedEntities,
  selectedAgents,
}: {
  slug: string;
  name: string;
  reviewer: { fullName: string; email: string } | undefined;
  selectedEntities: string[];
  selectedAgents: string[];
}) {
  const repoUrl = `https://github.com/assembly-vibe-orgs/acme/${slug}`;
  const mcpUrl = `https://mcp.assembly.io/orgs/acme/apps/${slug}`;
  const credToken = "asm_live_…" + Math.random().toString(16).slice(2, 6);

  const entityCodes = selectedEntities
    .map((id) => entities.find((e) => e.id === id)?.name)
    .filter(Boolean);
  const agentCodes = selectedAgents
    .map((id) => agents.find((a) => a.id === id))
    .filter(Boolean);

  const skillsMd = `# Skills · ${slug}

## Sources
${entityCodes.length > 0
  ? entityCodes.map((c) => `- ${c} (read-only · governed plane)`).join("\n")
  : "- workday.employees (read-only)\n- greenhouse.offers (read-only)"}

## Logic
- level_band_lookup(employee) → BandRange
- pii_redact(BandRange) → Redacted

## Surfaces
- slack /comp
- REST /v1/bands

## Conventions
- All data reads must go through the governed plane.
- All endpoint responses must include audit_id.
- All HITL gates must route to the assigned reviewer.`;

  return (
    <>
      <PageHeader
        eyebrow="Provisioned"
        title="Application provisioned"
        description={`${name} is ready. Connect Claude Code to the MCP endpoint and start building.`}
        actions={
          <Link href="/app/applications/app_new" className="btn btn-primary">
            Open application <span className="arr">→</span>
          </Link>
        }
      />

      <div className="grid">
        <Card title="Build context · ready">
          <div className="ctx-rows">
            <div className="ctx-row">
              <span className="ctx-l">Repository</span>
              <code className="ctx-v">{repoUrl}</code>
              <Pill tone="sage">Active</Pill>
            </div>
            <div className="ctx-row">
              <span className="ctx-l">MCP endpoint</span>
              <code className="ctx-v">{mcpUrl}</code>
              <Pill tone="indigo">Ready</Pill>
            </div>
            <div className="ctx-row">
              <span className="ctx-l">Build credential</span>
              <code className="ctx-v">{credToken}</code>
              <Pill tone="sage">Active</Pill>
            </div>
            <div className="ctx-row">
              <span className="ctx-l">Reviewer</span>
              <code className="ctx-v">{reviewer?.email ?? "—"}</code>
              <Pill tone="neutral">{reviewer?.fullName ?? "—"}</Pill>
            </div>
            <div className="ctx-row">
              <span className="ctx-l">Agents</span>
              <span className="ctx-v ctx-pills">
                {agentCodes.length === 0
                  ? <span className="muted">none</span>
                  : agentCodes.map((g) => (
                      g ? <span key={g.id} className="ag-chip" title={g.name}>{g.code}</span> : null
                    ))}
              </span>
              <Pill tone="neutral">{agentCodes.length} configured</Pill>
            </div>
          </div>
        </Card>

        <Card title="skills.md · scaffold" subtitle="Generated from your scoping. Edit this file from Claude Code to refine the app's behavior.">
          <pre className="code-block">{skillsMd}</pre>
        </Card>

        <Card title="What happens next">
          <ol className="nextlist">
            <li>
              <code>1</code>
              <span>
                <b>Open Claude Code</b> from the header (⌘J) — it'll connect to the MCP endpoint with your build credential.
              </span>
            </li>
            <li>
              <code>2</code>
              <span>
                <b>Iterate on skills.md</b>, agents, and policies. Every read goes through the governed data plane.
              </span>
            </li>
            <li>
              <code>3</code>
              <span>
                <b>Open a release</b> when you're ready. The release checklist runs and {reviewer?.fullName ?? "the assigned reviewer"} approves before production.
              </span>
            </li>
          </ol>
        </Card>
      </div>

      <style>{`
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .grid > :nth-child(3) { grid-column: 1 / -1; }
        @media (max-width: 1000px) { .grid { grid-template-columns: 1fr; } }

        .ctx-rows { display: flex; flex-direction: column; }
        .ctx-row {
          display: grid;
          grid-template-columns: 160px 1fr auto;
          gap: 14px;
          align-items: center;
          padding: 12px 0;
          border-top: 1px solid var(--color-ink-100);
        }
        .ctx-row:first-child { border-top: 0; padding-top: 0; }
        .ctx-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .ctx-v {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          word-break: break-all;
        }
        .ctx-pills { display: inline-flex; gap: 4px; flex-wrap: wrap; }
        .ag-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 22px;
          padding: 0 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          border-radius: 4px;
        }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }

        .code-block {
          font-family: var(--font-mono);
          font-size: 12.5px;
          line-height: 1.6;
          background: var(--color-ink-950);
          color: #E3E5EE;
          padding: 18px 20px;
          border-radius: 10px;
          overflow-x: auto;
          white-space: pre;
          margin: 0;
        }

        .nextlist {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .nextlist li {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 12px;
          align-items: flex-start;
        }
        .nextlist li > code {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          padding: 0;
        }
        .nextlist li b {
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--color-ink-950);
        }
        .nextlist li span { font-size: 13.5px; line-height: 1.55; color: var(--color-ink-700); }
      `}</style>
    </>
  );
}
