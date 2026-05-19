"use client";

import { useEffect, useState } from "react";
import { PageHeader, Card, Pill } from "@/components/ui";
import {
  currentOrg,
  memberships,
  users,
  apiKeys,
  repositories,
} from "@/lib/mocks";
import type { Role } from "@/lib/types";

/* ────────────────────────────────────────────────────────────────────────────
 * Settings module — left rail of anchors, long scrolling right column.
 * No tabs. Static rail + smooth scroll. Sections are <Card> blocks.
 * ──────────────────────────────────────────────────────────────────────────── */

const sections = [
  { id: "organization", label: "Organization profile" },
  { id: "members",      label: "Members & invitations" },
  { id: "api-keys",     label: "API keys (BYOK)" },
  { id: "github",       label: "GitHub integration" },
  { id: "environments", label: "Environments" },
  { id: "residency",    label: "Data residency" },
  { id: "export",       label: "Data export & deletion" },
  { id: "legal",        label: "Legal" },
  { id: "danger",       label: "Danger zone" },
] as const;

const pendingInvites = [
  { email: "kira@acme.com",   role: "Builder"  as Role, sentAt: "2026-05-16T14:00:00Z" },
  { email: "rohan@acme.com",  role: "Reviewer" as Role, sentAt: "2026-05-17T09:30:00Z" },
];

