import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * `pathLength` normaliza el largo del trazo, así que el estado inicial —sin
 * dibujar— cabe en el marcado sin tener que medir el path con JS al hidratar.
 *
 * Vale 1000 y no 1 porque GSAP redondea los valores en px: con largo 1 el
 * trazo solo podía valer 1 o 0 y el dibujo saltaba de golpe a mitad del
 * recorrido. Con 1000 quedan mil pasos, imperceptibles de a uno.
 */
export const PATH_LENGTH = 1000;

const DASH_PROPS = {
  pathLength: PATH_LENGTH,
  strokeDasharray: PATH_LENGTH,
  strokeDashoffset: PATH_LENGTH,
  vectorEffect: "non-scaling-stroke",
} as const;

export interface StepConnectorProps {
  orientation: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
}

/**
 * Línea que une los tres pasos y se dibuja con el scroll.
 *
 * Se estira con `preserveAspectRatio="none"`; `vector-effect: non-scaling-stroke`
 * evita que el grosor se deforme al estirarse.
 *
 * El SVG va dentro de un `<span>` que es quien lleva el posicionamiento: un
 * `<svg>` es un elemento reemplazado, así que con `left` y `right` a la vez no
 * se estira —se queda con su ancho intrínseco y desborda la página—.
 */
export function StepConnector({
  orientation,
  className,
  style,
}: StepConnectorProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <span aria-hidden className={cn("block", className)} style={style}>
      <svg
        viewBox={isHorizontal ? "0 0 1000 60" : "0 0 60 1000"}
        preserveAspectRatio="none"
        className="block size-full overflow-visible"
        fill="none"
      >
        <defs>
          <linearGradient
            id={`step-line-${orientation}`}
            x1="0"
            y1="0"
            x2={isHorizontal ? "1000" : "0"}
            y2={isHorizontal ? "0" : "1000"}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="var(--color-border)" />
            <stop offset="0.5" stopColor="var(--color-accent)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--color-border)" />
          </linearGradient>
        </defs>

        <path
          data-connector-path
          d={
            isHorizontal
              ? "M0 30 C 200 0, 300 60, 500 30 S 800 0, 1000 30"
              : "M30 0 C 60 200, 0 300, 30 500 S 60 800, 30 1000"
          }
          stroke={`url(#step-line-${orientation})`}
          strokeWidth={1.5}
          strokeLinecap="round"
          {...DASH_PROPS}
        />
      </svg>
    </span>
  );
}
