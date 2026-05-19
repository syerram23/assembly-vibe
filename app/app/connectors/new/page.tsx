"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { CONNECTOR_CATALOG, iconLetter, catalogItemFor } from "../catalog";

type Step = 1 | 2 | 3 | 4;

interface ObjectScope {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  access: "read-only" | "read+write";
}

const DEFAULT_OBJECTS: Record<string, ObjectScope[]> = {
  salesforce: [
    { key: "accounts",      name: "Accounts",       description: "Customer + prospect account records",  enabled: true,  access: "read-only" },
    { key: "contacts",      name: "Contacts",       description: "People linked to accounts",            enabled: true,  access: "read-only" },
    { key: "opportunities", name: "Opportunities",  description: "Pipeline + closed deals",              enabled: false, access: "read-only" },
    { key: "leads",         name: "Leads",          description: "Unqualified inbound prospects",        enabled: false, access: "read-only" },
    { key: "cases",         name: "Cases",          description: "Support cases and resolutions",        enabled: false, access: "read-only" },
  ],
};

const FALLBACK_OBJECTS: ObjectScope[] = [
  { key: "primary",  name: "Primary records",  description: "Core entities for this system",     enabled: true,  access: "read-only" },
  { key: "events",   name: "Events / changes", description: "Change feed for incremental sync",   enabled: true,  access: "read-only" },
  { key: "metadata", name: "Metadata",         description: "Schema, picklists, code tables",     enabled: false, access: "read-only" },
];

const SCHEDULES = ["Every 5 min", "Every hour", "Every 6 hours", "Daily"];

