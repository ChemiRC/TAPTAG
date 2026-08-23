import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El sitio es estático: no hay rutas dinámicas, ni API, ni base de datos.
  // Vercel lo prerenderiza entero en build y lo sirve desde el CDN.
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
