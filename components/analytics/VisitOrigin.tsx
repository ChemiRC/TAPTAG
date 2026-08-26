"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Medios físicos por los que se puede llegar al sitio. El sticker NFC se
 * programa con `?v=nfc` y el QR impreso se genera con `?v=qr`.
 */
const MEDIOS = new Set(["nfc", "qr"]);

/**
 * Registra por qué medio físico llegó el visitante. No pinta nada ni cambia
 * nada.
 *
 * La página es la misma venga por donde venga: adaptar el contenido según el
 * parámetro sería mantener dos versiones, doblar lo que puede fallar delante de
 * un cliente, y el beneficio no lo justifica. El parámetro solo se cuenta.
 *
 * Se lee de `window.location.search` y no con `useSearchParams` a propósito:
 * ese hook obliga a envolver el árbol en Suspense y saca a la página del
 * prerenderizado estático. Aquí el dato solo hace falta en el cliente, después
 * de pintar.
 *
 * El `canonical` del layout apunta a `/`, así que `?v=nfc` y `?v=qr` no generan
 * contenido duplicado para los buscadores.
 */
export function VisitOrigin() {
  useEffect(() => {
    const valor = new URLSearchParams(window.location.search).get("v");
    if (!valor) return;

    const medio = valor.trim().toLowerCase();
    if (!MEDIOS.has(medio)) return;

    track("origen_visita", { medio });
  }, []);

  return null;
}
