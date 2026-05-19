"use client";

import Link from "next/link";
import { useState } from "react";

interface Row {
  email: string;
  role: string;
}

const ROLES = ["Owner", "Admin", "Builder", "Reviewer", "Viewer"];

export default function OnboardingTeam() {
  const [rows, setRows] = useState<Row[]>([
    { email: "", role: "Builder" },
    { email: "", role: "Builder" },
    { email: "", role: "Reviewer" },
  ]);

  return (
    <div className="onb-shell">
      <header className="onb-head">
        <span className="onb-eyebrow"><span className="dot" /> Onboarding · step 4 of 4</span>
        <div className="onb-dots">
          <span className="onb-dot done" />
          <span className="onb-dot done" />
          <span className="onb-dot done" />
          <span className="onb-dot on" />
        </div>
        <h1 className="onb-title">Invite your team</h1>
        <p className="onb-sub">
          Add the people who'll build, review, or just keep an eye on the apps you ship. You can invite more anytime.
        </p>
      </header>

      <section className="onb-body team-body">
        {rows.map((row, i) => (
          <div key={i} className="team-row">
            <input
              type="email"
              placeholder="colleague@company.com"
              value={row.email}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...next[i], email: e.target.value };
                setRows(next);
              }}
            />
            <select
              value={row.role}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...next[i], role: e.target.value };
                setRows(next);
              }}
            >
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
            <button
              type="button"
              className="team-rm"
              aria-label="Remove row"
              onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
              disabled={rows.length === 1}
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          className="add-row"
          onClick={() => setRows([...rows, { email: "", role: "Builder" }])}
        >
          + Add another
        </button>
      </section>

      <footer className="onb-foot">
        <Link href="/onboarding/connect" className="onb-back">← Back</Link>
        <div className="team-cta">
          <Link href="/app" className="btn btn-ghost">Skip for now</Link>
          <Link href="/app" className="btn btn-primary">Open Assembly <span className="arr">→</span></Link>
        </div>
      </footer>

      <style>{`
        .team-body { padding: 24px; }
        .team-row {
          display: grid;
          grid-template-columns: 1fr 160px auto;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }
        @media (max-width: 600px) {
          .team-row { grid-template-columns: 1fr 120px auto; }
        }
        .team-row input, .team-row select {
          padding: 11px 14px;
          border: 1px solid var(--color-ink-200);
          border-radius: 10px;
          font-size: 14px;
          background: #fff;
          font-family: var(--font-body);
        }
        .team-row input:focus, .team-row select:focus {
          outline: 2px solid var(--color-indigo-200);
          border-color: var(--color-indigo-600);
        }
        .team-rm {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          color: var(--color-ink-400);
          font-size: 20px;
          line-height: 1;
        }
        .team-rm:hover:not(:disabled) {
          background: var(--color-warn-bg);
          color: var(--color-warn-fg);
        }
        .team-rm:disabled { opacity: 0.3; cursor: not-allowed; }

        .add-row {
          padding: 10px 14px;
          font-size: 13.5px;
          color: var(--color-indigo-700);
          font-weight: 500;
          border-radius: 8px;
          margin-top: 4px;
        }
        .add-row:hover { background: var(--color-indigo-50); }

        .team-cta { display: inline-flex; gap: 8px; }
      `}</style>
    </div>
  );
}
