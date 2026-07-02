import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

interface FooterProps {
  settings: SiteSettings;
}

const footerLinks = [
  { href: "/markalar", label: "Markalar" },
  { href: "/kategoriler", label: "Kategoriler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-sm text-muted sm:text-left">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {settings.site_name}{" "}
            — Güncel indirim kodları ve kampanyalar
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
