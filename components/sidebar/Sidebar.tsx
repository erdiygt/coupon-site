import PopularBrands from "@/components/sidebar/PopularBrands";
import TopCoupons from "@/components/sidebar/TopCoupons";
import { getSidebarData } from "@/lib/db/cache";

export default async function Sidebar() {
  const { popularStores, topCoupons, storesById } = await getSidebarData();

  return (
    <aside className="space-y-6">
      <PopularBrands stores={popularStores} />
      <TopCoupons coupons={topCoupons} storesById={storesById} />
    </aside>
  );
}
