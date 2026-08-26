import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Ritmo de la cascada, en segundos entre antetítulo, titular y bajada.
 *
 * Existen tres y no uno porque ocho secciones entrando exactamente igual se
 * vuelven monótonas. La sección de problema entra lenta —es su argumento— y la
 * demo entra viva, porque es la que invita a tocar.
 */
const PASOS = {
  lenta: 0.14,
  normal: 0.09,
  viva: 0.05,
} as const;

export interface SectionIntroProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  pace?: keyof typeof PASOS;
  align?: "left" | "center";
  className?: string;
}

/**
 * Encabezado de sección: antetítulo, titular y bajada entrando en cascada.
 *
 * Antes cada sección repetía el marcado a mano y revelaba las tres piezas como
 * un solo bloque. Encadenarlas hace que el ojo baje en orden y que las ocho se
 * lean como un mismo sistema, sin secuestrar el scroll.
 */
export function SectionIntro({
  eyebrow,
  title,
  lead,
  pace = "normal",
  align = "left",
  className,
}: SectionIntroProps) {
  const paso = PASOS[pace];
  const centrado = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col",
        centrado ? "mx-auto max-w-xl items-center text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p className="text-muted type-eyebrow">{eyebrow}</p>
        </Reveal>
      )}

      <Reveal delay={eyebrow ? paso : 0}>
        <h2 className={cn("type-section-title", eyebrow && "mt-5")}>{title}</h2>
      </Reveal>

      {lead && (
        <Reveal delay={eyebrow ? paso * 2 : paso}>
          <p className="text-muted type-lead mt-5">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
