// ATHR logo: calligraphic «أثر» mark + bilingual name.
export default function Logo({
  size = 28,
  sub = false,
  inverse = false,
}: {
  size?: number;
  sub?: boolean;
  inverse?: boolean;
}) {
  return (
    <span
      dir="rtl"
      aria-label="أثر للتقنية والتصميم — ATHR"
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.35 }}
    >
      <img
        src={inverse ? "/athr-mark-ondark.svg" : "/athr-mark.svg"}
        alt=""
        width={52}
        height={52}
        style={{ height: size * 1.6, width: "auto" }}
      />
      <span
        style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}
      >
        <span
          style={{
            font: `800 ${size * 0.8}px Tajawal, sans-serif`,
            color: inverse ? "#F6F0E6" : "#4A0E1E",
          }}
        >
          أثر
        </span>
        <span
          dir="ltr"
          style={{
            font: `600 ${size * 0.38}px Lexend, sans-serif`,
            letterSpacing: "0.32em",
            color: "#8F6A2F",
            textAlign: "right",
          }}
        >
          ATHR
        </span>
        {sub && (
          <span
            style={{
              font: `500 ${size * 0.36}px Tajawal, sans-serif`,
              color: inverse ? "#E9DCC8" : "#4A0E1E",
              marginTop: 4,
            }}
          >
            للتقنية والتصميم
          </span>
        )}
      </span>
    </span>
  );
}
