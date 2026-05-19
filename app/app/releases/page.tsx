"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill, LifecycleBadge, EmptyState } from "@/components/ui";
import {
  releases,
  appVersions,
  changeRequests,
  applications,
  applicationById,
  userById,
  users,
} from "@/lib/mocks";
import type { ChecklistItem, Release, AppVersion } from "@/lib/types";

type TabKey = "queue" | "versions" | "changes";

const TABS: { key: TabKey; label: string; hint: string }[] = [
  { key: "queue",    label: "Promotion queue",  hint: "Awaiting approval" },
  { key: "versions", label: "Version history",  hint: "Across all apps" },
  { key: "changes",  label: "Change requests",  hint: "Open + recent" },
];

export default function ReleasesPage() {
  const [tab, setTab] = useState<TabKey>("queue");

  const pendingReleases  = useMemo(() => releases.filter((r) => r.decision === "Pending"), []);
  const approvedReleases = useMemo(() => releases.filter((r) => r.decision === "Approved"), []);
  const inChecklist      = pendingReleases.filter((r) => r.checklist.some((c) => c.status === "Pending")).length;

  return (
    <>
      <PageHeader
        eyebrow="Releases · production gate"
        title="Releases"
        description="The production gate. Nothing reaches production without passing the checklist and an Org Admin's sign-off."
        actions={
          <>
            <Link href="/app/applications" className="btn btn-secondary">
              Open applications
            </Link>
            <button className="btn btn-primary" type="button">
              Raise change request <span className="arr">→</span>
            </button>
          </>
        }
      />

      <nav className="rel-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={"rel-tab " + (tab === t.key ? "on" : "")}
            onClick={() => setTab(t.key)}
          >
            <span className="rel-tab-l">{t.label}</span>
            <span className="rel-tab-h">{t.hint}</span>
          </button>
        ))}
      </nav>

      {tab === "queue" && (
        <PromotionQueue
          pending={pendingReleases}
          inChecklist={inChecklist}
          approvedCount={approvedReleases.length}
        />
      )}

      {tab === "versions" && <VersionHistory />}

      {tab === "changes" && <ChangeRequests />}

      <style>{`
        .rel-tabs {
          display: inline-flex;
          gap: 4px;
          padding: 4px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .rel-tab {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          padding: 9px 16px;
          border-radius: 8px;
          color: var(--color-ink-500);
          transition: background 0.15s, color 0.15s, box-shadow 0.15s;
        }
        .rel-tab:hover { color: var(--color-ink-950); }
        .rel-tab.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.06), 0 6px 14px -8px rgba(15, 17, 42, 0.18);
        }
        .rel-tab-l { font-size: 13.5px; font-weight: 500; }
        .rel-tab-h {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-400);
        }
        .rel-tab.on .rel-tab-h { color: var(--color-indigo-700); }
      `}</style>
    </>
  );
}

// ─── Promotion queue ──────────────────────────────────────────────────────────

function PromotionQueue({
  pending,
  inChecklist,
  approvedCount,
}: {
  pending: Release[];
  inChecklist: number;
  approvedCount: number;
}) {
  return (
    <>
      <div className="queue-summary">
        <span className="qs-count">{pending.length}</span>
        <span className="qs-rest">
          release{pending.length === 1 ? "" : "s"} awaiting your approval ·{" "}
          <b>{inChecklist}</b> in checklist · <b>{approvedCount}</b> approved this quarter
        </span>
      </div>

      {pending.length === 0 ? (
        <Card>
          <EmptyState
            title="Nothing in the queue"
            description="There are no releases awaiting your approval. Builders raise releases from inside an application."
          />
        </Card>
      ) : (
        <div className="queue-list">
          {pending.map((r) => <ReleaseCard key={r.id} release={r} />)}
        </div>
      )}

      <style>{`
        .queue-summary {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          padding: 12px 16px;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-200);
          border-radius: 10px;
          margin-bottom: 18px;
        }
        .qs-count {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 22px;
          color: var(--color-indigo-700);
          letter-spacing: -0.018em;
        }
        .qs-rest {
          color: var(--color-ink-700);
          font-size: 13.5px;
        }
        .qs-rest b { color: var(--color-ink-950); font-weight: 600; }

        .queue-list { display: flex; flex-direction: column; gap: 18px; }
      `}</style>
    </>
  );
}

