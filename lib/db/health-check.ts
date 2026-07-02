import { isProductionRuntime } from "@/lib/utils/runtime";
import { getSupabase, isDatabaseConfigured } from "@/lib/db/supabase";

const HEALTH_CHECK_PREFIX = "[indirim-kodu] Supabase health check";
const AUTH_CHECK_PREFIX = "[indirim-kodu] Auth health check";
const MIN_SESSION_SECRET_LENGTH = 32;

function missingEnvMessage(): string {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    missing.push("NEXT_PUBLIC_SITE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  return [
    `${HEALTH_CHECK_PREFIX} BAŞARISIZ — Eksik ortam değişkenleri: ${missing.join(", ")}`,
    "Production ortamında uygulama Supabase ve NEXT_PUBLIC_SITE_URL olmadan başlatılamaz.",
    "Vercel → Settings → Environment Variables bölümünden değişkenleri ekleyin.",
  ].join("\n");
}

function missingAuthEnvMessage(): string {
  const missing: string[] = [];

  if (!process.env.SESSION_SECRET?.trim()) {
    missing.push("SESSION_SECRET");
  } else if (process.env.SESSION_SECRET.trim().length < MIN_SESSION_SECRET_LENGTH) {
    missing.push(`SESSION_SECRET (en az ${MIN_SESSION_SECRET_LENGTH} karakter)`);
  }

  if (!process.env.ADMIN_USERNAME?.trim()) {
    missing.push("ADMIN_USERNAME");
  }

  if (!process.env.ADMIN_PASSWORD_HASH?.trim()) {
    missing.push("ADMIN_PASSWORD_HASH");
  }

  return [
    `${AUTH_CHECK_PREFIX} BAŞARISIZ — Eksik veya geçersiz ortam değişkenleri: ${missing.join(", ")}`,
    "Production ortamında admin girişi için ADMIN_PASSWORD_HASH zorunludur.",
    "Oluşturmak için: npm run auth:hash -- \"güçlü-şifreniz\"",
  ].join("\n");
}

function formatQueryError(message: string, details?: string): string {
  const lines = [
    `${HEALTH_CHECK_PREFIX} BAŞARISIZ — Veritabanı sorgusu tamamlanamadı.`,
    `Hata: ${message}`,
  ];

  if (details) lines.push(`Detay: ${details}`);

  if (/relation .* does not exist|Could not find the table/i.test(message)) {
    lines.push("Çözüm: supabase/schema.sql dosyasını Supabase SQL Editor'da çalıştırın.");
  }

  if (/Invalid API key|JWT|apikey/i.test(message)) {
    lines.push("Çözüm: SUPABASE_SERVICE_ROLE_KEY değerini kontrol edin.");
  }

  if (/fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(message)) {
    lines.push("Çözüm: NEXT_PUBLIC_SUPABASE_URL adresini ve ağ erişimini kontrol edin.");
  }

  return lines.join("\n");
}

export function verifyAuthEnvironment(): void {
  const secret = process.env.SESSION_SECRET?.trim();
  const username = process.env.ADMIN_USERNAME?.trim();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

  if (
    !secret ||
    secret.length < MIN_SESSION_SECRET_LENGTH ||
    !username ||
    !passwordHash
  ) {
    throw new Error(missingAuthEnvMessage());
  }
}

/** Production başlangıcında Supabase bağlantısını doğrular; hata durumunda fırlatır. */
export async function verifySupabaseConnection(): Promise<void> {
  if (!isDatabaseConfigured()) {
    throw new Error(missingEnvMessage());
  }

  verifyAuthEnvironment();

  let supabase;
  try {
    supabase = getSupabase();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(formatQueryError(message));
  }

  const { error } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();

  if (error) {
    throw new Error(formatQueryError(error.message, error.details ?? error.hint));
  }
}

export function shouldRunStartupHealthCheck(): boolean {
  return isProductionRuntime() && process.env.NEXT_RUNTIME !== "edge";
}
