// Code World logo: globe-of-code mark, a gold divider, then CODE over WORLD
// (same width) with the Arabic name after a fading gold rule.
// Logo colors are fixed by the brand guide (also printed on invoices).
const MAROON = "#7A1630"; // ds-allow-hardcode
const GOLD = "#C9A35F"; // ds-allow-hardcode
const GOLD_LIGHT = "#F3E2B6"; // ds-allow-hardcode
const GOLD_FADE = "rgba(201,163,95,.15)"; // ds-allow-hardcode
const WORLD_SCALE = 0.756; // Sora 800: makes WORLD as wide as CODE

export default function Logo({ size = 28, inverse = false }: { size?: number; inverse?: boolean }) {
  const en = size * 1.05;
  const ink = inverse ? GOLD_LIGHT : MAROON;
  const h = en * 2.55; // height of the text block, matched by the mark and divider
  return (
    <span dir="ltr" aria-label="Code World | عالم الكود" style={{ display: "inline-flex", alignItems: "center", gap: en * 0.36, lineHeight: 0.92 }}>
      <img src={inverse ? "/cw-globe-ondark.svg" : "/cw-globe.svg"} alt="" width={h * 0.94} height={h * 0.94} />
      <span style={{ width: 2, height: h, borderRadius: 2, background: GOLD }} />
      <span style={{ display: "inline-grid", justifyItems: "start", font: `800 ${en}px Sora, Lexend, sans-serif`, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>
        <span style={{ color: ink }}>CODE</span>
        <span style={{ color: GOLD, fontSize: en * WORLD_SCALE }}>WORLD</span>
        <span style={{ justifySelf: "stretch", display: "flex", alignItems: "center", gap: en * 0.22, marginTop: en * 0.2 }}>
          <span style={{ flex: 1, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${GOLD_FADE}, ${GOLD})` }} />
          <span dir="rtl" style={{ font: `600 ${en * 0.4}px "Readex Pro", Tajawal, sans-serif`, color: ink, lineHeight: 1.2 }}>عالم الكود</span>
        </span>
      </span>
    </span>
  );
}
