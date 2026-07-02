import type { Category } from "@/lib/types";
import { stripHtmlPreview } from "@/lib/utils/html";
import { getCategoryGridData } from "@/lib/db/cache";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
  storeCount: number;
}

const categoryIcons: Record<string, string> = {
  "giyim-moda": "👗",
  pazaryeri: "🛒",
  elektronik: "💻",
  kozmetik: "💄",
};

function CategoryCard({ category, storeCount }: CategoryCardProps) {
  const icon = categoryIcons[category.slug] ?? "🏷️";

  return (
    <Link
      href={`/kategoriler/${category.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-2xl">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
        {category.ad}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">
        {stripHtmlPreview(category.aciklama)}
      </p>
      <p className="mt-4 text-xs font-medium text-primary">{storeCount} mağaza →</p>
    </Link>
  );
}

interface CategoryGridProps {
  categories?: Category[];
}

export async function CategoryGrid({ categories }: CategoryGridProps) {
  const items = await getCategoryGridData(categories);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ category, storeCount }) => (
        <CategoryCard key={category.id} category={category} storeCount={storeCount} />
      ))}
    </div>
  );
}
