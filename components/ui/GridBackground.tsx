import { cn } from "@/lib/utils";

export interface GridBackgroundProps {
  /** Separación de la retícula en px. */
  size?: number;
  /** `dots` para el punteado tipo blueprint, `lines` para la cuadrícula. */
  variant?: "dots" | "lines";
  className?: string;
}

/**
 * Textura de fondo muy sutil, en CSS puro. Una máscara radial la desvanece
 * hacia los bordes para que nunca choque con el final de la sección.
 *
 * Va posicionada en absoluto: el contenedor padre necesita `relative`.
 */
export function GridBackground({
  size = 32,
  variant = "dots",
  className,
}: GridBackgroundProps) {
  const backgroundImage =
    variant === "dots"
      ? "radial-gradient(circle, var(--color-border) 1px, transparent 1px)"
      : "linear-gradient(to right, var(--color-border) 1px, transparent 1px), " +
        "linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 opacity-60",
        className,
      )}
      style={{
        backgroundImage,
        backgroundSize: `${size}px ${size}px`,
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 75%)",
      }}
    />
  );
}
