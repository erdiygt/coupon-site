"use client";

import LazyRichTextEditor from "@/components/admin/LazyRichTextEditor";
import type { Category, CategoryInput } from "@/lib/types";
import { sanitizeRichHtml, stripHtml } from "@/lib/utils/html";
import { slugify } from "@/lib/utils/coupon";
import { useState } from "react";

interface CategoryFormProps {
  initial?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm: CategoryInput = {
  ad: "",
  slug: "",
  aciklama: "",
  seo_title: "",
  seo_description: "",
};

function toFormInput(initial?: Category): CategoryInput {
  if (!initial) return emptyForm;
  return {
    ad: initial.ad,
    slug: initial.slug,
    aciklama: initial.aciklama,
    seo_title: initial.seo_title,
    seo_description: initial.seo_description,
  };
}

export default function CategoryForm({ initial, onSuccess, onCancel }: CategoryFormProps) {
  const formKey = initial ? `category-${initial.id}` : "category-new";
  const [form, setForm] = useState<CategoryInput>(() => toFormInput(initial));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!stripHtml(form.aciklama) || !stripHtml(form.seo_description)) {
      setError("Açıklama ve SEO açıklama alanları zorunludur.");
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      aciklama: sanitizeRichHtml(form.aciklama),
      seo_description: sanitizeRichHtml(form.seo_description),
    };

    try {
      const url = initial ? `/api/categories/${initial.id}` : "/api/categories";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Kayıt başarısız");
      onSuccess();
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Kategori Adı</label>
          <input
            type="text"
            required
            value={form.ad}
            onChange={(e) => {
              const ad = e.target.value;
              setForm((f) => ({
                ...f,
                ad,
                slug: initial ? f.slug : slugify(ad),
                seo_title: f.seo_title || `${ad} İndirim Kodları`,
              }));
            }}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Slug</label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Açıklama</label>
        <LazyRichTextEditor
          value={form.aciklama}
          onChange={(aciklama) => setForm((f) => ({ ...f, aciklama }))}
          placeholder="Kategori açıklaması..."
          minHeight="120px"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">SEO Başlık</label>
        <input
          type="text"
          required
          value={form.seo_title}
          onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">SEO Açıklama</label>
        <LazyRichTextEditor
          value={form.seo_description}
          onChange={(seo_description) => setForm((f) => ({ ...f, seo_description }))}
          placeholder="Kategori meta açıklaması..."
          minHeight="120px"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : initial ? "Güncelle" : "Ekle"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
