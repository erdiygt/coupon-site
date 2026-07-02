import StoreCard from "@/components/stores/StoreCard";
import type { Store } from "@/lib/types";

interface StoreGridProps {
  stores: Store[];
  title?: string;
}

export default function StoreGrid({ stores, title }: StoreGridProps) {
  return (
    <section>
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-foreground">{title}</h2>
      )}
      {stores.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted">
          Henüz mağaza bulunmuyor.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </section>
  );
}
