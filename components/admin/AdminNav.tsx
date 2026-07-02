"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/stores", label: "Mağazalar", icon: "🏪" },
  { href: "/admin/categories", label: "Kategoriler", icon: "📁" },
  { href: "/admin/coupons", label: "Kuponlar", icon: "🎟️" },
  { href: "/admin/settings", label: "Site Ayarları", icon: "⚙️" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-zinc-600 hover:bg-primary-light hover:text-primary"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
