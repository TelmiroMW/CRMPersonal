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
        <div style={{ display: "flex", alignItems: "flex-end", gap: 9 }}>
          <div style={{ width: 20, height: 44, borderRadius: 10, background: "#0a0a0a", display: "flex" }} />
          <div style={{ width: 20, height: 68, borderRadius: 10, background: "#0a0a0a", display: "flex" }} />
          <div style={{ width: 20, height: 92, borderRadius: 10, background: "#0a0a0a", display: "flex" }} />
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
