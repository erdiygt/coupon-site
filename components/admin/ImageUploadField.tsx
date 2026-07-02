"use client";

import { uploadAdminImage } from "@/lib/utils/upload";
import { useRef, useState } from "react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  required?: boolean;
  previewSize?: "sm" | "md";
  accept?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  required = false,
  previewSize = "md",
  accept = "image/jpeg,image/png,image/webp,image/gif",
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const previewClass =
    previewSize === "sm" ? "h-16 w-16 rounded-xl" : "h-24 w-24 rounded-2xl";

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");

    try {
      const url = await uploadAdminImage(file);
      onChange(url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) {
      void handleUpload(file);
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-700">{label}</label>
      {hint && <p className="mb-2 text-xs text-muted">{hint}</p>}

      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-start">
        <div
          className={`relative shrink-0 overflow-hidden border-2 border-dashed border-zinc-300 bg-white ${previewClass}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Logo önizleme" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted">
              Logo yok
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {uploading ? "Yükleniyor…" : "Dosya Yükle"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
              >
                Kaldır
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              veya URL girin
            </label>
            <input
              type="text"
              required={required}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... veya /uploads/..."
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}
