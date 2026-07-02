import RichTextContent from "@/components/content/RichTextContent";
import type { StoreFaq } from "@/lib/types";

interface StoreFaqSectionProps {
  storeAd: string;
  faqs?: StoreFaq[] | null;
}

export default function StoreFaqSection({ storeAd, faqs }: StoreFaqSectionProps) {
  if (!faqs?.length) return null;

  return (
    <section className="mt-10" aria-labelledby="store-faq-heading">
      <h2
        id="store-faq-heading"
        className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground"
      >
        <span className="h-6 w-1 rounded-full bg-primary" />
        {storeAd} Hakkında Sık Sorulan Sorular
      </h2>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.id}
            className="group rounded-xl border border-border bg-card shadow-sm"
          >
            <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {faq.soru}
                <span className="shrink-0 text-primary transition-transform group-open:rotate-180">
                  ▾
                </span>
              </span>
            </summary>
            <div className="border-t border-border px-5 py-4">
              <RichTextContent content={faq.cevap} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
