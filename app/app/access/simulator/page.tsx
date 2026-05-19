"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { memberships, userById, entities, currentOrg } from "@/lib/mocks";
import type { Role, EntityType, Field } from "@/lib/types";

// ─── Mock record fixtures ──────────────────────────────────────────────────
// Five mock IDs per entity, each backed by a realistic record. We seed
// values in this module — no DB.

type RecordRow = { id: string; data: Record<string, string | number> };

const FIXTURES: Record<string, RecordRow[]> = {
  ent_employee: [
    {
      id: "e_847291",
      data: {
        employee_id:   "e_847291",
        full_name:     "Anika Patel",
        email:         "anika.patel@acme.com",
        level:         "L6 · Senior",
        location:      "Boston, MA",
        department:    "Risk Engineering",
        date_of_birth: "1988-04-22",
        base_salary:   189500,
      },
    },
    {
      id: "e_201044",
      data: {
        employee_id:   "e_201044",
        full_name:     "Marcus Aldridge",
        email:         "marcus.aldridge@acme.com",
        level:         "L5 · Staff",
        location:      "Chicago, IL",
        department:    "Loan Origination",
        date_of_birth: "1991-11-07",
        base_salary:   164000,
      },
    },
    {
      id: "e_558210",
      data: {
        employee_id:   "e_558210",
        full_name:     "Tomás Vega",
        email:         "tomas.vega@acme.com",
        level:         "L7 · Principal",
        location:      "New York, NY",
        department:    "Compliance",
        date_of_birth: "1981-02-18",
        base_salary:   232000,
      },
    },
    {
      id: "e_119887",
      data: {
        employee_id:   "e_119887",
        full_name:     "Hyun-ji Choi",
        email:         "hyunji.choi@acme.com",
        level:         "L4 · Senior",
        location:      "Remote · CA",
        department:    "Data Platform",
        date_of_birth: "1993-08-30",
        base_salary:   148000,
      },
    },
    {
      id: "e_004492",
      data: {
        employee_id:   "e_004492",
        full_name:     "Olivia Brennan",
        email:         "olivia.brennan@acme.com",
        level:         "L6 · Senior",
        location:      "Austin, TX",
        department:    "Customer Operations",
        date_of_birth: "1987-06-14",
        base_salary:   181000,
      },
    },
  ],
  ent_candidate: [
    {
      id: "c_770211",
      data: {
        candidate_id: "c_770211",
        full_name:    "Sasha Ng",
        applied_role: "Senior Risk Modeler",
        stage:        "Onsite",
        owner_id:     "u_priya",
      },
    },
    {
      id: "c_770314",
      data: {
        candidate_id: "c_770314",
        full_name:    "Devereaux Hughes",
        applied_role: "Loan Servicing Analyst",
        stage:        "Phone screen",
        owner_id:     "u_jordan",
      },
    },
    {
      id: "c_770415",
      data: {
        candidate_id: "c_770415",
        full_name:    "Kavya Subramaniam",
        applied_role: "Data Platform Engineer",
        stage:        "Offer extended",
        owner_id:     "u_devon",
      },
    },
    {
      id: "c_770516",
      data: {
        candidate_id: "c_770516",
        full_name:    "Mateo Caballero",
        applied_role: "Compliance Reviewer",
        stage:        "Recruiter screen",
        owner_id:     "u_priya",
      },
    },
    {
      id: "c_770617",
      data: {
        candidate_id: "c_770617",
        full_name:    "Brigitte Allard",
        applied_role: "Engineering Manager · Risk",
        stage:        "Final round",
        owner_id:     "u_maria",
      },
    },
  ],
  ent_claim: [
    { id: "cl_44871",  data: { claim_id: "cl_44871",  amount: 12400,  state: "CA", opened_at: "2026-04-22", policy_ref: "pol_91244" } },
    { id: "cl_44872",  data: { claim_id: "cl_44872",  amount: 38200,  state: "TX", opened_at: "2026-04-29", policy_ref: "pol_88102" } },
    { id: "cl_44873",  data: { claim_id: "cl_44873",  amount: 4150,   state: "NY", opened_at: "2026-05-02", policy_ref: "pol_77023" } },
    { id: "cl_44874",  data: { claim_id: "cl_44874",  amount: 211800, state: "FL", opened_at: "2026-05-08", policy_ref: "pol_64210" } },
    { id: "cl_44875",  data: { claim_id: "cl_44875",  amount: 9750,   state: "IL", opened_at: "2026-05-14", policy_ref: "pol_55819" } },
  ],
  ent_account: [
    { id: "a_12001", data: { account_id: "a_12001", name: "Northwind Logistics",   annual_value: 1240000 } },
    { id: "a_12002", data: { account_id: "a_12002", name: "Halcyon Capital Group", annual_value: 4880000 } },
    { id: "a_12003", data: { account_id: "a_12003", name: "Pacifica Hospitality",  annual_value: 612000 } },
    { id: "a_12004", data: { account_id: "a_12004", name: "Tideline Brewing Co.",  annual_value: 184000 } },
    { id: "a_12005", data: { account_id: "a_12005", name: "Aurora Robotics",       annual_value: 2960000 } },
  ],
};

