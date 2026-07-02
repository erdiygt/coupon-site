export async function register() {
  const { shouldRunStartupHealthCheck, verifySupabaseConnection } = await import(
    "@/lib/db/health-check"
  );

  if (!shouldRunStartupHealthCheck()) return;

  await verifySupabaseConnection();
}
