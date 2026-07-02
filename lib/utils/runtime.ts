/** Next.js build/export aşamalarında production seed fallback'e izin verir. */
export function isProductionRuntime(): boolean {
  if (process.env.NEXT_PHASE === "phase-production-build") return false;
  if (process.env.NEXT_PHASE === "phase-export") return false;
  return process.env.NODE_ENV === "production";
}
