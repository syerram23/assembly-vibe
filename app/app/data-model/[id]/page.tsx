"use client";

import { Fragment, use, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, StatTile, Pill, EmptyState } from "@/components/ui";
import { entities, connectors } from "@/lib/mocks";
import type { EntityType, Field } from "@/lib/types";

type Tab = "schema" | "browser" | "quality" | "relationships";

const SAMPLE_DATA: Record<string, Record<string, unknown>[]> = {
  ent_employee: [
    { employee_id: "WD-1014", full_name: "Maria Cordova",       email: "maria@acme.com",      level: "L7", location: "New York",     department: "Risk & Compliance",  date_of_birth: "1986-09-14", base_salary: 248_000 },
    { employee_id: "WD-1015", full_name: "Devon Park",          email: "devon@acme.com",      level: "L6", location: "New York",     department: "Engineering",        date_of_birth: "1989-02-04", base_salary: 218_400 },
    { employee_id: "WD-1016", full_name: "Priya Iyer",          email: "priya@acme.com",      level: "L5", location: "Chicago",      department: "Engineering",        date_of_birth: "1991-12-21", base_salary: 184_200 },
    { employee_id: "WD-1017", full_name: "Jordan Reyes",        email: "jordan@acme.com",     level: "L5", location: "San Francisco",department: "Engineering",        date_of_birth: "1988-07-18", base_salary: 184_200 },
    { employee_id: "WD-1018", full_name: "Sasha Whitfield",     email: "sasha@acme.com",      level: "L4", location: "Austin",       department: "Compliance",          date_of_birth: "1993-04-09", base_salary: 152_100 },
    { employee_id: "WD-1019", full_name: "Aaron Mehta",         email: "aaron@acme.com",      level: "L4", location: "Austin",       department: "Compliance",          date_of_birth: "1992-11-02", base_salary: 148_900 },
    { employee_id: "WD-1020", full_name: "Theo Marshall",       email: "theo@acme.com",       level: "L6", location: "New York",     department: "Risk & Compliance",   date_of_birth: "1985-06-30", base_salary: 220_500 },
    { employee_id: "WD-1021", full_name: "Renee Yamada",        email: "renee@acme.com",      level: "L5", location: "Seattle",      department: "Data Platform",       date_of_birth: "1990-01-25", base_salary: 191_400 },
    { employee_id: "WD-1022", full_name: "Mateo Ruiz",          email: "mateo@acme.com",      level: "L3", location: "Remote",       department: "Customer Ops",        date_of_birth: "1995-03-17", base_salary: 121_700 },
    { employee_id: "WD-1023", full_name: "Hannah Boateng",      email: "hannah@acme.com",     level: "L4", location: "Boston",       department: "Claims",              date_of_birth: "1992-08-12", base_salary: 154_300 },
    { employee_id: "WD-1024", full_name: "Ines Karoui",         email: "ines@acme.com",       level: "L5", location: "New York",     department: "Risk & Compliance",   date_of_birth: "1989-05-08", base_salary: 188_700 },
    { employee_id: "WD-1025", full_name: "Pavel Volkov",        email: "pavel@acme.com",      level: "L6", location: "London",       department: "Engineering",         date_of_birth: "1987-09-23", base_salary: 224_900 },
    { employee_id: "WD-1026", full_name: "Yuki Tanaka",         email: "yuki@acme.com",       level: "L4", location: "Tokyo",        department: "Data Platform",       date_of_birth: "1994-10-04", base_salary: 142_800 },
    { employee_id: "WD-1027", full_name: "Camille Dupont",      email: "camille@acme.com",    level: "L3", location: "Paris",        department: "Customer Ops",        date_of_birth: "1996-02-19", base_salary: 109_500 },
    { employee_id: "WD-1028", full_name: "Marcus Lee",          email: "marcus@acme.com",     level: "L7", location: "New York",     department: "Engineering",         date_of_birth: "1982-12-12", base_salary: 282_300 },
    { employee_id: "WD-1029", full_name: "Olivia Schwartz",     email: "olivia@acme.com",     level: "L4", location: "Chicago",      department: "Compliance",          date_of_birth: "1993-07-28", base_salary: 151_200 },
    { employee_id: "WD-1030", full_name: "Hassan Khoury",       email: "hassan@acme.com",     level: "L5", location: "Dubai",        department: "Risk & Compliance",   date_of_birth: "1988-04-15", base_salary: 192_800 },
    { employee_id: "WD-1031", full_name: "Nina Petrova",        email: "nina@acme.com",       level: "L6", location: "Berlin",       department: "Engineering",         date_of_birth: "1985-11-09", base_salary: 218_400 },
    { employee_id: "WD-1032", full_name: "Caleb Foster",        email: "caleb@acme.com",      level: "L3", location: "Remote",       department: "Customer Ops",        date_of_birth: "1997-05-22", base_salary: 114_100 },
    { employee_id: "WD-1033", full_name: "Lila Anwar",          email: "lila@acme.com",       level: "L4", location: "New York",     department: "Claims",              date_of_birth: "1992-06-30", base_salary: 156_000 },
    { employee_id: "WD-1034", full_name: "Andre Souza",         email: "andre@acme.com",      level: "L5", location: "São Paulo",    department: "Data Platform",       date_of_birth: "1990-08-11", base_salary: 178_500 },
    { employee_id: "WD-1035", full_name: "Vera Holm",           email: "vera@acme.com",       level: "L4", location: "Stockholm",    department: "Engineering",         date_of_birth: "1993-12-03", base_salary: 159_700 },
    { employee_id: "WD-1036", full_name: "Felix Beck",          email: "felix@acme.com",      level: "L4", location: "Berlin",       department: "Engineering",         date_of_birth: "1992-03-18", base_salary: 158_400 },
    { employee_id: "WD-1037", full_name: "Bea Lawson",          email: "bea@acme.com",        level: "L5", location: "Boston",       department: "Risk & Compliance",   date_of_birth: "1991-07-07", base_salary: 184_200 },
    { employee_id: "WD-1038", full_name: "Jonah Kim",           email: "jonah@acme.com",      level: "L3", location: "Seattle",      department: "Customer Ops",        date_of_birth: "1996-09-30", base_salary: 121_300 },
  ],
  ent_candidate: [
    { candidate_id: "GHD-7741", full_name: "Aurelia Castro",    applied_role: "Senior claims adjuster",  stage: "Background check", owner_id: "WD-1023" },
    { candidate_id: "GHD-7742", full_name: "Niko Tanaka",       applied_role: "Senior claims adjuster",  stage: "Offer extended",   owner_id: "WD-1023" },
    { candidate_id: "GHD-7743", full_name: "Soraya Khan",       applied_role: "Risk analyst II",          stage: "On-site",          owner_id: "WD-1024" },
    { candidate_id: "GHD-7744", full_name: "Brandon West",      applied_role: "Customer ops · weekend",   stage: "Phone screen",     owner_id: "WD-1022" },
    { candidate_id: "GHD-7745", full_name: "Pia Mendoza",       applied_role: "Risk analyst II",          stage: "Tech screen",      owner_id: "WD-1024" },
    { candidate_id: "GHD-7746", full_name: "Tobias Müller",     applied_role: "Senior claims adjuster",   stage: "Sourced",          owner_id: "WD-1023" },
    { candidate_id: "GHD-7747", full_name: "Renata Costa",      applied_role: "Compliance officer · L4",  stage: "On-site",          owner_id: "WD-1018" },
    { candidate_id: "GHD-7748", full_name: "Sami Idris",        applied_role: "Compliance officer · L4",  stage: "Offer extended",   owner_id: "WD-1018" },
    { candidate_id: "GHD-7749", full_name: "Karim Najjar",      applied_role: "Backend engineer L5",      stage: "Tech screen",      owner_id: "WD-1015" },
    { candidate_id: "GHD-7750", full_name: "Yuna Park",         applied_role: "Backend engineer L5",      stage: "Hiring manager",   owner_id: "WD-1015" },
    { candidate_id: "GHD-7751", full_name: "Olivier Renaud",    applied_role: "Backend engineer L5",      stage: "Phone screen",     owner_id: "WD-1015" },
    { candidate_id: "GHD-7752", full_name: "Hana Sato",         applied_role: "Data engineer L4",         stage: "Sourced",          owner_id: "WD-1021" },
    { candidate_id: "GHD-7753", full_name: "Daniel Quinn",      applied_role: "Data engineer L4",         stage: "Tech screen",      owner_id: "WD-1021" },
    { candidate_id: "GHD-7754", full_name: "Ines Almeida",      applied_role: "Risk analyst II",          stage: "Sourced",          owner_id: "WD-1024" },
    { candidate_id: "GHD-7755", full_name: "Theo Walker",       applied_role: "Customer ops · weekend",   stage: "Phone screen",     owner_id: "WD-1022" },
    { candidate_id: "GHD-7756", full_name: "Mia Eriksson",      applied_role: "Compliance officer · L4",  stage: "Sourced",          owner_id: "WD-1018" },
    { candidate_id: "GHD-7757", full_name: "Adesh Iyer",        applied_role: "Senior claims adjuster",   stage: "Phone screen",     owner_id: "WD-1023" },
    { candidate_id: "GHD-7758", full_name: "Greta Lindqvist",   applied_role: "Backend engineer L5",      stage: "On-site",          owner_id: "WD-1015" },
    { candidate_id: "GHD-7759", full_name: "Reza Tehrani",      applied_role: "Data engineer L4",         stage: "Hiring manager",   owner_id: "WD-1021" },
    { candidate_id: "GHD-7760", full_name: "Cora Bennett",      applied_role: "Customer ops · weekend",   stage: "Sourced",          owner_id: "WD-1022" },
    { candidate_id: "GHD-7761", full_name: "Luca Romano",       applied_role: "Risk analyst II",          stage: "Background check", owner_id: "WD-1024" },
    { candidate_id: "GHD-7762", full_name: "Anika Fischer",     applied_role: "Senior claims adjuster",   stage: "Sourced",          owner_id: "WD-1023" },
  ],
  ent_claim: [
    { claim_id: "CLM-440812", amount: 8420.00,   state: "Open",      opened_at: "2026-05-12", policy_ref: "POL-99814" },
    { claim_id: "CLM-440813", amount: 12100.00,  state: "Investigating", opened_at: "2026-05-13", policy_ref: "POL-99221" },
    { claim_id: "CLM-440814", amount: 2240.00,   state: "Paid",      opened_at: "2026-04-28", policy_ref: "POL-98817" },
    { claim_id: "CLM-440815", amount: 540.50,    state: "Denied",    opened_at: "2026-04-22", policy_ref: "POL-98510" },
    { claim_id: "CLM-440816", amount: 18300.00,  state: "Open",      opened_at: "2026-05-15", policy_ref: "POL-99001" },
    { claim_id: "CLM-440817", amount: 6750.00,   state: "Open",      opened_at: "2026-05-16", policy_ref: "POL-99102" },
    { claim_id: "CLM-440818", amount: 9120.00,   state: "Investigating", opened_at: "2026-05-09", policy_ref: "POL-98412" },
    { claim_id: "CLM-440819", amount: 410.00,    state: "Paid",      opened_at: "2026-04-12", policy_ref: "POL-97812" },
    { claim_id: "CLM-440820", amount: 22500.00,  state: "Open",      opened_at: "2026-05-17", policy_ref: "POL-99412" },
    { claim_id: "CLM-440821", amount: 1280.00,   state: "Closed",    opened_at: "2026-03-28", policy_ref: "POL-96712" },
    { claim_id: "CLM-440822", amount: 7300.00,   state: "Investigating", opened_at: "2026-05-08", policy_ref: "POL-98212" },
    { claim_id: "CLM-440823", amount: 3450.00,   state: "Open",      opened_at: "2026-05-16", policy_ref: "POL-99213" },
    { claim_id: "CLM-440824", amount: 14800.00,  state: "Open",      opened_at: "2026-05-17", policy_ref: "POL-99311" },
    { claim_id: "CLM-440825", amount: 880.00,    state: "Paid",      opened_at: "2026-04-30", policy_ref: "POL-98911" },
    { claim_id: "CLM-440826", amount: 4520.00,   state: "Open",      opened_at: "2026-05-14", policy_ref: "POL-99022" },
    { claim_id: "CLM-440827", amount: 11210.00,  state: "Investigating", opened_at: "2026-05-11", policy_ref: "POL-98744" },
    { claim_id: "CLM-440828", amount: 660.00,    state: "Denied",    opened_at: "2026-04-04", policy_ref: "POL-96412" },
    { claim_id: "CLM-440829", amount: 28700.00,  state: "Investigating", opened_at: "2026-05-06", policy_ref: "POL-98113" },
    { claim_id: "CLM-440830", amount: 1450.00,   state: "Paid",      opened_at: "2026-04-18", policy_ref: "POL-98012" },
    { claim_id: "CLM-440831", amount: 9900.00,   state: "Open",      opened_at: "2026-05-15", policy_ref: "POL-99088" },
    { claim_id: "CLM-440832", amount: 720.00,    state: "Closed",    opened_at: "2026-03-15", policy_ref: "POL-95112" },
    { claim_id: "CLM-440833", amount: 16400.00,  state: "Investigating", opened_at: "2026-05-10", policy_ref: "POL-98612" },
  ],
  ent_account: [
    { account_id: "SF-0014J", name: "Acme Holdings",            annual_value: 1_240_000 },
    { account_id: "SF-0014K", name: "Cascadia Bank",            annual_value: 880_000 },
    { account_id: "SF-0014L", name: "Patriot Insurance Group",  annual_value: 1_580_000 },
    { account_id: "SF-0014M", name: "Northstar Credit Union",   annual_value: 612_000 },
    { account_id: "SF-0014N", name: "Brightleaf Mortgage",      annual_value: 2_140_000 },
    { account_id: "SF-0014P", name: "Hudson Mutual",            annual_value: 920_000 },
    { account_id: "SF-0014Q", name: "Plateau Financial",        annual_value: 1_780_000 },
    { account_id: "SF-0014R", name: "Vector Capital",           annual_value: 3_120_000 },
    { account_id: "SF-0014S", name: "Cobalt Lending",           annual_value: 540_000 },
    { account_id: "SF-0014T", name: "Western Crest Bank",       annual_value: 1_060_000 },
    { account_id: "SF-0014U", name: "Riverline Insurance",      annual_value: 870_000 },
    { account_id: "SF-0014V", name: "Beacon Savings",           annual_value: 420_000 },
    { account_id: "SF-0014W", name: "Foundry Mortgage Co.",     annual_value: 2_360_000 },
    { account_id: "SF-0014X", name: "Stratos Underwriters",     annual_value: 1_240_000 },
    { account_id: "SF-0014Y", name: "Cedar & Vine Trust",       annual_value: 760_000 },
    { account_id: "SF-0014Z", name: "Anchor Risk Partners",     annual_value: 1_410_000 },
    { account_id: "SF-00150", name: "Liberty Plains Mutual",    annual_value: 980_000 },
    { account_id: "SF-00151", name: "Monarch Financial",        annual_value: 3_900_000 },
    { account_id: "SF-00152", name: "Sterling Realty Lending",  annual_value: 1_120_000 },
    { account_id: "SF-00153", name: "Holloway & Greene",        annual_value: 640_000 },
    { account_id: "SF-00154", name: "Crestpoint Mortgage",      annual_value: 1_840_000 },
    { account_id: "SF-00155", name: "True North Insurance",     annual_value: 720_000 },
  ],
};

