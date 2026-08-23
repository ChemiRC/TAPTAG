import { Button } from "@/components/ui/Button";
import { WHATSAPP_MESSAGES, buildWhatsAppUrl } from "@/lib/constants";
import type { Plan } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface PlanCardProps {
  plan: Plan;
}

/**
 * Tarjeta de plan. El destacado lleva borde de gradiente, distintivo y un punto
 * más de elevación; en móvil se sube al primer lugar con `order`, porque ahí
 * quedar en medio no destaca nada.
 *
 * El hover es discreto a propósito —elevación y borde— para no repetir el
 * spotlight que ya usa el bento de beneficios.
 */
export function PlanCard({ plan }: PlanCardProps) {
  const { featured = false } = plan;

  return (
    <div
      data-plan-card
      data-plan={plan.id}
      style={{ opacity: 0 }}
      className={cn(
        "flex",
        featured && "order-first lg:order-none",
      )}
    >
      <div
        className={cn(
          "ease-out-expo relative flex w-full flex-col rounded-2xl border p-7 transition-[transform,border-color,box-shadow] duration-500 sm:p-8",
          featured
            ? "border-accent/40 bg-surface/70 shadow-glow hover:shadow-glow-strong lg:-my-3 lg:py-11"
            : "border-border bg-surface/30 hover:border-muted/50 hover:-translate-y-1",
        )}
      >
        {plan.badge && (
          <span className="bg-gradient-brand text-bg rounded-pill absolute -top-3 left-7 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.14em] uppercase">
            {plan.badge}
          </span>
        )}

        <h3 className="font-display text-text text-xl font-semibold">
          {plan.name}
        </h3>
        <p className="text-muted mt-1 text-sm">{plan.tagline}</p>

        <p className="mt-6 flex items-baseline gap-2">
          <span
            className={cn(
              "font-display text-4xl font-semibold",
              plan.price ? "text-text" : "text-text text-3xl",
            )}
          >
            {plan.price ?? "Cotización"}
          </span>
        </p>
        <p className="text-dim mt-1 text-xs">{plan.priceNote}</p>

        <ul className="mt-7 flex flex-1 flex-col gap-3">
          {plan.features.map((feature) => (
            <li key={feature} className="text-muted flex gap-3 text-sm">
              <CheckGlyph />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          variant={featured ? "primary" : "secondary"}
          size="md"
          href={buildWhatsAppUrl(WHATSAPP_MESSAGES[plan.messageKey])}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 w-full"
        >
          Cotizar por WhatsApp
        </Button>
      </div>
    </div>
  );
}

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="text-accent mt-0.5 size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 8.5 3.5 3.5L13 5" />
    </svg>
  );
}
