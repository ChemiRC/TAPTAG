import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { WHATSAPP_MESSAGES, buildWhatsAppUrl } from "@/lib/constants";

/**
 * Sustituye a la sección de planes.
 *
 * Los niveles de servicio y los precios todavía no están definidos, y enseñar
 * `$XXX` en la visita a un restaurante se ve peor que no tener sección. Este
 * bloque dice lo único que hoy es cierto —que el costo depende del local— y
 * manda a la conversación donde de verdad se resuelve.
 *
 * Deliberadamente ligero: sin tarjetas ni comparaciones, para no competir con
 * el CTA final, que está a dos secciones de distancia.
 */
export function Quote() {
  return (
    <Section id="cotizacion" className="border-border/60 border-t">
      <SectionIntro
        eyebrow="Cotización"
        align="center"
        title="Cada local es distinto."
        lead="El costo depende de cuántas mesas quieras cubrir y de a dónde quieras llevar a tus clientes. Escríbenos, lo vemos juntos y te damos un número el mismo día."
      />

      <Reveal delay={0.27} className="flex flex-col items-center text-center">
        <Button
          size="lg"
          href={buildWhatsAppUrl(WHATSAPP_MESSAGES.cotizacion)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-9"
        >
          Cotizar por WhatsApp
        </Button>

        <p className="text-dim mt-5 text-xs tracking-[0.08em]">
          Sin compromiso · Guadalajara y zona metropolitana
        </p>
      </Reveal>
    </Section>
  );
}
