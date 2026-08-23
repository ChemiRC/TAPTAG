import { GridBackground } from "@/components/ui/GridBackground";
import { MeshGradient } from "@/components/ui/MeshGradient";

/**
 * Capas de fondo del hero, de atrás hacia adelante: color base, luz ambiental
 * que deriva lento, y la retícula con su máscara radial.
 *
 * El grano global vive en el layout, no se repite aquí.
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <MeshGradient />
      <GridBackground className="z-0 opacity-40" />
    </div>
  );
}
