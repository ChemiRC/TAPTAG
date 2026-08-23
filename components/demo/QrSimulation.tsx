"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { DestinationScreen } from "@/components/demo/DestinationScreen";
import { PanelHeader } from "@/components/demo/PanelHeader";
import { PhoneFrame } from "@/components/demo/PhoneFrame";
import { QrPattern } from "@/components/problem/StaticQrVisual";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Cada paso ocupa la misma quinta parte de la barra pero dura distinto, así que
 * el avance sale irregular solo: se arrastra en "Buscando el código" y pega un
 * brinco en "Código detectado". No hace falta simular el tirón aparte.
 */
const QR_STEPS = [
  { message: "Abriendo la cámara…", duration: 1.3 },
  { message: "Enfocando…", duration: 1.7 },
  { message: "Buscando el código…", duration: 2.3 },
  { message: "Código detectado", duration: 0.7 },
  { message: "Cargando la página…", duration: 1.6 },
] as const;

const TOTAL_SECONDS = QR_STEPS.reduce((sum, step) => sum + step.duration, 0);

/** Inicio acumulado de cada paso, en segundos. */
const STEP_OFFSETS = QR_STEPS.reduce<number[]>(
  (offsets, step) => [...offsets, offsets[offsets.length - 1] + step.duration],
  [0],
);

/** A partir del tercer intento soltar ya no reinicia, solo pausa. */
const FORGIVING_AFTER_FAILURES = 2;

const MESSAGES = {
  idle: "Toca para empezar",
  holding: "Ahora escanea…",
  slipped: "Se movió. Vuelve a intentar.",
  paused: "Se te movió tantito. Vuelve a sostener para seguir.",
  done: "Listo. Tardaste 8 segundos.",
} as const;

type Phase = "idle" | "holding" | "paused" | "slipped" | "done";

export interface QrSimulationProps {
  /** Cambia de valor para devolver el lado a su estado inicial. */
  resetToken: number;
  onComplete?: () => void;
  className?: string;
}

/**
 * El camino del QR, con su espera real.
 *
 * Hay que **sostener** el botón, como se sostiene el celular apuntando: si
 * sueltas antes de tiempo se reinicia. Es fricción legítima, no un castigo —
 * y por eso lleva dos seguros: "Saltar demo del QR" siempre visible, y a partir
 * del tercer intento soltar solo pausa en vez de reiniciar.
 *
 * La barra y el contador se escriben directo en el DOM desde el rAF: pasarlos
 * por estado serían 60 renders por segundo para animar un `transform`.
 */
