import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface SectionProps {
  /** Etiqueta semántica del bloque. `section` por defecto. */
  as?: ElementType;
  /** El contenido ocupa todo el ancho de la ventana (mapas, marquesinas, demos). */
  fullBleed?: boolean;
  /** Clases para el contenedor externo: fondos, bordes, overflow. */
  className?: string;
  /** Clases para el contenedor interno de 1280px. */
  innerClassName?: string;
  id?: string;
  children: ReactNode;
}

/**
 * Envoltura estándar de sección: ritmo vertical consistente y ancho máximo de
 * 1280px. Con `fullBleed` se elimina el contenedor interno y el hijo maneja su
 * propio ancho.
 */
export function Section({
  as: Component = "section",
  fullBleed = false,
  className,
  innerClassName,
  id,
  children,
}: SectionProps) {
  return (
    <Component
      id={id}
      className={cn("relative w-full py-24 md:py-32", className)}
    >
      {fullBleed ? (
        children
      ) : (
        <div
          className={cn(
            "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12",
            innerClassName,
          )}
        >
          {children}
        </div>
      )}
    </Component>
  );
}
