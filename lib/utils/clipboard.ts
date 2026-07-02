/** Metni panoya kopyalar — click handler içinde çağrılmalı. */
export function copyTextToClipboard(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  try {
    const textarea = document.createElement("textarea");
    textarea.value = trimmed;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (ok) return true;
  } catch {
    // execCommand fallback başarısız
  }

  try {
    void navigator.clipboard.writeText(trimmed);
    return true;
  } catch {
    return false;
  }
}
