import { Inter } from "next/font/google";
import localFont from "next/font/local";

/**
 * Cuerpo de texto. Self-hosted por next/font: cero requests a Google en
 * runtime y size-adjust automático para evitar CLS.
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Titulares. Clash Display (Fontshare, ITF Free Font License) servido desde
 * /public/fonts. Ver public/fonts/README.md para el origen de los archivos.
 */
export const clashDisplay = localFont({
  // Solo los dos pesos que el sitio usa de verdad. Declarar los cuatro hacía que
  // next/font precargara ~30 KB de tipografía que nunca se pinta, y en el primer
  // paint del pitch esos bytes compiten con lo que sí importa.
  src: [
    { path: "../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-clash-display",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
