/**
 * Placeholder deliberado: no es un número marcable. Si aparece en producción es
 * porque la variable de entorno no se definió, y se nota de inmediato.
 */
const WHATSAPP_PLACEHOLDER = "52XXXXXXXXXX";

/**
 * Número de WhatsApp de ventas, en formato internacional sin "+" ni espacios
 * (52 = México, seguido de los 10 dígitos).
 *
 * Se lee de `NEXT_PUBLIC_WHATSAPP_NUMBER`. Las variables `NEXT_PUBLIC_*` se
 * incrustan en el bundle **en tiempo de build**, así que tiene que estar
 * definida en Vercel antes de desplegar; cambiarla exige volver a desplegar.
 *
 * Si falta, el sitio compila igual y todos los CTA quedan apuntando al
 * placeholder: preferimos un build que se ve roto a uno que manda prospectos a
 * un número equivocado en silencio.
 */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || WHATSAPP_PLACEHOLDER;

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
 * TODO: dominio real — hoy es una suposición. En Vercel basta con definir
 * `NEXT_PUBLIC_SITE_URL` y no hay que tocar código: lo consumen `metadataBase`,
 * el sitemap, el robots.txt y el JSON-LD.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taptag.mx";

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
  planPrueba: `Hola ${SITE.name}, me interesa el plan Prueba para mi negocio 🙌`,
  planRestaurante: `Hola ${SITE.name}, me interesa el plan Restaurante para mi negocio 🙌`,
  planCadena: `Hola ${SITE.name}, tengo varias sucursales y quiero una cotización a medida 🙌`,
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
  { href: "#planes", label: "Planes" },
  { href: "#faq", label: "Preguntas" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
