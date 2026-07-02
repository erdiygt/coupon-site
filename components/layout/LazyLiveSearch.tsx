"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const LiveSearch = dynamic(() => import("@/components/layout/LiveSearch"), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-full animate-pulse rounded-xl border border-border bg-zinc-100" />
  ),
});

interface LazyLiveSearchProps {
  onResultSelect?: () => void;
  /** Mobil menü açıldığında arama modülünü hemen yükle. */
  preload?: boolean;
}

export default function LazyLiveSearch({ onResultSelect, preload = false }: LazyLiveSearchProps) {
  const [active, setActive] = useState(preload);

  const activate = useCallback(() => {
    setActive(true);
  }, []);

  if (!active) {
    return (
      <button
        type="button"
        onClick={activate}
        className="flex w-full items-center gap-2 rounded-xl border border-border bg-zinc-50 px-3 py-2.5 text-left text-sm text-muted transition-colors hover:border-primary/30 hover:bg-white"
        aria-label="Mağaza ara"
      >
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>
        Mağaza ara...
      </button>
    );
  }

  return <LiveSearch onResultSelect={onResultSelect} />;
}
