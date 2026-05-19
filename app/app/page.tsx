import { PageHeader, Card, StatTile, Pill, LifecycleBadge } from "@/components/ui";
import { applications, tickets, connectors, agents, reviewQueue, auditEvents, currentOrg, userById } from "@/lib/mocks";
import Link from "next/link";

export default function HomePage() {
  const liveApps = applications.filter((a) => a.lifecycle === "Live").length;
  const inFlight = applications.filter((a) => ["In build", "Blocked", "In productionization", "In review"].includes(a.lifecycle)).length;
  const openTickets = tickets.filter((t) => !["Closed"].includes(t.status)).length;
  const reviewItems = reviewQueue.length;
  const connectorsHealthy = connectors.filter((c) => c.status === "Healthy").length;
  const agentsConfigured = agents.filter((a) => a.status === "Configured").length;

  const recentApps = [...applications].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);
  const recentActivity = auditEvents.slice(0, 5);

  return (
    <>
      <PageHeader
        eyebrow={`Org · ${currentOrg.name}`}
        title="Welcome back, Maria"
        description="Your data plane is healthy. Three apps need your attention today — one is awaiting your production approval."
        actions={
          <>
            <Link href="/app/applications/new" className="btn btn-secondary">
              + New application
            </Link>
            <Link href="/app/releases" className="btn btn-primary">
              Review releases <span className="arr">→</span>
            </Link>
          </>
        }
      />

      {/* Metric grid */}
      <section className="metric-grid">
        <StatTile label="Apps · live"          value={liveApps}        hint={`${inFlight} in flight`} />
        <StatTile label="Open tickets"         value={openTickets}     hint="across all apps"          emphasis={openTickets > 0 ? "indigo" : "default"} />
        <StatTile label="Awaiting your review" value={reviewItems}     hint="HITL queue · SLA"          emphasis={reviewItems > 0 ? "warn" : "default"} />
        <StatTile label="Connectors healthy"   value={`${connectorsHealthy} / ${connectors.length}`} hint="last sync · within 10m" />
        <StatTile label="Agents configured"    value={`${agentsConfigured} / ${agents.length}`} hint="pre-built library" />
        <StatTile label="Entities governed"    value="4"               hint="11,083 records · audited" />
      </section>

      {/* Two-column body */}
      <section className="home-grid">
        {/* Left: data-plane health + recent apps */}
        <div className="home-l">
          <Card
            title="Data plane · health"
            subtitle="Live connectors, governance posture, where attention is needed."
            actions={<Link href="/app/connectors" className="btn btn-ghost">Open Connectors →</Link>}
          >
            <ul className="dp-list">
              {connectors.map((c) => (
                <li key={c.id}>
                  <span className="dp-name">
                    <span className={"dp-dot " + c.status.toLowerCase()} />
                    <code>{c.displayName}</code>
                  </span>
                  <span className="dp-meta">
                    <span>{c.recordCount?.toLocaleString() ?? "—"} rows</span>
                    <span className="dp-sep">·</span>
                    <span>{c.scope}</span>
                  </span>
                  <Pill tone={c.status === "Healthy" ? "sage" : c.status === "Syncing" ? "indigo" : c.status === "Error" ? "warn" : "neutral"}>
                    {c.status}
                  </Pill>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Applications · recent"
            actions={<Link href="/app/applications" className="btn btn-ghost">View all →</Link>}
          >
            <table className="apps-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Lifecycle</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((a) => {
                  const owner = userById(a.ownerId);
                  return (
                    <tr key={a.id}>
                      <td>
                        <Link href={`/app/applications`} className="apps-name">
                          <code>{a.slug}</code>
                          <small>{a.description}</small>
                        </Link>
                      </td>
                      <td>{owner?.fullName ?? "—"}</td>
                      <td><LifecycleBadge status={a.lifecycle} /></td>
                      <td className="apps-when">{new Date(a.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right: quick actions + recent activity + checklist */}
        <div className="home-r">
          <Card title="Quick actions">
            <div className="qa-grid">
              <Link href="/app/applications/new" className="qa">
                <span className="qa-ic">＋</span>
                <span className="qa-l">
                  <b>New application</b>
                  <small>Scope and ship a new app on the platform</small>
                </span>
              </Link>
              <Link href="/app/connectors" className="qa">
                <span className="qa-ic">⌬</span>
                <span className="qa-l">
                  <b>Connect a source</b>
                  <small>Add a system of record to the governed data plane</small>
                </span>
              </Link>
              <Link href="/app/access" className="qa">
                <span className="qa-ic">⌘</span>
                <span className="qa-l">
                  <b>Test access</b>
                  <small>Simulate the data plane as another user or role</small>
                </span>
              </Link>
              <Link href="/app/guide" className="qa">
                <span className="qa-ic">?</span>
                <span className="qa-l">
                  <b>How Assembly works</b>
                  <small>The five-step path · platform · governance</small>
                </span>
              </Link>
            </div>
          </Card>

          <Card title="Recent activity" actions={<Link href="/app/activity" className="btn btn-ghost">Audit log →</Link>}>
            <ul className="act-list">
              {recentActivity.map((e) => (
                <li key={e.id}>
                  <div className="act-l">
                    <code className="act-actor">{e.actorName}</code>
                    <span className="act-action">{e.action.replace(/\./g, " · ")}</span>
                  </div>
                  <div className="act-r">
                    <span className="act-target">{e.target}</span>
                    <span className="act-when">{new Date(e.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <style>{`
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        @media (max-width: 1100px) { .metric-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px)  { .metric-grid { grid-template-columns: repeat(2, 1fr); } }

        .home-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
        }
        @media (max-width: 1100px) { .home-grid { grid-template-columns: 1fr; } }
        .home-l, .home-r { display: flex; flex-direction: column; gap: 20px; }

        /* Data plane list */
        .dp-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
        .dp-list li {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 16px;
          padding: 12px 0;
          border-top: 1px solid var(--color-ink-100);
          align-items: center;
        }
        .dp-list li:first-child { border-top: 0; padding-top: 0; }
        .dp-name { display: inline-flex; align-items: center; gap: 10px; }
        .dp-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--color-ink-300);
        }
        .dp-dot.healthy { background: var(--color-sage-fg); }
        .dp-dot.syncing { background: var(--color-indigo-600); animation: pulseDot 1.6s ease-in-out infinite; }
        .dp-dot.error   { background: var(--color-warn-fg); }
        .dp-name code {
          background: transparent; padding: 0;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          font-weight: 600;
        }
        .dp-meta {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
          display: inline-flex;
          gap: 6px;
        }
        .dp-sep { color: var(--color-ink-300); }
        @keyframes pulseDot { 0%, 100% { box-shadow: 0 0 0 0 rgba(79,70,229,0.35); } 50% { box-shadow: 0 0 0 4px rgba(79,70,229,0); } }

        /* Apps table */
        .apps-table { width: 100%; border-collapse: collapse; }
        .apps-table thead th {
          text-align: left;
          padding: 6px 0 10px;
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .apps-table tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .apps-table tbody tr:last-child { border-bottom: 0; }
        .apps-table td { padding: 12px 12px 12px 0; font-size: 13.5px; color: var(--color-ink-700); vertical-align: top; }
        .apps-name { display: flex; flex-direction: column; gap: 2px; text-decoration: none; }
        .apps-name code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .apps-name small { font-size: 12px; color: var(--color-ink-500); line-height: 1.4; }
        .apps-when { color: var(--color-ink-500); font-family: var(--font-mono); font-size: 11px; }

        /* Quick actions */
        .qa-grid { display: grid; gap: 8px; }
        .qa {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 12px;
          align-items: center;
          padding: 12px 14px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          text-decoration: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .qa:hover {
          border-color: var(--color-indigo-200);
          background: var(--color-indigo-50);
        }
        .qa-ic {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: #fff;
          color: var(--color-indigo-600);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 16px;
          border: 1px solid var(--color-ink-100);
        }
        .qa-l { display: flex; flex-direction: column; gap: 2px; }
        .qa-l b {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          color: var(--color-ink-950);
          letter-spacing: -0.005em;
        }
        .qa-l small {
          font-size: 12.5px;
          color: var(--color-ink-500);
          line-height: 1.4;
        }

        /* Activity list */
        .act-list { list-style: none; margin: 0; padding: 0; }
        .act-list li {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4px;
          padding: 10px 0;
          border-top: 1px dashed var(--color-ink-100);
          font-size: 12.5px;
        }
        .act-list li:first-child { border-top: 0; padding-top: 0; }
        .act-l { display: inline-flex; gap: 8px; align-items: baseline; }
        .act-actor {
          font-family: var(--font-mono);
          font-size: 11px;
          background: var(--color-ink-50);
          color: var(--color-ink-700);
          padding: 1px 6px;
          border-radius: 3px;
        }
        .act-action {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-indigo-700);
        }
        .act-r {
          display: inline-flex;
          gap: 6px;
          align-items: baseline;
          color: var(--color-ink-500);
          font-size: 12px;
          margin-left: 0;
        }
        .act-target {
          color: var(--color-ink-700);
          font-family: var(--font-mono);
          font-size: 11.5px;
        }
        .act-when {
          margin-left: auto;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-400);
        }
      `}</style>
    </>
  );
}