function ReleaseCard({ release }: { release: Release }) {
  const app = applicationById(release.applicationId);
  const version = appVersions.find((v) => v.id === release.appVersionId);
  const allPassed = release.checklist.every((c) => c.status === "Pass");

  const me = userById("u_maria");
  const admins = users.filter((u) => ["u_maria", "u_devon"].includes(u.id));

  return (
    <section className="rcard">
      <header className="rcard-head">
        <div className="rcard-head-l">
          <span className="rcard-app">
            <code>{app?.slug ?? "unknown-app"}</code>
            <span className="rcard-app-name">{app?.name}</span>
          </span>
          <span className="rcard-ver">
            <code>{version?.versionTag}</code>
            <span className="rcard-sha">{version?.commitSha}</span>
          </span>
        </div>
        <div className="rcard-head-r">
          <LifecycleBadge status="In review" />
        </div>
      </header>

      <div className="rcard-body">
        <div className="checklist-header">
          <span className="ch-l">Pre-production checklist</span>
          <span className="ch-r">
            {release.checklist.filter((c) => c.status === "Pass").length} of {release.checklist.length} passing
          </span>
        </div>

        <ul className="checklist">
          {release.checklist.map((item) => (
            <ChecklistRow key={item.id} item={item} />
          ))}
        </ul>
      </div>

      <div className="rcard-divider" />

      <footer className="approval">
        <div className="approval-head">
          <Pill tone="indigo">Awaiting Org Admin approval</Pill>
          {!allPassed && (
            <span className="approval-warn">
              Approve &amp; promote is disabled until every checklist item passes.
            </span>
          )}
        </div>

        <div className="approval-grid">
          <label className="field">
            <span className="field-l">Approver</span>
            <select className="field-in" defaultValue={me?.id}>
              {admins.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} · Org Admin
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-l">Comment (optional)</span>
            <textarea
              className="field-in field-ta"
              placeholder="Add context — what was reviewed, any caveats…"
              rows={3}
            />
          </label>
        </div>

        <div className="approval-actions">
          <button className="btn btn-secondary deny" type="button">
            Deny
          </button>
          <button
            className="btn btn-primary"
            type="button"
            disabled={!allPassed}
            aria-disabled={!allPassed}
            title={allPassed ? "Approve and promote to production" : "Checklist incomplete"}
          >
            Approve &amp; promote <span className="arr">→</span>
          </button>
        </div>
      </footer>

      <style>{`
        .rcard {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }
        .rcard-head {
          padding: 16px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background: var(--color-ink-50);
          border-bottom: 1px solid var(--color-ink-100);
          flex-wrap: wrap;
        }
        .rcard-head-l { display: inline-flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
        .rcard-app {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
        }
        .rcard-app code {
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: 14px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
        }
        .rcard-app-name {
          font-size: 13px;
          color: var(--color-ink-500);
        }
        .rcard-ver {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          padding-left: 14px;
          border-left: 1px solid var(--color-ink-200);
        }
        .rcard-ver code {
          font-family: var(--font-mono);
          font-size: 12px;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
        .rcard-sha {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-400);
        }

        .rcard-body { padding: 20px 22px 8px; }

        .checklist-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
        }
        .ch-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .ch-r {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }

        .checklist {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .rcard-divider {
          height: 1px;
          background: var(--color-ink-100);
          margin: 8px 22px 0;
        }

        .approval {
          padding: 20px 22px 22px;
          background: var(--color-ink-50);
          margin-top: 16px;
          border-top: 1px solid var(--color-ink-100);
        }
        .approval-head {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .approval-warn {
          font-size: 12px;
          color: var(--color-ink-500);
          font-style: italic;
        }
        .approval-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 14px;
          margin-bottom: 16px;
        }
        @media (max-width: 720px) {
          .approval-grid { grid-template-columns: 1fr; }
        }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-l {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .field-in {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          padding: 10px 12px;
          font-family: var(--font-body);
          font-size: 13.5px;
          color: var(--color-ink-950);
          outline: 0;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-in:focus {
          border-color: var(--color-indigo-400);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }
        .field-ta { resize: vertical; min-height: 64px; line-height: 1.45; }
        .approval-actions {
          display: inline-flex;
          gap: 10px;
          width: 100%;
          justify-content: flex-end;
        }
        .approval-actions .deny:hover {
          border-color: var(--color-warn-fg);
          color: var(--color-warn-fg);
          background: var(--color-warn-bg);
        }
        .approval-actions .btn-primary[disabled],
        .approval-actions .btn-primary[aria-disabled="true"] {
          background: var(--color-ink-300);
          color: var(--color-ink-100);
          cursor: not-allowed;
          box-shadow: none;
        }
        .approval-actions .btn-primary[disabled]:hover {
          background: var(--color-ink-300);
        }
      `}</style>
    </section>
  );
}

