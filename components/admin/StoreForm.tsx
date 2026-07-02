"use client";

import ImageUploadField from "@/components/admin/ImageUploadField";
import LazyRichTextEditor from "@/components/admin/LazyRichTextEditor";
import StoreStarRating from "@/components/stores/StoreRating";
import type { Category, Store, StoreFaq, StoreInput } from "@/lib/types";
import { sanitizeRichHtml, stripHtml } from "@/lib/utils/html";
import { slugify } from "@/lib/utils/coupon";
import { clampStoreRating, sanitizeReviewCount } from "@/lib/utils/store";
import { useState } from "react";

interface StoreFormProps {
  initial?: Store;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm: StoreInput = {
  ad: "",
  slug: "",
  logo_url: "",
  link: "",
  seo_title: "",
  seo_description: "",
  seo_icerik: "",
  sss: [],
  kategori_id: 1,
  populer_mi: false,
  puan: 4.5,
  degerlendirme_sayisi: 100,
};

function newFaqId() {
  return `faq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function toStoreInput(initial?: Store): StoreInput {
  if (!initial) return emptyForm;
  return {
    ad: initial.ad,
    slug: initial.slug,
    logo_url: initial.logo_url,
    link: initial.link,
    seo_title: initial.seo_title,
    seo_description: initial.seo_description,
    seo_icerik: initial.seo_icerik,
    sss: initial.sss,
    kategori_id: initial.kategori_id,
    populer_mi: initial.populer_mi,
    puan: initial.puan,
    degerlendirme_sayisi: initial.degerlendirme_sayisi,
  };
}

export default function StoreForm({
  initial,
  categories,
  onSuccess,
  onCancel,
}: StoreFormProps) {
  const formKey = initial ? `store-${initial.id}` : "store-new";
  const [form, setForm] = useState<StoreInput>(() => toStoreInput(initial));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFaq = (index: number, field: keyof StoreFaq, value: string) => {
    setForm((f) => ({
      ...f,
      sss: f.sss.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addFaq = () => {
    setForm((f) => ({
      ...f,
      sss: [...f.sss, { id: newFaqId(), soru: "", cevap: "" }],
    }));
  };

  const removeFaq = (index: number) => {
    setForm((f) => ({
      ...f,
      sss: f.sss.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!stripHtml(form.seo_description)) {
      setError("SEO açıklama alanı zorunludur.");
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      seo_description: sanitizeRichHtml(form.seo_description),
      seo_icerik: sanitizeRichHtml(form.seo_icerik),
      puan: clampStoreRating(form.puan),
      degerlendirme_sayisi: sanitizeReviewCount(form.degerlendirme_sayisi),
      sss: form.sss
        .filter((item) => item.soru.trim() && stripHtml(item.cevap))
        .map((item) => ({
          ...item,
          cevap: sanitizeRichHtml(item.cevap),
        })),
    };

    try {
      const url = initial ? `/api/stores/${initial.id}` : "/api/stores";
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
          <label className="mb-1 block text-sm font-medium text-zinc-700">Mağaza Adı</label>
          <input
            type="text"
            required
            value={form.ad}
            onChange={(e) => {
              const ad = e.target.value;
              setForm((f) => ({
                ...f,
                ad,
                slug: initial ? f.slug : `${slugify(ad)}-indirim-kodu`,
                seo_title: f.seo_title || `${ad} İndirim Kodu`,
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

      <ImageUploadField
        label="Mağaza Logosu"
        value={form.logo_url}
        onChange={(logo_url) => setForm((f) => ({ ...f, logo_url }))}
        hint="İsteğe bağlı. Boş bırakılırsa mağaza adından otomatik avatar oluşturulur."
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Mağaza Linki</label>
        <p className="mb-2 text-xs text-muted">
          Kuponlarda özel link yoksa bu adrese yönlendirilir. Affiliate veya resmi mağaza URL&apos;si
          girebilirsiniz.
        </p>
        <input
          type="url"
          value={form.link}
          onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          placeholder="https://www.ornek-magaza.com"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
        <label className="mb-1 block text-sm font-medium text-zinc-700">SEO Açıklama (Meta)</label>
        <p className="mb-2 text-xs text-muted">
          Arama sonuçlarında görünür. Meta etiketlerinde düz metin olarak kullanılır.
        </p>
        <LazyRichTextEditor
          value={form.seo_description}
          onChange={(seo_description) => setForm((f) => ({ ...f, seo_description }))}
          placeholder="Mağaza meta açıklaması..."
          minHeight="120px"
        />
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-zinc-800">Yıldız Değerlendirmesi</h3>
          <p className="mt-1 text-xs text-muted">
            Mağaza sayfasında gösterilir ve Schema.org AggregateRating olarak eklenir.
          </p>
        </div>

        <div className="mb-4 rounded-lg border border-border bg-white px-4 py-3">
          <p className="mb-2 text-xs font-medium text-zinc-500">Önizleme</p>
          <StoreStarRating
            rating={clampStoreRating(form.puan)}
            reviewCount={sanitizeReviewCount(form.degerlendirme_sayisi)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Puan (5 üzerinden)
            </label>
            <input
              type="number"
              required
              min={1}
              max={5}
              step={0.1}
              value={form.puan}
              onChange={(e) =>
                setForm((f) => ({ ...f, puan: clampStoreRating(Number(e.target.value)) }))
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Değerlendirme Sayısı
            </label>
            <input
              type="number"
              required
              min={0}
              step={1}
              value={form.degerlendirme_sayisi}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  degerlendirme_sayisi: sanitizeReviewCount(Number(e.target.value)),
                }))
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          SEO İçerik Metni (Sayfa Altı)
        </label>
        <p className="mb-2 text-xs text-muted">
          Mağaza sayfasının en altında görünür. Başlık, liste, bağlantı ve görsel ekleyebilirsiniz.
        </p>
        <LazyRichTextEditor
          value={form.seo_icerik}
          onChange={(seo_icerik) => setForm((f) => ({ ...f, seo_icerik }))}
          placeholder="Mağaza hakkında SEO uyumlu açıklama metni..."
          minHeight="280px"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Sık Sorulan Sorular (SSS)
            </label>
            <p className="text-xs text-muted">
              Schema.org FAQPage yapısına uygun JSON-LD olarak sayfaya eklenir.
            </p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light"
          >
            + Soru Ekle
          </button>
        </div>

        {form.sss.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-muted">
            Henüz SSS eklenmedi.
          </p>
        ) : (
          <div className="space-y-4">
            {form.sss.map((faq, index) => (
              <div
                key={faq.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">Soru {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Kaldır
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.soru}
                  onChange={(e) => updateFaq(index, "soru", e.target.value)}
                  placeholder="Soru metni"
                  className="mb-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <LazyRichTextEditor
                  value={faq.cevap}
                  onChange={(cevap) => updateFaq(index, "cevap", cevap)}
                  placeholder="Cevap metni"
                  minHeight="140px"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Kategori</label>
          <select
            required
            value={form.kategori_id}
            onChange={(e) => setForm((f) => ({ ...f, kategori_id: Number(e.target.value) }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.ad}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              checked={form.populer_mi}
              onChange={(e) => setForm((f) => ({ ...f, populer_mi: e.target.checked }))}
              className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-zinc-700">Popüler mağaza</span>
          </label>
        </div>
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
