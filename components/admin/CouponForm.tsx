"use client";

import type { Coupon, CouponInput, CouponType, Store } from "@/lib/types";
import { useState } from "react";

interface CouponFormProps {
  initial?: Coupon;
  stores: Store[];
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm: CouponInput = {
  store_id: 0,
  baslik: "",
  aciklama: "",
  kod: "",
  link: "",
  tur: "kod",
  baslangic_tarihi: new Date().toISOString().split("T")[0],
  bitis_tarihi: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  aktif_mi: true,
};

function toCouponInput(initial: Coupon | undefined, stores: Store[]): CouponInput {
  if (initial) {
    return {
      store_id: initial.store_id,
      baslik: initial.baslik,
      aciklama: initial.aciklama,
      kod: initial.kod,
      link: initial.link,
      tur: initial.tur,
      baslangic_tarihi: initial.baslangic_tarihi,
      bitis_tarihi: initial.bitis_tarihi,
      aktif_mi: initial.aktif_mi,
    };
  }

  return {
    ...emptyForm,
    store_id: stores[0]?.id ?? 0,
  };
}

export default function CouponForm({ initial, stores, onSuccess, onCancel }: CouponFormProps) {
  const formKey = initial ? `coupon-${initial.id}` : "coupon-new";
  const [form, setForm] = useState<CouponInput>(() => toCouponInput(initial, stores));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initial ? `/api/coupons/${initial.id}` : "/api/coupons";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
          <label className="mb-1 block text-sm font-medium text-zinc-700">Mağaza</label>
          <select
            required
            value={form.store_id}
            onChange={(e) => setForm((f) => ({ ...f, store_id: Number(e.target.value) }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value={0} disabled>
              Mağaza seçin
            </option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.ad}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Tür</label>
          <select
            value={form.tur}
            onChange={(e) => setForm((f) => ({ ...f, tur: e.target.value as CouponType }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="kod">İndirim Kodu</option>
            <option value="kampanya">Kampanya</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Başlık</label>
        <input
          type="text"
          required
          value={form.baslik}
          onChange={(e) => setForm((f) => ({ ...f, baslik: e.target.value }))}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Açıklama</label>
        <textarea
          required
          rows={3}
          value={form.aciklama}
          onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Kod</label>
          <input
            type="text"
            required
            value={form.kod}
            onChange={(e) => setForm((f) => ({ ...f, kod: e.target.value.toUpperCase() }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Link</label>
          <p className="mb-2 text-xs text-muted">
            Boş bırakılırsa mağazanın varsayılan linki kullanılır.
          </p>
          <input
            type="url"
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
            placeholder="https://..."
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Başlangıç Tarihi</label>
          <input
            type="date"
            required
            value={form.baslangic_tarihi}
            onChange={(e) => setForm((f) => ({ ...f, baslangic_tarihi: e.target.value }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Bitiş Tarihi</label>
          <input
            type="date"
            required
            value={form.bitis_tarihi}
            onChange={(e) => setForm((f) => ({ ...f, bitis_tarihi: e.target.value }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.aktif_mi}
          onChange={(e) => setForm((f) => ({ ...f, aktif_mi: e.target.checked }))}
          className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
        />
        <span className="text-sm font-medium text-zinc-700">Aktif</span>
      </label>

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
