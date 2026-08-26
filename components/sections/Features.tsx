"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BentoCell } from "@/components/features/BentoCell";
import {
  BrandingVisual,
  DestinationsVisual,
  DevicesVisual,
  DurabilityVisual,
  NoPowerVisual,
  OneTimePaymentVisual,
  ReprogramVisual,
} from "@/components/features/FeatureVisuals";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { FEATURES } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Cada celda enlaza con su composición visual por id. El texto vive en lib/content.ts. */
const VISUALS: Record<string, ReactNode> = {
  "pago-unico": <OneTimePaymentVisual />,
  reprogramar: <ReprogramVisual />,
  "sin-internet": <NoPowerVisual />,
  dispositivos: <DevicesVisual />,
  reposicion: <DurabilityVisual />,
  marca: <BrandingVisual />,
  destinos: <DestinationsVisual />,
};

/**
 * Bento de beneficios y manejo de objeciones.
 *
 * Después de la demo el ritmo baja: la entrada es un stagger corto que corre una
 * sola vez, y lo único que sigue vivo es el hover, que el visitante controla.
 */
export function Features() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cells = gsap.utils.selector(gridRef)("[data-bento-cell]");
      if (cells.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            gsap.set(cells, { opacity: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            cells,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.07,
              ease: "power2.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 80%",
                once: true,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: gridRef },
  );

  return (
    <Section id="beneficios" className="border-border/60 border-t">
      <SectionIntro
        eyebrow="Por qué TAPTAG"
        pace="normal"
        title="Lo que te vas a preguntar."
        lead={
          <>
            Las mismas dudas que nos plantean en cada visita, contestadas antes de que las tengas que hacer.
          </>
        }
      />

      <div
        ref={gridRef}
        className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 lg:mt-16"
      >
        <noscript>
          <style>{`[data-bento-cell]{opacity:1 !important}`}</style>
        </noscript>

        {FEATURES.map((feature) => (
          <BentoCell
            key={feature.id}
            title={feature.title}
            description={feature.description}
            className={feature.className}
            featured={feature.featured ?? false}
            visual={VISUALS[feature.id]}
          />
        ))}
      </div>
    </Section>
  );
}
