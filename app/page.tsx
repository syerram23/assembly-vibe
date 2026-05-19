import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import Link from "next/link";

/*
 * Marketing landing page — placeholder while the full Part A build (all 10
 * sections per spec) is composed in a background agent. Will be replaced
 * with the real long-form landing in the next file write.
 */

export default function LandingPage() {
  return (
    <>
      <MarketingNav />
      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow"><span className="dot" />Enterprise & SMB AI enablement</span>
              <h1>
                Vibe-code your business &mdash;<br/>
                <em>safely, on your own data</em>.
              </h1>
              <p className="lede">
                Your team can build AI apps just by describing what they need. Assembly makes your data ready for that &mdash; governed, permissioned, and safe &mdash; and hands you a library of pre-built agents to start from. Bring your own builder, hire a certified one, or have us deliver it.
              </p>
              <div className="cta-row">
                <Link href="/app" className="btn btn-primary">
                  Get a data-readiness assessment <span className="arr">→</span>
                </Link>
                <Link href="#how-it-works" className="btn btn-secondary">
                  See how it works
                </Link>
              </div>
              <div className="meta-row">
                <span><b>Anyone on the team</b> &middot; designer, finance, ops</span>
                <span><b>Production-grade</b> &middot; audit, HITL, 99.9% SLA</span>
                <span><b>On Temporal</b> &middot; single-tenant &middot; SOC 2</span>
              </div>
            </div>
            <aside className="hero-art">
              <div className="art-tag">
                <span className="art-tag-dot" />
                Live builder &middot; running on Assembly
              </div>
              <div className="placeholder-card">
                <div className="pc-chrome">
                  <span className="pc-dot r" />
                  <span className="pc-dot y" />
                  <span className="pc-dot g" />
                  <span className="pc-title">
                    <span className="pc-dim">assembly.io</span>
                    <span className="pc-sep">/</span>
                    <span className="pc-bold">builder</span>
                  </span>
                </div>
                <div className="pc-body">
                  <div className="pc-msg">
                    <span className="pc-tag">customer</span>
                    <span>build me a slash command that answers comp-band questions in slack</span>
                  </div>
                  <div className="pc-msg pc-msg-assembly">
                    <span className="pc-tag indigo">assembly</span>
                    <span>scoping… on your governed workday + greenhouse data · agents · pii_redact · slack surface</span>
                  </div>
                  <div className="pc-progress">
                    <span className="pc-progress-bar" style={{ width: "84%" }} />
                  </div>
                  <div className="pc-foot">
                    11 days · vibe-coded by maria@ · production · audit ✓
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="placeholder-note">
          <div className="wrap">
            <p>
              Sections 2&ndash;10 of the marketing landing are being composed in parallel and will land in the next deploy. Sign in to the application: <Link href="/app">→ /app</Link>
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />

      <style>{`
        .hero {
          padding: 80px 0 96px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(900px 540px at 85% -10%, var(--color-indigo-50) 0%, transparent 60%),
            radial-gradient(700px 420px at -5% 30%, var(--color-lavender-50) 0%, transparent 55%);
        }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
          gap: 56px;
          align-items: start;
          padding-top: 16px;
        }
        @media (max-width: 1080px) { .hero-grid { grid-template-columns: 1fr; gap: 48px; } }

        .hero h1 { margin-top: 22px; }
        .hero h1 em {
          font-style: normal;
          color: var(--color-indigo-600);
        }
        .hero .lede {
          margin-top: 24px;
          font-size: clamp(16.5px, 1.3vw, 19px);
          color: var(--color-ink-500);
          max-width: 580px;
          line-height: 1.55;
        }
        .cta-row { margin-top: 32px; display: flex; gap: 12px; flex-wrap: wrap; }
        .meta-row {
          margin-top: 40px;
          display: flex;
          gap: 26px;
          flex-wrap: wrap;
          color: var(--color-ink-500);
          font-size: 12.5px;
          font-family: var(--font-mono);
        }
        .meta-row b { color: var(--color-ink-950); font-weight: 600; font-family: var(--font-display); font-size: 13px; }

        .hero-art { display: flex; flex-direction: column; gap: 10px; }
        .art-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
        }
        .art-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-sage-fg);
          box-shadow: 0 0 0 3px rgba(47, 107, 64, 0.15);
        }

        .placeholder-card {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }
        .pc-chrome {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: linear-gradient(180deg, #fafbfd 0%, #f4f5f9 100%);
          border-bottom: 1px solid var(--color-ink-200);
        }
        .pc-dot { width: 10px; height: 10px; border-radius: 50%; }
        .pc-dot.r { background: #ff5f57; }
        .pc-dot.y { background: #febc2e; }
        .pc-dot.g { background: #28c840; }
        .pc-title { margin-left: 10px; font-family: var(--font-mono); font-size: 12px; color: var(--color-ink-500); }
        .pc-dim { color: var(--color-ink-400); }
        .pc-sep { color: var(--color-ink-300); margin: 0 4px; }
        .pc-bold { color: var(--color-ink-950); font-weight: 600; }
        .pc-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; }
        .pc-msg {
          display: grid;
          grid-template-columns: 86px 1fr;
          gap: 12px;
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--color-ink-700);
          line-height: 1.5;
        }
        .pc-msg-assembly { color: var(--color-ink-950); }
        .pc-tag {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          padding-top: 3px;
        }
        .pc-tag.indigo { color: var(--color-indigo-700); }
        .pc-progress {
          height: 4px;
          background: var(--color-ink-100);
          border-radius: 2px;
          overflow: hidden;
        }
        .pc-progress-bar {
          display: block;
          height: 100%;
          background: var(--color-indigo-600);
          border-radius: 2px;
        }
        .pc-foot {
          padding-top: 6px;
          border-top: 1px dashed var(--color-ink-200);
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.04em;
        }

        .placeholder-note {
          padding: 32px 0;
          border-top: 1px solid var(--color-ink-100);
          background: var(--color-ink-50);
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-500);
          letter-spacing: 0.02em;
        }
        .placeholder-note a { color: var(--color-indigo-600); }
      `}</style>
    </>
  );
}
