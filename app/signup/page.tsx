import Link from "next/link";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";

/* ────────────────────────────────────────────────────────────────────────────
 * Sign-up — centered card, marketing chrome. Static/visual.
 * Submit → /onboarding/about (via Link, no real auth).
 * ──────────────────────────────────────────────────────────────────────────── */

export default function SignupPage() {
  return (
    <>
      <MarketingNav />

      <main className="signup-wrap">
        <section className="signup-card">
          <span
            aria-hidden
            className="signup-mark"
          >A</span>
          <h1>Create your Assembly account</h1>
          <p className="signup-sub">
            Get the platform, governed data plane, and the agent library — out of the box.
          </p>

          <form className="signup-form" action="/onboarding/about" method="get">
            <label className="field">
              <span>Work email</span>
              <input type="email" name="email" placeholder="you@company.com" required defaultValue="" />
            </label>

            <Link href="/onboarding/about" className="btn btn-primary signup-cta">
              Continue with email <span className="arr">→</span>
            </Link>

            <div className="divider"><span>or</span></div>

            <Link href="/onboarding/about" className="sso-btn">
              <span className="sso-ic" style={{ background: "var(--color-ink-950)", color: "#fff" }}>SSO</span>
              <span>Continue with SSO · SAML / OIDC</span>
            </Link>
            <Link href="/onboarding/about" className="sso-btn">
              <span className="sso-ic" style={{ background: "#fff", color: "#4285F4", border: "1px solid var(--color-ink-200)", fontWeight: 700 }}>G</span>
              <span>Continue with Google</span>
            </Link>
          </form>

          <p className="signup-foot">
            Already have an account? <Link href="/app">Sign in →</Link>
          </p>
        </section>

        <p className="signup-legal">
          By creating an account you agree to Assembly's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </main>

      <MarketingFooter />

      <style>{`
        .signup-wrap {
          min-height: calc(100vh - 72px - 240px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          background: linear-gradient(180deg, var(--color-lavender-50) 0%, #fff 60%);
        }
        .signup-card {
          width: 100%;
          max-width: 460px;
          padding: 40px 36px 32px;
          background: #fff;
          border: 1px solid var(--color-ink-200);
          border-radius: 20px;
          box-shadow: 0 1px 0 rgba(15, 17, 42, 0.04), 0 32px 64px -32px rgba(15, 17, 42, 0.18);
          text-align: center;
        }
        .signup-mark {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--color-ink-950);
          color: #fff;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }
        .signup-card h1 {
          font-size: 24px;
          margin-bottom: 8px;
          letter-spacing: -0.018em;
          line-height: 1.2;
        }
        .signup-sub {
          color: var(--color-ink-500);
          font-size: 14px;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .signup-form { display: flex; flex-direction: column; gap: 12px; }
        .field { display: flex; flex-direction: column; gap: 6px; text-align: left; }
        .field span {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          font-weight: 600;
        }
        .field input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 1px solid var(--color-ink-200);
          border-radius: 10px;
          font-family: var(--font-body);
        }
        .field input:focus {
          outline: 2px solid var(--color-indigo-200);
          border-color: var(--color-indigo-600);
        }
        .signup-cta {
          justify-content: center;
          padding: 12px 16px;
          font-size: 15px;
          width: 100%;
        }
        .divider {
          position: relative;
          margin: 14px 0;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-400);
        }
        .divider::before, .divider::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: var(--color-ink-100);
        }
        .divider::before { left: 0; }
        .divider::after  { right: 0; }
        .sso-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border: 1px solid var(--color-ink-200);
          border-radius: 10px;
          font-size: 14px;
          color: var(--color-ink-950);
          background: #fff;
          font-weight: 500;
          transition: background 0.15s, border-color 0.15s;
        }
        .sso-btn:hover { background: var(--color-ink-50); border-color: var(--color-ink-300); }
        .sso-ic {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0;
        }
        .signup-foot {
          margin-top: 22px;
          font-size: 13.5px;
          color: var(--color-ink-500);
        }
        .signup-foot a { color: var(--color-indigo-700); font-weight: 500; }
        .signup-legal {
          margin-top: 24px;
          font-size: 12px;
          color: var(--color-ink-400);
          max-width: 380px;
          text-align: center;
          line-height: 1.6;
        }
        .signup-legal a { color: var(--color-ink-500); text-decoration: underline; }
        .signup-legal a:hover { color: var(--color-ink-950); }
      `}</style>
    </>
  );
}
