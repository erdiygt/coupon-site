export function isHtmlContent(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function plainTextToHtml(text: string): string {
  if (!text?.trim()) return "";

  if (isHtmlContent(text)) {
    return text;
  }

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

/** Liste önizlemeleri için hafif stripper (DOM bağımlılığı yok). */
export function stripHtmlPreview(html: string): string {
  if (!html?.trim()) return "";

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function toMetaDescription(html: string, maxLength = 160): string {
  const plain = stripHtmlPreview(html);
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 1).trim()}…`;
}

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export { sanitizeRichHtml, stripHtml } from "@/lib/utils/sanitize-rich-html";
