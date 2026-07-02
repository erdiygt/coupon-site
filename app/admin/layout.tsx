import AdminPanelShell from "@/components/admin/AdminPanelShell";
import { buildNoIndexMetadata } from "@/lib/site/metadata";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildNoIndexMetadata("Yönetim Paneli");

function isLoginPath(pathname: string): boolean {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login?");
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  if (isLoginPath(pathname)) {
    return children;
  }

  return <AdminPanelShell>{children}</AdminPanelShell>;
}
