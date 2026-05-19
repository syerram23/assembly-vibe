"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { workflows, workflowRuns, reviewQueue, userById, applications } from "@/lib/mocks";
import type { Workflow, WorkflowRun, ReviewItem } from "@/lib/types";

type Tab = "Workflows" | "Review inbox" | "Live runs";
const TABS: Tab[] = ["Workflows", "Review inbox", "Live runs"];

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtDuration(ms?: number) {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m ${rs}s`;
}

function runStatusTone(s: WorkflowRun["status"]): "sage" | "warn" | "amber" | "indigo" {
  if (s === "Success") return "sage";
  if (s === "Failed") return "warn";
  if (s === "Awaiting review") return "amber";
  return "indigo";
}

function slaInfo(slaDueAt: string) {
  const now = Date.parse("2026-05-18T19:00:00Z");
  const due = Date.parse(slaDueAt);
  const remaining = due - now;
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  return { remaining, h, m, warn: remaining < 2 * 3_600_000 };
}

const findingsMock = [
  { id: "F-217", account: "ACME-CB-882",  type: "§1005.11 — disputed transaction", flag: "10-day window narrowly missed (10d 14h)", risk: "medium" },
  { id: "F-218", account: "ACME-CB-1041", type: "§1005.11 — disputed transaction", flag: "Provisional credit not issued",            risk: "high" },
  { id: "F-219", account: "ACME-CB-1099", type: "§1005.11 — disputed transaction", flag: "Inv. completed but customer not notified",  risk: "medium" },
];

const fnolMock = [
  { k: "Caller state",        v: "Minnesota (driver), Wisconsin (vehicle reg.)" },
  { k: "Policy state",        v: "MN — bodily injury coverage applies" },
  { k: "Coverage ambiguity",  v: "WI accessorial limit lower than MN baseline" },
  { k: "Recommendation",      v: "Open MN claim with WI rider note" },
];

export default function WorkflowsHubPage() {
  const [tab, setTab] = useState<Tab>("Workflows");

  return (
    <>
      <PageHeader
        eyebrow="Workflows · orchestration"
        title="Workflows"
        description="Durable orchestrations on the platform. Build them once, watch them run, work the review inbox when humans are needed."
        actions={
          <>
            <button type="button" className="btn btn-secondary">Import workflow</button>
            <button type="button" className="btn btn-primary">+ New workflow</button>
          </>
        }
      />

      <nav className="tabs" role="tablist">
        {TABS.map((t) => {
          const badge =
            t === "Review inbox" ? reviewQueue.length :
            t === "Live runs"    ? workflowRuns.filter((r) => r.status === "Running").length :
            workflows.length;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={"tab " + (tab === t ? "on" : "")}
              onClick={() => setTab(t)}
            >
              {t}
              <span className={"tab-b " + (t === "Review inbox" && reviewQueue.length > 0 ? "warn" : "")}>{badge}</span>
            </button>
          );
        })}
      </nav>

      {tab === "Workflows" && <WorkflowsTab list={workflows} />}
      {tab === "Review inbox" && <ReviewInboxTab queue={reviewQueue} />}
      {tab === "Live runs" && <LiveRunsTab runs={workflowRuns} workflows={workflows} />}

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
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .tab:hover { color: var(--color-ink-950); }
        .tab.on { color: var(--color-ink-950); border-bottom-color: var(--color-indigo-600); }
        .tab-b {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--color-ink-100);
          color: var(--color-ink-500);
        }
        .tab-b.warn { background: var(--color-warn-bg); color: var(--color-warn-fg); }
        .tab.on .tab-b { background: var(--color-indigo-50); color: var(--color-indigo-700); }
      `}</style>
    </>
  );
}

// ─── Tab 1: Workflows ──────────────────────────────────────────────────────

