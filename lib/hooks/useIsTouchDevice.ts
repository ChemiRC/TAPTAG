"use client";

import { useState } from "react";

import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";

// Un dispositivo sin puntero fino (dedo) no puede aprovechar efectos de hover.
const QUERY = "(hover: hover) and (pointer: fine)";

/**
 * `true` en dispositivos táctiles / sin mouse. Apaga los efectos que dependen
 * del cursor, como el magnético del botón primario.
 *
 * Arranca en `false` y se corrige en un layout effect por la misma razón que
 * [usePrefersReducedMotion]: el marcado del servidor no puede saberlo y React
 * no reconcilia atributos al hidratar.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsTouch(!event.matches);

    setIsTouch(!mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}
