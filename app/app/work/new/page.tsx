"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { applications, applicationById } from "@/lib/mocks";
import type { TicketType } from "@/lib/types";

type Urgency = "low" | "normal" | "high";

export default function NewTicketPage() {
  const [appId, setAppId] = useState<string>("app_compband");
  const [type, setType] = useState<TicketType>("Support");
  const [urgency, setUrgency] = useState<Urgency>("normal");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tried, setTried] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedApp = applicationById(appId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <>
        <nav className="bc">
          <Link href="/app/work" className="bc-link">← Work</Link>
          <span className="bc-sep">/</span>
          <span>new ticket</span>
        </nav>

        <PageHeader
          eyebrow="Ticket raised"
          title="Ticket raised · tkt_new_42"
          description="Your ticket is in the queue. An Assembly engineer will pick it up within SLA."
        />

        <Card>
          <div className="ok">
            <div className="ok-ic" aria-hidden>✓</div>
            <div className="ok-body">
              <h3>Lin Tao notified</h3>
              <p>
                <code>tkt_new_42</code> opened against{" "}
                <code>{selectedApp?.slug ?? "—"}</code>. The linked app is now in{" "}
                <Pill tone="warn">Blocked</Pill> status until this resolves — your workflows will continue running, but no new releases can promote.
              </p>

              <dl className="ok-meta">
                <div>
                  <dt>Ticket id</dt>
                  <dd><code>tkt_new_42</code></dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{type}</dd>
                </div>
                <div>
                  <dt>Urgency</dt>
                  <dd>{urgency}</dd>
                </div>
                <div>
                  <dt>Assigned to</dt>
                  <dd>Lin Tao · Assembly</dd>
                </div>
                <div>
                  <dt>SLA</dt>
                  <dd>{urgency === "high" ? "4h response · 24h fix" : urgency === "normal" ? "next business day" : "3 business days"}</dd>
                </div>
                <div>
                  <dt>Channel</dt>
                  <dd>email + slack #app-{selectedApp?.slug ?? "support"}</dd>
                </div>
              </dl>

              <div className="ok-actions">
                <Link href="/app/applications" className="btn btn-secondary">
                  Back to applications
                </Link>
                <Link href="/app/work" className="btn btn-primary">
                  Go to ticket queue <span className="arr">→</span>
                </Link>
              </div>
            </div>
          </div>

          <style>{`
            .ok {
              display: grid;
              grid-template-columns: 48px 1fr;
              gap: 18px;
              padding: 6px 4px;
            }
            .ok-ic {
              width: 48px; height: 48px;
              border-radius: 50%;
              background: var(--color-sage-bg);
              color: var(--color-sage-fg);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-family: var(--font-mono);
              font-weight: 700;
              font-size: 22px;
            }
            .ok-body h3 { font-size: 18px; margin-bottom: 8px; }
            .ok-body p { font-size: 14px; color: var(--color-ink-700); line-height: 1.55; margin-bottom: 18px; }
            .ok-body code {
              font-family: var(--font-mono);
              font-size: 12.5px;
              background: var(--color-ink-50);
              color: var(--color-ink-950);
              padding: 1px 6px;
              border-radius: 4px;
              font-weight: 600;
            }
            .ok-meta {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 14px 24px;
              padding: 14px 16px;
              background: var(--color-ink-50);
              border: 1px solid var(--color-ink-100);
              border-radius: 8px;
              margin: 0 0 18px;
            }
            @media (max-width: 720px) { .ok-meta { grid-template-columns: 1fr 1fr; } }
            .ok-meta dt {
              font-family: var(--font-mono);
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: var(--color-ink-500);
              margin-bottom: 3px;
            }
            .ok-meta dd { font-size: 13px; color: var(--color-ink-950); font-weight: 500; }
            .ok-actions { display: inline-flex; gap: 10px; }
          `}</style>
        </Card>

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
        `}</style>
      </>
    );
  }

  return (
    <>
      <nav className="bc">
        <Link href="/app/work" className="bc-link">← Work</Link>
        <span className="bc-sep">/</span>
        <span>new ticket</span>
      </nav>

      <PageHeader
        eyebrow="Raise a ticket"
        title="Raise a ticket"
        description="Hit a wall in Claude Code? Need an Assembly engineer to harden something for production? Raise a ticket here. The linked app moves to Blocked until it resolves."
      />

      <form className="form-grid" onSubmit={handleSubmit}>
        <Card title="Step 1 · What's the ticket about?">
          <div className="row two">
            <Field label="Application" hint="The app this ticket is raised against. Will move to Blocked.">
              <select
                className="in"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                required
              >
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.slug} — {a.name}
                  </option>
                ))}
              </select>
              {selectedApp && (
                <p className="hint">
                  Currently <code>{selectedApp.lifecycle.toLowerCase()}</code>. Owner: {selectedApp.ownerId.replace("u_", "")}.
                </p>
              )}
            </Field>

            <Field label="Type" hint="Support is for breakage. Productionization is for hardening / new infra work.">
              <div className="radios">
                <RadioPill
                  label="Support"
                  hint="Something's broken"
                  selected={type === "Support"}
                  onClick={() => setType("Support")}
                />
                <RadioPill
                  label="Productionization"
                  hint="Make it production-ready"
                  selected={type === "Productionization"}
                  onClick={() => setType("Productionization")}
                />
              </div>
            </Field>
          </div>
        </Card>

        <Card title="Step 2 · Describe the problem">
          <Field label="Title" hint="One sentence. What's the issue?">
            <input
              type="text"
              className="in"
              placeholder="e.g. Voice channel drops callers around 6 minutes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={140}
            />
          </Field>

          <Field label="Description" hint="What's the behavior? What were you expecting? Logs, examples, links — drop them in.">
            <textarea
              className="in ta"
              rows={5}
              placeholder="Paste a stack trace, describe the user impact, or link to a failing workflow run…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Field>

          <Field label="Urgency" hint="High urgency = 4h response · 24h fix. Normal = next business day. Low = 3 business days.">
            <div className="radios">
              <RadioPill
                label="Low"
                hint="Nice to have"
                selected={urgency === "low"}
                onClick={() => setUrgency("low")}
              />
              <RadioPill
                label="Normal"
                hint="Standard SLA"
                selected={urgency === "normal"}
                onClick={() => setUrgency("normal")}
              />
              <RadioPill
                label="High"
                hint="App is down or revenue-impacting"
                selected={urgency === "high"}
                onClick={() => setUrgency("high")}
              />
            </div>
          </Field>
        </Card>

        <Card title="Step 3 · What did you already try?" subtitle="Saves the engineer triage time. Even one line helps.">
          <Field label="What was tried" hint="Workarounds, configurations, debug output. Anything that narrows the problem space.">
            <textarea
              className="in ta"
              rows={4}
              placeholder="e.g. Tried clearing the connector cache + restarting the workflow. Same behavior. Suspect Twilio media-server timeout."
              value={tried}
              onChange={(e) => setTried(e.target.value)}
            />
          </Field>
        </Card>

        <div className="actions">
          <Link href="/app/work" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Raise ticket <span className="arr">→</span>
          </button>
        </div>
      </form>

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

        .form-grid { display: flex; flex-direction: column; gap: 16px; }

        .row { display: flex; flex-direction: column; gap: 18px; }
        .row.two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 720px) { .row.two { grid-template-columns: 1fr; } }

        .in {
          width: 100%;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          padding: 10px 12px;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-ink-950);
          outline: 0;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .in:focus {
          border-color: var(--color-indigo-400);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }
        .ta { line-height: 1.55; resize: vertical; }

        .hint {
          margin-top: 6px;
          font-size: 12px;
          color: var(--color-ink-500);
          line-height: 1.45;
        }
        .hint code {
          font-family: var(--font-mono);
          font-size: 11px;
          background: var(--color-ink-50);
          color: var(--color-ink-700);
          padding: 1px 5px;
          border-radius: 3px;
        }

        .radios { display: inline-flex; gap: 8px; flex-wrap: wrap; }

        .actions {
          display: inline-flex;
          gap: 10px;
          justify-content: flex-end;
          padding-top: 6px;
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="f">
      <label className="f-l">{label}</label>
      {hint && <p className="f-h">{hint}</p>}
      {children}
      <style>{`
        .f { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .f:last-child { margin-bottom: 0; }
        .f-l {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .f-h {
          font-size: 12px;
          color: var(--color-ink-500);
          line-height: 1.45;
          margin-bottom: 2px;
        }
      `}</style>
    </div>
  );
}

function RadioPill({
  label,
  hint,
  selected,
  onClick,
}: {
  label: string;
  hint: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={"rp " + (selected ? "on" : "")}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="rp-l">{label}</span>
      <span className="rp-h">{hint}</span>
      <style>{`
        .rp {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
          padding: 10px 14px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 10px;
          text-align: left;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
          min-width: 150px;
        }
        .rp:hover { border-color: var(--color-ink-950); }
        .rp.on {
          border-color: var(--color-indigo-600);
          background: var(--color-indigo-50);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.06);
        }
        .rp-l {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-ink-950);
        }
        .rp.on .rp-l { color: var(--color-indigo-700); }
        .rp-h {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
        }
      `}</style>
    </button>
  );
}
