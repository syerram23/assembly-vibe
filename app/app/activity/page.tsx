"use client";

import { useMemo, useState } from "react";
import { PageHeader, Card, Pill, StatTile } from "@/components/ui";
import { auditEvents, alerts, connectors, applications, userById } from "@/lib/mocks";
import type { AuditEvent, Alert } from "@/lib/types";

/* ────────────────────────────────────────────────────────────────────────────
 * Activity module — Audit log · Monitoring · Alerts · Usage
 * Tabbed shell. Each tab is a self-contained block.
 * ──────────────────────────────────────────────────────────────────────────── */

type Tab = "audit" | "monitoring" | "alerts" | "usage";

// Extend the seeded audit events with ~15 more so the table looks alive
const extraEvents: AuditEvent[] = [
  { id: "ae_7",  organizationId: "org_acme", actorId: "u_sasha",   actorName: "Sasha Whitfield",  action: "review.dispositioned",     target: "reg-e-quarterly-run · finding #4283", createdAt: "2026-05-18T18:51:00Z" },
  { id: "ae_8",  organizationId: "org_acme", actorId: "u_priya",   actorName: "Priya Iyer",       action: "application.updated",      target: "comp-band-bot · scoping",             createdAt: "2026-05-18T18:30:00Z" },
  { id: "ae_9",  organizationId: "org_acme", actorId: "u_devon",   actorName: "Devon Park",       action: "release.checklist.pass",   target: "fnol-intake / permissions-tested",    createdAt: "2026-05-18T10:00:00Z" },
  { id: "ae_10", organizationId: "org_acme", actorId: "u_jordan",  actorName: "Jordan Reyes",     action: "connector.scope.changed",  target: "google-workspace · drive: scoped",    createdAt: "2026-05-18T17:14:00Z" },
  { id: "ae_11", organizationId: "org_acme", actorId: "system",    actorName: "system",           action: "vector.reindex.completed", target: "policy-docs-v3 · 41,284 chunks",      createdAt: "2026-05-17T03:00:00Z" },
  { id: "ae_12", organizationId: "org_acme", actorId: "u_eng_omar",actorName: "Omar Bashir",      action: "hitl.assigned",            target: "fnol-intake · review #rev_2",         createdAt: "2026-05-18T18:52:00Z" },
  { id: "ae_13", organizationId: "org_acme", actorId: "u_devon",   actorName: "Devon Park",       action: "permission.role.assigned", target: "reviewer / sasha@acme.com",           createdAt: "2026-05-18T13:22:00Z" },
  { id: "ae_14", organizationId: "org_acme", actorId: "system",    actorName: "system",           action: "connector.sync.success",   target: "workday · 1,247 rows",                createdAt: "2026-05-18T18:42:00Z" },
  { id: "ae_15", organizationId: "org_acme", actorId: "u_maria",   actorName: "Maria Cordova",    action: "api_key.added",            target: "anthropic · production",              createdAt: "2025-11-05T10:00:00Z" },
  { id: "ae_16", organizationId: "org_acme", actorId: "u_jordan",  actorName: "Jordan Reyes",     action: "application.created",      target: "vendor-onboarding",                   createdAt: "2026-05-09T09:00:00Z" },
  { id: "ae_17", organizationId: "org_acme", actorId: "u_devon",   actorName: "Devon Park",       action: "application.created",      target: "contract-redline",                    createdAt: "2026-05-18T09:30:00Z" },
  { id: "ae_18", organizationId: "org_acme", actorId: "u_priya",   actorName: "Priya Iyer",       action: "workflow.run.started",     target: "comp-band-lookup · run #9182",        createdAt: "2026-05-18T18:51:00Z" },
  { id: "ae_19", organizationId: "org_acme", actorId: "u_eng_lin", actorName: "Lin Tao",          action: "pr.merged",                target: "comp-band-bot · pull/27",             createdAt: "2026-05-12T09:15:00Z" },
  { id: "ae_20", organizationId: "org_acme", actorId: "u_devon",   actorName: "Devon Park",       action: "alert.muted",              target: "review queue > 4h · 24h",             createdAt: "2026-05-18T07:00:00Z" },
  { id: "ae_21", organizationId: "org_acme", actorId: "system",    actorName: "system",           action: "connector.sync.error",     target: "postgres-risk-db · timeout (retry 2)",createdAt: "2026-05-18T15:20:00Z" },
  { id: "ae_22", organizationId: "org_acme", actorId: "u_maria",   actorName: "Maria Cordova",    action: "settings.updated",         target: "organization profile",                createdAt: "2026-05-15T11:14:00Z" },
  { id: "ae_23", organizationId: "org_acme", actorId: "u_sasha",   actorName: "Sasha Whitfield",  action: "review.dispositioned",     target: "reg-e-quarterly-run · finding #4284", createdAt: "2026-05-18T18:55:00Z" },
];

