import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PanelHeaderProps {
  title: string;
  /** `muted` para el lado QR, `brand` para el lado TAPTAG. */
  tone: "muted" | "brand";
  counter: ReactNode;
}

/**
 * Encabezado de cada lado de la demo. Los dos comparten estructura y altura a
 * propósito: si un lado se viera más chico, la comparación dejaría de ser justa.
 */
export function PanelHeader({ title, tone, counter }: PanelHeaderProps) {
  return (
    <div className="border-border flex items-baseline justify-between border-b pb-3">
      <h3
        className={cn(
          "font-display text-base font-semibold",
          tone === "brand" ? "text-gradient-brand" : "text-muted",
        )}
      >
        {title}
      </h3>
      <span
        className={cn(
          "font-display text-sm",
          tone === "brand" ? "text-accent" : "text-muted",
        )}
      >
        {counter}
      </span>
    </div>
  );
}
