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
 *
 * TODO (decisión de negocio, no de código): el modelo dice "pago único" y los
 * planes prometen cambios y reposición sin cargo. Falta definir hasta cuándo
 * dura ese acompañamiento —¿de por vida, o una ventana como el primer año?— y
 * si la reposición tiene tope. Mientras no se defina, el copy no promete plazo.
 */
export const PLANS: readonly Plan[] = [
  {
    id: "prueba",
    name: "Prueba",
    price: "$XXX",
    priceNote: "MXN · pago único",
    tagline: "Para ver cómo funciona en tu negocio",
    features: [
      "Instalamos 3 puntos de contacto en tu local",
      "Configuramos el destino que elijas: menú o reseñas",
      "Los cambios de destino los hacemos nosotros",
      "Instalación en persona en Guadalajara",
    ],
    messageKey: "planPrueba",
  },
  {
    id: "restaurante",
    name: "Restaurante",
    price: "$XXX",
    priceNote: "MXN · pago único",
    tagline: "Para cubrir todo tu local",
    features: [
      "Instalamos hasta 12 puntos: mesas, barra y terminal",
      "Revisamos contigo dónde conviene colocarlos",
      "Diseño con tu logo y tus colores",
      "Menú y reseñas en paralelo, en puntos distintos",
      "Cambios ilimitados, los hacemos nosotros",
      "Reponemos cualquier punto que deje de servir",
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
      "Alcance a medida, sucursal por sucursal",
      "Displays además de los puntos en mesa",
      "Un destino distinto por sucursal",
      "Un contacto directo por WhatsApp para cambios",
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
      "Cada punto puede llevar también un QR impreso como respaldo, sin costo extra. Así nadie se queda fuera.",
  },
  {
    id: "cambiar-destino",
    question: "¿Puedo cambiar a dónde lleva después?",
    answer:
      "Sí, cuantas veces quieras. Nos avisas por WhatsApp y lo reprogramamos nosotros el mismo día. No tienes que reimprimir nada ni volver a contratar.",
  },
  {
    id: "despues-de-instalar",
    question: "¿Qué pasa después de la instalación?",
    answer:
      "Te queda un contacto directo por WhatsApp. Si quieres cambiar el destino, mover un punto de lugar o reponer alguno, nos escribes y lo resolvemos. No hay ticket ni call center.",
  },
  {
    id: "durabilidad",
    question: "¿Se despega o se arruina con la limpieza?",
    answer:
      "Los puntos aguantan el uso diario de un restaurante: líquidos, grasa y limpieza constante. Si alguno deja de servir, lo reponemos nosotros.",
  },
  {
    id: "instalacion",
    question: "¿Cuánto tarda en quedar instalado?",
    answer:
      "Depende del alcance y de la personalización. Escríbenos por WhatsApp y te damos una fecha concreta el mismo día.",
  },
  {
    id: "mensualidad",
    question: "¿Hay mensualidad o renovación?",
    answer:
      "No. El servicio se contrata una vez y no hay cargos recurrentes ni renovación.",
  },
  {
    id: "cobertura",
    question: "¿Solo trabajan en Guadalajara?",
    answer:
      "Instalamos en persona en toda la zona metropolitana: Guadalajara, Zapopan, Tlaquepaque y Tonalá. Si estás fuera, escríbenos y lo vemos: te lo dejamos configurado y te acompañamos por WhatsApp durante la instalación.",
  },
] as const;

/* ==========================================================================
 * BENEFICIOS (bento)
 * ========================================================================== */

export interface Feature {
  /** Enlaza la celda con su composición visual en la sección. */
  id: string;
  title: string;
  description: string;
  /** Espacio que ocupa en la retícula de 6 columnas. */
  className: string;
  featured?: boolean;
}

/**
 * Cada celda responde una objeción real del dueño de restaurante, no solo
 * enumera un beneficio. El orden es el narrativo: en móvil se apilan tal cual,
 * con la destacada primero.
 *
 * El texto vive aquí y no en la sección para que ajustar copy no obligue a
 * tocar componentes.
 */
export const FEATURES: readonly Feature[] = [
  {
    id: "pago-unico",
    title: "Sin mensualidades",
    description:
      "Contratas el servicio una vez y no hay cargos recurrentes. Ni suscripción, ni renovación, ni letras chiquitas.",
    className: "md:col-span-3 md:row-span-2",
    featured: true,
  },
  {
    id: "reprogramar",
    title: "Los cambios los hacemos nosotros",
    description:
      "Cambias de menú, de promoción o de destino: nos escribes y lo reprogramamos. Tú no tocas nada ni reimprimes nada.",
    className: "md:col-span-3",
  },
  {
    id: "sin-internet",
    title: "No depende de tu internet",
    description:
      "El sistema no necesita conexión ni batería en tu local. Solo el celular de tu cliente.",
    className: "md:col-span-3",
  },
  {
    id: "dispositivos",
    title: "iPhone 7+ y Android",
    description:
      "Tus clientes no necesitan nada especial: prácticamente cualquier celular de los últimos años.",
    className: "md:col-span-2",
  },
  {
    id: "reposicion",
    title: "Si algo falla, lo reponemos",
    description:
      "Los puntos aguantan líquidos, grasa y limpieza diaria. Si alguno deja de servir, venimos y lo cambiamos.",
    className: "md:col-span-2",
  },
  {
    id: "marca",
    title: "Lo diseñamos con tu marca",
    description:
      "Con tu logo y tus colores, para que se vea como parte de tu local y no como un accesorio pegado.",
    className: "md:col-span-2",
  },
  {
    id: "destinos",
    title: "Tú decides a dónde llevamos a tus clientes",
    description:
      "A tu menú digital, a tus reseñas de Google, o a los dos en puntos distintos. Lo configuramos nosotros.",
    className: "md:col-span-6",
  },
] as const;
