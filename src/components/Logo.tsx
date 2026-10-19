// Fikra wordmark: "fıkra" in Lexend with an AI sparkle as the i-dot.
export default function Logo({ size = 28, color = "#EBDDC6" }: { size?: number; color?: string }) {
  return (
    <span dir="ltr" aria-label="Fikra" style={{
      font: `700 ${size}px Lexend, sans-serif`, color, lineHeight: 1, letterSpacing: "-0.02em",
      fontVariantLigatures: "none", display: "inline-flex", alignItems: "flex-end",
    }}>
      <span>f</span>
      <span style={{ position: "relative", marginLeft: "0.04em" }}>
        ı
        <svg viewBox="0 0 40 40" aria-hidden style={{ position: "absolute", left: "50%", top: "-0.02em", transform: "translateX(-50%)", width: "0.34em" }}>
          <path d="M20 0C21.5 13 27 18.5 40 20C27 21.5 21.5 27 20 40C18.5 27 13 21.5 0 20C13 18.5 18.5 13 20 0Z" fill="currentColor" />
        </svg>
      </span>
      <span>kra</span>
    </span>
  );
}
