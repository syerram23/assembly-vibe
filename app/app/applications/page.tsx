"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, LifecycleBadge } from "@/components/ui";
import { applications, userById, agents } from "@/lib/mocks";
import type { AppLifecycle } from "@/lib/types";

type Bucket = "All" | "Live" | "In flight" | "Blocked" | "Draft";

const inFlightStates: AppLifecycle[] = ["In build", "In productionization", "In review", "Scoped", "Approved"];

function bucketFor(lifecycle: AppLifecycle): Bucket {
  if (lifecycle === "Live") return "Live";
  if (lifecycle === "Blocked") return "Blocked";
  if (lifecycle === "Draft") return "Draft";
  if (inFlightStates.includes(lifecycle)) return "In flight";
  return "All";
}

export default function ApplicationsListPage() {
  const [bucket, setBucket] = useState<Bucket>("All");
  const [query, setQuery] = useState("");

  const buckets: Bucket[] = ["All", "Live", "In flight", "Blocked", "Draft"];

  const counts = useMemo(() => {
    const c: Record<Bucket, number> = { All: applications.length, Live: 0, "In flight": 0, Blocked: 0, Draft: 0 };
    for (const a of applications) {
      const b = bucketFor(a.lifecycle);
      if (b !== "All") c[b] += 1;
    }
    return c;
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications
      .filter((a) => {
        if (bucket !== "All" && bucketFor(a.lifecycle) !== bucket) return false;
        if (!q) return true;
        return (
          a.name.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [bucket, query]);

  return (
    <>
      <PageHeader
        eyebrow="Applications · catalog"
        title="Applications"
        description="Every app your team has scoped, built, shipped, and is running on Assembly."
        actions={
          <Link href="/app/applications/new" className="btn btn-primary">
            + New application
          </Link>
        }
      />

      <div className="filter-bar">
        <div className="search">
          <span className="search-ic" aria-hidden>⌕</span>
          <input
            type="text"
            placeholder="Search by name, slug, or description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="chips" role="tablist">
          {buckets.map((b) => (
            <button
              key={b}
              role="tab"
              type="button"
              aria-selected={bucket === b}
              className={"chip " + (bucket === b ? "on" : "")}
              onClick={() => setBucket(b)}
            >
              <span>{b}</span>
              <span className="chip-count">{counts[b]}</span>
            </button>
          ))}
        </div>
      </div>

      <Card>
        {rows.length === 0 ? (
          <div className="empty">No applications match this filter.</div>
        ) : (
          <table className="apps-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Lifecycle</th>
                <th>Agents</th>
                <th>Updated</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const owner = userById(a.ownerId);
                const usedAgents = a.agentsUsed
                  .map((id) => agents.find((g) => g.id === id))
                  .filter(Boolean) as typeof agents;
                return (
                  <tr key={a.id} className="row">
                    <td>
                      <Link href={`/app/applications/${a.id}`} className="apps-name">
                        <code>{a.slug}</code>
                        <small>{a.description}</small>
                      </Link>
                    </td>
                    <td>
                      {owner ? (
                        <span className="owner">
                          <span className="avatar" style={{ background: owner.avatarColor }}>
                            {owner.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </span>
                          <span>{owner.fullName.replace(" · Assembly", "")}</span>
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>
                      <LifecycleBadge status={a.lifecycle} />
                    </td>
                    <td>
                      <span className="agents">
                        {usedAgents.length === 0 ? (
                          <span className="muted">—</span>
                        ) : (
                          usedAgents.map((g) => (
                            <span key={g.id} className="agent-chip" title={g.name}>
                              {g.code}
                            </span>
                          ))
                        )}
                      </span>
                    </td>
                    <td className="apps-when">
                      {new Date(a.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </td>
                    <td className="actions-col">
                      <button
                        className="kebab"
                        type="button"
                        aria-label="Row actions"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        …
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <footer className="summary">
          <span className="sum-l">Lifecycle distribution</span>
          <span className="sum-bar">
            {(["Live", "In flight", "Blocked", "Draft"] as Bucket[]).map((b) => {
              const total = applications.length;
              const pct = total === 0 ? 0 : Math.round((counts[b] / total) * 100);
              return (
                <span key={b} className={"sum-seg sum-" + b.replace(" ", "-").toLowerCase()} style={{ width: `${pct}%` }} title={`${b}: ${counts[b]}`} />
              );
            })}
          </span>
          <span className="sum-meta">
            <span className="sum-tag"><i className="sw sw-live" /> Live · {counts.Live}</span>
            <span className="sum-tag"><i className="sw sw-flight" /> In flight · {counts["In flight"]}</span>
            <span className="sum-tag"><i className="sw sw-blocked" /> Blocked · {counts.Blocked}</span>
            <span className="sum-tag"><i className="sw sw-draft" /> Draft · {counts.Draft}</span>
            <span className="sum-total">Total · {applications.length}</span>
          </span>
        </footer>
      </Card>

      <style>{`
        .filter-bar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search {
          flex: 1 1 320px;
          max-width: 460px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 999px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .search:focus-within {
          border-color: var(--color-indigo-400);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }
        .search-ic { color: var(--color-ink-400); font-size: 14px; }
        .search input {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          font-family: var(--font-body);
          font-size: 13.5px;
          color: var(--color-ink-950);
        }
        .search input::placeholder { color: var(--color-ink-400); }

        .chips {
          display: inline-flex;
          gap: 6px;
          padding: 4px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--color-ink-500);
          transition: background 0.15s, color 0.15s, box-shadow 0.15s;
        }
        .chip:hover { color: var(--color-ink-950); }
        .chip.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.06), 0 6px 14px -8px rgba(15, 17, 42, 0.18);
        }
        .chip-count {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--color-ink-100);
          color: var(--color-ink-500);
        }
        .chip.on .chip-count { background: var(--color-indigo-50); color: var(--color-indigo-700); }

        .apps-table { width: 100%; border-collapse: collapse; }
        .apps-table thead th {
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
        .apps-table thead th:first-child { padding-left: 0; }
        .apps-table thead th:last-child  { padding-right: 0; }

        .apps-table tbody tr {
          border-bottom: 1px solid var(--color-ink-100);
          transition: background 0.12s;
        }
        .apps-table tbody tr:last-child { border-bottom: 0; }
        .apps-table tbody tr:hover { background: var(--color-ink-50); }

        .apps-table td {
          padding: 14px 16px;
          font-size: 13.5px;
          color: var(--color-ink-700);
          vertical-align: middle;
        }
        .apps-table td:first-child { padding-left: 0; }
        .apps-table td:last-child  { padding-right: 0; }

        .apps-name {
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-decoration: none;
        }
        .apps-name code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .apps-name small {
          font-size: 12px;
          color: var(--color-ink-500);
          line-height: 1.4;
          max-width: 480px;
        }

        .owner { display: inline-flex; align-items: center; gap: 8px; }
        .avatar {
          width: 24px; height: 24px;
          border-radius: 50%;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          font-family: var(--font-mono);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.04em;
        }

        .agents { display: inline-flex; gap: 4px; flex-wrap: wrap; }
        .agent-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 22px;
          padding: 0 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          border-radius: 4px;
        }

        .apps-when {
          color: var(--color-ink-500);
          font-family: var(--font-mono);
          font-size: 11px;
        }

        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }

        .actions-col { text-align: right; width: 36px; }
        .kebab {
          width: 26px; height: 26px;
          border-radius: 6px;
          color: var(--color-ink-400);
          font-size: 16px;
          letter-spacing: 0.1em;
        }
        .kebab:hover { background: var(--color-ink-100); color: var(--color-ink-950); }

        .empty {
          padding: 36px 0;
          text-align: center;
          color: var(--color-ink-500);
          font-size: 13.5px;
        }

        .summary {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px dashed var(--color-ink-100);
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 14px;
          align-items: center;
        }
        .sum-l {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .sum-bar {
          display: inline-flex;
          height: 8px;
          background: var(--color-ink-100);
          border-radius: 999px;
          overflow: hidden;
        }
        .sum-seg { display: inline-block; height: 100%; }
        .sum-live    { background: var(--color-sage-fg); }
        .sum-in-flight { background: var(--color-amber-fg); }
        .sum-blocked { background: var(--color-warn-fg); }
        .sum-draft   { background: var(--color-ink-400); }

        .sum-meta {
          display: inline-flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .sum-tag { display: inline-flex; align-items: center; gap: 6px; }
        .sw {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 2px;
        }
        .sw-live    { background: var(--color-sage-fg); }
        .sw-flight  { background: var(--color-amber-fg); }
        .sw-blocked { background: var(--color-warn-fg); }
        .sw-draft   { background: var(--color-ink-400); }
        .sum-total {
          padding-left: 12px;
          margin-left: 4px;
          border-left: 1px solid var(--color-ink-200);
          color: var(--color-ink-700);
        }

        @media (max-width: 1100px) {
          .summary { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
