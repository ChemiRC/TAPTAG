"use client";

import { useCallback, useRef } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
  Ref,
} from "react";
import gsap from "gsap";

import { cn } from "@/lib/utils";
import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const BASE_CLASSES =
  "relative inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "whitespace-nowrap select-none ease-out-expo duration-300 " +
  "transition-[opacity,box-shadow,background-color,border-color,color] " +
  "disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-brand text-bg font-semibold shadow-glow hover:shadow-glow-strong",
  secondary:
    "border border-border bg-transparent text-text hover:border-accent/40 hover:bg-surface",
  ghost: "bg-transparent text-muted hover:bg-surface hover:text-text",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-base",
};

/** Cuánto del desplazamiento del cursor hereda el botón, y su tope en px. */
const MAGNETIC_STRENGTH = 0.35;
const MAGNETIC_MAX_OFFSET = 14;

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
    ref?: Ref<HTMLButtonElement>;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    ref?: Ref<HTMLAnchorElement>;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Botón del sistema. Con `href` renderiza un `<a>` (los CTA de la landing van
 * a WhatsApp), sin él un `<button>`.
 *
 * La variante `primary` es magnética: persigue al cursor con un lerp suave
 * —solo `transform`, nunca layout— y regresa con un rebote al salir. El efecto
 * se apaga en dispositivos táctiles y con `prefers-reduced-motion`.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const isTouch = useIsTouchDevice();
  const prefersReducedMotion = usePrefersReducedMotion();

  const isMagnetic = variant === "primary" && !isTouch && !prefersReducedMotion;

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const element = elementRef.current;
      if (!element) return;

      const bounds = element.getBoundingClientRect();
      const offsetX = event.clientX - (bounds.left + bounds.width / 2);
      const offsetY = event.clientY - (bounds.top + bounds.height / 2);
      const clamp = gsap.utils.clamp(-MAGNETIC_MAX_OFFSET, MAGNETIC_MAX_OFFSET);

      gsap.to(element, {
        x: clamp(offsetX * MAGNETIC_STRENGTH),
        y: clamp(offsetY * MAGNETIC_STRENGTH),
        scale: 1.03,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  }, []);

  const sharedProps = {
    className: cn(
      BASE_CLASSES,
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className,
    ),
    onMouseMove: isMagnetic ? handleMouseMove : undefined,
    onMouseLeave: isMagnetic ? handleMouseLeave : undefined,
  };

  if (isLinkProps(props)) {
    const { ref, ...anchorProps } = props;
    return (
      <a
        {...anchorProps}
        {...sharedProps}
        ref={captureRef(elementRef, ref)}
      >
        {children}
      </a>
    );
  }

  const { ref, ...buttonProps } = props;
  return (
    <button
      {...buttonProps}
      {...sharedProps}
      ref={captureRef(elementRef, ref)}
    >
      {children}
    </button>
  );
}

function isLinkProps(
  props: Omit<ButtonProps, keyof ButtonBaseProps>,
): props is Omit<ButtonAsLink, keyof ButtonBaseProps> {
  return typeof (props as { href?: string }).href === "string";
}

/** Alimenta el ref interno (lo necesita el efecto magnético) y el del consumidor. */
function captureRef<T extends HTMLElement>(
  internalRef: React.RefObject<HTMLElement | null>,
  externalRef: Ref<T> | undefined,
) {
  return (node: T | null) => {
    internalRef.current = node;
    if (typeof externalRef === "function") externalRef(node);
    else if (externalRef) externalRef.current = node;
  };
}
