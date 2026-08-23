import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícono de pantalla de inicio en iOS. Sin bordes redondeados: iOS los aplica. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0B",
          backgroundImage:
            "radial-gradient(140px circle at 30% 20%, rgba(34,211,238,0.35), transparent 60%), radial-gradient(140px circle at 80% 85%, rgba(124,58,237,0.4), transparent 60%)",
        }}
      >
        <svg width={110} height={110} viewBox="0 0 24 24" fill="none">
          <path d="M8 8.5A4 4 0 0 1 8 15.5" stroke="#22D3EE" strokeWidth={2.4} strokeLinecap="round" />
          <path d="M9.8 5.5A7.5 7.5 0 0 1 9.8 18.5" stroke="#22D3EE" strokeWidth={2.4} strokeLinecap="round" opacity={0.75} />
          <path d="M11.5 2.5A11 11 0 0 1 11.5 21.5" stroke="#7C3AED" strokeWidth={2.4} strokeLinecap="round" opacity={0.6} />
        </svg>
      </div>
    ),
    size,
  );
}
