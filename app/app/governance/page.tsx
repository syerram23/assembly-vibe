"use client";

import { useState } from "react";
import { PageHeader, Card, Pill, StatTile } from "@/components/ui";
import { policyRulesets, entities } from "@/lib/mocks";

type Tab = "PII" | "Data rules" | "Compliance" | "Retention";
const TABS: Tab[] = ["PII", "Data rules", "Compliance", "Retention"];

// ─── Invented PII rows (built from entities + 3 more invented) ─────────────

type PIICategory = "Email" | "SSN" | "DOB" | "Salary" | "Address" | "Phone" | "Name" | "DL";
type MaskStrategy = "Full mask" | "Partial mask" | "Hash" | "Tokenize";
type DetectMethod = "auto" | "pattern" | "manual";

interface PIIRow {
  id: string;
  field: string;
  entity: string;
  category: PIICategory;
  detection: DetectMethod;
  masking: MaskStrategy;
  active: boolean;
  invented?: boolean;
}

function buildPIIRows(): PIIRow[] {
  const rows: PIIRow[] = [];
  for (const e of entities) {
    for (const f of e.fields) {
      if (!f.isPII) continue;
      let cat: PIICategory = "Name";
      let mask: MaskStrategy = "Partial mask";
      if (f.name.includes("email"))  { cat = "Email";   mask = "Partial mask"; }
      else if (f.name.includes("dob") || f.name.includes("birth")) { cat = "DOB"; mask = "Full mask"; }
      else if (f.name.includes("salary")) { cat = "Salary"; mask = "Full mask"; }
      else if (f.name.includes("name")) { cat = "Name"; mask = "Partial mask"; }
      rows.push({
        id: `pii_${e.name}_${f.name}`,
        field: `${e.name}.${f.name}`,
        entity: e.displayName,
        category: cat,
        detection: "auto",
        masking: mask,
        active: true,
      });
    }
  }
  // Invented placeholder rows (not in mocks)
  rows.push({ id: "pii_emp_ssn",      field: "employee.ssn",            entity: "Employee",  category: "SSN",     detection: "pattern", masking: "Full mask",     active: true,  invented: true });
  rows.push({ id: "pii_emp_phone",    field: "employee.phone",          entity: "Employee",  category: "Phone",   detection: "pattern", masking: "Partial mask",  active: true,  invented: true });
  rows.push({ id: "pii_emp_addr",     field: "employee.home_address",   entity: "Employee",  category: "Address", detection: "auto",    masking: "Tokenize",      active: true,  invented: true });
  rows.push({ id: "pii_cand_phone",   field: "candidate.phone",         entity: "Candidate", category: "Phone",   detection: "pattern", masking: "Partial mask",  active: true,  invented: true });
  rows.push({ id: "pii_cand_dl",      field: "candidate.drivers_lic",   entity: "Candidate", category: "DL",      detection: "manual",  masking: "Hash",          active: false, invented: true });
  return rows;
}

// ─── Data rules (invented) ──────────────────────────────────────────────────

const dataRules = [
  { id: "dr_iso",      name: "Normalize country codes to ISO 3166-2",      appliesTo: "entity:* · country",          transformation: "Upper-case · 2-letter · validated against ISO 3166-2 table.", active: true },
  { id: "dr_trim",     name: "Trim whitespace on email",                   appliesTo: "entity:*.email",              transformation: "Strip leading/trailing whitespace; lowercase domain.",         active: true },
  { id: "dr_dob",      name: "Validate dob is past date",                  appliesTo: "entity:employee.date_of_birth", transformation: "Reject records with dob >= today; warn at <16 years.",       active: true },
  { id: "dr_dup",      name: "Detect duplicate accounts by domain",        appliesTo: "entity:account",              transformation: "Cluster by registered email domain; flag duplicates for HITL.", active: true },
  { id: "dr_currency", name: "Standardize currency amounts to USD",        appliesTo: "entity:claim.amount · entity:account.annual_value", transformation: "Convert at month-end mid-market FX; store original + USD.",     active: true },
  { id: "dr_phone",    name: "Format phone numbers as E.164",              appliesTo: "entity:*.phone",              transformation: "+CC NNNN NNNN; tag region; reject malformed.",                  active: false },
];

// ─── Retention (invented + ruleset) ────────────────────────────────────────

