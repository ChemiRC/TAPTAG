/* ==========================================================================
 * Variables de entorno
 *
 * Se leen una vez, se normalizan y se validan aquí. El resto del código puede
 * asumir que `SITE.url` es una URL absoluta parseable y sin barra final, y que
 * `WHATSAPP_NUMBER` son solo dígitos.
 *
 * Importante: las `NEXT_PUBLIC_*` solo se incrustan en el bundle si se acceden
 * con la ruta literal `process.env.NEXT_PUBLIC_ALGO`. Por eso los validadores
 * reciben el VALOR y no el nombre: leerlas con `process.env[nombre]` las dejaría
 * en `undefined` en el cliente.
 * ========================================================================== */

/** Placeholder deliberado: no es un número marcable, se nota de inmediato. */
const WHATSAPP_PLACEHOLDER = "52XXXXXXXXXX";

/** TODO: dominio real — hoy es una suposición. */
const SITE_URL_FALLBACK = "https://taptag.mx";

/**
 * Cadena vacía, solo espacios y ausente son lo mismo: no hay valor.
 *
 * Vercel puede crear una variable con valor vacío al importarla de un
 * `.env.example`, y ese caso reventaba el build: `??` deja pasar `""` y
 * `new URL("")` lanza.
 */
function readOptional(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Ruidoso a propósito: tiene que verse en el log de build de Vercel.
 *
 * Sale una vez por ruta prerenderizada —Next evalúa el módulo en un aislado
 * nuevo por cada una— así que aparece repetido. Se deja así: en un log de build
 * de cientos de líneas, que se repita es lo que hace que se note.
 */
function warnFallback(variable: string, motivo: string, usando: string): void {
  // Solo en servidor/build: no le llenamos la consola al visitante.
  if (typeof window !== "undefined") return;
  console.warn(
    `[TAPTAG] ${variable}: ${motivo}. Uso el valor por defecto "${usando}". ` +
      `Defínela en Vercel (Settings → Environment Variables) y vuelve a desplegar.`,
  );
}

/**
 * Devuelve una URL absoluta http(s), sin barra final. Ante cualquier valor
 * inválido cae al fallback en vez de dejar que el build truene.
 */
function normalizeSiteUrl(raw: string | undefined): string {
  const value = readOptional(raw);

  if (!value) {
    warnFallback("NEXT_PUBLIC_SITE_URL", "sin definir o vacía", SITE_URL_FALLBACK);
    return SITE_URL_FALLBACK;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    warnFallback(
      "NEXT_PUBLIC_SITE_URL",
      `"${value}" no es una URL absoluta (¿le falta https://?)`,
      SITE_URL_FALLBACK,
    );
    return SITE_URL_FALLBACK;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    warnFallback(
      "NEXT_PUBLIC_SITE_URL",
      `"${value}" no usa http ni https`,
      SITE_URL_FALLBACK,
    );
    return SITE_URL_FALLBACK;
  }

  // Sin barra final: el resto del código concatena rutas que ya la llevan.
  return (parsed.origin + parsed.pathname).replace(/\/+$/, "");
}

/**
 * Devuelve solo dígitos. Acepta que la variable venga como "+52 33 1234-5678"
 * o "(33) 1234 5678", que es como la gente copia un teléfono.
 */
function normalizeWhatsAppNumber(raw: string | undefined): string {
  const value = readOptional(raw);

  if (!value) {
    warnFallback(
      "NEXT_PUBLIC_WHATSAPP_NUMBER",
      "sin definir o vacía",
      WHATSAPP_PLACEHOLDER,
    );
    return WHATSAPP_PLACEHOLDER;
  }

  const digits = value.replace(/[\s\-().+]/g, "");

  // E.164: entre 8 y 15 dígitos, sin nada más.
  if (!/^\d{8,15}$/.test(digits)) {
    warnFallback(
      "NEXT_PUBLIC_WHATSAPP_NUMBER",
      `"${value}" no son entre 8 y 15 dígitos`,
      WHATSAPP_PLACEHOLDER,
    );
    return WHATSAPP_PLACEHOLDER;
  }

  return digits;
}

/**
 * Número de WhatsApp de ventas, en formato internacional sin "+" ni espacios
 * (52 = México, seguido de los 10 dígitos).
 *
 * Si falta o es inválida, el sitio compila igual y todos los CTA quedan
 * apuntando al placeholder: preferimos un build que se ve roto a uno que manda
 * prospectos a un número equivocado en silencio.
 */
export const WHATSAPP_NUMBER = normalizeWhatsAppNumber(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
);

/** `false` mientras el número siga siendo el placeholder. */
export const IS_WHATSAPP_CONFIGURED = WHATSAPP_NUMBER !== WHATSAPP_PLACEHOLDER;

/**
 * Arma un enlace de WhatsApp con mensaje precargado.
 * @example buildWhatsAppUrl("Hola, quiero un TAPTAG para mi restaurante")
 */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Dominio público. Ya validado: `new URL(SITE.url)` en `metadataBase` no puede
 * lanzar, y concatenar `${SITE.url}/ruta` no produce dobles barras.
 */
const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/** `false` mientras el dominio siga siendo la suposición por defecto. */
export const IS_SITE_URL_CONFIGURED = SITE_URL !== SITE_URL_FALLBACK;

export const SITE = {
  name: "TAPTAG",
  city: "Zapopan, Jalisco",
  serviceArea: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá"],
  tagline: "Un tap y listo. Adiós al QR.",
  description:
    "Instalamos y operamos un sistema NFC en tu restaurante para que consigas más reseñas de Google y tus clientes lleguen al menú sin fricción. Un tap, sin apps y sin mensualidades.",
  url: SITE_URL,
  /**
   * TODO: correo real. Mientras sea `null` el footer no muestra la línea y el
   * aviso de privacidad manda los derechos ARCO por WhatsApp. Preferimos no
   * publicar un correo inventado a publicar uno que rebote.
   */
  email: null as string | null,
} as const;

/**
 * Mensajes precargados de WhatsApp, uno por punto de origen.
 *
 * Son distintos a propósito: cuando llega un mensaje se sabe desde qué parte de
 * la página escribió el prospecto y qué le interesó.
 */
export const WHATSAPP_MESSAGES = {
  hero: `Hola ${SITE.name}, vi su página y quiero cotizar el servicio para mi restaurante 🙌`,
  nav: `Hola ${SITE.name}, quiero cotizar el sistema NFC para mi restaurante 🙌`,
  fab: `Hola ${SITE.name}, tengo una duda sobre cómo funciona el servicio 🙌`,
  footer: `Hola ${SITE.name}, quiero información sobre el servicio para mi restaurante.`,
  cotizacion: `Hola ${SITE.name}, quiero cotizar el sistema para mi local. ¿Lo vemos? 🙌`,
  faq: `Hola ${SITE.name}, tengo una duda que no vi en las preguntas frecuentes 🙌`,
  ctaFinal: `Hola ${SITE.name}, quiero que un tap me traiga más reseñas. ¿Me cotizan? 🙌`,
} as const;

export type WhatsAppMessageKey = keyof typeof WHATSAPP_MESSAGES;

/**
 * Navegación de la landing. Una sola fuente para el nav, el menú móvil y el
 * footer: si se agrega una sección, se agrega aquí y aparece en los tres.
 */
export const NAV_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#cotizacion", label: "Cotización" },
  { href: "#faq", label: "Preguntas" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
