import type { BreadcrumbItem } from "@/lib/types/breadcrumb";
import { getCachedSiteSettings } from "@/lib/db/cache";
import { buildBreadcrumbSchema } from "@/lib/utils/schema";
import { safeJsonLd } from "@/lib/utils/html";
import Link from "next/link";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

function BreadcrumbJsonLd({ items }: BreadcrumbProps) {
  const schema = buildBreadcrumbSchema(items);
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

function ChevronSeparator() {
  return (
    <svg
      className="h-3 w-3 shrink-0 text-muted"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <div className="inline-flex max-w-full items-center rounded-xl border border-primary/20 bg-card px-3 py-2 shadow-sm">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted sm:gap-2 sm:text-sm">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5 sm:gap-2">
                  {index > 0 && <ChevronSeparator />}
                  {isLast || !item.href ? (
                    <span aria-current="page" className="font-semibold text-foreground">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="font-medium text-muted transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}

export async function homeBreadcrumb(): Promise<BreadcrumbItem[]> {
  const settings = await getCachedSiteSettings();
  return [{ label: settings.site_name, href: "/" }];
}

export async function withHomeBreadcrumb(items: BreadcrumbItem[]): Promise<BreadcrumbItem[]> {
  const settings = await getCachedSiteSettings();
  return [{ label: settings.site_name, href: "/" }, ...items];
}
