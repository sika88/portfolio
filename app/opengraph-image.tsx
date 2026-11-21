import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const alt = `${SITE.name}, ${SITE.role} in ${SITE.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0f0d",
          color: "#edf2ee",
          padding: "70px 80px",
        }}
      >
        <div style={{ display: "flex", width: 160, height: 8 }}>
          <div style={{ flex: 1, background: "#ce1126" }} />
          <div style={{ flex: 1, background: "#fcd116" }} />
          <div style={{ flex: 1, background: "#006b3f" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#f2c14e", letterSpacing: 6, textTransform: "uppercase" }}>
            {SITE.role}
          </div>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05, marginTop: 18 }}>
            {SITE.name}
          </div>
          <div style={{ display: "flex", fontSize: 38, color: "#94a59b", marginTop: 22 }}>
            {`Websites · Online shops · Web apps for businesses in ${SITE.location}`}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#94a59b" }}>
          <span>{`WhatsApp ${SITE.phoneDisplay}`}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}