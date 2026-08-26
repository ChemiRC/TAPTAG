import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Logo } from "@/components/layout/Logo";
import { Section } from "@/components/ui/Section";
import {
  NAV_LINKS,
  SITE,
  WHATSAPP_MESSAGES,
  buildWhatsAppUrl,
} from "@/lib/constants";

const LINK_CLASSES =
  "text-bg/70 hover:text-bg inline-flex items-center gap-2 text-sm transition-colors duration-300";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Section as="footer" className="bg-ink text-bg py-16 md:py-20">
      {/* Hairline con el gradiente de marca, desvanecido en los extremos. */}
      <div
        aria-hidden
        className="bg-gradient-brand absolute inset-x-0 top-0 h-px opacity-60 [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)]"
      />

      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr] md:gap-8">
        <div className="flex flex-col items-start gap-4">
          <Logo />
          <p className="text-bg/70 max-w-xs text-sm">
            Cambia el QR impreso por un tap. Tu menú y tus reseñas, a un
            acercamiento de celular.
          </p>
          <p className="text-bg/70 text-sm">
            Hecho en Guadalajara, Jalisco <span aria-hidden>🇲🇽</span>
          </p>
        </div>

        <nav aria-label="Navegación del pie de página">
          <h2 className="font-display text-bg mb-4 text-xs tracking-[0.2em] uppercase">
            Explora
          </h2>
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={LINK_CLASSES}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-bg mb-4 text-xs tracking-[0.2em] uppercase">
            Contacto
          </h2>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href={buildWhatsAppUrl(WHATSAPP_MESSAGES.footer)}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASSES}
              >
                <WhatsAppIcon className="text-accent size-4" />
                WhatsApp
              </a>
            </li>
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className={LINK_CLASSES}>
                  {SITE.email}
                </a>
              </li>
            )}
            <li className="text-bg/70 text-sm">{SITE.city}</li>
          </ul>
        </div>
      </div>

      <div className="border-bg/15 mt-14 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-bg/55 text-xs">
          © {year} {SITE.name}. Todos los derechos reservados.
        </p>
        <Link
          href="/aviso-de-privacidad"
          className="text-bg/55 hover:text-bg text-xs transition-colors duration-300"
        >
          Aviso de Privacidad
        </Link>
      </div>
    </Section>
  );
}
