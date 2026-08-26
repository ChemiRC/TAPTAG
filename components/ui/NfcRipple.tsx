"use client";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

export interface NfcRippleProps {
  /** Cuántos anillos concéntricos emanan. */
  count?: number;
  /** Diámetro del anillo en reposo, en px. */
  size?: number;
  /** Duración de un ciclo completo, en segundos. */
  duration?: number;
  /** Separación entre el arranque de un anillo y el siguiente, en segundos. */
  delayStep?: number;
  /** En `false` los anillos quedan estáticos y escalonados, como onda congelada. */
  loop?: boolean;
  /** Clases del anillo: color del borde y grosor. */
  ringClassName?: string;
  className?: string;
}

/**
 * Onda concéntrica del "tap" NFC. Es el lenguaje visual de la marca, el mismo
 * del logo y del FAB.
 *
 * Se posiciona en absoluto y se centra sobre su contenedor, que debe ser
 * `relative`. Con `prefers-reduced-motion` deja de latir por su cuenta: los
 * anillos se abren en escalones fijos para que la onda se siga leyendo.
 */
export function NfcRipple({
  count = 3,
  size = 120,
  duration = 2.6,
  delayStep = 0.5,
  loop = true,
  ringClassName,
  className,
}: NfcRippleProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isAnimated = loop && !prefersReducedMotion;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 grid place-items-center",
        className,
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn(
            "border-accent/55 col-start-1 row-start-1 rounded-full border",
            isAnimated && "animate-signal-ring",
            ringClassName,
          )}
          style={{
            width: size,
            height: size,
            ...(isAnimated
              ? {
                  animationDuration: `${duration}s`,
                  animationDelay: `${index * delayStep}s`,
                }
              : {
                  transform: `scale(${1 + index * 0.3})`,
                  opacity: 0.45 - index * 0.12,
                }),
          }}
        />
      ))}
    </div>
  );
}
