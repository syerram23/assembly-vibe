"use client";

import { useEffect, useState } from "react";

/*
 * Mock Claude Code terminal — slide-out right panel.
 *
 * Shows the interplay between the platform and Claude Code as the build
 * surface. Foundation in T2; the scripted session content can be enriched
 * in T3 when the Build Context page is wired.
 */

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Line {
  kind: "system" | "user" | "claude" | "code" | "tool";
  text: string;
  pending?: boolean;
}

const script: Line[] = [
  { kind: "system", text: "claude-code · pointed at assembly.io/builder/comp-band-bot" },
  { kind: "system", text: "loaded skills.md from repo · 12 capabilities available" },
  { kind: "system", text: "mcp endpoint: asm_live_…f3a9 · scope: app:comp-band-bot" },
  { kind: "user",   text: "/connect" },
  { kind: "claude", text: "Connected to Assembly. I can see your governed data plane and the agents library. What do you want to build?" },
  { kind: "user",   text: "build me a slash command that answers comp band questions in slack — read from workday + greenhouse, redact PII." },
  { kind: "claude", text: "Got it. I'll compose this from:\n  · workday.employees + greenhouse.offers (sources, already governed)\n  · level_band_lookup (transform · pre-built)\n  · pii_redact (policy · pre-built)\n  · slack surface (endpoint)" },
  { kind: "tool",   text: "@assembly · scaffolding workflow comp-band-lookup against framework v1.4..." },
  { kind: "code",   text: "src/workflows/comp-band-lookup.ts\n├── source: workday.employees\n├── source: greenhouse.offers\n├── transform: level_band_lookup(role, location)\n├── policy: pii_redact(BandRange)\n└── surface: slack /comp" },
  { kind: "tool",   text: "@assembly · audit lineage configured · HITL gate optional · ready to deploy to staging" },
  { kind: "claude", text: "Built. Push it to staging?" },
  { kind: "user",   text: "yes" },
  { kind: "tool",   text: "@assembly · pushed v0.1.0 · staging.assembly.io/comp-band-bot · running" },
  { kind: "claude", text: "Live in staging. When you're ready to take it to production, promote it from /app/releases — it needs the pre-prod checklist + your Org Admin's approval." },
];

