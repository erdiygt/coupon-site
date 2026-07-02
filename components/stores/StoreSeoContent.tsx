import RichTextContent from "@/components/content/RichTextContent";

interface StoreSeoContentProps {
  storeAd: string;
  content?: string | null;
}

export default function StoreSeoContent({ storeAd, content }: StoreSeoContentProps) {
  if (!content?.trim()) return null;

  return (
    <section className="mt-10" aria-labelledby="store-seo-heading">
      <h2
        id="store-seo-heading"
        className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground"
      >
        <span className="h-6 w-1 rounded-full bg-primary" />
        {storeAd} İndirim Kodları Hakkında
      </h2>

      <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <RichTextContent content={content} />
      </article>
    </section>
  );
}
