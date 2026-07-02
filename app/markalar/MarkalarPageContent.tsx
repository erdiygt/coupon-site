import { getCachedStoresForGrid } from "@/lib/db/cache";
import Breadcrumb, { withHomeBreadcrumb } from "@/components/layout/Breadcrumb";
import StoreGrid from "@/components/stores/StoreGrid";
import Link from "next/link";

const PAGE_SIZE = 48;

type MarkalarPageContentProps = {
  searchParams: Promise<{ sayfa?: string }>;
};

export default async function MarkalarPageContent({
  searchParams,
}: MarkalarPageContentProps) {
  const { sayfa } = await searchParams;
  const stores = await getCachedStoresForGrid();
  const totalPages = Math.max(1, Math.ceil(stores.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(sayfa) || 1), totalPages);
  const pageStores = stores.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const breadcrumbItems = await withHomeBreadcrumb([
    { label: "Markalar", href: "/markalar" },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Tüm Markalar</h1>
        <p className="mt-2 text-muted">
          {stores.length} markada geçerli indirim kodları ve kampanyalar
        </p>
      </div>
      <StoreGrid stores={pageStores} />

      {totalPages > 1 && (
        <nav
          className="mt-10 flex items-center justify-center gap-4"
          aria-label="Sayfa navigasyonu"
        >
          {currentPage > 1 ? (
            <Link
              href={currentPage === 2 ? "/markalar" : `/markalar?sayfa=${currentPage - 1}`}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-zinc-50"
            >
              Önceki
            </Link>
          ) : (
            <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-muted">
              Önceki
            </span>
          )}
          <span className="text-sm text-muted">
            Sayfa {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link
              href={`/markalar?sayfa=${currentPage + 1}`}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-zinc-50"
            >
              Sonraki
            </Link>
          ) : (
            <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-muted">
              Sonraki
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
