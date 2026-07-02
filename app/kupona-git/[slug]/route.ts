import { NextResponse } from "next/server";
import { redirectNoIndexHeaders } from "@/lib/utils/safe-url";

/** Legacy /kupona-git/{marka}/?kupon={id} — canonical /out/{id} adresine yönlendirir. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const kupon = url.searchParams.get("kupon");
  const couponId = kupon ? Number(kupon) : NaN;

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
