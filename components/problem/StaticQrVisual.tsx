import { cn } from "@/lib/utils";

/** Módulos por lado. 21 es el tamaño de un QR versión 1. */
const MODULES = 21;
const FINDER_ORIGINS = [
  [0, 0],
  [0, 14],
  [14, 0],
] as const;

/** Marco de 7×7: anillo exterior más núcleo de 3×3. */
function isFinderModule(row: number, col: number): boolean | null {
  for (const [originRow, originCol] of FINDER_ORIGINS) {
    const r = row - originRow;
    const c = col - originCol;

    // Separador claro de un módulo alrededor del marco.
    if (r >= -1 && r <= 7 && c >= -1 && c <= 7) {
      if (r < 0 || r > 6 || c < 0 || c > 6) return false;
      const ring = r === 0 || r === 6 || c === 0 || c === 6;
      const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      return ring || core;
    }
  }
  return null;
}

/**
 * Hash determinista: mismo resultado en servidor y cliente. Con `Math.random`
 * el marcado no coincidiría al hidratar.
 */
function isDataModule(row: number, col: number): boolean {
  const hash = Math.abs((row * 73856093) ^ (col * 19349663) ^ 0x5f3a);
  return hash % 100 < 46;
}

/** Un solo `<path>` en vez de 441 `<rect>`. */
const QR_PATH = (() => {
  let path = "";

  for (let row = 0; row < MODULES; row++) {
    for (let col = 0; col < MODULES; col++) {
      const finder = isFinderModule(row, col);
      let dark: boolean;

      if (finder !== null) {
        dark = finder;
      } else if (row === 6) {
        dark = col % 2 === 0;
      } else if (col === 6) {
        dark = row % 2 === 0;
      } else {
        dark = isDataModule(row, col);
      }

      if (dark) path += `M${col} ${row}h1v1h-1z`;
    }
  }

  return path;
})();

export interface QrPatternProps {
  className?: string;
}

/**
 * Solo la retícula, sin tarjeta. La demo la mete dentro del visor del celular;
 * la sección de problema la presenta como el letrero de la mesa.
 */
export function QrPattern({ className }: QrPatternProps) {
  return (
    <svg
      viewBox={`-1 -1 ${MODULES + 2} ${MODULES + 2}`}
      aria-hidden
      className={cn("w-full", className)}
      shapeRendering="crispEdges"
    >
      <path d={QR_PATH} fill="currentColor" />
    </svg>
  );
}

export interface StaticQrVisualProps {
  className?: string;
}

/**
 * El QR de la mesa: al ras del papel, sin sombra, sin acento.
 *
 * Ese es el eje del sitio: el QR es literalmente una hoja pegada a la mesa, así
 * que se dibuja como papel impreso sobre papel. TAPTAG, en cambio, se despega
 * con sombra y color. La diferencia de elevación ES el argumento.
 *
 * El patrón es decorativo y determinista; no codifica nada ni es escaneable.
 */
export function StaticQrVisual({ className }: StaticQrVisualProps) {
  return (
    <div
      aria-hidden
      className={cn("flex w-full justify-center select-none", className)}
    >
      <div className="border-border bg-flat flex w-full max-w-[248px] rotate-[-2deg] flex-col items-center gap-4 rounded-chip border p-6">
        <QrPattern className="text-muted/45" />

        <p className="text-muted text-center type-label">
          Escanea para ver el menú
        </p>
      </div>
    </div>
  );
}