function ChecklistRow({ item }: { item: ChecklistItem }) {
  const checkedBy = item.checkedBy ? userById(item.checkedBy) : null;
  const when = item.checkedAt
    ? new Date(item.checkedAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <li className={"cli cli-" + item.status.toLowerCase()}>
      <span className={"cli-ic cli-ic-" + item.status.toLowerCase()} aria-hidden>
        {item.status === "Pass" && "✓"}
        {item.status === "Fail" && "✗"}
        {item.status === "Pending" && "○"}
      </span>
      <div className="cli-body">
        <div className="cli-label">{item.label}</div>
        {item.detail && <div className="cli-detail">{item.detail}</div>}
        {(checkedBy || when) && (
          <div className="cli-meta">
            {checkedBy && <span className="cli-by">{checkedBy.fullName}</span>}
            {checkedBy && when && <span className="cli-sep">·</span>}
            {when && <span className="cli-when">{when}</span>}
          </div>
        )}
        {!checkedBy && item.checkedBy && (
          <div className="cli-meta">
            <span className="cli-by">{item.checkedBy}</span>
            {when && <span className="cli-sep">·</span>}
            {when && <span className="cli-when">{when}</span>}
          </div>
        )}
      </div>
      <style>{`
        .cli {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 12px;
          padding: 12px 0;
          border-top: 1px dashed var(--color-ink-100);
          align-items: flex-start;
        }
        .cli:first-child { border-top: 0; padding-top: 6px; }
        .cli-ic {
          width: 24px; height: 24px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 12px;
          line-height: 1;
        }
        .cli-ic-pass {
          background: var(--color-sage-bg);
          color: var(--color-sage-fg);
        }
        .cli-ic-fail {
          background: var(--color-warn-bg);
          color: var(--color-warn-fg);
        }
        .cli-ic-pending {
          background: var(--color-ink-100);
          color: var(--color-ink-400);
          border: 1px dashed var(--color-ink-300);
        }
        .cli-body { display: flex; flex-direction: column; gap: 3px; }
        .cli-label {
          font-size: 14px;
          color: var(--color-ink-950);
          font-weight: 500;
        }
        .cli-pending .cli-label { color: var(--color-ink-500); }
        .cli-detail {
          font-size: 12.5px;
          color: var(--color-ink-500);
          line-height: 1.5;
        }
        .cli-meta {
          margin-top: 2px;
          display: inline-flex;
          gap: 6px;
          align-items: baseline;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-400);
        }
        .cli-by { color: var(--color-ink-500); font-weight: 500; }
        .cli-sep { color: var(--color-ink-300); }
      `}</style>
    </li>
  );
}

// ─── Version history ─────────────────────────────────────────────────────────