function WorkflowsTab({ list }: { list: Workflow[] }) {
  return (
    <Card>
      <table className="wfs">
        <thead>
          <tr>
            <th>Name</th>
            <th>App</th>
            <th>Trigger</th>
            <th>Steps</th>
            <th>Success · 24h</th>
            <th>Last run</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((w) => {
            const app = applications.find((a) => a.id === w.applicationId);
            return (
              <tr key={w.id}>
                <td>
                  <Link href={`/app/workflows/${w.id}`} className="wf-name">
                    <code>{w.name}</code>
                  </Link>
                </td>
                <td>
                  {app ? (
                    <Link href={`/app/applications/${app.id}`} className="app-link">{app.name}</Link>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
                <td className="mono small">{w.trigger}</td>
                <td className="mono">{w.steps}</td>
                <td>
                  <span className="spark">
                    <span className="spark-bar"><span className="spark-fill" style={{ width: `${w.successRate24h}%` }} /></span>
                    <span className="spark-l">{w.successRate24h.toFixed(1)}%</span>
                  </span>
                </td>
                <td className="mono small">{w.lastRunAt ? fmtDate(w.lastRunAt) : "—"}</td>
                <td>
                  <span className={"toggle-pill " + (w.active ? "on" : "")}>
                    <span className="dot" />
                    {w.active ? "Active" : "Paused"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <style>{`
        .wfs { width: 100%; border-collapse: collapse; }
        .wfs thead th {
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
        .wfs thead th:first-child { padding-left: 0; }
        .wfs tbody tr {
          border-bottom: 1px solid var(--color-ink-100);
          transition: background .12s;
        }
        .wfs tbody tr:last-child { border-bottom: 0; }
        .wfs tbody tr:hover { background: var(--color-ink-50); }
        .wfs td { padding: 14px 16px; font-size: 13.5px; color: var(--color-ink-700); vertical-align: middle; }
        .wfs td:first-child { padding-left: 0; }
        .wf-name code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .app-link {
          color: var(--color-indigo-700);
          text-decoration: none;
          font-size: 13px;
        }
        .app-link:hover { text-decoration: underline; }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }
        .mono { font-family: var(--font-mono); }
        .small { font-size: 11.5px; color: var(--color-ink-500); }

        .spark { display: inline-flex; align-items: center; gap: 8px; }
        .spark-bar {
          width: 64px;
          height: 6px;
          background: var(--color-ink-100);
          border-radius: 999px;
          overflow: hidden;
        }
        .spark-fill {
          display: block;
          height: 100%;
          background: var(--color-sage-fg);
          border-radius: 999px;
        }
        .spark-l { font-family: var(--font-mono); font-size: 11px; color: var(--color-ink-700); }

        .toggle-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          background: var(--color-ink-100);
          color: var(--color-ink-500);
        }
        .toggle-pill .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--color-ink-400);
        }
        .toggle-pill.on {
          background: var(--color-sage-bg);
          color: var(--color-sage-fg);
        }
        .toggle-pill.on .dot {
          background: var(--color-sage-fg);
          animation: pulseDot 1.6s ease-in-out infinite;
        }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(47,107,64,.35);} 50%{box-shadow:0 0 0 4px rgba(47,107,64,0);} }
      `}</style>
    </Card>
  );
}

// ─── Tab 2: Review inbox ────────────────────────────────────────────────────

function ReviewInboxTab({ queue }: { queue: ReviewItem[] }) {
  const nearSLA = queue.filter((i) => slaInfo(i.slaDueAt).warn).length;
  return (
    <>
      <section className="ri-stats">
        <div className="stat-line">
          <span className="big">{queue.length}</span>
          <span className="lbl">in queue</span>
        </div>
        <div className="stat-sep" />
        <div className="stat-line">
          <span className={"big " + (nearSLA > 0 ? "warn" : "")}>{nearSLA}</span>
          <span className="lbl">nearing SLA</span>
        </div>
        <div className="stat-sep" />
        <div className="stat-line">
          <span className="big">4m 12s</span>
          <span className="lbl">avg disposition time</span>
        </div>
        <div className="stat-sep" />
        <div className="stat-line">
          <span className="big">98.4%</span>
          <span className="lbl">first-pass approval (30d)</span>
        </div>
      </section>

      <div className="ri-list">
        {queue.map((item) => {
          const sla = slaInfo(item.slaDueAt);
          const assignee = item.assigneeId ? userById(item.assigneeId) : null;
          return (
            <article key={item.id} className={"ri-card " + (sla.warn ? "warn" : "")}>
              <header>
                <div className="hl">
                  <Pill tone={sla.warn ? "warn" : "amber"}>HITL · {item.step.split(".")[1] ?? item.step}</Pill>
                  <h4>{item.applicationName} <span className="muted">·</span> <code>{item.step}</code></h4>
                </div>
                <div className="hr">
                  <span className={"sla " + (sla.warn ? "warn" : "")}>
                    SLA · {sla.remaining < 0 ? "overdue" : `${sla.h}h ${sla.m}m remaining`}
                  </span>
                  <span className="raised">raised {fmtDate(item.raisedAt)}</span>
                </div>
              </header>

              <p className="desc">{item.description}</p>

              {item.id === "rev_1" && (
                <div className="evidence">
                  <div className="ev-head">
                    <span className="ev-l">Borderline findings · 3 of 7 shown</span>
                    <button type="button" className="ev-more">View all 7 →</button>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Finding</th>
                        <th>Account</th>
                        <th>Type</th>
                        <th>Flag</th>
                        <th>Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {findingsMock.map((f) => (
                        <tr key={f.id}>
                          <td><code>{f.id}</code></td>
                          <td><code>{f.account}</code></td>
                          <td>{f.type}</td>
                          <td className="flag">{f.flag}</td>
                          <td><Pill tone={f.risk === "high" ? "warn" : "amber"}>{f.risk}</Pill></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {item.id === "rev_2" && (
                <div className="evidence">
                  <div className="ev-head">
                    <span className="ev-l">Coverage edge case · cross-state collision</span>
                    <button type="button" className="ev-more">Open in FNOL →</button>
                  </div>
                  <dl className="kvs">
                    {fnolMock.map((kv) => (
                      <div key={kv.k} className="kv">
                        <dt>{kv.k}</dt>
                        <dd>{kv.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <footer>
                <textarea className="comment" placeholder="Add a comment for the audit log (optional)…" rows={2} />
                <div className="actions">
                  <button type="button" className="btn btn-ghost">More info</button>
                  <button type="button" className="btn btn-ghost danger">Reject</button>
                  <button type="button" className="btn btn-secondary">Escalate</button>
                  <button type="button" className="btn btn-primary">Approve</button>
                </div>
                {assignee && (
                  <div className="assignee">
                    <span className="avatar" style={{ background: assignee.avatarColor }}>
                      {assignee.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                    <span className="muted">assigned · {assignee.fullName}</span>
                  </div>
                )}
              </footer>
            </article>
          );
        })}
      </div>

      <style>{`
        .ri-stats {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 16px 20px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: var(--radius-md);
          margin-bottom: 18px;
        }
        .stat-line { display: flex; flex-direction: column; gap: 2px; }
        .stat-line .big {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 22px;
          letter-spacing: -0.018em;
          color: var(--color-ink-950);
          line-height: 1;
        }
        .stat-line .big.warn { color: var(--color-warn-fg); }
        .stat-line .lbl {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .stat-sep { width: 1px; height: 28px; background: var(--color-ink-200); }

        .ri-list { display: flex; flex-direction: column; gap: 16px; }
        .ri-card {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-left: 3px solid var(--color-amber-fg);
          border-radius: var(--radius-lg);
          padding: 22px 24px;
        }
        .ri-card.warn { border-left-color: var(--color-warn-fg); background: linear-gradient(to right, rgba(251,226,223,0.18), #fff 30%); }
        .ri-card header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .hl { display: flex; flex-direction: column; gap: 8px; }
        .hl h4 {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 17px;
          letter-spacing: -0.012em;
          color: var(--color-ink-950);
          line-height: 1.3;
        }
        .hl code { background: transparent; padding: 0; font-family: var(--font-mono); font-size: 12.5px; color: var(--color-ink-500); }
        .hr {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          text-align: right;
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .sla {
          color: var(--color-amber-fg);
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .sla.warn { color: var(--color-warn-fg); }
        .raised { color: var(--color-ink-400); }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }
        .desc {
          font-size: 14px;
          color: var(--color-ink-700);
          margin: 8px 0 12px;
          line-height: 1.55;
        }

        .evidence {
          margin: 14px 0;
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          background: var(--color-ink-50);
          overflow: hidden;
        }
        .ev-head {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: #fff;
          border-bottom: 1px dashed var(--color-ink-100);
        }
        .ev-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .ev-more {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-indigo-700);
          font-weight: 600;
        }
        .evidence table { width: 100%; border-collapse: collapse; }
        .evidence thead th {
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
        .evidence td {
          padding: 8px 12px;
          font-size: 12.5px;
          color: var(--color-ink-700);
          border-bottom: 1px solid var(--color-ink-100);
        }
        .evidence tr:last-child td { border-bottom: 0; }
        .evidence code { background: transparent; padding: 0; font-size: 11.5px; color: var(--color-ink-950); }
        .evidence .flag { color: var(--color-warn-fg); font-size: 12px; }

        .kvs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 18px;
          padding: 12px;
        }
        @media (max-width: 720px) { .kvs { grid-template-columns: 1fr; } }
        .kv {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 8px;
          padding: 6px 0;
          border-bottom: 1px dashed var(--color-ink-100);
        }
        .kv:last-child, .kv:nth-last-child(2) { border-bottom: 0; }
        .kv dt {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .kv dd { font-size: 12.5px; color: var(--color-ink-700); margin: 0; }

        .ri-card footer { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
        .comment {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--color-ink-200);
          background: #fff;
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink-950);
          resize: vertical;
          outline: 0;
        }
        .comment:focus { border-color: var(--color-indigo-400); box-shadow: 0 0 0 4px rgba(79,70,229,0.08); }
        .actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
        .btn-ghost.danger:hover { background: var(--color-warn-bg); color: var(--color-warn-fg); }
        .assignee {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-end;
        }
        .avatar {
          width: 22px; height: 22px;
          border-radius: 50%;
          color: #fff;
          font-size: 9.5px;
          font-weight: 700;
          font-family: var(--font-mono);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.04em;
        }
      `}</style>
    </>
  );
}

// ─── Tab 3: Live runs ────────────────────────────────────────────────────────

function LiveRunsTab({ runs, workflows }: { runs: WorkflowRun[]; workflows: Workflow[] }) {
  const active = runs.find((r) => r.status === "Running");
  const activeWf = active ? workflows.find((w) => w.id === active.workflowId) : null;
  const sortedRuns = [...runs].sort((a, b) => b.startedAt.localeCompare(a.startedAt));

  return (
    <>
      {active && activeWf && (
        <Card>
          <div className="now">
            <div className="now-l">
              <div className="now-eyebrow">
                <span className="now-dot" />
                <span>Now running</span>
              </div>
              <h3><code>{activeWf.name}</code></h3>
              <div className="now-meta">
                <span><strong>started</strong> {fmtDate(active.startedAt)}</span>
                <span><strong>elapsed</strong> 8m 42s</span>
                <span><strong>projected</strong> ~5m remaining</span>
                <span><strong>trigger</strong> {activeWf.trigger}</span>
              </div>
            </div>
            <div className="now-r">
              <div className="step-now">
                <div className="step-now-l">current step</div>
                <code>hitl.coverage-edge-case</code>
                <Pill tone="amber">awaiting reviewer</Pill>
              </div>
              <button type="button" className="btn btn-secondary">Open run trace →</button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ height: 18 }} />

      <Card title="All runs" subtitle="Most recent first.">
        <table className="runs">
          <thead>
            <tr>
              <th>Workflow</th>
              <th>Started</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Run id</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sortedRuns.map((r) => {
              const w = workflows.find((x) => x.id === r.workflowId);
              return (
                <tr key={r.id}>
                  <td>
                    {w ? <Link href={`/app/workflows/${w.id}`} className="wf-link"><code>{w.name}</code></Link> : <span className="muted">—</span>}
                  </td>
                  <td className="mono small">{fmtDate(r.startedAt)}</td>
                  <td>
                    <span className="status-cell">
                      {r.status === "Running" && <span className="spinner" />}
                      <Pill tone={runStatusTone(r.status)}>{r.status}</Pill>
                    </span>
                  </td>
                  <td className="mono">{r.status === "Running" ? "—" : fmtDuration(r.durationMs)}</td>
                  <td className="mono small"><code>{r.id}</code></td>
                  <td className="actions-col">
                    <button type="button" className="btn btn-ghost small">Detail →</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <style>{`
        .now { display: grid; grid-template-columns: 1.6fr 1fr; gap: 24px; }
        @media (max-width: 900px) { .now { grid-template-columns: 1fr; } }
        .now-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-indigo-700);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .now-dot {
          width: 8px; height: 8px;
          background: var(--color-indigo-600);
          border-radius: 50%;
          animation: pulse 1.4s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(79,70,229,.5);} 50%{box-shadow:0 0 0 6px rgba(79,70,229,0);} }
        .now-l h3 {
          margin-bottom: 12px;
        }
        .now-l h3 code {
          font-family: var(--font-mono);
          font-size: 22px;
          background: transparent;
          padding: 0;
          color: var(--color-ink-950);
          font-weight: 600;
        }
        .now-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-700);
        }
        .now-meta strong {
          color: var(--color-ink-500);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 10px;
          margin-right: 8px;
        }
        .now-r {
          display: flex;
          flex-direction: column;
          gap: 12px;
          justify-content: space-between;
        }
        .step-now {
          padding: 14px 16px;
          border: 1px dashed var(--color-amber-fg);
          background: rgba(252,230,194,0.4);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .step-now-l {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-amber-fg);
          font-weight: 600;
        }
        .step-now code {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          font-weight: 600;
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
        .runs .wf-link { text-decoration: none; }
        .runs .wf-link code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          font-weight: 600;
        }
        .runs .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }
        .runs .mono { font-family: var(--font-mono); }
        .runs .small { font-size: 11.5px; color: var(--color-ink-500); }
        .status-cell { display: inline-flex; align-items: center; gap: 8px; }
        .spinner {
          width: 12px; height: 12px;
          border: 2px solid var(--color-indigo-200);
          border-top-color: var(--color-indigo-600);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .actions-col { text-align: right; }
        .btn-ghost.small { padding: 6px 10px; font-size: 12.5px; }
      `}</style>
    </>
  );
}
