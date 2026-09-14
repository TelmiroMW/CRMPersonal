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
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <div style={{ width: 18, height: 40, borderRadius: 9, background: "#ffffff" }} />
        <div style={{ width: 18, height: 64, borderRadius: 9, background: "#ffffff" }} />
        <div style={{ width: 18, height: 88, borderRadius: 9, background: "#2f6fed" }} />
      </div>
    ),
    { ...size }
  );
}
