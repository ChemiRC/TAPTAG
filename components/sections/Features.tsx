"use client";

import { useRef } from "react";
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
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Cada celda responde una objeción real del dueño de restaurante, no solo
 * enumera un beneficio. El orden es el narrativo: en móvil se apilan tal cual,
 * con la destacada primero.
 */
const CELLS = [
  {
    title: "Sin mensualidades",
    description:
      "Lo compras una vez y es tuyo. No hay suscripción, no hay renovación, no hay letras chiquitas.",
    className: "md:col-span-3 md:row-span-2",
    featured: true,
    visual: <OneTimePaymentVisual />,
  },
  {
    title: "Se reprograma cuando quieras",
    description:
      "Cambias de menú, de promoción o de destino sin reimprimir ni volver a comprar.",
    className: "md:col-span-3",
    visual: <ReprogramVisual />,
  },
  {
    title: "Funciona sin internet propio",
    description:
      "El sticker no necesita conexión ni batería. Solo el celular de tu cliente.",
    className: "md:col-span-3",
    visual: <NoPowerVisual />,
  },
  {
    title: "iPhone 7+ y Android",
    description: "Prácticamente cualquier celular de los últimos años.",
    className: "md:col-span-2",
    visual: <DevicesVisual />,
  },
  {
    title: "Aguanta el uso diario",
    description: "Resistente a líquidos, grasa y limpieza constante.",
    className: "md:col-span-2",
    visual: <DurabilityVisual />,
  },
  {
    title: "Con tu logo y tus colores",
    description:
      "Diseñado para que se vea como parte de tu marca, no como un accesorio.",
    className: "md:col-span-2",
    visual: <BrandingVisual />,
  },
  {
    title: "Menú digital o reseñas de Google",
    description: "Tú decides a dónde llevan. O ambos, con stickers distintos.",
    className: "md:col-span-6",
    visual: <DestinationsVisual />,
  },
] as const;

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
      <Reveal className="max-w-2xl">
        <p className="text-muted text-[0.6875rem] tracking-[0.2em] uppercase">
          Por qué TAPTAG
        </p>

        <h2 className="font-display mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
          Lo que te vas a preguntar.
        </h2>

        <p className="text-muted mt-5 text-lg">
          Las mismas dudas que nos plantean en cada visita, contestadas antes de
          que las tengas que hacer.
        </p>
      </Reveal>

      <div
        ref={gridRef}
        className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 lg:mt-16"
      >
        <noscript>
          <style>{`[data-bento-cell]{opacity:1 !important}`}</style>
        </noscript>

        {CELLS.map((cell) => (
          <BentoCell
            key={cell.title}
            title={cell.title}
            description={cell.description}
            className={cell.className}
            featured={"featured" in cell ? cell.featured : false}
            visual={cell.visual}
          />
        ))}
      </div>
    </Section>
  );
}
