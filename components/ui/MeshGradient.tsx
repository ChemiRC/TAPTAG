import { cn } from "@/lib/utils";

/**
 * Blobs de luz ambiental. Son `radial-gradient` ya difuminados por su propia
 * caída a transparente: nada de `filter: blur`, que a este tamaño cuesta caro
 * en móvil de gama media. Solo se mueven con `transform`.
 */
const MESH_BLOBS = [
  {
    color: "var(--color-accent)",
    className: "animate-mesh-a -top-[20%] -left-[15%] size-[75vmax] opacity-20",
  },
  {
    color: "var(--color-accent-2)",
    className:
      "animate-mesh-b top-[10%] -right-[20%] size-[70vmax] opacity-[0.22]",
  },
  {
    color: "var(--color-accent)",
    className:
      "animate-mesh-c -bottom-[30%] left-[20%] size-[60vmax] opacity-[0.14]",
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
