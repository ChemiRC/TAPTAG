"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface CountUpProps {
  /** Valor de arranque del conteo. */
  from?: number;
  /** Valor final. Es también el que se renderiza en el marcado. */
  to: number;
  /** Duración del conteo, en segundos. */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Punto de arranque de ScrollTrigger, en su sintaxis habitual. */
  start?: string;
  className?: string;
}

/**
 * Número que cuenta hacia arriba cuando entra al viewport. Una sola vez: repetir
 * el conteo en cada scroll es ruido, no énfasis.
 *
 * El marcado renderiza el valor **final**, no el inicial: es el dato verdadero,
 * el que ve un buscador y el que queda si JS nunca corre. GSAP lo baja a `from`
 * al montar, antes de que el elemento llegue a la vista.
 *
 * Con `prefers-reduced-motion` no hay conteo: el número se queda en su valor
 * final desde el principio.
 */
export function CountUp({
  from = 0,
  to,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  start = "top 85%",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (value: number) =>
    `${prefix}${value.toFixed(decimals)}${suffix}`;

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            element.textContent = format(to);
            return;
          }

          const counter = { value: from };
          element.textContent = format(from);

          gsap.to(counter, {
            value: to,
            duration,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start, once: true },
            onUpdate: () => {
              element.textContent = format(counter.value);
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {format(to)}
    </span>
  );
}
