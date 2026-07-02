import { isProductionRuntime } from "@/lib/utils/runtime";
import { isDatabaseConfigured } from "@/lib/db/env";

export type DataSourceMode = "supabase" | "seed";

let lastLoggedMode: DataSourceMode | null = null;

function logDataSourceMode(mode: DataSourceMode): void {
  if (process.env.NODE_ENV === "production") return;
  if (lastLoggedMode === mode) return;
  lastLoggedMode = mode;

  if (mode === "supabase") {
    console.log("[indirim-kodu] Veri kaynağı: Supabase (PostgreSQL)");
    return;
  }

  console.warn(
    "[indirim-kodu] Veri kaynağı: Seed fallback (development — Supabase yapılandırılmadı)",
  );
}

/** Her istekte env yeniden okunur; önbelleğe alınmış mod kullanılmaz. */
export function resolveDataSource(): DataSourceMode {
  if (isDatabaseConfigured()) {
    logDataSourceMode("supabase");
    return "supabase";
  }

  if (isProductionRuntime()) {
    throw new Error(
      "Production ortamında NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY zorunludur. Seed fallback devre dışıdır.",
    );
  }

  logDataSourceMode("seed");
  return "seed";
}

export function isSeedFallbackEnabled(): boolean {
  return resolveDataSource() === "seed";
}

export function assertSupabaseInProduction(): void {
  if (isProductionRuntime() && !isDatabaseConfigured()) {
    throw new Error(
      "Production ortamında NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY zorunludur.",
    );
  }
}
