"use client";

import CategoryForm from "@/components/admin/CategoryForm";
import type { Category } from "@/lib/types";
import Link from "next/link";
import { useCallback, useState } from "react";

interface CategoryManagerProps {
  initialCategories: Category[];
}

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Mağazalar varsayılan kategoriye taşınır.")) {
      return;
    }
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditing(undefined);
    fetchCategories();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Kategori Yönetimi</h1>
        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setEditing(undefined);
              setShowForm(true);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            + Yeni Kategori
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            {editing ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
          </h2>
          <CategoryForm
            key={editing ? `edit-${editing.id}` : "new"}
            initial={editing}
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
              <th className="px-4 py-3 font-semibold text-zinc-600">Ad</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">Slug</th>
              <th className="px-4 py-3 font-semibold text-zinc-600">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-zinc-50/50">
                <td className="px-4 py-3 font-medium">{category.ad}</td>
                <td className="px-4 py-3 text-muted">
                  <Link
                    href={`/kategoriler/${category.slug}`}
                    className="hover:text-primary"
                    target="_blank"
                  >
                    /kategoriler/{category.slug}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(category);
                        setShowForm(true);
                      }}
                      className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id)}
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
