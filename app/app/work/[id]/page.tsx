"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { tickets, applicationById, userById } from "@/lib/mocks";
import type { Ticket, TicketStatus } from "@/lib/types";

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

function fmt(d: string) {
  return new Date(d).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Scripted conversation thread per ticket
interface ThreadMessage {
  kind: "engineer" | "customer" | "system";
  userId: string;
  body: string;
  when: string;
}

function buildThread(t: Ticket): ThreadMessage[] {
  if (t.id === "tkt_vendor_migration") {
    return [
      {
        kind: "engineer", userId: "u_eng_lin",
        body: "Picked this up. To scope: do you want the migration to dedupe against existing Snowflake AR records, or just import + flag conflicts for a human to resolve? Also — should we preserve the ARIBA supplier numbers as a stable external_id?",
        when: "2026-05-18T09:14:00Z",
      },
      {
        kind: "customer", userId: "u_jordan",
        body: "Dedupe please. Match on tax_id first, then fall back to (name + city) fuzzy match at 0.92 threshold. And yes, keep the ARIBA supplier number as external_id — Procurement still uses it for invoices.",
        when: "2026-05-18T10:48:00Z",
      },
      {
        kind: "engineer", userId: "u_eng_lin",
        body: "Got it. I've drafted the dedupe job and reconciliation report. PR is open with the migration script, the entity mapping, and a dry-run output (4,118 supplier rows → 3,962 after dedupe; 156 collapsed).",
        when: "2026-05-18T17:42:00Z",
      },
      {
        kind: "system", userId: "system",
        body: "PR opened · vendor-onboarding/pull/14 · awaiting review",
        when: "2026-05-18T17:42:30Z",
      },
    ];
  }
  if (t.id === "tkt_fnol_voice_dropouts") {
    return [
      {
        kind: "engineer", userId: "u_eng_omar",
        body: "Looking at the logs you attached. The pattern looks like a Twilio media-server timeout, not our agent. Can you share two more call SIDs from the last 24h that dropped? I'll diff against successful calls of similar duration.",
        when: "2026-05-18T07:30:00Z",
      },
      {
        kind: "customer", userId: "u_devon",
        body: "Sending three from this morning: CA8f2b…, CA91e4…, CA77a0…. All dropped between 5:42 and 6:11 mins. Same caller region (PNW).",
        when: "2026-05-18T08:22:00Z",
      },
      {
        kind: "engineer", userId: "u_eng_omar",
        body: "Confirmed — Twilio's regional pop in us-west-2 had a brief degradation overnight. I'm wiring up a failover to us-east-1 with sticky session resume so a single ICE renegotiation doesn't drop the call. Estimating ~2h of work + a soak.",
        when: "2026-05-18T08:55:00Z",
      },
    ];
  }
  // Default scripted thread for "Throttle policy" or any unknown ticket
  return [
    {
      kind: "engineer", userId: "u_eng_lin",
      body: "Reading the spec now. To confirm the constraint — is the 2-per-7-days a hard cap, or should we still allow a third send if the message is flagged as 'final notice'? And do we count messages across channels (email + SMS) or per channel?",
      when: "2026-05-18T12:00:00Z",
    },
    {
      kind: "customer", userId: "u_priya",
      body: "Hard cap across channels. The whole point is to stop irritating customers who are already frustrated. Final notice is a separate workflow — out of scope here.",
      when: "2026-05-18T13:15:00Z",
    },
    {
      kind: "engineer", userId: "u_eng_lin",
      body: "Perfect, clean constraint. I'll wire a per-customer rate limiter into the workflow runner with a 7-day rolling window. Will land tomorrow morning with a backfill of the suppression log so we can sanity-check the historical violations.",
      when: "2026-05-18T13:42:00Z",
    },
  ];
}

// Default audit transitions per status
function buildTimeline(t: Ticket): { action: string; actor: string; when: string }[] {
  const raised = { action: "ticket.raised",   actor: userById(t.raisedById)?.fullName.replace(" · Assembly", "") ?? "—", when: t.createdAt };
  const items: { action: string; actor: string; when: string }[] = [raised];
  if (t.status !== "Open") {
    items.push({ action: "ticket.triaged", actor: "Assembly · auto-triage", when: new Date(new Date(t.createdAt).getTime() + 30 * 60_000).toISOString() });
  }
  if (t.assigneeId) {
    const ass = userById(t.assigneeId);
    items.push({
      action: "ticket.assigned",
      actor: ass?.fullName.replace(" · Assembly", "") ?? "—",
      when: new Date(new Date(t.createdAt).getTime() + 90 * 60_000).toISOString(),
    });
  }
  if (t.status === "In progress" || t.status === "In review") {
    items.push({ action: "ticket.in-progress", actor: "Assembly · engineer", when: new Date(new Date(t.updatedAt).getTime() - 30 * 60_000).toISOString() });
  }
  if (t.linkedPRs.length > 0) {
    items.push({ action: "pr.opened", actor: "Lin Tao", when: t.updatedAt });
  }
  return items;
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ticket = useMemo(() => tickets.find((t) => t.id === id) ?? tickets[0], [id]);

  const app = applicationById(ticket.applicationId);
  const assignee = ticket.assigneeId ? userById(ticket.assigneeId) : null;
  const raiser = userById(ticket.raisedById);

  const thread = useMemo(() => buildThread(ticket), [ticket]);
  const timeline = useMemo(() => buildTimeline(ticket), [ticket]);

  const [webhookFired, setWebhookFired] = useState<string | null>(null);

  const fireWebhook = (prUrl: string) => {
    setWebhookFired(prUrl);
    if (typeof window !== "undefined") {
      window.alert(
        "Webhook fired ·\n\n" +
          "ticket.would-close + app would advance out of Blocked status.\n\n" +
          "In production this is wired to /api/github-webhook on the build credential's scope — the PR merge auto-closes the ticket, posts a final comment, and emits the application.unblocked event."
      );
    }
  };

  return (
    <>
      <nav className="bc">
        <Link href="/app/work" className="bc-link">← Work</Link>
        <span className="bc-sep">/</span>
        <code className="bc-id">{ticket.id}</code>
      </nav>

      <PageHeader
        eyebrow={`Ticket · ${ticket.id}`}
        title={ticket.title}
        description={
          app
            ? `Raised against ${app.name} — currently ${app.lifecycle.toLowerCase()}. The linked app stays Blocked while this ticket is open.`
            : "Raised against an unknown application."
        }
        actions={
          <>
            <Link href="/app/work" className="btn btn-secondary">
              Back to tickets
            </Link>
            <Link href="/app/work/new" className="btn btn-primary">
              + Raise another
            </Link>
          </>
        }
      />

      <div className="td-grid">
        {/* Left column · the thread */}
        <div className="td-l">
          <Card>
            <header className="td-head">
              <div className="td-head-l">
                <Pill tone={ticket.type === "Support" ? "amber" : "indigo"}>{ticket.type}</Pill>
                <Pill tone={statusTone(ticket.status)}>{ticket.status}</Pill>
                <Pill tone={urgencyTone(ticket.urgency)}>urgency · {ticket.urgency}</Pill>
              </div>
              <div className="td-head-r">
                <span className="td-when">opened {fmt(ticket.createdAt)}</span>
              </div>
            </header>

            {/* The initial description as a message bubble */}
            <div className="thread">
              <Message
                kind="customer"
                user={raiser}
                body={ticket.description}
                when={ticket.createdAt}
              />
              {thread.map((m, i) => (
                <Message
                  key={i}
                  kind={m.kind}
                  user={userById(m.userId) ?? undefined}
                  body={m.body}
                  when={m.when}
                />
              ))}
            </div>

            {/* Comment form */}
            <div className="comment-form">
              <label className="cf-l">Add comment</label>
              <textarea
                className="cf-ta"
                rows={3}
                placeholder="Write a reply. @-mention an engineer or paste a code snippet…"
              />
              <div className="cf-row">
                <span className="cf-hint">Comments are sent to the assignee + ticket watchers.</span>
                <button className="btn btn-primary" type="button">
                  Add comment
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column · metadata sidebar */}
        <aside className="td-r">
          <Card title="Status">
            <div className="sb-row">
              <Pill tone={statusTone(ticket.status)}>{ticket.status}</Pill>
              <span className="sb-when">updated {fmt(ticket.updatedAt)}</span>
            </div>
            <label className="sb-l">Move to…</label>
            <select className="sb-select" defaultValue={ticket.status}>
              {["Open", "Triaged", "Assigned", "In progress", "In review", "Closed"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Card>

          <Card title="Application">
            {app ? (
              <Link href={`/app/applications/${app.id}`} className="sb-app">
                <code>{app.slug}</code>
                <small>{app.name}</small>
                <span className="sb-app-life">
                  <Pill tone={app.lifecycle === "Blocked" ? "warn" : "neutral"}>{app.lifecycle}</Pill>
                </span>
              </Link>
            ) : (
              <span className="sb-muted">No app linked</span>
            )}
          </Card>

          <Card title="Assignee">
            {assignee ? (
              <div className="sb-ass">
                <span className="sb-av" style={{ background: assignee.avatarColor }}>
                  {assignee.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <div>
                  <div className="sb-ass-name">{assignee.fullName.replace(" · Assembly", "")}</div>
                  <div className="sb-ass-meta">Assembly engineer · certified</div>
                </div>
              </div>
            ) : (
              <span className="sb-muted">Unassigned — will be picked up by next available engineer</span>
            )}
          </Card>

          <Card title="Urgency">
            <Pill tone={urgencyTone(ticket.urgency)}>{ticket.urgency}</Pill>
          </Card>

          <Card title="Linked PRs" subtitle={ticket.linkedPRs.length === 0 ? "No PRs opened yet" : undefined}>
            {ticket.linkedPRs.length === 0 ? (
              <p className="sb-muted-l">When the engineer pushes a fix, the PR appears here. Merge closes the ticket.</p>
            ) : (
              <ul className="pr-list">
                {ticket.linkedPRs.map((pr, i) => {
                  const isFired = webhookFired === pr.url;
                  return (
                    <li key={i} className="pr">
                      <div className="pr-head">
                        <span className="pr-ic" aria-hidden>⎇</span>
                        <a href={pr.url} target="_blank" rel="noreferrer" className="pr-url">
                          {pr.url.replace("https://github.com/", "")}
                        </a>
                        <Pill tone={pr.status === "merged" ? "sage" : pr.status === "closed" ? "neutral" : "indigo"}>
                          {pr.status}
                        </Pill>
                      </div>
                      {pr.status === "open" && (
                        <button
                          type="button"
                          className="pr-merge"
                          onClick={() => fireWebhook(pr.url)}
                        >
                          {isFired ? "Webhook fired ✓" : "Merge PR (simulate webhook)"}
                        </button>
                      )}
                      {pr.status === "open" && (
                        <p className="pr-hint">
                          In production: merging this PR fires the github.pr.merged webhook → ticket auto-closes → linked app exits Blocked.
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title="Timeline">
            <ul className="tl">
              {timeline.map((e, i) => (
                <li key={i}>
                  <span className="tl-dot" />
                  <div className="tl-body">
                    <div className="tl-act">{e.action}</div>
                    <div className="tl-meta">
                      <span>{e.actor}</span>
                      <span className="tl-sep">·</span>
                      <span>{fmt(e.when)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>

      <style>{`
        .bc {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
          margin-bottom: 12px;
        }
        .bc-link { color: var(--color-ink-500); transition: color 0.15s; }
        .bc-link:hover { color: var(--color-ink-950); }
        .bc-sep { color: var(--color-ink-300); }
        .bc-id { background: var(--color-ink-50); color: var(--color-ink-700); padding: 2px 8px; border-radius: 4px; }

        .td-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
        }
        @media (max-width: 1100px) { .td-grid { grid-template-columns: 1fr; } }
        .td-l, .td-r { display: flex; flex-direction: column; gap: 16px; }

        .td-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 14px;
          margin-bottom: 4px;
          border-bottom: 1px solid var(--color-ink-100);
          flex-wrap: wrap;
          gap: 12px;
        }
        .td-head-l { display: inline-flex; gap: 8px; flex-wrap: wrap; }
        .td-when {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-400);
        }

        .thread { display: flex; flex-direction: column; gap: 16px; margin: 16px 0 20px; }

        .comment-form {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid var(--color-ink-100);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cf-l {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .cf-ta {
          width: 100%;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          padding: 12px 14px;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-ink-950);
          outline: 0;
          line-height: 1.5;
          resize: vertical;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cf-ta:focus {
          border-color: var(--color-indigo-400);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }
        .cf-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .cf-hint {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-400);
        }

        /* Sidebar cards */
        .sb-row { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
        .sb-when { font-family: var(--font-mono); font-size: 10.5px; color: var(--color-ink-400); }
        .sb-l {
          display: block;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          margin-bottom: 6px;
        }
        .sb-select {
          width: 100%;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          padding: 9px 12px;
          font-family: var(--font-body);
          font-size: 13.5px;
          color: var(--color-ink-950);
          outline: 0;
        }
        .sb-app {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-decoration: none;
        }
        .sb-app code {
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: 13px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
        }
        .sb-app small { font-size: 12.5px; color: var(--color-ink-500); }
        .sb-app-life { margin-top: 6px; }
        .sb-muted { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-400); }
        .sb-muted-l { font-size: 12.5px; color: var(--color-ink-500); line-height: 1.5; }

        .sb-ass { display: flex; gap: 12px; align-items: center; }
        .sb-av {
          width: 36px; height: 36px;
          border-radius: 50%;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          font-family: var(--font-mono);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .sb-ass-name { font-size: 14px; font-weight: 500; color: var(--color-ink-950); }
        .sb-ass-meta {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }

        /* PR list */
        .pr-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
        .pr {
          padding: 12px 14px;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          background: var(--color-ink-50);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pr-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pr-ic {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--color-ink-950);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 12px;
        }
        .pr-url {
          flex: 1;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-indigo-700);
          text-decoration: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pr-url:hover { text-decoration: underline; }
        .pr-merge {
          align-self: flex-start;
          padding: 7px 12px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          color: var(--color-ink-950);
          font-size: 12px;
          font-weight: 500;
          font-family: var(--font-body);
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .pr-merge:hover {
          border-color: var(--color-indigo-600);
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
        }
        .pr-hint {
          font-size: 11.5px;
          color: var(--color-ink-500);
          line-height: 1.45;
        }

        /* Timeline */
        .tl { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .tl li {
          display: grid;
          grid-template-columns: 18px 1fr;
          gap: 10px;
        }
        .tl-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-indigo-600);
          margin: 7px 0 0 4px;
        }
        .tl-body { display: flex; flex-direction: column; gap: 2px; }
        .tl-act {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-indigo-700);
          font-weight: 500;
        }
        .tl-meta {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          display: inline-flex;
          gap: 6px;
        }
        .tl-sep { color: var(--color-ink-300); }
      `}</style>
    </>
  );
}

// ─── Message bubble ──────────────────────────────────────────────────────────

function Message({
  kind,
  user,
  body,
  when,
}: {
  kind: "engineer" | "customer" | "system";
  user?: { fullName: string; avatarColor: string } | null;
  body: string;
  when: string;
}) {
  if (kind === "system") {
    return (
      <div className="sys">
        <span className="sys-ic" aria-hidden>⌬</span>
        <span className="sys-body">{body}</span>
        <span className="sys-when">{fmt(when)}</span>
        <style>{`
          .sys {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 14px;
            background: var(--color-indigo-50);
            border: 1px dashed var(--color-indigo-200);
            border-radius: 999px;
            color: var(--color-indigo-700);
            font-family: var(--font-mono);
            font-size: 11.5px;
            align-self: center;
          }
          .sys-when { color: var(--color-ink-400); }
        `}</style>
      </div>
    );
  }
  return (
    <div className={"msg msg-" + kind}>
      <span className="msg-av" style={{ background: user?.avatarColor ?? "#5B6079" }}>
        {user?.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "—"}
      </span>
      <div className="msg-body">
        <div className="msg-head">
          <span className="msg-name">{user?.fullName.replace(" · Assembly", "") ?? "—"}</span>
          {kind === "engineer" && <span className="msg-tag">Assembly engineer</span>}
          <span className="msg-when">{fmt(when)}</span>
        </div>
        <div className="msg-bubble">{body}</div>
      </div>
      <style>{`
        .msg {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 12px;
        }
        .msg-av {
          width: 36px; height: 36px;
          border-radius: 50%;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          font-family: var(--font-mono);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .msg-body { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .msg-head {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }
        .msg-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-ink-950);
        }
        .msg-tag {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-indigo-700);
          background: var(--color-indigo-50);
          padding: 1px 6px;
          border-radius: 3px;
        }
        .msg-when {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-400);
        }
        .msg-bubble {
          padding: 12px 14px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 10px;
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--color-ink-700);
        }
        .msg-engineer .msg-bubble {
          background: #fff;
          border-color: var(--color-indigo-200);
        }
      `}</style>
    </div>
  );
}
