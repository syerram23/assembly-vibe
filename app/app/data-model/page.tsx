import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { entities, connectors } from "@/lib/mocks";
import type { ConnectorStatus } from "@/lib/types";
import { statusTone } from "../connectors/catalog";

function relativeTime(iso?: string): string {
  if (!iso) return "—";
  const now = new Date("2026-05-18T18:55:00Z").getTime();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const ENTITY_DESCRIPTIONS: Record<string, string> = {
  ent_employee: "People on the payroll — levels, locations, comp.",
  ent_candidate: "Pipeline applicants and their progression.",
  ent_claim:     "Insurance claims with state and amount.",
  ent_account:   "Customer + prospect accounts feeding revenue.",
};

export default function DataModelPage() {
  return (
    <>
      <PageHeader
        eyebrow="Data model"
        title="Data model"
        description="The governed shape of your business data — entities, fields with PII flags, relationships."
        actions={
          <button className="btn btn-primary" type="button">
            + New entity
          </button>
        }
      />

      <Card padding={0}>
        <table className="dm">
          <thead>
            <tr>
              <th>Entity</th>
              <th>Records</th>
              <th>Source</th>
              <th>Fields</th>
              <th>Updated</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {entities.map((e) => {
              const source = connectors.find((c) => c.id === e.source);
              const piiCount = e.fields.filter((f) => f.isPII).length;
              return (
                <tr key={e.id}>
                  <td>
                    <Link href={`/app/data-model/${e.id}`} className="dm-name">
                      <span className="dm-mono">{e.name}</span>
                      <span className="dm-display">{e.displayName}</span>
                      <small>{ENTITY_DESCRIPTIONS[e.id] ?? "Governed entity sourced from a connected system."}</small>
                    </Link>
                  </td>
                  <td className="num">{e.recordCount.toLocaleString()}</td>
                  <td>
                    {source ? (
                      <span className="src">
                        <code>{source.type}</code>
                        <Pill tone={statusTone(source.status as ConnectorStatus)}>{source.status}</Pill>
                      </span>
                    ) : (
                      <span className="muted">manual</span>
                    )}
                  </td>
                  <td>
                    <span className="fc" title={`${piiCount} field(s) contain PII`}>
                      <span className="fc-n">{e.fields.length}</span>
                      {piiCount > 0 && (
                        <span className="fc-pii">{piiCount} PII</span>
                      )}
                    </span>
                  </td>
                  <td className="when">{relativeTime(source?.lastSyncAt)}</td>
                  <td className="actions-col">
                    <button className="kebab" type="button" aria-label="Row actions">…</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <style>{`
        .dm { width: 100%; border-collapse: collapse; }
        .dm thead th {
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
        .dm tbody tr { border-bottom: 1px solid var(--color-ink-100); transition: background 0.12s; }
        .dm tbody tr:last-child { border-bottom: 0; }
        .dm tbody tr:hover { background: var(--color-ink-50); }
        .dm td {
          padding: 14px 16px;
          font-size: 13.5px;
          color: var(--color-ink-700);
          vertical-align: middle;
        }
        .dm-name { display: flex; flex-direction: column; gap: 2px; text-decoration: none; }
        .dm-mono {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          font-weight: 600;
        }
        .dm-display {
          font-family: var(--font-display);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-ink-700);
          letter-spacing: -0.005em;
        }
        .dm-name small {
          font-size: 11.5px;
          color: var(--color-ink-500);
          line-height: 1.4;
          max-width: 380px;
          margin-top: 1px;
        }
        .num { font-family: var(--font-mono); font-size: 12.5px; color: var(--color-ink-700); }
        .src { display: inline-flex; align-items: center; gap: 8px; }
        .src code {
          font-family: var(--font-mono);
          font-size: 11.5px;
          background: var(--color-ink-50);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }
        .fc { display: inline-flex; align-items: center; gap: 8px; }
        .fc-n {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--color-ink-700);
          font-weight: 600;
        }
        .fc-pii {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          background: var(--color-warn-bg);
          color: var(--color-warn-fg);
        }
        .when { font-family: var(--font-mono); font-size: 11px; color: var(--color-ink-500); }
        .actions-col { text-align: right; width: 36px; }
        .kebab {
          width: 26px; height: 26px;
          border-radius: 6px;
          color: var(--color-ink-400);
          font-size: 16px;
          letter-spacing: 0.1em;
        }
        .kebab:hover { background: var(--color-ink-100); color: var(--color-ink-950); }
      `}</style>
    </>
  );
}
