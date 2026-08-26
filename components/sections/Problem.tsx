import { QrFrictionSteps } from "@/components/problem/QrFrictionSteps";
import { StaticQrVisual } from "@/components/problem/StaticQrVisual";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";

/** Ancla de la sección siguiente: la demo QR vs NFC. */
const DEMO_ANCHOR = "#demo";

/**
 * Problema y agitación del PAS. El "solve" es la Fase 4.
 *
 * Deliberadamente fría: sin acento de marca, sin retícula, sin resplandor. El
 * contraste cromático con el hero —y con la solución que viene después— es
 * parte del argumento, así que el cian y el violeta solo reaparecen en la línea
 * puente, como anticipo.
 */
export function Problem() {
  return (
    <Section id="problema" className="border-border/60 border-t">
      <SectionIntro
        eyebrow="El problema"
        pace="lenta"
        title="Tus clientes felices se van sin dejar reseña."
        lead={
          <>
            No es que no quieran. Es que se los pusiste difícil.
          </>
        }
      />

      <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:mt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <QrFrictionSteps />

        <div className="flex flex-col items-center gap-8 lg:sticky lg:top-32">
          <StaticQrVisual />
        </div>
      </div>

      <Reveal className="border-border/60 mt-16 max-w-2xl border-t pt-10 lg:mt-20">
        <p className="font-display text-2xl leading-snug font-semibold sm:text-3xl">
          Cinco pasos. Y la mitad se rinde antes del último.
        </p>
        <p className="text-muted mt-4 text-base sm:text-lg">
          Cada reseña que no dejaron es un cliente nuevo que se fue con el de
          enfrente.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="border-border bg-surface/40 mt-12 flex max-w-3xl flex-col gap-6 rounded-card border p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-10"
      >
        <p className="font-display text-text shrink-0 text-6xl leading-none font-semibold tabular-nums sm:text-7xl">
          <CountUp to={60} duration={2.2} suffix="" />
          <span className="text-muted ml-2 text-2xl font-medium sm:text-3xl">
            segundos
          </span>
        </p>

        <p className="text-muted max-w-md type-body">
          Es la ventana real que tienes para pedir una reseña después de una
          buena comida. Con el QR, se te va en el intento.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="text-dim mt-6 max-w-2xl text-xs leading-relaxed">
          Las cifras de abandono y de ventana de reseña son estimaciones de la
          industria NFC, no de un estudio independiente. Las citamos como orden
          de magnitud, no como medición.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-16 lg:mt-20">
        <a
          href={DEMO_ANCHOR}
          className="group text-text hover:text-accent inline-flex flex-col gap-4 transition-colors duration-300"
        >
          <span className="font-display text-2xl font-semibold sm:text-3xl">
            Hay una forma más simple. Y solo toma un tap.
          </span>

          <span className="text-muted group-hover:text-accent flex items-center gap-3 text-[0.6875rem] tracking-[0.2em] uppercase transition-colors duration-300">
            Míralo funcionando
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              className="text-accent/45 size-3.5 transition-transform duration-300 ease-out group-hover:translate-y-1 group-hover:text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
            </svg>
          </span>
        </a>
      </Reveal>
    </Section>
  );
}
