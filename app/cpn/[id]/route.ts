import { NextResponse } from "next/server";
import { redirectNoIndexHeaders } from "@/lib/utils/safe-url";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** Legacy /cpn/{id}/ — canonical /out/{id} adresine yönlendirir. */
export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const couponId = Number(id);

  if (!Number.isFinite(couponId)) {
    return NextResponse.redirect(new URL("/", request.url), {
      headers: redirectNoIndexHeaders(),
    });
  }

  return NextResponse.redirect(new URL(`/out/${couponId}`, request.url), {
    status: 301,
    headers: redirectNoIndexHeaders(),
  });
}
