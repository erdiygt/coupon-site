import { writeAuditLog } from "@/lib/admin/audit-log";
import { requireAdminMutation, requireAdminSession } from "@/lib/auth/guards";
import { revalidatePublicData } from "@/lib/db/revalidate";
import { getRepository } from "@/lib/db/repository";
import { parseJsonBody } from "@/lib/validation/parse-body";
import { CategoryInputSchema } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const categories = await getRepository().getAllCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const parsed = await parseJsonBody(request, CategoryInputSchema);
  if ("error" in parsed) return parsed.error;

  const category = await getRepository().createCategory(parsed.data);
  revalidatePublicData({ categorySlug: category.slug });
  await writeAuditLog({
    request,
    action: "create",
    entity: "category",
    entityId: category.id,
    metadata: { slug: category.slug },
  });
  return NextResponse.json(category, { status: 201 });
}
