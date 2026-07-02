import { requireAdminMutation } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/admin/audit-log";
import { assertSupabaseInProduction } from "@/lib/db/data-source";
import { getStoragePublicUrl, getSupabase, isDatabaseConfigured } from "@/lib/db/supabase";
import { processUploadImage } from "@/lib/utils/process-upload-image";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

async function uploadToLocal(buffer: Buffer, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

async function uploadToSupabase(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  const { error } = await getSupabase()
    .storage.from("uploads")
    .upload(filename, buffer, {
      contentType,
      upsert: false,
    });

  if (error) throw error;
  return getStoragePublicUrl(filename);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya gerekli." }, { status: 400 });
  }

  try {
    const processed = await processUploadImage(file);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${processed.extension}`;

    assertSupabaseInProduction();

    const url = isDatabaseConfigured()
      ? await uploadToSupabase(processed.buffer, filename, processed.contentType)
      : await uploadToLocal(processed.buffer, filename);

    await writeAuditLog({
      request,
      action: "upload",
      entity: "file",
      metadata: { url, filename },
    });

    return NextResponse.json({ url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Dosya yüklenemedi.";
    const status = message.includes("Production ortamında") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
