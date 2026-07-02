"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-zinc-50 font-sans antialiased">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <p className="text-5xl font-bold text-green-600">Hata</p>
            <h1 className="mt-4 text-xl font-bold text-zinc-900">Uygulama hatası</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Kritik bir hata oluştu. Sayfayı yenilemeyi deneyin.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
