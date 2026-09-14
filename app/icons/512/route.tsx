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
        {/* Marca escalada al ~65% del lienzo (zona segura para iconos adaptativos de Android) */}
        <svg width="346" height="346" viewBox="0 0 100 100">
          <path d="M19 60L50 21L81 60L69 79H31Z" fill="#0a0a0a" />
          <path d="M50 21L50 79" stroke="#ffffff" strokeWidth="5.5" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
