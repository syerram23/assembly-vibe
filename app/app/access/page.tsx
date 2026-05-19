"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { permissionRoles, memberships, userById } from "@/lib/mocks";
import type { PermissionRole } from "@/lib/types";

type TabKey = "roles" | "matrix" | "users" | "sso";

const TABS: { key: TabKey; label: string; hint: string }[] = [
  { key: "roles",  label: "Roles",                hint: "5 built-in" },
  { key: "matrix", label: "Permissions matrix",   hint: "Row + field-level" },
  { key: "users",  label: "Users & teams",        hint: `${memberships.length} active` },
  { key: "sso",    label: "SSO config",           hint: "SAML · Okta" },
];

// ─── Permissions matrix definition (mock, but stable) ───────────────────────
type Level = "admin" | "write" | "read" | "deny";

interface MatrixRow {
  scope: string;
  label: string;
  note?: string;
  cells: Record<string, Level>; // role name → level
}

const MATRIX_ROWS: MatrixRow[] = [
  {
    scope: "organization",
    label: "organization",
    note: "Org-level settings, branding, plan.",
    cells: { Owner: "admin", Admin: "admin", Builder: "read", Reviewer: "read", Viewer: "read" },
  },
  {
    scope: "application:*",
    label: "application:*",
    note: "Build, ship, deprecate apps.",
    cells: { Owner: "admin", Admin: "admin", Builder: "write", Reviewer: "read", Viewer: "read" },
  },
  {
    scope: "entity:*",
    label: "entity:*",
    note: "Row-level read on governed entities.",
    cells: { Owner: "admin", Admin: "admin", Builder: "read", Reviewer: "read", Viewer: "read" },
  },
  {
    scope: "entity:*.salary",
    label: "entity:*.salary",
    note: "Compensation fields. Highest sensitivity.",
    cells: { Owner: "admin", Admin: "read", Builder: "deny", Reviewer: "deny", Viewer: "deny" },
  },
  {
    scope: "entity:*.pii",
    label: "entity:*.pii",
    note: "PII fields — masked unless granted.",
    cells: { Owner: "admin", Admin: "read", Builder: "deny", Reviewer: "read", Viewer: "deny" },
  },
  {
    scope: "connector:*",
    label: "connector:*",
    note: "Data plane connectors and credentials.",
    cells: { Owner: "admin", Admin: "admin", Builder: "write", Reviewer: "read", Viewer: "deny" },
  },
  {
    scope: "review:*",
    label: "review:*",
    note: "HITL approval queue.",
    cells: { Owner: "admin", Admin: "admin", Builder: "read", Reviewer: "write", Viewer: "read" },
  },
  {
    scope: "billing",
    label: "billing",
    note: "Invoices, plan changes, payment methods.",
    cells: { Owner: "admin", Admin: "read", Builder: "deny", Reviewer: "deny", Viewer: "deny" },
  },
];

const ROLE_COLUMNS: string[] = ["Owner", "Admin", "Builder", "Reviewer", "Viewer"];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AccessPage() {
  const [tab, setTab] = useState<TabKey>("roles");

  return (
    <>
      <PageHeader
        eyebrow="Access · the moat"
        title="Roles, permissions & identity"
        description="Row- and field-level permissions wired through every app you build. Built-in roles, custom roles, SSO/SCIM, and a simulator that previews the data plane as anyone."
        actions={
          <>
            <Link href="/app/access/simulator" className="btn btn-secondary">
              Open simulator
            </Link>
            <button className="btn btn-primary" type="button">
              Invite member <span className="arr">→</span>
            </button>
          </>
        }
      />

      {/* Tab nav */}
      <nav className="tabnav" role="tablist" aria-label="Access sub-modules">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={"tab " + (tab === t.key ? "tab-on" : "")}
            onClick={() => setTab(t.key)}
          >
            <span className="tab-l">{t.label}</span>
            <span className="tab-h">{t.hint}</span>
          </button>
        ))}
      </nav>

      <div className="tab-body">
        {tab === "roles"  && <RolesTab />}
        {tab === "matrix" && <MatrixTab />}
        {tab === "users"  && <UsersTab />}
        {tab === "sso"    && <SsoTab />}
      </div>

      <style>{`
        .tabnav {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid var(--color-ink-200);
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .tab {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          padding: 12px 18px 14px;
          border-bottom: 2px solid transparent;
          color: var(--color-ink-500);
          transition: color .15s, border-color .15s, background .15s;
          border-radius: 6px 6px 0 0;
          white-space: nowrap;
        }
        .tab:hover { background: var(--color-ink-50); color: var(--color-ink-950); }
        .tab-on {
          color: var(--color-ink-950);
          border-bottom-color: var(--color-indigo-600);
        }
        .tab-l {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14.5px;
          letter-spacing: -0.005em;
        }
        .tab-h {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-ink-400);
        }
        .tab-on .tab-h { color: var(--color-indigo-600); }

        .tab-body { display: flex; flex-direction: column; gap: 20px; }
      `}</style>
    </>
  );
}

