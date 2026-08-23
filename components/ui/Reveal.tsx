"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export interface RevealProps {
  /** Retraso en segundos. Sirve para escalonar varios `Reveal` hermanos. */
  delay?: number;
  /** Distancia del slide-up en px. */
  distance?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Fade + slide-up cuando el bloque entra al viewport. Se dispara una sola vez y
 * arranca 100px antes del borde inferior, para que el movimiento ya haya
 * terminado cuando el contenido queda del todo a la vista.
 *
 * Con `prefers-reduced-motion` se renderiza un div normal: motion anima por JS,
 * así que el bloque global de CSS no lo alcanzaría.
 */
export function Reveal({
  delay = 0,
  distance = 24,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
