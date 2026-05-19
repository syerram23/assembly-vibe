"use client";

import { use, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, StatTile, Pill, EmptyState } from "@/components/ui";
import { connectors, entities } from "@/lib/mocks";
import type { ConnectorStatus, Field } from "@/lib/types";
import { catalogItemFor, displayType, iconLetter, statusTone } from "../catalog";

type Tab = "overview" | "log" | "mapping" | "settings";

interface SyncRow {
  time: string;
  status: "Success" | "Failed" | "Running";
  records: number;
  duration: string;
  message: string;
}

function relativeTime(iso?: string): string {
  if (!iso) return "—";
  const now = new Date("2026-05-18T18:55:00Z").getTime();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function generateSyncHistory(connectorId: string, isError: boolean): SyncRow[] {
  const base = new Date("2026-05-18T18:42:00Z").getTime();
  const rows: SyncRow[] = [];
  const seed = connectorId.length;
  for (let i = 0; i < 30; i++) {
    const t = new Date(base - i * 60 * 60 * 1000 * (1 + (i % 3) * 0.25)).toISOString();
    const isLatestError = i === 0 && isError;
    const isOldFailure = !isError && i % 11 === 4;
    const status: SyncRow["status"] = isLatestError || isOldFailure ? "Failed" : i === 0 && !isError ? "Success" : "Success";
    const records = isLatestError ? 0 : Math.floor(((seed * 47 + i * 113) % 800) + 80);
    const durationMs = isLatestError ? 4_200 : Math.floor(((seed * 17 + i * 31) % 24000) + 1800);
    const duration = durationMs > 60_000 ? `${(durationMs / 60_000).toFixed(1)}m` : `${(durationMs / 1000).toFixed(1)}s`;
    const message = isLatestError
      ? "ECONNREFUSED · upstream timed out after 30s"
      : isOldFailure
      ? "Temporary rate limit · auto-retried 60s later"
      : i === 0
      ? "Incremental sync · change feed cursor advanced"
      : "Incremental sync · ok";
    rows.push({ time: t, status, records, duration, message });
  }
  return rows;
}

const SCHEDULE_LABEL = "Every hour";

export default function ConnectorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const connector = connectors.find((c) => c.id === id);
  const [tab, setTab] = useState<Tab>("overview");
  const [isPaused, setIsPaused] = useState(false);
  const [scope, setScope] = useState<"read-only" | "read+write">("read-only");
  const [displayName, setDisplayName] = useState(connector?.displayName ?? "");
  const [schedule, setSchedule] = useState(SCHEDULE_LABEL);

  if (!connector) {
    return (
      <>
        <PageHeader eyebrow="Connectors" title="Connector not found" description="This connector id doesn't exist or has been removed." />
        <Card>
          <EmptyState title="Nothing here" description="The connector you're looking for has been disconnected or never existed." cta={<Link href="/app/connectors" className="btn btn-secondary">Back to connectors</Link>} />
        </Card>
      </>
    );
  }

  const catalog = catalogItemFor(connector.type);
  const isError = connector.status === "Error";
  const syncHistory = generateSyncHistory(connector.id, isError);
  const linkedEntities = entities.filter((e) => e.source === connector.id);

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "log",      label: "Sync log" },
    { key: "mapping",  label: "Field mapping" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`Connectors · ${displayType(connector.type)}`}
        title={connector.displayName}
        description={catalog?.description ?? "Governed connector to your system of record."}
        actions={
          <>
            <button className="btn btn-secondary" type="button">Pause sync</button>
            <button className="btn btn-primary" type="button">Sync now</button>
          </>
        }
      />

      <div className="hero">
        <span className={"hero-ic hero-" + connector.type}>{iconLetter(connector.type)}</span>
        <div className="hero-meta">
          <span className="hero-name">{connector.displayName}</span>
          <span className="hero-sub">
            <code>{displayType(connector.type)}</code>
            <span className="sep">·</span>
            <span>{connector.scope}</span>
            <span className="sep">·</span>
            <span>{connector.recordCount?.toLocaleString() ?? "—"} rows</span>
          </span>
        </div>
        <div className="hero-status">
          <span className={"sd sd-" + connector.status.toLowerCase().replace(/\s+/g, "-")} />
          <Pill tone={statusTone(connector.status as ConnectorStatus)}>{connector.status}</Pill>
        </div>
      </div>

      {isError && (
        <div className="err-banner">
          <div className="err-l">
            <span className="err-ic">!</span>
            <div>
              <strong>Sync failing — last successful run was 3h 53m ago.</strong>
              <p>ECONNREFUSED · upstream Postgres host did not respond inside the 30s window. Two retries failed before paging.</p>
            </div>
          </div>
          <div className="err-r">
            <button className="btn btn-secondary" type="button">Edit credentials</button>
            <button className="btn btn-primary" type="button">Retry now</button>
          </div>
        </div>
      )}

      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={"tab " + (tab === t.key ? "on" : "")}
            onClick={() => setTab(t.key)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <>
          <section className="stats">
            <StatTile label="Records synced" value={connector.recordCount?.toLocaleString() ?? "—"} hint={isError ? "stale · last good 3h ago" : "as of last sync"} emphasis={isError ? "warn" : "default"} />
            <StatTile label="Last sync" value={relativeTime(connector.lastSyncAt)} hint={new Date(connector.lastSyncAt ?? "").toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} />
            <StatTile label="Schedule" value={SCHEDULE_LABEL} hint="incremental change feed" />
          </section>

          <Card title="Recent syncs" subtitle="Last 5 sync runs against this connector.">
            <ul className="timeline">
              {syncHistory.slice(0, 5).map((s, i) => (
                <li key={i} className={"tl tl-" + s.status.toLowerCase()}>
                  <span className="tl-time">{new Date(s.time).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="tl-status">
                    <Pill tone={s.status === "Success" ? "sage" : s.status === "Failed" ? "warn" : "indigo"}>{s.status}</Pill>
                  </span>
                  <span className="tl-records">{s.records.toLocaleString()} rows</span>
                  <span className="tl-duration">{s.duration}</span>
                  <span className="tl-msg">{s.message}</span>
                </li>
              ))}
            </ul>
          </Card>

          {linkedEntities.length > 0 && (
            <Card title="Feeds entities" subtitle="Entities in your data model populated by this connector.">
              <ul className="ent-list">
                {linkedEntities.map((e) => (
                  <li key={e.id}>
                    <Link href={`/app/data-model/${e.id}`} className="ent">
                      <span className="ent-name">
                        <code>{e.name}</code>
                        <small>{e.displayName}</small>
                      </span>
                      <span className="ent-rc">{e.recordCount.toLocaleString()} rows</span>
                      <span className="ent-arr">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}

      {tab === "log" && (
        <Card padding={0}>
          <table className="logtable">
            <thead>
              <tr>
                <th>Time</th>
                <th>Status</th>
                <th>Records synced</th>
                <th>Duration</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {syncHistory.map((s, i) => (
                <tr key={i}>
                  <td className="when">{new Date(s.time).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td><Pill tone={s.status === "Success" ? "sage" : s.status === "Failed" ? "warn" : "indigo"}>{s.status}</Pill></td>
                  <td className="num">{s.records.toLocaleString()}</td>
                  <td className="num">{s.duration}</td>
                  <td className="msg">{s.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "mapping" && (
        <Card
          title="Field mapping"
          subtitle="How fields from this source map into governed Assembly entities."
          actions={<button className="btn btn-secondary" type="button">Re-detect schema</button>}
        >
          {linkedEntities.length === 0 ? (
            <EmptyState
              title="No entities feed from this connector yet"
              description="Add at least one object to a governed entity in the Data model module."
              cta={<Link href="/app/data-model" className="btn btn-primary">Open data model →</Link>}
            />
          ) : (
            linkedEntities.map((e) => (
              <div key={e.id} className="fm-block">
                <div className="fm-h">
                  <code>{e.name}</code>
                  <small>{e.displayName} · {e.fields.length} fields</small>
                </div>
                <table className="fm-table">
                  <thead>
                    <tr>
                      <th>Source field</th>
                      <th>Assembly field</th>
                      <th>Type</th>
                      <th>Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {e.fields.map((f: Field) => (
                      <tr key={f.id}>
                        <td className="mono">{f.name}</td>
                        <td className="mono">{e.name}.{f.name}</td>
                        <td><Pill tone="neutral">{f.type}</Pill></td>
                        <td>
                          <span className="flags">
                            {f.required && <Pill tone="indigo">required</Pill>}
                            {f.isPII && <Pill tone="warn">PII</Pill>}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </Card>
      )}

      {tab === "settings" && (
        <div className="settings-grid">
          <Card title="Identity" subtitle="How this connector is labeled inside Assembly.">
            <label className="set-row">
              <span>Display name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>
            <label className="set-row">
              <span>Type</span>
              <input type="text" disabled value={displayType(connector.type)} />
            </label>
          </Card>

          <Card title="Scope" subtitle="What this connector is allowed to do on your behalf.">
            <div className="set-row">
              <span>Access</span>
              <div className="obj-toggle" role="tablist">
                {(["read-only", "read+write"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={"toggle " + (scope === opt ? "on" : "")}
                    onClick={() => setScope(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="set-row">
              <span>Sync schedule</span>
              <select value={schedule} onChange={(e) => setSchedule(e.target.value)}>
                <option>Every 5 min</option>
                <option>Every hour</option>
                <option>Every 6 hours</option>
                <option>Daily</option>
              </select>
            </div>
            <div className="set-row">
              <span>Paused</span>
              <label className="switch">
                <input type="checkbox" checked={isPaused} onChange={(e) => setIsPaused(e.target.checked)} />
                <span />
              </label>
            </div>
          </Card>

          <Card title="Danger zone" subtitle="Disconnecting a connector removes its credentials and stops all syncs.">
            <div className="danger">
              <div>
                <strong>Disconnect this connector</strong>
                <p>Removes all credentials. Any entity sourced from this connector will stop receiving updates immediately. Historical records remain queryable.</p>
              </div>
              <button className="btn btn-danger" type="button">Disconnect</button>
            </div>
          </Card>
        </div>
      )}

      <style>{`
        .bc { color: var(--color-ink-500); text-decoration: none; }
        .bc:hover { color: var(--color-ink-950); }
        .bc-sep { margin: 0 6px; color: var(--color-ink-300); }

        .hero {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 16px 18px;
          margin-bottom: 18px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
        }
        .hero-ic {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: var(--color-ink-100);
          color: var(--color-ink-700);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 18px;
        }
        .hero-salesforce, .hero-hubspot { background: #E0EEFF; color: #1A5E9E; }
        .hero-workday, .hero-bamboohr   { background: #E8E7F8; color: #3F37B8; }
        .hero-snowflake, .hero-postgres, .hero-bigquery { background: #DCEFF1; color: #1F6471; }
        .hero-slack, .hero-teams, .hero-email { background: #F5E6F3; color: #7A2266; }
        .hero-google, .hero-onedrive, .hero-s3 { background: #FBE9C9; color: #7A511A; }
        .hero-guidewire, .hero-duckcreek, .hero-bullhorn { background: #DDEEDD; color: #2F6B40; }
        .hero-meta { display: flex; flex-direction: column; gap: 3px; }
        .hero-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 16px;
          color: var(--color-ink-950);
          letter-spacing: -0.005em;
        }
        .hero-sub { font-family: var(--font-mono); font-size: 11px; color: var(--color-ink-500); display: inline-flex; gap: 6px; align-items: center; }
        .hero-sub code { font-size: 11px; padding: 1px 6px; }
        .sep { color: var(--color-ink-300); }
        .hero-status { display: inline-flex; gap: 8px; align-items: center; }
        .sd { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .sd-healthy { background: var(--color-sage-fg); }
        .sd-syncing { background: var(--color-indigo-600); animation: pulseDot 1.6s ease-in-out infinite; }
        .sd-error   { background: var(--color-warn-fg); }
        .sd-paused  { background: var(--color-amber-fg); }
        .sd-not-connected { background: var(--color-ink-300); }
        @keyframes pulseDot { 0%, 100% { box-shadow: 0 0 0 0 rgba(79,70,229,0.35); } 50% { box-shadow: 0 0 0 4px rgba(79,70,229,0); } }

        .err-banner {
          margin-bottom: 18px;
          padding: 14px 16px;
          background: rgba(251, 226, 223, 0.45);
          border: 1px solid var(--color-warn-bg);
          border-radius: var(--radius-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .err-l { display: flex; gap: 12px; align-items: flex-start; }
        .err-ic {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: var(--color-warn-fg);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }
        .err-l strong { color: var(--color-warn-fg); font-family: var(--font-display); font-size: 14px; }
        .err-l p { color: var(--color-ink-700); font-size: 12.5px; margin-top: 2px; line-height: 1.5; }
        .err-r { display: inline-flex; gap: 8px; }

        .tabs {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid var(--color-ink-100);
          margin-bottom: 24px;
        }
        .tab {
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-ink-500);
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.15s, border-color 0.15s;
        }
        .tab:hover { color: var(--color-ink-950); }
        .tab.on { color: var(--color-ink-950); border-bottom-color: var(--color-indigo-600); }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }
        @media (max-width: 760px) { .stats { grid-template-columns: 1fr; } }

        .timeline { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
        .tl {
          display: grid;
          grid-template-columns: 160px 100px 100px 60px 1fr;
          gap: 16px;
          padding: 12px 0;
          align-items: center;
          border-top: 1px solid var(--color-ink-100);
          font-size: 12.5px;
        }
        .tl:first-child { border-top: 0; padding-top: 0; }
        .tl-time { font-family: var(--font-mono); font-size: 11px; color: var(--color-ink-500); }
        .tl-records, .tl-duration { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-700); }
        .tl-msg { color: var(--color-ink-500); }
        @media (max-width: 980px) {
          .tl { grid-template-columns: 1fr; gap: 4px; padding: 12px 0; }
        }

        .ent-list { list-style: none; margin: 0; padding: 0; }
        .ent-list li { border-top: 1px solid var(--color-ink-100); }
        .ent-list li:first-child { border-top: 0; }
        .ent {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 12px;
          padding: 12px 0;
          align-items: center;
          text-decoration: none;
        }
        .ent:hover { background: var(--color-ink-50); }
        .ent-name { display: flex; flex-direction: column; gap: 1px; padding-left: 4px; }
        .ent-name code { font-family: var(--font-mono); font-size: 13px; color: var(--color-ink-950); font-weight: 600; background: transparent; padding: 0; }
        .ent-name small { font-size: 12px; color: var(--color-ink-500); }
        .ent-rc { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-500); }
        .ent-arr { color: var(--color-ink-400); padding-right: 4px; }

        .logtable { width: 100%; border-collapse: collapse; }
        .logtable thead th {
          text-align: left;
          padding: 14px 16px;
          background: var(--color-ink-50);
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .logtable tbody tr { border-bottom: 1px solid var(--color-ink-100); transition: background 0.12s; }
        .logtable tbody tr:hover { background: var(--color-ink-50); }
        .logtable td { padding: 12px 16px; font-size: 13px; color: var(--color-ink-700); }
        .when { font-family: var(--font-mono); font-size: 11px; color: var(--color-ink-500); }
        .num  { font-family: var(--font-mono); font-size: 12px; color: var(--color-ink-700); }
        .msg  { color: var(--color-ink-500); font-size: 12.5px; }

        .fm-block { margin-bottom: 28px; }
        .fm-block:last-child { margin-bottom: 0; }
        .fm-h {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 8px;
        }
        .fm-h code { font-family: var(--font-mono); font-size: 13px; color: var(--color-ink-950); font-weight: 600; background: transparent; padding: 0; }
        .fm-h small { font-size: 12px; color: var(--color-ink-500); font-family: var(--font-mono); }
        .fm-table { width: 100%; border-collapse: collapse; }
        .fm-table thead th {
          text-align: left;
          padding: 8px 12px;
          background: var(--color-ink-50);
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .fm-table tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .fm-table tbody tr:last-child { border-bottom: 0; }
        .fm-table td { padding: 10px 12px; font-size: 13px; color: var(--color-ink-700); vertical-align: middle; }
        .mono { font-family: var(--font-mono); font-size: 12px; color: var(--color-ink-950); }
        .flags { display: inline-flex; gap: 6px; }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 980px) { .settings-grid { grid-template-columns: 1fr; } }
        .settings-grid > :last-child { grid-column: 1 / -1; }

        .set-row {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 16px;
          align-items: center;
          padding: 10px 0;
          border-top: 1px solid var(--color-ink-100);
        }
        .set-row:first-child { border-top: 0; padding-top: 0; }
        .set-row > span:first-child {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .set-row input, .set-row select {
          font: inherit;
          font-size: 13px;
          padding: 8px 12px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          outline: 0;
          font-family: var(--font-mono);
        }
        .set-row input:focus, .set-row select:focus { border-color: var(--color-indigo-400); box-shadow: 0 0 0 4px rgba(79,70,229,0.08); }
        .set-row input:disabled { background: var(--color-ink-50); color: var(--color-ink-500); }

        .obj-toggle {
          display: inline-flex;
          padding: 3px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
          width: fit-content;
        }
        .toggle {
          padding: 5px 12px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--color-ink-500);
          border-radius: 999px;
        }
        .toggle.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15,17,42,.06), 0 4px 8px -4px rgba(15,17,42,.18);
        }

        .switch {
          position: relative;
          width: 36px;
          height: 20px;
          background: var(--color-ink-200);
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .switch input { opacity: 0; position: absolute; inset: 0; }
        .switch span {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.15s;
        }
        .switch input:checked ~ span { transform: translateX(16px); }
        .switch:has(input:checked) { background: var(--color-indigo-600); }

        .danger {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .danger strong { color: var(--color-warn-fg); font-family: var(--font-display); font-size: 14px; }
        .danger p { color: var(--color-ink-500); font-size: 12.5px; margin-top: 4px; line-height: 1.5; max-width: 480px; }
        .btn-danger {
          background: #fff;
          color: var(--color-warn-fg);
          border: 1px solid var(--color-warn-bg);
        }
        .btn-danger:hover {
          background: var(--color-warn-bg);
          color: var(--color-warn-fg);
        }
      `}</style>
    </>
  );
}
