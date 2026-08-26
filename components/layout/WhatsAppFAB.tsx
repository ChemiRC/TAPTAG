"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_MESSAGES, buildWhatsAppUrl } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/** Fracción del viewport que hay que recorrer antes de mostrar el FAB. */
const REVEAL_RATIO = 0.8;

const LABEL = "¿Dudas? Escríbenos";

/**
 * Botón flotante de WhatsApp. Aparece pasado el primer viewport —antes estorba,
 * el usuario todavía está leyendo el hero— y se va si vuelve arriba.
 *
 * En desktop, al hover el pill se destapa de derecha a izquierda con
 * `clip-path`: el texto ya está maquetado y solo se revela, así que la
 * "expansión" no toca layout. En touch nunca hay hover y queda solo el ícono.
 *
 * z-30: por debajo del header (z-50), que es donde vive el overlay del menú.
 * Sobre papel la onda deja de ser un disco de luz que se expande y pasa a ser
 * un anillo de tinta: trazo fino, sin relleno. Un disco claro sobre fondo claro
 * no se ve.
 *
 * El anillo de pulso va antes que el enlace en el DOM: ambos son elementos
 * posicionados sin z-index, así que el orden del documento basta para dejar la
 * onda detrás del botón sin depender de un stacking context frágil.
 */
export function WhatsAppFAB() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLenis(({ scroll }) => {
    setIsVisible((current) => {
      const next = scroll > window.innerHeight * REVEAL_RATIO;
      return current === next ? current : next;
    });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="whatsapp-fab"
          className="group fixed right-4 bottom-4 z-30 sm:right-6 sm:bottom-6"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {!prefersReducedMotion && (
            <span
              aria-hidden
              className="border-accent/45 rounded-pill animate-signal-ring absolute inset-0 border"
            />
          )}

          <span
            aria-hidden
            className="border-border bg-surface/90 text-text rounded-pill ease-out-expo pointer-events-none absolute inset-y-0 right-0 hidden items-center border py-0 pr-16 pl-5 text-sm whitespace-nowrap backdrop-blur-md transition-[clip-path] duration-500 [clip-path:inset(0_0_0_calc(100%_-_3.5rem)_round_9999px)] sm:flex group-hover:[clip-path:inset(0_0_0_0_round_9999px)]"
          >
            {LABEL}
          </span>

          <a
            href={buildWhatsAppUrl(WHATSAPP_MESSAGES.fab)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${LABEL} por WhatsApp`}
            className="bg-gradient-brand text-surface shadow-glow hover:shadow-glow-strong rounded-pill ease-out-expo relative flex size-14 items-center justify-center transition-shadow duration-300"
          >
            <WhatsAppIcon className="size-7" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
