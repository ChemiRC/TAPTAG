import { NfcMarkIcon } from "@/components/icons/NfcMarkIcon";

/**
 * Composiciones visuales de las celdas del bento. Son SVG propios, con el mismo
 * trazo y el mismo vocabulario que el resto de la marca: nada de librería de
 * íconos genérica.
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Celda destacada: el precio se paga una vez y no vuelve. */
export function OneTimePaymentVisual() {
  return (
    <div className="flex flex-col items-start gap-4">
      <span className="bg-gradient-brand text-bg rounded-pill font-display px-4 py-2 text-sm font-semibold">
        Pago único
      </span>

      <span className="text-dim relative text-2xl font-medium">
        <span className="line-through decoration-2">$499 / mes</span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="text-muted/40 absolute -top-1 -right-7 size-5"
          {...STROKE}
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </span>
    </div>
  );
}

/** Se reprograma: el destino gira sin cambiar el sticker. */
export function ReprogramVisual() {
  return (
    <svg viewBox="0 0 48 32" aria-hidden className="text-accent/70 h-8" {...STROKE}>
      <rect x="1" y="6" width="20" height="20" rx="5" />
      <path d="M11 13.5a2.5 2.5 0 0 1 0 5" strokeWidth={2} />
      <path d="M28 12a8 8 0 0 1 13 -2M41 6v4h-4" />
      <path d="M44 20a8 8 0 0 1-13 2M31 26v-4h4" />
    </svg>
  );
}

/** Sin internet ni pilas: los dos tachados. */
export function NoPowerVisual() {
  return (
    <svg viewBox="0 0 56 24" aria-hidden className="text-muted h-7" {...STROKE}>
      <path d="M2 9a13 13 0 0 1 18 0M6 13.5a8 8 0 0 1 10 0" />
      <circle cx="11" cy="18" r="1" fill="currentColor" stroke="none" />
      <path d="M2 20 20 4" className="text-muted/70" />
      <rect x="32" y="7" width="18" height="11" rx="2.5" />
      <path d="M52 11v3" />
      <path d="M32 20 50 4" className="text-muted/70" />
    </svg>
  );
}

/** Compatibilidad: dos siluetas de celular, sin prometer porcentajes. */
export function DevicesVisual() {
  return (
    <svg viewBox="0 0 40 26" aria-hidden className="text-muted h-7" {...STROKE}>
      <rect x="1" y="1" width="15" height="24" rx="3.5" />
      <path d="M6.5 4h4" />
      <rect x="21" y="4" width="14" height="21" rx="3" />
      <path d="M26 7h4" />
    </svg>
  );
}

/** Aguanta el uso diario: gota rebotando en un escudo. */
export function DurabilityVisual() {
  return (
    <svg viewBox="0 0 34 26" aria-hidden className="text-muted h-7" {...STROKE}>
      <path d="M12 2 2 5v7c0 5 4.5 9 10 11 5.5-2 10-6 10-11V5Z" />
      <path d="M27 6c1.6 2 3 3.6 3 5a3 3 0 0 1-6 0c0-1.4 1.4-3 3-5Z" />
    </svg>
  );
}

/** Con tu marca: muestras de color junto a la señal NFC. */
export function BrandingVisual() {
  return (
    <div className="flex items-center gap-2">
      <NfcMarkIcon className="text-accent size-6" strokeWidth={2} />
      <span className="bg-accent size-4 rounded-full" />
      <span className="bg-accent-2 size-4 rounded-full" />
      <span className="bg-text/70 size-4 rounded-full" />
      <span className="border-border size-4 rounded-full border" />
    </div>
  );
}

/** Los dos destinos posibles, uno junto al otro. */
export function DestinationsVisual() {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="border-border bg-bg/60 flex min-w-[9rem] flex-1 flex-col gap-2 rounded-chip border p-3">
        <span className="text-dim type-label">
          Menú
        </span>
        {["Tacos de birria", "Aguachile verde"].map((item) => (
          <span
            key={item}
            className="text-text/80 flex items-center justify-between text-[0.625rem]"
          >
            {item}
            <span className="text-accent">·</span>
          </span>
        ))}
      </div>

      <div className="border-border bg-bg/60 flex min-w-[9rem] flex-1 flex-col gap-2 rounded-chip border p-3">
        <span className="text-dim type-label">
          Reseñas
        </span>
        <span className="flex gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <svg
              key={index}
              viewBox="0 0 24 24"
              aria-hidden
              className="text-accent size-3"
              fill="currentColor"
            >
              <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z" />
            </svg>
          ))}
        </span>
        <span className="text-dim text-[0.625rem]">4.9 en Google</span>
      </div>
    </div>
  );
}