const QUALITY_RULES: Record<string, { rule: string; status: "Pass" | "Fail"; failCount: number; description: string }[]> = {
  ent_employee: [
    { rule: "email must be valid format",           status: "Pass", failCount: 0,  description: "RFC 5322 compliant email format check" },
    { rule: "salary not null when level ≥ L4",      status: "Fail", failCount: 7,  description: "7 records missing base_salary above L4" },
    { rule: "department in approved list",          status: "Pass", failCount: 0,  description: "Department matches HRIS lookup table" },
    { rule: "no PII in display_name",               status: "Pass", failCount: 0,  description: "Display name does not contain SSN/DOB patterns" },
    { rule: "level matches level grid",             status: "Pass", failCount: 0,  description: "Level is one of L1-L8" },
  ],
  ent_candidate: [
    { rule: "stage in pipeline lookup",             status: "Pass", failCount: 0,  description: "Stage matches recruiting pipeline stages" },
    { rule: "applied_role not empty",               status: "Fail", failCount: 3,  description: "3 candidates with empty applied_role" },
    { rule: "owner_id refs valid employee",         status: "Pass", failCount: 0,  description: "Referenced employee exists in employee table" },
  ],
  ent_claim: [
    { rule: "amount ≥ 0",                            status: "Pass", failCount: 0,  description: "Claim amount is non-negative" },
    { rule: "state in state machine",                status: "Pass", failCount: 0,  description: "State is Open/Investigating/Paid/Denied/Closed" },
    { rule: "opened_at not in future",               status: "Pass", failCount: 0,  description: "Opened-at timestamp is past or present" },
    { rule: "policy_ref must match POL-* pattern",   status: "Fail", failCount: 2,  description: "2 claims with malformed policy reference" },
  ],
  ent_account: [
    { rule: "name not empty",                        status: "Pass", failCount: 0,  description: "Account display name present" },
    { rule: "annual_value > 0 when status=customer", status: "Pass", failCount: 0,  description: "Active customers have annual value set" },
  ],
};

