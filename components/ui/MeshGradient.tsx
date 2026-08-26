import { cn } from "@/lib/utils";

/**
 * Calor de fondo. Sobre papel esto NO puede ser luz ambiental: un radial de
 * color al 20% sobre blanco no se lee como luz, se lee como una mancha. Por eso
 * son dos y no tres, y al 4-5.5% — apenas lo justo para que el fondo no sea
 * blanco plano.
 *
 * Siguen sin `filter: blur` (caro en móvil de gama media) y solo se mueven con
 * `transform`.
 */
const MESH_BLOBS = [
  {
    color: "var(--color-accent)",
    className: "animate-mesh-a -top-[25%] -right-[10%] size-[70vmax] opacity-[0.055]",
  },
  {
    color: "var(--color-accent-2)",
    className: "animate-mesh-b -bottom-[30%] -left-[15%] size-[62vmax] opacity-[0.04]",
  },
] as const;

export interface MeshGradientProps {
  className?: string;
}

/**
 * Luz ambiental de marca. La comparten el hero y el CTA final: el sitio abre y
 * cierra con el mismo lenguaje visual.
 *
 * Va en absoluto y recorta lo que se sale, así que el contenedor no necesita su
 * propio `overflow-hidden`.
 */
export function MeshGradient({ className }: MeshGradientProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {MESH_BLOBS.map((blob, index) => (
        <div
          key={index}
          className={`absolute rounded-full ${blob.className}`}
          style={{
            backgroundImage: `radial-gradient(circle, ${blob.color} 0%, transparent 65%)`,
          }}
        />
      ))}
    </div>
  );
}
