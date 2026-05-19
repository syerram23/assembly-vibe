"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const pageNames: Record<string, string> = {
  "/app": "Home",
  "/app/applications": "Applications",
  "/app/releases": "Releases",
  "/app/work": "Work",
  "/app/agents": "Agents",
  "/app/connectors": "Connectors",
  "/app/data-model": "Data model",
  "/app/knowledge": "Knowledge",
  "/app/workflows": "Workflows",
  "/app/governance": "Governance",
  "/app/access": "Access",
  "/app/activity": "Activity",
  "/app/settings": "Settings",
  "/app/guide": "Guide",
};

interface Props {
  terminalOpen: boolean;
  onToggleTerminal: () => void;
}

export function AppHeader({ terminalOpen, onToggleTerminal }: Props) {
  const pathname = usePathname() || "/app";
  const pageName = pageNames[pathname] ?? pageNames[Object.keys(pageNames).find((k) => pathname.startsWith(k) && k !== "/app") ?? "/app"] ?? "Home";

  return (
    <header className="appheader">
      <div className="ah-l">
        <span className="ah-crumb">
          <span>Acme Mortgage</span>
          <span className="ah-sep">/</span>
          <span className="ah-current">{pageName}</span>
        </span>
      </div>

      <div className="ah-r">
        <button className="ah-search" type="button" aria-label="Search">
          <span className="ah-icon" aria-hidden>⌕</span>
          <span className="ah-search-lbl">Search</span>
          <kbd>⌘K</kbd>
        </button>

        <Link href="/app/guide" className="ah-icon-btn" title="Guide · how to use Assembly">
          <span aria-hidden>?</span>
        </Link>

        <button className="ah-icon-btn" type="button" title="Notifications">
          <span aria-hidden>○</span>
          <span className="ah-notif-dot" />
        </button>

        <button
          className={"ah-cc " + (terminalOpen ? "on" : "")}
          type="button"
          onClick={onToggleTerminal}
          title="Open Claude Code"
        >
          <span className="ah-cc-icon" aria-hidden>{">_"}</span>
          <span>Claude Code</span>
          <kbd>⌘J</kbd>
        </button>
      </div>

      <style>{`
        .appheader {
          height: 56px;
          padding: 0 24px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--color-ink-100);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 30;
        }
        .ah-l { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .ah-crumb {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-500);
        }
        .ah-sep { color: var(--color-ink-300); }
        .ah-current {
          color: var(--color-ink-950);
          font-weight: 600;
        }

        .ah-r { display: flex; align-items: center; gap: 6px; }

        .ah-search {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px 6px 10px;
          border-radius: 8px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          color: var(--color-ink-500);
          font-size: 12.5px;
          min-width: 220px;
          transition: border-color 0.15s, background 0.15s;
          cursor: pointer;
          font-family: var(--font-body);
        }
        .ah-search:hover { border-color: var(--color-ink-300); }
        .ah-search-lbl { flex: 1; text-align: left; }
        .ah-icon { font-size: 14px; color: var(--color-ink-400); }
        .ah-search kbd, .ah-cc kbd {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 2px 6px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 4px;
          color: var(--color-ink-500);
        }
        .ah-cc kbd { background: rgba(255, 255, 255, 0.18); border-color: rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.8); }

        .ah-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: transparent;
          color: var(--color-ink-500);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          position: relative;
          font-family: var(--font-body);
        }
        .ah-icon-btn:hover { background: var(--color-ink-50); color: var(--color-ink-950); }
        .ah-notif-dot {
          position: absolute;
          top: 6px;
          right: 7px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-warn-fg);
        }

        .ah-cc {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          background: var(--color-ink-950);
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
          margin-left: 8px;
        }
        .ah-cc:hover { background: var(--color-ink-900); }
        .ah-cc.on { background: var(--color-indigo-600); }
        .ah-cc.on:hover { background: var(--color-indigo-700); }
        .ah-cc-icon {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 12px;
          letter-spacing: -0.05em;
        }

        @media (max-width: 760px) {
          .ah-search-lbl, .ah-search kbd { display: none; }
          .ah-search { min-width: 0; padding: 6px; }
          .ah-cc span:not(.ah-cc-icon) { display: none; }
          .ah-cc kbd { display: none; }
        }
      `}</style>
    </header>
  );
}
