"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";

import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/Button";
import {
  NAV_LINKS,
  SITE,
  WHATSAPP_MESSAGES,
  buildWhatsAppUrl,
} from "@/lib/constants";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/** Píxeles de scroll antes de que la barra se vuelva opaca. */
const SCROLL_THRESHOLD = 40;
const MOBILE_MENU_ID = "menu-navegacion-movil";

/**
 * Barra de navegación fija. Sigue el principio de 1:1 attention ratio: tres
 * anclas discretas y un único objetivo de conversión, WhatsApp.
 *
 * Arranca transparente y a los 40px de scroll pasa a vidrio esmerilado con
 * borde inferior. El estado es un booleano, no la posición: el callback de
 * Lenis corre cada frame pero solo dispara render al cruzar el umbral.
 */
export function Navbar() {
  const chromeRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // La trampa de foco cuelga del wrapper, que envuelve barra y overlay: así el
  // botón de cerrar y el CTA siguen alcanzables con Tab desde el menú abierto.
  useFocusTrap(chromeRef, isMenuOpen);

  useLenis(({ scroll }) => {
    setIsScrolled((current) => {
      const next = scroll > SCROLL_THRESHOLD;
      return current === next ? current : next;
    });
  }, []);

  // La página puede cargar ya scrolleada: recarga a media página, o volver atrás.
  useEffect(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  const hasSolidBackground = isScrolled || isMenuOpen;

  return (
    /**
     * Wrapper sin estilos: al no tener transform, filtro ni z-index no crea
     * stacking context ni bloque contenedor, así que barra y overlay siguen
     * posicionándose contra el viewport. Solo existe para que la trampa de
     * foco pueda abarcar a los dos.
     */
    <div ref={chromeRef}>
      <motion.header
        initial={prefersReducedMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "ease-out-expo fixed inset-x-0 top-0 z-50 border-b duration-500",
          "transition-[background-color,border-color,backdrop-filter]",
          hasSolidBackground
            ? "border-border bg-surface/70 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 px-5 sm:px-8 md:h-20 lg:px-12"
        >
          <a
            href="#inicio"
            aria-label={`${SITE.name}, ir al inicio`}
            className="text-text rounded-pill -m-2 p-2"
          >
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted hover:text-text rounded-pill inline-block px-4 py-2 text-sm transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              href={buildWhatsAppUrl(WHATSAPP_MESSAGES.nav)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sm:hidden">Cotizar</span>
              <span className="hidden sm:inline">Cotizar por WhatsApp</span>
            </Button>

            <MenuToggle
              isOpen={isMenuOpen}
              controls={MOBILE_MENU_ID}
              onToggle={() => setIsMenuOpen((open) => !open)}
            />
          </div>
        </nav>
      </motion.header>

      <MobileMenu
        id={MOBILE_MENU_ID}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

interface MenuToggleProps {
  isOpen: boolean;
  controls: string;
  onToggle: () => void;
}

/**
 * Hamburguesa que se convierte en X. Las dos barras están centradas y solo se
 * mueven con `transform`, nunca con `top`, así que la transición es de
 * compositor y el bloque CSS de reduced motion la neutraliza sola.
 */
function MenuToggle({ isOpen, controls, onToggle }: MenuToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={controls}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      className="text-text rounded-pill relative flex size-11 items-center justify-center md:hidden"
    >
      <span aria-hidden className="relative block h-4 w-5">
        <span
          className={cn(
            "bg-current ease-out-expo absolute inset-x-0 top-1/2 block h-px transition-transform duration-300",
            isOpen ? "rotate-45" : "-translate-y-1",
          )}
        />
        <span
          className={cn(
            "bg-current ease-out-expo absolute inset-x-0 top-1/2 block h-px transition-transform duration-300",
            isOpen ? "-rotate-45" : "translate-y-1",
          )}
        />
      </span>
    </button>
  );
}
