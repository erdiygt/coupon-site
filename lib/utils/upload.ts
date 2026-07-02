export async function uploadAdminImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;

  try {
    response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
  } catch {
    throw new Error(
      "Sunucuya bağlanılamadı. Geliştirme sunucusunun çalıştığından emin olun.",
    );
  }

  let data: { error?: string; url?: string };

  try {
    data = (await response.json()) as { error?: string; url?: string };
  } catch {
    throw new Error("Sunucudan geçersiz yanıt alındı.");
  }

  if (!response.ok) {
    throw new Error(data.error ?? "Görsel yüklenemedi.");
  }

  if (!data.url) {
    throw new Error("Görsel yüklendi ancak URL alınamadı.");
  }

  return data.url;
}
