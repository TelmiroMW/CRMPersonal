import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          <div style={{ width: 54, height: 118, borderRadius: 27, background: "#0a0a0a", display: "flex" }} />
          <div style={{ width: 54, height: 182, borderRadius: 27, background: "#0a0a0a", display: "flex" }} />
          <div style={{ width: 54, height: 246, borderRadius: 27, background: "#0a0a0a", display: "flex" }} />
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
