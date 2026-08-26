"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent, ReactNode } from "react";

import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/** Grados máximos de inclinación. Muy poco: esta sección no compite con la demo. */
const MAX_TILT = 3;
/** Cuánto se acerca al objetivo por frame. */
const LERP = 0.14;
/**
 * Umbrales de reposo. Separados por unidad: sumar px y grados en un solo número
 * hacía que el término de rotación dominara y el bucle siguiera corriendo medio
 * segundo de más escribiendo valores ya idénticos.
 */
const SETTLED_PX = 0.5;
const SETTLED_DEG = 0.01;

interface Vec {
  x: number;
  y: number;
  rx: number;
  ry: number;
}

/** Única escritura al DOM del efecto: spotlight y tilt en el mismo frame. */
function write(element: HTMLElement, vec: Vec) {
  element.style.setProperty("--spot-x", `${vec.x.toFixed(1)}px`);
  element.style.setProperty("--spot-y", `${vec.y.toFixed(1)}px`);
  element.style.transform = `perspective(900px) rotateX(${vec.rx.toFixed(3)}deg) rotateY(${vec.ry.toFixed(3)}deg)`;
}

export interface BentoCellProps {
  title: string;
  description: string;
  /** Clases del contenedor: aquí van los spans del bento. */
  className?: string;
  /** Borde con gradiente de marca. Solo para la celda destacada. */
  featured?: boolean;
  /** Composición visual de la celda. */
  visual?: ReactNode;
}

/**
 * Celda del bento con inclinación 3D y spotlight que sigue al cursor.
 *
 * Ni el tilt ni el spotlight pasan por estado de React: un puntero moviéndose
 * son ~60 eventos por segundo y otros tantos renders. En vez de eso el
 * `pointermove` solo apunta a dónde ir, y un único rAF por celda interpola y
 * escribe en el DOM. El bucle se apaga solo al llegar, así que una celda quieta
 * no consume frames.
 *
 * Dos capas: la de afuera la anima la entrada de la sección (GSAP), la de
 * adentro el tilt. Si las dos escribieran `transform` en el mismo nodo se
 * pisarían.
 */
export function BentoCell({
  title,
  description,
  className,
  featured = false,
  visual,
}: BentoCellProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<Vec>({ x: 0, y: 0, rx: 0, ry: 0 });
  const currentRef = useRef<Vec>({ x: 0, y: 0, rx: 0, ry: 0 });
  const frameRef = useRef<number | null>(null);

  const isTouch = useIsTouchDevice();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isInteractive = !isTouch && !prefersReducedMotion;

  const stopFrame = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const loop = useCallback(() => {
    const element = tiltRef.current;
    if (!element) return;

    const target = targetRef.current;
    const current = currentRef.current;

    const settled =
      Math.abs(target.x - current.x) < SETTLED_PX &&
      Math.abs(target.y - current.y) < SETTLED_PX &&
      Math.abs(target.rx - current.rx) < SETTLED_DEG &&
      Math.abs(target.ry - current.ry) < SETTLED_DEG;

    if (settled) {
      // Un último frame exacto y el bucle se apaga: una celda quieta no gasta
      // frames ni sigue escribiendo el mismo valor.
      currentRef.current = { ...target };
      write(element, target);
      frameRef.current = null;
      return;
    }

    current.x += (target.x - current.x) * LERP;
    current.y += (target.y - current.y) * LERP;
    current.rx += (target.rx - current.rx) * LERP;
    current.ry += (target.ry - current.ry) * LERP;

    write(element, current);
    frameRef.current = requestAnimationFrame(loop);
  }, []);

  const requestFrame = useCallback(() => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(loop);
  }, [loop]);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isInteractive) return;
      const element = tiltRef.current;
      if (!element) return;

      const bounds = element.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      targetRef.current = {
        x,
        y,
        // El eje se invierte: el cursor arriba inclina la tarjeta hacia atrás.
        rx: -((y / bounds.height) * 2 - 1) * MAX_TILT,
        ry: ((x / bounds.width) * 2 - 1) * MAX_TILT,
      };
      requestFrame();
    },
    [isInteractive, requestFrame],
  );

  const handlePointerLeave = useCallback(() => {
    if (!isInteractive) return;
    const element = tiltRef.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    targetRef.current = {
      x: bounds.width / 2,
      y: bounds.height / 2,
      rx: 0,
      ry: 0,
    };
    requestFrame();
  }, [isInteractive, requestFrame]);

  useEffect(() => stopFrame, [stopFrame]);

  return (
    <div
      data-bento-cell
      style={{ opacity: 0 }}
      className={cn("min-h-0", className)}
    >
      <div
        ref={tiltRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={cn(
          "group border-border bg-surface/40 relative flex h-full flex-col overflow-hidden rounded-card border p-6 will-change-transform sm:p-7",
          featured && "border-transparent",
        )}
      >
        {featured && (
          // Borde con gradiente: un fondo de marca al que le recortamos el centro.
          <span
            aria-hidden
            className="bg-gradient-brand pointer-events-none absolute inset-0 rounded-card opacity-40 [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] p-px"
          />
        )}

        {isInteractive && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--color-accent) 14%, transparent), transparent 65%)",
            }}
          />
        )}

        <div
          className={cn(
            "relative flex h-full flex-col",
            // La destacada ocupa dos filas: separar visual y texto llena el
            // alto en vez de dejar un hueco muerto abajo.
            featured && "justify-between gap-10",
          )}
        >
          {visual && <div className={cn(!featured && "mb-6")}>{visual}</div>}

          <h3 className="type-card-title text-text">
            {title}
          </h3>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