// ─── Access resolution (matches the matrix from the overview page) ──────────

type Verdict = "visible" | "masked" | "redacted" | "blocked";

function fieldVerdict(role: Role, field: Field): Verdict {
  // Salary fields are most sensitive
  if (field.name.toLowerCase().includes("salary")) {
    if (role === "Owner") return "visible";
    if (role === "Admin") return "masked";
    return "blocked";
  }
  // PII: name, email, dob
  if (field.isPII) {
    if (role === "Owner") return "visible";
    if (role === "Admin") return "visible";
    if (role === "Reviewer") return "masked";
    if (role === "Builder" || role === "Viewer") return "redacted";
  }
  return "visible";
}

function maskValue(field: Field, value: string | number): string {
  const s = String(value);
  if (field.name.toLowerCase().includes("salary")) {
    return "$ ███,███";
  }
  if (field.name.includes("email")) {
    const [u, d] = s.split("@");
    if (!d) return "•••@•••";
    return u.slice(0, 1) + "•••@" + d;
  }
  if (field.name.includes("name")) {
    const parts = s.split(" ");
    return parts.map((p, i) => i === 0 ? p[0] + "•••" : "•••").join(" ");
  }
  if (field.name.includes("birth") || field.type === "date") {
    return "████-██-██";
  }
  return "•••";
}

// ─── Component ─────────────────────────────────────────────────────────────

const ROLE_LIST: Role[] = ["Owner", "Admin", "Builder", "Reviewer", "Viewer"];

