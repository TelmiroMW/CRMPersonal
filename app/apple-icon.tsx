import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 12,
          padding: "0 0 34px",
        }}
      >
        <div style={{ width: 20, height: 42, borderRadius: 10, background: "#0a0a0a" }} />
        <div style={{ width: 20, height: 70, borderRadius: 10, background: "#0a0a0a" }} />
        <div style={{ width: 20, height: 98, borderRadius: 10, background: "#0a0a0a" }} />
      </div>
    ),
    { ...size }
  );
}
