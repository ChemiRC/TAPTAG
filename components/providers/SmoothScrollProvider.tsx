"use client";

import { useEffect, useMemo } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

// A nivel de módulo: se registra una sola vez, antes de cualquier render.
gsap.registerPlugin(ScrollTrigger);

// easeOutExpo: arranca rápido y frena largo. Sensación "cara".
const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Smooth scroll global sincronizado con GSAP.
 *
 * Un solo rAF —el ticker de GSAP— avanza Lenis y todas las animaciones, así
 * que ScrollTrigger nunca mide posiciones de un frame anterior.
 *
 * Con `prefers-reduced-motion` Lenis sigue montado (ScrollTrigger necesita sus
 * eventos) pero deja de interpolar: el scroll queda nativo, salto instantáneo.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const options = useMemo<LenisOptions>(
    () => ({
      // Lenis corre en el ticker de GSAP, no en su propio rAF.
      autoRaf: false,
      duration: 1.1,
      easing: easeOutExpo,
      smoothWheel: !prefersReducedMotion,
      // El scroll táctil nativo ya se siente bien; forzarlo empeora el pitch en celular.
      syncTouch: false,
      // Lenis intercepta los clics en <a href="#..."> y usa el
      // scroll-padding-top del <html> como offset. Con reduced motion su
      // propio scrollTo se vuelve instantáneo, sin que tengamos que pedirlo.
      anchors: true,
    }),
    [prefersReducedMotion],
  );

  return (
    <ReactLenis root options={options}>
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}

/**
 * Engancha Lenis al ticker de GSAP.
 *
 * Va en un componente hijo a propósito: `ReactLenis` crea la instancia dentro
 * de su propio efecto y la publica por contexto, así que el `ref` del padre
 * todavía está vacío cuando corren los efectos de arriba. Consumirla con
 * `useLenis()` desde adentro garantiza que el ticker se enganche en cuanto la
 * instancia existe — y con `autoRaf: false` ese enganche es lo único que
 * mueve el scroll.
 */
function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    // GSAP entrega segundos; Lenis espera milisegundos.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}