export default function SimulatorPage() {
  // Default: simulate Maria (Owner) viewing first Employee fixture.
  const defaultMembership = memberships[0]; // m_1 — Maria, Owner
  const [membershipId, setMembershipId] = useState<string>(defaultMembership.id);
  const [entityId,     setEntityId]     = useState<string>("ent_employee");
  const [recordId,     setRecordId]     = useState<string>("e_847291");
  const [comparing,    setComparing]    = useState<Role | null>(null);

  const membership = memberships.find((m) => m.id === membershipId) ?? defaultMembership;
  const simulatedUser = userById(membership.userId);
  const entity = entities.find((e) => e.id === entityId) ?? entities[0];
  const records = FIXTURES[entity.id] ?? [];
  const record = records.find((r) => r.id === recordId) ?? records[0];

  // If user changes entity, snap recordId to first fixture for that entity.
  function onEntityChange(next: string) {
    setEntityId(next);
    const list = FIXTURES[next];
    setRecordId(list?.[0]?.id ?? "");
  }

  const simulatedAt = useMemo(() => new Date().toISOString().replace(/\.\d{3}Z$/, "Z"), [membershipId, entityId, recordId]);

  return (
    <>
      <PageHeader
        eyebrow="Access · simulator"
        title="Simulate the data plane as any user"
        description="Before you ship, preview what a Builder, Reviewer, or Viewer will see. Field-by-field. Logged to the audit trail."
        actions={
          <Link href="/app/access" className="btn btn-secondary">
            ← Back to Access
          </Link>
        }
      />

      <div className="sim-grid">
        {/* LEFT · Configure */}
        <Card title="Configure simulation" subtitle="Pick a user, pick a record. Inspect what they see." padding={20}>
          <div className="cfg">
            <label className="cfg-f">
              <span className="cfg-l">Choose a user</span>
              <select
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
                className="cfg-sel"
              >
                {memberships.map((m) => {
                  const u = userById(m.userId);
                  if (!u) return null;
                  return (
                    <option key={m.id} value={m.id}>
                      {u.fullName} · {m.role}
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="cfg-f">
              <span className="cfg-l">Choose a record to test</span>
              <select
                value={entityId}
                onChange={(e) => onEntityChange(e.target.value)}
                className="cfg-sel"
              >
                {entities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.displayName}
                  </option>
                ))}
              </select>
            </label>

            <label className="cfg-f">
              <span className="cfg-l">Choose a specific record ID</span>
              <select
                value={recordId}
                onChange={(e) => setRecordId(e.target.value)}
                className="cfg-sel cfg-mono"
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>{r.id}</option>
                ))}
              </select>
            </label>

            <button type="button" className="btn btn-primary cfg-run">
              Run simulation <span className="arr">→</span>
            </button>

            <div className="cfg-quick">
              <div className="cfg-quick-l">Quick actions</div>
              <div className="cfg-quick-btns">
                <button
                  type="button"
                  className={"qbtn " + (membership.role === "Owner" && !comparing ? "qbtn-on" : "")}
                  onClick={() => { setMembershipId("m_1"); setComparing(null); }}
                >
                  Try as Owner
                </button>
                <button
                  type="button"
                  className={"qbtn " + (membership.role === "Builder" && !comparing ? "qbtn-on" : "")}
                  onClick={() => { setMembershipId("m_3"); setComparing(null); }}
                >
                  Try as Builder
                </button>
                <button
                  type="button"
                  className={"qbtn " + (membership.role === "Reviewer" && !comparing ? "qbtn-on" : "")}
                  onClick={() => { setMembershipId("m_5"); setComparing(null); }}
                >
                  Try as Reviewer
                </button>
                <button
                  type="button"
                  className="qbtn qbtn-compare"
                  onClick={() => setComparing(comparing ? null : (membership.role === "Owner" ? "Builder" : "Owner"))}
                >
                  {comparing ? "Hide compare" : "Compare side-by-side"}
                </button>
              </div>
            </div>

            <div className="cfg-note">
              <span className="cfg-note-eyebrow">HOW IT WORKS</span>
              <p>
                The simulator resolves <b>row-level</b> visibility, then walks each <b>field</b> through the policy
                ruleset (PII detection v1.4 · salary mask). The output is identical to what the user would see in
                any app that reads <code>{entity.name}</code>.
              </p>
            </div>
          </div>
        </Card>

        {/* RIGHT · Result */}
        <div className="result-col">
          <ResultCard
            title="Result"
            role={membership.role}
            simulatedUserName={simulatedUser?.fullName ?? "—"}
            entity={entity}
            record={record}
          />

          {comparing && (
            <ResultCard
              title={`Comparison · as ${comparing}`}
              role={comparing}
              simulatedUserName={`(virtual · ${comparing} role)`}
              entity={entity}
              record={record}
              compact
            />
          )}

          <AuditPanel
            membership={membership}
            simulatedUserName={simulatedUser?.fullName ?? "—"}
            entity={entity}
            record={record}
            simulatedAt={simulatedAt}
          />
        </div>
      </div>

      <style>{`
        .sim-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 1100px) {
          .sim-grid { grid-template-columns: 1fr; }
        }
        .result-col { display: flex; flex-direction: column; gap: 20px; }

        .cfg { display: flex; flex-direction: column; gap: 14px; }
        .cfg-f { display: flex; flex-direction: column; gap: 6px; }
        .cfg-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          color: var(--color-ink-500);
          text-transform: uppercase;
        }
        .cfg-sel {
          appearance: none;
          padding: 10px 12px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          font-size: 14px;
          color: var(--color-ink-950);
          font-family: var(--font-body);
          background-image: linear-gradient(45deg, transparent 50%, var(--color-ink-500) 50%), linear-gradient(135deg, var(--color-ink-500) 50%, transparent 50%);
          background-position: calc(100% - 16px) 50%, calc(100% - 11px) 50%;
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
          padding-right: 32px;
          cursor: pointer;
        }
        .cfg-sel:hover { border-color: var(--color-ink-300); }
        .cfg-sel:focus { outline: none; border-color: var(--color-indigo-600); box-shadow: 0 0 0 3px var(--color-indigo-100); }
        .cfg-mono { font-family: var(--font-mono); font-size: 13px; }

        .cfg-run { margin-top: 6px; justify-content: center; }

        .cfg-quick {
          margin-top: 10px;
          padding-top: 16px;
          border-top: 1px dashed var(--color-ink-200);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cfg-quick-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          color: var(--color-ink-500);
          text-transform: uppercase;
        }
        .cfg-quick-btns { display: flex; flex-wrap: wrap; gap: 6px; }
        .qbtn {
          padding: 7px 12px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
          font-size: 12.5px;
          color: var(--color-ink-700);
          font-family: var(--font-mono);
          letter-spacing: 0.04em;
          transition: background .15s, border-color .15s, color .15s;
        }
        .qbtn:hover { background: var(--color-indigo-50); border-color: var(--color-indigo-200); color: var(--color-indigo-700); }
        .qbtn-on {
          background: var(--color-indigo-600);
          border-color: var(--color-indigo-600);
          color: #fff;
        }
        .qbtn-on:hover {
          background: var(--color-indigo-700);
          border-color: var(--color-indigo-700);
          color: #fff;
        }
        .qbtn-compare {
          background: transparent;
          border-color: var(--color-ink-300);
          margin-left: auto;
        }

        .cfg-note {
          margin-top: 6px;
          padding: 12px 14px;
          background: var(--color-ink-50);
          border-radius: 8px;
          font-size: 12.5px;
          line-height: 1.55;
        }
        .cfg-note-eyebrow {
          display: block;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          color: var(--color-indigo-700);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .cfg-note p { color: var(--color-ink-700); }
        .cfg-note code {
          font-size: 11px;
          background: #fff;
        }
      `}</style>
    </>
  );
}