export function QrSimulation({
  resetToken,
  onComplete,
  className,
}: QrSimulationProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [failures, setFailures] = useState(0);

  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  /** Segundos ya acumulados, para poder reanudar en modo indulgente. */
  const heldRef = useRef(0);
  const resumedAtRef = useRef(0);

  const prefersReducedMotion = usePrefersReducedMotion();
  const isForgiving = failures >= FORGIVING_AFTER_FAILURES;

  const stopFrame = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const paint = useCallback((elapsed: number) => {
    const clamped = Math.min(elapsed, TOTAL_SECONDS);
    let index = STEP_OFFSETS.findIndex((offset) => clamped < offset) - 1;
    if (index < 0) index = QR_STEPS.length - 1;

    const withinStep =
      (clamped - STEP_OFFSETS[index]) / QR_STEPS[index].duration;
    const progress = (index + Math.min(withinStep, 1)) / QR_STEPS.length;

    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${progress})`;
    }
    if (counterRef.current) {
      counterRef.current.textContent = `${Math.round(clamped)}s`;
    }
    return index;
  }, []);

  const finish = useCallback(() => {
    stopFrame();
    heldRef.current = TOTAL_SECONDS;
    paint(TOTAL_SECONDS);
    setStepIndex(QR_STEPS.length - 1);
    setPhase("done");
    onComplete?.();
  }, [onComplete, paint, stopFrame]);

  const reset = useCallback(() => {
    stopFrame();
    heldRef.current = 0;
    paint(0);
    setStepIndex(0);
    setPhase("idle");
    setFailures(0);
  }, [paint, stopFrame]);

  const tick = useCallback(() => {
    const elapsed =
      heldRef.current + (performance.now() - resumedAtRef.current) / 1000;

    if (elapsed >= TOTAL_SECONDS) {
      finish();
      return;
    }

    setStepIndex(paint(elapsed));
    frameRef.current = requestAnimationFrame(tick);
  }, [finish, paint]);

  const startHolding = useCallback(() => {
    if (phase === "done") return;
    resumedAtRef.current = performance.now();
    setPhase("holding");
    stopFrame();
    frameRef.current = requestAnimationFrame(tick);
  }, [phase, stopFrame, tick]);

  const releaseHold = useCallback(() => {
    if (frameRef.current === null) return;

    stopFrame();
    const elapsed =
      heldRef.current + (performance.now() - resumedAtRef.current) / 1000;

    if (elapsed >= TOTAL_SECONDS) {
      finish();
      return;
    }

    if (isForgiving) {
      // Tercer intento en adelante: se guarda el avance en vez de castigarlo.
      heldRef.current = elapsed;
      setPhase("paused");
      return;
    }

    heldRef.current = 0;
    paint(0);
    setStepIndex(0);
    setFailures((count) => count + 1);
    setPhase("slipped");
  }, [finish, isForgiving, paint, stopFrame]);

  // Reinicio pedido desde la sección, y limpieza al desmontar.
  useEffect(() => {
    reset();
  }, [resetToken, reset]);

  useEffect(() => stopFrame, [stopFrame]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    // Al mantener la tecla el navegador repite el evento; solo importa el primero.
    if (event.repeat || frameRef.current !== null) return;
    startHolding();
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    releaseHold();
  };

  const isDone = phase === "done";
  const message = isDone
    ? MESSAGES.done
    : phase === "holding"
      ? QR_STEPS[stepIndex].message
      : MESSAGES[phase];

  return (
    <div className={cn("flex flex-col", className)}>
      <PanelHeader
        title="Con código QR"
        tone="muted"
        counter={
          <span
            ref={counterRef}
            className="tabular-nums"
            aria-hidden
          >{`${Math.round(TOTAL_SECONDS)}s`}</span>
        }
      />

      <div className="relative mt-8 flex justify-center">
        <PhoneFrame>
          {isDone ? (
            <DestinationScreen />
          ) : (
            <Viewfinder
              active={phase === "holding"}
              reducedMotion={prefersReducedMotion}
            />
          )}
        </PhoneFrame>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div
          className="bg-border/60 h-px w-full overflow-hidden"
          aria-hidden
        >
          <span
            ref={progressRef}
            style={{ transform: "scaleX(0)" }}
            className="bg-muted block h-full w-full origin-left"
          />
        </div>

        <p
          aria-live="polite"
          className="text-muted flex min-h-10 items-center text-sm"
        >
          {message}
        </p>

        <button
          type="button"
          data-qr-hold
          disabled={isDone}
          onPointerDown={startHolding}
          onPointerUp={releaseHold}
          onPointerLeave={releaseHold}
          onPointerCancel={releaseHold}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          className="border-border text-text hover:border-muted rounded-pill h-12 w-full touch-none border text-sm font-medium transition-colors duration-300 select-none [-webkit-touch-callout:none] disabled:opacity-40"
        >
          {isDone ? "Ya llegaste" : "Mantén presionado para escanear"}
        </button>

        {!isDone && (
          <button
            type="button"
            onClick={finish}
            className="text-dim hover:text-text self-start text-xs underline underline-offset-4 transition-colors duration-300"
          >
            Saltar demo del QR
          </button>
        )}
      </div>
    </div>
  );
}

/** Visor de cámara: el QR ahí, esperando a que le atines. */
function Viewfinder({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="relative w-full">
        <QrPattern
          className={cn(
            "text-muted/35 w-full",
            !reducedMotion && "transition-opacity duration-500",
            active ? "opacity-100" : "opacity-40",
          )}
        />

        {/* Esquinas del encuadre. */}
        <span className="border-muted/50 absolute -top-3 -left-3 size-5 border-t border-l" />
        <span className="border-muted/50 absolute -top-3 -right-3 size-5 border-t border-r" />
        <span className="border-muted/50 absolute -bottom-3 -left-3 size-5 border-b border-l" />
        <span className="border-muted/50 absolute -right-3 -bottom-3 size-5 border-r border-b" />
      </div>
    </div>
  );
}
