// Code World logo: globe-of-code mark + English wordmark with the Arabic name beneath.
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
      dir="ltr"
      aria-label="Code World | عالم الكود"
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4 }}
    >
      <img
        src={inverse ? "/cw-globe-ondark.svg" : "/cw-globe.svg"}
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
            font: `800 ${size * 0.82}px Sora, Lexend, sans-serif`,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            color: inverse ? "#F3E2B6" : "#7A1630",
          }}
        >
          CODE WORLD
        </span>
        <span
          dir="rtl"
          style={{
            font: `600 ${size * 0.46}px "Readex Pro", Tajawal, sans-serif`,
            color: "#C9A35F",
            textAlign: "left",
            marginTop: 2,
          }}
        >
          عالم الكود
        </span>
        {sub && (
          <span
            dir="rtl"
            style={{
              font: `500 ${size * 0.34}px Tajawal, sans-serif`,
              color: inverse ? "#E9DCC8" : "#4A0E1E",
              textAlign: "left",
              marginTop: 3,
            }}
          >
            للتقنية والتصميم
          </span>
        )}
      </span>
    </span>
  );
}