// ─── Result card ───────────────────────────────────────────────────────────

function ResultCard({
  title,
  role,
  simulatedUserName,
  entity,
  record,
  compact = false,
}: {
  title: string;
  role: Role;
  simulatedUserName: string;
  entity: EntityType;
  record: RecordRow | undefined;
  compact?: boolean;
}) {
  if (!record) return null;

  // Aggregate counts for the result header
  const counts: Record<Verdict, number> = { visible: 0, masked: 0, redacted: 0, blocked: 0 };
  for (const f of entity.fields) {
    counts[fieldVerdict(role, f)]++;
  }

  return (
    <Card padding={0}>
      <div className="rc-head">
        <div className="rc-h-l">
          <div className="rc-eyebrow">{title.toUpperCase()}</div>
          <div className="rc-as">
            <span>Viewing as:</span>
            <code>{simulatedUserName}</code>
            <Pill tone={role === "Owner" ? "ink" : role === "Admin" ? "indigo" : role === "Builder" ? "amber" : role === "Reviewer" ? "sage" : "neutral"}>{role}</Pill>
            <code className="rc-org">{currentOrg.id}</code>
          </div>
        </div>
        <div className="rc-h-r">
          <CountChip count={counts.visible}  verdict="visible" />
          <CountChip count={counts.masked}   verdict="masked" />
          <CountChip count={counts.redacted} verdict="redacted" />
          <CountChip count={counts.blocked}  verdict="blocked" />
        </div>
      </div>

      <div className="rc-record">
        <div className="rc-record-meta">
          <span>{entity.displayName}</span>
          <span className="rc-sep">·</span>
          <code>{record.id}</code>
          {!compact && <Pill tone="indigo">{entity.fields.length} fields</Pill>}
        </div>

        <ul className="rc-fields">
          {entity.fields.map((f) => {
            const verdict = fieldVerdict(role, f);
            const raw = record.data[f.name];
            return (
              <li key={f.id} className={"fl fl-" + verdict}>
                <div className="fl-l">
                  <code className="fl-name">{f.name}</code>
                  <span className="fl-type">{f.type}{f.isPII ? " · pii" : ""}</span>
                </div>
                <div className="fl-v">
                  <FieldValue verdict={verdict} field={f} raw={raw} />
                </div>
                <div className="fl-r">
                  <VerdictPill verdict={verdict} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        .rc-head {
          padding: 18px 22px;
          background: linear-gradient(180deg, var(--color-ink-50) 0%, #fff 100%);
          border-bottom: 1px solid var(--color-ink-100);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }
        .rc-h-l { display: flex; flex-direction: column; gap: 8px; }
        .rc-eyebrow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          color: var(--color-indigo-700);
          text-transform: uppercase;
        }
        .rc-as {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 14px;
          color: var(--color-ink-700);
        }
        .rc-as code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .rc-org {
          background: var(--color-ink-50) !important;
          padding: 2px 8px !important;
          border-radius: 4px;
          font-weight: 400 !important;
          font-size: 11.5px !important;
          color: var(--color-ink-500) !important;
        }
        .rc-h-r { display: inline-flex; gap: 6px; flex-wrap: wrap; }

        .rc-record { padding: 18px 22px 22px; }
        .rc-record-meta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 14px;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }
        .rc-record-meta code {
          color: var(--color-ink-950);
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .rc-sep { color: var(--color-ink-300); }

        .rc-fields { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
        .fl {
          display: grid;
          grid-template-columns: 200px 1fr 110px;
          gap: 14px;
          padding: 12px 0;
          border-top: 1px dashed var(--color-ink-100);
          align-items: center;
        }
        .fl:first-child { border-top: 0; padding-top: 0; }
        .fl-l { display: flex; flex-direction: column; gap: 2px; }
        .fl-name {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-950);
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .fl-type {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--color-ink-400);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .fl-v { min-width: 0; }
        .fl-r { display: flex; justify-content: flex-end; }
        .fl-blocked .fl-v, .fl-redacted .fl-v { opacity: 0.92; }
      `}</style>
    </Card>
  );
}

function FieldValue({ verdict, field, raw }: { verdict: Verdict; field: Field; raw: string | number | undefined }) {
  if (verdict === "blocked") {
    return (
      <span className="fv fv-blocked">
        <span className="lock" aria-hidden>⊘</span>
        access denied by policy
        <style>{`
          .fv-blocked {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: var(--font-mono);
            font-size: 12.5px;
            color: var(--color-warn-fg);
            background: var(--color-warn-bg);
            padding: 6px 10px;
            border-radius: 6px;
          }
          .lock { font-size: 14px; }
        `}</style>
      </span>
    );
  }

  if (verdict === "redacted") {
    return (
      <span className="fv fv-redacted">
        <span className="rd-bar" />
        <small>redacted · field not in role scope</small>
        <style>{`
          .fv-redacted {
            display: inline-flex;
            align-items: center;
            gap: 10px;
          }
          .rd-bar {
            display: inline-block;
            width: 120px;
            height: 12px;
            border-radius: 2px;
            background:
              repeating-linear-gradient(
                45deg,
                var(--color-ink-300) 0px,
                var(--color-ink-300) 3px,
                var(--color-ink-200) 3px,
                var(--color-ink-200) 6px
              );
          }
          .fv-redacted small {
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--color-ink-500);
            letter-spacing: 0.04em;
          }
        `}</style>
      </span>
    );
  }

  if (verdict === "masked") {
    const masked = maskValue(field, raw ?? "");
    return (
      <span className="fv fv-masked">
        <code>{masked}</code>
        <small>masked at field-level</small>
        <style>{`
          .fv-masked {
            display: inline-flex;
            align-items: center;
            gap: 10px;
          }
          .fv-masked code {
            font-family: var(--font-mono);
            font-size: 13px;
            color: var(--color-amber-fg);
            background: var(--color-amber-bg);
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 500;
          }
          .fv-masked small {
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--color-ink-500);
          }
        `}</style>
      </span>
    );
  }

  // visible
  const display =
    typeof raw === "number" && field.name.includes("salary") ? "$" + raw.toLocaleString() :
    typeof raw === "number" && field.name.includes("value")  ? "$" + raw.toLocaleString() :
    typeof raw === "number" && field.name === "amount"       ? "$" + raw.toLocaleString() :
    raw === undefined ? "—" :
    String(raw);

  return (
    <span className="fv fv-visible">
      <code>{display}</code>
      <style>{`
        .fv-visible code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          background: transparent;
          padding: 0;
        }
      `}</style>
    </span>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const tone =
    verdict === "visible"  ? "sage"  :
    verdict === "masked"   ? "amber" :
    verdict === "redacted" ? "neutral" :
    "warn";
  return <Pill tone={tone}>{verdict}</Pill>;
}

function CountChip({ count, verdict }: { count: number; verdict: Verdict }) {
  return (
    <span className={"cc cc-" + verdict}>
      <b>{count}</b>
      <small>{verdict}</small>
      <style>{`
        .cc {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .cc b { font-size: 13px; font-weight: 600; }
        .cc small { letter-spacing: 0.08em; text-transform: uppercase; font-size: 9.5px; }
        .cc-visible  { background: var(--color-sage-bg);  color: var(--color-sage-fg); }
        .cc-masked   { background: var(--color-amber-bg); color: var(--color-amber-fg); }
        .cc-redacted { background: var(--color-ink-100);  color: var(--color-ink-700); }
        .cc-blocked  { background: var(--color-warn-bg);  color: var(--color-warn-fg); }
      `}</style>
    </span>
  );
}

// ─── Audit panel ───────────────────────────────────────────────────────────

function AuditPanel({
  membership,
  simulatedUserName,
  entity,
  record,
  simulatedAt,
}: {
  membership: { id: string; userId: string; role: Role; organizationId: string };
  simulatedUserName: string;
  entity: EntityType;
  record: RecordRow | undefined;
  simulatedAt: string;
}) {
  const rid = record?.id ?? "—";
  const targetKey = `${entity.name}.${rid}`;
  const auditId = "ae_sim_" + rid + "_" + membership.id;

  // Compute per-field metadata summary for the audit line
  const verdictCounts: Record<Verdict, number> = { visible: 0, masked: 0, redacted: 0, blocked: 0 };
  for (const f of entity.fields) verdictCounts[fieldVerdict(membership.role, f)]++;

  return (
    <Card title="Audit trail of this simulation" subtitle="Every simulator run writes one row to the immutable audit log.">
      <pre className="audit">
{`{
  "id":            "${auditId}",
  "organizationId":"${membership.organizationId}",
  "actorId":       "u_maria",
  "actorName":     "Maria Cordova",
  "action":        "access.simulated",
  "target":        "${targetKey}",
  "createdAt":     "${simulatedAt}",
  "metadata": {
    "simulatedUserId":   "${membership.userId}",
    "simulatedUserName": "${simulatedUserName}",
    "simulatedRole":     "${membership.role}",
    "entityType":        "${entity.name}",
    "recordId":          "${rid}",
    "verdicts": {
      "visible":  ${verdictCounts.visible},
      "masked":   ${verdictCounts.masked},
      "redacted": ${verdictCounts.redacted},
      "blocked":  ${verdictCounts.blocked}
    },
    "policyRulesetId": "pr_pii",
    "policyVersion":   "v1.4"
  }
}`}
        <style>{`
          .audit {
            background: var(--color-ink-950);
            color: #E6E7FB;
            padding: 16px 18px;
            border-radius: 8px;
            font-family: var(--font-mono);
            font-size: 12px;
            line-height: 1.6;
            overflow-x: auto;
            white-space: pre;
            margin: 0;
          }
        `}</style>
      </pre>

      <div className="audit-foot">
        <Pill tone="sage">Will be written on next save</Pill>
        <small>Audit retention · 7 years · region <code>{currentOrg.region}</code></small>
      </div>

      <style>{`
        .audit-foot {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .audit-foot small {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-500);
        }
        .audit-foot code {
          font-size: 11px;
        }
      `}</style>
    </Card>
  );
}
