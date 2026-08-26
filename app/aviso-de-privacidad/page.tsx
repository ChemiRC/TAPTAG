import type { Metadata } from "next";

import { Section } from "@/components/ui/Section";
import { SITE, buildWhatsAppUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description: `Aviso de privacidad de ${SITE.name}, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.`,
  robots: { index: false, follow: true },
};

/**
 * BORRADOR BASE, NO ASESORÍA LEGAL.
 *
 * Está redactado sobre los mínimos que pide la LFPDPPP (art. 16 y 17) y su
 * Reglamento, pero los campos marcados con TODO dependen de los datos fiscales
 * y legales del negocio. Antes de publicar hay que completarlos y pasar el
 * texto por alguien que sepa de la materia.
 */

/** TODO: razón social o nombre completo del responsable, tal como esté dado de alta. */
const RESPONSABLE = "[RAZÓN SOCIAL O NOMBRE COMPLETO DEL RESPONSABLE]";
/** TODO: domicilio fiscal completo (calle, número, colonia, CP, municipio, estado). */
const DOMICILIO = "[DOMICILIO FISCAL COMPLETO]";
/** TODO: fecha en que entra en vigor esta versión del aviso. */
const ULTIMA_ACTUALIZACION = "[FECHA DE ÚLTIMA ACTUALIZACIÓN]";

const CONTACTO_URL = buildWhatsAppUrl(
  `Hola ${SITE.name}, quiero ejercer mis derechos ARCO sobre mis datos personales.`,
);

export default function AvisoDePrivacidad() {
  return (
    <Section className="pt-32 pb-24">
      <article className="max-w-2xl">
        <h1 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">
          Aviso de Privacidad
        </h1>
        <p className="text-dim mt-4 text-sm">
          Última actualización: {ULTIMA_ACTUALIZACION}
        </p>

        <Block title="Identidad y domicilio del responsable">
          <p>
            {RESPONSABLE}, que opera comercialmente como {SITE.name}, con
            domicilio en {DOMICILIO}, es responsable del tratamiento de tus
            datos personales conforme a la Ley Federal de Protección de Datos
            Personales en Posesión de los Particulares (LFPDPPP).
          </p>
        </Block>

        <Block title="Datos personales que recabamos">
          <p>
            Solo recabamos los datos que tú nos proporcionas al contactarnos por
            WhatsApp o por correo:
          </p>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
            <li>Nombre o nombre del establecimiento.</li>
            <li>Número de teléfono.</li>
            <li>Correo electrónico, si decides compartirlo.</li>
            <li>
              Domicilio del establecimiento, únicamente cuando sea necesario
              para instalar el sistema en tu establecimiento.
            </li>
          </ul>
          <p className="mt-3">
            No recabamos datos personales sensibles, ni datos patrimoniales o
            financieros a través de este sitio.
          </p>
          <p className="mt-3">
            Este sitio no utiliza cookies de publicidad ni de seguimiento. Sí
            registramos estadísticas de uso anónimas y agregadas —número de
            visitas y por qué medio se llegó, si fue por un sticker NFC o por un
            código QR— a través de la analítica de nuestro proveedor de
            alojamiento. Esas estadísticas no permiten identificarte ni se
            asocian con tus datos de contacto.
          </p>
        </Block>

        <Block title="Finalidades del tratamiento">
          <p>Usamos tus datos para las siguientes finalidades primarias:</p>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
            <li>Responder tu solicitud de cotización o información.</li>
            <li>Preparar e instalar el sistema contratado.</li>
            <li>Dar seguimiento posventa y soporte.</li>
            <li>Cumplir obligaciones fiscales y contables cuando apliquen.</li>
          </ul>
          <p className="mt-3">
            Como finalidad secundaria podríamos enviarte información sobre
            novedades o promociones. Puedes negarte a esta finalidad secundaria
            en cualquier momento sin que afecte el servicio contratado, usando
            el mismo medio de contacto de la sección de derechos ARCO.
          </p>
        </Block>

        <Block title="Transferencia de datos">
          <p>
            No transferimos tus datos personales a terceros sin tu
            consentimiento, salvo en los supuestos previstos por el artículo 37
            de la LFPDPPP. Podemos compartir los datos estrictamente necesarios
            con proveedores de mensajería o paquetería cuando haga falta
            hacerte llegar material fuera de la zona de instalación.
          </p>
        </Block>

        <Block title="Derechos ARCO">
          <p>
            Tienes derecho a Acceder a tus datos personales, Rectificarlos
            cuando sean inexactos, Cancelarlos cuando consideres que no se
            requieren para alguna de las finalidades señaladas, y Oponerte al
            tratamiento de los mismos para fines específicos.
          </p>
          <p className="mt-3">
            Para ejercer cualquiera de estos derechos, o para revocar tu
            consentimiento, escríbenos por{" "}
            <a
              href={CONTACTO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-text decoration-accent/50 underline underline-offset-4 transition-colors duration-300 hover:decoration-accent"
            >
              WhatsApp
            </a>
            {SITE.email && (
              <>
                {" "}o al correo{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-accent hover:text-text decoration-accent/50 underline underline-offset-4 transition-colors duration-300 hover:decoration-accent"
                >
                  {SITE.email}
                </a>
              </>
            )}
            . Te responderemos en un plazo máximo de 20 días hábiles, conforme
            al artículo 32 de la LFPDPPP.
          </p>
        </Block>

        <Block title="Cambios a este aviso">
          <p>
            Podemos actualizar este aviso de privacidad para reflejar cambios en
            nuestras prácticas o en la legislación aplicable. Cualquier
            modificación se publicará en esta misma página, con la fecha de
            última actualización visible al inicio.
          </p>
        </Block>

        <Block title="Autoridad">
          <p>
            Si consideras que tu derecho a la protección de datos personales ha
            sido vulnerado, puedes acudir ante la autoridad competente en
            materia de protección de datos personales.
          </p>
        </Block>
      </article>
    </Section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-text text-xl font-semibold">{title}</h2>
      <div className="text-muted mt-4 flex flex-col text-sm leading-relaxed sm:text-base">
        {children}
      </div>
    </section>
  );
}
