import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "#0B0F1A",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: 5,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0EA5E9" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0EA5E9", opacity: 0.6 }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0EA5E9", opacity: 0.6 }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0EA5E9", opacity: 0.3 }} />
      </div>
    ),
    { ...size }
  );
}
