"use client";

import { useState } from "react";

import { ComparisonTable } from "@/components/demo/ComparisonTable";
import { NfcSimulation } from "@/components/demo/NfcSimulation";
import { QrSimulation } from "@/components/demo/QrSimulation";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/**
 * El "Solve" del PAS y la traducción literal del pitch presencial: al dueño del
 * restaurante se le pide primero usar el QR y luego el tap, y la diferencia se
 * explica sola. Aquí el visitante hace lo mismo con el dedo o el mouse.
 *
 * Los dos lados son independientes y repetibles, y llegan al mismo destino: si
 * el destino se viera distinto, el argumento sería otro.
 */
export function Demo() {
  const [resetToken, setResetToken] = useState(0);

  return (
    <Section id="demo" className="border-border/60 border-t">
      <Reveal className="max-w-2xl">
        <p className="text-muted text-[0.6875rem] tracking-[0.2em] uppercase">
          La diferencia
        </p>

        <h2 className="font-display mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
          Pruébalo tú mismo.
        </h2>

        <p className="text-muted mt-5 text-lg">
          ¿No lo probaste con tus manos? Pruébalo aquí. Primero el QR, luego el
          tap: la diferencia se siente sola.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 lg:mt-16 lg:gap-16">
        <QrSimulation resetToken={resetToken} />
        <NfcSimulation resetToken={resetToken} />
      </div>

      <div className="border-border/60 mt-14 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-2xl font-semibold sm:text-3xl">
          Mismo destino. Un solo paso.
        </p>

        <button
          type="button"
          onClick={() => setResetToken((token) => token + 1)}
          className="border-border text-muted hover:border-muted hover:text-text rounded-pill h-11 shrink-0 self-start border px-6 text-sm transition-colors duration-300 sm:self-auto"
        >
          Probar de nuevo
        </button>
      </div>

      <ComparisonTable className="mt-16 lg:mt-20" />
    </Section>
  );
}
