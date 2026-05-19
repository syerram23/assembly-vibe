import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main className="onb-wrap">
        {children}
      </main>
      <MarketingFooter />

      <style>{`
        .onb-wrap {
          min-height: calc(100vh - 72px - 240px);
          padding: 56px 24px 96px;
          background: linear-gradient(180deg, var(--color-lavender-50) 0%, #fff 50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Shared onboarding chrome — pulled into the layout so each step
           page only ships its content. */
        .onb-shell {
          width: 100%;
          max-width: 720px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .onb-head { display: flex; flex-direction: column; gap: 18px; align-items: center; }
        .onb-eyebrow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .onb-eyebrow .dot {
          display: inline-block;
          width: 6px; height: 6px;
          background: var(--color-indigo-600);
          border-radius: 50%;
        }
        .onb-dots { display: inline-flex; gap: 8px; align-items: center; }
        .onb-dot {
          width: 32px; height: 4px;
          border-radius: 999px;
          background: var(--color-ink-200);
        }
        .onb-dot.on { background: var(--color-indigo-600); }
        .onb-dot.done { background: var(--color-indigo-300); }

        .onb-title {
          font-size: clamp(26px, 3vw, 32px);
          letter-spacing: -0.022em;
          line-height: 1.15;
          text-align: center;
        }
        .onb-sub {
          color: var(--color-ink-500);
          font-size: 15px;
          line-height: 1.55;
          text-align: center;
          max-width: 540px;
        }

        .onb-body {
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 24px 56px -24px rgba(15, 17, 42, 0.12);
        }
        @media (max-width: 640px) { .onb-body { padding: 22px; } }

        .onb-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .onb-foot .onb-back {
          color: var(--color-ink-500);
          font-size: 13.5px;
        }
        .onb-foot .onb-back:hover { color: var(--color-ink-950); }

        /* Field primitives */
        .onb-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .onb-field > span {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .onb-field input, .onb-field select {
          width: 100%;
          padding: 12px 14px;
          font-size: 14.5px;
          border: 1px solid var(--color-ink-200);
          border-radius: 10px;
          background: #fff;
          font-family: var(--font-body);
        }
        .onb-field input:focus, .onb-field select:focus {
          outline: 2px solid var(--color-indigo-200);
          border-color: var(--color-indigo-600);
        }
      `}</style>
    </>
  );
}
