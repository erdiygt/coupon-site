import sanitizeHtml from "sanitize-html";

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

const ALLOWED_URI_REGEXP =
  /^(?:(?:https):|mailto:|tel:|\/uploads\/|\/logo\.png|\/favicon\.png|\/og-default\.png)/i;

function isAllowedUri(value: string): boolean {
  return ALLOWED_URI_REGEXP.test(value.trim());
}

function sanitizeStyleAttribute(value: string): boolean {
  return /^text-align:\s*(left|center|right|justify)\s*;?\s*$/i.test(value.trim());
}

function scrubUriAttributes(
  tagName: string,
  attribs: sanitizeHtml.Attributes,
): sanitizeHtml.Attributes {
  const next = { ...attribs };

  if (tagName === "a" && next.href && !isAllowedUri(next.href)) {
    delete next.href;
  }

  if (tagName === "img" && next.src && !isAllowedUri(next.src)) {
    delete next.src;
  }

  if (next.style && !sanitizeStyleAttribute(next.style)) {
    delete next.style;
  }

  if (next.target === "_blank") {
    next.rel = "noopener noreferrer";
  }

  return next;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: RICH_TEXT_ALLOWED_TAGS,
  allowedAttributes: {
    "*": ["class", "style", "data-align"],
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|center|right|justify)$/i],
    },
  },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: scrubUriAttributes(tagName, attribs),
    }),
    img: (tagName, attribs) => ({
      tagName,
      attribs: scrubUriAttributes(tagName, attribs),
    }),
  },
};

export function sanitizeRichHtml(html: string): string {
  if (!html?.trim()) return "";
  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

export function stripHtml(html: string): string {
  if (!html?.trim()) return "";

  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();
}
