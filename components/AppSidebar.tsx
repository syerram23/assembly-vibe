"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

interface NavItem {
  href: string;
  label: string;
  badge?: string;
}

const sections: { lbl: string; items: NavItem[] }[] = [
  {
    lbl: "Workspace",
    items: [
      { href: "/app",                 label: "Home" },
      { href: "/app/applications",    label: "Applications" },
      { href: "/app/releases",        label: "Releases" },
      { href: "/app/work",            label: "Work",  badge: "3" },
    ],
  },
  {
    lbl: "Build with",
    items: [
      { href: "/app/agents",     label: "Agents" },
      { href: "/app/connectors", label: "Connectors" },
      { href: "/app/data-model", label: "Data model" },
      { href: "/app/knowledge",  label: "Knowledge" },
      { href: "/app/workflows",  label: "Workflows" },
    ],
  },
  {
    lbl: "Govern",
    items: [
      { href: "/app/governance", label: "Governance" },
      { href: "/app/access",     label: "Access" },
      { href: "/app/branding",   label: "Branding" },
      { href: "/app/activity",   label: "Activity" },
    ],
  },
  {
    lbl: "Account",
    items: [
      { href: "/app/settings",   label: "Settings" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname() || "/app";

  return (
    <aside className="asb" aria-label="Application navigation">
      <div className="asb-head">
        <Logo href="/app" size="sm" />
        <Link href="/" className="asb-back" title="Exit to marketing site">
          ↗
        </Link>
      </div>

      <button className="org-switcher" type="button">
        <span className="org-avatar" aria-hidden>A</span>
        <span className="org-name">
          <b>Acme Mortgage</b>
          <small>org_acme · us-east-1</small>
        </span>
        <span className="org-chevron" aria-hidden>▾</span>
      </button>

      {sections.map(({ lbl, items }) => (
        <div className="asb-sec" key={lbl}>
          <span className="asb-sec-lbl">{lbl}</span>
          <ul>
            {items.map(({ href, label, badge }) => {
              const active = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link href={href} className={active ? "on" : ""}>
                    <span>{label}</span>
                    {badge && <span className="badge">{badge}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="asb-foot">
        <div className="user-pill">
          <span className="user-avatar" aria-hidden>MC</span>
          <span className="user-meta">
            <b>Maria Cordova</b>
            <small>Owner</small>
          </span>
        </div>
      </div>

      <style>{`
        .asb {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 260px;
          flex-shrink: 0;
          padding: 22px 16px;
          background: #fff;
          border-right: 1px solid var(--color-ink-100);
          display: flex;
          flex-direction: column;
          gap: 18px;
          overflow-y: auto;
        }
        .asb-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 8px;
        }
        .asb-back {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-500);
          padding: 4px 8px;
          border-radius: 4px;
          text-decoration: none;
        }
        .asb-back:hover { color: var(--color-ink-950); background: var(--color-ink-50); }

        .org-switcher {
          display: grid;
          grid-template-columns: 28px 1fr auto;
          gap: 10px;
          align-items: center;
          padding: 9px 10px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s, background 0.15s;
        }
        .org-switcher:hover { border-color: var(--color-ink-300); }
        .org-avatar {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: var(--color-indigo-600);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 12px;
        }
        .org-name { display: flex; flex-direction: column; min-width: 0; }
        .org-name b {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 13.5px;
          letter-spacing: -0.005em;
          color: var(--color-ink-950);
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .org-name small {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--color-ink-500);
          margin-top: 2px;
        }
        .org-chevron {
          color: var(--color-ink-400);
          font-size: 11px;
        }

        .asb-sec { display: flex; flex-direction: column; gap: 4px; }
        .asb-sec-lbl {
          padding: 0 10px;
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-400);
          margin-bottom: 4px;
        }
        .asb-sec ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
        .asb-sec ul li a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--color-ink-700);
          text-decoration: none;
          transition: background 0.12s, color 0.12s;
        }
        .asb-sec ul li a:hover {
          background: var(--color-ink-50);
          color: var(--color-ink-950);
        }
        .asb-sec ul li a.on {
          background: var(--color-indigo-50);
          color: var(--color-indigo-700);
          font-weight: 600;
        }
        .asb-sec .badge {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          padding: 1px 7px;
          border-radius: 999px;
          background: var(--color-amber-bg);
          color: var(--color-amber-fg);
        }
        .asb-sec ul li a.on .badge {
          background: var(--color-indigo-100);
          color: var(--color-indigo-700);
        }

        .asb-foot {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--color-ink-100);
        }
        .user-pill {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 10px;
          align-items: center;
          padding: 6px 10px;
          border-radius: 6px;
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-indigo-100);
          color: var(--color-indigo-700);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: 11px;
        }
        .user-meta { display: flex; flex-direction: column; min-width: 0; }
        .user-meta b {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 13px;
          color: var(--color-ink-950);
          line-height: 1.2;
        }
        .user-meta small {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--color-ink-500);
        }

        @media (max-width: 980px) {
          .asb {
            position: static;
            width: 100%;
            height: auto;
            border-right: 0;
            border-bottom: 1px solid var(--color-ink-100);
          }
        }
      `}</style>
    </aside>
  );
}
