import { writeAuditLog } from "@/lib/admin/audit-log";
import { requireAdminMutation, requireAdminSession } from "@/lib/auth/guards";
import { revalidatePublicData } from "@/lib/db/revalidate";
import { getRepository } from "@/lib/db/repository";
import { parseJsonBody } from "@/lib/validation/parse-body";
import { StoreInputSchema } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const stores = await getRepository().getAllStores();
  return NextResponse.json(stores);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const parsed = await parseJsonBody(request, StoreInputSchema);
  if ("error" in parsed) return parsed.error;

  const store = await getRepository().createStore(parsed.data);
  revalidatePublicData({ storeSlug: store.slug });
  await writeAuditLog({
    request,
    action: "create",
    entity: "store",
    entityId: store.id,
    metadata: { slug: store.slug },
  });
  return NextResponse.json(store, { status: 201 });
}
