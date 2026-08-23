import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PhoneFrameProps {
  /** Contenido de la pantalla. */
  children: ReactNode;
  /** Clases del marco: sirve para el ancho, que cambia según el contexto. */
  className?: string;
  /** Clases de la pantalla, por si hace falta cambiar el fondo. */
  screenClassName?: string;
}

/**
 * Celular estilizado: marco redondeado, bisel fino, isla de cámara y pantalla.
 *
 * Compartido entre el visual del hero y las dos simulaciones de la demo, para
 * que el "destino" se vea idéntico venga por QR o por tap — que es justo el
 * argumento: no cambia el destino, cambia el camino.
 */
export function PhoneFrame({
  children,
  className,
  screenClassName,
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface shadow-elevated relative w-[186px] rounded-[2.25rem] border p-[6px]",
        className,
      )}
    >
      <div
        className={cn(
          "bg-bg relative aspect-[9/18.5] overflow-hidden rounded-[1.85rem]",
          screenClassName,
        )}
      >
        <div className="bg-surface-2 absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full" />
        {children}
      </div>
    </div>
  );
}