export default function AddConnectorPage() {
  const [step, setStep] = useState<Step>(1);
  const [pickedType, setPickedType] = useState<string | null>(null);
  const picked = pickedType ? catalogItemFor(pickedType) : undefined;

  const [objects, setObjects] = useState<ObjectScope[]>([]);
  const [schedule, setSchedule] = useState<string>("Every hour");

  function pick(type: string) {
    setPickedType(type);
    const defaults = DEFAULT_OBJECTS[type] ?? FALLBACK_OBJECTS;
    setObjects(defaults.map((o) => ({ ...o })));
    setStep(2);
  }

  function toggleObject(key: string) {
    setObjects((prev) => prev.map((o) => (o.key === key ? { ...o, enabled: !o.enabled } : o)));
  }

  function setObjectAccess(key: string, access: ObjectScope["access"]) {
    setObjects((prev) => prev.map((o) => (o.key === key ? { ...o, access } : o)));
  }

  return (
    <>
      <PageHeader
        eyebrow="Connectors · add new"
        title="Add a connector"
        description="Pick a system, authenticate, and choose the objects and fields Assembly is allowed to read or write."
        actions={
          <Link href="/app/connectors" className="btn btn-ghost">
            ← Back to connectors
          </Link>
        }
      />

      <div className="stepper">
        {[1, 2, 3].map((n) => (
          <div key={n} className={"step " + (step === n ? "on" : step > n ? "done" : "")}>
            <span className="step-n">{step > n ? "✓" : n}</span>
            <span className="step-l">
              {n === 1 && "Pick a connector"}
              {n === 2 && "Authenticate"}
              {n === 3 && "Choose scope"}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <section>
          {CONNECTOR_CATALOG.map((cat) => (
            <div key={cat.category} className="cat-block">
              <div className="cat-label">
                <span className="cat-tag">{cat.category}</span>
                <span className="cat-rule" />
              </div>
              <div className="cat-grid">
                {cat.items.map((item) => (
                  <button
                    key={item.type}
                    className={"cat-card lift " + (pickedType === item.type ? "picked" : "")}
                    onClick={() => pick(item.type)}
                    type="button"
                  >
                    <span className={"cat-ic cat-" + item.type}>{iconLetter(item.type)}</span>
                    <span className="cat-name">{item.name}</span>
                    <span className="cat-desc">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {step === 2 && picked && (
        <div className="form-grid">
          <Card title={`Authenticate with ${picked.name}`} subtitle="Assembly will request the minimum scopes needed for the objects you choose next.">
            <div className="oauth">
              <div className="oauth-flow">
                <span className="oauth-step">Step 1</span>
                <span className="oauth-line">Redirecting to {picked.name}…</span>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                >
                  Authenticate with {picked.name} <span className="arr">→</span>
                </button>
              </div>

              <div className="oauth-or">
                <span className="rule" />
                <span className="or-l">or use credentials</span>
                <span className="rule" />
              </div>

              <form
                className="cred-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(3);
                }}
              >
                <label>
                  <span>Subdomain / host</span>
                  <input type="text" placeholder={`acme.my.${picked.name.toLowerCase()}.com`} />
                </label>
                <label>
                  <span>Client ID</span>
                  <input type="text" placeholder="3MVG9…" />
                </label>
                <label>
                  <span>Client secret</span>
                  <input type="password" placeholder="••••••••••••" />
                </label>
                <label>
                  <span>Sandbox</span>
                  <select defaultValue="production">
                    <option value="production">Production</option>
                    <option value="sandbox">Sandbox</option>
                  </select>
                </label>
                <div className="cred-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="btn btn-primary">Continue <span className="arr">→</span></button>
                </div>
              </form>
            </div>
          </Card>

          <Card title="What Assembly does with your credentials" subtitle="Read this before you connect.">
            <ul className="why">
              <li><span className="why-ic">⌬</span><span>Credentials are stored in the customer-controlled secret vault and never leave your region.</span></li>
              <li><span className="why-ic">⌘</span><span>Assembly only ever requests the OAuth scopes implied by the objects you select on the next step.</span></li>
              <li><span className="why-ic">◇</span><span>You can revoke the token at any time from this connector's Settings tab.</span></li>
              <li><span className="why-ic">∗</span><span>Every read and write is recorded in the immutable audit log.</span></li>
            </ul>
          </Card>
        </div>
      )}

      {step === 3 && picked && (
        <div className="form-grid">
          <Card title={`Scope · ${picked.name}`} subtitle="Choose objects + access. Field-level scope is on the next page once the first sync completes.">
            <ul className="obj-list">
              {objects.map((o) => (
                <li key={o.key} className={"obj " + (o.enabled ? "on" : "")}>
                  <label className="obj-pick">
                    <input
                      type="checkbox"
                      checked={o.enabled}
                      onChange={() => toggleObject(o.key)}
                    />
                    <span className="obj-mark" aria-hidden>✓</span>
                    <span className="obj-text">
                      <span className="obj-name">{o.name}</span>
                      <span className="obj-desc">{o.description}</span>
                    </span>
                  </label>
                  <div className="obj-toggle" role="tablist" aria-label="Access for this object">
                    {(["read-only", "read+write"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={"toggle " + (o.access === opt ? "on" : "")}
                        onClick={() => setObjectAccess(o.key, opt)}
                        disabled={!o.enabled}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Sync schedule" subtitle="When Assembly should pull from this system.">
            <div className="sched-row">
              {SCHEDULES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={"sched " + (schedule === s ? "on" : "")}
                  onClick={() => setSchedule(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="sched-hint">
              First sync pulls the full backlog. After that we use an incremental change feed where available.
            </p>
          </Card>

          <div className="step-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="btn btn-primary" type="button" onClick={() => setStep(4)}>
              Save and start sync <span className="arr">→</span>
            </button>
          </div>
        </div>
      )}

      {step === 4 && picked && (
        <Card>
          <div className="success">
            <div className="success-icon">
              <div className="ring" />
              <span>✓</span>
            </div>
            <h2>Connector active</h2>
            <p>Syncing the first 500 rows from {picked.name} now. We'll notify you when the first sync completes.</p>
            <div className="success-summary">
              <Pill tone="sage">Active</Pill>
              <Pill tone="indigo">Syncing</Pill>
              <Pill tone="neutral">{objects.filter((o) => o.enabled).length} objects</Pill>
              <Pill tone="neutral">{schedule}</Pill>
            </div>
            <div className="success-actions">
              <Link href="/app/connectors" className="btn btn-secondary">View all connectors</Link>
              <Link href={`/app/connectors/conn_sf`} className="btn btn-primary">Open connector →</Link>
            </div>
          </div>
        </Card>
      )}

      <style>{`
        .stepper {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          padding: 10px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
          width: fit-content;
        }
        .step {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 6px;
          border-radius: 999px;
          color: var(--color-ink-500);
          font-size: 12.5px;
        }
        .step-n {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
        }
        .step.on { background: #fff; color: var(--color-ink-950); box-shadow: 0 1px 0 rgba(15,17,42,.06), 0 6px 14px -8px rgba(15,17,42,.18); }
        .step.on .step-n { background: var(--color-indigo-600); color: #fff; border-color: var(--color-indigo-600); }
        .step.done { color: var(--color-ink-700); }
        .step.done .step-n { background: var(--color-sage-bg); color: var(--color-sage-fg); border-color: var(--color-sage-bg); }

        /* Catalog grid */
        .cat-block { margin-bottom: 24px; }
        .cat-label { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .cat-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .cat-rule { flex: 1; height: 1px; background: var(--color-ink-100); }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
        .cat-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px 16px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s, transform 0.18s, box-shadow 0.18s;
        }
        .cat-card:hover { border-color: var(--color-indigo-400); }
        .cat-card.picked { border-color: var(--color-indigo-600); box-shadow: 0 0 0 4px rgba(79,70,229,0.10); }
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
        .cat-name { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--color-ink-950); }
        .cat-desc { font-size: 12px; color: var(--color-ink-500); line-height: 1.45; min-height: 32px; }

        /* Auth step */
        .form-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
        }
        @media (max-width: 980px) { .form-grid { grid-template-columns: 1fr; } }
        .oauth { display: flex; flex-direction: column; gap: 20px; }
        .oauth-flow {
          background: var(--color-ink-50);
          border: 1px dashed var(--color-ink-200);
          border-radius: var(--radius-md);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
        }
        .oauth-step {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .oauth-line { color: var(--color-ink-700); font-size: 14px; }
        .oauth-or {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
        }
        .rule { height: 1px; background: var(--color-ink-200); }
        .or-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .cred-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 16px;
        }
        .cred-form label {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .cred-form label span {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .cred-form input, .cred-form select {
          font: inherit;
          font-size: 13.5px;
          padding: 9px 12px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          outline: 0;
          font-family: var(--font-mono);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cred-form input:focus, .cred-form select:focus {
          border-color: var(--color-indigo-400);
          box-shadow: 0 0 0 4px rgba(79,70,229,0.08);
        }
        .cred-actions {
          grid-column: 1 / -1;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 4px;
        }

        .why { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .why li {
          display: grid;
          grid-template-columns: 26px 1fr;
          gap: 10px;
          font-size: 13px;
          color: var(--color-ink-700);
          line-height: 1.5;
        }
        .why-ic {
          width: 26px; height: 26px;
          border-radius: 6px;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 14px;
        }

        /* Scope step */
        .obj-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
        .obj {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 12px 0;
          border-top: 1px solid var(--color-ink-100);
        }
        .obj:first-child { border-top: 0; padding-top: 0; }
        .obj-pick { display: inline-flex; align-items: center; gap: 12px; cursor: pointer; }
        .obj-pick input { display: none; }
        .obj-mark {
          width: 20px; height: 20px;
          border-radius: 5px;
          border: 1px solid var(--color-ink-300);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: transparent;
          font-size: 11px;
          flex-shrink: 0;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .obj.on .obj-mark { background: var(--color-indigo-600); border-color: var(--color-indigo-600); color: #fff; }
        .obj-text { display: flex; flex-direction: column; gap: 1px; }
        .obj-name { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--color-ink-950); }
        .obj-desc { font-size: 12px; color: var(--color-ink-500); line-height: 1.4; }

        .obj-toggle {
          display: inline-flex;
          padding: 3px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
        }
        .toggle {
          padding: 5px 12px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--color-ink-500);
          border-radius: 999px;
          transition: background 0.15s, color 0.15s;
        }
        .toggle:disabled { opacity: 0.4; cursor: not-allowed; }
        .toggle:not(:disabled):hover { color: var(--color-ink-950); }
        .toggle.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15,17,42,.06), 0 4px 8px -4px rgba(15,17,42,.18);
        }

        .sched-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .sched {
          padding: 8px 14px;
          border: 1px solid var(--color-ink-200);
          border-radius: 999px;
          font-size: 13px;
          color: var(--color-ink-700);
          background: #fff;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .sched:hover { border-color: var(--color-indigo-400); }
        .sched.on {
          background: var(--color-indigo-600);
          border-color: var(--color-indigo-600);
          color: #fff;
        }
        .sched-hint {
          margin-top: 12px;
          font-size: 12.5px;
          color: var(--color-ink-500);
          line-height: 1.5;
        }

        .step-actions {
          grid-column: 1 / -1;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        /* Success */
        .success {
          text-align: center;
          padding: 36px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .success-icon { position: relative; width: 72px; height: 72px; }
        .success-icon .ring {
          position: absolute; inset: 0;
          border: 2px solid var(--color-sage-bg);
          border-radius: 50%;
        }
        .success-icon span {
          position: absolute; inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          color: var(--color-sage-fg);
        }
        .success h2 { font-size: 22px; }
        .success p { color: var(--color-ink-500); max-width: 460px; font-size: 14px; line-height: 1.55; }
        .success-summary { display: inline-flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
        .success-actions { display: inline-flex; gap: 10px; margin-top: 8px; }
      `}</style>
    </>
  );
}
