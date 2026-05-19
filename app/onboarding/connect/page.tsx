"use client";

import Link from "next/link";
import { useState } from "react";

const sources = [
  { id: "workday",    name: "Workday",     desc: "HRIS · employees, levels, comp",     mark: "WD", color: "#0875E1" },
  { id: "salesforce", name: "Salesforce",  desc: "CRM · accounts, opps, contacts",     mark: "SF", color: "#00A1E0" },
  { id: "snowflake",  name: "Snowflake",   desc: "Warehouse · curated tables",          mark: "SN", color: "#29B5E8" },
  { id: "slack",      name: "Slack",       desc: "Comms · channels, threads, files",    mark: "SL", color: "#4A154B" },
  { id: "later",      name: "I'll do this later", desc: "Skip for now — connect from inside the app.", mark: "→",  color: "var(--color-ink-700)" },
];

export default function OnboardingConnect() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="onb-shell">
      <header className="onb-head">
        <span className="onb-eyebrow"><span className="dot" /> Onboarding · step 3 of 4</span>
        <div className="onb-dots">
          <span className="onb-dot done" />
          <span className="onb-dot done" />
          <span className="onb-dot on" />
          <span className="onb-dot" />
        </div>
        <h1 className="onb-title">Connect your first data source</h1>
        <p className="onb-sub">
          Pick one to start. Your data stays in your system — Assembly reads on demand through governed connectors.
        </p>
      </header>

      <section className="onb-body connect-body">
        <div className="connect-grid">
          {sources.map((s) => (
            <button
              key={s.id}
              type="button"
              className={"connect-card " + (selected === s.id ? "on" : "") + (s.id === "later" ? " later" : "")}
              onClick={() => setSelected(s.id)}
              aria-pressed={selected === s.id}
            >
              <span className="connect-mark" style={{ background: s.color }}>{s.mark}</span>
              <span className="connect-name">{s.name}</span>
              <span className="connect-desc">{s.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <footer className="onb-foot">
        <Link href="/onboarding/path" className="onb-back">← Back</Link>
        <Link
          href="/onboarding/team"
          className={"btn btn-primary " + (selected ? "" : "btn-disabled")}
          aria-disabled={!selected}
          tabIndex={selected ? 0 : -1}
        >
          Continue <span className="arr">→</span>
        </Link>
      </footer>

      <style>{`
        .connect-body { padding: 22px; }
        .connect-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 720px) { .connect-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .connect-grid { grid-template-columns: 1fr; } }
        .connect-card {
          padding: 18px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 12px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, transform 0.12s;
        }
        .connect-card:hover { border-color: var(--color-ink-400); transform: translateY(-1px); }
        .connect-card.on {
          border-color: var(--color-indigo-600);
          background: var(--color-indigo-50);
          box-shadow: 0 6px 18px -10px rgba(79, 70, 229, 0.35);
        }
        .connect-card.later {
          border-style: dashed;
          background: var(--color-ink-50);
        }
        .connect-card.later.on {
          background: var(--color-indigo-50);
          border-style: solid;
        }
        .connect-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 4px;
        }
        .connect-name { font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--color-ink-950); }
        .connect-desc { font-size: 12.5px; color: var(--color-ink-500); line-height: 1.5; }

        .btn-disabled { opacity: 0.4; pointer-events: none; }
      `}</style>
    </div>
  );
}
