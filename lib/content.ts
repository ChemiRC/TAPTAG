import type { WhatsAppMessageKey } from "@/lib/constants";

/* ==========================================================================
 * PLANES
 * ========================================================================== */

export interface Plan {
  id: string;
  name: string;
  /** Precio ya formateado. `null` cuando el plan se cotiza a medida. */
  price: string | null;
  /** Etiqueta que acompaña al precio. */
  priceNote: string;
  tagline: string;
  features: readonly string[];
  /** Origen del mensaje de WhatsApp, para saber qué plan disparó el contacto. */
  messageKey: WhatsAppMessageKey;
  featured?: boolean;
  /** Distintivo del plan destacado. */
  badge?: string;
}

/**
 * TODO: precios reales — los tres montos están como `$XXX` a propósito. Son
 * placeholders imposibles de publicar por accidente: el dueño del negocio aún
 * tiene que definirlos.
 */
export const PLANS: readonly Plan[] = [
  {
    id: "prueba",
    name: "Prueba",
    price: "$XXX",
    priceNote: "MXN · pago único",
    tagline: "Para probarlo en tu negocio",
    features: [
      "3 stickers NFC",
      "Destino a tu elección (menú o reseñas)",
      "Reprogramación incluida",
      "Entrega en Guadalajara",
    ],
    messageKey: "planPrueba",
  },
  {
    id: "restaurante",
    name: "Restaurante",
    price: "$XXX",
    priceNote: "MXN · pago único",
    tagline: "Para cubrir todas tus mesas",
    features: [
      "12 stickers NFC",
      "Diseño con tu logo y colores",
      "Menú y reseñas (destinos distintos)",
      "Reprogramación ilimitada",
      "Instalación asistida",
      "Entrega en Guadalajara",
    ],
    messageKey: "planRestaurante",
    featured: true,
    badge: "Más elegido",
  },
  {
    id: "cadena",
    name: "Cadena",
    price: null,
    priceNote: "Cotización a medida",
    tagline: "Para varias sucursales",
    features: [
      "Cantidad a medida",
      "Displays premium además de stickers",
      "Destinos por sucursal",
      "Soporte prioritario por WhatsApp",
    ],
    messageKey: "planCadena",
  },
] as const;

/* ==========================================================================
 * TESTIMONIOS
 * ========================================================================== */

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  business: string;
  area: string;
  /** Ruta a la foto. Sin ella se muestran las iniciales. */
  avatarUrl?: string;
}

/**
 * TODO: testimonios reales — NINGUNO de estos es de un negocio real.
 *
 * Los nombres son literalmente "Nombre Apellido" y "Nombre del restaurante"
 * para que sea imposible publicarlos creyendo que son auténticos. Hay que
 * sustituirlos por citas verificables, con permiso del negocio, antes de que
 * el sitio salga a producción.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "placeholder-1",
    quote:
      "PLACEHOLDER — Aquí va una cita real del dueño contando qué cambió en su negocio después de poner los stickers. Dos o tres líneas, con un dato concreto.",
    name: "Nombre Apellido",
    role: "Dueño",
    business: "Nombre del restaurante",
    area: "Guadalajara",
  },
  {
    id: "placeholder-2",
    quote:
      "PLACEHOLDER — Aquí va una cita real sobre lo fácil que fue instalarlo y cómo reaccionaron los comensales la primera semana.",
    name: "Nombre Apellido",
    role: "Gerente",
    business: "Nombre del restaurante",
    area: "Zapopan",
  },
  {
    id: "placeholder-3",
    quote:
      "PLACEHOLDER — Aquí va una cita real de alguien con varias sucursales, hablando de reprogramar los destinos sin reimprimir nada.",
    name: "Nombre Apellido",
    role: "Socia fundadora",
    business: "Nombre del restaurante",
    area: "Tlaquepaque",
  },
] as const;

/**
 * Detecta si los testimonios siguen siendo de relleno.
 *
 * Es una comprobación sobre el contenido y no un flag manual a propósito: en
 * cuanto se escriban citas reales la sección se enciende sola, y mientras haya
 * una sola de relleno no se renderiza ninguna. Publicar testimonios falsos es
 * peor que no tener sección de testimonios.
 */
export function hasPublishableTestimonials(): boolean {
  return TESTIMONIALS.every(
    (testimonial) =>
      !testimonial.quote.includes("PLACEHOLDER") &&
      testimonial.name !== "Nombre Apellido" &&
      testimonial.business !== "Nombre del restaurante",
  );
}

/* ==========================================================================
 * PREGUNTAS FRECUENTES
 * ========================================================================== */

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: readonly Faq[] = [
  {
    id: "compatibilidad",
    question: "¿Funciona con cualquier celular?",
    answer:
      "Funciona con iPhone 7 en adelante y prácticamente cualquier Android de los últimos años. En iPhone no hace falta abrir ninguna app: se acerca el celular y aparece la notificación.",
  },
  {
    id: "descargas",
    question: "¿Mi cliente necesita descargar algo?",
    answer:
      "No. Ni app, ni cuenta, ni registro. Acerca el celular y llega directo al destino.",
  },
  {
    id: "sin-nfc",
    question: "¿Qué pasa si alguien tiene un celular sin NFC?",
    answer:
      "Cada sticker puede llevar también un QR impreso como respaldo, sin costo extra. Así nadie se queda fuera.",
  },
  {
    id: "cambiar-destino",
    question: "¿Puedo cambiar a dónde lleva después?",
    answer:
      "Sí, cuantas veces quieras. Nos avisas por WhatsApp y lo reprogramamos. No hay que reimprimir ni volver a comprar.",
  },
  {
    id: "durabilidad",
    question: "¿Se despega o se arruina con la limpieza?",
    answer:
      "Están hechos para el uso diario de un restaurante: resisten líquidos, grasa y limpieza constante. Si alguno falla, lo reponemos.",
  },
  {
    id: "entrega",
    question: "¿Cuánto tarda la entrega?",
    answer:
      "Depende de la cantidad y la personalización. Escríbenos por WhatsApp y te damos una fecha concreta el mismo día.",
  },
  {
    id: "mensualidad",
    question: "¿Hay mensualidad o renovación?",
    answer:
      "No. Es compra única. No hay suscripción ni cargos recurrentes.",
  },
  {
    id: "envios",
    question: "¿Hacen envíos fuera de Guadalajara?",
    answer:
      "Sí, enviamos a todo México. En la zona metropolitana de Guadalajara podemos entregar en persona.",
  },
] as const;
