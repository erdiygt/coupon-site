import { getRepository } from "@/lib/db/repository";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const repo = getRepository();
  const [stores, coupons] = await Promise.all([
    repo.getAllStores(),
    repo.getAllCoupons(),
  ]);
  const activeCoupons = coupons.filter((c) => c.aktif_mi);

  const stats = [
    { label: "Toplam Mağaza", value: stores.length, href: "/admin/stores", color: "bg-primary" },
    { label: "Toplam Kupon", value: coupons.length, href: "/admin/coupons", color: "bg-primary-dark" },
    { label: "Aktif Kupon", value: activeCoupons.length, href: "/admin/coupons", color: "bg-green-500" },
    {
      label: "Popüler Marka",
      value: stores.filter((s) => s.populer_mi).length,
      href: "/admin/stores",
      color: "bg-amber-500",
    },
  ];

  const recentCoupons = coupons.slice(-5).reverse();
  const recentStoreIds = [...new Set(recentCoupons.map((c) => c.store_id))];
  const storesById = new Map(
    (await repo.getStoresByIds(recentStoreIds)).map((store) => [store.id, store] as const),
  );

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mb-8 text-muted">İndirim kodu sitesi yönetim paneline hoş geldiniz.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-3 h-2 w-12 rounded-full ${stat.color}`} />
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Hızlı İşlemler</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/stores"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Mağaza Ekle
            </Link>
            <Link
              href="/admin/coupons"
              className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light"
            >
              Kupon Ekle
            </Link>
            <Link
              href="/admin/settings"
              className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light"
            >
              Site Ayarları
            </Link>
            <Link
              href="/markalar"
              target="_blank"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-zinc-50"
            >
              Siteyi Görüntüle
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Son Eklenen Kuponlar</h2>
          <ul className="space-y-3">
            {recentCoupons.map((coupon) => {
              const store = storesById.get(coupon.store_id);
              return (
                <li key={coupon.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{coupon.baslik}</span>
                  <span className="text-muted">{store?.ad}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
