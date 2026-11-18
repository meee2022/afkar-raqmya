// Code World logo: the globe-of-code mark stands in for the O of CODE,
// with the Arabic name beneath behind a gold rule.
export default function Logo({
  size = 28,
  inverse = false,
}: {
  size?: number;
  inverse?: boolean;
}) {
  const en = size * 1.05;
  return (
    <span
      dir="ltr"
      aria-label="Code World | عالم الكود"
      style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1 }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          font: `800 ${en}px Sora, Lexend, sans-serif`,
          letterSpacing: "-0.015em",
          whiteSpace: "nowrap",
          color: inverse ? "#F3E2B6" : "#7A1630",
        }}
      >
        C
        <img
          src={inverse ? "/cw-globe-ondark.svg" : "/cw-globe.svg"}
          alt=""
          width={en * 0.86}
          height={en * 0.86}
          style={{ margin: `0 ${en * 0.04}px` }}
        />
        DE&nbsp;<span style={{ color: "#C9A35F" }}>WORLD</span>
      </span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: size * 0.3,
          marginTop: size * 0.22,
        }}
      >
        <span
          style={{
            flex: 1,
            height: 2,
            borderRadius: 2,
            background: "linear-gradient(90deg, #C9A35F, rgba(201,163,95,.15))",
          }}
        />
        <span
          dir="rtl"
          style={{
            font: `600 ${en * 0.48}px "Readex Pro", Tajawal, sans-serif`,
            color: inverse ? "#F3E2B6" : "#7A1630",
            whiteSpace: "nowrap",
          }}
        >
          عالم الكود
        </span>
      </span>
    </span>
  );
}
