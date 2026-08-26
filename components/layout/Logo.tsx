import { NfcMarkIcon } from "@/components/icons/NfcMarkIcon";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export interface LogoProps {
  className?: string;
  /** Oculta el wordmark y deja solo la marca de señal. */
  markOnly?: boolean;
}

/** Wordmark TAPTAG con el indicador de señal NFC pulsando. */
export function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 leading-none",
        className,
      )}
    >
      {!markOnly && (
        <span className="font-display text-lg font-semibold tracking-[0.16em] uppercase">
          {SITE.name}
        </span>
      )}

      <NfcMarkIcon animated className="text-accent -translate-y-[3px]" />
    </span>
  );
}
