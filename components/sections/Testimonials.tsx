import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { TESTIMONIALS, hasPublishableTestimonials } from "@/lib/content";
import type { Testimonial } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Iniciales para cuando todavía no hay foto del negocio. */
function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Prueba social. Tratamiento sobrio a propósito: un testimonio convence por lo
 * que dice, no por cómo entra a cuadro.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │  ATENCIÓN: los tres testimonios son PLACEHOLDER, ninguno es de un      │
 * │  negocio real. Mientras `hasPublishableTestimonials()` sea falso esta  │
 * │  sección NO se renderiza: en desarrollo deja un aviso en su lugar y en │
 * │  producción desaparece. Sustitúyelos por citas verificables y con      │
 * │  permiso del negocio en `lib/content.ts` y la sección se enciende sola.│
 * └────────────────────────────────────────────────────────────────────────┘
 */
export function Testimonials() {
  if (!hasPublishableTestimonials()) {
    // En producción no se publica nada; en desarrollo queda el recordatorio.
    if (process.env.NODE_ENV === "production") return null;

    return (
      <Section id="testimonios" className="border-border/60 border-t">
        <p className="border-accent/40 bg-surface text-muted rounded-chip border border-dashed p-5 text-sm">
          <span className="text-text font-medium">
            Sección de testimonios suprimida.
          </span>{" "}
          Los tres testimonios de <code className="text-accent">lib/content.ts</code>{" "}
          siguen siendo de relleno, así que la sección no se renderiza (ni aquí
          ni en producción). Escribe citas reales y volverá sola.
        </p>
      </Section>
    );
  }

  return (
    <Section id="testimonios" className="border-border/60 border-t">
      <SectionIntro
        eyebrow="Lo que dicen"
        pace="normal"
        title="Restaurantes que ya cambiaron el QR."
      />

      {/*
        En móvil es un carril con scroll-snap nativo. No lleva
        `data-lenis-prevent`: Lenis corre con `syncTouch: false`, así que no
        toca los gestos táctiles y el carril se desplaza solo.
      */}
      <ul
        className={cn(
          "mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 lg:mt-16",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0",
        )}
      >
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </ul>
    </Section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <li
      data-testimonial
      className="border-border bg-surface/30 flex w-[85vw] max-w-sm shrink-0 snap-center flex-col rounded-card border p-7 md:w-auto md:max-w-none md:shrink"
    >
      <blockquote className="text-text flex-1 text-base leading-relaxed">
        “{testimonial.quote}”
      </blockquote>

      <div className="border-border/60 mt-7 flex items-center gap-4 border-t pt-6">
        <span
          aria-hidden
          className="border-border bg-surface-2 text-muted font-display grid size-11 shrink-0 place-items-center rounded-full border text-sm font-semibold"
        >
          {initialsOf(testimonial.name)}
        </span>

        <div className="min-w-0">
          <p className="text-text truncate text-sm font-medium">
            {testimonial.name}
          </p>
          <p className="text-muted truncate text-xs">
            {testimonial.role} · {testimonial.business}
          </p>
          <p className="text-dim truncate text-xs">{testimonial.area}</p>
        </div>
      </div>
    </li>
  );
}
