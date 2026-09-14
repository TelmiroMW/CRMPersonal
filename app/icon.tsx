import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#ffffff", display: "flex" }}>
        <svg width="64" height="64" viewBox="0 0 108 108">
          <path d="M8 64L54 6L100 64L82 92H26Z" fill="#0a0a0a" />
          <path d="M54 6L54 92" stroke="#ffffff" strokeWidth="8" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
