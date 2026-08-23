/**
 * Textura de grano generada con `feTurbulence` y embebida como data URI:
 * sin request extra y sin imagen que optimizar. `%23` es el `#` de la
 * referencia al filtro, ya escapado para el data URI.
 */
const NOISE_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * Grano fino sobre toda la ventana. Rompe el banding de los gradientes en
 * pantallas OLED y le da textura de impreso a los fondos planos.
 */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-60 opacity-[0.035] mix-blend-soft-light"
      style={{
        backgroundImage: `url("${NOISE_DATA_URI}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
