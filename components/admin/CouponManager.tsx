"use client";

import CouponForm from "@/components/admin/CouponForm";
import type { Coupon, Store } from "@/lib/types";
import { useCallback, useState } from "react";

interface CouponManagerProps {
  initialCoupons: Coupon[];
  initialStores: Store[];
}

export default function CouponManager({
  initialCoupons,
  initialStores,
}: CouponManagerProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | undefined>();

  const fetchData = useCallback(async () => {
    const [couponsRes, storesRes] = await Promise.all([
      fetch("/api/coupons"),
      fetch("/api/stores"),
    ]);
    setCoupons(await couponsRes.json());
    setStores(await storesRes.json());
  }, []);

  const getStoreName = (storeId: number) =>
    stores.find((s) => s.id === storeId)?.ad ?? "—";

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(undefined);
    fetchData();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Kupon Yönetimi</h1>
        {!showForm && stores.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setEditing(undefined);
              setShowForm(true);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            + Yeni Kupon
          </button>
        )}
      </div>

      {stores.length === 0 && (
        <div className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Kupon eklemek için önce bir mağaza oluşturmalısınız.
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editing ? "Kuponu Düzenle" : "Yeni Kupon Ekle"}
          </h2>
          <CouponForm
            key={editing ? `edit-${editing.id}` : "new"}
            initial={editing}
            stores={stores}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditing(undefined);
            }}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-zinc-600">ID</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Mağaza</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Başlık</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Kod</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Tür</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Aktif</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-zinc-50/50">
                <td className="px-4 py-3 text-muted">{coupon.id}</td>
                <td className="px-4 py-3">{getStoreName(coupon.store_id)}</td>
                <td className="max-w-[200px] truncate px-4 py-3 font-medium">{coupon.baslik}</td>
                <td className="px-4 py-3 font-mono text-primary">{coupon.kod}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      coupon.tur === "kod"
                        ? "bg-primary-light text-primary"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {coupon.tur}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {coupon.aktif_mi ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-400">✗</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(coupon);
                        setShowForm(true);
                      }}
                      className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(coupon.id)}
                      className="rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
