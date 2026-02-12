import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "#0B0F1A",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 30,
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0EA5E9" }} />
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0EA5E9", opacity: 0.6 }} />
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0EA5E9", opacity: 0.6 }} />
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0EA5E9", opacity: 0.3 }} />
      </div>
    ),
    { ...size }
  );
}
