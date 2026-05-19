"use client";

import { use, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { agents, entities, applications, userById } from "@/lib/mocks";
import type { AgentStatus } from "@/lib/types";

type Tab = "Configuration" | "Data sources" | "Rules" | "Test" | "Runs";

const TABS: Tab[] = ["Configuration", "Data sources", "Rules", "Test", "Runs"];

function statusTone(status: AgentStatus): "sage" | "indigo" | "neutral" | "amber" {
  if (status === "Configured") return "sage";
  if (status === "Available") return "indigo";
  if (status === "Coming soon") return "amber";
  return "neutral";
}

// Mock data invented for the Runs table — synced to platform style.
const callerAppPool = ["comp-band-bot", "reg-e-quarterly-run", "fnol-intake", "ar-followup", "carrier-exception"];
const sampleInputs = [
  "Show me everyone in engineering at L5+",
  "What's the comp band for a Staff PM in NYC?",
  "Disposition 7 borderline findings from Q2 sample",
  "Open a Guidewire claim · auto · MN · file no. 8842",
  "Summarize claim 90218 with timeline",
  "Find prior cases involving §1005.11 disputes",
  "Lookup band for L6 design in SF",
  "Draft remediation memo for finding F-217",
  "Reconcile invoice INV-882 against AR ledger",
  "Search policy docs for chargeback handling",
];
const statusPool: { s: string; tone: "sage" | "warn" | "indigo" | "amber" }[] = [
  { s: "ok",      tone: "sage" },
  { s: "ok",      tone: "sage" },
  { s: "ok",      tone: "sage" },
  { s: "ok",      tone: "sage" },
  { s: "hitl",    tone: "amber" },
  { s: "ok",      tone: "sage" },
  { s: "failed",  tone: "warn" },
  { s: "ok",      tone: "sage" },
];

function makeRuns(seed: string) {
  // deterministic-ish pseudo-random per agent
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffff;
  const rng = () => { h = (h * 1103515245 + 12345) & 0xffff; return h / 0xffff; };
  const out = [];
  const now = Date.parse("2026-05-18T18:51:00Z");
  for (let i = 0; i < 20; i++) {
    const minsAgo = Math.floor(rng() * 720) + i * 3;
    const t = new Date(now - minsAgo * 60_000);
    const app = callerAppPool[Math.floor(rng() * callerAppPool.length)];
    const input = sampleInputs[Math.floor(rng() * sampleInputs.length)];
    const tokens = Math.floor(rng() * 3200) + 280;
    const latencyMs = Math.floor(rng() * 1800) + 120;
    const stat = statusPool[Math.floor(rng() * statusPool.length)];
    const auditId = `aud_${(h ^ i).toString(16).padStart(6, "0")}${i.toString(16).padStart(2, "0")}`;
    out.push({ t, app, input, tokens, latencyMs, stat, auditId });
  }
  return out;
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agent = agents.find((a) => a.id === id) ?? agents[0];
  const [tab, setTab] = useState<Tab>("Configuration");

  // Configuration tab state (visual only — real values, no save)
  const [agentName, setAgentName] = useState(agent.name);
  const [agentDesc, setAgentDesc] = useState(agent.description);
  const [model, setModel] = useState("Anthropic Claude 4 Sonnet");
  const [temp, setTemp] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [active, setActive] = useState(agent.status === "Configured");

  // Data sources tab
  const [grants, setGrants] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (agent.id === "agent_conv" || agent.id === "agent_search") init["ent_employee"] = true;
    if (agent.id === "agent_wf" || agent.id === "agent_docgen") init["ent_claim"] = true;
    return init;
  });

  // Rules tab
  const [rules, setRules] = useState({
    pii: true,
    hitl: true,
    cite: true,
    scope: true,
    audit: true,
  });

  // Test tab
  const [traceOpen, setTraceOpen] = useState(false);

  const runs = makeRuns(agent.id);
  const usedBy = applications.filter((a) => a.agentsUsed.includes(agent.id));

  return (
    <>
      <PageHeader
        eyebrow="Agents · configuration"
        title={agent.name}
        description={agent.description}
        actions={
          <>
            <span className="hcode">{agent.code}</span>
            <Pill tone={statusTone(agent.status)}>{agent.status}</Pill>
            <Link href="/app/agents" className="btn btn-ghost">← Library</Link>
          </>
        }
      />

      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={"tab " + (tab === t ? "on" : "")}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "Configuration" && (
        <section className="cols">
          <Card title="Identity & model" subtitle="Tune behavior; the wiring stays the same.">
            <div className="form">
              <label className="row">
                <span className="lbl">Agent name</span>
                <input className="inp" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
              </label>
              <label className="row">
                <span className="lbl">Description</span>
                <textarea className="inp ta" value={agentDesc} onChange={(e) => setAgentDesc(e.target.value)} rows={3} />
              </label>
              <label className="row">
                <span className="lbl">LLM model</span>
                <select className="inp" value={model} onChange={(e) => setModel(e.target.value)}>
                  <option>Anthropic Claude 4 Sonnet</option>
                  <option>Anthropic Claude 4 Opus</option>
                  <option>Anthropic Claude 3.5 Haiku</option>
                </select>
              </label>
              <label className="row">
                <span className="lbl">Temperature <code className="hint">{temp.toFixed(2)}</code></span>
                <div className="slider-wrap">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value))}
                  />
                  <span className="slider-scale">
                    <span>deterministic</span>
                    <span>creative</span>
                  </span>
                </div>
              </label>
              <label className="row">
                <span className="lbl">Max tokens</span>
                <input
                  className="inp"
                  type="number"
                  min={256}
                  max={32000}
                  step={256}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value || "0", 10))}
                />
              </label>
              <label className="row toggle-row">
                <span className="lbl">Active</span>
                <button type="button" className={"sw " + (active ? "on" : "")} onClick={() => setActive(!active)} aria-pressed={active}>
                  <span className="knob" />
                </button>
              </label>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary">Cancel</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </Card>

          <div className="side">
            <Card title="Usage" subtitle="Applications calling this agent right now.">
              {usedBy.length === 0 ? (
                <p className="muted">No application uses this agent yet.</p>
              ) : (
                <ul className="usedby">
                  {usedBy.map((a) => (
                    <li key={a.id}>
                      <code>{a.slug}</code>
                      <span className="muted">owner · {userById(a.ownerId)?.fullName ?? "—"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card title="What inherits automatically">
              <ul className="inherits">
                <li><span className="ic">✓</span> Audit trail on every invocation</li>
                <li><span className="ic">✓</span> Identity propagation (calling user, app, role)</li>
                <li><span className="ic">✓</span> PII detection &amp; masking (per Governance)</li>
                <li><span className="ic">✓</span> Rate limiting + retries</li>
                <li><span className="ic">✓</span> Per-app data scoping</li>
              </ul>
            </Card>
          </div>
        </section>
      )}

      {tab === "Data sources" && (
        <Card
          title="Data sources"
          subtitle="Grant access at the entity, field, and row level. Defaults to deny."
          actions={<button type="button" className="btn btn-secondary">+ Add knowledge source</button>}
        >
          <div className="ds-list">
            {entities.map((e) => {
              const granted = !!grants[e.id];
              return (
                <article key={e.id} className={"ds " + (granted ? "on" : "")}>
                  <header>
                    <label className="ds-grant">
                      <input
                        type="checkbox"
                        checked={granted}
                        onChange={() => setGrants({ ...grants, [e.id]: !granted })}
                      />
                      <span>
                        <code>entity:{e.name}</code>
                        <small>{e.displayName} · {e.recordCount.toLocaleString()} records</small>
                      </span>
                    </label>
                    <Pill tone={granted ? "sage" : "neutral"}>{granted ? "granted" : "denied"}</Pill>
                  </header>
                  <div className="ds-body">
                    <div className="ds-row">
                      <label className="lbl">Row-level scope</label>
                      <input
                        className="inp"
                        placeholder={`e.g.   ${e.name}.organization_id = $caller.org_id`}
                        defaultValue={
                          e.id === "ent_employee" ? "level >= 'L3' AND status = 'active'"
                          : e.id === "ent_claim"  ? "state IN ('open','in_review') AND opened_at >= now() - 90d"
                          : ""
                        }
                        disabled={!granted}
                      />
                    </div>
                    <div className="ds-row">
                      <label className="lbl">Fields visible</label>
                      <div className="fields">
                        {e.fields.map((f) => (
                          <label key={f.id} className={"field " + (granted ? "" : "off")}>
                            <input type="checkbox" defaultChecked={!f.isPII} disabled={!granted} />
                            <code>{f.name}</code>
                            <span className="ftype">{f.type}</span>
                            {f.isPII && <span className="pii-tag">PII</span>}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <style>{`
            .ds-list { display: flex; flex-direction: column; gap: 12px; }
            .ds {
              border: 1px solid var(--color-ink-200);
              border-radius: var(--radius-md);
              padding: 14px 16px;
              background: var(--color-ink-50);
              transition: background .15s, border-color .15s;
            }
            .ds.on { background: #fff; border-color: var(--color-indigo-200); }
            .ds header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 12px;
              padding-bottom: 10px;
              border-bottom: 1px dashed var(--color-ink-100);
              margin-bottom: 12px;
            }
            .ds-grant { display: inline-flex; align-items: flex-start; gap: 10px; cursor: pointer; }
            .ds-grant input { margin-top: 4px; }
            .ds-grant code {
              font-family: var(--font-mono);
              font-size: 13px;
              color: var(--color-ink-950);
              font-weight: 600;
              background: transparent;
              padding: 0;
            }
            .ds-grant small {
              display: block;
              font-size: 12px;
              color: var(--color-ink-500);
              margin-top: 2px;
            }
            .ds-body { display: flex; flex-direction: column; gap: 10px; }
            .ds-row { display: grid; grid-template-columns: 160px 1fr; gap: 12px; align-items: flex-start; }
            @media (max-width: 720px) { .ds-row { grid-template-columns: 1fr; } }
            .fields {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 6px 14px;
            }
            @media (max-width: 720px) { .fields { grid-template-columns: 1fr; } }
            .field {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-family: var(--font-mono);
              font-size: 12px;
              color: var(--color-ink-700);
            }
            .field.off { opacity: 0.4; }
            .field code {
              background: transparent;
              padding: 0;
              font-size: 12px;
              color: var(--color-ink-950);
            }
            .ftype {
              font-size: 10px;
              color: var(--color-ink-400);
              letter-spacing: 0.05em;
            }
            .pii-tag {
              font-family: var(--font-mono);
              font-size: 9.5px;
              padding: 1px 5px;
              border-radius: 3px;
              background: var(--color-warn-bg);
              color: var(--color-warn-fg);
              font-weight: 600;
              letter-spacing: 0.1em;
            }
          `}</style>
        </Card>
      )}

      {tab === "Rules" && (
        <Card
          title="Rules"
          subtitle="Every agent inherits these governance rules. Toggle off per-agent only if you have a documented exception."
          actions={<button type="button" className="btn btn-secondary">+ Add custom rule</button>}
        >
          <ul className="rules-list">
            {[
              { k: "pii",    name: "Redact PII from responses",                                  detail: "Mask SSN, DOB, salary, full name (outside org context) before returning to client. Inherits from Governance · PII policy.", inherit: true },
              { k: "hitl",   name: "Require HITL for actions affecting >100 records",            detail: "Any action whose blast radius exceeds 100 records routes to Review Inbox first.", inherit: true },
              { k: "cite",   name: "Cite sources in every response",                             detail: "Inline citation of which entity record / knowledge chunk contributed to each statement.", inherit: false },
              { k: "scope",  name: "Stay within data scope — no inference outside knowledge base", detail: "Refuse to extrapolate beyond granted entities + indexed sources.", inherit: true },
              { k: "audit",  name: "Log every conversation to audit",                            detail: "Full prompt, retrieved context, tool calls, response, and policy decisions to the immutable audit log.", inherit: true },
            ].map((r) => {
              const on = rules[r.k as keyof typeof rules];
              return (
                <li key={r.k}>
                  <div className="rule-l">
                    <div className="rule-name">
                      {r.name}
                      {r.inherit && <span className="ih">inherited</span>}
                    </div>
                    <p>{r.detail}</p>
                  </div>
                  <button
                    type="button"
                    className={"sw " + (on ? "on" : "")}
                    onClick={() => setRules({ ...rules, [r.k]: !on })}
                    aria-pressed={on}
                  >
                    <span className="knob" />
                  </button>
                </li>
              );
            })}
          </ul>

          <style>{`
            .rules-list { list-style: none; margin: 0; padding: 0; }
            .rules-list li {
              display: grid;
              grid-template-columns: 1fr auto;
              gap: 16px;
              align-items: center;
              padding: 16px 0;
              border-top: 1px solid var(--color-ink-100);
            }
            .rules-list li:first-child { border-top: 0; padding-top: 4px; }
            .rule-name {
              font-size: 14px;
              color: var(--color-ink-950);
              font-weight: 500;
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }
            .ih {
              font-family: var(--font-mono);
              font-size: 9.5px;
              padding: 1px 6px;
              border-radius: 3px;
              background: var(--color-indigo-50);
              color: var(--color-indigo-700);
              font-weight: 600;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
            .rule-l p {
              color: var(--color-ink-500);
              font-size: 12.5px;
              line-height: 1.5;
              margin-top: 4px;
              max-width: 620px;
            }
          `}</style>
        </Card>
      )}

      {tab === "Test" && (
        <section className="cols">
          <Card title="Playground" subtitle="Test the agent with the same data plane and rules that production gets.">
            <div className="chat">
              <div className="msg msg-user">
                <span className="msg-meta">you · 18:42</span>
                <p>Show me everyone in engineering at L5+</p>
              </div>
              <div className="msg msg-agent">
                <span className="msg-meta">{agent.name.toLowerCase()} · 18:42</span>
                <p>Returning 24 employees in engineering at level L5 or above. PII fields masked per org policy.</p>
                <div className="result">
                  <table>
                    <thead>
                      <tr>
                        <th>employee_id</th>
                        <th>full_name</th>
                        <th>level</th>
                        <th>department</th>
                        <th>location</th>
                        <th>base_salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "E-1042", n: "M••• C•••",     l: "L7", d: "Engineering · Platform",  loc: "NYC", s: "$•••,•••" },
                        { id: "E-2117", n: "D••• P•••",     l: "L6", d: "Engineering · Infra",     loc: "SF",  s: "$•••,•••" },
                        { id: "E-3041", n: "J••• R•••",     l: "L5", d: "Engineering · Apps",      loc: "NYC", s: "$•••,•••" },
                        { id: "E-3088", n: "P••• I•••",     l: "L6", d: "Engineering · Data",      loc: "AUS", s: "$•••,•••" },
                        { id: "E-4002", n: "S••• W•••",     l: "L5", d: "Engineering · Security",  loc: "REM", s: "$•••,•••" },
                      ].map((r) => (
                        <tr key={r.id}>
                          <td><code>{r.id}</code></td>
                          <td>{r.n}</td>
                          <td><Pill tone="indigo">{r.l}</Pill></td>
                          <td>{r.d}</td>
                          <td>{r.loc}</td>
                          <td className="masked">{r.s}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="result-foot">
                    <span className="masked-note">PII masked · per Governance · PII v1.4</span>
                    <span className="audit-id">audit_id · <code>aud_8e21f0a7</code></span>
                  </div>
                </div>
                <button type="button" className="trace-toggle" onClick={() => setTraceOpen(!traceOpen)}>
                  {traceOpen ? "▾ Hide trace" : "▸ Show trace"}
                </button>
                {traceOpen && (
                  <div className="trace">
                    <div className="trace-step">
                      <code className="trace-k">retrieved.chunks</code>
                      <span>3 chunks · policy-docs-v3 · 0.83/0.81/0.78 cosine</span>
                    </div>
                    <div className="trace-step">
                      <code className="trace-k">entity.query</code>
                      <span>SELECT * FROM employee WHERE level &gt;= &apos;L5&apos; AND department LIKE &apos;Engineering%&apos; · 24 rows</span>
                    </div>
                    <div className="trace-step">
                      <code className="trace-k">policy.applied</code>
                      <span>PII v1.4 — masked: full_name, base_salary, date_of_birth</span>
                    </div>
                    <div className="trace-step">
                      <code className="trace-k">model.call</code>
                      <span>Anthropic Claude 4 Sonnet · 1,847 in / 412 out · 1,118ms</span>
                    </div>
                    <div className="trace-step">
                      <code className="trace-k">response.time</code>
                      <span>1.41s total · ttfb 412ms</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="composer">
                <input className="inp" defaultValue="Show me everyone in engineering at L5+" />
                <button type="button" className="btn btn-primary">Send <span className="arr">→</span></button>
              </div>
            </div>
          </Card>

          <div className="side">
            <Card title="Sample prompts">
              <ul className="samples">
                <li>Show me everyone in engineering at L5+</li>
                <li>What&apos;s the comp band for a Staff Designer in NYC?</li>
                <li>How many open claims are out of state coverage?</li>
                <li>List recent CFPB §1005.11 disputes</li>
              </ul>
            </Card>
          </div>
        </section>
      )}

      {tab === "Runs" && (
        <Card title="Recent invocations" subtitle="Every call to this agent, by every app, on every channel — searchable, auditable.">
          <table className="runs">
            <thead>
              <tr>
                <th>Time</th>
                <th>Caller</th>
                <th>Input</th>
                <th>Tokens</th>
                <th>Latency</th>
                <th>Status</th>
                <th>Audit</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r, i) => (
                <tr key={i}>
                  <td className="mono small">{r.t.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td><code>{r.app}</code></td>
                  <td className="trim" title={r.input}>{r.input}</td>
                  <td className="mono">{r.tokens.toLocaleString()}</td>
                  <td className="mono">{r.latencyMs}ms</td>
                  <td><Pill tone={r.stat.tone}>{r.stat.s}</Pill></td>
                  <td className="mono small"><code>{r.auditId}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
          <style>{`
            .runs { width: 100%; border-collapse: collapse; }
            .runs thead th {
              text-align: left;
              padding: 6px 12px 12px;
              border-bottom: 1px solid var(--color-ink-100);
              font-family: var(--font-mono);
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--color-ink-500);
            }
            .runs thead th:first-child { padding-left: 0; }
            .runs tbody tr { border-bottom: 1px solid var(--color-ink-100); }
            .runs tbody tr:last-child { border-bottom: 0; }
            .runs td { padding: 12px; font-size: 13px; color: var(--color-ink-700); vertical-align: middle; }
            .runs td:first-child { padding-left: 0; }
            .runs td.mono, .runs td .mono { font-family: var(--font-mono); }
            .runs td.small { font-size: 11.5px; color: var(--color-ink-500); }
            .runs td.trim { max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .runs code { font-size: 11.5px; }
          `}</style>
        </Card>
      )}

      <style>{`
        .hcode {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 5px;
          background: var(--color-indigo-100);
          color: var(--color-indigo-700);
          letter-spacing: 0.06em;
        }

        .tabs {
          display: inline-flex;
          gap: 2px;
          border-bottom: 1px solid var(--color-ink-100);
          margin-bottom: 22px;
          margin-top: 6px;
          width: 100%;
        }
        .tab {
          padding: 10px 16px;
          font-family: var(--font-body);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-ink-500);
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color .15s, border-color .15s;
        }
        .tab:hover { color: var(--color-ink-950); }
        .tab.on {
          color: var(--color-ink-950);
          border-bottom-color: var(--color-indigo-600);
        }

        .cols {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 20px;
        }
        @media (max-width: 1100px) { .cols { grid-template-columns: 1fr; } }
        .side { display: flex; flex-direction: column; gap: 20px; }

        /* Form primitives */
        .form { display: flex; flex-direction: column; gap: 16px; }
        .row { display: grid; grid-template-columns: 180px 1fr; gap: 16px; align-items: center; }
        @media (max-width: 720px) { .row { grid-template-columns: 1fr; } }
        .lbl {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .lbl .hint {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 500;
          background: transparent;
          color: var(--color-indigo-700);
          padding: 0;
          margin-left: 6px;
          letter-spacing: 0;
        }
        .inp {
          padding: 9px 12px;
          border: 1px solid var(--color-ink-200);
          background: #fff;
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 13.5px;
          color: var(--color-ink-950);
          width: 100%;
          outline: 0;
        }
        .inp:focus { border-color: var(--color-indigo-400); box-shadow: 0 0 0 4px rgba(79,70,229,0.08); }
        .ta { resize: vertical; min-height: 72px; font-family: var(--font-body); line-height: 1.5; }
        .slider-wrap { display: flex; flex-direction: column; gap: 4px; }
        .slider-wrap input[type=range] { width: 100%; accent-color: var(--color-indigo-600); }
        .slider-scale {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--color-ink-400);
          letter-spacing: 0.08em;
        }
        .toggle-row { align-items: center; }
        .sw {
          width: 40px; height: 22px;
          background: var(--color-ink-200);
          border-radius: 999px;
          position: relative;
          transition: background .18s;
          flex-shrink: 0;
        }
        .sw .knob {
          position: absolute;
          top: 2px; left: 2px;
          width: 18px; height: 18px;
          background: #fff;
          border-radius: 50%;
          transition: transform .18s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .sw.on { background: var(--color-indigo-600); }
        .sw.on .knob { transform: translateX(18px); }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 12px;
          margin-top: 4px;
          border-top: 1px dashed var(--color-ink-100);
        }

        .usedby { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .usedby li {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          padding: 8px 0;
          border-top: 1px dashed var(--color-ink-100);
        }
        .usedby li:first-child { border-top: 0; padding-top: 0; }
        .usedby code {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
        }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 11px; }

        .inherits { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .inherits li {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--color-ink-700);
        }
        .ic {
          width: 18px; height: 18px;
          background: var(--color-sage-bg);
          color: var(--color-sage-fg);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }

        /* Chat / playground */
        .chat { display: flex; flex-direction: column; gap: 14px; }
        .msg {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          font-size: 13.5px;
          line-height: 1.55;
        }
        .msg-user {
          align-self: flex-end;
          max-width: 70%;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-200);
        }
        .msg-agent {
          background: #fff;
          border: 1px solid var(--color-ink-200);
        }
        .msg-meta {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-400);
          display: block;
          margin-bottom: 6px;
        }
        .result {
          margin-top: 12px;
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          overflow: hidden;
        }
        .result table { width: 100%; border-collapse: collapse; }
        .result thead th {
          background: var(--color-ink-50);
          text-align: left;
          padding: 7px 12px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          border-bottom: 1px solid var(--color-ink-100);
        }
        .result td {
          padding: 8px 12px;
          font-size: 12.5px;
          color: var(--color-ink-700);
          border-bottom: 1px solid var(--color-ink-100);
        }
        .result td code { background: transparent; padding: 0; font-size: 11.5px; }
        .result tr:last-child td { border-bottom: 0; }
        .result td.masked { font-family: var(--font-mono); color: var(--color-ink-400); letter-spacing: 0.04em; }
        .result-foot {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: var(--color-ink-50);
          border-top: 1px dashed var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
        }
        .masked-note { letter-spacing: 0.06em; }
        .audit-id code { background: transparent; padding: 0; font-size: 10.5px; color: var(--color-indigo-700); }
        .trace-toggle {
          margin-top: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-indigo-700);
          letter-spacing: 0.04em;
        }
        .trace {
          margin-top: 8px;
          padding: 10px 14px;
          background: var(--color-ink-50);
          border: 1px dashed var(--color-ink-200);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .trace-step { display: grid; grid-template-columns: 160px 1fr; gap: 12px; font-size: 12px; color: var(--color-ink-700); }
        .trace-k {
          font-family: var(--font-mono);
          font-size: 11px;
          background: transparent;
          padding: 0;
          color: var(--color-indigo-700);
        }
        .composer {
          display: flex;
          gap: 10px;
          align-items: center;
          padding-top: 12px;
          border-top: 1px dashed var(--color-ink-100);
        }
        .composer .inp { flex: 1; }

        .samples { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .samples li {
          padding: 9px 12px;
          background: var(--color-ink-50);
          border-radius: 6px;
          font-size: 12.5px;
          color: var(--color-ink-700);
          font-family: var(--font-mono);
          cursor: pointer;
          transition: background .15s;
        }
        .samples li:hover { background: var(--color-indigo-50); color: var(--color-indigo-700); }
      `}</style>
    </>
  );
}
