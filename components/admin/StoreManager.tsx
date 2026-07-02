"use client";

import StoreForm from "@/components/admin/StoreForm";
import StoreLogo from "@/components/stores/StoreLogo";
import { STORE_LOGO_SIZE_SM } from "@/lib/constants/store-logo";
import type { Category, Store } from "@/lib/types";
import Link from "next/link";
import { useCallback, useState } from "react";

interface StoreManagerProps {
  initialStores: Store[];
  initialCategories: Category[];
}

export default function StoreManager({
  initialStores,
  initialCategories,
}: StoreManagerProps) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Store | undefined>();

  const fetchStores = useCallback(async () => {
    const res = await fetch("/api/stores");
    const data = await res.json();
    setStores(data);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bu mağazayı ve tüm kuponlarını silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/stores/${id}`, { method: "DELETE" });
    fetchStores();
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(undefined);
    fetchStores();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Mağaza Yönetimi</h1>
        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setEditing(undefined);
              setShowForm(true);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            + Yeni Mağaza
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editing ? "Mağazayı Düzenle" : "Yeni Mağaza Ekle"}
          </h2>
          <StoreForm
            key={editing ? `edit-${editing.id}` : "new"}
            initial={editing}
            categories={initialCategories}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditing(undefined);
            }}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-zinc-600">Logo</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Ad</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Slug</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Puan</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Popüler</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-zinc-50/50">
                <td className="px-4 py-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <StoreLogo
                      src={store.logo_url}
                      alt={store.ad}
                      name={store.ad}
                      size={STORE_LOGO_SIZE_SM}
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{store.ad}</td>
                <td className="px-4 py-3 text-muted">
                  <Link href={`/${store.slug}`} className="hover:text-primary" target="_blank">
                    /{store.slug}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground">{store.puan.toFixed(1)}</span>
                  <span className="text-muted"> / 5</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {store.degerlendirme_sayisi.toLocaleString("tr-TR")} değerlendirme
                  </span>
                </td>
                <td className="px-4 py-3">
                  {store.populer_mi ? (
                    <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                      Evet
                    </span>
                  ) : (
                    <span className="text-muted">Hayır</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(store);
                        setShowForm(true);
                      }}
                      className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(store.id)}
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
