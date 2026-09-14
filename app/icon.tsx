import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          gap: 4,
          padding: "0 0 12px",
        }}
      >
        <div style={{ width: 7, height: 15, borderRadius: 3.5, background: "#0a0a0a" }} />
        <div style={{ width: 7, height: 25, borderRadius: 3.5, background: "#0a0a0a" }} />
        <div style={{ width: 7, height: 35, borderRadius: 3.5, background: "#0a0a0a" }} />
      </div>
    ),
    { ...size }
  );
}
