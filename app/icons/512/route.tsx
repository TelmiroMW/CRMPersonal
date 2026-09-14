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
          gap: 34,
        }}
      >
        <div style={{ width: 50, height: 118, borderRadius: 26, background: "#ffffff", display: "flex" }} />
        <div style={{ width: 50, height: 188, borderRadius: 26, background: "#ffffff", display: "flex" }} />
        <div style={{ width: 50, height: 258, borderRadius: 26, background: "#2f6fed", display: "flex" }} />
      </div>
    ),
    { width: 512, height: 512 }
  );
}
