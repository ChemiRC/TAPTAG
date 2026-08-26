# TAPTAG — Landing

Landing de TAPTAG: stickers y displays NFC premium para restaurantes en
Guadalajara y Zapopan. Reemplazan el QR impreso de la mesa — el comensal acerca
el celular y cae en el menú digital o en el perfil de Google Reviews.

El sitio es el **destino de una demostración física**: en la visita se le pide al
gerente que pruebe un QR impreso y un sticker NFC, y ambos llevan aquí. Para
quien llega en frío por un link, la demo interactiva reproduce el argumento —el
QR comprimido a 3 segundos, el tap en menos de medio.

## ⚠️ Qué actualizar antes de publicar

| Qué | Dónde | Estado |
|---|---|---|
| **Número de WhatsApp** | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `52XXXXXXXXXX`. Los 8 CTA arman bien la URL pero apuntan a un número inexistente. **Bloqueante.** |
| **Datos legales** | `app/aviso-de-privacidad/page.tsx` | Razón social, domicilio fiscal y fecha están como `[...]`. El texto es un **borrador base, no asesoría legal**. **Bloqueante.** |
| **Testimonios** | `lib/content.ts` → `TESTIMONIALS` | De relleno. La sección **no se renderiza** mientras lo sean (ver abajo). |
| **Dominio** | `NEXT_PUBLIC_SITE_URL` | Por defecto `https://taptag.mx`, que es una suposición. |
| **Correo** | `lib/constants.ts` → `SITE.email` | `null`. Sin él, el footer omite la línea y el aviso de privacidad manda los derechos ARCO por WhatsApp. |

### La guarda de testimonios

`hasPublishableTestimonials()` en `lib/content.ts` comprueba el **contenido**, no
un flag manual. Mientras alguna cita diga `PLACEHOLDER` o el nombre sea
`Nombre Apellido`:

- en producción la sección entera desaparece del DOM;
- en desarrollo queda un aviso en su lugar recordando reemplazarla.

En cuanto se escriban citas reales, la sección se enciende sola. Es preferible no
tener testimonios a publicar testimonios falsos.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · motion · GSAP
(ScrollTrigger + SplitText) · Lenis · deploy en Vercel.

## Comandos

```bash
npm run dev     # desarrollo en http://localhost:3000
npm run build   # build de producción
npm start       # sirve el build de producción
npm run lint    # ESLint
npx tsc --noEmit  # typecheck
```

## Estructura

| Ruta | Qué vive ahí |
| --- | --- |
| `app/globals.css` | Design system completo: paleta, tipografías, radios, sombras, keyframes y el bloque de `prefers-reduced-motion`. |
| `app/layout.tsx` | Metadata, fuentes, chrome persistente y JSON-LD. |
| `app/opengraph-image.tsx` · `icon.tsx` · `apple-icon.tsx` | Imágenes generadas en build con `ImageResponse`. Sin assets externos. |
| `app/sitemap.ts` · `app/robots.ts` | Rutas reales, derivadas de `SITE.url`. |
| `components/sections/` | Las ocho secciones: `Problem`, `Demo`, `HowItWorks`, `Features`, `Quote`, `Testimonials`, `Faq`, `FinalCta`. |
| `components/hero/` | Hero: timeline GSAP + SplitText, `NfcTapVisual`, fondo y scroll indicator. |
| `components/demo/` | Demo interactiva y las piezas compartidas `PhoneFrame` / `DestinationScreen`. |
| `components/problem/` · `how-it-works/` · `features/` · `faq/` | Piezas de cada sección. |
| `components/layout/` | Chrome persistente: `Navbar`, `MobileMenu`, `Footer`, `WhatsAppFAB`, `Logo`. |
| `components/ui/` | Primitivos: `Button`, `Section`, `Reveal`, `CountUp`, `NfcRipple`, `MeshGradient`, `GridBackground`, `NoiseOverlay`. |
| `components/seo/` | `StructuredData`: JSON-LD de `LocalBusiness` y `FAQPage`. |
| `lib/constants.ts` | `WHATSAPP_NUMBER`, `buildWhatsAppUrl`, `SITE`, `WHATSAPP_MESSAGES`, `NAV_LINKS`. |
| `lib/content.ts` | `FEATURES`, `TESTIMONIALS`, `FAQS` y la guarda de testimonios. Todo el copy de secciones vive aquí. |
| `lib/hooks/` | `usePrefersReducedMotion`, `useIsTouchDevice`, `useScrollLock`, `useFocusTrap`. |
| `assets/fonts/` | TTF de Clash Display, solo para generar la imagen OG en build. No se sirve. |
| `public/fonts/` | Clash Display en woff2, servido por `next/font/local`. |

