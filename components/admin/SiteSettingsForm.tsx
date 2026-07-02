"use client";

import ImageUploadField from "@/components/admin/ImageUploadField";
import type { SiteSettings } from "@/lib/types";
import { useState } from "react";

export default function SiteSettingsForm({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const [form, setForm] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!form.site_name.trim()) {
      setError("Site adı zorunludur.");
      setSaving(false);
      return;
    }

    if (!form.homepage_meta_title.trim() || !form.homepage_meta_description.trim()) {
      setError("Anasayfa meta başlık ve açıklama zorunludur.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Kayıt başarısız");

      const data = (await res.json()) as SiteSettings;
      setForm(data);
      setSuccess("Site ayarları güncellendi. Ana sayfaya yönlendiriliyorsunuz…");
      window.setTimeout(() => {
        window.location.href = "/";
      }, 600);
    } catch {
      setError("Kayıt sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Marka & Logo</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Site Adı</label>
            <input
              type="text"
              required
              value={form.site_name}
              onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))}
              placeholder="İndirimKodu"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-muted">
              Logo yüklenmezse header&apos;da bu isim görünür. Sayfa başlıklarında da kullanılır.
            </p>
          </div>

          <ImageUploadField
            label="Site Logosu"
            value={form.logo_url}
            onChange={(logo_url) => setForm((f) => ({ ...f, logo_url }))}
            hint="Header ve footer'da görünür. Boş bırakılırsa varsayılan logo kullanılır."
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Site İkonu (Favicon)</h2>

        <ImageUploadField
          label="Favicon"
          value={form.favicon_url}
          onChange={(favicon_url) => setForm((f) => ({ ...f, favicon_url }))}
          hint="Tarayıcı sekmesinde görünür. PNG veya ICO önerilir (32x32 veya 512x512)."
          previewSize="sm"
          accept="image/jpeg,image/png,image/webp,image/gif,image/x-icon,.ico"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Anasayfa SEO</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Meta Başlık</label>
            <input
              type="text"
              required
              value={form.homepage_meta_title}
              onChange={(e) => setForm((f) => ({ ...f, homepage_meta_title: e.target.value }))}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Meta Açıklama</label>
            <textarea
              required
              rows={4}
              value={form.homepage_meta_description}
              onChange={(e) =>
                setForm((f) => ({ ...f, homepage_meta_description: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-muted">
              {form.homepage_meta_description.length} karakter (150–160 ideal)
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {saving ? "Kaydediliyor…" : "Ayarları Kaydet"}
      </button>
    </form>
  );
}
