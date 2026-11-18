import { ImageResponse } from "next/og";
import { INITIALS } from "@/lib/content";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2c14e",
          color: "#0b0f0d",
          fontSize: 96,
          fontWeight: 800,
        }}
      >
        {INITIALS}
      </div>
    ),
    { ...size },
  );
}
