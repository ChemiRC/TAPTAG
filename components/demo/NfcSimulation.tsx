"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { DestinationScreen } from "@/components/demo/DestinationScreen";
import { PanelHeader } from "@/components/demo/PanelHeader";
import { PhoneFrame } from "@/components/demo/PhoneFrame";
import { NfcMarkIcon } from "@/components/icons/NfcMarkIcon";
import { NfcRipple } from "@/components/ui/NfcRipple";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/** Lo que tarda el tap en llegar al destino. Es el argumento entero. */
const TAP_SECONDS = 0.35;
/** Vibración del feedback háptico, en ms. Corta: es un acuse, no una alarma. */
const HAPTIC_MS = 15;

const MESSAGES = {
  idle: "Acerca el celular",
  done: "Listo. Menos de 1 segundo.",
} as const;

export interface NfcSimulationProps {
  /** Cambia de valor para devolver el lado a su estado inicial. */
  resetToken: number;
  onComplete?: () => void;
  className?: string;
}

/**
 * El camino con TAPTAG: un gesto y ya.
 *
 * Aquí sí hay recompensa visual —onda, destello, micro-escala del sticker— pero
 * contenida: el tono es premium, no de videojuego. El destino es exactamente el
 * mismo que el del lado QR; lo único que cambia es lo que costó llegar.
 */
export function NfcSimulation({
  resetToken,
  onComplete,
  className,
}: NfcSimulationProps) {
  const [isDone, setIsDone] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLButtonElement>(null);
  const flashRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  const { contextSafe } = useGSAP({ scope: rootRef });

  const stopTimers = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const paint = useCallback((elapsed: number) => {
    if (counterRef.current) {
      counterRef.current.textContent = `${Math.min(elapsed, TAP_SECONDS).toFixed(1)}s`;
    }
  }, []);

  const playFlourish = contextSafe(() => {
    gsap
      .timeline()
      .fromTo(
        flashRef.current,
        { scale: 0.8, opacity: 0.75 },
        { scale: 2.6, opacity: 0, duration: 0.9, ease: "power2.out" },
        0,
      )
      .fromTo(
        stickerRef.current,
        { scale: 1 },
        { scale: 1.08, duration: 0.14, ease: "power2.out" },
        0,
      )
      .to(
        stickerRef.current,
        { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
        0.14,
      )
      // Recompensa contenida: un pulso del gradiente, no confeti.
      .fromTo(
        glowRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1.25, opacity: 0.55, duration: 0.35, ease: "power2.out" },
        0.1,
      )
      .to(glowRef.current, { opacity: 0, duration: 0.9, ease: "power2.out" }, 0.5);
  });

  const handleTap = useCallback(() => {
    if (isDone) return;

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(HAPTIC_MS);
    }

    if (!prefersReducedMotion) playFlourish();

    const startedAt = performance.now();
    const tick = () => {
      paint((performance.now() - startedAt) / 1000);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    timeoutRef.current = setTimeout(() => {
      stopTimers();
      paint(TAP_SECONDS);
      setIsDone(true);
      onComplete?.();
    }, TAP_SECONDS * 1000);
  }, [isDone, onComplete, paint, playFlourish, prefersReducedMotion, stopTimers]);

  const reset = useCallback(() => {
    stopTimers();
    paint(0);
    setIsDone(false);
  }, [paint, stopTimers]);

  useEffect(() => {
    reset();
  }, [resetToken, reset]);

  useEffect(() => stopTimers, [stopTimers]);

  return (
    <div ref={rootRef} className={cn("flex flex-col", className)}>
      <PanelHeader
        title="Con TAPTAG"
        tone="brand"
        counter={
          <span
            ref={counterRef}
            className="tabular-nums"
            aria-hidden
          >{`${TAP_SECONDS.toFixed(1)}s`}</span>
        }
      />

      <div className="relative mt-8 flex justify-center">
        <span
          ref={glowRef}
          aria-hidden
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
        >
          <span className="bg-gradient-brand block size-full rounded-full" />
        </span>

        <PhoneFrame className="relative">
          {isDone ? (
            <DestinationScreen />
          ) : (
            <LockedScreen reducedMotion={prefersReducedMotion} />
          )}
        </PhoneFrame>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="bg-border/60 h-px w-full overflow-hidden" aria-hidden>
          <span
            style={{ transform: isDone ? "scaleX(1)" : "scaleX(0)" }}
            className={cn(
              "bg-gradient-brand block h-full w-full origin-left",
              !prefersReducedMotion && "transition-transform duration-300",
            )}
          />
        </div>

        <p
          aria-live="polite"
          className="text-muted flex min-h-10 items-center text-sm"
        >
          {isDone ? MESSAGES.done : MESSAGES.idle}
        </p>

        <div className="flex items-center gap-4">
          <button
            ref={stickerRef}
            type="button"
            disabled={isDone}
            onClick={handleTap}
            aria-label="Acercar el celular al sticker TAPTAG"
            className="bg-gradient-brand shadow-glow rounded-card relative grid size-12 shrink-0 place-items-center p-px transition-shadow duration-300 disabled:opacity-40"
          >
            <span className="bg-surface rounded-card grid size-full place-items-center">
              <NfcMarkIcon className="text-accent size-5" strokeWidth={2.25} />
            </span>

            <NfcRipple
              count={3}
              size={52}
              duration={2.4}
              delayStep={0.45}
              loop={!isDone}
              className="-z-10"
            />

            <span
              ref={flashRef}
              aria-hidden
              style={{ opacity: 0 }}
              className="border-accent pointer-events-none absolute inset-0 -z-10 rounded-full border-2"
            />
          </button>

          <p className="text-dim text-xs">
            {isDone
              ? "Un solo gesto. Sin cámara, sin app."
              : "Tócalo. Eso es todo lo que hace tu cliente."}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Pantalla de bloqueo: el celular todavía sin hacer nada. */
function LockedScreen({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
      <NfcMarkIcon
        className={cn("text-muted/40 size-8", !reducedMotion && "animate-nfc-pulse")}
        strokeWidth={2}
      />
      <p className="text-muted text-center text-[0.5rem] tracking-[0.14em] uppercase">
        Listo para el tap
      </p>
    </div>
  );
}
