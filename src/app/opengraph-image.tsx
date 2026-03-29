import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ChartRacer — Bar Chart Race Video Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0d1117",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.06) 0%, transparent 60%), " +
              "radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 60%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "80px",
            flex: 1,
            position: "relative",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
            <div
              style={{
                width: "8px",
                height: "60px",
                borderRadius: "4px",
                background: "linear-gradient(to bottom, #38bdf8, #a78bfa)",
              }}
            />
            <span style={{ fontSize: "56px", fontWeight: 700, color: "white", letterSpacing: "-2px" }}>
              ChartRacer
            </span>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: "26px", color: "rgba(255,255,255,0.5)", marginBottom: "48px" }}>
            Bar Chart Race Video Generator
          </div>

          {/* Bar chart preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "48px" }}>
            {[
              { color: "#38bdf8", width: 520, label: "#1" },
              { color: "#a78bfa", width: 400, label: "#2" },
              { color: "#34d399", width: 300, label: "#3" },
              { color: "#fb923c", width: 190, label: "#4" },
            ].map((bar) => (
              <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.3)", width: "40px" }}>
                  {bar.label}
                </span>
                <div
                  style={{
                    height: "40px",
                    width: `${bar.width}px`,
                    background: `linear-gradient(90deg, ${bar.color}cc, ${bar.color})`,
                    borderRadius: "0 6px 6px 0",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { label: "KI-Recherche", color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
              { label: "Remotion", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
              { label: "MP4 Export", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
              { label: "1080p · 30fps", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)" },
            ].map((tag) => (
              <div
                key={tag.label}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  backgroundColor: tag.bg,
                  fontSize: "16px",
                  fontWeight: 500,
                  color: tag.color,
                }}
              >
                {tag.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: "24px 80px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.2)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          YouTube · Instagram Reels · TikTok
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