export default function SettingsPage() {
  const [active, setActive] = useState<string>("organization");

  // Highlight rail item when a section scrolls past the top.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow={`Org · ${currentOrg.name}`}
        title="Settings"
        description="Organization profile, members, API keys, GitHub, environments, residency, exports, legal, and danger zone."
      />

      <div className="st-grid">
        <aside className="st-rail">
          <nav>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={active === s.id ? "on" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(s.id);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                        setActive(s.id);
                      }
                    }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="st-col">
          {/* 1. Organization profile */}
          <section id="organization">
            <Card title="Organization profile" subtitle="Public information visible to your team.">
              <div className="form-grid">
                <Field label="Organization name">
                  <input type="text" defaultValue={currentOrg.name} />
                </Field>
                <Field label="Industry">
                  <select defaultValue={currentOrg.industry}>
                    <option>Regulated banking</option>
                    <option>Healthcare</option>
                    <option>Insurance</option>
                    <option>Logistics</option>
                    <option>Manufacturing</option>
                    <option>Services</option>
                  </select>
                </Field>
                <Field label="Size">
                  <select defaultValue={currentOrg.size}>
                    <option>1–50 employees</option>
                    <option>51–200 employees</option>
                    <option>201–1,000 employees</option>
                    <option>1,200 employees</option>
                    <option>5,000+ employees</option>
                  </select>
                </Field>
                <Field label="Logo">
                  <div className="logo-up">
                    <span className="logo-frame">A</span>
                    <button type="button" className="btn btn-secondary">Upload new</button>
                    <button type="button" className="btn btn-ghost">Remove</button>
                  </div>
                </Field>
                <Field label="Brand color">
                  <div className="color-row">
                    <span className="swatch" style={{ background: "var(--color-indigo-600)" }} />
                    <input type="text" defaultValue="#4F46E5" className="mono-input" />
                    <span className="hint">Used for accents in shared dashboards.</span>
                  </div>
                </Field>
              </div>
              <div className="form-foot">
                <button type="button" className="btn btn-ghost">Cancel</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </Card>
          </section>

          {/* 2. Members & invitations */}
          <section id="members">
            <Card
              title="Members & invitations"
              subtitle="Manage who's in your organization and the role each has."
              actions={<button type="button" className="btn btn-primary">+ Invite member</button>}
            >
              <table className="mem-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((m) => {
                    const u = users.find((x) => x.id === m.userId)!;
                    return (
                      <tr key={m.id}>
                        <td>
                          <div className="mem-name">
                            <span className="mem-av" style={{ background: u.avatarColor }}>
                              {u.fullName.split(" ").map(p => p[0]).join("").slice(0, 2)}
                            </span>
                            <span>{u.fullName}</span>
                          </div>
                        </td>
                        <td className="mem-email"><code>{u.email}</code></td>
                        <td>
                          <select defaultValue={m.role} className="role-sel" disabled={m.role === "Owner"}>
                            <option>Owner</option>
                            <option>Admin</option>
                            <option>Builder</option>
                            <option>Reviewer</option>
                            <option>Viewer</option>
                          </select>
                        </td>
                        <td className="mem-time">{new Date(m.invitedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</td>
                        <td className="mem-actions">
                          <button type="button" className="ic-btn" aria-label="Actions">⋯</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="pending-head">
                <h4>Pending invitations</h4>
                <span className="hint">{pendingInvites.length} unsent or unaccepted</span>
              </div>
              <ul className="pending-list">
                {pendingInvites.map((p, i) => (
                  <li key={i}>
                    <div className="pending-l">
                      <code>{p.email}</code>
                      <small>invited as {p.role} · {new Date(p.sentAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</small>
                    </div>
                    <div className="pending-r">
                      <Pill tone="amber">Pending</Pill>
                      <button type="button" className="btn btn-ghost">Resend</button>
                      <button type="button" className="btn btn-ghost danger">Revoke</button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* 3. API keys (BYOK) */}
          <section id="api-keys">
            <Card
              title="API keys · bring-your-own-key (BYOK)"
              subtitle="Paste your own AI model provider keys. Assembly never proxies through ours."
              actions={<button type="button" className="btn btn-primary">+ Add key</button>}
            >
              <table className="key-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Label</th>
                    <th>Status</th>
                    <th>Last used</th>
                    <th>Masked key</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((k) => (
                    <tr key={k.id}>
                      <td>
                        <div className="prov">
                          <span className={"prov-ic ic-" + k.provider}>
                            {k.provider === "anthropic" ? "An" : k.provider === "openai" ? "Oa" : k.provider === "google" ? "Go" : k.provider === "azure" ? "Az" : "Vy"}
                          </span>
                          <span className="prov-name">{k.provider}</span>
                        </div>
                      </td>
                      <td>{k.label}</td>
                      <td><Pill tone={k.status === "Active" ? "sage" : "warn"}>{k.status}</Pill></td>
                      <td className="key-time">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "never"}</td>
                      <td><code className="key-mask">{k.maskedKey}</code></td>
                      <td className="key-actions">
                        <button type="button" className="btn btn-ghost">Rotate</button>
                        <button type="button" className="btn btn-ghost danger">Revoke</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="byok-note">
                <span className="byok-ic">⚐</span>
                <span>Assembly never trains on your data. Your AI model spend hits your provider account directly.</span>
              </div>
            </Card>
          </section>

          {/* 4. GitHub */}
          <section id="github">
            <Card title="GitHub integration" subtitle="Repositories Assembly creates and operates on your behalf.">
              <div className="gh-grid">
                <div className="gh-l">
                  <span className="lbl">Connected GitHub org</span>
                  <code className="gh-org">assembly-vibe-orgs</code>
                  <small>provisioning organization · Assembly-owned during build</small>
                </div>
                <div className="gh-r">
                  <div className="gh-stat">
                    <span className="lbl">Repositories provisioned</span>
                    <b>{repositories.length}</b>
                  </div>
                  <button type="button" className="btn btn-secondary">Open GitHub org →</button>
                </div>
              </div>

              <div className="webhook">
                <span className="lbl">Webhook health</span>
                <div className="webhook-row">
                  <span className="hook-dot ok" />
                  <code>pull-request.merged</code>
                  <Pill tone="sage">OK</Pill>
                  <span className="hint">last received 4 minutes ago · 142 deliveries · 30d</span>
                </div>
                <div className="webhook-row">
                  <span className="hook-dot ok" />
                  <code>push</code>
                  <Pill tone="sage">OK</Pill>
                  <span className="hint">last received 14 minutes ago · 421 deliveries · 30d</span>
                </div>
              </div>

              <div className="gh-foot">
                <button type="button" className="btn btn-ghost danger">Disconnect</button>
              </div>
            </Card>
          </section>

          {/* 5. Environments */}
          <section id="environments">
            <Card
              title="Environments"
              subtitle="The production and staging environments your apps deploy into."
              actions={<button type="button" className="btn btn-secondary">+ Add environment</button>}
            >
              <div className="env-grid">
                <article className="env-card">
                  <div className="env-head">
                    <h4>Production</h4>
                    <Pill tone="sage">Active</Pill>
                  </div>
                  <dl>
                    <div><dt>Region</dt><dd><code>us-east-1</code></dd></div>
                    <div><dt>Platform version</dt><dd><code>asm-platform v4.2.1</code></dd></div>
                    <div><dt>Infra topology</dt><dd><Pill tone="indigo">Single-tenant</Pill></dd></div>
                    <div><dt>Live apps</dt><dd>2</dd></div>
                  </dl>
                </article>
                <article className="env-card">
                  <div className="env-head">
                    <h4>Staging</h4>
                    <Pill tone="sage">Active</Pill>
                  </div>
                  <dl>
                    <div><dt>Region</dt><dd><code>us-east-1</code></dd></div>
                    <div><dt>Platform version</dt><dd><code>asm-platform v4.3.0-rc.2</code></dd></div>
                    <div><dt>Infra topology</dt><dd><Pill tone="indigo">Single-tenant</Pill></dd></div>
                    <div><dt>Live apps</dt><dd>5</dd></div>
                  </dl>
                </article>
              </div>
            </Card>
          </section>

          {/* 6. Data residency */}
          <section id="residency">
            <Card title="Data residency" subtitle="Where your platform compute runs and where your data lives.">
              <div className="res-card">
                <div className="res-top">
                  <span className="res-eyebrow">YOUR DATA RESIDES IN</span>
                  <h2>us-east-1 · Northern Virginia</h2>
                </div>
                <p>
                  Assembly compute runs inside Assembly's AWS VPC in <code>us-east-1</code>. Your customer data
                  stays in your own systems — Salesforce, Snowflake, Workday, Postgres — and is read on demand
                  through governed connectors. Embeddings and audit trail are stored in your dedicated, single-tenant
                  Assembly tenancy in the same region.
                </p>
                <div className="res-grid">
                  <div><span className="lbl">compute region</span><code>us-east-1a · us-east-1b</code></div>
                  <div><span className="lbl">tenancy</span><code>single-tenant</code></div>
                  <div><span className="lbl">at-rest encryption</span><code>AES-256 · KMS-customer-managed</code></div>
                  <div><span className="lbl">in-transit</span><code>TLS 1.3 only</code></div>
                </div>
                <a href="#" className="res-link">Change region →</a>
              </div>
            </Card>
          </section>

          {/* 7. Data export & deletion */}
          <section id="export">
            <div className="ed-grid">
              <Card title="Export all data" subtitle="Pack and stage everything for download.">
                <ul className="check-list">
                  <li><label><input type="checkbox" defaultChecked /> Organization config (members, roles, settings)</label></li>
                  <li><label><input type="checkbox" defaultChecked /> Audit log (full 7-year retention)</label></li>
                  <li><label><input type="checkbox" defaultChecked /> Application data (versions, releases, checklists)</label></li>
                  <li><label><input type="checkbox" /> Repository references (URLs + commit shas only)</label></li>
                  <li><label><input type="checkbox" /> Vector index manifests (chunks + sources)</label></li>
                </ul>
                <button type="button" className="btn btn-primary" style={{ marginTop: 14 }}>Generate export</button>
                <p className="hint" style={{ marginTop: 10 }}>A zip is staged for download for 7 days. Owner is emailed when it's ready.</p>
              </Card>

              <Card title="Delete all data">
                <div className="danger-card">
                  <p>
                    Request deletion of all organization data — repositories, vector indexes, audit log, configurations.
                    This action is irreversible after the 14-day soft-delete window.
                  </p>
                  <ul>
                    <li>Repositories transferred to your GitHub org first</li>
                    <li>Vector indexes purged and tombstoned</li>
                    <li>Audit log retained for legal hold (encrypted-at-rest, no read access)</li>
                  </ul>
                  <button type="button" className="btn btn-ghost danger">Begin deletion · multi-step confirm</button>
                </div>
              </Card>
            </div>
          </section>

          {/* 8. Legal */}
          <section id="legal">
            <Card title="Legal" subtitle="Agreements, subprocessors, and policy updates.">
              <ul className="legal-list">
                <li>
                  <div className="lg-l">
                    <b>Data Processing Agreement</b>
                    <small>Standard Contractual Clauses + UK addendum</small>
                  </div>
                  <div className="lg-r">
                    <Pill tone="sage">Accepted</Pill>
                    <span className="hint">Maria Cordova · 2025-11-04</span>
                  </div>
                </li>
                <li>
                  <div className="lg-l">
                    <b>Terms of Service · v3.1</b>
                    <small>Current. No update required.</small>
                  </div>
                  <div className="lg-r">
                    <Pill tone="sage">Accepted</Pill>
                    <span className="hint">Maria Cordova · 2025-11-04</span>
                  </div>
                </li>
                <li>
                  <div className="lg-l">
                    <b>Subprocessor list</b>
                    <small>14 subprocessors · last reviewed 2026-04-22</small>
                  </div>
                  <div className="lg-r">
                    <a href="#" className="lg-link">View list →</a>
                  </div>
                </li>
                <li>
                  <div className="lg-l">
                    <b>Privacy policy</b>
                    <small>Effective 2025-09-01</small>
                  </div>
                  <div className="lg-r">
                    <a href="#" className="lg-link">View policy →</a>
                  </div>
                </li>
              </ul>
            </Card>
          </section>

          {/* 9. Danger zone */}
          <section id="danger">
            <Card title="Danger zone">
              <div className="dz-stack">
                <div className="dz-row">
                  <div>
                    <b>Cancel subscription</b>
                    <small>Stops new app builds. Existing apps continue running through the end of your billing period.</small>
                  </div>
                  <button type="button" className="btn btn-ghost danger">Cancel subscription</button>
                </div>
                <div className="dz-row">
                  <div>
                    <b>Transfer ownership</b>
                    <small>Move the Owner role to another Admin in your organization. Only the Owner can perform this action.</small>
                  </div>
                  <button type="button" className="btn btn-ghost danger">Transfer ownership</button>
                </div>
                <div className="dz-row">
                  <div>
                    <b>Delete organization</b>
                    <small>Permanently destroy this organization and all associated data after 14 days. See data export above.</small>
                  </div>
                  <button type="button" className="btn btn-ghost danger">Delete organization</button>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>

      <style>{`
        .st-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 36px;
          align-items: flex-start;
        }
        @media (max-width: 980px) { .st-grid { grid-template-columns: 1fr; } }

        .st-rail {
          position: sticky;
          top: 100px;
        }
        .st-rail nav ul { list-style: none; margin: 0; padding: 0; }
        .st-rail nav li { margin-bottom: 2px; }
        .st-rail nav a {
          display: block;
          padding: 8px 12px;
          font-size: 13.5px;
          color: var(--color-ink-500);
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
          border-left: 2px solid transparent;
        }
        .st-rail nav a:hover { background: var(--color-ink-50); color: var(--color-ink-950); }
        .st-rail nav a.on {
          color: var(--color-indigo-700);
          background: var(--color-indigo-50);
          border-left-color: var(--color-indigo-600);
          font-weight: 500;
        }
        @media (max-width: 980px) {
          .st-rail { position: static; overflow-x: auto; }
          .st-rail nav ul { display: flex; gap: 4px; }
          .st-rail nav a { white-space: nowrap; padding: 6px 10px; font-size: 12.5px; }
        }

        .st-col { display: flex; flex-direction: column; gap: 24px; }
        .st-col > section { scroll-margin-top: 80px; }

        /* Generic form */
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
        @media (max-width: 720px) { .form-grid { grid-template-columns: 1fr; } }
        .form-foot { display: flex; justify-content: flex-end; gap: 8px; margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--color-ink-100); }

        input[type="text"], select, textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          font-size: 14px;
          background: #fff;
          font-family: var(--font-body);
          color: var(--color-ink-950);
        }
        input[type="text"]:focus, select:focus, textarea:focus {
          outline: 2px solid var(--color-indigo-200);
          border-color: var(--color-indigo-600);
        }
        .mono-input { font-family: var(--font-mono); font-size: 13px; max-width: 160px; }
        .hint { font-size: 12px; color: var(--color-ink-500); }
        .lbl {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          display: block;
          margin-bottom: 4px;
        }

        .logo-up { display: flex; align-items: center; gap: 12px; }
        .logo-frame {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: var(--color-ink-950);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 18px;
        }
        .color-row { display: flex; align-items: center; gap: 12px; }
        .swatch { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--color-ink-200); }

        /* Members */
        .mem-table { width: 100%; border-collapse: collapse; }
        .mem-table thead th {
          text-align: left;
          padding: 6px 12px 10px;
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .mem-table tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .mem-table tbody tr:last-child { border-bottom: 0; }
        .mem-table td { padding: 12px; font-size: 13.5px; color: var(--color-ink-700); vertical-align: middle; }
        .mem-name { display: inline-flex; align-items: center; gap: 10px; }
        .mem-av {
          width: 28px; height: 28px;
          border-radius: 50%;
          color: #fff;
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .mem-email code { background: transparent; padding: 0; font-size: 12.5px; color: var(--color-ink-500); }
        .role-sel { padding: 6px 10px; font-size: 13px; max-width: 140px; }
        .role-sel:disabled { opacity: 0.7; cursor: not-allowed; }
        .mem-time { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-500); }
        .mem-actions { text-align: right; }
        .ic-btn {
          width: 28px; height: 28px;
          border-radius: 6px;
          color: var(--color-ink-500);
        }
        .ic-btn:hover { background: var(--color-ink-50); color: var(--color-ink-950); }

        .pending-head { display: flex; justify-content: space-between; align-items: baseline; margin-top: 28px; margin-bottom: 10px; }
        .pending-head h4 { font-size: 13px; }
        .pending-list { list-style: none; margin: 0; padding: 0; }
        .pending-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: var(--color-ink-50);
          border: 1px dashed var(--color-ink-200);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .pending-l { display: flex; flex-direction: column; gap: 2px; }
        .pending-l code { background: transparent; padding: 0; font-size: 13px; color: var(--color-ink-950); }
        .pending-l small { font-size: 11.5px; color: var(--color-ink-500); }
        .pending-r { display: inline-flex; align-items: center; gap: 8px; }
        .pending-r .btn { padding: 6px 12px; font-size: 12px; }

        /* API keys */
        .key-table { width: 100%; border-collapse: collapse; }
        .key-table thead th {
          text-align: left;
          padding: 6px 12px 10px;
          border-bottom: 1px solid var(--color-ink-100);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .key-table tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .key-table tbody tr:last-child { border-bottom: 0; }
        .key-table td { padding: 14px 12px; font-size: 13.5px; color: var(--color-ink-700); vertical-align: middle; }
        .prov { display: inline-flex; align-items: center; gap: 8px; }
        .prov-ic { width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; }
        .ic-anthropic { background: #ce8b6a; color: #fff; }
        .ic-openai    { background: #10a37f; color: #fff; }
        .ic-google    { background: #4285f4; color: #fff; }
        .ic-azure     { background: #0078d4; color: #fff; }
        .ic-internal  { background: var(--color-ink-950); color: #fff; }
        .prov-name { font-family: var(--font-mono); font-size: 12px; color: var(--color-ink-950); }
        .key-time { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-500); }
        .key-mask { background: var(--color-ink-50); font-family: var(--font-mono); font-size: 12px; padding: 3px 8px; color: var(--color-ink-700); }
        .key-actions { display: inline-flex; gap: 6px; }
        .key-actions .btn { padding: 5px 10px; font-size: 12px; }
        .byok-note {
          margin-top: 16px;
          padding: 14px 16px;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-200);
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: var(--color-indigo-700);
        }
        .byok-ic { font-family: var(--font-mono); font-size: 18px; color: var(--color-indigo-600); }

        /* GitHub */
        .gh-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding-bottom: 22px; border-bottom: 1px solid var(--color-ink-100); margin-bottom: 18px; }
        @media (max-width: 720px) { .gh-grid { grid-template-columns: 1fr; } }
        .gh-l { display: flex; flex-direction: column; gap: 6px; }
        .gh-org { font-family: var(--font-mono); font-size: 18px; font-weight: 600; color: var(--color-ink-950); background: transparent; padding: 0; }
        .gh-l small { font-size: 12px; color: var(--color-ink-500); }
        .gh-r { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
        .gh-stat { display: flex; flex-direction: column; gap: 2px; }
        .gh-stat b { font-family: var(--font-display); font-size: 28px; font-weight: 600; color: var(--color-ink-950); }
        .webhook { display: flex; flex-direction: column; gap: 8px; padding-bottom: 18px; border-bottom: 1px solid var(--color-ink-100); margin-bottom: 18px; }
        .webhook-row { display: inline-flex; align-items: center; gap: 12px; padding: 8px 0; }
        .hook-dot { width: 8px; height: 8px; border-radius: 50%; }
        .hook-dot.ok { background: var(--color-sage-fg); }
        .gh-foot { display: flex; justify-content: flex-end; }

        /* Environments */
        .env-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 720px) { .env-grid { grid-template-columns: 1fr; } }
        .env-card { padding: 18px; border: 1px solid var(--color-ink-200); border-radius: 12px; background: #fff; }
        .env-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .env-head h4 { font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--color-ink-950); }
        .env-card dl { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0; }
        .env-card dt { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-ink-500); margin-bottom: 3px; }
        .env-card dd { font-size: 13.5px; color: var(--color-ink-950); margin: 0; }

        /* Residency */
        .res-card { background: var(--color-indigo-50); border: 1px solid var(--color-indigo-200); border-radius: 12px; padding: 28px; }
        .res-top { margin-bottom: 16px; }
        .res-eyebrow { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-indigo-600); font-weight: 600; }
        .res-card h2 { font-size: 28px; margin-top: 6px; color: var(--color-ink-950); }
        .res-card p { color: var(--color-ink-700); font-size: 14px; line-height: 1.65; max-width: 720px; }
        .res-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--color-indigo-200); }
        @media (max-width: 720px) { .res-grid { grid-template-columns: 1fr; } }
        .res-grid > div { display: flex; flex-direction: column; gap: 2px; }
        .res-grid code { font-family: var(--font-mono); font-size: 13px; color: var(--color-ink-950); background: transparent; padding: 0; }
        .res-link { display: inline-block; margin-top: 18px; color: var(--color-indigo-700); font-size: 14px; font-weight: 500; }

        /* Export & deletion */
        .ed-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 900px) { .ed-grid { grid-template-columns: 1fr; } }
        .check-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .check-list label { display: inline-flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--color-ink-700); cursor: pointer; }
        .check-list input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--color-indigo-600); }
        .danger-card { background: rgba(251, 226, 223, 0.45); border: 1px solid var(--color-warn-bg); border-radius: 10px; padding: 16px; }
        .danger-card p { font-size: 13.5px; color: var(--color-warn-fg); margin-bottom: 10px; }
        .danger-card ul { margin: 8px 0 14px 18px; font-size: 12.5px; color: var(--color-ink-700); }
        .btn.danger { color: var(--color-warn-fg); }
        .btn.danger:hover { background: var(--color-warn-bg); color: var(--color-warn-fg); }

        /* Legal */
        .legal-list { list-style: none; margin: 0; padding: 0; }
        .legal-list li {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          padding: 14px 0;
          border-top: 1px solid var(--color-ink-100);
          align-items: center;
        }
        .legal-list li:first-child { border-top: 0; padding-top: 4px; }
        .lg-l { display: flex; flex-direction: column; gap: 2px; }
        .lg-l b { font-family: var(--font-display); font-size: 14.5px; font-weight: 600; color: var(--color-ink-950); }
        .lg-l small { font-size: 12px; color: var(--color-ink-500); }
        .lg-r { display: inline-flex; align-items: center; gap: 10px; }
        .lg-link { color: var(--color-indigo-700); font-size: 13.5px; font-weight: 500; }

        /* Danger zone */
        .dz-stack { display: flex; flex-direction: column; gap: 12px; }
        .dz-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding: 16px;
          border: 1px solid var(--color-warn-bg);
          border-radius: 10px;
          background: rgba(251, 226, 223, 0.25);
        }
        .dz-row b { font-family: var(--font-display); font-size: 14.5px; font-weight: 600; color: var(--color-ink-950); display: block; margin-bottom: 4px; }
        .dz-row small { font-size: 12.5px; color: var(--color-ink-500); }
      `}</style>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Small helper component
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="lbl">{label}</span>
      {children}
    </label>
  );
}
