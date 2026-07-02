"use client";

import LazyLiveSearch from "@/components/layout/LazyLiveSearch";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  navLinks: NavLink[];
  children: React.ReactNode;
}

export default function MobileMenu({ navLinks, children }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center gap-4 lg:gap-6">
        {children}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-zinc-50 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu-panel"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                open ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                open ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu-panel"
        className={`transition-[max-height,opacity] duration-300 ease-in-out lg:hidden ${
          open
            ? "max-h-[520px] overflow-visible opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="space-y-4 border-t border-border pb-5 pt-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Mağaza Ara
            </p>
            <LazyLiveSearch preload={open} onResultSelect={close} />
          </div>

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary-light/50 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
