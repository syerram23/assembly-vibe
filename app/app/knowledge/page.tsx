"use client";

import { useState } from "react";
import { PageHeader, Card, Pill } from "@/components/ui";
import { vectorIndexes, connectors } from "@/lib/mocks";

interface MockResult {
  id: string;
  source: string;
  sourceLabel: string;
  title: string;
  excerpt: string;
  highlightTerms: string[];
  score: number;
  auditId: string;
  url: string;
}

const MOCK_QUERY = "CFPB Reg E investigation timeline";

const MOCK_RESULTS: MockResult[] = [
  {
    id: "r1",
    source: "manual-upload",
    sourceLabel: "cfpb-reg-pack-v2.1",
    title: "CFPB §1005.11 — Procedures for Resolving Errors",
    excerpt: "The bank must complete its investigation of an alleged error and report back to the consumer within ten business days of receiving a notice of error. If the bank cannot complete the investigation within this period, it may take up to forty-five days, but only if the bank provisionally credits the consumer's account within ten business days.",
    highlightTerms: ["CFPB", "investigation", "ten business days", "forty-five"],
    score: 0.9412,
    auditId: "aud_8f3c2b91",
    url: "uploads/cfpb-reg-e-1005.11.pdf#page=4",
  },
  {
    id: "r2",
    source: "manual-upload",
    sourceLabel: "cfpb-reg-pack-v2.1",
    title: "Reg E quarterly testing playbook · v2.1",
    excerpt: "Sampling rule for the investigation timeline check: pull every disputed-transaction record where the resolution_at column is more than ten business days after the disputed_at column. Confirm provisional credit was applied no later than the tenth business day.",
    highlightTerms: ["investigation timeline", "ten business days", "provisional credit"],
    score: 0.8847,
    auditId: "aud_2a4f7d10",
    url: "uploads/reg-e-playbook-v2.1.pdf#page=9",
  },
  {
    id: "r3",
    source: "conn_ghd",
    sourceLabel: "guidewire · policy-docs",
    title: "Policy claim handling SOP — Reg E adjacent disputes",
    excerpt: "For transactions falling under both insurance dispute SOP and CFPB Reg E, the Reg E investigation deadline takes precedence. The claim adjuster must alert the compliance team within twenty-four hours.",
    highlightTerms: ["CFPB Reg E", "investigation", "twenty-four hours"],
    score: 0.8203,
    auditId: "aud_b71e2c44",
    url: "guidewire://policy/sop/reg-e-disputes",
  },
  {
    id: "r4",
    source: "conn_gws",
    sourceLabel: "google-workspace · compliance",
    title: "Q1 2026 compliance review — Reg E findings",
    excerpt: "Of the 1,247 disputes sampled, 14 exceeded the ten business day investigation window. All 14 had provisional credit posted on day 11 or later — see remediation tickets MK-4112 through MK-4125.",
    highlightTerms: ["investigation window", "ten business day", "provisional credit"],
    score: 0.7894,
    auditId: "aud_d3c891a2",
    url: "drive://compliance/2026-q1-review.gdoc",
  },
  {
    id: "r5",
    source: "manual-upload",
    sourceLabel: "cfpb-reg-pack-v2.1",
    title: "Reg E §1005.11(c) — extended investigation timeline",
    excerpt: "If the bank determines that the alleged error involves a new account, a point-of-sale transfer, or a foreign-initiated transfer, the bank may take up to ninety days to complete its investigation, provided it provides provisional credit within five days.",
    highlightTerms: ["investigation", "ninety days", "provisional credit", "five days"],
    score: 0.7621,
    auditId: "aud_f4e8c103",
    url: "uploads/cfpb-reg-e-1005.11.pdf#page=7",
  },
];

function highlight(text: string, terms: string[]): React.ReactNode[] {
  if (terms.length === 0) return [text];
  const pattern = new RegExp("(" + terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (terms.some((t) => t.toLowerCase() === part.toLowerCase())) {
      return <mark key={i}>{part}</mark>;
    }
    return <span key={i}>{part}</span>;
  });
}

