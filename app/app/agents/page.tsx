"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Pill } from "@/components/ui";
import { agents } from "@/lib/mocks";
import type { AgentStatus } from "@/lib/types";

type Bucket = "All" | "Configured" | "Available" | "Coming soon";

function statusTone(status: AgentStatus): "sage" | "indigo" | "neutral" | "amber" {
  if (status === "Configured") return "sage";
  if (status === "Available") return "indigo";
  if (status === "Coming soon") return "amber";
  return "neutral";
}

function bucketFor(status: AgentStatus): Bucket {
  if (status === "Configured") return "Configured";
  if (status === "Available") return "Available";
  if (status === "Coming soon") return "Coming soon";
  return "Available";
}

export default function AgentsLibraryPage() {
  const [bucket, setBucket] = useState<Bucket>("All");
  const [query, setQuery] = useState("");

  const buckets: Bucket[] = ["All", "Configured", "Available", "Coming soon"];

  const counts = useMemo(() => {
    const c: Record<Bucket, number> = { All: agents.length, Configured: 0, Available: 0, "Coming soon": 0 };
    for (const a of agents) {
      const b = bucketFor(a.status);
      c[b] += 1;
    }
    return c;
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter((a) => {
      if (bucket !== "All" && bucketFor(a.status) !== bucket) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.examples.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q)
      );
    });
  }, [bucket, query]);

  return (
    <>
      <PageHeader
        eyebrow="Agents · library"
        title="Agent library"
        description="Pre-built, production-ready agents. Point them at your governed data, set your rules, switch them on. Every agent inherits the platform's audit, identity, and governance."
      />

      <div className="filter-bar">
        <div className="search">
          <span className="search-ic" aria-hidden>⌕</span>
          <input
            type="text"
            placeholder="Search agents by name, capability, or example…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="chips" role="tablist">
          {buckets.map((b) => (
            <button
              key={b}
              role="tab"
              type="button"
              aria-selected={bucket === b}
              className={"chip " + (bucket === b ? "on" : "")}
              onClick={() => setBucket(b)}
            >
              <span>{b}</span>
              <span className="chip-count">{counts[b]}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="agent-grid">
        {rows.map((a) => (
          <Link key={a.id} href={`/app/agents/${a.id}`} className="agent-card lift">
            <header>
              <span className="agent-code">{a.code}</span>
              <Pill tone={statusTone(a.status)}>{a.status}</Pill>
            </header>
            <h4>{a.name}</h4>
            <p>{a.description}</p>
            <div className="ex">{a.examples}</div>
            <footer>
              <span className="cfg">
                {a.status === "Configured" ? "Open configuration" : a.status === "Available" ? "Configure" : "Preview"}
                <span className="arr">→</span>
              </span>
            </footer>
          </Link>
        ))}
      </section>

      <section className="callout">
        <div className="cl-l">
          <span className="eyebrow"><span className="dot" />Composability</span>
          <h3>Configuration changes; capabilities don&apos;t.</h3>
          <p>
            The six agents above aren&apos;t feature flags — they&apos;re the irreducible building
            blocks. An app that lookups comp bands and an app that runs a Reg E quarterly are
            built from the same primitives. Reach for these before you reach for anything custom.
            When you do need custom, your work composes with everything that ships in the box.
          </p>
        </div>
        <div className="cl-r">
          {agents.map((a) => (
            <span key={a.id} className="bk">
              <span className="bk-code">{a.code}</span>
              <span className="bk-name">{a.name}</span>
            </span>
          ))}
        </div>
      </section>

      <style>{`
        .filter-bar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          align-items: center;
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
        .search:focus-within {
          border-color: var(--color-indigo-400);
          box-shadow: 0 0 0 4px rgba(79,70,229,0.08);
        }
        .search-ic { color: var(--color-ink-400); font-size: 14px; }
        .search input {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          font-family: var(--font-body);
          font-size: 13.5px;
          color: var(--color-ink-950);
        }
        .search input::placeholder { color: var(--color-ink-400); }

        .chips {
          display: inline-flex;
          gap: 6px;
          padding: 4px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: 999px;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--color-ink-500);
          transition: background 0.15s, color 0.15s, box-shadow 0.15s;
        }
        .chip:hover { color: var(--color-ink-950); }
        .chip.on {
          background: #fff;
          color: var(--color-ink-950);
          box-shadow: 0 1px 0 rgba(15,17,42,0.06), 0 6px 14px -8px rgba(15,17,42,0.18);
        }
        .chip-count {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--color-ink-100);
          color: var(--color-ink-500);
        }
        .chip.on .chip-count { background: var(--color-indigo-50); color: var(--color-indigo-700); }

        .agent-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 32px;
        }
        @media (max-width: 1100px) { .agent-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 720px)  { .agent-grid { grid-template-columns: 1fr; } }

        .agent-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 22px 22px 18px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-top: 3px solid var(--color-indigo-600);
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: inherit;
        }
        .agent-card header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .agent-code {
          width: 36px; height: 36px;
          background: var(--color-indigo-100);
          color: var(--color-indigo-700);
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .agent-card h4 {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          letter-spacing: -0.012em;
          color: var(--color-ink-950);
          line-height: 1.2;
        }
        .agent-card p {
          color: var(--color-ink-700);
          font-size: 13.5px;
          line-height: 1.55;
          margin: 0;
        }
        .agent-card .ex {
          margin-top: 4px;
          padding-top: 12px;
          border-top: 1px dashed var(--color-ink-200);
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-ink-500);
          line-height: 1.55;
        }
        .agent-card footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
        }
        .agent-card .cfg {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--color-indigo-700);
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .agent-card .arr { transition: transform .18s; }
        .agent-card:hover .arr { transform: translateX(3px); }

        .callout {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 28px;
          padding: 32px;
          background: var(--color-indigo-50);
          border: 1px solid var(--color-indigo-200);
          border-radius: var(--radius-lg);
          position: relative;
        }
        .callout::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--color-indigo-600);
          border-top-left-radius: var(--radius-lg);
          border-bottom-left-radius: var(--radius-lg);
        }
        @media (max-width: 900px) { .callout { grid-template-columns: 1fr; } }
        .cl-l h3 {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 22px;
          letter-spacing: -0.018em;
          color: var(--color-ink-950);
          margin: 8px 0 10px;
          line-height: 1.2;
        }
        .cl-l p {
          color: var(--color-ink-700);
          font-size: 14px;
          line-height: 1.6;
        }
        .cl-r {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-content: flex-start;
        }
        .bk {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 6px;
          background: #fff;
          border: 1px solid var(--color-indigo-200);
          border-radius: 8px;
        }
        .bk-code {
          width: 26px; height: 26px;
          background: var(--color-indigo-600);
          color: #fff;
          border-radius: 5px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .bk-name {
          font-size: 12.5px;
          color: var(--color-ink-950);
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