const RECENT_ISSUES: Record<string, { id: string; field: string; rule: string; severity: "high" | "medium" | "low"; record: string; detected: string }[]> = {
  ent_employee: [
    { id: "iss_e1", field: "base_salary", rule: "salary not null when level ≥ L4", severity: "high",   record: "WD-1022", detected: "12m ago" },
    { id: "iss_e2", field: "base_salary", rule: "salary not null when level ≥ L4", severity: "high",   record: "WD-1027", detected: "12m ago" },
    { id: "iss_e3", field: "email",       rule: "email must be valid format",      severity: "medium", record: "WD-1041", detected: "1h ago"  },
  ],
  ent_candidate: [
    { id: "iss_c1", field: "applied_role", rule: "applied_role not empty",         severity: "low",    record: "GHD-7768", detected: "3h ago" },
  ],
  ent_claim: [
    { id: "iss_cl1", field: "policy_ref", rule: "policy_ref must match POL-* pattern", severity: "medium", record: "CLM-440712", detected: "4h ago" },
    { id: "iss_cl2", field: "policy_ref", rule: "policy_ref must match POL-* pattern", severity: "medium", record: "CLM-440689", detected: "1d ago" },
  ],
  ent_account: [],
};

function formatValue(field: Field, val: unknown): string {
  if (val == null) return "—";
  if (field.type === "number") {
    const n = val as number;
    if (field.name.includes("salary") || field.name.includes("value") || field.name.includes("amount")) {
      return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
    }
    return n.toLocaleString();
  }
  return String(val);
}

