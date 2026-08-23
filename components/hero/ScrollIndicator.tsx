"use client";

import { motion, useScroll, useTransform } from "motion/react";

export interface ScrollIndicatorProps {
  /** Ancla de la siguiente sección. Lenis intercepta el clic. */
  href: string;
  label?: string;
}

/**
 * Indicador de scroll al pie del hero: una línea vertical por la que desciende
 * un punto en loop.
 *
 * Dos capas de opacidad a propósito: la de afuera es la entrada de la timeline
 * del hero (GSAP), la de adentro el desvanecido por scroll (motion). Si las
 * dos escribieran sobre el mismo elemento se pisarían el `style.opacity`.
 *
 * El contenedor tiene que ser el que está en absoluto: envolverlo en otro div
 * lo convierte en item flex de la sección y, en cuanto GSAP le pone un
 * transform, en bloque contenedor del indicador.
 */
export function ScrollIndicator({
  href,
  label = "Descúbrelo",
}: ScrollIndicatorProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 240], [1, 0]);
  const pointerEvents = useTransform(scrollY, (value) =>
    value > 200 ? "none" : "auto",
  );

  return (
    <div
      data-hero="hint"
      style={{ opacity: 0 }}
      className="absolute inset-x-0 bottom-6 hidden justify-center md:flex"
    >
      <motion.a
        href={href}
        style={{ opacity, pointerEvents }}
        className="text-muted hover:text-text flex flex-col items-center gap-3 text-[0.6875rem] tracking-[0.2em] uppercase transition-colors duration-300"
      >
        {label}
        <span
          aria-hidden
          className="from-border relative h-10 w-px overflow-hidden bg-gradient-to-b to-transparent"
        >
          <span className="bg-accent animate-scroll-hint absolute inset-x-0 top-0 block h-2.5 rounded-full" />
        </span>
      </motion.a>
    </div>
  );
}
