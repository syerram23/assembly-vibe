"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill, EmptyState } from "@/components/ui";
import { tickets, applicationById, userById } from "@/lib/mocks";
import type { TicketStatus } from "@/lib/types";

type View = "org" | "engineer";

const STATUS_FILTERS: { key: "All" | TicketStatus; label: string }[] = [
  { key: "All",         label: "All" },
  { key: "Open",        label: "Open" },
  { key: "Triaged",     label: "Triaged" },
  { key: "Assigned",    label: "Assigned" },
  { key: "In progress", label: "In progress" },
  { key: "In review",   label: "In review" },
  { key: "Closed",      label: "Closed" },
];

function statusTone(s: TicketStatus): "neutral" | "indigo" | "sage" | "amber" | "warn" {
  if (s === "Open") return "warn";
  if (s === "Triaged") return "amber";
  if (s === "Assigned") return "indigo";
  if (s === "In progress") return "indigo";
  if (s === "In review") return "amber";
  return "sage";
}

function urgencyTone(u: "low" | "normal" | "high"): "neutral" | "warn" | "indigo" {
  if (u === "high") return "warn";
  if (u === "low")  return "neutral";
  return "indigo";
}

export default function WorkPage() {
  const [view, setView] = useState<View>("org");
  const [filter, setFilter] = useState<"All" | TicketStatus>("All");
  const [query, setQuery] = useState("");

  const baseTickets = useMemo(() => {
    if (view === "engineer") {
      return tickets.filter((t) => t.assigneeId === "u_eng_lin");
    }
    return tickets;
  }, [view]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: baseTickets.length };
    for (const s of ["Open", "Triaged", "Assigned", "In progress", "In review", "Closed"] as TicketStatus[]) {
      c[s] = 0;
    }
    for (const t of baseTickets) {
      c[t.status] = (c[t.status] ?? 0) + 1;
    }
    return c;
  }, [baseTickets]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseTickets
      .filter((t) => {
        if (filter !== "All" && t.status !== filter) return false;
        if (!q) return true;
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [baseTickets, filter, query]);

  const openCount     = counts["Open"] ?? 0;
  const triagedCount  = counts["Triaged"] ?? 0;
  const progressCount = counts["In progress"] ?? 0;
  const reviewCount   = counts["In review"] ?? 0;
  const closedCount   = counts["Closed"] ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Work · ticket system"
        title="Work — tickets"
        description="Support and productionization tickets. When a builder hits a wall in Claude Code, this is where it lands. PR merge auto-closes the ticket and unblocks the linked app."
        actions={
          <Link href="/app/work/new" className="btn btn-primary">
            + Raise a ticket
          </Link>
        }
      />

      <div className="role-toggle" role="tablist" aria-label="View">
        <button
          type="button"
          role="tab"
          aria-selected={view === "org"}
          className={"rt " + (view === "org" ? "on" : "")}
          onClick={() => { setView("org"); setFilter("All"); }}
        >
          <span className="rt-l">My org's tickets</span>
          <span className="rt-h">{tickets.length} raised</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "engineer"}
          className={"rt " + (view === "engineer" ? "on" : "")}
          onClick={() => { setView("engineer"); setFilter("All"); }}
        >
          <span className="rt-l">Assigned to me · engineer</span>
          <span className="rt-h">Lin Tao · Assembly</span>
        </button>
      </div>

      <div className="filter-bar">
        <div className="search">
          <span className="search-ic" aria-hidden>⌕</span>
          <input
            type="text"
            placeholder="Search by title, description, or ticket id…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="chips" role="tablist">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={filter === s.key}
              className={"chip " + (filter === s.key ? "on" : "")}
              onClick={() => setFilter(s.key)}
            >
              <span>{s.label}</span>
              <span className="chip-count">{counts[s.key] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="summary-line">
          <b>{openCount}</b> open · <b>{triagedCount}</b> triaged · <b>{progressCount}</b> in progress
          · <b>{reviewCount}</b> in review · <b>{closedCount}</b> closed
          <span className="summary-sep">·</span>
          showing <b>{rows.length}</b> of <b>{baseTickets.length}</b>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            title="No tickets match"
            description="Try clearing the search or selecting a different status filter."
          />
        ) : (
          <table className="tk-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>App</th>
                <th>Status</th>
                <th>Urgency</th>
                <th>Assignee</th>
                <th>Raised</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const app = applicationById(t.applicationId);
                const assignee = t.assigneeId ? userById(t.assigneeId) : null;
                return (
                  <tr key={t.id} className="tk-row">
                    <td>
                      <Link href={`/app/work/${t.id}`} className="tk-name">
                        <code className="tk-id">{t.id}</code>
                        <span className="tk-title">{t.title}</span>
                        <small>{t.description}</small>
                      </Link>
                    </td>
                    <td>
                      <Pill tone={t.type === "Support" ? "amber" : "indigo"}>
                        {t.type}
                      </Pill>
                    </td>
                    <td>
                      {app && (
                        <Link href={`/app/applications/${app.id}`} className="tk-app">
                          <code>{app.slug}</code>
                        </Link>
                      )}
                    </td>
                    <td>
                      <Pill tone={statusTone(t.status)}>{t.status}</Pill>
                    </td>
                    <td>
                      <Pill tone={urgencyTone(t.urgency)}>{t.urgency}</Pill>
                    </td>
                    <td>
                      {assignee ? (
                        <span className="tk-as">
                          <span className="tk-av" style={{ background: assignee.avatarColor }}>
                            {assignee.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </span>
                          <span>{assignee.fullName.replace(" · Assembly", "")}</span>
                        </span>
                      ) : (
                        <span className="tk-muted">Unassigned</span>
                      )}
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
        .role-toggle {
          display: inline-flex;
          gap: 4px;
          padding: 4px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 12px;
          margin-bottom: 18px;
        }
        .rt {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          padding: 9px 16px;
          border-radius: 8px;
          color: var(--color-ink-500);
          transition: background 0.15s, color 0.15s, box-shadow 0.15s;
        }
        .rt:hover { color: var(--color-ink-950); }
        .rt.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.06), 0 6px 14px -8px rgba(15, 17, 42, 0.18);
        }
        .rt-l { font-size: 13.5px; font-weight: 500; }
        .rt-h {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-400);
        }
        .rt.on .rt-h { color: var(--color-indigo-700); }

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
          gap: 4px;
          padding: 4px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
          flex-wrap: wrap;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
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
          padding: 1px 5px;
          border-radius: 999px;
          background: var(--color-ink-100);
          color: var(--color-ink-500);
        }
        .chip.on .chip-count { background: var(--color-indigo-50); color: var(--color-indigo-700); }

        .summary-line {
          padding: 4px 4px 14px;
          border-bottom: 1px solid var(--color-ink-100);
          margin-bottom: 4px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
        }
        .summary-line b { color: var(--color-ink-950); font-weight: 600; }
        .summary-sep { margin: 0 12px; color: var(--color-ink-300); }

        .tk-table { width: 100%; border-collapse: collapse; }
        .tk-table thead th {
          text-align: left;
          padding: 10px 16px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          border-bottom: 1px solid var(--color-ink-100);
        }
        .tk-table thead th:first-child { padding-left: 0; }
        .tk-table thead th:last-child  { padding-right: 0; }

        .tk-row { border-bottom: 1px solid var(--color-ink-100); transition: background 0.12s; }
        .tk-row:last-child { border-bottom: 0; }
        .tk-row:hover { background: var(--color-ink-50); }
        .tk-table td {
          padding: 14px 16px;
          font-size: 13.5px;
          color: var(--color-ink-700);
          vertical-align: middle;
        }
        .tk-table td:first-child { padding-left: 0; }
        .tk-table td:last-child  { padding-right: 0; }

        .tk-name {
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-decoration: none;
        }
        .tk-id {
          font-family: var(--font-mono);
          font-size: 10px;
          background: var(--color-ink-50);
          color: var(--color-ink-500);
          padding: 1px 6px;
          border-radius: 3px;
          align-self: flex-start;
          letter-spacing: 0.04em;
        }
        .tk-title { font-weight: 500; color: var(--color-ink-950); font-size: 13.5px; }
        .tk-name small {
          font-size: 12px;
          color: var(--color-ink-500);
          line-height: 1.4;
          max-width: 460px;
        }

        .tk-app code {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          font-weight: 600;
        }

        .tk-as { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; }
        .tk-av {
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
        .tk-muted {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-400);
        }

        .tk-when {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
      `}</style>
    </>
  );
}
