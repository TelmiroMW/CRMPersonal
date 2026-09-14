import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          gap: 13,
        }}
      >
        <div style={{ width: 19, height: 44, borderRadius: 10, background: "#ffffff", display: "flex" }} />
        <div style={{ width: 19, height: 70, borderRadius: 10, background: "#ffffff", display: "flex" }} />
        <div style={{ width: 19, height: 96, borderRadius: 10, background: "#2f6fed", display: "flex" }} />
      </div>
    ),
    { width: 192, height: 192 }
  );
}
