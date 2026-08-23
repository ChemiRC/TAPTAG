"use client";

import { useState } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * `true` si el sistema pide menos movimiento.
 *
 * Arranca en `false` a propósito: el servidor no puede conocer la preferencia,
 * y React 19 **no parcha** los atributos que no coinciden al hidratar. Si el
 * primer render del cliente devolviera el valor real, el marcado del servidor
 * ganaría y la corrección se perdería justo para quien la pidió.
 *
 * El valor real se aplica en un layout effect, antes del primer paint.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}
