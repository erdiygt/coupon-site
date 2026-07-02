"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <p className="text-5xl font-bold text-primary">Hata</p>
        <h1 className="mt-4 text-xl font-bold text-foreground">Bir şeyler ters gitti</h1>
        <p className="mt-2 text-sm text-muted">
          Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-zinc-50"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
