"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { HeroBackground } from "@/components/hero/HeroBackground";
import { NfcTapVisual } from "@/components/hero/NfcTapVisual";
import { ScrollIndicator } from "@/components/hero/ScrollIndicator";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { WHATSAPP_MESSAGES, buildWhatsAppUrl } from "@/lib/constants";

gsap.registerPlugin(useGSAP);

/** Ancla de la sección siguiente: la demo QR vs NFC. */
const DEMO_ANCHOR = "#demo";

const TRUST_POINTS = [
  "Compra única",
  "Funciona en iPhone 7+ y Android",
  "Hecho en Guadalajara",
] as const;

/**
 * Las dos consultas son complementarias a propósito: `mm.add` solo ejecuta el
 * callback si ALGUNA condición hace match, así que con una sola query la rama
 * animada nunca correría.
 */
const REDUCED_MOTION_CONDITIONS = {
  reduce: "(prefers-reduced-motion: reduce)",
  motion: "(prefers-reduced-motion: no-preference)",
};

/**
 * Primera pantalla. Responde qué es esto, qué gano y qué hago ahora, con el
 * producto a la derecha haciendo lo único que hay que entender: un tap.
 *
 * El estado inicial va en el marcado, no lo aplica JS: si lo pusiera la
 * timeline al hidratar, el HTML del servidor se pintaría completo y visible y
 * luego se apagaría de golpe para animarse.
 *
 * El titular es la excepción y se pinta LEGIBLE desde el primer frame, solo
 * desplazado 14px. El sitio es el destino de una demostración física: cuando el
 * gerente acerca el celular al sticker, el titular tiene que estar ahí aunque el
 * JS no haya llegado. Por eso no lleva reveal por palabras con SplitText: ese
 * efecto exige esconder el texto hasta que carguen JS y tipografía, y en 3G eso
 * eran casi seis segundos de titular invisible.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  /**
   * Dos efectos separados a propósito.
   *
   * Los fundidos NO dependen de la tipografía, así que arrancan en cuanto
   * hidrata: si esperaran a `document.fonts.ready` como antes, el subhead
   * —que es el elemento más grande y por tanto el LCP— tardaba más de un
   * segundo extra en pintarse con red lenta.
   */
  useGSAP(
    () => {
      const select = gsap.utils.selector(rootRef);
      const badge = select("[data-hero='badge']");
      const subhead = select("[data-hero='subhead']");
      const ctas = select("[data-hero='cta']");
      const trust = select("[data-hero='trust']");
      const hint = select("[data-hero='hint']");
      const visual = select("[data-hero='visual']");
      const headline = select("[data-hero='headline']");
      const fadeIn = [...badge, ...subhead, ...ctas, ...trust, ...hint];

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION_CONDITIONS, (context) => {
        const { reduce } = context.conditions as { reduce: boolean };

        if (reduce) {
          gsap.set([...fadeIn, ...visual, ...headline], {
            opacity: 1,
            y: 0,
            scale: 1,
          });
          gsap.set(subhead, { y: 0 });
          return;
        }

        const rise = { opacity: 0, y: 18 };
        const settled = { opacity: 1, y: 0 };

        gsap
          .timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
          .fromTo(badge, rise, settled, 0)
          // Solo `y`: el titular ya está pintado y legible desde el primer
          // frame, así que la entrada lo acompaña en vez de revelarlo.
          .fromTo(headline, { y: 14 }, { y: 0 }, 0.15)
          // Solo `y`, sin opacidad: el subhead es el bloque de texto más grande
          // y por tanto el candidato a LCP. Arrancando en `opacity: 0` el
          // navegador no podía medirlo hasta después de hidratar; con un
          // desplazamiento se pinta desde el primer frame.
          .fromTo(subhead, { y: 18 }, { y: 0 }, 0.45)
          .fromTo(
            visual,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 1 },
            0.5,
          )
          .fromTo(ctas, rise, { ...settled, stagger: 0.08 }, 0.6)
          .fromTo(trust, rise, settled, 0.75)
          .fromTo(hint, rise, settled, 0.95);
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      id="inicio"
      ref={rootRef}
      className="relative flex min-h-dvh items-center overflow-hidden pt-20 pb-16 md:pt-24 md:pb-24"
    >
      <noscript>
        {/* Sin JS la timeline nunca corre: todo vuelve a opacidad completa. */}
        <style>{`[data-hero]{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      <HeroBackground />

      <Section
        as="div"
        className="relative w-full py-0 md:py-0"
        innerClassName="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8"
      >
        <div className="flex flex-col items-start">
          <p
            data-hero="badge"
            style={{ opacity: 0 }}
            className="border-border text-muted rounded-pill flex items-center gap-2 border px-3.5 py-1.5 text-[0.6875rem] tracking-[0.14em] uppercase"
          >
            <span
              aria-hidden
              className="bg-gradient-brand size-1.5 shrink-0 rounded-full"
            />
            Adiós al QR · Hola al tap
          </p>

          <h1
            data-hero="headline"
            style={{ transform: "translateY(14px)" }}
            className="font-display mt-6 text-6xl leading-[0.92] font-semibold tracking-[-0.03em] sm:text-7xl lg:text-8xl"
          >
            Un tap. Y ya.
          </h1>

          <p
            data-hero="subhead"
            style={{ transform: "translateY(18px)" }}
            className="text-muted mt-6 max-w-lg text-base leading-relaxed sm:text-lg"
          >
            Stickers y displays NFC premium para tu restaurante. Tus comensales
            acercan el celular y llegan directo a tu menú o a tus reseñas de
            Google. Sin apps, sin fricción, sin mensualidades.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              data-hero="cta"
              style={{ opacity: 0 }}
              size="lg"
              href={buildWhatsAppUrl(WHATSAPP_MESSAGES.hero)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              Cotizar por WhatsApp
            </Button>

            <Button
              data-hero="cta"
              style={{ opacity: 0 }}
              variant="secondary"
              size="lg"
              href={DEMO_ANCHOR}
              className="w-full sm:w-auto"
            >
              Ver cómo funciona
            </Button>
          </div>

          <ul
            data-hero="trust"
            style={{ opacity: 0 }}
            className="text-muted mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs"
          >
            {TRUST_POINTS.map((point, index) => (
              <li key={point} className="flex items-center gap-3">
                {index > 0 && (
                  <span aria-hidden className="bg-border size-1 rounded-full" />
                )}
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div
          data-hero="visual"
          style={{ opacity: 0 }}
          className="mt-2 justify-self-center lg:mt-0 lg:justify-self-end"
        >
          <NfcTapVisual />
        </div>
      </Section>

      <ScrollIndicator href={DEMO_ANCHOR} />
    </section>
  );
}
