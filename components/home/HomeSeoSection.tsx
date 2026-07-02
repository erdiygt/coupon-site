import { HOME_SEO_ICERIK } from "@/lib/data/home-content";

export default function HomeSeoSection() {
  const paragraphs = HOME_SEO_ICERIK.split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="mt-14" aria-labelledby="home-seo-heading">
      <h2 id="home-seo-heading" className="sr-only">
        İndirim Kodları Hakkında
      </h2>
      <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="text-sm leading-relaxed text-muted">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-4" : undefined}>
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </section>
  );
}
