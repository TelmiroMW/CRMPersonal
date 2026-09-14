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
          background: "#0a0a0a",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div style={{ width: 6, height: 14, borderRadius: 3, background: "#ffffff" }} />
        <div style={{ width: 6, height: 22, borderRadius: 3, background: "#ffffff" }} />
        <div style={{ width: 6, height: 30, borderRadius: 3, background: "#2f6fed" }} />
      </div>
    ),
    { ...size }
  );
}
