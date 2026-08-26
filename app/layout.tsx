import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { Analytics } from "@vercel/analytics/next";

import { VisitOrigin } from "@/components/analytics/VisitOrigin";
import { StructuredData } from "@/components/seo/StructuredData";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { clashDisplay, inter } from "@/lib/fonts";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Más reseñas de Google para tu restaurante, con un tap`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "más reseñas de Google restaurante Guadalajara",
    "instalación NFC restaurantes Guadalajara",
    "menú digital sin QR restaurante",
    "sistema NFC para restaurantes México",
    "reemplazar código QR restaurante",
    "servicio NFC Zapopan",
    "conseguir reseñas Google restaurante Jalisco",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-MX"
      className={cn(inter.variable, clashDisplay.variable)}
      suppressHydrationWarning
    >
      <body className="bg-bg text-text font-body antialiased">
        <a
          href="#contenido"
          className="bg-surface text-text rounded-card focus:ring-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:px-4 focus:py-2 focus:ring-2"
        >
          Saltar al contenido
        </a>

        <SmoothScrollProvider>
          <Navbar />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppFAB />
        </SmoothScrollProvider>

        <NoiseOverlay />
        <StructuredData />

        {/*
          Solo en Vercel: fuera de ahí el script de analítica no existe y
          pediría un 404 en cada carga local. `VERCEL` la define la propia
          plataforma en build, así que esto se resuelve al compilar.
        */}
        {process.env.VERCEL === "1" && (
          <>
            <Analytics />
            <VisitOrigin />
          </>
        )}
      </body>
    </html>
  );
}