const retentionPolicies = [
  { k: "Audit logs",          v: "7 years",                        note: "Immutable; required for compliance (Reg E, SOX)." },
  { k: "Embeddings",          v: "3 years",                        note: "Re-indexed monthly · purged on entity deletion." },
  { k: "Application logs",    v: "90 days",                        note: "Errors retained 1 year; warning+info purged at 90d." },
  { k: "Workflow runs",       v: "1 year",                         note: "Run metadata + step IO; lineage preserved in audit." },
  { k: "Customer records",    v: "customer-controlled",            note: "Your data, your schedule. Default never-delete; opt-in TTL per entity." },
];

export default function GovernancePage() {
  const [tab, setTab] = useState<Tab>("PII");

  return (
    <>
      <PageHeader
        eyebrow="Governance · platform"
        title="Governance"
        description="PII detection and masking, data transformation rules, compliance rule packs, retention. The rules every app inherits."
      />

      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={"tab " + (tab === t ? "on" : "")}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "PII" && <PIITab />}
      {tab === "Data rules" && <DataRulesTab />}
      {tab === "Compliance" && <ComplianceTab />}
      {tab === "Retention" && <RetentionTab />}

      <style>{`
        .tabs {
          display: inline-flex;
          gap: 2px;
          border-bottom: 1px solid var(--color-ink-100);
          margin-bottom: 22px;
          margin-top: 6px;
          width: 100%;
        }
        .tab {
          padding: 10px 16px;
          font-family: var(--font-body);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-ink-500);
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color .15s, border-color .15s;
        }
        .tab:hover { color: var(--color-ink-950); }
        .tab.on { color: var(--color-ink-950); border-bottom-color: var(--color-indigo-600); }
      `}</style>
    </>
  );
}

// ─── PII tab ────────────────────────────────────────────────────────────────

function PIITab() {
  const [rows, setRows] = useState<PIIRow[]>(buildPIIRows());
  const detected = rows.length;
  const masked = rows.filter((r) => r.active).length;
  const overrides = rows.filter((r) => r.detection === "manual").length + 2;

  return (
    <>
      <section className="stat-row">
        <StatTile label="Fields detected"     value={detected} hint="across 4 entities" />
        <StatTile label="Fields auto-masked"  value={masked}   hint="enforced at query time" emphasis="sage" />
        <StatTile label="Custom overrides"    value={overrides} hint="manual rules" />
        <StatTile label="Last scan"           value="4h ago"   hint="next · in 2h" />
      </section>

      <div className="action-row">
        <div className="ar-l">
          <span className="eyebrow"><span className="dot" />Detection scope</span>
          <p>Every new field added through a connector or migration is scanned automatically. Manual rules survive re-scans.</p>
        </div>
        <button type="button" className="btn btn-primary">Run PII scan now</button>
      </div>

      <Card>
        <table className="pii">
          <thead>
            <tr>
              <th>Field path</th>
              <th>Entity</th>
              <th>Category</th>
              <th>Detection</th>
              <th>Masking strategy</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <code>{r.field}</code>
                  {r.invented && <span className="invented" title="Invented placeholder">+</span>}
                </td>
                <td>{r.entity}</td>
                <td><Pill tone="warn">{r.category}</Pill></td>
                <td className="mono small">
                  <span className={"det det-" + r.detection}>{r.detection}</span>
                </td>
                <td>
                  <select className="mask-sel" defaultValue={r.masking}>
                    <option>Full mask</option>
                    <option>Partial mask</option>
                    <option>Hash</option>
                    <option>Tokenize</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className={"sw " + (r.active ? "on" : "")}
                    onClick={() => setRows(rows.map((x) => x.id === r.id ? { ...x, active: !x.active } : x))}
                    aria-pressed={r.active}
                  >
                    <span className="knob" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <SharedStyles />
      <style>{`
        .stat-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 22px;
        }
        @media (max-width: 900px) { .stat-row { grid-template-columns: repeat(2, 1fr); } }

        .action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding: 16px 20px;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-200);
          border-radius: var(--radius-md);
          margin-bottom: 20px;
        }
        .ar-l { max-width: 640px; }
        .ar-l p { font-size: 13px; color: var(--color-ink-700); margin-top: 4px; line-height: 1.5; }

        .pii { width: 100%; border-collapse: collapse; }
        .pii thead th {
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
        .pii thead th:first-child { padding-left: 0; }
        .pii tbody tr { border-bottom: 1px solid var(--color-ink-100); transition: background .12s; }
        .pii tbody tr:last-child { border-bottom: 0; }
        .pii tbody tr:hover { background: var(--color-ink-50); }
        .pii td { padding: 11px 16px; font-size: 13px; color: var(--color-ink-700); vertical-align: middle; }
        .pii td:first-child { padding-left: 0; }
        .pii code {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
          font-weight: 600;
        }
        .pii .mono { font-family: var(--font-mono); }
        .pii .small { font-size: 11.5px; }

        .invented {
          margin-left: 6px;
          font-family: var(--font-mono);
          font-size: 9px;
          padding: 1px 4px;
          border-radius: 3px;
          background: var(--color-ink-100);
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }
        .det {
          font-family: var(--font-mono);
          font-size: 10.5px;
          padding: 2px 7px;
          border-radius: 3px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .det-auto    { background: var(--color-indigo-50); color: var(--color-indigo-700); }
        .det-pattern { background: var(--color-amber-bg);  color: var(--color-amber-fg);   }
        .det-manual  { background: var(--color-ink-100);   color: var(--color-ink-700);    }

        .mask-sel {
          padding: 5px 8px;
          font-size: 12.5px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 6px;
          font-family: var(--font-body);
          color: var(--color-ink-950);
        }
      `}</style>
    </>
  );
}

