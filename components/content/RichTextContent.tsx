import { plainTextToHtml, sanitizeRichHtml } from "@/lib/utils/html";

interface RichTextContentProps {
  content?: string | null;
  className?: string;
}

export default function RichTextContent({ content, className = "" }: RichTextContentProps) {
  if (!content?.trim()) return null;

  const html = sanitizeRichHtml(plainTextToHtml(content));

  return (
    <div
      className={`rich-content ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
