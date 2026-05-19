import Link from "next/link";
import { Logo } from "./Logo";

export function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap foot">
        <div className="foot-l">
          <Logo href="/" size="sm" />
          <span className="foot-lbl">© {year} · all rights reserved</span>
        </div>
        <ul>
          <li><Link href="/#how-it-works">How it works</Link></li>
          <li><Link href="/#agents">Agents</Link></li>
          <li><Link href="/#platform">Platform</Link></li>
          <li><Link href="/#partners">Partners</Link></li>
          <li><Link href="/app">Sign in</Link></li>
          <li><a href="mailto:founders@assembly-industries.com">Contact</a></li>
        </ul>
      </div>
      <style>{`
        footer {
          padding: 48px 0;
          border-top: 1px solid var(--color-ink-100);
          background: #fff;
        }
        .foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .foot-l {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .foot-lbl {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-ink-500);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .foot ul {
          display: flex;
          list-style: none;
          gap: 22px;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
        }
        .foot a {
          color: var(--color-ink-500);
          font-size: 13.5px;
          transition: color 0.15s;
        }
        .foot a:hover {
          color: var(--color-ink-950);
        }
      `}</style>
    </footer>
  );
}
