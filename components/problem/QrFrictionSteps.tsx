"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * `elapsed` es el reloj que acompaña a la lista: no cuenta suave, salta a
 * trompicones igual que la espera real frente a un QR.
 */
const STEPS = [
  { title: "Sacar el celular", friction: "Y desbloquearlo.", elapsed: "0s" },
  {
    title: "Abrir la cámara",
    friction: "¿O era la app de códigos?",
    elapsed: "1s",
  },
  {
    title: "Apuntar y sostener",
    friction: "Sin que tiemble. Con buena luz.",
    elapsed: "3s",
  },
  {
    title: "Esperar el aviso",
    friction: "A veces sale. A veces no.",
    elapsed: "5s",
  },
  { title: "Tocar el enlace", friction: "Y esperar a que cargue.", elapsed: "8s" },
] as const;

const FINAL_ELAPSED = STEPS[STEPS.length - 1].elapsed;

/**
 * Separación entre pasos, en segundos. Va muy por encima de un stagger de UI
 * (0.06-0.1s) a propósito: la espera es el argumento.
 */
const STEP_GAP = 0.42;
/** Titubeo extra antes del último paso, el que más gente abandona. */
const LAST_STEP_HESITATION = 0.5;

export interface QrFrictionStepsProps {
  className?: string;
}

/**
 * Los cinco pasos del QR, apareciendo con un stagger deliberadamente lento.
 *
 * No es un adorno: la sección no explica que el QR es tedioso, lo hace sentir.
 * Por eso el ease es pesado, el reloj salta a trompicones y el último paso
 * titubea antes de entrar.
 *
 * Arranca al entrar al viewport y **no** se repite: volver a verla en cada
 * scroll pasaría de argumento a molestia.
 */
export function QrFrictionSteps({ className }: QrFrictionStepsProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const select = gsap.utils.selector(rootRef);
      const steps = select("[data-step]");
      const connectors = select("[data-connector]");
      const timer = select("[data-timer]")[0];

      if (steps.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            gsap.set(steps, { opacity: 1, y: 0 });
            gsap.set(connectors, { scaleY: 1 });
            if (timer) timer.textContent = FINAL_ELAPSED;
            return;
          }

          // El marcado trae el total (es el dato verdadero si JS no corre).
          // Lo bajamos a cero al montar, no al disparar el scroll, o se vería
          // el valor final saltando hacia atrás cuando la sección entra.
          if (timer) timer.textContent = STEPS[0].elapsed;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 75%",
              once: true,
            },
          });

          steps.forEach((step, index) => {
            const isLast = index === STEPS.length - 1;
            const at =
              index * STEP_GAP + (isLast ? LAST_STEP_HESITATION : 0);

            timeline
              .call(
                () => {
                  if (timer) timer.textContent = STEPS[index].elapsed;
                },
                undefined,
                at,
              )
              .fromTo(
                step,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
                at,
              );

            const connector = connectors[index];
            if (connector) {
              timeline.fromTo(
                connector,
                { scaleY: 0 },
                {
                  scaleY: 1,
                  duration: STEP_GAP + 0.3,
                  ease: "power1.inOut",
                },
                at + 0.2,
              );
            }
          });
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <noscript>
        {/* Sin JS la timeline nunca corre: los pasos quedan a la vista. */}
        <style>{`[data-step]{opacity:1 !important}[data-connector]{transform:none !important}`}</style>
      </noscript>

      <div className="border-border mb-6 flex items-baseline justify-between border-b pb-3">
        <span className="text-muted text-[0.6875rem] tracking-[0.18em] uppercase">
          Lo que le pides a tu cliente
        </span>
        <span className="text-dim font-display text-sm tabular-nums">
          <span data-timer>{FINAL_ELAPSED}</span>
        </span>
      </div>

      <ol className="flex flex-col">
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;

          return (
            <li
              key={step.title}
              data-step
              style={{ opacity: 0 }}
              className="grid grid-cols-[1.75rem_1fr] gap-x-4"
            >
              <div className="flex flex-col items-center">
                <span className="border-border text-muted flex size-7 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums">
                  {index + 1}
                </span>

                {!isLast && (
                  <span
                    data-connector
                    style={{ transform: "scaleY(0)" }}
                    className="bg-border my-1 w-px flex-1 origin-top"
                  />
                )}
              </div>

              <div className={cn("pt-0.5", isLast ? "pb-0" : "pb-7")}>
                <p className="text-text text-base font-medium">{step.title}</p>
                <p className="text-muted mt-1 text-sm">{step.friction}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
