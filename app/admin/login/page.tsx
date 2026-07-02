import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { buildNoIndexMetadata } from "@/lib/site/metadata";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = buildNoIndexMetadata("Yönetim Paneli Giriş");

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
              %
            </span>
            <span className="text-xl font-bold text-foreground">
              İndirim<span className="text-primary">Kodu</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Yönetim Paneli</h1>
          <p className="mt-2 text-sm text-muted">
            Devam etmek için kullanıcı adı ve şifrenizi girin.
          </p>
        </div>

        <AdminLoginForm />

        <p className="mt-6 text-center text-xs text-muted">
          Bu alan yalnızca yetkili yöneticiler içindir.
        </p>
      </div>
    </div>
  );
}