function relativeTime(iso?: string): string {
  if (!iso) return "—";
  const now = new Date("2026-05-18T18:55:00Z").getTime();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const h = Math.floor(diff / 3_600_000);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const FAKE_VECTOR = "[ 0.0421, -0.1188,  0.0764,  0.2017, -0.0598,  0.1144, -0.0312,  0.0859, ... 1,024 dims ]";

export default function KnowledgePage() {
  const [query, setQuery] = useState(MOCK_QUERY);
  const [ran, setRan] = useState(true);
  const [traceOpen, setTraceOpen] = useState(false);
  const [chunkSize, setChunkSize] = useState(800);
  const [chunkOverlap, setChunkOverlap] = useState(120);
  const [similarity, setSimilarity] = useState(0.72);
  const [recencyBoost, setRecencyBoost] = useState(true);
  const [model, setModel] = useState("voyage-3-large");

  function runSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setRan(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Knowledge"
        title="Knowledge"
        description="What's vectorized for retrieval. Configure chunking and embeddings. Test searches end-to-end."
        actions={
          <>
            <button className="btn btn-secondary" type="button">+ Add knowledge source</button>
            <button className="btn btn-primary" type="button">+ New index</button>
          </>
        }
      />

      {/* SECTION 1 — Indexes */}
      <section className="sec">
        <div className="sec-h">
          <h2>Vector indexes</h2>
          <p>Live indexes Assembly maintains for retrieval-augmented apps and agents.</p>
        </div>
        <div className="idx-grid">
          {vectorIndexes.map((idx) => {
            const sources = idx.sources.map((s) => {
              const conn = connectors.find((c) => c.id === s);
              return conn ? conn.displayName : s;
            });
            return (
              <div key={idx.id} className="idx-card">
                <header className="idx-head">
                  <div className="idx-title">
                    <code className="idx-name">{idx.name}</code>
                    <Pill tone="sage">healthy</Pill>
                  </div>
                  <Pill tone="indigo">{idx.embeddingModel}</Pill>
                </header>

                <div className="idx-stats">
                  <div className="idx-s">
                    <span className="idx-s-l">Chunks</span>
                    <span className="idx-s-v">{idx.chunkCount.toLocaleString()}</span>
                  </div>
                  <div className="idx-s">
                    <span className="idx-s-l">Chunk size</span>
                    <span className="idx-s-v">{idx.chunkSize}</span>
                  </div>
                  <div className="idx-s">
                    <span className="idx-s-l">Reindexed</span>
                    <span className="idx-s-v">{relativeTime(idx.lastReindexAt)}</span>
                  </div>
                </div>

                <div className="idx-srcs">
                  <span className="idx-srcs-l">Sources</span>
                  <div className="idx-srcs-pills">
                    {sources.map((s, i) => (
                      <span key={i} className="src-pill">{s}</span>
                    ))}
                  </div>
                </div>

                <footer className="idx-foot">
                  <button className="btn btn-ghost" type="button">Edit config</button>
                  <button className="btn btn-secondary" type="button">Re-index now</button>
                </footer>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2 — Add a knowledge source */}
      <section className="sec">
        <Card title="Add a knowledge source" subtitle="Bring more documents, structured data, or web content into a vector index.">
          <div className="add-grid">
            {[
              { ic: "⌬", title: "Connector source",   desc: "Pull from an already-installed connector (Salesforce, Drive, Slack, etc.)." },
              { ic: "↑",  title: "Upload files",       desc: "Drop PDFs, Word docs, Markdown, or HTML. Up to 200MB per file." },
              { ic: "⌘",  title: "Paste text",         desc: "Paste raw text or markdown for one-off documents and snippets." },
              { ic: "⌕",  title: "URL crawl",          desc: "Crawl a documentation site with depth and inclusion rules." },
            ].map((a, i) => (
              <button key={i} type="button" className="add-card">
                <span className="add-ic">{a.ic}</span>
                <span className="add-text">
                  <strong>{a.title}</strong>
                  <small>{a.desc}</small>
                </span>
                <span className="add-cta">Open →</span>
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* SECTION 3 — Vector config */}
      <section className="sec">
        <Card title="Vector configuration" subtitle="How documents are chunked, embedded, and retrieved across this org.">
          <div className="cfg-grid">
            <div className="cfg-row">
              <label className="cfg-l">Embedding model</label>
              <select className="cfg-input" value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="voyage-3-large">voyage-3-large · 1024 dims</option>
                <option value="voyage-3">voyage-3 · 512 dims</option>
                <option value="text-embedding-3-large">openai · text-embedding-3-large · 3072 dims</option>
                <option value="bge-large-en">bge-large-en · 1024 dims</option>
              </select>
              <span className="cfg-hint">Embedding cost: ~$0.13 per million tokens · re-indexing 49,714 chunks: ~$3.42</span>
            </div>

            <div className="cfg-row">
              <label className="cfg-l">Chunk size · tokens</label>
              <div className="slider-wrap">
                <input type="range" min={200} max={2000} step={50} value={chunkSize} onChange={(e) => setChunkSize(Number(e.target.value))} />
                <span className="slider-v">{chunkSize}</span>
              </div>
              <span className="cfg-hint">Larger chunks preserve context but reduce precision. 800 is a good default.</span>
            </div>

            <div className="cfg-row">
              <label className="cfg-l">Chunk overlap · tokens</label>
              <div className="slider-wrap">
                <input type="range" min={0} max={400} step={20} value={chunkOverlap} onChange={(e) => setChunkOverlap(Number(e.target.value))} />
                <span className="slider-v">{chunkOverlap}</span>
              </div>
              <span className="cfg-hint">Overlap helps preserve context across chunk boundaries.</span>
            </div>

            <div className="cfg-row">
              <label className="cfg-l">Similarity threshold</label>
              <div className="slider-wrap">
                <input type="range" min={0.5} max={0.95} step={0.01} value={similarity} onChange={(e) => setSimilarity(Number(e.target.value))} />
                <span className="slider-v">{similarity.toFixed(2)}</span>
              </div>
              <span className="cfg-hint">Cosine similarity floor below which results are dropped.</span>
            </div>

            <div className="cfg-row">
              <label className="cfg-l">Recency boost</label>
              <label className="switch">
                <input type="checkbox" checked={recencyBoost} onChange={(e) => setRecencyBoost(e.target.checked)} />
                <span />
              </label>
              <span className="cfg-hint">Boost newer documents with a logarithmic decay over 90 days.</span>
            </div>
          </div>
        </Card>
      </section>

      {/* SECTION 4 — Search tester */}
      <section className="sec">
        <Card title="Search tester" subtitle="Run the retrieval pipeline end-to-end. Same path your apps and agents take.">
          <form className="qbar" onSubmit={runSearch}>
            <span className="qbar-ic">⌕</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question…"
              spellCheck={false}
            />
            <button type="submit" className="btn btn-primary">Run search</button>
          </form>

          {ran && (
            <>
              <div className="result-meta">
                <Pill tone="indigo">{MOCK_RESULTS.length} results</Pill>
                <Pill tone="neutral">cfpb-reg-pack-v2.1 + 2 indexes</Pill>
                <Pill tone="neutral">218ms</Pill>
                <Pill tone="sage">audit logged · aud_run_b9a31</Pill>
              </div>

              <ul className="results">
                {MOCK_RESULTS.map((r) => (
                  <li key={r.id} className="result">
                    <header className="result-h">
                      <span className="result-src">
                        <span className="src-pill">{r.sourceLabel}</span>
                        <code className="result-url">{r.url}</code>
                      </span>
                      <span className="result-score">
                        <span className="score-bar">
                          <span style={{ width: `${r.score * 100}%` }} />
                        </span>
                        <span className="score-v">{r.score.toFixed(4)}</span>
                      </span>
                    </header>
                    <h3 className="result-t">{r.title}</h3>
                    <p className="result-x">{highlight(r.excerpt, r.highlightTerms)}</p>
                    <footer className="result-f">
                      <code className="result-aud">{r.auditId}</code>
                      <span className="result-actions">
                        <button type="button" className="result-act">View chunk</button>
                        <button type="button" className="result-act">Open source</button>
                        <button type="button" className="result-act">Why this match</button>
                      </span>
                    </footer>
                  </li>
                ))}
              </ul>

              <details className="trace" open={traceOpen} onToggle={(e) => setTraceOpen((e.target as HTMLDetailsElement).open)}>
                <summary>Show search trace</summary>
                <div className="trace-body">
                  <div className="trace-step">
                    <span className="trace-n">1</span>
                    <div className="trace-detail">
                      <strong>Embedding</strong>
                      <p>Query encoded with <code>{model}</code></p>
                      <code className="trace-vec">{FAKE_VECTOR}</code>
                    </div>
                  </div>
                  <div className="trace-step">
                    <span className="trace-n">2</span>
                    <div className="trace-detail">
                      <strong>Vector search</strong>
                      <p>Top-50 candidates retrieved from 2 indexes · cosine ≥ {similarity.toFixed(2)} · 49,714 chunks scanned in 38ms.</p>
                    </div>
                  </div>
                  <div className="trace-step">
                    <span className="trace-n">3</span>
                    <div className="trace-detail">
                      <strong>Reranker</strong>
                      <p>Top-50 re-scored with <code>cohere-rerank-v3</code> · 124ms · recency boost {recencyBoost ? "on" : "off"}.</p>
                    </div>
                  </div>
                  <div className="trace-step">
                    <span className="trace-n">4</span>
                    <div className="trace-detail">
                      <strong>Governance pass</strong>
                      <p>PII redaction policy applied · 0 chunks filtered · audit event <code>aud_run_b9a31</code> emitted.</p>
                    </div>
                  </div>
                  <div className="trace-step">
                    <span className="trace-n">5</span>
                    <div className="trace-detail">
                      <strong>Final top-5</strong>
                      <p>Returned to caller · 218ms wall time end-to-end.</p>
                    </div>
                  </div>
                </div>
              </details>
            </>
          )}
        </Card>
      </section>

      <style>{`
        .sec { margin-bottom: 36px; }
        .sec-h { margin-bottom: 16px; }
        .sec-h h2 { font-size: 20px; letter-spacing: -0.018em; margin-bottom: 4px; }
        .sec-h p { color: var(--color-ink-500); font-size: 13.5px; }

        /* Indexes */
        .idx-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 16px;
        }
        .idx-card {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: border-color 0.15s, box-shadow 0.18s, transform 0.18s;
        }
        .idx-card:hover {
          border-color: var(--color-indigo-200);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -16px rgba(15,17,42,0.18);
        }
        .idx-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .idx-title { display: inline-flex; align-items: center; gap: 10px; }
        .idx-name { font-family: var(--font-mono); font-size: 14px; font-weight: 600; color: var(--color-ink-950); background: transparent; padding: 0; }

        .idx-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding: 12px 14px;
          background: var(--color-ink-50);
          border-radius: var(--radius-md);
        }
        .idx-s { display: flex; flex-direction: column; gap: 2px; }
        .idx-s-l {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .idx-s-v {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: var(--color-ink-950);
          letter-spacing: -0.005em;
        }

        .idx-srcs { display: flex; flex-direction: column; gap: 6px; }
        .idx-srcs-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .idx-srcs-pills { display: inline-flex; gap: 6px; flex-wrap: wrap; }
        .src-pill {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 3px 9px;
          border-radius: 999px;
          background: var(--color-ink-100);
          color: var(--color-ink-700);
        }

        .idx-foot {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px dashed var(--color-ink-100);
        }

        /* Add source */
        .add-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (max-width: 720px) { .add-grid { grid-template-columns: 1fr; } }
        .add-card {
          display: grid;
          grid-template-columns: 36px 1fr auto;
          gap: 12px;
          padding: 12px 14px;
          background: var(--color-ink-50);
          border: 1px solid var(--color-ink-100);
          border-radius: var(--radius-md);
          text-align: left;
          align-items: center;
          transition: border-color 0.15s, background 0.15s;
        }
        .add-card:hover {
          border-color: var(--color-indigo-400);
          background: var(--color-indigo-50);
        }
        .add-ic {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: #fff;
          color: var(--color-indigo-600);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 16px;
          border: 1px solid var(--color-ink-100);
        }
        .add-text { display: flex; flex-direction: column; gap: 2px; }
        .add-text strong { font-family: var(--font-display); font-size: 14px; color: var(--color-ink-950); font-weight: 600; }
        .add-text small { font-size: 12px; color: var(--color-ink-500); line-height: 1.4; }
        .add-cta {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--color-indigo-700);
          padding: 4px 10px;
          border-radius: 999px;
          background: transparent;
          transition: background 0.15s;
        }
        .add-card:hover .add-cta { background: #fff; }

        /* Config */
        .cfg-grid { display: flex; flex-direction: column; gap: 0; }
        .cfg-row {
          display: grid;
          grid-template-columns: 200px 1fr 1fr;
          gap: 16px;
          align-items: center;
          padding: 14px 0;
          border-top: 1px solid var(--color-ink-100);
        }
        @media (max-width: 760px) { .cfg-row { grid-template-columns: 1fr; align-items: flex-start; } }
        .cfg-row:first-child { border-top: 0; padding-top: 0; }
        .cfg-l {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .cfg-input {
          font: inherit;
          font-size: 13px;
          padding: 8px 12px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 8px;
          outline: 0;
          font-family: var(--font-mono);
        }
        .cfg-input:focus { border-color: var(--color-indigo-400); box-shadow: 0 0 0 4px rgba(79,70,229,0.08); }
        .cfg-hint { font-size: 12px; color: var(--color-ink-500); line-height: 1.5; }

        .slider-wrap {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .slider-wrap input[type="range"] {
          flex: 1;
          accent-color: var(--color-indigo-600);
        }
        .slider-v {
          font-family: var(--font-mono);
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-ink-950);
          min-width: 48px;
          padding: 4px 10px;
          background: var(--color-ink-50);
          border-radius: 4px;
          text-align: center;
        }

        .switch {
          position: relative;
          width: 36px;
          height: 20px;
          background: var(--color-ink-200);
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.15s;
          display: inline-block;
        }
        .switch input { opacity: 0; position: absolute; inset: 0; cursor: pointer; }
        .switch span {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.15s;
        }
        .switch input:checked ~ span { transform: translateX(16px); }
        .switch:has(input:checked) { background: var(--color-indigo-600); }

        /* Search tester */
        .qbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 8px 8px 18px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 999px;
          margin-bottom: 18px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .qbar:focus-within { border-color: var(--color-indigo-400); box-shadow: 0 0 0 4px rgba(79,70,229,0.08); }
        .qbar-ic { color: var(--color-ink-400); font-size: 16px; }
        .qbar input {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 14.5px;
          color: var(--color-ink-950);
          font-family: var(--font-body);
        }
        .qbar input::placeholder { color: var(--color-ink-400); }

        .result-meta {
          display: inline-flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .results { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .result {
          padding: 16px 18px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-md);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .result:hover { border-color: var(--color-indigo-200); }
        .result-h { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 8px; flex-wrap: wrap; align-items: center; }
        .result-src { display: inline-flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .result-url {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          background: transparent;
          padding: 0;
        }
        .result-score { display: inline-flex; align-items: center; gap: 8px; }
        .score-bar {
          width: 100px;
          height: 5px;
          background: var(--color-ink-100);
          border-radius: 999px;
          overflow: hidden;
          display: inline-block;
        }
        .score-bar span { display: block; height: 100%; background: var(--color-indigo-600); }
        .score-v {
          font-family: var(--font-mono);
          font-size: 11.5px;
          font-weight: 600;
          color: var(--color-ink-700);
        }
        .result-t {
          font-size: 15px;
          font-weight: 600;
          color: var(--color-ink-950);
          letter-spacing: -0.005em;
          margin-bottom: 6px;
          font-family: var(--font-display);
        }
        .result-x {
          font-size: 13.5px;
          color: var(--color-ink-700);
          line-height: 1.55;
          margin-bottom: 10px;
        }
        .result-x mark {
          background: var(--color-indigo-100);
          color: var(--color-indigo-700);
          padding: 1px 4px;
          border-radius: 3px;
          font-weight: 600;
        }
        .result-f {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 8px;
          border-top: 1px dashed var(--color-ink-100);
        }
        .result-aud {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          background: var(--color-ink-50);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .result-actions { display: inline-flex; gap: 8px; flex-wrap: wrap; }
        .result-act {
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--color-ink-700);
          padding: 4px 10px;
          border-radius: 999px;
          background: var(--color-ink-50);
          transition: background 0.15s, color 0.15s;
        }
        .result-act:hover { background: var(--color-indigo-50); color: var(--color-indigo-700); }

        .trace {
          margin-top: 20px;
          border: 1px dashed var(--color-ink-200);
          border-radius: var(--radius-md);
          padding: 0 16px;
        }
        .trace summary {
          padding: 12px 0;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          list-style: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .trace summary::before {
          content: "▸";
          font-size: 11px;
          transition: transform 0.15s;
        }
        .trace[open] summary::before { transform: rotate(90deg); }
        .trace[open] summary { color: var(--color-ink-950); border-bottom: 1px dashed var(--color-ink-100); }

        .trace-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px 0;
        }
        .trace-step {
          display: grid;
          grid-template-columns: 26px 1fr;
          gap: 12px;
        }
        .trace-n {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--color-indigo-100);
          color: var(--color-indigo-700);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 11px;
        }
        .trace-detail strong { font-family: var(--font-display); font-size: 13px; color: var(--color-ink-950); }
        .trace-detail p { color: var(--color-ink-500); font-size: 12.5px; margin-top: 2px; line-height: 1.5; }
        .trace-detail code {
          font-size: 11px;
          background: var(--color-ink-50);
          padding: 1px 6px;
          border-radius: 3px;
        }
        .trace-vec {
          display: block;
          margin-top: 6px;
          padding: 10px 12px;
          background: var(--color-ink-950);
          color: var(--color-indigo-300);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.02em;
          overflow-x: auto;
        }
      `}</style>
    </>
  );
}
