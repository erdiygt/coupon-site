"use client";

import { AlignableImage } from "@/lib/tiptap/alignable-image";
import { plainTextToHtml } from "@/lib/utils/html";
import { uploadAdminImage } from "@/lib/utils/upload";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-sm transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-zinc-600 hover:bg-zinc-200 disabled:opacity-40"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-5 w-px bg-zinc-300" />;
}

function AlignIcon({ align }: { align: "left" | "center" | "right" | "justify" }) {
  const bars =
    align === "left"
      ? ["w-3", "w-2.5", "w-3.5"]
      : align === "center"
        ? ["w-2.5 mx-auto", "w-3.5 mx-auto", "w-2.5 mx-auto"]
        : align === "right"
          ? ["w-3 ml-auto", "w-2.5 ml-auto", "w-3.5 ml-auto"]
          : ["w-3.5", "w-3.5", "w-3.5"];

  return (
    <span className="flex w-4 flex-col gap-0.5">
      {bars.map((barClass, index) => (
        <span key={index} className={`block h-0.5 rounded bg-current ${barClass}`} />
      ))}
    </span>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Metninizi yazın…",
  minHeight = "200px",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      AlignableImage.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: plainTextToHtml(value),
    editorProps: {
      attributes: {
        class: "rich-editor-content focus:outline-none",
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      isInternalUpdate.current = true;
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const nextContent = plainTextToHtml(value);
    const currentContent = editor.getHTML();

    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    if (nextContent !== currentContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [editor, value]);

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Bağlantı URL'si", previousUrl ?? "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImageByUrl = () => {
    if (!editor) return;

    const url = window.prompt("Görsel URL'si");
    if (!url?.trim()) return;

    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const uploadImage = async (file: File) => {
    if (!editor) return;

    try {
      const url = await uploadAdminImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Görsel yüklenemedi.");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) {
      void uploadImage(file);
    }
  };

  const setAlignment = (alignment: "left" | "center" | "right" | "justify") => {
    if (!editor) return;
    editor.chain().focus().setTextAlign(alignment).run();
  };

  if (!editor) {
    return (
      <div
        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-muted"
        style={{ minHeight }}
      >
        Editör yükleniyor…
      </div>
    );
  }

  const isImageActive = editor.isActive("image");

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-200 bg-zinc-50 px-2 py-1.5">
        <ToolbarButton
          title="Kalın"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="İtalik"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Altı çizili"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">U</span>
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Başlık 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Başlık 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Madde işaretli liste"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Liste
        </ToolbarButton>
        <ToolbarButton
          title="Numaralı liste"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Liste
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title={isImageActive ? "Görseli sola hizala" : "Metni sola hizala"}
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => setAlignment("left")}
        >
          <AlignIcon align="left" />
        </ToolbarButton>
        <ToolbarButton
          title={isImageActive ? "Görseli ortala" : "Metni ortala"}
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => setAlignment("center")}
        >
          <AlignIcon align="center" />
        </ToolbarButton>
        <ToolbarButton
          title={isImageActive ? "Görseli sağa hizala" : "Metni sağa hizala"}
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => setAlignment("right")}
        >
          <AlignIcon align="right" />
        </ToolbarButton>
        {!isImageActive && (
          <ToolbarButton
            title="Metni iki yana yasla"
            active={editor.isActive({ textAlign: "justify" })}
            onClick={() => setAlignment("justify")}
          >
            <AlignIcon align="justify" />
          </ToolbarButton>
        )}

        <ToolbarDivider />

        <ToolbarButton title="Bağlantı ekle" active={editor.isActive("link")} onClick={setLink}>
          🔗
        </ToolbarButton>
        <ToolbarButton title="Görsel URL ekle" onClick={addImageByUrl}>
          🖼
        </ToolbarButton>
        <ToolbarButton title="Görsel yükle" onClick={() => fileInputRef.current?.click()}>
          ⬆ Görsel
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Geri al"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          title="Yinele"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </ToolbarButton>
      </div>

      {isImageActive && (
        <p className="border-b border-zinc-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
          Görsel seçili — hizalama butonları ile görseli sola, ortaya veya sağa alabilirsiniz.
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleImageUpload}
      />

      <EditorContent editor={editor} className="px-3 py-2" />
    </div>
  );
}