export default function EntityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const entity: EntityType = entities.find((e) => e.id === id) ?? entities[0];
  const source = connectors.find((c) => c.id === entity.source);

  const [tab, setTab] = useState<Tab>("schema");
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [unmasked, setUnmasked] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = SAMPLE_DATA[entity.id] ?? [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    const nameField = entity.fields.find((f) => f.name.includes("name"))?.name ?? entity.fields[0].name;
    return rows.filter((r) => String(r[nameField] ?? "").toLowerCase().includes(q));
  }, [rows, search, entity.fields]);

  const totalRecords = entity.recordCount;

  function toggleUnmask(key: string) {
    setUnmasked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        setToast(`Audit log · ${entity.name}.${key} unmasked by maria@acme.com`);
        window.setTimeout(() => setToast(null), 3500);
      }
      return next;
    });
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "schema",        label: "Schema" },
    { key: "browser",       label: "Browser" },
    { key: "quality",       label: "Quality" },
    { key: "relationships", label: "Relationships" },
  ];

  const piiCount = entity.fields.filter((f) => f.isPII).length;
  const reqCount = entity.fields.filter((f) => f.required).length;
  const issues = RECENT_ISSUES[entity.id] ?? [];
  const rules = QUALITY_RULES[entity.id] ?? [];

  const relatedRefs = entity.fields.filter((f) => f.refEntityId);
  const incomingRefs = entities
    .flatMap((other) => other.fields.filter((f) => f.refEntityId === entity.id).map((f) => ({ other, field: f })))
    .slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow={`Data model · ${entity.name}`}
        title={entity.displayName}
        description={`${entity.recordCount.toLocaleString()} records · ${entity.fields.length} fields · ${piiCount} contain PII · sourced from ${source?.displayName ?? "manual"}.`}
        actions={
          <>
            <Link href="/app/data-model" className="btn btn-ghost">← All entities</Link>
            <button className="btn btn-primary" type="button">+ Add field</button>
          </>
        }
      />

      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={"tab " + (tab === t.key ? "on" : "")}
            type="button"
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "schema" && (
        <Card padding={0}>
          <table className="stable">
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Required</th>
                <th>Flags</th>
                <th>Source mapping</th>
                <th>Sample value</th>
              </tr>
            </thead>
            <tbody>
              {entity.fields.map((f) => {
                const sampleRow = rows[0];
                const sample = sampleRow ? formatValue(f, sampleRow[f.name]) : "—";
                const isActive = activeFieldId === f.id;
                return (
                  <Fragment key={f.id}>
                    <tr className={isActive ? "row-active" : ""} onClick={() => setActiveFieldId(isActive ? null : f.id)}>
                      <td><span className="mono">{f.name}</span></td>
                      <td><Pill tone="neutral">{f.type}</Pill></td>
                      <td>{f.required ? <span className="check">✓</span> : <span className="muted">—</span>}</td>
                      <td>
                        <span className="flags">
                          {f.isPII && <Pill tone="warn">PII</Pill>}
                          {f.type === "ref" && f.refEntityId && <Pill tone="indigo">→ {entities.find((e) => e.id === f.refEntityId)?.name ?? "ref"}</Pill>}
                        </span>
                      </td>
                      <td className="map">{source ? `${source.type}.${f.name}` : "manual"}</td>
                      <td className="mono sample">{f.isPII ? "••••••" : sample}</td>
                    </tr>
                    {isActive && (
                      <tr className="edit-row">
                        <td colSpan={6}>
                          <div className="edit-form">
                            <div className="edit-grid">
                              <label>
                                <span>Field name</span>
                                <input type="text" defaultValue={f.name} />
                              </label>
                              <label>
                                <span>Display name</span>
                                <input type="text" defaultValue={f.name.replace(/_/g, " ")} />
                              </label>
                              <label>
                                <span>Type</span>
                                <select defaultValue={f.type}>
                                  <option>string</option>
                                  <option>number</option>
                                  <option>boolean</option>
                                  <option>date</option>
                                  <option>ref</option>
                                  <option>json</option>
                                </select>
                              </label>
                              <label>
                                <span>Required</span>
                                <select defaultValue={f.required ? "yes" : "no"}>
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                              </label>
                              <label>
                                <span>Contains PII</span>
                                <select defaultValue={f.isPII ? "yes" : "no"}>
                                  <option value="yes">Yes — mask by default</option>
                                  <option value="no">No</option>
                                </select>
                              </label>
                              <label>
                                <span>Description</span>
                                <input type="text" placeholder="What this field represents…" />
                              </label>
                            </div>
                            <div className="edit-actions">
                              <button className="btn btn-secondary" type="button" onClick={() => setActiveFieldId(null)}>Cancel</button>
                              <button className="btn btn-primary" type="button" onClick={() => setActiveFieldId(null)}>Save field</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          <footer className="schema-foot">
            <span>{entity.fields.length} fields · {reqCount} required · {piiCount} PII</span>
            <button className="btn btn-ghost" type="button">+ Add field</button>
          </footer>
        </Card>
      )}

      {tab === "browser" && (
        <>
          <div className="browser-bar">
            <div className="search">
              <span className="search-ic" aria-hidden>⌕</span>
              <input
                type="text"
                placeholder={`Search ${entity.displayName.toLowerCase()}s by name…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="browser-meta">
              <Pill tone="indigo">{piiCount} PII field{piiCount === 1 ? "" : "s"} · masked by default</Pill>
            </div>
          </div>

          <Card padding={0}>
            {filtered.length === 0 ? (
              <EmptyState title="No records match" description="Try a different search, or clear the search to see all records." />
            ) : (
              <div className="dt-wrap">
                <table className="dt">
                  <thead>
                    <tr>
                      {entity.fields.map((f) => (
                        <th key={f.id}>
                          <span className="dt-h">
                            <span className="mono">{f.name}</span>
                            {f.isPII && <button type="button" className="unmask" onClick={() => toggleUnmask(f.name)}>
                              {unmasked.has(f.name) ? "mask" : "unmask"}
                            </button>}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={i}>
                        {entity.fields.map((f) => {
                          const v = formatValue(f, r[f.name]);
                          const hidden = f.isPII && !unmasked.has(f.name);
                          return (
                            <td key={f.id} className={f.type === "number" ? "td-num" : "td-text"}>
                              {hidden ? <span className="masked">••••••</span> : <span className="mono">{v}</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <footer className="page-foot">
              <span className="page-info">Showing 1–{filtered.length} of {totalRecords.toLocaleString()}</span>
              <div className="page-ctrl">
                <button type="button" className="btn btn-ghost" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>← Prev</button>
                <span className="page-n">Page {page}</span>
                <button type="button" className="btn btn-ghost" onClick={() => setPage((p) => p + 1)}>Next →</button>
              </div>
            </footer>
          </Card>

          {toast && (
            <div className="toast" role="status">
              <span className="toast-ic">●</span>
              <span>{toast}</span>
            </div>
          )}
        </>
      )}

      {tab === "quality" && (
        <>
          <section className="stats">
            <StatTile label="Completeness" value="96.4%" hint={`${rules.filter((r) => r.status === "Pass").length} of ${rules.length} rules passing`} emphasis="sage" />
            <StatTile label="Duplicate records" value={(entity.id === "ent_employee" ? 12 : 4).toString()} hint="matched on email + dob" />
            <StatTile label="Freshness" value="14m" hint="median age of last sync" />
          </section>

          <Card title="Quality rules" subtitle="Detection logic Assembly runs over this entity continuously.">
            <table className="qtable">
              <thead>
                <tr>
                  <th>Rule</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Failures</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r, i) => (
                  <tr key={i}>
                    <td className="mono">{r.rule}</td>
                    <td className="qdesc">{r.description}</td>
                    <td><Pill tone={r.status === "Pass" ? "sage" : "warn"}>{r.status}</Pill></td>
                    <td className="qfail">{r.failCount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Recent issues" subtitle="Records that failed a quality rule in the last 24 hours.">
            {issues.length === 0 ? (
              <EmptyState title="All clear" description="No quality issues detected in the last 24 hours." />
            ) : (
              <ul className="iss-list">
                {issues.map((i) => (
                  <li key={i.id} className={"iss iss-" + i.severity}>
                    <span className="iss-sev">
                      <Pill tone={i.severity === "high" ? "warn" : i.severity === "medium" ? "amber" : "neutral"}>{i.severity}</Pill>
                    </span>
                    <span className="iss-rec mono">{i.record}</span>
                    <span className="iss-field mono">.{i.field}</span>
                    <span className="iss-rule">{i.rule}</span>
                    <span className="iss-when">{i.detected}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}

      {tab === "relationships" && (
        <Card title="Relationships" subtitle="How this entity connects to other governed entities in your data model.">
          <div className="rel-diagram">
            {/* Left column: incoming refs */}
            <div className="rel-col rel-l">
              <span className="rel-label">Referenced from</span>
              {incomingRefs.length === 0 ? (
                <span className="rel-empty">No incoming references</span>
              ) : (
                incomingRefs.map(({ other, field }) => (
                  <Link href={`/app/data-model/${other.id}`} key={other.id + field.id} className="rel-box rel-in">
                    <code>{other.name}</code>
                    <small>.{field.name}</small>
                  </Link>
                ))
              )}
            </div>

            {/* Center: this entity */}
            <div className="rel-col rel-c">
              <div className="rel-center">
                <span className="rel-tag">This entity</span>
                <code className="rel-name">{entity.name}</code>
                <span className="rel-sub">{entity.recordCount.toLocaleString()} rows · {entity.fields.length} fields</span>
              </div>
            </div>

            {/* Right column: outgoing refs */}
            <div className="rel-col rel-r">
              <span className="rel-label">References</span>
              {relatedRefs.length === 0 ? (
                <span className="rel-empty">No outgoing references</span>
              ) : (
                relatedRefs.map((f) => {
                  const target = entities.find((e) => e.id === f.refEntityId);
                  if (!target) return null;
                  return (
                    <Link href={`/app/data-model/${target.id}`} key={f.id} className="rel-box rel-out">
                      <small>.{f.name} →</small>
                      <code>{target.name}</code>
                    </Link>
                  );
                })
              )}
            </div>

            {/* Arrows overlay */}
            <svg className="rel-arrows" aria-hidden viewBox="0 0 800 320" preserveAspectRatio="none">
              {incomingRefs.map((_, i) => {
                const y = 60 + i * 64;
                return (
                  <g key={"in-" + i}>
                    <line x1="180" y1={y} x2="360" y2="160" stroke="var(--color-ink-300)" strokeWidth="1.2" strokeDasharray="3 4" />
                    <polygon points={`358,158 366,160 358,162`} fill="var(--color-ink-300)" />
                  </g>
                );
              })}
              {relatedRefs.map((_, i) => {
                const y = 60 + i * 64;
                return (
                  <g key={"out-" + i}>
                    <line x1="440" y1="160" x2="620" y2={y} stroke="var(--color-indigo-400)" strokeWidth="1.4" />
                    <polygon points={`618,${y - 4} 626,${y} 618,${y + 4}`} fill="var(--color-indigo-400)" />
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>
      )}

      <style>{`
        .tabs {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid var(--color-ink-100);
          margin-bottom: 24px;
        }
        .tab {
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-ink-500);
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.15s, border-color 0.15s;
        }
        .tab:hover { color: var(--color-ink-950); }
        .tab.on { color: var(--color-ink-950); border-bottom-color: var(--color-indigo-600); }

        /* Schema table */
        .stable { width: 100%; border-collapse: collapse; }
        .stable thead th {
          text-align: left;
          padding: 14px 16px;
          background: var(--color-ink-50);
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .stable tbody tr { border-bottom: 1px solid var(--color-ink-100); transition: background 0.12s; cursor: pointer; }
        .stable tbody tr:hover { background: var(--color-ink-50); }
        .stable tbody tr.row-active { background: var(--color-indigo-50); }
        .stable tbody tr.edit-row { background: var(--color-ink-50); cursor: default; }
        .stable tbody tr.edit-row:hover { background: var(--color-ink-50); }
        .stable td { padding: 12px 16px; font-size: 13px; color: var(--color-ink-700); vertical-align: middle; }
        .mono { font-family: var(--font-mono); font-size: 12px; color: var(--color-ink-950); }
        .check { color: var(--color-sage-fg); font-weight: 700; }
        .muted { color: var(--color-ink-400); font-family: var(--font-mono); font-size: 12px; }
        .flags { display: inline-flex; gap: 6px; }
        .map { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-500); }
        .sample { color: var(--color-ink-500); }

        .edit-form { padding: 4px 0 12px; }
        .edit-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px 18px;
        }
        @media (max-width: 760px) { .edit-grid { grid-template-columns: 1fr; } }
        .edit-form label { display: flex; flex-direction: column; gap: 5px; }
        .edit-form label span {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .edit-form input, .edit-form select {
          font: inherit;
          font-size: 13px;
          padding: 8px 10px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 7px;
          outline: 0;
          font-family: var(--font-mono);
        }
        .edit-form input:focus, .edit-form select:focus { border-color: var(--color-indigo-400); box-shadow: 0 0 0 4px rgba(79,70,229,0.08); }
        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 14px;
        }

        .schema-foot {
          padding: 14px 16px;
          border-top: 1px solid var(--color-ink-100);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }

        /* Browser */
        .browser-bar {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          align-items: center;
          flex-wrap: wrap;
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
        .search:focus-within { border-color: var(--color-indigo-400); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08); }
        .search-ic { color: var(--color-ink-400); font-size: 14px; }
        .search input { flex: 1; border: 0; outline: 0; background: transparent; font-family: var(--font-body); font-size: 13.5px; color: var(--color-ink-950); }
        .search input::placeholder { color: var(--color-ink-400); }

        .dt-wrap { overflow-x: auto; }
        .dt { width: 100%; border-collapse: collapse; min-width: 720px; }
        .dt thead th {
          text-align: left;
          padding: 12px 14px;
          background: var(--color-ink-50);
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          white-space: nowrap;
        }
        .dt-h { display: inline-flex; align-items: center; gap: 8px; }
        .unmask {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-indigo-700);
          background: var(--color-indigo-50);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .unmask:hover { background: var(--color-indigo-100); }
        .dt tbody tr { border-bottom: 1px solid var(--color-ink-100); transition: background 0.12s; }
        .dt tbody tr:hover { background: var(--color-ink-50); }
        .dt tbody td {
          padding: 10px 14px;
          font-size: 12.5px;
          color: var(--color-ink-700);
          white-space: nowrap;
        }
        .td-num { text-align: right; font-variant-numeric: tabular-nums; }
        .masked {
          font-family: var(--font-mono);
          color: var(--color-ink-400);
          letter-spacing: 0.2em;
        }

        .page-foot {
          padding: 12px 16px;
          border-top: 1px solid var(--color-ink-100);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
        }
        .page-ctrl { display: inline-flex; align-items: center; gap: 8px; }
        .page-n {
          padding: 6px 10px;
          background: var(--color-ink-50);
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-700);
        }

        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: var(--color-ink-950);
          color: #fff;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 12.5px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 12px 32px -8px rgba(15,17,42,0.4);
          z-index: 50;
          animation: toastIn 0.2s ease-out;
        }
        @keyframes toastIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .toast-ic { color: var(--color-indigo-300); font-size: 8px; }

        /* Quality */
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }
        @media (max-width: 760px) { .stats { grid-template-columns: 1fr; } }

        .qtable { width: 100%; border-collapse: collapse; }
        .qtable thead th {
          text-align: left;
          padding: 10px 14px;
          background: var(--color-ink-50);
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .qtable tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .qtable tbody tr:last-child { border-bottom: 0; }
        .qtable td { padding: 12px 14px; font-size: 13px; vertical-align: middle; }
        .qdesc { color: var(--color-ink-500); font-size: 12.5px; }
        .qfail {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--color-ink-700);
          font-weight: 600;
        }

        .iss-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
        .iss {
          display: grid;
          grid-template-columns: 90px 110px 100px 1fr auto;
          gap: 14px;
          padding: 12px 0;
          align-items: center;
          border-top: 1px solid var(--color-ink-100);
          font-size: 12.5px;
        }
        .iss:first-child { border-top: 0; padding-top: 0; }
        .iss-rec { color: var(--color-ink-950); }
        .iss-field { color: var(--color-indigo-700); }
        .iss-rule { color: var(--color-ink-500); }
        .iss-when {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-400);
        }

        /* Relationships */
        .rel-diagram {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 32px;
          min-height: 320px;
          padding: 8px 0;
        }
        .rel-col { display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1; }
        .rel-c { justify-content: center; align-items: center; }
        .rel-label {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          margin-bottom: 4px;
        }
        .rel-r .rel-label { text-align: right; }
        .rel-empty {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-400);
          padding: 12px 14px;
          background: var(--color-ink-50);
          border-radius: var(--radius-sm);
        }
        .rel-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 14px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: border-color 0.15s, transform 0.18s, box-shadow 0.18s;
        }
        .rel-box:hover {
          border-color: var(--color-indigo-400);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px -8px rgba(15,17,42,.18);
        }
        .rel-box code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink-950);
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .rel-box small {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }
        .rel-out { align-items: flex-end; }

        .rel-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 22px 28px;
          background: var(--color-indigo-600);
          color: #fff;
          border-radius: var(--radius-lg);
          box-shadow: 0 12px 32px -12px rgba(79,70,229,0.5);
        }
        .rel-tag {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-indigo-200);
        }
        .rel-name {
          font-family: var(--font-mono);
          font-size: 18px;
          color: #fff;
          font-weight: 700;
          background: transparent;
          padding: 0;
        }
        .rel-sub {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-indigo-200);
          letter-spacing: 0.04em;
        }

        .rel-arrows {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
    </>
  );
}
