import { SITE, WHATSAPP_NUMBER } from "@/lib/constants";
import { FAQS } from "@/lib/content";

/**
 * JSON-LD del negocio y de las preguntas frecuentes.
 *
 * El `FAQPage` se genera desde la MISMA constante `FAQS` que pinta la UI, así
 * que no hay forma de que el marcado estructurado y lo que ve el usuario se
 * desincronicen.
 */
export function StructuredData() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: `+${WHATSAPP_NUMBER}`,
    priceRange: "$$",
    areaServed: SITE.serviceArea.map((name) => ({ "@type": "City", name })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Zapopan",
      addressRegion: "Jalisco",
      addressCountry: "MX",
    },
    sameAs: [`https://wa.me/${WHATSAPP_NUMBER}`],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
