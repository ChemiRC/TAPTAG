"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { DestinationScreen } from "@/components/demo/DestinationScreen";
import { PhoneFrame } from "@/components/demo/PhoneFrame";
import { NfcMarkIcon } from "@/components/icons/NfcMarkIcon";
import { NfcRipple } from "@/components/ui/NfcRipple";
import { cn } from "@/lib/utils";

/** Grados máximos de inclinación del parallax de mouse. */
const MAX_TILT = 5;

export interface NfcTapVisualProps {
  className?: string;
}

/**
 * Pieza de firma del hero: el celular acercándose al sticker TAPTAG.
 *
 * Construido con transforms 3D de CSS y SVG, sin WebGL. Tres capas de
 * transform anidadas para que nunca peleen entre sí por la misma propiedad:
 * `tilt` la mueve el parallax del mouse, `float` el flotado en loop, y `tap`
 * el acercamiento periódico.
 *
 * El sticker va a escala monumental a propósito: en la vida real mide unos
 * centímetros y aquí tiene que leerse como el producto.
 */
export function NfcTapVisual({ className }: NfcTapVisualProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const tapRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const select = gsap.utils.selector(sceneRef);
      const menuRows = select("[data-menu-row]");
      const mm = gsap.matchMedia();

      mm.add(
        {
          canHover: "(hover: hover) and (pointer: fine)",
          reduce: "(prefers-reduced-motion: reduce)",
          // Complementaria de `reduce`: sin ella, en un táctil sin reduced
          // motion no haría match ninguna condición y el loop no arrancaría.
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { canHover, reduce } = context.conditions as {
            canHover: boolean;
            reduce: boolean;
          };

          if (reduce) {
            // Estado en reposo: el menú ya visible, sin flotado ni tap.
            gsap.set(menuRows, { opacity: 1, y: 0 });
            return;
          }

          gsap.set(menuRows, { opacity: 0, y: 10 });

          // Flotado continuo, en su propia capa para no chocar con el tap.
          const float = gsap.to(floatRef.current, {
            y: -6,
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });

          // Ciclo del tap: atenuar, acercar, contacto, encender, regresar.
          // El menú baja a 0.18 y no a 0: la pantalla nunca queda vacía, y el
          // tap se lee como que la ENCIENDE en vez de construirla de la nada.
          const tap = gsap.timeline({ repeat: -1, repeatDelay: 2.2 });

          tap
            .to(menuRows, { opacity: 0.18, y: 6, duration: 0.3 }, 0)
            .to(
              tapRef.current,
              { y: 16, x: -10, duration: 0.6, ease: "power2.in" },
              0.15,
            )
            .to(
              stickerRef.current,
              { scale: 1.06, duration: 0.16, ease: "power2.out" },
              ">-0.05",
            )
            .fromTo(
              flashRef.current,
              { scale: 0.85, opacity: 0.7 },
              { scale: 2.4, opacity: 0, duration: 1, ease: "power2.out" },
              "<",
            )
            .to(
              stickerRef.current,
              { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
              "<0.16",
            )
            .to(
              menuRows,
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.08,
                ease: "power3.out",
              },
              "<",
            )
            .to(
              tapRef.current,
              { y: 0, x: 0, duration: 0.9, ease: "power2.out" },
              ">-0.35",
            );

          // El hero vive arriba de todo y sus dos loops son infinitos: sin esto
          // seguirían gastando frames del ticker con la escena fuera de
          // pantalla, durante todo el resto de la página.
          ScrollTrigger.create({
            trigger: sceneRef.current,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              if (self.isActive) {
                float.play();
                tap.play();
              } else {
                float.pause();
                tap.pause();
              }
            },
          });

          if (!canHover) return;

          // Parallax de mouse. quickTo interpola solo; leemos el rect en cada
          // movimiento porque el hero cambia de sitio al hacer scroll.
          const rotateY = gsap.quickTo(tiltRef.current, "rotationY", {
            duration: 0.7,
            ease: "power3",
          });
          const rotateX = gsap.quickTo(tiltRef.current, "rotationX", {
            duration: 0.7,
            ease: "power3",
          });
          const clamp = gsap.utils.clamp(-MAX_TILT, MAX_TILT);

          const handlePointerMove = (event: PointerEvent) => {
            const scene = sceneRef.current;
            if (!scene) return;

            const bounds = scene.getBoundingClientRect();
            const offsetX =
              (event.clientX - (bounds.left + bounds.width / 2)) /
              (bounds.width / 2);
            const offsetY =
              (event.clientY - (bounds.top + bounds.height / 2)) /
              (bounds.height / 2);

            rotateY(clamp(offsetX * MAX_TILT));
            rotateX(clamp(-offsetY * MAX_TILT));
          };

          window.addEventListener("pointermove", handlePointerMove, {
            passive: true,
          });

          return () => {
            window.removeEventListener("pointermove", handlePointerMove);
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sceneRef },
  );

  return (
    <div
      ref={sceneRef}
      aria-hidden
      className={cn(
        "relative flex items-center justify-center [perspective:1200px]",
        className,
      )}
    >
      <div
        ref={tiltRef}
        className="relative [transform-style:preserve-3d] will-change-transform"
      >
        {/* Resplandor de apoyo, para despegar la escena del fondo. */}
        <div
          className="absolute inset-0 -z-10 scale-125 rounded-full opacity-40 blur-2xl"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
          }}
        />

        <div ref={floatRef} className="will-change-transform">
          <div
            ref={tapRef}
            className="relative will-change-transform [transform:rotateY(-14deg)_rotateX(6deg)]"
          >
            <PhoneMockup />
          </div>
        </div>

        <Sticker ref={stickerRef} flashRef={flashRef} />
      </div>
    </div>
  );
}

/**
 * El celular del hero: marco compartido con la demo, más ancho en desktop.
 *
 * Llevó un barrido especular en el instante del contacto y se quitó: duplicaba
 * una señal que ya cargan el flash de la onda, el micro-scale del sticker y el
 * encendido del menú, y solo existía durante 0.85s de un ciclo de 4.
 */
function PhoneMockup() {
  return (
    <PhoneFrame className="sm:w-[212px] lg:w-[248px]">
      <DestinationScreen />
    </PhoneFrame>
  );
}

interface StickerProps {
  ref: React.Ref<HTMLDivElement>;
  flashRef: React.Ref<HTMLSpanElement>;
}

/**
 * Sticker TAPTAG con las ondas saliendo hacia el celular. El anillo de flash
 * es el que dispara la timeline en cada contacto, encima del loop constante.
 */
function Sticker({ ref, flashRef }: StickerProps) {
  return (
    <div className="absolute -bottom-6 -left-10 sm:-bottom-8 sm:-left-16 lg:-bottom-10 lg:-left-20">
      <div className="relative grid place-items-center">
        <NfcRipple
          count={3}
          size={130}
          duration={2.8}
          delayStep={0.55}
          className="col-start-1 row-start-1"
        />

        <span
          ref={flashRef}
          aria-hidden
          className="border-accent col-start-1 row-start-1 size-[130px] rounded-full border opacity-0"
        />

        <div
          ref={ref}
          className="bg-gradient-brand shadow-glow col-start-1 row-start-1 grid size-24 place-items-center rounded-[1.75rem] p-px will-change-transform sm:size-28 lg:size-32"
        >
          <div className="bg-surface grid size-full place-items-center rounded-[1.7rem]">
            <NfcMarkIcon
              className="text-accent size-10 sm:size-12 lg:size-14"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
