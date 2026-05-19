"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  PageHeader,
  Card,
  Pill,
  LifecycleBadge,
  StatTile,
  EmptyState,
} from "@/components/ui";
import {
  applications,
  applicationById,
  userById,
  agents,
  entities,
  repositories,
  buildCredentials,
  appVersions,
  tickets,
  reviewQueue,
} from "@/lib/mocks";
import type { Application } from "@/lib/types";

type TabKey = "overview" | "build" | "tickets" | "review" | "usage" | "settings";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "build",    label: "Build context" },
  { key: "tickets",  label: "Tickets" },
  { key: "review",   label: "Review inbox" },
  { key: "usage",    label: "Usage" },
  { key: "settings", label: "Settings" },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [tab, setTab] = useState<TabKey>("overview");

  const resolved = applicationById(id);
  const app = resolved ?? applications[0];
  const isSynthetic = !resolved;

  const owner = userById(app.ownerId);

  return (
    <>
      <PageHeader
        eyebrow={isSynthetic ? "Newly provisioned (demo)" : `Application · ${app.lifecycle.toLowerCase()}`}
        title={app.name}
        description={app.description}
        actions={
          <>
            <Link href="/app/applications" className="btn btn-ghost">← All apps</Link>
            <Link href={`/app/releases`} className="btn btn-secondary">Releases</Link>
            <button type="button" className="btn btn-primary" onClick={() => setTab("build")}>
              Open build context <span className="arr">→</span>
            </button>
          </>
        }
      />

      <div className="hero">
        <div className="hero-l">
          <span className="hero-slug">
            <code>{app.slug}</code>
            <LifecycleBadge status={app.lifecycle} />
          </span>
          <span className="hero-owner">
            {owner && (
              <>
                <span className="avatar" style={{ background: owner.avatarColor }}>
                  {owner.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <span>
                  <small>Owner</small>
                  <b>{owner.fullName.replace(" · Assembly", "")}</b>
                </span>
              </>
            )}
          </span>
        </div>
        <div className="hero-r">
          <span className="hero-meta">
            <small>Updated</small>
            <b>{new Date(app.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</b>
          </span>
          <span className="hero-meta">
            <small>Created</small>
            <b>{new Date(app.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</b>
          </span>
        </div>
      </div>

      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            className={"tab " + (tab === t.key ? "on" : "")}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="tab-body">
        {tab === "overview" && <OverviewTab app={app} />}
        {tab === "build"    && <BuildContextTab app={app} />}
        {tab === "tickets"  && <TicketsTab app={app} />}
        {tab === "review"   && <ReviewInboxTab app={app} />}
        {tab === "usage"    && <UsageTab app={app} />}
        {tab === "settings" && <SettingsTab app={app} />}
      </div>

      <style>{`
        .hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px 22px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .hero-l { display: inline-flex; align-items: center; gap: 22px; flex-wrap: wrap; }
        .hero-r { display: inline-flex; align-items: center; gap: 22px; flex-wrap: wrap; }
        .hero-slug {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .hero-slug code {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--color-ink-950);
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .hero-owner, .hero-meta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .hero-owner span small, .hero-meta small {
          display: block;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-400);
          line-height: 1.2;
        }
        .hero-owner span b, .hero-meta b {
          display: block;
          font-size: 13.5px;
          color: var(--color-ink-950);
          font-weight: 500;
        }
        .avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          font-family: var(--font-mono);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.04em;
        }

        .tabs {
          display: inline-flex;
          gap: 2px;
          padding: 4px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .tab {
          padding: 8px 16px;
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-ink-500);
          transition: background 0.15s, color 0.15s, box-shadow 0.15s;
        }
        .tab:hover { color: var(--color-ink-950); }
        .tab.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.06), 0 6px 14px -8px rgba(15, 17, 42, 0.18);
        }

        .tab-body { display: flex; flex-direction: column; gap: 16px; }
      `}</style>
    </>
  );
}

// ─── Overview tab ──────────────────────────────────────────────────────────

function OverviewTab({ app }: { app: Application }) {
  const owner = userById(app.ownerId);
  const version = appVersions.find((v) => v.id === app.currentVersion);

  // realistic placeholder metrics keyed off lifecycle
  const metrics =
    app.lifecycle === "Live"
      ? { runs: "1,284", latency: "184ms", error: "0.4%", deploy: "5d ago" }
      : app.lifecycle === "In review" || app.lifecycle === "Approved"
      ? { runs: "412", latency: "212ms", error: "0.6%", deploy: "1d ago" }
      : app.lifecycle === "Blocked"
      ? { runs: "—", latency: "—", error: "—", deploy: "n/a · blocked" }
      : app.lifecycle === "In productionization" || app.lifecycle === "In build"
      ? { runs: "78", latency: "—", error: "—", deploy: "staging" }
      : { runs: "0", latency: "—", error: "—", deploy: "—" };

  return (
    <>
      <div className="ov-grid">
        <Card title="About this app" subtitle="What it does and which governed pieces it draws on.">
          <p className="ov-desc">{app.description}</p>
          <table className="meta">
            <tbody>
              <tr><th>Created</th><td>{new Date(app.createdAt).toLocaleString()}</td></tr>
              <tr><th>Updated</th><td>{new Date(app.updatedAt).toLocaleString()}</td></tr>
              <tr><th>Owner</th><td>{owner?.fullName ?? "—"}</td></tr>
              <tr><th>Lifecycle</th><td><LifecycleBadge status={app.lifecycle} /></td></tr>
              <tr>
                <th>Entities used</th>
                <td>
                  <span className="pillrow">
                    {app.entitiesUsed.length === 0
                      ? <span className="muted">none</span>
                      : app.entitiesUsed.map((id) => {
                          const e = entities.find((x) => x.id === id);
                          return e ? <Pill key={id} tone="neutral">{e.displayName}</Pill> : null;
                        })}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Agents used</th>
                <td>
                  <span className="pillrow">
                    {app.agentsUsed.length === 0
                      ? <span className="muted">none</span>
                      : app.agentsUsed.map((id) => {
                          const g = agents.find((x) => x.id === id);
                          return g ? <Pill key={id} tone="indigo">{g.code} · {g.name}</Pill> : null;
                        })}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Current version</th>
                <td>
                  {version
                    ? <code className="ver">{version.versionTag} · {version.commitSha}</code>
                    : <span className="muted">No release yet</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card title="Health" subtitle="Live activity from the data plane and runtime.">
          <div className="health">
            <div className="h-row">
              <span className="h-l">Runs · 24h</span>
              <span className="h-v">{metrics.runs}</span>
            </div>
            <div className="h-row">
              <span className="h-l">Avg latency</span>
              <span className="h-v">{metrics.latency}</span>
            </div>
            <div className="h-row">
              <span className="h-l">Error rate</span>
              <span className={"h-v " + (metrics.error !== "—" && parseFloat(metrics.error) > 1 ? "h-warn" : "h-ok")}>{metrics.error}</span>
            </div>
            <div className="h-row">
              <span className="h-l">Last deploy</span>
              <span className="h-v">{metrics.deploy}</span>
            </div>
            <div className="h-row">
              <span className="h-l">SLA</span>
              <span className="h-v h-ok">{app.lifecycle === "Live" ? "99.96%" : "—"}</span>
            </div>
            <div className="h-row">
              <span className="h-l">Region</span>
              <span className="h-v"><code>us-east-1</code></span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Next steps">
        <NextSteps app={app} />
      </Card>

      <style>{`
        .ov-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 16px;
        }
        @media (max-width: 1000px) { .ov-grid { grid-template-columns: 1fr; } }

        .ov-desc {
          color: var(--color-ink-700);
          font-size: 14.5px;
          line-height: 1.55;
          margin-bottom: 18px;
        }
        .meta { width: 100%; border-collapse: collapse; }
        .meta th, .meta td {
          padding: 10px 0;
          text-align: left;
          vertical-align: top;
          border-top: 1px solid var(--color-ink-100);
          font-size: 13.5px;
        }
        .meta tr:first-child th, .meta tr:first-child td { border-top: 0; }
        .meta th {
          width: 160px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
          padding-right: 14px;
        }
        .meta td { color: var(--color-ink-700); }
        .pillrow { display: inline-flex; gap: 6px; flex-wrap: wrap; }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }
        .ver {
          font-family: var(--font-mono);
          font-size: 12.5px;
          background: var(--color-ink-50);
          color: var(--color-ink-950);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .health { display: flex; flex-direction: column; }
        .h-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-top: 1px solid var(--color-ink-100);
        }
        .h-row:first-child { border-top: 0; padding-top: 0; }
        .h-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .h-v {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--color-ink-950);
          font-weight: 600;
        }
        .h-ok { color: var(--color-sage-fg); }
        .h-warn { color: var(--color-warn-fg); }
      `}</style>
    </>
  );
}

function NextSteps({ app }: { app: Application }) {
  if (app.lifecycle === "Live") {
    return (
      <div className="ns-list">
        <NSItem
          tone="indigo"
          title="Promote a change"
          desc="Open a new release from the build context, run the checklist, and ship behind the same governance."
          cta={<Link href="/app/releases" className="btn btn-secondary">Open releases →</Link>}
        />
        <NSItem
          tone="warn"
          title="Deprecate"
          desc="Mark this app as deprecated. Existing runs continue. New invocations return a deprecation banner."
          cta={<button type="button" className="btn btn-ghost">Deprecate app</button>}
        />
        <Inline />
      </div>
    );
  }
  if (app.lifecycle === "In review" || app.lifecycle === "Approved") {
    return (
      <div className="ns-list">
        <NSItem
          tone="indigo"
          title="Awaiting Org Admin approval"
          desc="The release checklist is complete. See the open release for environment confirmation and final sign-off."
          cta={<Link href="/app/releases" className="btn btn-primary">See releases →</Link>}
        />
        <Inline />
      </div>
    );
  }
  if (app.lifecycle === "Blocked") {
    const t = tickets.find((x) => x.applicationId === app.id);
    return (
      <div className="ns-list">
        <NSItem
          tone="warn"
          title="Blocked · pending Assembly engineering"
          desc={t?.title ?? "A linked ticket is open with Assembly engineering."}
          cta={<Link href="/app/work" className="btn btn-secondary">Open ticket →</Link>}
        />
        <Inline />
      </div>
    );
  }
  if (app.lifecycle === "In productionization" || app.lifecycle === "In build") {
    return (
      <div className="ns-list">
        <NSItem
          tone="indigo"
          title="Continue building"
          desc="Open Claude Code and iterate on the skills file, surface bindings, and HITL gates."
          cta={<button type="button" className="btn btn-primary">Open Claude Code (⌘J)</button>}
        />
        <NSItem
          tone="neutral"
          title="Open a release when ready"
          desc="Once the checklist passes, your assigned reviewer gets the gate."
          cta={<Link href="/app/releases" className="btn btn-secondary">Releases →</Link>}
        />
        <Inline />
      </div>
    );
  }
  return (
    <div className="ns-list">
      <NSItem
        tone="neutral"
        title="Pick the data and agents"
        desc="This app is still a draft. Open the scoping flow to attach entities and agents."
        cta={<Link href="/app/applications/new" className="btn btn-primary">Open scoping →</Link>}
      />
      <Inline />
    </div>
  );
}

function NSItem({ tone, title, desc, cta }: { tone: "indigo" | "warn" | "neutral"; title: string; desc: string; cta: React.ReactNode }) {
  return (
    <div className={"ns ns-" + tone}>
      <div>
        <b>{title}</b>
        <p>{desc}</p>
      </div>
      <div className="ns-cta">{cta}</div>
    </div>
  );
}

function Inline() {
  return (
    <style>{`
      .ns-list { display: flex; flex-direction: column; gap: 10px; }
      .ns {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 14px 16px;
        background: var(--color-ink-50);
        border: 1px solid var(--color-ink-100);
        border-radius: 10px;
        flex-wrap: wrap;
      }
      .ns-indigo { background: var(--color-indigo-50); border-color: var(--color-indigo-200); }
      .ns-warn   { background: rgba(251, 226, 223, 0.45); border-color: var(--color-warn-bg); }
      .ns b {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 14.5px;
        color: var(--color-ink-950);
      }
      .ns p { font-size: 13px; color: var(--color-ink-500); line-height: 1.5; margin-top: 2px; max-width: 560px; }
      .ns-cta { display: inline-flex; gap: 8px; }
    `}</style>
  );
}

// ─── Build context tab ────────────────────────────────────────────────────

function BuildContextTab({ app }: { app: Application }) {
  const repo = repositories.find((r) => r.applicationId === app.id);
  const cred = buildCredentials.find((c) => c.applicationId === app.id);
  const [credRevealed, setCredRevealed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const mcpUrl = `https://mcp.assembly.io/orgs/acme/apps/${app.slug}`;

  const onCopy = (key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(key);
    setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
  };

  const skillsMd = `# Skills · ${app.slug}

## Sources
- workday.employees (read-only)
- greenhouse.offers (read-only)

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
      <Card>
        <div className="cc-launch">
          <div>
            <span className="cc-eyebrow">Build with Claude Code</span>
            <h3 className="cc-title">Open Claude Code</h3>
            <p className="cc-desc">
              Press <kbd>⌘J</kbd> or click the <b>Claude Code</b> button in the header. The terminal connects to this app's MCP endpoint with your build credential — every read goes through the governed data plane.
            </p>
          </div>
          <div className="cc-art" aria-hidden>
            <pre className="cc-pre">{">_ claude code ready"}</pre>
          </div>
        </div>
      </Card>

      <div className="bc-grid">
        <Card title="MCP endpoint" subtitle="Where Claude Code connects.">
          <div className="bc-row">
            <code className="bc-mono">{mcpUrl}</code>
            <button className="bc-btn" type="button" onClick={() => onCopy("mcp", mcpUrl)}>
              {copied === "mcp" ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p className="bc-foot">Connect Claude Code to this endpoint to build with this app's data and governance.</p>
        </Card>

        <Card title="Build credential" subtitle="Scoped to this application only.">
          <div className="bc-row">
            <code className="bc-mono">
              {credRevealed
                ? cred?.token.replace("…", "9f2e3c1a")
                : cred?.token ?? "—"}
            </code>
            <Pill tone={cred?.status === "Active" ? "sage" : "warn"}>{cred?.status ?? "—"}</Pill>
          </div>
          <div className="bc-actions">
            <button className="bc-btn" type="button" onClick={() => setCredRevealed((v) => !v)}>
              {credRevealed ? "Hide" : "Reveal"}
            </button>
            <button className="bc-btn" type="button">Rotate</button>
            <span className="bc-scope">scope · <code>{cred?.scope}</code></span>
          </div>
        </Card>

        <Card title="Repository" subtitle="Lives in Assembly's GitHub org until you transfer.">
          <div className="bc-row">
            <code className="bc-mono">{repo?.url ?? `https://github.com/assembly-vibe-orgs/acme/${app.slug}`}</code>
            <Pill tone={repo?.status === "Active" ? "sage" : "neutral"}>{repo?.status ?? "—"}</Pill>
          </div>
          <div className="bc-actions">
            <a href={repo?.url ?? "#"} target="_blank" rel="noreferrer" className="bc-btn bc-btn-primary">Open repo →</a>
            <button className="bc-btn" type="button">Transfer to customer</button>
            <span className="bc-scope">template · <code>{repo?.template ?? "—"}</code></span>
          </div>
        </Card>
      </div>

      <Card
        title="skills.md"
        subtitle="The contract Claude Code follows when building. Edit from the terminal — changes are reviewed on the next release."
        actions={
          <button className="bc-btn" type="button" onClick={() => onCopy("skills", skillsMd)}>
            {copied === "skills" ? "Copied ✓" : "Copy"}
          </button>
        }
      >
        <pre className="code-block">{skillsMd}</pre>
      </Card>

      <style>{`
        .cc-launch {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
        }
        @media (max-width: 760px) { .cc-launch { grid-template-columns: 1fr; } }
        .cc-eyebrow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-indigo-700);
          font-weight: 600;
          display: inline-block;
          margin-bottom: 8px;
        }
        .cc-title {
          font-family: var(--font-display);
          font-size: 22px;
          letter-spacing: -0.014em;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .cc-desc { color: var(--color-ink-500); font-size: 14px; line-height: 1.55; max-width: 540px; }
        .cc-desc kbd {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 1px 6px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-200);
          border-radius: 4px;
          color: var(--color-ink-700);
        }
        .cc-art {
          background: var(--color-ink-950);
          color: var(--color-indigo-300);
          border-radius: 12px;
          padding: 22px 26px;
          min-width: 220px;
        }
        .cc-pre {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-indigo-200);
          margin: 0;
        }

        .bc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1100px) { .bc-grid { grid-template-columns: 1fr; } }

        .bc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .bc-mono {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          word-break: break-all;
        }
        .bc-foot { color: var(--color-ink-500); font-size: 12.5px; line-height: 1.5; }
        .bc-actions { display: inline-flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .bc-scope {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
          margin-left: 4px;
        }
        .bc-scope code {
          background: transparent;
          padding: 0;
          color: var(--color-ink-700);
        }
        .bc-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-family: var(--font-body);
          font-size: 12.5px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 999px;
          color: var(--color-ink-700);
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .bc-btn:hover { border-color: var(--color-ink-950); background: var(--color-ink-50); color: var(--color-ink-950); }
        .bc-btn-primary {
          background: var(--color-ink-950);
          color: #fff;
          border-color: var(--color-ink-950);
        }
        .bc-btn-primary:hover { background: var(--color-ink-900); color: #fff; }

        .code-block {
          font-family: var(--font-mono);
          font-size: 12.5px;
          line-height: 1.65;
          background: var(--color-ink-950);
          color: #E3E5EE;
          padding: 18px 20px;
          border-radius: 10px;
          overflow-x: auto;
          white-space: pre;
          margin: 0;
        }
      `}</style>
    </>
  );
}

// ─── Tickets tab ───────────────────────────────────────────────────────────

function TicketsTab({ app }: { app: Application }) {
  const appTickets = useMemo(() => tickets.filter((t) => t.applicationId === app.id), [app.id]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [urgency, setUrgency] = useState<"low" | "normal" | "high">("normal");
  const [type, setType] = useState<"Support" | "Productionization">("Support");

  const submit = () => {
    if (!title.trim()) return;
    alert(`Ticket raised (demo)\n\nTitle: ${title}\nType: ${type}\nUrgency: ${urgency}\nApp: ${app.slug}`);
    setTitle(""); setDesc(""); setShowForm(false);
  };

  return (
    <>
      <div className="tk-bar">
        <span className="tk-l">{appTickets.length} ticket{appTickets.length === 1 ? "" : "s"} for this app</span>
        <button className="btn btn-secondary" type="button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ Raise a ticket"}
        </button>
      </div>

      {showForm && (
        <Card title="Raise a ticket" subtitle="Goes to Assembly engineering. They triage and assign within SLA.">
          <div className="tk-form">
            <label className="lbl">Title</label>
            <input className="inp" type="text" placeholder="Short summary" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label className="lbl">Description</label>
            <textarea className="ta" rows={4} placeholder="What's happening? What should happen? Anything else we should know." value={desc} onChange={(e) => setDesc(e.target.value)} />

            <div className="tk-row">
              <div className="tk-col">
                <label className="lbl">Type</label>
                <select className="sel" value={type} onChange={(e) => setType(e.target.value as "Support" | "Productionization")}>
                  <option value="Support">Support</option>
                  <option value="Productionization">Productionization</option>
                </select>
              </div>
              <div className="tk-col">
                <label className="lbl">Urgency</label>
                <select className="sel" value={urgency} onChange={(e) => setUrgency(e.target.value as "low" | "normal" | "high")}>
                  <option value="low">low</option>
                  <option value="normal">normal</option>
                  <option value="high">high</option>
                </select>
              </div>
            </div>

            <div className="tk-foot">
              <button className="btn btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" type="button" onClick={submit} disabled={!title.trim()}>Raise ticket →</button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {appTickets.length === 0 ? (
          <EmptyState
            title="No tickets for this app"
            description="When you need Assembly engineering — productionization, migrations, or support — raise a ticket and they'll pick it up."
            cta={<button className="btn btn-secondary" type="button" onClick={() => setShowForm(true)}>+ Raise a ticket</button>}
          />
        ) : (
          <table className="tk-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Urgency</th>
                <th>Raised</th>
              </tr>
            </thead>
            <tbody>
              {appTickets.map((t) => {
                const assignee = t.assigneeId ? userById(t.assigneeId) : undefined;
                return (
                  <tr key={t.id}>
                    <td>
                      <Link href={`/app/work/${t.id}`} className="tk-name">
                        <b>{t.title}</b>
                        <small>{t.description}</small>
                      </Link>
                    </td>
                    <td><Pill tone={t.type === "Support" ? "neutral" : "indigo"}>{t.type}</Pill></td>
                    <td>
                      <Pill
                        tone={
                          t.status === "Closed" ? "sage" :
                          t.status === "In review" || t.status === "In progress" ? "indigo" :
                          t.status === "Open" ? "warn" :
                          "amber"
                        }
                      >
                        {t.status}
                      </Pill>
                    </td>
                    <td>{assignee?.fullName ?? <span className="muted">unassigned</span>}</td>
                    <td>
                      <Pill tone={t.urgency === "high" ? "warn" : t.urgency === "normal" ? "neutral" : "neutral"}>
                        {t.urgency}
                      </Pill>
                    </td>
                    <td className="tk-when">
                      {new Date(t.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <style>{`
        .tk-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .tk-l {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }

        .tk-form { display: flex; flex-direction: column; gap: 2px; }
        .tk-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .tk-col { display: flex; flex-direction: column; }
        .tk-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 12px; margin-top: 8px; border-top: 1px solid var(--color-ink-100); }

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
          padding: 10px 12px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-ink-950);
          outline: 0;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ta { resize: vertical; min-height: 100px; line-height: 1.5; }
        .sel { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--color-ink-400) 50%), linear-gradient(135deg, var(--color-ink-400) 50%, transparent 50%); background-position: calc(100% - 18px) center, calc(100% - 13px) center; background-size: 5px 5px; background-repeat: no-repeat; padding-right: 36px; }
        .inp:focus, .ta:focus, .sel:focus {
          border-color: var(--color-indigo-400);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .tk-table { width: 100%; border-collapse: collapse; }
        .tk-table thead th {
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
        .tk-table thead th:first-child { padding-left: 0; }
        .tk-table tbody tr {
          border-bottom: 1px solid var(--color-ink-100);
        }
        .tk-table tbody tr:last-child { border-bottom: 0; }
        .tk-table tbody tr:hover { background: var(--color-ink-50); }
        .tk-table td {
          padding: 14px 12px;
          font-size: 13.5px;
          color: var(--color-ink-700);
          vertical-align: middle;
        }
        .tk-table td:first-child { padding-left: 0; }
        .tk-name {
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-decoration: none;
        }
        .tk-name b {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          color: var(--color-ink-950);
        }
        .tk-name small { font-size: 12px; color: var(--color-ink-500); line-height: 1.4; max-width: 420px; }
        .tk-when {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }
      `}</style>
    </>
  );
}

// ─── Review inbox tab ──────────────────────────────────────────────────────

function ReviewInboxTab({ app }: { app: Application }) {
  const items = useMemo(
    () => reviewQueue.filter((r) => r.applicationName === app.name),
    [app.name]
  );

  return (
    <Card>
      {items.length === 0 ? (
        <EmptyState
          title="No items awaiting review"
          description="HITL items raised by this app would appear here for assigned reviewers."
        />
      ) : (
        <table className="rv-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Description</th>
              <th>Assignee</th>
              <th>SLA due</th>
              <th>Raised</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => {
              const assignee = r.assigneeId ? userById(r.assigneeId) : undefined;
              const overdue = new Date(r.slaDueAt).getTime() < Date.now();
              return (
                <tr key={r.id}>
                  <td><code className="rv-step">{r.step}</code></td>
                  <td className="rv-desc">{r.description}</td>
                  <td>{assignee?.fullName ?? <span className="muted">unassigned</span>}</td>
                  <td>
                    <Pill tone={overdue ? "warn" : "neutral"}>
                      {new Date(r.slaDueAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </Pill>
                  </td>
                  <td className="rv-when">
                    {new Date(r.raisedAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <style>{`
        .rv-table { width: 100%; border-collapse: collapse; }
        .rv-table thead th {
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
        .rv-table thead th:first-child { padding-left: 0; }
        .rv-table tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .rv-table tbody tr:last-child { border-bottom: 0; }
        .rv-table tbody tr:hover { background: var(--color-ink-50); }
        .rv-table td { padding: 14px 12px; font-size: 13.5px; color: var(--color-ink-700); }
        .rv-table td:first-child { padding-left: 0; }
        .rv-step {
          font-family: var(--font-mono);
          font-size: 12px;
          background: var(--color-ink-50);
          padding: 2px 8px;
          color: var(--color-ink-950);
          border-radius: 4px;
        }
        .rv-desc { max-width: 520px; }
        .rv-when {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }
      `}</style>
    </Card>
  );
}

// ─── Usage tab ─────────────────────────────────────────────────────────────

function UsageTab({ app }: { app: Application }) {
  // numbers vary by lifecycle to feel realistic
  const profile =
    app.lifecycle === "Live"
      ? { r24: "1,284", r7: "8,902", r30: "37,418", lat: "184ms", p99: "612ms", cost: "$418.20", err: "0.4%", sla: "99.96%", trend: "live" }
      : app.lifecycle === "In review" || app.lifecycle === "Approved"
      ? { r24: "412", r7: "2,108", r30: "5,041", lat: "212ms", p99: "684ms", cost: "$92.40", err: "0.6%", sla: "99.81%", trend: "ramp" }
      : app.lifecycle === "Blocked"
      ? { r24: "—", r7: "—", r30: "—", lat: "—", p99: "—", cost: "$0.00", err: "—", sla: "—", trend: "flat" }
      : app.lifecycle === "In productionization" || app.lifecycle === "In build"
      ? { r24: "78", r7: "412", r30: "1,108", lat: "248ms", p99: "812ms", cost: "$12.10", err: "1.2%", sla: "—", trend: "build" }
      : { r24: "0", r7: "0", r30: "0", lat: "—", p99: "—", cost: "$0.00", err: "—", sla: "—", trend: "flat" };

  const sparkPoints =
    profile.trend === "live"   ? [22,28,24,30,29,34,33,38,42,40,45,48,50,52,49,55,58,60,62,68,70,72,74,80] :
    profile.trend === "ramp"   ? [4,6,5,8,9,12,14,18,22,25,28,33,30,36,40,44,48,46,52,55,58,60,64,68] :
    profile.trend === "build"  ? [1,2,3,3,4,5,8,10,12,14,16,18,20,22,24,28,30,34,38,40,42,46,48,52] :
                                  [0,0,0,1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0];

  return (
    <>
      <div className="u-grid">
        <StatTile label="Runs · 24h"      value={profile.r24} hint="vs prev day"  emphasis={app.lifecycle === "Live" ? "sage" : "default"} />
        <StatTile label="Runs · 7d"       value={profile.r7}  hint="weekly total" />
        <StatTile label="Runs · 30d"      value={profile.r30} hint="monthly total" />
        <StatTile label="Avg latency"     value={profile.lat} hint="incl. tools" />
        <StatTile label="p99 latency"     value={profile.p99} hint="tail performance" />
        <StatTile label="Total cost"      value={profile.cost} hint="30d · all tokens" />
        <StatTile label="Errors"          value={profile.err} hint="30d rate"     emphasis={profile.err !== "—" && parseFloat(profile.err) > 1 ? "warn" : "default"} />
        <StatTile label="SLA % met"       value={profile.sla} hint="rolling 30d"  emphasis={app.lifecycle === "Live" ? "sage" : "default"} />
      </div>

      <Card title="Runs · last 24 hours" subtitle="Per-hour invocation count.">
        <div className="spark-wrap">
          <svg viewBox="0 0 480 100" preserveAspectRatio="none" className="spark">
            <defs>
              <linearGradient id="sparkfill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-indigo-600)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--color-indigo-600)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const w = 480, h = 100, n = sparkPoints.length;
              const max = Math.max(...sparkPoints, 1);
              const pts = sparkPoints.map((v, i) => {
                const x = (i / (n - 1)) * w;
                const y = h - 6 - (v / max) * (h - 18);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              });
              const line = "M" + pts.join(" L");
              const area = line + ` L${w},${h} L0,${h} Z`;
              return (
                <>
                  <path d={area} fill="url(#sparkfill)" />
                  <path d={line} fill="none" stroke="var(--color-indigo-600)" strokeWidth="1.2" />
                </>
              );
            })()}
            <line x1="0" y1="99" x2="480" y2="99" stroke="var(--color-ink-100)" strokeWidth="1" />
          </svg>
          <div className="spark-axis">
            <span>24h ago</span>
            <span>12h</span>
            <span>now</span>
          </div>
        </div>
      </Card>

      <style>{`
        .u-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 1100px) { .u-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px)  { .u-grid { grid-template-columns: 1fr; } }

        .spark-wrap { margin-top: 4px; }
        .spark { width: 100%; height: 140px; display: block; }
        .spark-axis {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-400);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
      `}</style>
    </>
  );
}

// ─── Settings tab ──────────────────────────────────────────────────────────

function SettingsTab({ app }: { app: Application }) {
  const [visibility, setVisibility] = useState<"Org" | "Public">("Org");
  const [environment, setEnvironment] = useState<"Staging" | "Production">(app.lifecycle === "Live" ? "Production" : "Staging");

  return (
    <>
      <Card title="General">
        <div className="set">
          <div className="set-row">
            <div>
              <span className="set-l">Application name</span>
              <p className="set-h">{app.name}</p>
              <small className="set-s">Renaming changes the slug. Existing audit log entries keep the original.</small>
            </div>
            <code className="ver">{app.slug}</code>
          </div>

          <div className="set-row">
            <div>
              <span className="set-l">Owner</span>
              <p className="set-h">{userById(app.ownerId)?.fullName ?? "—"}</p>
              <small className="set-s">Owner gets the on-call alerts and the production-approval gate by default.</small>
            </div>
            <select className="sel" defaultValue={app.ownerId}>
              {[
                "u_maria","u_devon","u_priya","u_jordan","u_sasha",
              ].map((uid) => {
                const u = userById(uid);
                return u ? <option key={uid} value={uid}>{u.fullName}</option> : null;
              })}
            </select>
          </div>

          <div className="set-row">
            <div>
              <span className="set-l">Visibility</span>
              <p className="set-h">{visibility === "Org" ? "Organization" : "Public"}</p>
              <small className="set-s">Public apps are listed in the partner gallery, still scoped to the same governance.</small>
            </div>
            <div className="toggle">
              <button type="button" className={visibility === "Org" ? "on" : ""} onClick={() => setVisibility("Org")}>Org</button>
              <button type="button" className={visibility === "Public" ? "on" : ""} onClick={() => setVisibility("Public")}>Public</button>
            </div>
          </div>

          <div className="set-row">
            <div>
              <span className="set-l">Environment</span>
              <p className="set-h">{environment}</p>
              <small className="set-s">Production deploys require a release with the full checklist signed off.</small>
            </div>
            <div className="toggle">
              <button type="button" className={environment === "Staging" ? "on" : ""} onClick={() => setEnvironment("Staging")}>Staging</button>
              <button type="button" className={environment === "Production" ? "on" : ""} onClick={() => setEnvironment("Production")}>Production</button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Danger zone" subtitle="Both actions are reversible only by Org Admin with an audit trail.">
        <div className="danger">
          <div className="dg-row">
            <div>
              <b>Deprecate app</b>
              <p>Stops new invocations. Existing flows continue until cutover. Reviewers and owners are notified.</p>
            </div>
            <button type="button" className="btn btn-secondary dg-btn">Deprecate</button>
          </div>
          <div className="dg-row">
            <div>
              <b>Offboard · transfer repository</b>
              <p>Moves the GitHub repo from Assembly's org to the customer's org. Build credentials are revoked.</p>
            </div>
            <button type="button" className="btn btn-secondary dg-btn">Transfer repo</button>
          </div>
        </div>
      </Card>

      <style>{`
        .set { display: flex; flex-direction: column; }
        .set-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          padding: 16px 0;
          border-top: 1px solid var(--color-ink-100);
        }
        .set-row:first-child { border-top: 0; padding-top: 0; }
        .set-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .set-h {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 16px;
          color: var(--color-ink-950);
          margin-top: 4px;
        }
        .set-s {
          display: block;
          color: var(--color-ink-500);
          font-size: 12.5px;
          line-height: 1.5;
          margin-top: 4px;
          max-width: 520px;
        }
        .ver {
          font-family: var(--font-mono);
          font-size: 12.5px;
          background: var(--color-ink-50);
          color: var(--color-ink-950);
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid var(--color-ink-100);
        }

        .toggle {
          display: inline-flex;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
          padding: 3px;
          gap: 2px;
        }
        .toggle button {
          padding: 6px 14px;
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 12.5px;
          color: var(--color-ink-500);
          font-weight: 500;
        }
        .toggle button.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.06), 0 6px 14px -8px rgba(15, 17, 42, 0.18);
        }

        .sel {
          padding: 10px 36px 10px 14px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 13.5px;
          color: var(--color-ink-950);
          appearance: none;
          background-image: linear-gradient(45deg, transparent 50%, var(--color-ink-400) 50%), linear-gradient(135deg, var(--color-ink-400) 50%, transparent 50%);
          background-position: calc(100% - 18px) center, calc(100% - 13px) center;
          background-size: 5px 5px;
          background-repeat: no-repeat;
        }

        .danger { display: flex; flex-direction: column; }
        .dg-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          padding: 16px 0;
          border-top: 1px solid var(--color-ink-100);
          flex-wrap: wrap;
        }
        .dg-row:first-child { border-top: 0; padding-top: 0; }
        .dg-row b {
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--color-warn-fg);
          font-size: 14.5px;
        }
        .dg-row p {
          color: var(--color-ink-500);
          font-size: 13px;
          line-height: 1.5;
          margin-top: 4px;
          max-width: 540px;
        }
        .dg-btn { border-color: var(--color-warn-fg); color: var(--color-warn-fg); }
        .dg-btn:hover { background: var(--color-warn-bg); border-color: var(--color-warn-fg); color: var(--color-warn-fg); }
      `}</style>
    </>
  );
}
