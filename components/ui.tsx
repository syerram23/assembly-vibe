/*
 * Tiny set of shared UI primitives for app screens.
 * Marketing pages get their own treatment in the landing component.
 */

import { ReactNode } from "react";

// ─── Eyebrow ──────────────────────────────────────────────────────────────

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="dot" />
      {children}
    </span>
  );
}

// ─── Page header ──────────────────────────────────────────────────────────

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="ph">
      <div className="ph-text">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1>{title}</h1>
        {description && <p className="ph-desc">{description}</p>}
      </div>
      {actions && <div className="ph-actions">{actions}</div>}
      <style>{`
        .ph {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--color-ink-100);
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .ph-text { display: flex; flex-direction: column; gap: 10px; max-width: 720px; }
        .ph h1 { font-size: clamp(28px, 3vw, 36px); letter-spacing: -0.022em; line-height: 1.15; }
        .ph-desc { color: var(--color-ink-500); font-size: 15.5px; line-height: 1.55; }
        .ph-actions { display: inline-flex; gap: 10px; flex-wrap: wrap; }
      `}</style>
    </header>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────

export function Card({
  children,
  padding = 24,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  padding?: number;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="card">
      {(title || actions) && (
        <header className="card-head">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p className="card-sub">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </header>
      )}
      <div className="card-body">{children}</div>
      <style>{`
        .card {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .card-head {
          padding: 18px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid var(--color-ink-100);
          flex-wrap: wrap;
        }
        .card-head h3 { font-size: 16px; line-height: 1.3; }
        .card-sub { color: var(--color-ink-500); font-size: 13px; margin-top: 4px; line-height: 1.45; }
        .card-actions { display: inline-flex; gap: 8px; }
        .card-body { padding: ${padding}px; }
      `}</style>
    </section>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────

export function StatTile({
  label,
  value,
  delta,
  hint,
  emphasis = "default",
}: {
  label: string;
  value: string | number;
  delta?: string;
  hint?: string;
  emphasis?: "default" | "indigo" | "warn" | "sage";
}) {
  return (
    <div className={`stile stile-${emphasis}`}>
      <div className="stile-l">{label}</div>
      <div className="stile-v">{value}</div>
      <div className="stile-meta">
        {delta && <span className="stile-delta">{delta}</span>}
        {hint && <span className="stile-hint">{hint}</span>}
      </div>
      <style>{`
        .stile {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stile-indigo { border-color: var(--color-indigo-200); background: var(--color-indigo-50); }
        .stile-warn   { border-color: var(--color-warn-bg);    background: rgba(251, 226, 223, 0.45); }
        .stile-sage   { border-color: var(--color-sage-bg);    background: rgba(214, 235, 219, 0.45); }
        .stile-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .stile-v {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 28px;
          letter-spacing: -0.022em;
          color: var(--color-ink-950);
          line-height: 1.1;
        }
        .stile-meta {
          display: flex;
          gap: 8px;
          align-items: baseline;
          color: var(--color-ink-500);
          font-size: 12px;
          font-family: var(--font-mono);
        }
        .stile-delta { color: var(--color-sage-fg); font-weight: 600; }
        .stile-hint { letter-spacing: 0.04em; }
      `}</style>
    </div>
  );
}

// ─── Pill ─────────────────────────────────────────────────────────────────

export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "indigo" | "sage" | "amber" | "warn" | "ink";
  children: ReactNode;
}) {
  return (
    <span className={`pill pill-${tone}`}>
      {children}
      <style>{`
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 999px;
          line-height: 1.4;
        }
        .pill-neutral { background: var(--color-ink-100); color: var(--color-ink-700); }
        .pill-indigo  { background: var(--color-indigo-100); color: var(--color-indigo-700); }
        .pill-sage    { background: var(--color-sage-bg);   color: var(--color-sage-fg); }
        .pill-amber   { background: var(--color-amber-bg);  color: var(--color-amber-fg); }
        .pill-warn    { background: var(--color-warn-bg);   color: var(--color-warn-fg); }
        .pill-ink     { background: var(--color-ink-950);   color: #fff; }
      `}</style>
    </span>
  );
}

// ─── Lifecycle badge (special pill for app lifecycle states) ────────────

export function LifecycleBadge({ status }: { status: string }) {
  const tone =
    status === "Live" ? "sage" :
    status === "In review" || status === "Approved" ? "indigo" :
    status === "Blocked" ? "warn" :
    status === "In productionization" || status === "In build" ? "amber" :
    status === "Deprecated" || status === "Offboarded" ? "ink" :
    "neutral";
  return <Pill tone={tone as "neutral" | "indigo" | "sage" | "amber" | "warn" | "ink"}>{status}</Pill>;
}

// ─── Empty state ──────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon" aria-hidden>◇</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {cta && <div className="empty-cta">{cta}</div>}
      <style>{`
        .empty {
          padding: 56px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-ink-50);
          color: var(--color-ink-400);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 6px;
        }
        .empty h3 { font-size: 16px; }
        .empty p { color: var(--color-ink-500); font-size: 14px; max-width: 380px; line-height: 1.55; }
        .empty-cta { margin-top: 14px; }
      `}</style>
    </div>
  );
}
