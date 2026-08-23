"use client";

import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";

import { Button } from "@/components/ui/Button";
import {
  NAV_LINKS,
  SITE,
  WHATSAPP_MESSAGES,
  buildWhatsAppUrl,
} from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function buildVariants(prefersReducedMotion: boolean): {
  panel: Variants;
  item: Variants;
} {
  if (prefersReducedMotion) {
    return {
      panel: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
      item: { hidden: { opacity: 1 }, visible: { opacity: 1 } },
    };
  }

  return {
    panel: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: EASE_OUT_EXPO,
          delayChildren: 0.08,
          staggerChildren: 0.06,
        },
      },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    },
    item: {
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT_EXPO } },
    },
  };
}

export interface MobileMenuProps {
  /** Debe coincidir con el `aria-controls` del botón que lo abre. */
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Overlay de navegación para <768px. Se monta como hermano del `<header>` en
 * z-40: por encima de la página y del FAB (z-30), por debajo de la barra
 * (z-50), así el logo y el botón de cerrar siguen visibles y accesibles.
 *
 * Hermano y no hijo a propósito: el header lleva `backdrop-filter`, y eso lo
 * volvería bloque contenedor de cualquier descendiente `fixed`, encogiendo el
 * overlay al alto de la barra.
 *
 * Cierra con Escape, con clic en cualquier parte y al elegir un enlace.
 */
export function MobileMenu({ id, isOpen, onClose }: MobileMenuProps) {
  const lenis = useLenis();
  const prefersReducedMotion = usePrefersReducedMotion();
  const pendingHashRef = useRef<string | null>(null);
  const variants = buildVariants(prefersReducedMotion);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  /**
   * El scroll se difiere hasta que el panel terminó de salir: mientras está
   * abierto el scroll está bloqueado y el `scrollTo` de Lenis se ignoraría.
   */
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    pendingHashRef.current = href;
    onClose();
  };

  const handleExitComplete = () => {
    const hash = pendingHashRef.current;
    pendingHashRef.current = null;
    if (!hash) return;

    if (lenis) lenis.scrollTo(hash);
    else document.querySelector(hash)?.scrollIntoView();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          id={id}
          className="bg-bg fixed inset-0 z-40 md:hidden"
          variants={variants.panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <nav
            aria-label="Navegación móvil"
            className="flex h-dvh flex-col justify-center gap-1 px-6 pb-16"
          >
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                variants={variants.item}
                onClick={(event) => handleLinkClick(event, link.href)}
                className="font-display text-text/90 hover:text-text flex min-h-14 items-center text-4xl font-semibold tracking-tight transition-colors duration-300"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.div variants={variants.item} className="mt-10">
              <Button
                size="lg"
                href={buildWhatsAppUrl(WHATSAPP_MESSAGES.nav)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                Cotizar por WhatsApp
              </Button>
              <p className="text-muted mt-4 text-sm">
                Te contestamos el mismo día. {SITE.city}.
              </p>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
