import { getClientIp } from "@/lib/auth/guards";
import { getSessionCookieName } from "@/lib/auth/config";
import { getUsernameFromSessionToken, verifySessionToken } from "@/lib/auth/session";
import { isSeedFallbackEnabled } from "@/lib/db/data-source";
import { getSupabase } from "@/lib/db/supabase";
import { cookies } from "next/headers";

interface AuditLogInput {
  request: Request;
  action: string;
  entity: string;
  entityId?: string | number;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  const username =
    token && (await verifySessionToken(token))
      ? getUsernameFromSessionToken(token) ?? "unknown"
      : "unknown";

  const entry = {
    username,
    action: input.action,
    entity: input.entity,
    entity_id: input.entityId != null ? String(input.entityId) : null,
    ip: getClientIp(input.request),
    metadata: input.metadata ?? {},
  };

  if (isSeedFallbackEnabled()) {
    console.info("[audit]", entry);
    return;
  }

  try {
    const { error } = await getSupabase().from("audit_logs").insert(entry);
    if (error) {
      console.error("[audit] insert failed:", error.message);
    }
  } catch (error) {
    console.error("[audit] insert failed:", error);
  }
}
