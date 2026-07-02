"use client";

import StoreLogo from "@/components/stores/StoreLogo";
import { STORE_LOGO_SIZE_SM } from "@/lib/constants/store-logo";
import type { StoreSearchResult } from "@/lib/types";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface LiveSearchProps {
  onResultSelect?: () => void;
}

export default function LiveSearch({ onResultSelect }: LiveSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StoreSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/stores/search?q=${encodeURIComponent(trimmed)}`);
      const data = (await res.json()) as StoreSearchResult[];
      setResults(data);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchResults(query);
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onResultSelect?.();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="relative"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="live-search-results"
      >
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
            />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Mağaza ara..."
          className="w-full rounded-xl border border-border bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          autoComplete="off"
          aria-label="Mağaza ara"
        />
      </div>

      {isOpen && (
        <div
          id="live-search-results"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-border bg-white shadow-lg"
        >
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-muted">Aranıyor...</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">Sonuç bulunamadı.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1" role="listbox">
              {results.map((store) => (
                <li key={store.id}>
                  <Link
                    href={`/${store.slug}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-primary-light/50"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
                      <StoreLogo
                        src={store.logo_url}
                        alt={store.ad}
                        size={STORE_LOGO_SIZE_SM}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">{store.ad}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