## Convenciones

- Animar **solo** `transform` y `opacity`. Las dos excepciones deliberadas son el
  `stroke-dashoffset` de la línea de "Cómo funciona" y el `grid-template-rows`
  del acordeón de FAQ; ambas están comentadas donde ocurren.
- Mobile-first: se diseña desde 375px porque el pitch se hace mostrando un celular.
- Cada animación respeta `prefers-reduced-motion`, vía `gsap.matchMedia()` cuando
  es JS. **Siempre con la condición complementaria `no-preference`**: `mm.add`
  solo ejecuta el callback si alguna condición hace match.
- El estado inicial de toda animación va en el **marcado** (estilos inline), no
  puesto por JS al hidratar. Si lo pusiera JS, el HTML del servidor se pintaría
  completo y luego se apagaría de golpe.
- Las preferencias del navegador (reduced motion, touch) **no** pueden cambiar el
  marcado del primer render: React 19 no reconcilia atributos al hidratar. Los
  hooks arrancan en `false` y se corrigen en un layout effect.
- Cada CTA de WhatsApp lleva un mensaje distinto según su origen, para saber de
  dónde vino cada prospecto.

### Escala tipográfica

Una auditoría encontró **36 combinaciones distintas** de tamaño/peso/interlínea/
tracking en la página, y cinco trackings diferentes para el mismo rol de
etiqueta. Para que la deriva no vuelva, cada rol tiene un nombre y vive en
`app/globals.css` (capa `components`):

| Clase | Rol | Valores |
|---|---|---|
| `.type-eyebrow` | Antetítulo de sección | 11px · 0.2em · versalitas |
| `.type-section-title` | Titular de sección | 36 → 48 → 60px · −0.02em · 600 |
| `.type-card-title` | Título de tarjeta o paso | 18px · −0.02em · 600 |
| `.type-lead` | Bajada de sección | 18px · 1.55 |
| `.type-body` | Cuerpo largo | 15 → 16px · 1.6 |
| `.type-label` | Etiqueta versalita chica | 10px · 0.18em · versalitas |

**Si hace falta una variante nueva, se agrega al sistema, no al componente.** Un
tamaño con dos trackings o dos interlíneas es deriva, no diseño.

Los radios son cuatro: `rounded-pill`, `rounded-chip` (12px), `rounded-card`
(16px) y `rounded-panel` (28px). Los valores sueltos que quedan —el bisel del
teléfono y el del sticker— son proporciones del objeto, no tokens del sistema.

### Encabezados de sección

Van con `<SectionIntro>`, que encadena antetítulo → titular → bajada en cascada.
El ritmo es calibrable (`pace`) para que las ocho secciones se lean como un
sistema sin entrar todas idénticas: `lenta` en Problema —la espera es su
argumento— y `viva` en la Demo, que es la que invita a tocar.

## Verificación

No hay suite de tests en el repo: la verificación se hizo manejando el sitio con
Playwright sobre Chrome real, fase por fase. Para reproducirla:

```bash
npm run build && npm start          # levanta producción en :3000
# en otra carpeta, fuera del repo:
npm init -y && npm install playwright
# y se corren los scripts de verificación contra http://localhost:3000
```

Lo que se comprobó en el cierre: Lighthouse móvil, recorrido completo por
teclado, recorrido con `prefers-reduced-motion`, el sitio sin JavaScript, el
"sostener" del QR con eventos touch reales, los tres viewports de pitch
(375×667, 390×844, 412×915) y ausencia de overflow horizontal de 320 a 1920px.

## Medir por qué medio llegó cada visita

El sticker NFC y el QR impreso llevan a la misma página, pero con un parámetro
distinto:

| Medio físico | URL que se programa |
|---|---|
| Sticker NFC | `https://tu-dominio.com/?v=nfc` |
| QR impreso | `https://tu-dominio.com/?v=qr` |

