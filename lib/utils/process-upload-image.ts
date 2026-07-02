const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export type ProcessedImage = {
  buffer: Buffer;
  contentType: string;
  extension: string;
};

function inferImageType(file: File): { extension: string; contentType: string } {
  const lowerName = file.name.toLowerCase();

  if (file.type === "image/png" || lowerName.endsWith(".png")) {
    return { extension: "png", contentType: "image/png" };
  }
  if (file.type === "image/webp" || lowerName.endsWith(".webp")) {
    return { extension: "webp", contentType: "image/webp" };
  }
  if (
    file.type === "image/jpeg" ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg")
  ) {
    return { extension: "jpg", contentType: "image/jpeg" };
  }

  return { extension: "jpg", contentType: file.type || "image/jpeg" };
}

function assertMaxSize(buffer: Buffer): void {
  if (buffer.length > MAX_SIZE_BYTES) {
    throw new Error("Dosya boyutu 5 MB'ı aşamaz.");
  }
}

async function loadSharp() {
  try {
    const mod = await import("sharp");
    return mod.default;
  } catch {
    return null;
  }
}

async function processWithSharp(input: Buffer): Promise<ProcessedImage> {
  const sharp = await loadSharp();
  if (!sharp) {
    throw new Error("sharp kullanılamıyor.");
  }
  const image = sharp(input, { failOn: "error" });
  const metadata = await image.metadata();

  if (!metadata.format) {
    throw new Error("Geçersiz görsel dosyası.");
  }

  const buffer = await image.rotate().webp({ quality: 85 }).toBuffer();
  assertMaxSize(buffer);

  return {
    buffer,
    contentType: "image/webp",
    extension: "webp",
  };
}

export async function processUploadImage(file: File): Promise<ProcessedImage> {
  const input = Buffer.from(await file.arrayBuffer());
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".ico") || file.type.includes("icon")) {
    assertMaxSize(input);
    return {
      buffer: input,
      contentType: "image/x-icon",
      extension: "ico",
    };
  }

  if (lowerName.endsWith(".gif") || file.type === "image/gif") {
    assertMaxSize(input);
    return {
      buffer: input,
      contentType: "image/gif",
      extension: "gif",
    };
  }

  try {
    return await processWithSharp(input);
  } catch {
    assertMaxSize(input);
    const { extension, contentType } = inferImageType(file);
    return {
      buffer: input,
      contentType,
      extension,
    };
  }
}