// ─── Tab 1 · Roles ─────────────────────────────────────────────────────────

function RolesTab() {
  return (
    <>
      <Card
        title="Built-in roles"
        subtitle="Every org starts with these five. Each is enforced at row- and field-level — your apps inherit them automatically."
        padding={20}
      >
        <div className="rolegrid">
          {permissionRoles.map((r) => (
            <RoleCard key={r.id} role={r} />
          ))}
        </div>
      </Card>

      <Card
        title="Custom roles"
        subtitle="Define narrower roles for specific apps or compliance regimes."
      >
        <div className="custom-row">
          <div className="custom-copy">
            <div className="custom-eyebrow">CUSTOM ROLES</div>
            <p>
              Need an <code>app:reg-e-quarterly-run / reviewer</code> who can disposition findings but never sees claimant PII?
              Compose a custom role from scopes — and the matrix updates everywhere it&apos;s referenced.
            </p>
          </div>
          <button className="btn btn-secondary" type="button" disabled title="Coming soon">
            + Create custom role
          </button>
        </div>
      </Card>

      <style>{`
        .rolegrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .custom-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .custom-copy { flex: 1 1 320px; }
        .custom-eyebrow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          color: var(--color-indigo-700);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .custom-copy p {
          color: var(--color-ink-700);
          font-size: 14px;
          line-height: 1.55;
        }
      `}</style>
    </>
  );
}

function RoleCard({ role }: { role: PermissionRole }) {
  const top = role.permissions.slice(0, 3);
  return (
    <article className="rolecard lift">
      <header className="rc-h">
        <div>
          <h4>{role.name}</h4>
          <p className="rc-desc">{role.description}</p>
        </div>
        {role.builtIn && <Pill tone="indigo">Built-in</Pill>}
      </header>

      <div className="rc-meta">
        <span className="rc-stat">
          <b>{role.memberCount}</b>
          <small>{role.memberCount === 1 ? "member" : "members"}</small>
        </span>
        <span className="rc-stat">
          <b>{role.permissions.length}</b>
          <small>{role.permissions.length === 1 ? "scope" : "scopes"}</small>
        </span>
      </div>

      <ul className="rc-perms">
        {top.map((p) => (
          <li key={p.id}>
            <code>{p.scope}</code>
            <LevelDot level={p.level} />
            <span className="rc-plevel">{p.level}</span>
          </li>
        ))}
        {role.permissions.length > 3 && (
          <li className="rc-more">+{role.permissions.length - 3} more scope{role.permissions.length - 3 === 1 ? "" : "s"}</li>
        )}
      </ul>

      <footer className="rc-f">
        <a className="rc-view" href="#">View role <span aria-hidden>→</span></a>
      </footer>

      <style>{`
        .rolecard {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 18px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
        }
        .rc-h { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .rc-h h4 {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--color-ink-950);
        }
        .rc-desc {
          margin-top: 4px;
          color: var(--color-ink-500);
          font-size: 12.5px;
          line-height: 1.5;
        }
        .rc-meta {
          display: flex;
          gap: 18px;
          padding: 10px 0;
          border-top: 1px dashed var(--color-ink-100);
          border-bottom: 1px dashed var(--color-ink-100);
        }
        .rc-stat { display: inline-flex; flex-direction: column; gap: 0; line-height: 1.1; }
        .rc-stat b {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          color: var(--color-ink-950);
          letter-spacing: -0.01em;
        }
        .rc-stat small {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--color-ink-500);
          text-transform: uppercase;
          margin-top: 2px;
        }
        .rc-perms { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .rc-perms li {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 8px;
          align-items: center;
        }
        .rc-perms code {
          font-family: var(--font-mono);
          font-size: 11.5px;
          background: var(--color-ink-50);
          color: var(--color-ink-700);
          padding: 2px 6px;
          border-radius: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rc-plevel {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .rc-more {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-400);
          padding-left: 4px;
        }
        .rc-f { display: flex; justify-content: flex-end; }
        .rc-view {
          font-size: 13px;
          color: var(--color-indigo-700);
          font-weight: 500;
        }
        .rc-view:hover { color: var(--color-indigo-800); text-decoration: underline; }
      `}</style>
    </article>
  );
}

