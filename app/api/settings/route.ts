import { writeAuditLog } from "@/lib/admin/audit-log";
import { requireAdminMutation, requireAdminSession } from "@/lib/auth/guards";
import { revalidatePublicData, revalidateSiteSettings } from "@/lib/db/revalidate";
import { getRepository } from "@/lib/db/repository";
import { parseJsonBody } from "@/lib/validation/parse-body";
import { SiteSettingsSchema } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const settings = await getRepository().getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const parsed = await parseJsonBody(request, SiteSettingsSchema);
  if ("error" in parsed) return parsed.error;

  const settings = await getRepository().updateSiteSettings(parsed.data);
  revalidateSiteSettings();
  revalidatePublicData();
  await writeAuditLog({
    request,
    action: "update",
    entity: "site_settings",
    entityId: 1,
  });
  return NextResponse.json(settings);
}
