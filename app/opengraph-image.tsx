import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { SITE } from "@/lib/constants";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Tarjeta social generada en build. Todo se dibuja aquí —gradientes y SVG—
 * porque Satori no carga imágenes externas y no queremos depender de ninguna.
 *
 * La tipografía va desde `assets/fonts` y no desde `public/`: Satori necesita
 * TTF (no lee el woff2 que usa el sitio) y este archivo solo hace falta en
 * build, no hay por qué servirlo a los visitantes.
 */
export default async function OpengraphImage() {
  const clashDisplay = await readFile(
    join(process.cwd(), "assets/fonts/ClashDisplay-Semibold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#FBF9F6",
          backgroundImage:
            "radial-gradient(900px circle at 12% 8%, rgba(179,53,15,0.09), transparent 55%), radial-gradient(800px circle at 92% 88%, rgba(122,23,16,0.07), transparent 55%)",
          color: "#1A1512",
          fontFamily: "Clash Display",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 10,
            }}
          >
            {SITE.name}
          </span>
          <NfcArcs size={30} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            Un tap. Y ya.
          </span>
          <span style={{ fontSize: 34, color: "#6B6259", maxWidth: 900 }}>
            Stickers NFC premium para restaurantes. Adiós al código QR.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            style={{
              display: "flex",
              padding: "12px 26px",
              borderRadius: 999,
              backgroundImage: "linear-gradient(135deg, #B3350F, #7A1710)",
              color: "#FBF9F6",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            Cotizar por WhatsApp
          </span>
          <span style={{ fontSize: 26, color: "#6B6259" }}>{SITE.city}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Clash Display",
          data: clashDisplay,
          weight: 600,
          style: "normal",
        },
      ],
    },
  );
}

/** Los mismos arcos del logo, en línea porque Satori no resuelve componentes SVG externos. */
function NfcArcs({ size: glyphSize }: { size: number }) {
  return (
    <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
      <path d="M8 8.5A4 4 0 0 1 8 15.5" stroke="#B3350F" strokeWidth={2.4} strokeLinecap="round" />
      <path d="M9.8 5.5A7.5 7.5 0 0 1 9.8 18.5" stroke="#B3350F" strokeWidth={2.4} strokeLinecap="round" opacity={0.7} />
      <path d="M11.5 2.5A11 11 0 0 1 11.5 21.5" stroke="#B3350F" strokeWidth={2.4} strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}
