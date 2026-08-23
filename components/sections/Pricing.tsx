"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PlanCard } from "@/components/pricing/PlanCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { PLANS } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Planes. Sin contadores de urgencia ni "quedan X lugares": el argumento es que
 * se paga una vez, y eso no necesita presión inventada.
 */
export function Pricing() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.selector(gridRef)("[data-plan-card]");
      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            gsap.set(cards, { opacity: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
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
    <Section id="planes" className="border-border/60 border-t">
      <Reveal className="max-w-2xl">
        <p className="text-muted text-[0.6875rem] tracking-[0.2em] uppercase">
          Planes
        </p>

        <h2 className="font-display mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
          Precios claros. Compra única.
        </h2>

        <p className="text-muted mt-5 text-lg">
          Contratas el servicio una vez: instalación, configuración y los
          cambios que necesites después. Sin suscripción ni costos escondidos.
        </p>
      </Reveal>

      <div
        ref={gridRef}
        // Sin `items-start`: la retícula estira las tres tarjetas al mismo alto y
        // los pies quedan alineados. El plan destacado se sale por arriba y por
        // abajo con su propio margen negativo.
        className="mt-14 grid grid-cols-1 gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-8"
      >
        <noscript>
          <style>{`[data-plan-card]{opacity:1 !important}`}</style>
        </noscript>

        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="text-dim mt-10 max-w-2xl text-xs leading-relaxed">
          Los precios varían según el alcance y la personalización. Escríbenos y
          te cotizamos sin compromiso.
        </p>
      </Reveal>
    </Section>
  );
}