export function ClaudeCodeTerminal({ open, onClose }: Props) {
  // Cycle through script lines so the user sees activity
  const [linesShown, setLinesShown] = useState(4);

  useEffect(() => {
    if (!open) return;
    if (linesShown >= script.length) return;
    const t = setTimeout(() => setLinesShown((n) => n + 1), 1100);
    return () => clearTimeout(t);
  }, [linesShown, open]);

  // Keyboard ⌘J toggle handled in AppShell — Esc closes here.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <aside className={"cct " + (open ? "open" : "")} aria-hidden={!open}>
      <header className="cct-head">
        <div className="cct-chrome">
          <span className="cd r" />
          <span className="cd y" />
          <span className="cd g" />
        </div>
        <div className="cct-title">
          <span className="cct-dim">claude-code</span>
          <span className="cct-sep">·</span>
          <span className="cct-bold">comp-band-bot</span>
        </div>
        <div className="cct-actions">
          <button type="button" className="cct-btn" title="Reset session" onClick={() => setLinesShown(4)}>↻</button>
          <button type="button" className="cct-btn" title="Close (Esc)" onClick={onClose}>×</button>
        </div>
      </header>

      <div className="cct-meta">
        <span className="cct-pill">
          <span className="cct-pill-dot" />
          connected to <code>assembly.io/builder</code>
        </span>
        <span className="cct-pill">
          mcp · <code>asm_live_…f3a9</code>
        </span>
        <span className="cct-pill">
          repo · <code>comp-band-bot</code>
        </span>
      </div>

      <div className="cct-scroll">
        {script.slice(0, linesShown).map((line, i) => (
          <div className={"cct-line " + line.kind} key={i}>
            {line.kind === "user" && <span className="cct-prefix user">you ❯</span>}
            {line.kind === "claude" && <span className="cct-prefix claude">claude ▸</span>}
            {line.kind === "tool" && <span className="cct-prefix tool">→</span>}
            {line.kind === "system" && <span className="cct-prefix system">·</span>}
            {line.kind === "code" && <span className="cct-prefix code">▌</span>}
            <pre className="cct-text">{line.text}</pre>
          </div>
        ))}
        {linesShown < script.length && (
          <div className="cct-line pending">
            <span className="cct-prefix tool">…</span>
            <span className="cct-typing">
              <span></span><span></span><span></span>
            </span>
          </div>
        )}
      </div>

      <footer className="cct-foot">
        <div className="cct-input">
          <span className="cct-prompt">❯</span>
          <span className="cct-placeholder">message claude (mock — read-only demo)</span>
        </div>
        <div className="cct-actions-row">
          <button type="button" className="cct-cta">
            <span aria-hidden>⛑</span> Raise a ticket
          </button>
          <span className="cct-hint">
            Hit a wall on something not vibe-codeable? Raising a ticket sets the app to <code>Blocked</code> until an Assembly engineer takes it.
          </span>
        </div>
      </footer>

      <style>{`
        .cct {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 460px;
          max-width: 90vw;
          background: var(--color-ink-950);
          color: rgba(255, 255, 255, 0.92);
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 50;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1);
          font-family: var(--font-mono);
          font-size: 12.5px;
          line-height: 1.55;
        }
        .cct.open { transform: translateX(0); }

        /* Chrome */
        .cct-head {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.04));
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .cct-chrome { display: flex; gap: 6px; }
        .cd { width: 10px; height: 10px; border-radius: 50%; }
        .cd.r { background: #ff5f57; }
        .cd.y { background: #febc2e; }
        .cd.g { background: #28c840; }
        .cct-title {
          display: flex;
          gap: 6px;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }
        .cct-dim { color: rgba(255, 255, 255, 0.5); }
        .cct-sep { color: rgba(255, 255, 255, 0.3); }
        .cct-bold { color: #fff; font-weight: 600; }
        .cct-actions { display: flex; gap: 4px; }
        .cct-btn {
          width: 26px;
          height: 26px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.6);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
        }
        .cct-btn:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }

        /* Meta strip */
        .cct-meta {
          display: flex;
          gap: 6px;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
        }
        .cct-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 9px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 999px;
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.7);
        }
        .cct-pill code {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 1px 5px;
          border-radius: 3px;
        }
        .cct-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #9bd4a9;
          animation: cctPulse 1.8s ease-in-out infinite;
        }
        @keyframes cctPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(155, 212, 169, 0.4); }
          50%      { box-shadow: 0 0 0 4px rgba(155, 212, 169, 0); }
        }

        /* Scroll body */
        .cct-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 14px 14px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cct-line {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 10px;
          align-items: start;
        }
        .cct-prefix {
          font-family: var(--font-mono);
          font-size: 10px;
          padding-top: 1px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .cct-prefix.user   { color: var(--color-indigo-300); }
        .cct-prefix.claude { color: #9bd4a9; }
        .cct-prefix.tool   { color: var(--color-amber-bg); }
        .cct-prefix.system { color: rgba(255, 255, 255, 0.35); }
        .cct-prefix.code   { color: var(--color-indigo-400); }
        .cct-text {
          font-family: var(--font-mono);
          font-size: 12.5px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.88);
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0;
        }
        .cct-line.user .cct-text { color: #fff; }
        .cct-line.claude .cct-text { color: rgba(255, 255, 255, 0.92); }
        .cct-line.tool .cct-text {
          color: var(--color-amber-bg);
          font-style: italic;
          font-size: 11.5px;
        }
        .cct-line.code .cct-text {
          background: rgba(255, 255, 255, 0.04);
          border-left: 2px solid var(--color-indigo-500);
          padding: 8px 10px;
          border-radius: 4px;
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.85);
        }
        .cct-line.system .cct-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
        }

        .cct-line.pending { grid-template-columns: 64px auto; }
        .cct-typing { display: inline-flex; gap: 4px; padding-top: 6px; }
        .cct-typing span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          animation: cctTyping 1.2s ease-in-out infinite;
        }
        .cct-typing span:nth-child(2) { animation-delay: 0.15s; }
        .cct-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes cctTyping {
          0%, 80%, 100% { opacity: 0.3; transform: scale(1); }
          40% { opacity: 1; transform: scale(1.2); }
        }

        /* Footer */
        .cct-foot {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cct-input {
          display: grid;
          grid-template-columns: 16px 1fr;
          gap: 8px;
          align-items: center;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
        }
        .cct-prompt { color: var(--color-indigo-400); font-weight: 700; }
        .cct-placeholder { color: rgba(255, 255, 255, 0.4); font-size: 11.5px; }
        .cct-actions-row {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: center;
        }
        .cct-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 11px;
          background: var(--color-amber-bg);
          color: var(--color-amber-fg);
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          font-family: var(--font-body);
          cursor: pointer;
        }
        .cct-cta:hover { background: #f7d99a; }
        .cct-hint {
          font-family: var(--font-body);
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.4;
        }
        .cct-hint code {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 0 4px;
          border-radius: 3px;
          font-size: 10.5px;
        }

        @media (prefers-reduced-motion: reduce) {
          .cct { transition: none; }
          .cct-pill-dot, .cct-typing span { animation: none; }
        }
      `}</style>
    </aside>
  );
}