`components/analytics/VisitOrigin.tsx` lo lee y lo registra como evento
`origen_visita`. **No cambia nada visible**: la página es idéntica venga por
donde venga, y un valor desconocido se ignora. Mantener dos versiones sería
doblar lo que puede fallar delante de un cliente para un beneficio marginal.

El `canonical` apunta siempre a `/`, así que los parámetros no generan contenido
duplicado para los buscadores.

La analítica solo se monta cuando `process.env.VERCEL === "1"`, es decir en
producción: fuera de ahí el script no existe y pediría un 404 en cada carga.

> **Para que el conteo exista hay que activar Web Analytics** en Vercel →
> proyecto → pestaña **Analytics**. Los eventos personalizados (que es lo que
> distingue `nfc` de `qr`) requieren plan **Pro**; en Hobby se registran las
> visitas totales pero no el desglose por medio. Si te quedas en Hobby, la
> alternativa sin costo es apuntar cada medio a una ruta distinta —`/nfc` y
> `/qr`— y leer el desglose en el conteo de páginas.

## Variables de entorno

| Variable | Para qué | Formato aceptado |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `metadataBase`, imagen Open Graph, `sitemap.xml`, `robots.txt` y JSON-LD. | URL absoluta con `http://` o `https://`. La barra final se recorta sola. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Los 8 CTA de WhatsApp y el `telephone` del JSON-LD. | Código de país + número, entre 8 y 15 dígitos. Espacios, guiones, paréntesis y `+` se limpian solos. |

`.env.example` documenta las dos, con valores de ejemplo **válidos**; cópialo a
`.env.local` para desarrollo (ese archivo no se sube).

> **Las `NEXT_PUBLIC_*` se incrustan en el bundle en tiempo de build.** Definirlas
> en Vercel no basta: hay que volver a desplegar para que surtan efecto.

### Qué pasa si una variable falta o viene mal

`lib/constants.ts` las normaliza y valida antes de que nadie las use. El build
**nunca falla** por una variable de entorno: ante ausencia, cadena vacía, solo
espacios, URL sin protocolo, protocolo que no sea http(s), o un número que no
sean 8–15 dígitos, se usa el valor por defecto y se emite un aviso visible en el
log de build:

```
[TAPTAG] NEXT_PUBLIC_SITE_URL: sin definir o vacía. Uso el valor por defecto
"https://taptag.mx". Defínela en Vercel (Settings → Environment Variables) y
vuelve a desplegar.
```

El aviso solo sale en servidor/build, no en la consola del visitante.

Los defaults son placeholders a propósito: `52XXXXXXXXXX` no es marcable y
`https://taptag.mx` es una suposición. Un build que se ve incompleto es mejor que
uno que manda prospectos a un número equivocado en silencio.

## Subir a GitHub

El repo ya está inicializado en `main` con un commit inicial. Para publicarlo:

```bash
# Opción A — con GitHub CLI (crea el repo y hace el push de una vez)
gh repo create taptag-landing --private --source=. --remote=origin --push

# Opción B — a mano: crea el repo vacío en github.com/new (sin README ni
# .gitignore, para que no haya conflictos) y luego:
git remote add origin https://github.com/TU-USUARIO/taptag-landing.git
git push -u origin main
```

## Deploy en Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → elige el repo.
2. El framework se detecta solo (**Next.js**). No toques build command, output
   directory ni install command.
3. Antes de darle a Deploy, despliega **Environment Variables** y añade:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://tu-dominio.com` |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `52` + tus 10 dígitos |

   Déjalas marcadas para Production, Preview y Development.
4. **Deploy**.

Cada push a `main` dispara un despliegue de producción; cada PR genera una URL de
preview.

### Conectar un dominio propio

1. Vercel → proyecto → **Settings → Domains → Add**, escribe el dominio.
2. En tu registrador, apunta los DNS como indique Vercel:
   - dominio raíz → registro `A` a la IP que muestre Vercel;
   - `www` → registro `CNAME` a `cname.vercel-dns.com`.
3. El certificado HTTPS lo emite Vercel solo en cuanto propaguen los DNS.
4. Actualiza `NEXT_PUBLIC_SITE_URL` al dominio final y **vuelve a desplegar**
   (Deployments → ⋯ → Redeploy), o el sitemap y la imagen OG seguirán apuntando
   al valor anterior.

No hacen falta más variables: el sitio es estático, sin API ni base de datos.
