"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Congela el scroll de la página mientras `isLocked` es `true`.
 *
 * Hace falta doble candado: `lenis.stop()` corta el scroll interpolado, y
 * `overflow: hidden` en el `<html>` corta el nativo —que sigue vivo cuando el
 * usuario pidió menos movimiento—. El canal del scrollbar ya está reservado
 * con `scrollbar-gutter: stable`, así que no hay salto de layout.
 */
export function useScrollLock(isLocked: boolean): void {
  const lenis = useLenis();

  useEffect(() => {
    if (!isLocked) return;

    const { style } = document.documentElement;
    const previousOverflow = style.overflow;

    lenis?.stop();
    style.overflow = "hidden";

    return () => {
      style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [isLocked, lenis]);
}
