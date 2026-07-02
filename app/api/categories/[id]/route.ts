import { writeAuditLog } from "@/lib/admin/audit-log";
import { requireAdminMutation, requireAdminSession } from "@/lib/auth/guards";
import { revalidatePublicData } from "@/lib/db/revalidate";
import { getRepository } from "@/lib/db/repository";
import { parseJsonBody } from "@/lib/validation/parse-body";
import { CategoryUpdateSchema } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const category = await getRepository().getCategoryById(Number(id));

  if (!category) {
    return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const parsed = await parseJsonBody(request, CategoryUpdateSchema);
  if ("error" in parsed) return parsed.error;

  const category = await getRepository().updateCategory(Number(id), parsed.data);

  if (!category) {
    return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
  }

  revalidatePublicData({ categorySlug: category.slug });
  await writeAuditLog({
    request,
    action: "update",
    entity: "category",
    entityId: category.id,
    metadata: { slug: category.slug },
  });
  return NextResponse.json(category);
}

export async function DELETE(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const categoryId = Number(id);
  const existing = await getRepository().getCategoryById(categoryId);
  const deleted = await getRepository().deleteCategory(categoryId);

  if (!deleted) {
    return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
  }

  revalidatePublicData({ categorySlug: existing?.slug });
  await writeAuditLog({
    request,
    action: "delete",
    entity: "category",
    entityId: categoryId,
    metadata: { slug: existing?.slug },
  });
  return NextResponse.json({ success: true });
}
