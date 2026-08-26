import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: la marca NFC sobre el fondo de la paleta. */
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
          backgroundColor: "#FBF9F6",
          borderRadius: 8,
        }}
      >
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <path d="M8 8.5A4 4 0 0 1 8 15.5" stroke="#B3350F" strokeWidth={2.8} strokeLinecap="round" />
          <path d="M11 4.5A9 9 0 0 1 11 19.5" stroke="#7A1710" strokeWidth={2.8} strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
