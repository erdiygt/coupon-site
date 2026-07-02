import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertSupabaseInProduction } from "@/lib/db/data-source";
import { isDatabaseConfigured } from "@/lib/db/env";

let serviceClient: SupabaseClient | null = null;

export { isDatabaseConfigured } from "@/lib/db/env";

export function getSupabase(): SupabaseClient {
  assertSupabaseInProduction();

  if (!isDatabaseConfigured()) {
    throw new Error(
      "Supabase yapılandırılmadı. Repository method'ları useSeedFallback() ile seed verisine yönlendirilmeli.",
    );
  }

  if (serviceClient) return serviceClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  serviceClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return serviceClient;
}

export function getStoragePublicUrl(path: string): string {
  const supabase = getSupabase();
  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
}
