import { writeAuditLog } from "@/lib/admin/audit-log";
import { requireAdminMutation, requireAdminSession } from "@/lib/auth/guards";
import { revalidatePublicData } from "@/lib/db/revalidate";
import { getRepository } from "@/lib/db/repository";
import { parseJsonBody } from "@/lib/validation/parse-body";
import { StoreUpdateSchema } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const store = await getRepository().getStoreById(Number(id));

  if (!store) {
    return NextResponse.json({ error: "Mağaza bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(store);
}

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const parsed = await parseJsonBody(request, StoreUpdateSchema);
  if ("error" in parsed) return parsed.error;

  const store = await getRepository().updateStore(Number(id), parsed.data);

  if (!store) {
    return NextResponse.json({ error: "Mağaza bulunamadı" }, { status: 404 });
  }

  revalidatePublicData({ storeSlug: store.slug });
  await writeAuditLog({
    request,
    action: "update",
    entity: "store",
    entityId: store.id,
    metadata: { slug: store.slug },
  });
  return NextResponse.json(store);
}

export async function DELETE(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const storeId = Number(id);
  const existing = await getRepository().getStoreById(storeId);
  const deleted = await getRepository().deleteStore(storeId);

  if (!deleted) {
    return NextResponse.json({ error: "Mağaza bulunamadı" }, { status: 404 });
  }

  revalidatePublicData({ storeSlug: existing?.slug });
  await writeAuditLog({
    request,
    action: "delete",
    entity: "store",
    entityId: storeId,
    metadata: { slug: existing?.slug },
  });
  return NextResponse.json({ success: true });
}
