import Link from "next/link";
import { Logo } from "./Logo";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#agents",       label: "Agents" },
  { href: "/#platform",     label: "Platform" },
  { href: "/#partners",     label: "Partners" },
];

export function MarketingNav() {
  return (
    <header className="mnav">
      <div className="wrap mnav-inner">
        <Logo href="/" size="md" />
        <nav>
          <ul>
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
            <li>
              <Link href="/app" className="btn btn-ghost mnav-signin">Sign in</Link>
            </li>
            <li>
              <Link href="/#cta" className="btn btn-primary">
                Get a data-readiness assessment <span className="arr">→</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <style>{`
        .mnav {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: saturate(140%) blur(12px);
          background: rgba(255, 255, 255, 0.82);
          border-bottom: 1px solid var(--color-ink-100);
        }
        .mnav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .mnav nav ul {
          display: flex;
          align-items: center;
          gap: 26px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .mnav nav a:not(.btn) {
          color: var(--color-ink-700);
          font-size: 14px;
          font-weight: 500;
          transition: color 0.15s;
        }
        .mnav nav a:not(.btn):hover {
          color: var(--color-indigo-600);
        }
        .mnav .btn { font-size: 14px; padding: 10px 16px; }
        .mnav-signin { color: var(--color-ink-700) !important; }
        @media (max-width: 920px) {
          .mnav nav ul li:not(:last-child) { display: none; }
        }
      `}</style>
    </header>
  );
}
