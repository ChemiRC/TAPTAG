import { NfcMarkIcon } from "@/components/icons/NfcMarkIcon";
import { cn } from "@/lib/utils";

/** El menú al que llegan los dos caminos, QR y tap. */
export const MENU_ITEMS = [
  { name: "Tacos de birria", price: "$95" },
  { name: "Aguachile verde", price: "$180" },
  { name: "Agua de horchata", price: "$45" },
] as const;

export interface DestinationScreenProps {
  className?: string;
}

/**
 * Pantalla de destino: el menú digital del restaurante.
 *
 * Es deliberadamente la misma en los dos lados de la demo. Si el destino se
 * viera distinto, el visitante creería que TAPTAG lleva a otro lado; lo que
 * cambia es cuánto cuesta llegar.
 *
 * Cada fila lleva `data-menu-row` para que quien la use pueda animarlas.
 */
export function DestinationScreen({ className }: DestinationScreenProps) {
  return (
    <div className={cn("flex h-full flex-col gap-3 px-4 pt-10", className)}>
      <div className="flex items-center gap-1.5">
        <NfcMarkIcon className="text-accent size-2.5" strokeWidth={2.75} />
        <span className="font-display text-text text-[0.5rem] font-semibold tracking-[0.18em] uppercase">
          Menú digital
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {MENU_ITEMS.map((item) => (
          <div
            key={item.name}
            data-menu-row
            className="border-border/70 bg-surface/60 flex items-center justify-between rounded-lg border px-2.5 py-2"
          >
            <span className="text-text text-[0.5rem]">{item.name}</span>
            <span className="text-accent text-[0.5rem] font-medium">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
