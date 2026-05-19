"use client";

import { use, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { workflows, workflowRuns, applications, userById } from "@/lib/mocks";

type Tab = "Visual" | "Config" | "Run history";
const TABS: Tab[] = ["Visual", "Config", "Run history"];

type StepType = "transform" | "policy" | "hitl" | "tool" | "surface";

interface Step {
  name: string;
  type: StepType;
  p95Ms: number;
  successCount: number;
  description: string;
}

const stepsByWf: Record<string, Step[]> = {
  wf_rege: [
    { name: "sample.population",       type: "transform", p95Ms: 1420, successCount: 484, description: "Stratified sample of disputed transactions for the quarter." },
    { name: "controls.evaluate",       type: "policy",    p95Ms: 3210, successCount: 484, description: "Apply CFPB §1005.11 controls; flag any deviations." },
    { name: "hitl.disposition",        type: "hitl",      p95Ms: 240_000, successCount: 471, description: "Reviewer dispositions borderline findings · SLA 48h." },
    { name: "report.cmp_generate",     type: "tool",      p95Ms: 8800, successCount: 471, description: "Generate compliance monitoring program report with citations." },
    { name: "notify.audit_committee",  type: "surface",   p95Ms: 980, successCount: 471, description: "Post to #compliance and email audit committee." },
  ],
  wf_fnol: [
    { name: "intake.voice_or_text",    type: "surface",   p95Ms: 720, successCount: 1208, description: "Caller routed to voice or text channel; identity verified." },
    { name: "policy.lookup",           type: "tool",      p95Ms: 410, successCount: 1208, description: "Lookup policy in Guidewire by phone + last name." },
    { name: "coverage.evaluate",       type: "policy",    p95Ms: 880, successCount: 1206, description: "State-aware coverage check (MN, WI, ND, IA, ID rules pack)." },
    { name: "details.collect",         type: "transform", p95Ms: 22_000, successCount: 1204, description: "Capture incident details, photos, third parties." },
    { name: "hitl.coverage-edge-case", type: "hitl",      p95Ms: 180_000, successCount: 38,  description: "Human review when coverage logic is ambiguous." },
    { name: "claim.open",              type: "tool",      p95Ms: 1240, successCount: 1204, description: "Open claim in Guidewire; attach evidence." },
    { name: "notify.adjuster",         type: "surface",   p95Ms: 580, successCount: 1204, description: "Assign adjuster; notify by SMS + email." },
    { name: "audit.log",               type: "policy",    p95Ms: 90,   successCount: 1208, description: "Write audit trail for the run." },
  ],
  wf_compband: [
    { name: "slack.parse",             type: "surface",   p95Ms: 220, successCount: 4280, description: "Parse the /comp slash command." },
    { name: "band.lookup",             type: "tool",      p95Ms: 340, successCount: 4280, description: "Lookup current band by role + location." },
    { name: "response.format",         type: "transform", p95Ms: 80,  successCount: 4280, description: "Format answer with cited band version." },
    { name: "slack.reply",             type: "surface",   p95Ms: 140, successCount: 4280, description: "Ephemeral reply to the requester." },
  ],
  wf_ar: [
    { name: "ar.scan",                 type: "transform", p95Ms: 1100, successCount: 0,    description: "Scan AR aging for invoices past due > 14 days." },
    { name: "tone.classify",           type: "policy",    p95Ms: 420, successCount: 0,    description: "Choose tone (firm/friendly/escalated) based on history." },
    { name: "draft.message",           type: "tool",      p95Ms: 980, successCount: 0,    description: "Draft outreach with PII redacted." },
    { name: "hitl.approve_outreach",   type: "hitl",      p95Ms: 60_000, successCount: 0, description: "Reviewer approves new tone categories." },
    { name: "send.email",              type: "surface",   p95Ms: 240, successCount: 0,    description: "Send to customer; log to audit." },
    { name: "followup.schedule",       type: "tool",      p95Ms: 160, successCount: 0,    description: "Schedule next touch per cadence policy." },
  ],
};

function defaultSteps(wfName: string): Step[] {
  return [
    { name: `${wfName}.start`, type: "surface",   p95Ms: 200, successCount: 0, description: "Workflow entrypoint." },
    { name: "data.load",        type: "transform", p95Ms: 800, successCount: 0, description: "Load source data." },
    { name: "policy.evaluate",  type: "policy",    p95Ms: 600, successCount: 0, description: "Apply governance + business rules." },
    { name: "tool.invoke",      type: "tool",      p95Ms: 1200, successCount: 0, description: "Invoke external action." },
    { name: "audit.log",        type: "policy",    p95Ms: 90,  successCount: 0, description: "Write audit trail." },
  ];
}

function typeTone(t: StepType): "indigo" | "sage" | "amber" | "neutral" {
  if (t === "hitl")    return "amber";
  if (t === "policy")  return "indigo";
  if (t === "tool")    return "sage";
  if (t === "transform") return "neutral";
  return "neutral";
}

function fmtP95(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60_000)}m`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtDuration(ms?: number) {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function genHistory(wfId: string, count: number) {
  let h = 17;
  for (let i = 0; i < wfId.length; i++) h = (h * 31 + wfId.charCodeAt(i)) & 0xffff;
  const rng = () => { h = (h * 1103515245 + 12345) & 0xffff; return h / 0xffff; };
  const baseTriggers = ["scheduler", "u_maria", "u_devon", "u_priya", "u_jordan", "webhook · slack", "webhook · sfdc"];
  const now = Date.parse("2026-05-18T18:51:00Z");
  const out = [];
  for (let i = 0; i < count; i++) {
    const minsAgo = i * 47 + Math.floor(rng() * 200);
    const startedAt = new Date(now - minsAgo * 60_000);
    const durationMs = Math.floor(rng() * 240_000) + 4_000;
    const statusRoll = rng();
    const status = statusRoll < 0.9 ? "Success" : statusRoll < 0.96 ? "Awaiting review" : "Failed";
    out.push({
      id: `wfr_${(h ^ i).toString(16).padStart(6, "0")}`,
      startedAt,
      status: status as "Success" | "Failed" | "Awaiting review",
      durationMs,
      triggeredBy: baseTriggers[i % baseTriggers.length],
    });
  }
  return out;
}

export default function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const wf = workflows.find((w) => w.id === id) ?? workflows[0];
  const [tab, setTab] = useState<Tab>("Visual");
  const app = wf.applicationId ? applications.find((a) => a.id === wf.applicationId) : null;
  const steps = stepsByWf[wf.id] ?? defaultSteps(wf.name);
  const runs = genHistory(wf.id, 18);
  const liveRun = workflowRuns.find((r) => r.workflowId === wf.id);

  return (
    <>
      <PageHeader
        eyebrow="Workflows · detail"
        title={wf.name}
        description={`Durable orchestration · ${wf.trigger} · ${wf.steps} steps · ${wf.successRate24h.toFixed(1)}% success (24h)`}
        actions={
          <>
            <Link href="/app/workflows" className="btn btn-ghost">← All workflows</Link>
            <span className={"toggle-pill " + (wf.active ? "on" : "")}>
              <span className="dot" />
              {wf.active ? "Active" : "Paused"}
            </span>
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

      {tab === "Visual" && (
        <section className="cols">
          <Card title="State machine" subtitle="Top-to-bottom flow. Click a step to inspect.">
            <div className="sm">
              {steps.map((s, i) => (
                <div key={s.name} className="sm-row">
                  <article className={"sm-step type-" + s.type}>
                    <div className="sm-step-l">
                      <span className="sm-step-i">{i + 1}</span>
                      <div>
                        <code>{s.name}</code>
                        <p>{s.description}</p>
                      </div>
                    </div>
                    <div className="sm-step-r">
                      <Pill tone={typeTone(s.type)}>{s.type}</Pill>
                      <span className="sm-meta">
                        <span><strong>p95</strong> {fmtP95(s.p95Ms)}</span>
                        <span><strong>ok</strong> {s.successCount.toLocaleString()}</span>
                      </span>
                    </div>
                  </article>
                  {i < steps.length - 1 && (
                    <div className="sm-arr" aria-hidden>
                      <span className="sm-arr-l" />
                      <span className="sm-arr-h">▼</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div className="side">
            <Card title="Bound app">
              {app ? (
                <Link href={`/app/applications/${app.id}`} className="app-card">
                  <code>{app.slug}</code>
                  <small>{app.description}</small>
                  <span className="muted">owner · {userById(app.ownerId)?.fullName ?? "—"}</span>
                </Link>
              ) : (
                <p className="muted">Not bound to an app yet.</p>
              )}
            </Card>

            <Card title="Step type legend">
              <ul className="legend">
                <li><Pill tone="neutral">transform</Pill> shape data</li>
                <li><Pill tone="indigo">policy</Pill> apply rules · audit</li>
                <li><Pill tone="amber">hitl</Pill> human gate</li>
                <li><Pill tone="sage">tool</Pill> external action</li>
                <li><Pill tone="neutral">surface</Pill> talk to a system</li>
              </ul>
            </Card>

            {liveRun?.status === "Running" && (
              <Card title="Live run">
                <p className="muted small">Currently executing this workflow:</p>
                <p><code className="run-id">{liveRun.id}</code></p>
                <p className="small">started · {fmtDate(liveRun.startedAt)}</p>
              </Card>
            )}
          </div>
        </section>
      )}

      {tab === "Config" && <ConfigTab wfName={wf.name} trigger={wf.trigger} />}

      {tab === "Run history" && (
        <Card title="Full run history" subtitle="Persisted on the durable workflow log. Every run has an audit trail.">
          <table className="runs">
            <thead>
              <tr>
                <th>Run id</th>
                <th>Started</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Triggered by</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id}>
                  <td className="mono small"><code>{r.id}</code></td>
                  <td className="mono small">{fmtDate(r.startedAt.toISOString())}</td>
                  <td>
                    <Pill tone={r.status === "Success" ? "sage" : r.status === "Failed" ? "warn" : "amber"}>
                      {r.status}
                    </Pill>
                  </td>
                  <td className="mono">{fmtDuration(r.durationMs)}</td>
                  <td className="mono small">{r.triggeredBy}</td>
                  <td className="actions-col">
                    <Link href="/app/activity" className="btn btn-ghost small">Audit log →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <style>{`
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
        .tab.on { color: var(--color-ink-950); border-bottom-color: var(--color-indigo-600); }

        .toggle-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          background: var(--color-ink-100);
          color: var(--color-ink-500);
        }
        .toggle-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-ink-400); }
        .toggle-pill.on { background: var(--color-sage-bg); color: var(--color-sage-fg); }
        .toggle-pill.on .dot {
          background: var(--color-sage-fg);
          animation: pulseDot 1.6s ease-in-out infinite;
        }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(47,107,64,.35);} 50%{box-shadow:0 0 0 4px rgba(47,107,64,0);} }

        .cols { display: grid; grid-template-columns: 1.7fr 1fr; gap: 20px; }
        @media (max-width: 1100px) { .cols { grid-template-columns: 1fr; } }
        .side { display: flex; flex-direction: column; gap: 20px; }

        .sm { display: flex; flex-direction: column; }
        .sm-row { display: flex; flex-direction: column; }
        .sm-step {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          padding: 16px 18px;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          background: #fff;
          transition: background .12s, border-color .12s;
        }
        .sm-step:hover {
          border-color: var(--color-indigo-400);
          background: var(--color-indigo-50);
        }
        .sm-step.type-hitl {
          background: rgba(252, 230, 194, 0.35);
          border-color: var(--color-amber-fg);
          border-style: dashed;
        }
        .sm-step.type-hitl:hover { background: rgba(252, 230, 194, 0.55); }
        .sm-step-l { display: flex; gap: 14px; align-items: flex-start; min-width: 0; }
        .sm-step-i {
          width: 26px; height: 26px;
          flex-shrink: 0;
          background: var(--color-indigo-100);
          color: var(--color-indigo-700);
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 11.5px;
          font-weight: 700;
        }
        .sm-step.type-hitl .sm-step-i {
          background: var(--color-amber-bg);
          color: var(--color-amber-fg);
        }
        .sm-step code {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          font-weight: 600;
        }
        .sm-step p {
          margin-top: 3px;
          color: var(--color-ink-500);
          font-size: 12.5px;
          line-height: 1.5;
        }
        .sm-step-r {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          flex-shrink: 0;
        }
        .sm-meta {
          display: inline-flex;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
        }
        .sm-meta strong {
          color: var(--color-ink-400);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 9.5px;
          margin-right: 3px;
        }

        .sm-arr {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 0;
          flex-direction: column;
        }
        .sm-arr-l {
          width: 1px;
          height: 12px;
          background: var(--color-ink-200);
        }
        .sm-arr-h {
          color: var(--color-ink-300);
          font-size: 10px;
          line-height: 1;
        }

        .app-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 14px;
          background: var(--color-ink-50);
          border-radius: 8px;
          text-decoration: none;
          transition: background .15s;
        }
        .app-card:hover { background: var(--color-indigo-50); }
        .app-card code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          font-weight: 600;
        }
        .app-card small { font-size: 12px; color: var(--color-ink-500); line-height: 1.45; }
        .app-card .muted {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-400);
          letter-spacing: 0.04em;
          margin-top: 4px;
        }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }
        .small { font-size: 12px; }
        .run-id {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-indigo-700);
          background: var(--color-indigo-50);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .legend { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .legend li {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--color-ink-700);
        }

        .runs { width: 100%; border-collapse: collapse; }
        .runs thead th {
          text-align: left;
          padding: 6px 16px 12px;
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .runs thead th:first-child { padding-left: 0; }
        .runs tbody tr { border-bottom: 1px solid var(--color-ink-100); transition: background .12s; }
        .runs tbody tr:last-child { border-bottom: 0; }
        .runs tbody tr:hover { background: var(--color-ink-50); }
        .runs td { padding: 13px 16px; font-size: 13px; color: var(--color-ink-700); vertical-align: middle; }
        .runs td:first-child { padding-left: 0; }
        .runs .mono { font-family: var(--font-mono); }
        .runs .small { font-size: 11.5px; color: var(--color-ink-500); }
        .runs code {
          background: transparent;
          padding: 0;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-950);
        }
        .actions-col { text-align: right; }
        .btn-ghost.small { padding: 6px 10px; font-size: 12.5px; }
      `}</style>
    </>
  );
}

// ─── Config tab ──────────────────────────────────────────────────────────────

function ConfigTab({ wfName, trigger }: { wfName: string; trigger: string }) {
  const [triggerKind, setTriggerKind] = useState<"cron" | "webhook">(trigger.startsWith("schedule") ? "cron" : "webhook");
  const [cron, setCron] = useState("0 0 1 */3 *");
  const [webhook, setWebhook] = useState(`https://api.assembly.io/wf/${wfName}/trigger`);
  const [maxRetries, setMaxRetries] = useState(3);
  const [backoff, setBackoff] = useState("exponential · 2x · max 5m");
  const [timeoutMin, setTimeoutMin] = useState(30);
  const [hitlRole, setHitlRole] = useState("Reviewer");

  return (
    <section className="cfg-cols">
      <Card title="Trigger" subtitle="How runs are initiated. Cron for scheduled; webhook for event-driven.">
        <div className="kind-toggle">
          <button type="button" className={"kt " + (triggerKind === "cron" ? "on" : "")} onClick={() => setTriggerKind("cron")}>
            Cron schedule
          </button>
          <button type="button" className={"kt " + (triggerKind === "webhook" ? "on" : "")} onClick={() => setTriggerKind("webhook")}>
            Webhook
          </button>
        </div>
        {triggerKind === "cron" ? (
          <label className="row">
            <span className="lbl">Cron expression</span>
            <input className="inp" value={cron} onChange={(e) => setCron(e.target.value)} />
            <small className="hint">Next run · Aug 1, 00:00 UTC · America/New_York</small>
          </label>
        ) : (
          <label className="row">
            <span className="lbl">Webhook URL</span>
            <input className="inp" value={webhook} onChange={(e) => setWebhook(e.target.value)} />
            <small className="hint">Authenticated with build credential · scope: workflow:trigger</small>
          </label>
        )}
      </Card>

      <Card title="Retry policy">
        <div className="form">
          <label className="row">
            <span className="lbl">Max retries</span>
            <input className="inp" type="number" min={0} max={10} value={maxRetries} onChange={(e) => setMaxRetries(parseInt(e.target.value || "0", 10))} />
          </label>
          <label className="row">
            <span className="lbl">Backoff</span>
            <input className="inp" value={backoff} onChange={(e) => setBackoff(e.target.value)} />
          </label>
          <label className="row">
            <span className="lbl">Step timeout</span>
            <div className="combo">
              <input className="inp" type="number" min={1} max={1440} value={timeoutMin} onChange={(e) => setTimeoutMin(parseInt(e.target.value || "0", 10))} />
              <span className="combo-suffix">minutes</span>
            </div>
          </label>
        </div>
      </Card>

      <Card title="HITL routing" subtitle="Which role gets the gate when a step needs human review.">
        <label className="row">
          <span className="lbl">Reviewer role</span>
          <select className="inp" value={hitlRole} onChange={(e) => setHitlRole(e.target.value)}>
            <option>Reviewer</option>
            <option>Admin</option>
            <option>Owner</option>
            <option>Builder + Reviewer</option>
          </select>
        </label>
        <label className="row">
          <span className="lbl">Default SLA</span>
          <input className="inp" defaultValue="48 hours · business hours only" />
        </label>
        <label className="row">
          <span className="lbl">Escalation</span>
          <input className="inp" defaultValue="If SLA breached → Owner + Slack #compliance" />
        </label>
      </Card>

      <div className="cfg-actions">
        <button type="button" className="btn btn-secondary">Cancel</button>
        <button type="button" className="btn btn-primary">Save configuration</button>
      </div>

      <style>{`
        .cfg-cols { display: flex; flex-direction: column; gap: 20px; }
        .kind-toggle {
          display: inline-flex;
          gap: 4px;
          padding: 3px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .kt {
          padding: 6px 14px;
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--color-ink-500);
          transition: background .15s, color .15s;
        }
        .kt.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15,17,42,.06), 0 6px 14px -8px rgba(15,17,42,.18);
        }

        .form { display: flex; flex-direction: column; gap: 14px; }
        .row { display: grid; grid-template-columns: 180px 1fr; gap: 14px; align-items: center; }
        @media (max-width: 720px) { .row { grid-template-columns: 1fr; } }
        .lbl {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
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
        .hint {
          grid-column: 2;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-400);
          margin-top: 2px;
        }
        .combo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .combo .inp { width: 100px; }
        .combo-suffix {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-500);
        }

        .cfg-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
      `}</style>
    </section>
  );
}
