import { cn } from "@/lib/utils";

/**
 * Arcos concéntricos de la señal NFC, de dentro hacia fuera.
 * `delay` escalona el pulso para que la onda se lea saliendo del centro.
 */
const SIGNAL_ARCS = [
  { d: "M8 8.5A4 4 0 0 1 8 15.5", delay: "0ms" },
  { d: "M9.8 5.5A7.5 7.5 0 0 1 9.8 18.5", delay: "160ms" },
  { d: "M11.5 2.5A11 11 0 0 1 11.5 21.5", delay: "320ms" },
] as const;

export interface NfcMarkIconProps {
  className?: string;
  /** Pulso en loop. Es animación CSS, así que reduced-motion la neutraliza sola. */
  animated?: boolean;
  strokeWidth?: number;
}

/**
 * Marca de señal NFC. Es el lenguaje visual de TAPTAG: aparece en el logo, en
 * el sticker del hero y en las ondas del FAB.
 *
 * Los keyframes del pulso empiezan y terminan en reposo, así que sin
 * movimiento los arcos quedan estáticos y visibles, nunca apagados.
 */
export function NfcMarkIcon({
  className,
  animated = false,
  strokeWidth = 2.25,
}: NfcMarkIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-3.5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    >
      {SIGNAL_ARCS.map((arc) => (
        <path
          key={arc.d}
          d={arc.d}
          className={cn(animated && "animate-nfc-pulse opacity-30")}
          style={animated ? { animationDelay: arc.delay } : undefined}
        />
      ))}
    </svg>
  );
}
