import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { connectors } from "@/lib/mocks";
import type { ConnectorStatus } from "@/lib/types";
import { CONNECTOR_CATALOG, statusTone, iconLetter, displayType } from "./catalog";

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

export default function ConnectorsPage() {
  const healthy = connectors.filter((c) => c.status === "Healthy").length;
  const errors = connectors.filter((c) => c.status === "Error").length;

  return (
    <>
      <PageHeader
        eyebrow="Connectors"
        title="Connectors"
        description="The catalog of systems Assembly can read from and write to — installed, healthy, and scoped to your governance posture."
        actions={
          <Link href="/app/connectors/new" className="btn btn-primary">
            + Add connector
          </Link>
        }
      />

      <div className="bar">
        <div className="bar-l">
          <span className="bar-h">Installed</span>
          <span className="bar-count">{connectors.length}</span>
          <span className="bar-meta">
            <span className="dot dot-h" /> {healthy} healthy
            <span className="sep">·</span>
            <span className="dot dot-e" /> {errors} error
          </span>
        </div>
      </div>

      <Card padding={0}>
        <table className="ctable">
          <thead>
            <tr>
              <th>Connector</th>
              <th>Status</th>
              <th>Records</th>
              <th>Scope</th>
              <th>Last sync</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {connectors.map((c) => {
              const isError = c.status === "Error";
              return (
                <tr key={c.id} className={isError ? "row row-error" : "row"}>
                  <td>
                    <Link href={`/app/connectors/${c.id}`} className="cn">
                      <span className={"cn-ic cn-" + c.type}>{iconLetter(c.type)}</span>
                      <span className="cn-text">
                        <span className="cn-name">{c.displayName}</span>
                        <span className="cn-type">{displayType(c.type)}</span>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <span className="status-cell">
                      <span className={"sd sd-" + c.status.toLowerCase().replace(/\s+/g, "-")} />
                      <Pill tone={statusTone(c.status as ConnectorStatus)}>{c.status}</Pill>
                    </span>
                  </td>
                  <td className="num">{c.recordCount?.toLocaleString() ?? "—"}</td>
                  <td className="scope">{c.scope}</td>
                  <td className="when">{relativeTime(c.lastSyncAt)}</td>
                  <td className="actions-col">
                    <button className="kebab" type="button" aria-label="Row actions">…</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Catalog */}
      <section className="catalog-wrap">
        <div className="cat-h">
          <h2>Catalog</h2>
          <p>Pick a system to add to the governed data plane.</p>
        </div>

        {CONNECTOR_CATALOG.map((cat) => (
          <div key={cat.category} className="cat-block">
            <div className="cat-label">
              <span className="cat-tag">{cat.category}</span>
              <span className="cat-rule" />
            </div>
            <div className="cat-grid">
              {cat.items.map((item) => (
                <Link href="/app/connectors/new" key={item.type} className="cat-card lift">
                  <span className={"cat-ic cat-" + item.type}>{iconLetter(item.type)}</span>
                  <span className="cat-name">{item.name}</span>
                  <span className="cat-desc">{item.description}</span>
                  <span className="cat-cta">+ Install</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <style>{`
        .bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .bar-l {
          display: inline-flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .bar-h { font-weight: 600; }
        .bar-count {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.022em;
          color: var(--color-ink-950);
          text-transform: none;
        }
        .bar-meta { display: inline-flex; align-items: center; gap: 8px; }
        .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .dot-h { background: var(--color-sage-fg); }
        .dot-e { background: var(--color-warn-fg); }
        .sep { color: var(--color-ink-300); }

        .ctable { width: 100%; border-collapse: collapse; }
        .ctable thead th {
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
        .ctable tbody tr {
          border-bottom: 1px solid var(--color-ink-100);
          transition: background 0.12s;
        }
        .ctable tbody tr:last-child { border-bottom: 0; }
        .ctable tbody tr:hover { background: var(--color-ink-50); }
        .row-error { background: rgba(251, 226, 223, 0.18); }
        .row-error:hover { background: rgba(251, 226, 223, 0.32); }
        .ctable td {
          padding: 14px 16px;
          font-size: 13.5px;
          color: var(--color-ink-700);
          vertical-align: middle;
        }
        .cn { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
        .cn-ic {
          width: 34px; height: 34px;
          border-radius: 8px;
          background: var(--color-ink-100);
          color: var(--color-ink-700);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }
        .cn-salesforce, .cn-hubspot { background: #E0EEFF; color: #1A5E9E; }
        .cn-workday, .cn-bamboohr  { background: #E8E7F8; color: #3F37B8; }
        .cn-snowflake, .cn-postgres, .cn-bigquery { background: #DCEFF1; color: #1F6471; }
        .cn-slack, .cn-teams, .cn-email { background: #F5E6F3; color: #7A2266; }
        .cn-google, .cn-onedrive, .cn-s3 { background: #FBE9C9; color: #7A511A; }
        .cn-guidewire, .cn-duckcreek, .cn-bullhorn { background: #DDEEDD; color: #2F6B40; }
        .cn-rest { background: var(--color-ink-100); color: var(--color-ink-700); }
        .cn-text { display: flex; flex-direction: column; gap: 1px; }
        .cn-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          color: var(--color-ink-950);
          letter-spacing: -0.005em;
        }
        .cn-type {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }
        .status-cell { display: inline-flex; align-items: center; gap: 8px; }
        .sd { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .sd-healthy { background: var(--color-sage-fg); }
        .sd-syncing { background: var(--color-indigo-600); animation: pulseDot 1.6s ease-in-out infinite; }
        .sd-error   { background: var(--color-warn-fg); }
        .sd-paused  { background: var(--color-amber-fg); }
        .sd-not-connected { background: var(--color-ink-300); }
        @keyframes pulseDot { 0%, 100% { box-shadow: 0 0 0 0 rgba(79,70,229,0.35); } 50% { box-shadow: 0 0 0 4px rgba(79,70,229,0); } }
        .num {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--color-ink-700);
        }
        .scope {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
        }
        .when {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .actions-col { text-align: right; width: 36px; }
        .kebab {
          width: 26px; height: 26px;
          border-radius: 6px;
          color: var(--color-ink-400);
          font-size: 16px;
          letter-spacing: 0.1em;
        }
        .kebab:hover { background: var(--color-ink-100); color: var(--color-ink-950); }

        /* Catalog section */
        .catalog-wrap { margin-top: 40px; }
        .cat-h { margin-bottom: 24px; }
        .cat-h h2 { font-size: 22px; letter-spacing: -0.018em; margin-bottom: 4px; }
        .cat-h p { color: var(--color-ink-500); font-size: 14px; }

        .cat-block { margin-bottom: 28px; }
        .cat-label {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .cat-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .cat-rule {
          flex: 1;
          height: 1px;
          background: var(--color-ink-100);
        }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }
        .cat-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px 16px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: border-color 0.15s, background 0.15s, transform 0.18s, box-shadow 0.18s;
          overflow: hidden;
        }
        .cat-card:hover {
          border-color: var(--color-indigo-400);
        }
        .cat-ic {
          width: 32px; height: 32px;
          border-radius: 7px;
          background: var(--color-ink-100);
          color: var(--color-ink-700);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 4px;
        }
        .cat-salesforce, .cat-hubspot { background: #E0EEFF; color: #1A5E9E; }
        .cat-workday, .cat-bamboohr   { background: #E8E7F8; color: #3F37B8; }
        .cat-snowflake, .cat-postgres, .cat-bigquery { background: #DCEFF1; color: #1F6471; }
        .cat-slack, .cat-teams, .cat-email { background: #F5E6F3; color: #7A2266; }
        .cat-google, .cat-onedrive, .cat-s3 { background: #FBE9C9; color: #7A511A; }
        .cat-guidewire, .cat-duckcreek, .cat-bullhorn { background: #DDEEDD; color: #2F6B40; }
        .cat-rest { background: var(--color-ink-100); color: var(--color-ink-700); }
        .cat-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          color: var(--color-ink-950);
          letter-spacing: -0.005em;
        }
        .cat-desc {
          font-size: 12px;
          color: var(--color-ink-500);
          line-height: 1.45;
          min-height: 32px;
        }
        .cat-cta {
          position: absolute;
          top: 14px;
          right: 14px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--color-indigo-700);
          background: var(--color-indigo-50);
          padding: 3px 8px;
          border-radius: 999px;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .cat-card:hover .cat-cta { opacity: 1; }
      `}</style>
    </>
  );
}
