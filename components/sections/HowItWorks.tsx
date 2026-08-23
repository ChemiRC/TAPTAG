"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { StepConnector } from "@/components/how-it-works/StepConnector";
import { NfcMarkIcon } from "@/components/icons/NfcMarkIcon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    title: "Nos dices a dónde quieres llevarlos",
    text: "A tu menú digital, a tus reseñas de Google, a tu WhatsApp o a lo que necesites. Lo dejamos listo antes de entregártelo.",
    glyph: <DestinationGlyph />,
  },
  {
    title: "Pegas el sticker donde quieras",
    text: "En la mesa, en el mostrador, en la carta física, en la terminal de pago. Se pega y ya. No necesita pilas ni internet.",
    glyph: <StickerGlyph />,
  },
  {
    title: "Tu cliente acerca el celular",
    text: "Un tap y llega. Sin abrir cámara, sin descargar nada, sin escribir. Funciona con iPhone 7 en adelante y prácticamente cualquier Android.",
    glyph: <NfcMarkIcon className="size-5" strokeWidth={2} />,
  },
] as const;

/**
 * Explicación operativa, después del pico emocional de la demo.
 *
 * El ritmo baja a propósito: nada corre en loop, nada pide interacción. Lo único
 * que se mueve es la línea que une los pasos, atada al scroll —el visitante
 * marca su propio paso— y un reveal suave por paso.
 */
export function HowItWorks() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const select = gsap.utils.selector(rootRef);
      const paths = select("[data-connector-path]");
      const steps = select("[data-step-card]");
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            gsap.set(paths, { strokeDashoffset: 0 });
            gsap.set(steps, { opacity: 1, y: 0 });
            return;
          }

          // La línea se dibuja atada al scroll. El scrub va sincronizado con
          // Lenis porque ScrollTrigger.update corre en el ticker de GSAP.
          gsap.to(paths, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              // Rango largo a propósito: con un tramo corto la línea se dibujaba
              // de golpe al pasar y se perdía la sensación de trazo.
              start: "top 88%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          });

          gsap.fromTo(
            steps,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.18,
              ease: "power2.out",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top 70%",
                once: true,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <Section id="como-funciona" className="border-border/60 border-t">
      <Reveal className="max-w-2xl">
        <p className="text-muted text-[0.6875rem] tracking-[0.2em] uppercase">
          Cómo funciona
        </p>

        <h2 className="font-display mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] sm:text-5xl lg:text-6xl">
          Tres pasos. Una sola vez.
        </h2>

        <p className="text-muted mt-5 text-lg">
          Lo instalas hoy y funciona para siempre. Sin configuración complicada,
          sin capacitar a tu equipo.
        </p>
      </Reveal>

      <div ref={rootRef} className="relative mt-16 lg:mt-20">
        <noscript>
          <style>{`[data-connector-path]{stroke-dashoffset:0 !important}[data-step-card]{opacity:1 !important}`}</style>
        </noscript>

        {/* Línea horizontal: de centro a centro del primer y último marcador. */}
        <StepConnector
          orientation="horizontal"
          className="absolute top-7 left-7 hidden h-12 -translate-y-1/2 md:block"
          // 100% menos los dos gaps, entre 3 columnas, menos medio marcador.
          style={{ right: "calc((100% - 4rem) / 3 - 1.75rem)" }}
        />

        <ol className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              data-step-card
              style={{ opacity: 0 }}
              className="relative grid grid-cols-[3.5rem_1fr] gap-x-4 md:block"
            >
              <div className="flex flex-col items-center md:block">
                <span className="border-border bg-surface text-text font-display relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border text-lg font-semibold">
                  {index + 1}
                </span>

                {index < STEPS.length - 1 && (
                  <StepConnector
                    orientation="vertical"
                    className="my-2 w-8 flex-1 md:hidden"
                  />
                )}
              </div>

              <div className="pb-2 md:mt-8 md:pb-0">
                <span className="text-accent/70 mb-3 block">{step.glyph}</span>

                <h3 className="font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Reveal delay={0.1}>
        <p className="border-border/60 text-muted mt-16 border-t pt-8 text-base lg:mt-20">
          ¿Cambias de menú?{" "}
          <span className="text-text">
            Nos avisas y lo reprogramamos. Sin reimprimir nada.
          </span>
        </p>
      </Reveal>
    </Section>
  );
}

/** Pin de destino: a dónde apunta el sticker. */
function DestinationGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/** El sticker, con su esquina levantada. */
function StickerGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7l-7 7H6a2 2 0 0 1-2-2Z" />
      <path d="M20 13h-5a2 2 0 0 0-2 2v5" />
    </svg>
  );
}
