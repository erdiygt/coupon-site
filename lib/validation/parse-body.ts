import { validationErrorResponse } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ data: T } | { error: NextResponse }> {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return {
      error: NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 }),
    };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return {
      error: NextResponse.json(validationErrorResponse(parsed.error), { status: 400 }),
    };
  }

  return { data: parsed.data };
}