function LevelDot({ level }: { level: Level }) {
  return (
    <span className={"ldot ldot-" + level} aria-hidden>
      <style>{`
        .ldot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          display: inline-block;
        }
        .ldot-admin { background: var(--color-indigo-700); }
        .ldot-write { background: var(--color-indigo-400); }
        .ldot-read  { background: var(--color-ink-300); }
        .ldot-deny  { background: var(--color-warn-fg); }
      `}</style>
    </span>
  );
}

// ─── Tab 2 · Matrix ────────────────────────────────────────────────────────

function MatrixTab() {
  return (
    <>
      <Card padding={0}>
        <div className="matrix-head">
          <div>
            <div className="matrix-eyebrow">PERMISSIONS MATRIX</div>
            <p className="matrix-copy">
              Row- and field-level permissions. <b>Every app inherits these</b> — no opting out.
              Sensitive scopes like <code>entity:*.salary</code> and <code>entity:*.pii</code> default to
              <b> deny</b> for most roles.
            </p>
          </div>
          <div className="matrix-counts">
            <span><b>{MATRIX_ROWS.length}</b><small>scopes</small></span>
            <span><b>{ROLE_COLUMNS.length}</b><small>roles</small></span>
          </div>
        </div>

        <div className="matrix-scroll">
          <table className="matrix">
            <thead>
              <tr>
                <th className="m-scope">Scope</th>
                {ROLE_COLUMNS.map((r) => <th key={r}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {MATRIX_ROWS.map((row) => {
                const sensitive = row.scope.includes(".salary") || row.scope.includes(".pii");
                return (
                  <tr key={row.scope} className={sensitive ? "m-sensitive" : ""}>
                    <td className="m-scope">
                      <code>{row.label}</code>
                      {sensitive && <Pill tone="warn">Sensitive</Pill>}
                      {row.note && <small>{row.note}</small>}
                    </td>
                    {ROLE_COLUMNS.map((r) => {
                      const lvl = row.cells[r];
                      return (
                        <td key={r} className="m-cell">
                          <MatrixCell level={lvl} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="matrix-legend">
          <span className="legend-title">LEGEND</span>
          <MatrixCell level="admin" /><span className="lg-l">Admin — full control</span>
          <MatrixCell level="write" /><span className="lg-l">Write — create / edit / configure</span>
          <MatrixCell level="read" /><span className="lg-l">Read — view, masked PII</span>
          <MatrixCell level="deny" /><span className="lg-l">Deny — blocked entirely</span>
        </div>
      </Card>

      <style>{`
        .matrix-head {
          padding: 22px 22px 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid var(--color-ink-100);
          flex-wrap: wrap;
        }
        .matrix-eyebrow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          color: var(--color-indigo-700);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .matrix-copy {
          max-width: 620px;
          color: var(--color-ink-700);
          font-size: 14px;
          line-height: 1.55;
        }
        .matrix-counts {
          display: flex;
          gap: 18px;
          padding-top: 4px;
        }
        .matrix-counts span {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1.1;
        }
        .matrix-counts b {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 22px;
          color: var(--color-ink-950);
          letter-spacing: -0.012em;
        }
        .matrix-counts small {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--color-ink-500);
          text-transform: uppercase;
          margin-top: 2px;
        }

        .matrix-scroll { overflow-x: auto; }
        .matrix {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }
        .matrix thead th {
          text-align: left;
          padding: 14px 14px;
          background: var(--color-ink-50);
          border-bottom: 1px solid var(--color-ink-200);
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-700);
        }
        .matrix thead th:not(.m-scope) {
          text-align: center;
          width: 130px;
        }
        .matrix tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .matrix tbody tr:last-child { border-bottom: 0; }
        .matrix tbody td { padding: 14px 14px; vertical-align: middle; }
        .matrix td.m-scope {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-start;
        }
        .matrix td.m-scope code {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--color-ink-950);
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .matrix td.m-scope small {
          font-size: 11.5px;
          color: var(--color-ink-500);
          line-height: 1.45;
        }
        .m-cell { text-align: center; }
        .m-sensitive td.m-scope code { color: var(--color-warn-fg); }

        .matrix-legend {
          padding: 14px 22px;
          border-top: 1px solid var(--color-ink-100);
          background: var(--color-ink-50);
          display: flex;
          flex-wrap: wrap;
          gap: 10px 16px;
          align-items: center;
        }
        .legend-title {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          color: var(--color-ink-500);
          text-transform: uppercase;
          margin-right: 4px;
        }
        .lg-l {
          font-size: 12.5px;
          color: var(--color-ink-700);
          margin-right: 8px;
        }
      `}</style>
    </>
  );
}

function MatrixCell({ level }: { level: Level }) {
  const labels: Record<Level, string> = {
    admin: "Admin",
    write: "Write",
    read: "Read",
    deny: "Deny",
  };
  return (
    <span className={"mcell mcell-" + level}>
      {labels[level]}
      <style>{`
        .mcell {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 64px;
          padding: 5px 10px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .mcell-admin { background: var(--color-indigo-700); color: #fff; }
        .mcell-write { background: var(--color-indigo-100); color: var(--color-indigo-800); }
        .mcell-read  { background: var(--color-ink-50);     color: var(--color-ink-700); border: 1px solid var(--color-ink-200); }
        .mcell-deny  { background: var(--color-warn-bg);    color: var(--color-warn-fg); }
      `}</style>
    </span>
  );
}

// ─── Tab 3 · Users & teams ─────────────────────────────────────────────────

function UsersTab() {
  return (
    <>
      <Card padding={0}>
        <div className="users-head">
          <div className="scim">
            <span className="scim-dot" />
            <div className="scim-l">
              <b>SCIM · syncing from Okta</b>
              <small>Last sync 18m ago · 5 active memberships · 0 pending invites</small>
            </div>
            <Pill tone="sage">Healthy</Pill>
          </div>
          <button className="btn btn-primary" type="button">
            + Invite member
          </button>
        </div>

        <div className="users-scroll">
          <table className="users-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Joined</th>
                <th aria-label="actions" />
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => {
                const u = userById(m.userId);
                if (!u) return null;
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="user-cell">
                        <Avatar user={u} />
                        <div className="user-l">
                          <b>{u.fullName}</b>
                          <small>{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Pill tone={
                        m.role === "Owner" ? "ink" :
                        m.role === "Admin" ? "indigo" :
                        m.role === "Builder" ? "amber" :
                        m.role === "Reviewer" ? "sage" :
                        "neutral"
                      }>
                        {m.role}
                      </Pill>
                    </td>
                    <td className="users-when">
                      {new Date(m.invitedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="users-actions">
                      <button className="kebab" type="button" aria-label="row menu">···</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <style>{`
        .users-head {
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid var(--color-ink-100);
          flex-wrap: wrap;
        }
        .scim {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: var(--color-sage-bg);
          border-radius: 8px;
        }
        .scim-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--color-sage-fg);
          animation: scimPulse 2s ease-in-out infinite;
        }
        @keyframes scimPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(47,107,64,0.45); }
          50%      { box-shadow: 0 0 0 5px rgba(47,107,64,0); }
        }
        .scim-l { display: flex; flex-direction: column; gap: 2px; line-height: 1.2; }
        .scim-l b { font-size: 13px; color: var(--color-sage-fg); }
        .scim-l small { font-family: var(--font-mono); font-size: 10.5px; color: var(--color-sage-fg); opacity: 0.85; }

        .users-scroll { overflow-x: auto; }
        .users-table { width: 100%; border-collapse: collapse; }
        .users-table thead th {
          text-align: left;
          padding: 12px 22px;
          background: var(--color-ink-50);
          border-bottom: 1px solid var(--color-ink-200);
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-700);
        }
        .users-table tbody tr { border-bottom: 1px solid var(--color-ink-100); }
        .users-table tbody tr:last-child { border-bottom: 0; }
        .users-table tbody td { padding: 14px 22px; vertical-align: middle; font-size: 13.5px; color: var(--color-ink-700); }
        .user-cell { display: inline-flex; align-items: center; gap: 12px; }
        .user-l { display: flex; flex-direction: column; gap: 1px; line-height: 1.25; }
        .user-l b { color: var(--color-ink-950); font-weight: 600; font-size: 14px; }
        .user-l small { color: var(--color-ink-500); font-size: 12px; font-family: var(--font-mono); }
        .users-when { font-family: var(--font-mono); font-size: 11.5px; color: var(--color-ink-500); }
        .users-actions { width: 48px; text-align: right; }
        .kebab {
          width: 32px; height: 32px;
          border-radius: 6px;
          color: var(--color-ink-500);
          font-size: 16px;
          letter-spacing: 0.04em;
        }
        .kebab:hover { background: var(--color-ink-50); color: var(--color-ink-950); }
      `}</style>
    </>
  );
}

function Avatar({ user, size = 36 }: { user: { fullName: string; avatarColor: string }; size?: number }) {
  const initials = user.fullName
    .replace(/·.*$/, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  return (
    <span
      className="avatar"
      style={{ background: user.avatarColor, width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
      <style>{`
        .avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.02em;
          font-family: var(--font-display);
          flex-shrink: 0;
        }
      `}</style>
    </span>
  );
}

// ─── Tab 4 · SSO ───────────────────────────────────────────────────────────

function SsoTab() {
  const [protocolChoice] = useState<"SAML" | "OIDC">("SAML");

  return (
    <>
      <Card title="Single sign-on" subtitle="Identity-provider configuration for Acme Mortgage.">
        <div className="sso-grid">
          <Field label="Protocol">
            <div className="sso-toggle">
              <span className={"sso-tog " + (protocolChoice === "SAML" ? "on" : "")}>SAML 2.0</span>
              <span className={"sso-tog " + (protocolChoice === "OIDC" ? "on" : "")}>OIDC</span>
            </div>
          </Field>

          <Field label="Identity provider">
            <Readonly value="Okta" mono />
          </Field>

          <Field label="IdP entity ID / issuer URL" wide>
            <Readonly value="https://acme.okta.com/exk1c9zjzABCdEFgH4x7" mono />
          </Field>

          <Field label="SSO sign-in URL" wide>
            <Readonly value="https://acme.okta.com/app/acme_assembly_1/exk1c9zjzABCdEFgH4x7/sso/saml" mono />
          </Field>

          <Field label="X.509 certificate fingerprint (SHA-256)" wide>
            <Readonly value="AE:7C:1F:88:0B:24:5D:91:E2:46:0A:73:FC:18:9D:55:2B:E1:7A:08:91:C0:43:6F:8E:22:79:1D:55:38:DC:42" mono />
          </Field>

          <Field label="ACS / reply URL" wide>
            <Readonly value="https://assembly.io/sso/saml/acs?org=org_acme" mono />
          </Field>

          <Field label="Just-in-time provisioning">
            <ToggleDisplay on label="Enabled" />
          </Field>

          <Field label="Default role for new sign-ins">
            <Readonly value="Viewer" />
          </Field>

          <Field label="Enforce SSO for all members">
            <ToggleDisplay on label="Required · break-glass for Owner only" />
          </Field>

          <Field label="Session lifetime">
            <Readonly value="8 hours · re-auth on sensitive scopes" />
          </Field>
        </div>

        <div className="sso-test">
          <div className="sso-test-l">
            <b>Test the connection</b>
            <small>Round-trip a SAML assertion through Okta to confirm wiring.</small>
          </div>
          <div className="sso-test-r">
            <Pill tone="sage">Tested 3 hours ago · OK</Pill>
            <button type="button" className="btn btn-secondary">Test connection</button>
          </div>
        </div>
      </Card>

      <Card title="SCIM (Cross-domain identity management)" subtitle="User and group provisioning is automated from Okta.">
        <ul className="scim-list">
          <li><code>SCIM endpoint</code><span>https://assembly.io/scim/v2/org_acme</span></li>
          <li><code>Bearer token</code><span>scim_tok_…d8e2 · rotated 2026-04-12</span></li>
          <li><code>Supported operations</code><span>Users · Groups · Membership · Role mapping</span></li>
          <li><code>Last sync</code><span>2026-05-18T18:30:00Z · 18 minutes ago · 5 users synced · 0 conflicts</span></li>
        </ul>
      </Card>

      <style>{`
        .sso-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px 24px;
        }
        @media (max-width: 900px) { .sso-grid { grid-template-columns: 1fr; } }
        .sso-toggle { display: inline-flex; gap: 4px; padding: 3px; background: var(--color-ink-50); border-radius: 999px; }
        .sso-tog {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12.5px;
          font-family: var(--font-mono);
          letter-spacing: 0.04em;
          color: var(--color-ink-500);
        }
        .sso-tog.on { background: #fff; color: var(--color-ink-950); box-shadow: 0 1px 2px rgba(15,17,42,0.08); }

        .sso-test {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid var(--color-ink-100);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }
        .sso-test-l b { display: block; font-size: 14px; color: var(--color-ink-950); font-weight: 600; }
        .sso-test-l small { color: var(--color-ink-500); font-size: 12.5px; }
        .sso-test-r { display: inline-flex; align-items: center; gap: 12px; flex-wrap: wrap; }

        .scim-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0; }
        .scim-list li {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 16px;
          padding: 12px 0;
          border-top: 1px dashed var(--color-ink-100);
          font-size: 13px;
          align-items: center;
        }
        .scim-list li:first-child { border-top: 0; padding-top: 0; }
        .scim-list code {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-ink-700);
          background: transparent;
          padding: 0;
          letter-spacing: 0.04em;
          text-transform: lowercase;
        }
        .scim-list span {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-950);
        }
      `}</style>
    </>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={"field " + (wide ? "field-wide" : "")}>
      <span className="field-l">{label}</span>
      {children}
      <style>{`
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-wide { grid-column: 1 / -1; }
        .field-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          color: var(--color-ink-500);
          text-transform: uppercase;
        }
      `}</style>
    </label>
  );
}

function Readonly({ value, mono = false }: { value: string; mono?: boolean }) {
  return (
    <span className={"ro " + (mono ? "ro-mono" : "")}>
      {value}
      <style>{`
        .ro {
          display: block;
          padding: 10px 12px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 6px;
          font-size: 13px;
          color: var(--color-ink-950);
          word-break: break-all;
        }
        .ro-mono {
          font-family: var(--font-mono);
          font-size: 12px;
        }
      `}</style>
    </span>
  );
}

function ToggleDisplay({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="tgd">
      <span className={"tgd-sw " + (on ? "on" : "")}><span className="tgd-knob" /></span>
      <span className="tgd-l">{label}</span>
      <style>{`
        .tgd { display: inline-flex; align-items: center; gap: 10px; padding: 9px 12px; background: var(--color-ink-50); border: 1px solid var(--color-ink-100); border-radius: 6px; }
        .tgd-sw { position: relative; width: 32px; height: 18px; border-radius: 999px; background: var(--color-ink-300); transition: background .2s; }
        .tgd-sw.on { background: var(--color-indigo-600); }
        .tgd-knob { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform .2s; }
        .tgd-sw.on .tgd-knob { transform: translateX(14px); }
        .tgd-l { font-size: 12.5px; color: var(--color-ink-700); }
      `}</style>
    </span>
  );
}

