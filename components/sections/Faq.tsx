import { FaqItem } from "@/components/faq/FaqItem";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { WHATSAPP_MESSAGES, buildWhatsAppUrl } from "@/lib/constants";
import { FAQS } from "@/lib/content";

export function Faq() {
  return (
    <Section id="faq" className="border-border/60 border-t">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="text-muted text-[0.6875rem] tracking-[0.2em] uppercase">
            Preguntas
          </p>

          <h2 className="font-display mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.02em] sm:text-5xl">
            Lo que nos preguntan siempre.
          </h2>

          <p className="text-muted mt-6 text-base">
            ¿Otra duda?{" "}
            <a
              href={buildWhatsAppUrl(WHATSAPP_MESSAGES.faq)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-text underline underline-offset-4 transition-colors duration-300"
            >
              Escríbenos y te contestamos hoy mismo.
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="border-border/60 border-t">
            {FAQS.map((faq) => (
              <FaqItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