// ─── Data rules tab ─────────────────────────────────────────────────────────

function DataRulesTab() {
  const [active, setActive] = useState(() => Object.fromEntries(dataRules.map((r) => [r.id, r.active])));

  return (
    <>
      <div className="action-row">
        <div className="ar-l">
          <span className="eyebrow"><span className="dot" />Transformation pipeline</span>
          <p>Rules apply at ingest. Every transformation is auditable and reversible — your raw source records are never overwritten.</p>
        </div>
        <button type="button" className="btn btn-primary">+ New rule</button>
      </div>

      <div className="dr-list">
        {dataRules.map((r) => {
          const on = active[r.id];
          return (
            <article key={r.id} className={"dr-card " + (on ? "on" : "")}>
              <div className="dr-l">
                <h4>{r.name}</h4>
                <p className="dr-applies"><code>applies-to</code> {r.appliesTo}</p>
                <p className="dr-trans">{r.transformation}</p>
              </div>
              <div className="dr-r">
                <button
                  type="button"
                  className={"sw " + (on ? "on" : "")}
                  onClick={() => setActive({ ...active, [r.id]: !on })}
                  aria-pressed={on}
                >
                  <span className="knob" />
                </button>
                <button type="button" className="dr-edit">Edit →</button>
              </div>
            </article>
          );
        })}
      </div>

      <SharedStyles />
      <style>{`
        .action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding: 16px 20px;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-200);
          border-radius: var(--radius-md);
          margin-bottom: 20px;
        }
        .ar-l { max-width: 640px; }
        .ar-l p { font-size: 13px; color: var(--color-ink-700); margin-top: 4px; line-height: 1.5; }

        .dr-list { display: flex; flex-direction: column; gap: 10px; }
        .dr-card {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          padding: 18px 22px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          transition: border-color .15s, background .15s;
        }
        .dr-card.on { border-left: 3px solid var(--color-indigo-600); padding-left: 19px; }
        .dr-card:hover { background: var(--color-ink-50); }
        .dr-l h4 {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-ink-950);
          letter-spacing: -0.008em;
        }
        .dr-applies {
          margin-top: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .dr-applies code { background: var(--color-ink-50); padding: 1px 5px; color: var(--color-ink-700); font-size: 10.5px; }
        .dr-trans {
          margin-top: 6px;
          font-size: 13px;
          color: var(--color-ink-700);
          line-height: 1.5;
        }
        .dr-r {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          justify-content: space-between;
        }
        .dr-edit {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-indigo-700);
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

// ─── Compliance tab ─────────────────────────────────────────────────────────

const certifications = [
  { name: "SOC 2 Type II",   status: "achieved",      date: "2026-02-14", note: "Auditor · Schellman · type II report covers Nov 2025 – Jan 2026." },
  { name: "ISO 27001",       status: "in progress",   date: "Audit scheduled · Aug 2026", note: "Stage 1 complete · stage 2 in scoping." },
  { name: "HIPAA-aligned",   status: "achieved",      date: "2025-12-08", note: "BAA available on request · technical safeguards reviewed by Wickr Group." },
  { name: "GLBA-aligned",    status: "achieved",      date: "2026-01-22", note: "Information safeguards rule · privacy of consumer financial info." },
];

function ComplianceTab() {
  const [active, setActive] = useState(() => Object.fromEntries(policyRulesets.map((p) => [p.id, p.active])));

  return (
    <>
      <section className="rs-grid">
        {policyRulesets.map((p) => {
          const on = active[p.id];
          return (
            <article key={p.id} className="rs-card">
              <header>
                <Pill tone={p.category === "PII" ? "warn" : p.category === "Retention" ? "amber" : "indigo"}>{p.category}</Pill>
                <button
                  type="button"
                  className={"sw " + (on ? "on" : "")}
                  onClick={() => setActive({ ...active, [p.id]: !on })}
                  aria-pressed={on}
                >
                  <span className="knob" />
                </button>
              </header>
              <h4>{p.name}</h4>
              <div className="rs-ver">
                <code>{p.version}</code>
                <span className="muted">·</span>
                <span className="rs-rules">{p.rules.length} rule{p.rules.length === 1 ? "" : "s"}</span>
              </div>
              <ul className="rs-bullets">
                {p.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <footer>
                <button type="button" className="rs-edit">View ruleset →</button>
              </footer>
            </article>
          );
        })}
      </section>

      <section className="posture">
        <header className="posture-head">
          <div>
            <span className="eyebrow"><span className="dot" />Compliance posture</span>
            <h3>Where Assembly stands on certifications.</h3>
            <p>External attestations and certifications. Your data plane inherits these by virtue of running on the platform.</p>
          </div>
        </header>
        <div className="cert-grid">
          {certifications.map((c) => (
            <article key={c.name} className={"cert cert-" + c.status.replace(" ", "-")}>
              <div className="cert-head">
                <span className="cert-name">{c.name}</span>
                <Pill tone={c.status === "achieved" ? "sage" : "amber"}>{c.status}</Pill>
              </div>
              <p className="cert-date">{c.date}</p>
              <p className="cert-note">{c.note}</p>
              <button type="button" className="cert-dl">
                {c.status === "achieved" ? "Download report ↓" : "View audit plan →"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <SharedStyles />
      <style>{`
        .rs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        @media (max-width: 1100px) { .rs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 720px)  { .rs-grid { grid-template-columns: 1fr; } }
        .rs-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 20px 22px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
        }
        .rs-card header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .rs-card h4 {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: var(--color-ink-950);
          letter-spacing: -0.012em;
          line-height: 1.3;
        }
        .rs-ver {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          font-size: 12px;
          color: var(--color-ink-500);
        }
        .rs-ver code {
          font-family: var(--font-mono);
          font-size: 11px;
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          padding: 1px 6px;
          border-radius: 3px;
          font-weight: 600;
        }
        .rs-rules { font-family: var(--font-mono); font-size: 11px; }
        .muted { color: var(--color-ink-400); }
        .rs-bullets {
          list-style: none;
          margin: 8px 0 0;
          padding: 8px 0 0;
          border-top: 1px dashed var(--color-ink-100);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .rs-bullets li {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
          padding-left: 12px;
          position: relative;
          line-height: 1.55;
        }
        .rs-bullets li::before {
          content: "·";
          position: absolute;
          left: 4px;
          color: var(--color-indigo-600);
        }
        .rs-card footer {
          margin-top: auto;
          padding-top: 10px;
        }
        .rs-edit {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-indigo-700);
          font-weight: 600;
        }

        .posture {
          padding: 28px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: var(--radius-lg);
        }
        .posture-head h3 {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.018em;
          color: var(--color-ink-950);
          margin: 8px 0 6px;
        }
        .posture-head p { color: var(--color-ink-500); font-size: 13.5px; max-width: 640px; }
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 18px;
        }
        @media (max-width: 1100px) { .cert-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 720px)  { .cert-grid { grid-template-columns: 1fr; } }
        .cert {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cert-achieved { border-top: 3px solid var(--color-sage-fg); }
        .cert-in-progress { border-top: 3px solid var(--color-amber-fg); }
        .cert-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .cert-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: -0.008em;
          color: var(--color-ink-950);
        }
        .cert-date {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }
        .cert-note {
          font-size: 12px;
          color: var(--color-ink-700);
          line-height: 1.5;
          flex: 1;
        }
        .cert-dl {
          margin-top: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-indigo-700);
          font-weight: 600;
          align-self: flex-start;
        }
      `}</style>
    </>
  );
}

// ─── Retention tab ──────────────────────────────────────────────────────────

function RetentionTab() {
  return (
    <>
      <Card title="Retention policies" subtitle="How long each class of data is kept, where it lives, and when it's purged.">
        <ul className="ret-list">
          {retentionPolicies.map((r) => (
            <li key={r.k}>
              <div className="ret-k">
                <span className="lbl">{r.k}</span>
              </div>
              <div className="ret-v">
                <code>{r.v}</code>
                <p>{r.note}</p>
              </div>
              <div className="ret-edit">
                <button type="button" className="btn btn-ghost small">Edit →</button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div style={{ height: 18 }} />

      <section className="enf">
        <header>
          <div>
            <span className="eyebrow"><span className="dot" />Retention enforcement</span>
            <h3>Last run · May 18, 03:00 UTC</h3>
            <p>Retention purges run nightly. Audit trail of every deletion is itself retained per the 7-year audit log policy.</p>
          </div>
          <button type="button" className="btn btn-secondary">Run enforcement now</button>
        </header>
        <div className="enf-grid">
          <div className="enf-tile">
            <span className="enf-l">Records expired (last run)</span>
            <span className="enf-v">2,184</span>
            <span className="enf-h">application logs · &gt; 90 days</span>
          </div>
          <div className="enf-tile">
            <span className="enf-l">Embeddings purged</span>
            <span className="enf-v">412</span>
            <span className="enf-h">deleted-entity cascades</span>
          </div>
          <div className="enf-tile">
            <span className="enf-l">Audit log size</span>
            <span className="enf-v">8.2 GB</span>
            <span className="enf-h">retained · 7 years</span>
          </div>
          <div className="enf-tile">
            <span className="enf-l">Next purge run</span>
            <span className="enf-v">tonight · 03:00 UTC</span>
            <span className="enf-h">scheduled</span>
          </div>
        </div>
      </section>

      <SharedStyles />
      <style>{`
        .ret-list { list-style: none; margin: 0; padding: 0; }
        .ret-list li {
          display: grid;
          grid-template-columns: 180px 1fr auto;
          gap: 18px;
          align-items: flex-start;
          padding: 18px 0;
          border-top: 1px solid var(--color-ink-100);
        }
        .ret-list li:first-child { border-top: 0; padding-top: 4px; }
        @media (max-width: 720px) { .ret-list li { grid-template-columns: 1fr; } }
        .ret-k .lbl {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .ret-v code {
          font-family: var(--font-mono);
          font-size: 15px;
          background: transparent;
          padding: 0;
          font-weight: 600;
          color: var(--color-ink-950);
        }
        .ret-v p {
          margin-top: 6px;
          font-size: 13px;
          color: var(--color-ink-500);
          line-height: 1.5;
          max-width: 540px;
        }
        .btn-ghost.small { padding: 6px 10px; font-size: 12.5px; }

        .enf {
          padding: 24px 26px;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-200);
          border-radius: var(--radius-lg);
        }
        .enf header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        }
        .enf h3 {
          font-family: var(--font-display);
          font-size: 18px;
          letter-spacing: -0.012em;
          font-weight: 600;
          color: var(--color-ink-950);
          margin: 6px 0 4px;
        }
        .enf p { color: var(--color-ink-700); font-size: 13px; max-width: 580px; }
        .enf-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 18px;
        }
        @media (max-width: 900px) { .enf-grid { grid-template-columns: repeat(2, 1fr); } }
        .enf-tile {
          background: #fff;
          border: 1px solid var(--color-indigo-200);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .enf-l {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .enf-v {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.018em;
          color: var(--color-ink-950);
          line-height: 1.1;
        }
        .enf-h {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }
      `}</style>
    </>
  );
}

// ─── Shared switch styles (used by PII, Data rules, Compliance) ─────────────

function SharedStyles() {
  return (
    <style>{`
      .sw {
        width: 36px; height: 20px;
        background: var(--color-ink-200);
        border-radius: 999px;
        position: relative;
        transition: background .18s;
        flex-shrink: 0;
      }
      .sw .knob {
        position: absolute;
        top: 2px; left: 2px;
        width: 16px; height: 16px;
        background: #fff;
        border-radius: 50%;
        transition: transform .18s;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
      }
      .sw.on { background: var(--color-indigo-600); }
      .sw.on .knob { transform: translateX(16px); }
    `}</style>
  );
}
