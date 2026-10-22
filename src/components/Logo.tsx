// ATHR logo: calligraphic «أثر» mark + bilingual name.
export default function Logo({ size = 28, sub = false }: { size?: number; sub?: boolean }) {
  return (
    <span dir="rtl" aria-label="أثر للتقنية والتصميم — ATHR" style={{ display: "inline-flex", alignItems: "center", gap: size * 0.35 }}>
      <img src="/athr-mark.svg" alt="" style={{ height: size * 1.6, width: "auto" }} />
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
        <span style={{ font: `800 ${size * 0.8}px Tajawal, sans-serif`, color: "#4A0E1E" }}>أثر</span>
        <span dir="ltr" style={{ font: `600 ${size * 0.38}px Lexend, sans-serif`, letterSpacing: "0.32em", color: "#8F6A2F", textAlign: "right" }}>ATHR</span>
        {sub && <span style={{ font: `500 ${size * 0.36}px Tajawal, sans-serif`, color: "#4A0E1E", opacity: .7, marginTop: 4 }}>للتقنية والتصميم</span>}
      </span>
    </span>
  );
}
