import DOMPurify from "isomorphic-dompurify";

const RICH_TEXT_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "blockquote",
  "span",
  "div",
];

const RICH_TEXT_ALLOWED_ATTR = [
  "href",
  "src",
  "alt",
  "title",
  "target",
  "rel",
  "class",
  "data-align",
  "style",
];

const ALLOWED_URI_REGEXP =
  /^(?:(?:https):|mailto:|tel:|\/uploads\/|\/logo\.png|\/favicon\.png|\/og-default\.png)/i;

let hooksRegistered = false;

function sanitizeStyleAttribute(value: string): boolean {
  return /^text-align:\s*(left|center|right|justify)\s*;?\s*$/i.test(value.trim());
}

function ensureSanitizerHooks(): void {
  if (hooksRegistered) return;

  DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName === "style" && !sanitizeStyleAttribute(data.attrValue)) {
      data.keepAttr = false;
    }

    if ((data.attrName === "href" || data.attrName === "src") && data.attrValue) {
      if (!ALLOWED_URI_REGEXP.test(data.attrValue.trim())) {
        data.keepAttr = false;
      }
    }

    if (data.attrName === "target" && data.attrValue === "_blank") {
      data.attrValue = "_blank";
    }
  });

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }
  });

  hooksRegistered = true;
}

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

export function sanitizeRichHtml(html: string): string {
  if (!html?.trim()) return "";

  ensureSanitizerHooks();

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: RICH_TEXT_ALLOWED_TAGS,
    ALLOWED_ATTR: RICH_TEXT_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP,
  });
}

/** Liste önizlemeleri için hafif stripper (jsdom/DOMPurify yükü yok). */
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

export function stripHtml(html: string): string {
  if (!html?.trim()) return "";

  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
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
