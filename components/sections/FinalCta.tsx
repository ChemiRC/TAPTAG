import { MeshGradient } from "@/components/ui/MeshGradient";
import { NfcRipple } from "@/components/ui/NfcRipple";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SITE, WHATSAPP_MESSAGES, buildWhatsAppUrl } from "@/lib/constants";

/**
 * Último impulso, y la única sección en tinta.
 *
 * La página va papel → papel → papel → tinta. Sin ese cambio de superficie el
 * sitio se aplana: sobre claro, todo lo que sobre oscuro era resplandor deja de
 * pesar, y las ocho secciones terminan valiendo lo mismo. Aquí el fondo oscuro
 * devuelve al mesh y a las ondas grandes el sentido que tenían.
 *
 * El corte NO es un cambio de color a secas —eso se lee como error de render—
 * sino una zona de transición: el papel se va oscureciendo en los 96px previos,
 * el hairline superior lleva el gradiente de marca, y la sección arranca ya en
 * tinta. El ojo entiende que cambió de material, no que se rompió algo.
 */
export function FinalCta() {
  return (
    <>
      {/*
        Zona de transición. El papel se apaga hacia la tinta antes de que llegue
        la sección, para que el corte se lea como un cambio de superficie.
      */}
      <div
        aria-hidden
        className="from-bg to-ink h-24 w-full bg-gradient-to-b"
      />

      <Section
        id="contacto"
        className="bg-ink relative overflow-hidden py-28 md:py-36"
      >
        {/* Hairline de marca: marca el borde del material, no un borde de caja. */}
        <span
          aria-hidden
          className="bg-gradient-brand absolute inset-x-0 top-0 h-px opacity-70 [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)]"
        />

        <MeshGradient className="opacity-90" />

        {/* Ondas del tap, enormes y muy tenues, centradas detrás del mensaje. */}
        <NfcRipple
          count={4}
          size={420}
          duration={5.5}
          delayStep={1.2}
          ringClassName="border-accent-on-ink/25"
          className="-z-0"
        />

        <div className="relative flex flex-col items-center text-center">
          <Reveal>
            <h2 className="type-section-title text-bg mx-auto max-w-3xl">
              ¿Listo para que un tap te traiga más reseñas?
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-bg/70 mx-auto mt-6 max-w-lg text-lg">
              Escríbenos por WhatsApp y te cotizamos hoy mismo. Sin compromiso,
              sin llamadas de venta.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            {/*
              Botón propio y no el primario del sistema: sobre tinta, el achiote
              oscuro del gradiente desaparecería. Aquí lleva el acento claro.
            */}
            <a
              href={buildWhatsAppUrl(WHATSAPP_MESSAGES.ctaFinal)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent-on-ink text-ink rounded-pill ease-out-expo mt-10 inline-flex h-14 items-center justify-center px-8 text-base font-semibold transition-transform duration-300 hover:scale-[1.03]"
            >
              Cotizar por WhatsApp
            </a>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-bg/55 mt-6 text-xs tracking-[0.08em]">
              Respondemos en menos de 24 horas · {SITE.city}
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
