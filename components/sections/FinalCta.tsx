import { Button } from "@/components/ui/Button";
import { MeshGradient } from "@/components/ui/MeshGradient";
import { NfcRipple } from "@/components/ui/NfcRipple";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SITE, WHATSAPP_MESSAGES, buildWhatsAppUrl } from "@/lib/constants";

/**
 * Último impulso. Aquí la intensidad visual vuelve a subir: es el mismo mesh de
 * marca del hero más ondas NFC a gran escala, para que el sitio cierre con el
 * lenguaje con el que abrió.
 */
export function FinalCta() {
  return (
    <Section
      id="contacto"
      className="border-border/60 overflow-hidden border-t py-28 md:py-36"
    >
      <MeshGradient className="opacity-80" />

      {/* Ondas del tap, enormes y muy tenues, centradas detrás del mensaje. */}
      <NfcRipple
        count={4}
        size={420}
        duration={5.5}
        delayStep={1.2}
        ringClassName="border-accent/15"
        className="-z-0"
      />

      <div className="relative flex flex-col items-center text-center">
        <Reveal>
          <h2 className="font-display mx-auto max-w-3xl text-4xl leading-[1.03] font-semibold tracking-[-0.025em] sm:text-5xl lg:text-6xl">
            ¿Listo para que un tap te traiga más reseñas?
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-muted mx-auto mt-6 max-w-lg text-lg">
            Escríbenos por WhatsApp y te cotizamos hoy mismo. Sin compromiso, sin
            llamadas de venta.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <Button
            size="lg"
            href={buildWhatsAppUrl(WHATSAPP_MESSAGES.ctaFinal)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10"
          >
            Cotizar por WhatsApp
          </Button>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="text-dim mt-6 text-xs tracking-[0.08em]">
            Respondemos en menos de 24 horas · {SITE.city}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
