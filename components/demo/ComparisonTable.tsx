"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CountUp } from "@/components/ui/CountUp";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ComparisonRow {
  label: string;
  qr: ReactNode;
  taptag: ReactNode;
}

const ROWS: ComparisonRow[] = [
  { label: "Pasos requeridos", qr: "3 a 5", taptag: "1" },
  {
    label: "Tiempo hasta el destino",
    qr: "8 a 15 segundos",
    taptag: "Menos de 3 segundos",
  },
  { label: "Requiere app", qr: "Cámara", taptag: "Ninguna" },
  {
    label: "Tasa de finalización",
    qr: (
      <>
        <CountUp to={35} /> a <CountUp to={50} suffix="%" />
      </>
    ),
    taptag: (
      <>
        <CountUp to={60} /> a <CountUp to={80} suffix="%" />
      </>
    ),
  },
  {
    label: "Cambiar el destino",
    qr: "Reimprimir todo",
    taptag: "Se reprograma, sin costo",
  },
  {
    label: "Se ensucia o se raya",
    qr: "Deja de servir",
    taptag: "Sigue funcionando",
  },
];

const ROW_GRID = "grid grid-cols-2 gap-x-4 md:grid-cols-[1.3fr_1fr_1fr] md:gap-x-8";

export interface ComparisonTableProps {
  className?: string;
}

/**
 * Comparación fila por fila.
 *
 * En móvil no hay scroll lateral: el atributo pasa a ocupar el ancho completo y
 * los dos valores quedan en columnas compactas debajo. Como el `display` deja de
 * ser el de una tabla, los roles ARIA van explícitos para no perder la
 * semántica de tabla al navegarla con lector de pantalla.
 */
export function ComparisonTable({ className }: ComparisonTableProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.selector(rootRef)("[data-row]");
      if (rows.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            gsap.set(rows, { opacity: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            rows,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top 80%",
                once: true,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={cn("w-full", className)}>
      <noscript>
        <style>{`[data-row]{opacity:1 !important}`}</style>
      </noscript>

      <div role="table" aria-label="Código QR comparado con TAPTAG">
        <div
          role="row"
          className={cn(
            ROW_GRID,
            "border-border text-muted hidden border-b pb-3 type-eyebrow md:grid",
          )}
        >
          <span role="columnheader" />
          <span role="columnheader">Con código QR</span>
          <span role="columnheader" className="text-accent">
            Con TAPTAG
          </span>
        </div>

        {ROWS.map((row) => (
          <div
            key={row.label}
            role="row"
            data-row
            style={{ opacity: 0 }}
            className={cn(
              ROW_GRID,
              "border-border/60 items-baseline gap-y-2 border-b py-5",
            )}
          >
            <span
              role="rowheader"
              className="text-muted col-span-2 text-sm md:col-span-1 md:text-base"
            >
              {row.label}
            </span>

            <span role="cell" className="text-muted flex flex-col gap-1">
              <span className="text-dim type-label md:hidden">
                QR
              </span>
              <span className="text-sm md:text-base">{row.qr}</span>
            </span>

            <span role="cell" className="text-text flex flex-col gap-1">
              <span className="text-accent/70 type-label md:hidden">
                TAPTAG
              </span>
              <span className="text-sm font-medium md:text-base">
                {row.taptag}
              </span>
            </span>
          </div>
        ))}
      </div>

      <p className="text-dim mt-6 max-w-2xl text-xs leading-relaxed">
        Los tiempos y las tasas de finalización son estimaciones de la industria
        NFC, no de un estudio independiente. Las citamos como orden de magnitud,
        no como medición.
      </p>
    </div>
  );
}