const allEvents = [...auditEvents, ...extraEvents].sort((a, b) =>
  b.createdAt.localeCompare(a.createdAt)
);

// Pre-pick a stable, "deterministic-feeling" 24-cell sync history per connector.
// (No randomness — uses a tiny seeded mask.)
function syncHistory(seed: string): boolean[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out: boolean[] = [];
  for (let i = 0; i < 24; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    // ~93% success unless connector is Error
    out.push((h % 100) > 7);
  }
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// Action tone — keeps the audit table readable at a glance.
function actionTone(action: string): "neutral" | "sage" | "indigo" | "amber" | "warn" {
  if (action.includes("error")) return "warn";
  if (action.includes("approved") || action.includes("release.")) return "indigo";
  if (action.startsWith("hitl") || action.includes("review.")) return "amber";
  if (action.includes("success") || action.includes("pass") || action.includes("merged")) return "sage";
  return "neutral";
}

function relTime(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const m = Math.round(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.round(d / 30);
  return `${mo}mo ago`;
}

export default function ActivityPage() {
  const [tab, setTab] = useState<Tab>("audit");

  return (
    <>
      <PageHeader
        eyebrow="Activity"
        title="Activity"
        description="Tamper-evident audit log. Sync and app errors. Configurable alerts. Per-app usage."
      />

      <div className="tabs" role="tablist">
        {([
          ["audit",      "Audit log",  allEvents.length.toString()],
          ["monitoring", "Monitoring", "1 open"],
          ["alerts",     "Alerts",     `${alerts.filter(a => a.active).length} active`],
          ["usage",      "Usage",      "last 30d"],
        ] as const).map(([id, label, sub]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={"tab " + (tab === id ? "on" : "")}
            onClick={() => setTab(id)}
          >
            <span>{label}</span>
            <span className="tab-sub">{sub}</span>
          </button>
        ))}
      </div>

      {tab === "audit"      && <AuditTab />}
      {tab === "monitoring" && <MonitoringTab />}
      {tab === "alerts"     && <AlertsTab />}
      {tab === "usage"      && <UsageTab />}

      <style>{`
        .tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .tab {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-ink-500);
          transition: background 0.15s, color 0.15s;
        }
        .tab:hover { color: var(--color-ink-950); }
        .tab.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 2px 8px -4px rgba(15, 17, 42, 0.08);
        }
        .tab-sub {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-ink-400);
        }
        .tab.on .tab-sub { color: var(--color-indigo-600); }
      `}</style>
    </>
  );
}

// ───────────────────────────────────────────────────────── Audit log ───────

function AuditTab() {
  const [actor, setActor] = useState("all");
  const [action, setAction] = useState("all");
  const [range, setRange] = useState("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const actors = useMemo(() => {
    const s = new Set(allEvents.map((e) => e.actorName));
    return ["all", ...Array.from(s)];
  }, []);
  const actions = useMemo(() => {
    const s = new Set(allEvents.map((e) => e.action));
    return ["all", ...Array.from(s).sort()];
  }, []);

  const rows = useMemo(() => {
    const now = Date.now();
    const cutoff =
      range === "Last hour" ? now - 60 * 60_000 :
      range === "Last 24h"  ? now - 24 * 60 * 60_000 :
      range === "Last 7d"   ? now - 7 * 24 * 60 * 60_000 :
      0;
    const q = query.trim().toLowerCase();
    return allEvents.filter((e) => {
      if (actor !== "all" && e.actorName !== actor) return false;
      if (action !== "all" && e.action !== action) return false;
      if (cutoff && new Date(e.createdAt).getTime() < cutoff) return false;
      if (q && !`${e.actorName} ${e.action} ${e.target}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [actor, action, range, query]);

  return (
    <>
      <div className="ax-filter">
        <div className="ax-search">
          <span aria-hidden>⌕</span>
          <input
            type="text"
            placeholder="Search audit log…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
        </div>
        <select value={actor} onChange={(e) => setActor(e.target.value)}>
          {actors.map((a) => <option key={a} value={a}>{a === "all" ? "All actors" : a}</option>)}
        </select>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          {actions.map((a) => <option key={a} value={a}>{a === "all" ? "All actions" : a}</option>)}
        </select>
        <div className="ax-pills">
          {["Last hour", "Last 24h", "Last 7d", "All"].map((r) => (
            <button
              key={r}
              type="button"
              className={"ax-pill " + (range === r ? "on" : "")}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="ax-spacer" />
        <button type="button" className="btn btn-secondary">Export</button>
        <button type="button" className="btn btn-secondary">Stream to SIEM</button>
      </div>

      <Card>
        <table className="ax-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const isOpen = expanded === e.id;
              const tone = actionTone(e.action);
              return (
                <>
                  <tr key={e.id} className={isOpen ? "ax-row-open" : ""}>
                    <td className="ax-when">{relTime(e.createdAt)}</td>
                    <td>
                      <span className="ax-actor">
                        <span className="ax-av" />
                        {e.actorName}
                      </span>
                    </td>
                    <td><Pill tone={tone}>{e.action}</Pill></td>
                    <td><code className="ax-target">{e.target}</code></td>
                    <td>
                      <button
                        type="button"
                        className="ax-more"
                        onClick={() => setExpanded(isOpen ? null : e.id)}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? "▾" : "…"}
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={e.id + "-x"} className="ax-expand">
                      <td colSpan={5}>
                        <div className="ax-meta-grid">
                          <div><span className="lbl">event id</span><code>{e.id}</code></div>
                          <div><span className="lbl">actor id</span><code>{e.actorId}</code></div>
                          <div><span className="lbl">org</span><code>{e.organizationId}</code></div>
                          <div><span className="lbl">timestamp</span><code>{e.createdAt}</code></div>
                          <div><span className="lbl">ip</span><code>10.42.0.{(e.id.length * 7) % 250}</code></div>
                          <div><span className="lbl">ua</span><code>Mozilla/5.0 · Chrome 126</code></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        <div className="ax-foot">
          <span>Showing 1–{rows.length} of 4,892 events</span>
          <span className="ax-sep">·</span>
          <span>retention: 7 years</span>
          <div className="ax-pager">
            <button type="button" className="btn btn-ghost" disabled>← Prev</button>
            <button type="button" className="btn btn-ghost">Next →</button>
          </div>
        </div>
      </Card>

      <style>{`
        .ax-filter {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
          align-items: center;
        }
        .ax-search {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 999px;
          padding: 8px 14px;
          min-width: 240px;
        }
        .ax-search span { color: var(--color-ink-400); font-family: var(--font-mono); }
        .ax-search input { background: transparent; border: 0; outline: none; font-size: 13.5px; width: 100%; }
        .ax-filter select {
          border: 1px solid var(--color-ink-200);
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 13px;
          background: #fff;
          font-family: var(--font-body);
          color: var(--color-ink-700);
        }
        .ax-pills { display: inline-flex; gap: 4px; background: var(--color-ink-50); border: 1px solid var(--color-ink-100); border-radius: 999px; padding: 3px; }
        .ax-pill { padding: 5px 12px; border-radius: 999px; font-size: 12px; color: var(--color-ink-500); }
        .ax-pill.on { background: #fff; color: var(--color-ink-950); box-shadow: 0 1px 2px rgba(15,17,42,0.06); }
        .ax-spacer { flex: 1; }

        .ax-table { width: 100%; border-collapse: collapse; }
        .ax-table thead th {
          text-align: left;
          padding: 8px 12px 10px;
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .ax-table tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .ax-table tbody tr:last-child { border-bottom: 0; }
        .ax-table td { padding: 12px; font-size: 13px; color: var(--color-ink-700); vertical-align: middle; }
        .ax-when { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-500); white-space: nowrap; }
        .ax-actor { display: inline-flex; align-items: center; gap: 8px; }
        .ax-av { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, var(--color-indigo-300), var(--color-indigo-600)); }
        .ax-target { font-family: var(--font-mono); font-size: 12px; background: transparent; padding: 0; color: var(--color-ink-950); }
        .ax-more { padding: 4px 10px; border-radius: 6px; color: var(--color-ink-500); }
        .ax-more:hover { background: var(--color-ink-50); color: var(--color-ink-950); }
        .ax-row-open { background: var(--color-indigo-50); }
        .ax-expand td { background: var(--color-ink-50); padding: 16px 22px; }
        .ax-meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 28px; }
        .ax-meta-grid > div { display: flex; flex-direction: column; gap: 3px; }
        .ax-meta-grid .lbl {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-400);
        }
        .ax-meta-grid code { background: transparent; padding: 0; font-size: 12px; color: var(--color-ink-950); }

        .ax-foot {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 0 0;
          margin-top: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
          border-top: 1px solid var(--color-ink-100);
        }
        .ax-sep { color: var(--color-ink-300); }
        .ax-pager { margin-left: auto; display: inline-flex; gap: 6px; }
        .ax-pager .btn { padding: 6px 12px; font-size: 12px; }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────── Monitoring ────────

interface Incident {
  id: string;
  severity: "P1" | "P2" | "P3";
  app: string;
  title: string;
  started: string;
  resolved?: string;
  status: "Open" | "Mitigated" | "Resolved";
}

const incidents: Incident[] = [
  {
    id: "inc_429",
    severity: "P2",
    app: "fnol-intake",
    title: "Voice channel dropouts after 6 minutes",
    started: "2026-05-18T17:08:00Z",
    status: "Open",
  },
  {
    id: "inc_428",
    severity: "P3",
    app: "postgres-risk-db",
    title: "Connector timeout · retry budget exceeded",
    started: "2026-05-18T15:02:00Z",
    resolved: "2026-05-18T15:48:00Z",
    status: "Mitigated",
  },
  {
    id: "inc_427",
    severity: "P3",
    app: "comp-band-bot",
    title: "Slack rate limit · queued 14 replies",
    started: "2026-05-17T11:30:00Z",
    resolved: "2026-05-17T11:39:00Z",
    status: "Resolved",
  },
];

function MonitoringTab() {
  return (
    <>
      <section className="mon-tiles">
        <StatTile label="Apps up" value="4 of 4" hint="production" emphasis="sage" />
        <StatTile label="Connectors healthy" value={`${connectors.filter(c => c.status === "Healthy").length} of ${connectors.length}`} hint="last sync within 10m" />
        <StatTile label="Avg latency p95" value="84ms" hint="trailing 1h" />
        <StatTile label="Errors · 24h" value="3" hint="1 open · 2 resolved" emphasis="warn" />
        <StatTile label="Uptime" value="99.96%" hint="trailing 30d" />
      </section>

      <Card title="Incidents" subtitle="Open and recent incidents across applications and connectors." actions={<button type="button" className="btn btn-ghost">Export →</button>}>
        <table className="inc-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Application / system</th>
              <th>Title</th>
              <th>Started</th>
              <th>Resolved</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id}>
                <td><Pill tone={inc.severity === "P1" ? "warn" : inc.severity === "P2" ? "amber" : "neutral"}>{inc.severity}</Pill></td>
                <td><code>{inc.app}</code></td>
                <td>{inc.title}</td>
                <td className="inc-time">{relTime(inc.started)}</td>
                <td className="inc-time">{inc.resolved ? relTime(inc.resolved) : "—"}</td>
                <td><Pill tone={inc.status === "Open" ? "warn" : inc.status === "Mitigated" ? "amber" : "sage"}>{inc.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Sync health" subtitle="Last 24 sync runs per connector." actions={<span className="mon-legend"><span className="lg-dot lg-ok" /> success <span className="lg-dot lg-fail" /> failed</span>}>
        <ul className="sync-list">
          {connectors.map((c) => {
            const bars = c.status === "Error"
              ? syncHistory(c.id).map((ok, i) => i >= 20 ? false : ok)
              : syncHistory(c.id);
            const ok = bars.filter(Boolean).length;
            return (
              <li key={c.id}>
                <div className="sync-l">
                  <code className="sync-name">{c.displayName}</code>
                  <span className="sync-rate">{ok}/{bars.length} ok</span>
                </div>
                <div className="sync-bars">
                  {bars.map((s, i) => <span key={i} className={"sync-bar " + (s ? "ok" : "fail")} title={s ? "Success" : "Failed"} />)}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <style>{`
        .mon-tiles {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 1100px) { .mon-tiles { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .mon-tiles { grid-template-columns: repeat(2, 1fr); } }

        .inc-table { width: 100%; border-collapse: collapse; }
        .inc-table thead th {
          text-align: left;
          padding: 8px 12px 10px;
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .inc-table tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .inc-table tbody tr:last-child { border-bottom: 0; }
        .inc-table td { padding: 12px; font-size: 13px; color: var(--color-ink-700); vertical-align: middle; }
        .inc-time { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-500); }

        .mon-legend { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 10.5px; color: var(--color-ink-500); letter-spacing: 0.08em; text-transform: uppercase; }
        .lg-dot { width: 8px; height: 8px; border-radius: 2px; display: inline-block; margin: 0 4px 0 8px; }
        .lg-ok { background: var(--color-sage-fg); }
        .lg-fail { background: var(--color-warn-fg); }

        .sync-list { list-style: none; margin: 0; padding: 0; }
        .sync-list li {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          padding: 12px 0;
          border-top: 1px solid var(--color-ink-100);
          align-items: center;
        }
        .sync-list li:first-child { border-top: 0; padding-top: 0; }
        .sync-l { display: flex; flex-direction: column; gap: 4px; }
        .sync-name { font-family: var(--font-mono); font-size: 13px; background: transparent; padding: 0; color: var(--color-ink-950); font-weight: 600; }
        .sync-rate { font-family: var(--font-mono); font-size: 10.5px; color: var(--color-ink-500); }
        .sync-bars { display: inline-flex; gap: 2px; }
        .sync-bar { display: inline-block; width: 8px; height: 22px; border-radius: 2px; background: var(--color-ink-200); }
        .sync-bar.ok { background: var(--color-sage-fg); }
        .sync-bar.fail { background: var(--color-warn-fg); }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────── Alerts ────────────

function AlertsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const detailFor = (a: Alert) => ({
    lastFired:
      a.id === "alrt_2" ? "2026-05-18T15:02:00Z" :
      a.id === "alrt_3" ? "2026-05-16T09:14:00Z" :
      a.id === "alrt_1" ? "2026-04-22T03:48:00Z" :
      "—",
    fired30d:
      a.id === "alrt_2" ? 4 :
      a.id === "alrt_3" ? 2 :
      a.id === "alrt_1" ? 1 :
      0,
    triggerDetail: a.trigger.includes("uptime")
      ? "Evaluated every 60s · pings the prod app router. Triggers when the 5-min rolling success rate drops below 99%."
      : a.trigger.includes("sync.failed")
      ? "Triggers on any connector sync run that ends in error status after the retry budget is spent."
      : a.trigger.includes("sla")
      ? "Triggers when a ticket of urgency=high passes its SLA window without status advancement."
      : "Triggers when a review item stays in the queue for more than 4 hours without disposition.",
  });

  return (
    <>
      <div className="al-bar">
        <span className="al-count">{alerts.filter(a => a.active).length} active · {alerts.filter(a => !a.active).length} paused</span>
        <button type="button" className="btn btn-primary">+ New alert</button>
      </div>

      <Card>
        <table className="al-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Trigger</th>
              <th>Channel</th>
              <th>Target</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => {
              const isOpen = expanded === a.id;
              const d = detailFor(a);
              return (
                <>
                  <tr key={a.id} className={"al-row " + (isOpen ? "al-row-open" : "")} onClick={() => setExpanded(isOpen ? null : a.id)}>
                    <td>{a.name}</td>
                    <td><code className="al-trig">{a.trigger}</code></td>
                    <td>
                      <span className="al-ch">
                        <span className={"al-ch-ic ic-" + a.channel}>
                          {a.channel === "email" ? "@" : a.channel === "slack" ? "#" : a.channel === "pagerduty" ? "PD" : "→"}
                        </span>
                        {a.channel}
                      </span>
                    </td>
                    <td><code className="al-target">{a.target}</code></td>
                    <td>
                      <span className={"al-toggle " + (a.active ? "on" : "")}><span className="al-knob" /></span>
                    </td>
                    <td className="al-caret">{isOpen ? "▾" : "▸"}</td>
                  </tr>
                  {isOpen && (
                    <tr key={a.id + "-x"} className="al-expand">
                      <td colSpan={6}>
                        <div className="al-detail">
                          <div>
                            <span className="lbl">trigger detail</span>
                            <p>{d.triggerDetail}</p>
                          </div>
                          <div>
                            <span className="lbl">last fired</span>
                            <code>{d.lastFired === "—" ? "never" : relTime(d.lastFired)}</code>
                          </div>
                          <div>
                            <span className="lbl">fired · last 30d</span>
                            <code>{d.fired30d} time{d.fired30d === 1 ? "" : "s"}</code>
                          </div>
                          <div className="al-actions">
                            <button type="button" className="btn btn-secondary">Edit</button>
                            <button type="button" className="btn btn-ghost">Mute 24h</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </Card>

      <style>{`
        .al-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .al-count { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-500); letter-spacing: 0.04em; }

        .al-table { width: 100%; border-collapse: collapse; }
        .al-table thead th {
          text-align: left;
          padding: 8px 12px 10px;
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .al-row { border-bottom: 1px solid var(--color-ink-100); cursor: pointer; transition: background 0.15s; }
        .al-row:hover { background: var(--color-ink-50); }
        .al-row td { padding: 14px 12px; font-size: 13.5px; color: var(--color-ink-700); vertical-align: middle; }
        .al-row-open { background: var(--color-indigo-50); }
        .al-row-open:hover { background: var(--color-indigo-50); }
        .al-trig, .al-target { font-family: var(--font-mono); font-size: 12px; background: transparent; padding: 0; color: var(--color-ink-950); }

        .al-ch { display: inline-flex; align-items: center; gap: 8px; }
        .al-ch-ic { width: 22px; height: 22px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; background: var(--color-ink-100); color: var(--color-ink-700); }
        .ic-slack { background: #4a154b; color: #fff; }
        .ic-pagerduty { background: #06ac38; color: #fff; }
        .ic-email { background: var(--color-indigo-100); color: var(--color-indigo-700); }
        .ic-webhook { background: var(--color-ink-950); color: #fff; }

        .al-toggle {
          display: inline-block;
          width: 36px;
          height: 20px;
          border-radius: 999px;
          background: var(--color-ink-200);
          position: relative;
          transition: background 0.15s;
        }
        .al-toggle.on { background: var(--color-indigo-600); }
        .al-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          transition: transform 0.15s;
        }
        .al-toggle.on .al-knob { transform: translateX(16px); }
        .al-caret { font-family: var(--font-mono); color: var(--color-ink-400); }

        .al-expand td { background: var(--color-ink-50); padding: 18px 22px; }
        .al-detail {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 24px;
          align-items: start;
        }
        .al-detail .lbl {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-400);
          display: block;
          margin-bottom: 4px;
        }
        .al-detail p { font-size: 13px; color: var(--color-ink-700); line-height: 1.5; }
        .al-detail code { background: transparent; padding: 0; font-size: 12px; color: var(--color-ink-950); font-family: var(--font-mono); }
        .al-actions { display: inline-flex; gap: 6px; }
        .al-actions .btn { padding: 6px 12px; font-size: 12px; }
        @media (max-width: 900px) { .al-detail { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────── Usage ─────────────

interface UsageRow {
  appId: string;
  runs24h: number;
  runs7d: number;
  runs30d: number;
  cost: number;
  latency: string;
  errors: number;
}

const usageRows: UsageRow[] = [
  { appId: "app_compband", runs24h: 142, runs7d: 985,  runs30d: 4_280,  cost: 22.40,  latency: "84ms",  errors: 0 },
  { appId: "app_rege",     runs24h: 14,  runs7d: 14,   runs30d: 14,     cost: 318.20, latency: "12.4s", errors: 2 },
  { appId: "app_fnol",     runs24h: 81,  runs7d: 522,  runs30d: 2_104,  cost: 144.80, latency: "3.1s",  errors: 1 },
  { appId: "app_ar",       runs24h: 0,   runs7d: 0,    runs30d: 0,      cost: 0,      latency: "—",     errors: 0 },
];

function UsageTab() {
  return (
    <>
      <section className="us-tiles">
        <StatTile label="Storage used"      value="4.2 GB"     hint="of 100 GB" />
        <StatTile label="Sync ops · 30d"    value="12,847"     hint="+18% vs prior" />
        <StatTile label="API calls · 30d"   value="142,083"    hint="across all apps" />
        <StatTile label="Active apps"       value={`${applications.filter(a => a.lifecycle === "Live").length}`} hint="in production" />
        <StatTile label="Compute hours · 30d" value="184 h"   hint="platform compute" />
      </section>

      <Card title="Per-application usage" subtitle="Compute, request volume, and error counts. Bring-your-own AI model key — usage below is platform compute only.">
        <table className="us-table">
          <thead>
            <tr>
              <th>Application</th>
              <th>Lifecycle</th>
              <th className="num">Runs · 24h</th>
              <th className="num">Runs · 7d</th>
              <th className="num">Runs · 30d</th>
              <th className="num">Cost · 30d</th>
              <th>Avg latency</th>
              <th className="num">Errors · 24h</th>
            </tr>
          </thead>
          <tbody>
            {usageRows.map((r) => {
              const app = applications.find((a) => a.id === r.appId)!;
              return (
                <tr key={r.appId}>
                  <td>
                    <div className="us-name">
                      <code>{app.slug}</code>
                      <small>owner · {userById(app.ownerId)?.fullName ?? "—"}</small>
                    </div>
                  </td>
                  <td><Pill tone={app.lifecycle === "Live" ? "sage" : "amber"}>{app.lifecycle}</Pill></td>
                  <td className="num">{r.runs24h.toLocaleString()}</td>
                  <td className="num">{r.runs7d.toLocaleString()}</td>
                  <td className="num">{r.runs30d.toLocaleString()}</td>
                  <td className="num">${r.cost.toFixed(2)}</td>
                  <td className="num">{r.latency}</td>
                  <td className="num">
                    {r.errors === 0
                      ? <span className="us-zero">0</span>
                      : <Pill tone="warn">{r.errors}</Pill>}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td />
              <td className="num">{usageRows.reduce((s,r) => s + r.runs24h, 0).toLocaleString()}</td>
              <td className="num">{usageRows.reduce((s,r) => s + r.runs7d, 0).toLocaleString()}</td>
              <td className="num">{usageRows.reduce((s,r) => s + r.runs30d, 0).toLocaleString()}</td>
              <td className="num">${usageRows.reduce((s,r) => s + r.cost, 0).toFixed(2)}</td>
              <td />
              <td className="num">{usageRows.reduce((s,r) => s + r.errors, 0)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="us-note">Bring-your-own AI model key · usage above is platform compute only. AI inference spend hits your provider account directly.</p>
      </Card>

      <style>{`
        .us-tiles {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 1100px) { .us-tiles { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .us-tiles { grid-template-columns: repeat(2, 1fr); } }

        .us-table { width: 100%; border-collapse: collapse; }
        .us-table thead th, .us-table tfoot td {
          text-align: left;
          padding: 8px 12px 10px;
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .us-table tfoot td {
          border-top: 1px solid var(--color-ink-200);
          border-bottom: 0;
          padding-top: 14px;
          color: var(--color-ink-950);
          font-size: 11px;
        }
        .us-table th.num, .us-table td.num { text-align: right; font-variant-numeric: tabular-nums; }
        .us-table tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .us-table tbody tr:last-child { border-bottom: 0; }
        .us-table td { padding: 14px 12px; font-size: 13px; color: var(--color-ink-700); vertical-align: middle; font-family: var(--font-mono); }
        .us-name { display: flex; flex-direction: column; gap: 2px; font-family: var(--font-body); }
        .us-name code { font-family: var(--font-mono); font-size: 13px; background: transparent; padding: 0; color: var(--color-ink-950); font-weight: 600; }
        .us-name small { font-size: 11.5px; color: var(--color-ink-500); }
        .us-zero { color: var(--color-ink-400); font-family: var(--font-mono); }
        .us-note {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px dashed var(--color-ink-100);
          font-size: 12.5px;
          color: var(--color-ink-500);
        }
      `}</style>
    </>
  );
}
