import type { StoreFaq } from "@/lib/types";
import { buildFaqPageSchema } from "@/lib/utils/schema";
import { safeJsonLd } from "@/lib/utils/html";

interface FaqJsonLdProps {
  faqs?: StoreFaq[] | null;
}

export default function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const schema = buildFaqPageSchema(faqs);
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}
