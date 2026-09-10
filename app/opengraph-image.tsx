import { ImageResponse } from "next/og";

export const alt = "Your Village — Support for you and your family";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#FAF8F5",
        color: "#1A1A18",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
        }}
      >
        <span>Your Village</span>
        <span style={{ color: "#566749" }}>
          For mothers. For families. For you.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 86,
          lineHeight: 1.08,
          letterSpacing: "-3px",
        }}
      >
        <span>Life takes a village.</span>
        <span style={{ color: "#566749" }}>Find your people.</span>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#4A4640" }}>
        Practical help. Family care. Personal wellbeing.
      </div>
    </div>,
    size,
  );
}
