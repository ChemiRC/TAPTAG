"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface FaqItemProps {
  question: string;
  answer: string;
}

/**
 * Fila del acordeón.
 *
 * La apertura se anima con `grid-template-rows: 0fr → 1fr`, que es la forma
 * limpia de animar "hasta el alto del contenido" sin medirlo con JS. Es la
 * única propiedad de layout que animamos en todo el sitio, y va sobre un
 * elemento acotado.
 *
 * Cada fila lleva su propio estado: abrir una no cierra las demás.
 */
export function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  return (
    <div data-faq-item className="border-border/60 border-b">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
          className="group flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span
            className={cn(
              "font-display text-base font-medium transition-colors duration-300 sm:text-lg",
              isOpen ? "text-text" : "text-text/90 group-hover:text-text",
            )}
          >
            {question}
          </span>

          <span
            aria-hidden
            className={cn(
              "border-border text-muted ease-out-expo mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-transform duration-400",
              isOpen && "text-accent border-accent/40 rotate-45",
            )}
          >
            <svg
              viewBox="0 0 16 16"
              className="size-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "ease-out-expo grid transition-[grid-template-rows] duration-400",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="text-muted pb-6 type-body">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
