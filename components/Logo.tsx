import Link from "next/link";

interface Props {
  href?: string;
  size?: "sm" | "md";
}

export function Logo({ href = "/", size = "md" }: Props) {
  const mark = size === "sm" ? 22 : 28;
  return (
    <Link href={href} aria-label="Assembly Industries" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
      <span
        aria-hidden
        style={{
          width: mark,
          height: mark,
          borderRadius: 6,
          background: "var(--color-ink-950)",
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: size === "sm" ? 12 : 14,
          letterSpacing: 0,
        }}
      >
        A
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: size === "sm" ? 14 : 16,
            letterSpacing: "-0.01em",
            color: "var(--color-ink-950)",
          }}
        >
          Assembly
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: size === "sm" ? 8 : 9.5,
            letterSpacing: "0.22em",
            color: "var(--color-ink-500)",
            marginTop: 2,
          }}
        >
          INDUSTRIES
        </span>
      </span>
    </Link>
  );
}