function VersionHistory() {
  // Group versions by applicationId
  const byApp = useMemo(() => {
    const m: Record<string, AppVersion[]> = {};
    for (const v of appVersions) {
      if (!m[v.applicationId]) m[v.applicationId] = [];
      m[v.applicationId].push(v);
    }
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return m;
  }, []);

  const appIdsWithVersions = applications
    .filter((a) => byApp[a.id]?.length)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="vh-list">
      {appIdsWithVersions.map((app) => {
        const versions = byApp[app.id];
        return (
          <Card
            key={app.id}
            title={app.name}
            subtitle={app.description}
            actions={<LifecycleBadge status={app.lifecycle} />}
          >
            <div className="vh-track">
              {versions.map((v, idx) => {
                const rel = releases.find((r) => r.appVersionId === v.id);
                const status = rel?.decision ?? "Pending";
                const approver = rel?.approverId ? userById(rel.approverId) : null;
                const dotTone =
                  status === "Approved" ? "sage" : status === "Pending" && rel ? "indigo" : "neutral";
                const isExpanded = expanded === v.id;
                const isLast = idx === versions.length - 1;
                return (
                  <div key={v.id} className="vh-step">
                    <div className="vh-rail">
                      <span className={"vh-dot vh-dot-" + dotTone} />
                      {!isLast && <span className="vh-line" />}
                    </div>
                    <div className="vh-card">
                      <button
                        type="button"
                        className="vh-row"
                        onClick={() => setExpanded(isExpanded ? null : v.id)}
                      >
                        <span className="vh-tag">
                          <code>{v.versionTag}</code>
                        </span>
                        <span className="vh-sha">{v.commitSha}</span>
                        <span className="vh-date">
                          {new Date(v.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="vh-status">
                          {rel ? (
                            <Pill tone={status === "Approved" ? "sage" : status === "Denied" ? "warn" : "indigo"}>
                              {status === "Approved" ? "Approved" : status === "Denied" ? "Denied" : "In review"}
                            </Pill>
                          ) : (
                            <Pill tone="neutral">No release</Pill>
                          )}
                        </span>
                        <span className="vh-approver">
                          {approver ? (
                            <>
                              <span className="vh-av" style={{ background: approver.avatarColor }}>
                                {approver.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                              </span>
                              <span>{approver.fullName.replace(" · Assembly", "")}</span>
                            </>
                          ) : (
                            <span className="vh-muted">—</span>
                          )}
                        </span>
                        <span className="vh-actions">
                          {status === "Approved" && (
                            <span
                              className="vh-rollback"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              Rollback to this version
                            </span>
                          )}
                          <span className={"vh-chev " + (isExpanded ? "on" : "")}>▾</span>
                        </span>
                      </button>
                      {isExpanded && rel && (
                        <div className="vh-detail">
                          <div className="vh-detail-grid">
                            <div>
                              <div className="vh-d-l">Pre-production checklist</div>
                              <ul className="vh-mini">
                                {rel.checklist.map((c) => (
                                  <li key={c.id}>
                                    <span className={"vh-mi vh-mi-" + c.status.toLowerCase()} aria-hidden>
                                      {c.status === "Pass" ? "✓" : c.status === "Fail" ? "✗" : "○"}
                                    </span>
                                    <span>{c.label}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="vh-d-l">Audit trail</div>
                              <ul className="vh-audit">
                                <li>
                                  <span className="vh-a-when">
                                    {new Date(rel.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                  </span>
                                  <span className="vh-a-act">release.created</span>
                                  <span className="vh-a-target">checklist gated</span>
                                </li>
                                {rel.approvedAt && (
                                  <li>
                                    <span className="vh-a-when">
                                      {new Date(rel.approvedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                    </span>
                                    <span className="vh-a-act">release.approved</span>
                                    <span className="vh-a-target">
                                      by {approver?.fullName.replace(" · Assembly", "") ?? "—"}
                                    </span>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      {isExpanded && !rel && (
                        <div className="vh-detail">
                          <p className="vh-muted">No release exists for this version. It was tagged but never promoted.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}

      <style>{`
        .vh-list { display: flex; flex-direction: column; gap: 18px; }

        .vh-track {
          display: flex;
          flex-direction: column;
        }
        .vh-step {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 14px;
        }
        .vh-rail {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 14px;
        }
        .vh-dot {
          width: 12px; height: 12px;
          border-radius: 50%;
          background: var(--color-ink-300);
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px var(--color-ink-200);
          z-index: 1;
        }
        .vh-dot-sage { background: var(--color-sage-fg); }
        .vh-dot-indigo { background: var(--color-indigo-600); }
        .vh-dot-neutral { background: var(--color-ink-300); }
        .vh-line {
          flex: 1;
          width: 1px;
          background: var(--color-ink-200);
          margin-top: 4px;
        }

        .vh-card {
          margin-bottom: 4px;
        }
        .vh-row {
          width: 100%;
          display: grid;
          grid-template-columns: 90px 110px 110px 120px 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 10px 12px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          text-align: left;
          color: var(--color-ink-700);
          transition: background 0.12s, border-color 0.12s;
        }
        .vh-row:hover {
          background: var(--color-ink-50);
          border-color: var(--color-ink-100);
        }
        .vh-tag code {
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: 12.5px;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .vh-sha {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
        }
        .vh-date {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .vh-status { display: inline-flex; }
        .vh-approver {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
        }
        .vh-av {
          width: 22px; height: 22px;
          border-radius: 50%;
          color: #fff;
          font-size: 9.5px;
          font-weight: 600;
          font-family: var(--font-mono);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .vh-muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 11px; }
        .vh-actions { display: inline-flex; gap: 10px; align-items: center; }
        .vh-rollback {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-500);
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid var(--color-ink-200);
          background: #fff;
          transition: border-color 0.15s, color 0.15s;
          cursor: pointer;
        }
        .vh-rollback:hover {
          border-color: var(--color-ink-950);
          color: var(--color-ink-950);
        }
        .vh-chev {
          font-family: var(--font-mono);
          color: var(--color-ink-400);
          transition: transform 0.15s;
        }
        .vh-chev.on { transform: rotate(180deg); color: var(--color-ink-950); }

        .vh-detail {
          margin: 8px 0 14px 12px;
          padding: 14px 16px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
        }
        .vh-detail-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
        }
        @media (max-width: 720px) { .vh-detail-grid { grid-template-columns: 1fr; } }
        .vh-d-l {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          margin-bottom: 8px;
        }
        .vh-mini { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
        .vh-mini li { display: inline-flex; gap: 8px; align-items: center; font-size: 12.5px; color: var(--color-ink-700); }
        .vh-mi {
          width: 16px; height: 16px;
          border-radius: 50%;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .vh-mi-pass { background: var(--color-sage-bg); color: var(--color-sage-fg); }
        .vh-mi-fail { background: var(--color-warn-bg); color: var(--color-warn-fg); }
        .vh-mi-pending { background: var(--color-ink-100); color: var(--color-ink-400); }

        .vh-audit { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .vh-audit li {
          display: grid;
          grid-template-columns: 60px 140px 1fr;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .vh-a-act { color: var(--color-indigo-700); }
        .vh-a-target { color: var(--color-ink-700); }

        @media (max-width: 900px) {
          .vh-row {
            grid-template-columns: 80px 90px 100px 1fr auto;
          }
          .vh-approver { display: none; }
        }
      `}</style>
    </div>
  );
}

// ─── Change requests ─────────────────────────────────────────────────────────

function ChangeRequests() {
  const rows = [...changeRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <Card
      title="Change requests"
      subtitle="Builders raise CRs to modify a live app. Each becomes its own release once approved."
      actions={
        <button className="btn btn-primary" type="button">
          + Raise a change request
        </button>
      }
    >
      {rows.length === 0 ? (
        <EmptyState
          title="No change requests"
          description="When a builder needs to modify a live app, they raise a CR here. Once approved, it becomes a new release."
        />
      ) : (
        <table className="cr-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>App</th>
              <th>Raised by</th>
              <th>Status</th>
              <th>Created</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((cr) => {
              const app = applicationById(cr.applicationId);
              const by = userById(cr.raisedById);
              const tone =
                cr.status === "Approved" || cr.status === "Live" ? "sage" :
                cr.status === "Rejected" ? "warn" :
                cr.status === "In review" || cr.status === "In build" ? "indigo" :
                "neutral";
              return (
                <tr key={cr.id}>
                  <td>
                    <Link href="#" className="cr-name">
                      <span>{cr.title}</span>
                      <small>{cr.description}</small>
                    </Link>
                  </td>
                  <td>
                    <code className="cr-app">{app?.slug ?? "—"}</code>
                  </td>
                  <td>
                    {by ? (
                      <span className="cr-by">
                        <span className="cr-av" style={{ background: by.avatarColor }}>
                          {by.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </span>
                        <span>{by.fullName.replace(" · Assembly", "")}</span>
                      </span>
                    ) : (
                      <span className="cr-muted">—</span>
                    )}
                  </td>
                  <td>
                    <Pill tone={tone}>{cr.status}</Pill>
                  </td>
                  <td className="cr-when">
                    {new Date(cr.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </td>
                  <td className="cr-arrow">→</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <style>{`
        .cr-table { width: 100%; border-collapse: collapse; }
        .cr-table thead th {
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
        .cr-table thead th:first-child { padding-left: 0; }
        .cr-table thead th:last-child { padding-right: 0; }
        .cr-table tbody tr {
          border-bottom: 1px solid var(--color-ink-100);
          transition: background 0.12s;
        }
        .cr-table tbody tr:last-child { border-bottom: 0; }
        .cr-table tbody tr:hover { background: var(--color-ink-50); }
        .cr-table td {
          padding: 14px 16px;
          font-size: 13.5px;
          color: var(--color-ink-700);
          vertical-align: middle;
        }
        .cr-table td:first-child { padding-left: 0; }
        .cr-table td:last-child { padding-right: 0; }

        .cr-name {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cr-name span:first-child {
          font-weight: 500;
          color: var(--color-ink-950);
          font-size: 13.5px;
        }
        .cr-name small {
          font-size: 12px;
          color: var(--color-ink-500);
          line-height: 1.4;
          max-width: 460px;
        }
        .cr-app {
          font-family: var(--font-mono);
          font-size: 12px;
          background: transparent;
          padding: 0;
          color: var(--color-ink-950);
          font-weight: 600;
        }
        .cr-by { display: inline-flex; align-items: center; gap: 8px; }
        .cr-av {
          width: 22px; height: 22px;
          border-radius: 50%;
          color: #fff;
          font-size: 9.5px;
          font-weight: 600;
          font-family: var(--font-mono);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .cr-when {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .cr-arrow {
          font-family: var(--font-mono);
          color: var(--color-ink-400);
          width: 24px;
          text-align: right;
        }
        .cr-muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 11px; }
      `}</style>
    </Card>
  );
}
