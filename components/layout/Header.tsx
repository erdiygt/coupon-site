import LazyLiveSearch from "@/components/layout/LazyLiveSearch";
import MobileMenu from "@/components/layout/MobileMenu";
import { SiteBrandLink } from "@/components/layout/SiteBrand";
import type { SiteSettings } from "@/lib/types";
import Link from "next/link";

const navLinks = [
  { href: "/markalar", label: "Markalar" },
  { href: "/kategoriler", label: "Kategoriler" },
];

interface HeaderProps {
  settings: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
      <MobileMenu navLinks={navLinks}>
        <SiteBrandLink siteName={settings.site_name} logoUrl={settings.logo_url} />

        <div className="hidden flex-1 lg:block lg:max-w-lg">
          <LazyLiveSearch />
        </div>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </MobileMenu>
    </header>
  );
}
