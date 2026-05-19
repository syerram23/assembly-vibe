"use client";

import Link from "next/link";
import { useState } from "react";

const paths = [
  {
    id: "self-service",
    title: "Self-service with support",
    sub: "Best for teams comfortable building with Claude Code. Assembly support is one ticket away.",
    pill: null,
  },
  {
    id: "partner",
    title: "Work with an Assembly Partner",
    sub: "An accredited partner does the heavy lifting for the first 2–3 apps. You learn by watching.",
    pill: "RECOMMENDED",
  },
  {
    id: "delivery",
    title: "AI-native delivery",
    sub: "Assembly's delivery team builds your first apps end-to-end. Fastest path to value.",
    pill: null,
  },
] as const;

export default function OnboardingPath() {
  const [selected, setSelected] = useState<string>("partner");

  return (
    <div className="onb-shell">
      <header className="onb-head">
        <span className="onb-eyebrow"><span className="dot" /> Onboarding · step 2 of 4</span>
        <div className="onb-dots">
          <span className="onb-dot done" />
          <span className="onb-dot on" />
          <span className="onb-dot" />
          <span className="onb-dot" />
        </div>
        <h1 className="onb-title">How will you build with Assembly?</h1>
        <p className="onb-sub">
          Pick the engagement path that fits your team today. You can change later — they share the same platform.
        </p>
      </header>

      <section className="onb-body path-body">
        <div className="path-grid">
          {paths.map((p) => (
            <button
              key={p.id}
              type="button"
              className={"path-card " + (selected === p.id ? "on" : "")}
              onClick={() => setSelected(p.id)}
              aria-pressed={selected === p.id}
            >
              {p.pill && <span className="path-pill">{p.pill}</span>}
              <span className="path-radio" aria-hidden>
                {selected === p.id && <span className="path-radio-dot" />}
              </span>
              <h4>{p.title}</h4>
              <p>{p.sub}</p>
            </button>
          ))}
        </div>
      </section>

      <footer className="onb-foot">
        <Link href="/onboarding/about" className="onb-back">← Back</Link>
        <Link href="/onboarding/connect" className="btn btn-primary">Continue <span className="arr">→</span></Link>
      </footer>

      <style>{`
        .path-body { padding: 22px; }
        .path-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        @media (max-width: 800px) { .path-grid { grid-template-columns: 1fr; } }
        .path-card {
          position: relative;
          padding: 22px 18px 20px;
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
        .path-card:hover { border-color: var(--color-ink-400); }
        .path-card.on {
          border-color: var(--color-indigo-600);
          background: var(--color-indigo-50);
        }
        .path-pill {
          position: absolute;
          top: -10px;
          right: 16px;
          background: var(--color-indigo-600);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.14em;
          padding: 3px 10px;
          border-radius: 999px;
          font-weight: 600;
        }
        .path-radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid var(--color-ink-300);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .path-card.on .path-radio { border-color: var(--color-indigo-600); }
        .path-radio-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--color-indigo-600);
        }
        .path-card h4 {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-ink-950);
          line-height: 1.3;
        }
        .path-card p {
          font-size: 13px;
          color: var(--color-ink-500);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
